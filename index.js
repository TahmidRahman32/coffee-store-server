const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gv1gxa1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      const database = client.db("coffeeDB");
      const coffeeCollection = database.collection("storeUser");
      const userCollection = client.db('coffeeDB').collection('user')

      app.get("/addCoffee", async (req, res) => {
         const courser = coffeeCollection.find();
         const result = await courser.toArray();
         res.send(result);
      });

      app.get("/addCoffee/:id", async (req, res) => {
         const id = req.params.id;
         const query = { _id: new ObjectId(id) };
         const result = await coffeeCollection.findOne(query);
         res.send(result);
      });
      app.put("/addCoffee/:id", async (req, res) => {
         const id = req.params.id;
         const filter = { _id: new ObjectId(id) };
         const options = { upsert: true };
         const updateCoffee = req.body;
         const coffee = {
            $set: {
               url: updateCoffee.url,
               name: updateCoffee.name,
               chef: updateCoffee.chef,
               supplier: updateCoffee.supplier,
               category: updateCoffee.category,
               taste: updateCoffee.taste,
               details: updateCoffee.details,
            },
         };
         const result = await coffeeCollection.updateOne(filter, coffee,options);
         res.send(result)
      });

      app.post("/addCoffee", async (req, res) => {
         const addCoffee = req.body;
         console.log(addCoffee);
         const result = await coffeeCollection.insertOne(addCoffee);
         res.send(result);
      });

      app.delete("/addCoffee/:id", async (req, res) => {
         const id = req.params.id;
         const query = { _id: new ObjectId(id) };
         const result = await coffeeCollection.deleteOne(query);
         res.send(result);
      });

      app.post('/user', async(req, res) =>{
         const user = req.body;
         const result = await userCollection.insertOne(user);
         res.send(result);
      })

      app.get('/user', async(req,res)=>{
         const cursor = userCollection.find();
         const result = await cursor.toArray();
         res.send(result);
      })

      app.delete('/user/:id',async (req, res) =>{
         const id = req.params.id;
         const query = {_id: new ObjectId(id)};
         const result = await userCollection.deleteOne(query);
         res.send(result);
      })
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
   } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
   }
}
run().catch(console.log);

app.get("/", (req, res) => {
   res.send("Coffee Store server is running");
});
app.listen(port, () => {
   console.log(`Coffee Store server port is running ${port}`);
});
