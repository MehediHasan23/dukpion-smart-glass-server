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
    
    app.get('/products', async (req, res) => {
      const cursor = glassCollection.find({})
      const products = await cursor.toArray()
      res.send(products)
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
