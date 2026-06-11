const express = require("express");
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("studynook").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );

    const db = client.db("studynook");

    const roomCollection = db.collection("rooms");

    app.get("/api/rooms/featured", async (req, res) => {
      const rooms = await roomCollection
        .find()
        .sort({ createdAt: -1 })
        .limit(6)
        .toArray();
      res.send(rooms);
    });

    app.get(`/api/rooms/:id`, async(req, res)=>{
      const {id}=req.params
      const result=await roomCollection.findOne({_id: new ObjectId(id)})
      res.send(result)
    })
    app.get("/api/rooms", async (req, res) => {
      const result = await roomCollection.find().toArray();
      res.send(result);
    });

    app.post("/api/rooms/add", async (req, res) => {
      const roomData = req.body;
      const result = await roomCollection.insertOne(roomData);
      res.send(result);
      console.log(roomData);
    });

    
    
    app.patch("/api/rooms/:id",async(req, res)=>{
      const {id}=req.params
      const updatedData=req.body
      const result=await roomCollection.updateOne({_id: new ObjectId(id)}, {$set:updatedData})
      res.send(result)
    })

    app.get("/api/rooms/user/:userId", async(req, res)=>{
      const {userId}=req.params
      const result=await roomCollection.find({owner:userId}).toArray()
      res.send(result)
    })

    app.delete("/api/rooms/:id", async(req,res)=>{
      const {id}=req.params
      const result=await roomCollection.deleteOne({_id: new ObjectId(id)})
      res.send(result)

    })

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("This is studyNook server");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
