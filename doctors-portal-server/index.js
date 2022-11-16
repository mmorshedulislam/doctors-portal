const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
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

async function run() {
  try {
    const appointmentOptionsCollection = client
      .db("doctorsPortal")
      .collection("appointmentOptions");

    const bookingsCollection = client
      .db("doctorsPortal")
      .collection("bookings");

    /**
     * API Naming Convention
     * app.get('/bookings')
     * app.get('/bookings/:id')
     * app.post('/bookings')
     * app.delete('/bookings/:id')
     * app.patch('/bookings/:id')
     * app.put('/bookings/:id')
     */

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
        const bookedSlots = optionBooked.map((book) => book.slot);
        const remainingSlots = option.slots.filter(
          (slot) => !bookedSlots.includes(slot)
        );
        option.slots = remainingSlots;
        console.log(date, option.name, remainingSlots.length);
      });

      res.send(appointmentOptions);
    });

    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const result = await bookingsCollection.insertOne(booking);
      res.send(result);
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
