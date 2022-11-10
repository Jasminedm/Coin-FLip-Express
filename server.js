const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

const url = "mongodb+srv://jasminedm:jdmmongodb@cluster0.0xxrpxp.mongodb.net/coinFlip?retryWrites=true&w=majority";
const dbName = "coinFlip";

app.listen(3000, () => {
  MongoClient.connect(url, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('dbName')

    app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('yourFlip').find().toArray((err, allDocs) => {
    if (err) return console.log(err)
    res.render('index.ejs', {flipR: allDocs})
  })
})

app.post('/yourFlip', (req, res) => {
  let randomFlip = Math.ceil(Math.random() * 2);
  let botResult; 
  let userInput= req.body.userFlip.toLowerCase()

  if(userInput == 'heads' || userInput == 'tails'){
  if(randomFlip <= 1){
    botResult = 'heads'
  }else if(randomFlip <= 2){
    botResult = 'tails'
  }

  let outcome;
  if(botResult === req.body.userFlip){
    outcome = 'You Win!'
  }else {
    outcome = 'You Lose!'
  }

  db.collection('yourFlip').insertOne(
    {userFlip:`You Chose ${req.body.userFlip}`, result: `The Coin Landed On ${botResult}`, winOrLose: outcome}, 
    (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
     res.redirect('/')
  })
}
})

app.put('/yourFlip', (req, res) => {
  db.collection('yourFlip').findOneAndUpdate(
    {userFlip: req.body.userFlip, result: botResult, winOrLose: outcome}, {
    
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
 })

app.delete('/yourFlip', (req, res) => {
  console.log(req.body)
  db.collection('yourFlip').findOneAndDelete(
    {userFlip: req.body.userFlip, result: req.body.result, winOrLose: req.body.winOrLose}, 
    (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
  })
});

app.set('view engine', 'ejs')

