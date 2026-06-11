const express = require("express");
const cors = require("cors");
  
const dotenv = require("dotenv");
dotenv.config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const PORT = process.env.PORT || 5000;

const uri = process.env.MONGODB_URI;

app.use(cors());  
app.use(express.json());      

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});



app.get("/", (req, res) => {
  res.send("This is studyNook server");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
