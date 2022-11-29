const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const stripe = require("stripe")(process.env.STRIPE_SK);

const port = process.env.PORT || 5000;

const app = express();

// middle ware
app.use(cors());
app.use(express.json());

// MongoDB starts
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.7pbomn6.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

function sendBookingEmail(booking) {
  const { email, treatment, appointmentDate, slot } = booking;

  /*
    // SendGrid
    let transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    auth: {
      user: "apikey",
      pass: process.env.SENDGRID_API_KEY,
    },
  }); */

  // This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
  const auth = {
    auth: {
      api_key: process.env.SEND_EMAIL_KEY,
      domain: process.env.SEND_EMAIL_DOMAIN,
    },
  };

  const transporter = nodemailer.createTransport(mg(auth));

  transporter.sendMail(
    {
      from: "morshed952640@gmail.com", // verified sender email
      to: email, // recipient email
      subject: `Your appointment for ${treatment} is Confirmed.`, // Subject line
      text: "Hello world!", // plain text body
      html: `
      <h3>Your appointment ${treatment} is confirmed</h3>
      <div>
        <p>Your appointment for treatment: ${treatment}</p>
        <p>Please visit us on ${appointmentDate} at ${slot}</p>
        <p>Thanks from Doctors Portal</p>
      </div>

      `, // html body
    },
    function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    }
  );
}

// verify jwt token
function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send("unAuthorized access");
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: "forbidden access" });
    }

    req.decoded = decoded;
    next();
  });
}

