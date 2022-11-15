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

const uri = `mongodb+srv://doctorsPortalDbUser:${process.env.DB_PASSWORD}@cluster0.7pbomn6.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
client.connect((err) => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

// MongoDB ends

app.get("/", (req, res) => {
  res.send("Doctors portal is running...");
});

app.listen(port, () => {
  console.log(`Server running on : ${port}`);
});
