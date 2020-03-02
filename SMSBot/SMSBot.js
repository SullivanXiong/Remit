const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
var bodyParser = require('body-parser');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })) 

// parse application/json
app.use(bodyParser.json())

app.post('/transactionDetails', (req, res) => {
    let sender = req.body.sender;
    let receiver = req.body.receiver;
    let amount = req.body.amount;
    let currency = req.body.currency;
    console.log(`sender: ${sender}, receiver: ${receiver}, amount: ${amount}, currency: ${currency}`);
    res.send(200);
})

http.createServer(app).listen(1337, () => {
    console.log('Express server listening on port 1337');
});
