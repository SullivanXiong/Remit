const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const app = express();

/*
app.get('/sms', (req, res) => {
    const twiml = new MessagingResponse();

    if (previousMessage == '' || previousMessage == 'Hello, please type \'send\' OR \'create account\'') {
        twiml.message('Hello, please type \'send\' OR \'create account\'');
    }
    else if (previousMessage == '') {

    }

    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
});

app.post('/sms', (req, res) => {
    const twiml = new MessagingResponse();

    twiml.message('test');

    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
});*/

app.post('/transactionDetails', (req, res) => {

})

http.createServer(app).listen(1337, () => {
    console.log('Express server listening on port 1337');
});