async function run() {
  try {
    // Appointment collection
    const appointmentOptionsCollection = client
      .db("doctorsPortal")
      .collection("appointmentOptions");

    // Booking collection
    const bookingsCollection = client
      .db("doctorsPortal")
      .collection("bookings");

    // Users collection
    const usersCollection = client.db("doctorsPortal").collection("users");

    // Doctors collection
    const doctorsCollection = client.db("doctorsPortal").collection("doctors");

    // Payment collection
    const paymentsCollection = client
      .db("doctorsPortal")
      .collection("payments");

    // verify admin
    // make sure you use verifyAdmin after verifyJwt
    const verifyAdmin = async (req, res, next) => {
      const decodedEmail = req.decoded.email;
      const query = { email: decodedEmail };
      const user = await usersCollection.findOne(query);

      if (user?.role !== "admin") {
        return res.status(403).send({ message: "Forbidden access" });
      }
      next();
    };

    /**
     * API Naming Convention
     * app.get('/bookings')
     * app.get('/bookings/:id')
     * app.post('/bookings')
     * app.delete('/bookings/:id')
     * app.patch('/bookings/:id')
     * app.put('/bookings/:id')
     */

    // all appointment options with remaining slots
    // use aggregate to query multiple collection and then merge data
    app.get("/appointmentOptions", async (req, res) => {
      const date = req.query.date;

      const query = {};
      const appointmentOptions = await appointmentOptionsCollection
        .find(query)
        .toArray();

      // get the bookings of the provided date
      const bookingQuery = { appointmentDate: date };
      const alreadyBooked = await bookingsCollection
        .find(bookingQuery)
        .toArray();

      // code carefully :D
      appointmentOptions.forEach((option) => {
        const optionBooked = alreadyBooked.filter(
          (book) => book.treatment === option.name
        );
        console.log(optionBooked);
        const bookedSlots = optionBooked.map((book) => book.slot);
        const remainingSlots = option.slots.filter(
          (slot) => !bookedSlots.includes(slot)
        );
        option.slots = remainingSlots;
        // console.log(date, option.name, remainingSlots.length);
      });

      res.send(appointmentOptions);
    });

    // booking request from user
    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const query = {
        appointmentDate: booking.appointmentDate,
        email: booking.email,
        treatment: booking.treatment,
      };

      const alreadyBooked = await bookingsCollection.find(query).toArray();
      // console.log("already booked", alreadyBooked);
      if (alreadyBooked.length) {
        const message = `You already have a booked for ${booking.treatment} on ${booking.appointmentDate}`;
        return res.send({ acknowledged: false, message });
      }

      const result = await bookingsCollection.insertOne(booking);
      // send email about appointment confirmation
      sendBookingEmail(booking);
      res.send(result);
    });

    // User bookings dashboard
    app.get("/bookings", verifyJWT, async (req, res) => {
      const date = req.query.date;
      const email = req.query.email;

      const decodedEmail = req.decoded.email;

      if (email !== decodedEmail) {
        return res.status(403).send({ message: "forbidden access" });
      }

      const query = { appointmentDate: date, email: email };
      const bookings = await bookingsCollection.find(query).toArray();
      res.send(bookings);
    });

    // specific booking by id
    app.get("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingsCollection.findOne(query);
      res.send(result);
    });

    // save user to the database
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // get all users
    app.get("/users", async (req, res) => {
      const query = {};
      const users = await usersCollection.find(query).toArray();
      res.send(users);
    });

    // admin verify
    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      res.send({ isAdmin: user?.role === "admin" });
    });

    // make admin role
    app.put("/users/admin/:id", verifyJWT, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          role: "admin",
        },
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    // create jwt token
    app.get("/jwt", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);

      if (user) {
        const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, {
          expiresIn: "1d",
        });
        return res.send({ accessToken: token });
      }
      res.status(403).send({ accessToken: "" });
    });

    // appointment name specific (project)
    app.get("/appointmentSpecialty", async (req, res) => {
      const query = {};
      const result = await appointmentOptionsCollection
        .find(query)
        .project({ name: 1 })
        .toArray();
      res.send(result);
    });

    // add a doctor
    app.post("/doctors", verifyJWT, async (req, res) => {
      const doctor = req.body;
      const result = await doctorsCollection.insertOne(doctor);
      res.send(result);
    });

    // get doctors
    app.get("/doctors", verifyJWT, async (req, res) => {
      const query = {};
      const doctors = await doctorsCollection.find(query).toArray();
      res.send(doctors);
    });

    // DELETE DOCTOR
    app.delete("/doctors/:id", verifyJWT, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await doctorsCollection.deleteOne(query);
      res.send(result);
    });

    /* 
    // add price
    // temporary to update price field on appointment options
    app.get("/addPrice", async (req, res) => {
      const filter = {};
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          price: 99,
        },
      };
      const result = await appointmentOptionsCollection.updateMany(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    }); */

    // STRIPE PAYMENT METHOD
    app.post("/create-payment-intent", async (req, res) => {
      const booking = req.body;
      const price = booking.price;
      const amount = price * 100;
      const paymentIntent = await stripe.paymentIntents.create({
        currency: "usd",
        amount: amount,
        payment_method_types: ["card"],
      });
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });

    // save payment info to the database
    app.post("/payments", async (req, res) => {
      const payment = req.body;
      const result = await paymentsCollection.insertOne(payment);

      const id = payment.bookingId;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          paid: true,
          transactionId: payment.transactionId,
        },
      };
      const updateBooking = await bookingsCollection.updateOne(
        filter,
        updateDoc
      );
      res.send(result);
    });

    // Advanced (optional)
    app.get("/v2/appointmentOptions", async (req, res) => {
      const date = req.query.date;
      const appointmentOptions = await appointmentOptionsCollection
        .aggregate([
          {
            $lookup: {
              from: "bookings",
              localField: "name",
              foreignField: "treatment",
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$appointmentDate", date],
                    },
                  },
                },
              ],
              as: "booked",
            },
          },
          {
            $project: {
              name: 1,
              price: 1,
              slots: 1,
              booked: {
                $map: {
                  input: "$booked",
                  as: "book",
                  in: "$$book.slot",
                },
              },
            },
          },
          {
            $project: {
              name: 1,
              price: 1,
              slots: {
                $setDifference: ["$slots", "$booked"],
              },
            },
          },
        ])
        .toArray();
      res.send(appointmentOptions);
    });

    // try ends
  } catch (error) {
    console.log(error);
  } finally {
  }
}

run().catch(console.dir);

// MongoDB ends

app.get("/", (req, res) => {
  res.send("Doctors portal is running...");
});

app.listen(port, () => {
  console.log(`Server running on : ${port}`);
});
