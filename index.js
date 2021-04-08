const express = require('express')
const app = express()
const cors=require('cors')
const ObjectId=require('mongodb').ObjectID
const bodyparser=require('body-parser')
require('dotenv').config();
const port =process.env.PORT || 5000


app.use(cors())
app.use(express.json())
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hj3kx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
app.get('/', (req, res) => {
  res.send('Hello World!')
})


const MongoClient = require('mongodb').MongoClient;
const { ObjectID } = require('bson')

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("Evaly").collection("evalyproduct");
  const bookingcollection = client.db("Evaly").collection("bookingproduct");
  
  app.post('/addevent',(req,res)=>{
    const newevent=req.body;
    console.log("adding new eventg",newevent)
    collection.insertOne(newevent)
    .then(result=>{
      console.log("inserted count",result.insertedCount)
      res.send(result.insertedCount>0)
    })
})

app.get('/showdata',(req,res)=>{
    collection.find()
    .toArray((err,items)=>{
      res.send(items)
    })
  })

app.get('/singleproduct/:id',(req,res)=>{
  collection.find({_id: ObjectID(req.params.id)})
  .toArray((err,items)=>{
    res.send(items[0])
  })
})  

app.get('/booking/:email',(req,res)=>{
  bookingcollection.find({email: req.params.email})
  .toArray((err,document)=>{
    res.send(document)
   //console.log(document)
  })
})

app.post('/bookingdetails',(req,res)=>{
    const newbooking=req.body;
    bookingcollection.insertOne(newbooking)
    .then(result=>{
      res.send(result.insertedCount>0)
    })
})

app.delete('/delete/:id',(req,res)=>{
    //console.log(req.params.id)
    collection.deleteOne({_id: ObjectID(req.params.id)})
    .then(result=>{
       console.log(result)
       res.redirect('/')
    })
})
 
});

app.listen(port)