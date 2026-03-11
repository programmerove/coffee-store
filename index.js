const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://coffee:01718011164Oo@cluster0.hlnfinv.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    // create coffee collection and its routes
    // create coffee collection
    const coffeeCollection = client
      .db("coffeeDB")       // database name
      .collection("coffees"); // collection name

   

    // GET route of coffee to show the sent data of mongodb

    app.get('/coffees',async(req, res)=>{
      const result = await coffeeCollection.find().toArray();
      res.send(result);
    })

    // GET route for showing a specific id 

    app.get('/coffees/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await coffeeCollection.findOne(query);
        res.send(result);
    })



    // POST route of coffee for sending data to mongodb
    app.post('/coffees', async (req, res) => {
      const newCoffee = req.body;

      const result = await coffeeCollection.insertOne(newCoffee);

      res.json({
        success: true,
        insertedId: result.insertedId,
      });
    });

    // PUT route for update coffee,

    app.put('/coffees/:id', async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert:true};
      const updatedCoffee= req.body;
      const updatedDoc ={
        $set: updatedCoffee
      }
      
      const result = await coffeeCollection.updateOne(filter, updatedDoc,options);
      res.send(result);
    })



    // Delete route for deleting an item from database

    app.delete('/coffees/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);

    })

    // create user collection and its routes
    
     const userCollection = client
      .db("coffeeDB")
      .collection("users");
    // user related api

    app.get('/users', async(req,res)=>{
      const result = await userCollection.find().toArray();
      res.send(result);
    })

     app.post('/users', async(req,res)=>{
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
     })


     app.patch('/users', async(req,res)=>{
        const {email, lastSignInTime} = req.body;
        const filter = {email: email};
        const updateDoc = {
          $set: {
            lastSignInTime: lastSignInTime
          }
        }
        const result = await userCollection.updateOne(filter, updateDoc);
        res.send(result);
     })

     app.delete('/users/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await userCollection.deleteOne(query);
      res.send(result);

    })







    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
}

run();

app.get('/', (req, res) => {
  res.send('Coffee Server is running');
});

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
