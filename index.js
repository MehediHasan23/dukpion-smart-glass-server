const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mil2w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    console.log('database connected');

    const database = client.db('oculus_shop')
    const glassCollection = database.collection('products')
    const usersCollection = database.collection('users')
    const ordersCollection = database.collection('orders')
    
    app.get('/products', async (req, res) => {
      const cursor = glassCollection.find({})
      const products = await cursor.toArray()
      res.send(products)
    })

    //save user 
    app.post('/users', async (req, res) => {
      const user = req.body
      console.log(user);
      const result = await usersCollection.insertOne(user)
      res.json(result)
    })

    // order api
    app.post('/orders', async(req, res) => {
      const orders = req.body
      console.log(orders);
      const result = await ordersCollection.insertOne(orders)
      res.json(result)
    })
    
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello form oculus");
});

app.listen(port, () => {
  console.log("port is running on", port);
});
