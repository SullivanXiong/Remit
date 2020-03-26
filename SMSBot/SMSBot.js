const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const twilio = require('twilio');
const { Wallet, XpringClient } = require("xpring-js");
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const accountSid = 'AC1372d1ae9d18b93ce957acd2b8ca0e8d';
const authToken = '1db3e2208d420d2c4d7215353c464e06';
const client = require('twilio')(accountSid, authToken);

const remoteURL = "test.xrp.xpring.io:50051";
const xpringClient = new XpringClient(remoteURL, true);

const app = express();

mongoose.connect('mongodb+srv://suxiong:asdfghjkl@cluster0-a1g8y.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Successfully connected to mongoose.');
    });

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })) 

// parse application/json
app.use(bodyParser.json())

// read location.json
let rawUsersFile = fs.readFileSync('./users.json', (err) => {
    if (err)
        return console.log(err);
});
let usersFile = JSON.parse(rawUsersFile);

let MessageSchema = new mongoose.Schema({
    phoneNumber: String,
    mode: String,
    sender: String,
    receiver: String,
    amount: Number,
    currency: String,
    password: String
});

let Message = mongoose.model('Message', MessageSchema);

// header information for requests
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const Sulli = {
    mnemonic: "exhaust pill nice avocado joke birth salad pudding vacuum act ask legal",
    derivationPath: "m/44'/144'/0'/0/0"
}

const Ed = {
    mnemonic: "gasp search pioneer design latin inflict steak shell choice jaguar blanket scare",
    derivationPath: "m/44'/144'/0'/0/0"
}

app.post('/inbound', (req, res) => {
    let from = req.body.From;
    let to = req.body.To;
    let body = req.body.Body;
    
    Message.find({phoneNumber: req.body.From}, (err, message) => {
        console.log(message);

        res.end();

        if (message.length !== 0) {
            // continue conversation
            if (!message[0].mode) {
                if (body.toLowerCase() === "send") {
                    Message.findByIdAndUpdate(message[0]._id, {"$set": {"mode": body.toLowerCase()}}, {"new": true, "upsert": true}, () => {
                        client.messages
                        .create({
                            body: 'Enter your remit nickname',
                            from: `${to}`,
                            to: `${from}`
                        })
                        .then(message => console.log(`from: ${to}, to: ${from}, message is: \"Enter your remit nickname\"`));
                    });
                }
                else if (body.toLowerCase() === "create account") {
                    Message.findByIdAndUpdate(message[0]._id, {"$set": {"mode": body.toLowerCase()}}, {"new": true, "upsert": true}, () => {
                        client.messages
                        .create({
                            body: 'Create your new remit nickname',
                            from: `${to}`,
                            to: `${from}`
                        })
                        .then(message => console.log(`from: ${to}, to: ${from}, message is: \"Create your new remit nickname\"`));
                    });
                }
                else {
                    client.messages
                        .create({
                            body: 'please type \"send\" OR \"create account\"',
                            from: `${to}`,
                            to: `${from}`
                        })
                        .then(message => console.log(`from: ${to}, to: ${from}, message is: \"please type \"send\" OR \"create account\"\"`));
                }
            }
            else if (message[0].mode == 'send' && !message[0].sender && !message[0].receiver && !message[0].amount && !message[0].currency && !message[0].password) {
                Message.findByIdAndUpdate(message[0]._id, {"$set": {"sender": body.toLowerCase()}}, {"new": true, "upsert": true}, () => {
                    client.messages
                    .create({
                        body: 'Enter receiver\'s remit nickname',
                        from: `${to}`,
                        to: `${from}`
                    })
                    .then(message => console.log(`from: ${to}, to: ${from}, message is: \"Enter receiver\'s remit nickname\"`));
                });
            }
            else if (message[0].mode == 'send' && !message[0].receiver && !message[0].amount && !message[0].currency && !message[0].password) {
                Message.findByIdAndUpdate(message[0]._id, {"$set": {"receiver": body}}, {"new": true, "upsert": true}, () => {
                    client.messages
                    .create({
                        body: 'Choose your currency type',
                        from: `${to}`,
                        to: `${from}`
                    })
                    .then(message => console.log(`from: ${to}, to: ${from}, message is: \"Choose your currency type\"`));
                });
            }
            else if (message[0].mode == 'send' && !message[0].amount && !message[0].currency && !message[0].password) {
                Message.findByIdAndUpdate(message[0]._id, {"$set": {"currency": body}}, {"new": true, "upsert": true}, () => {
                    client.messages
                    .create({
                        body: 'Enter Amount',
                        from: `${to}`,
                        to: `${from}`
                    })
                    .then(message => console.log(`from: ${to}, to: ${from}, message is: \"Enter Amount\"`));
                });
            }
            else if (message[0].mode == 'send' && !message[0].amount && !message[0].password) {
                Message.findByIdAndUpdate(message[0]._id, {"$set": {"amount": body}}, {"new": true, "upsert": true}, () => {
                    client.messages
                    .create({
                        body: 'Enter your remit password',
                        from: `${to}`,
                        to: `${from}`
                    })
                    .then(message => console.log(`from: ${to}, to: ${from}, message is: \"Enter your remit password\"`));
                });
            }
            else if (message[0].mode == 'send' && !message[0].password) {
                Message.findByIdAndDelete(message[0]._id, () => {
                    client.messages
                    .create({
                        body: 'Transaction complete',
                        from: `${to}`,
                        to: `${from}`
                    })
                    .then(message => console.log(`from: ${to}, to: ${from}, message is: \"Transaction complete\"`))
                });
            }
            else if (message[0].mode == 'create account' && !message[0].sender && !message[0].password) {
                Message.findByIdAndUpdate(message[0]._id, {"$set": {"sender": body.toLowerCase()}}, {"new": true, "upsert": true}, () => {
                    client.messages
                    .create({
                        body: 'Set your password',
                        from: `${to}`,
                        to: `${from}`
                    })
                    .then(message => console.log(`from: ${to}, to: ${from}, message is: \"Set your password\"`));
                });   
            }
            else if (message[0].mode == 'create account' && !message[0].password) {
                const sender = message[0].sender;
                const password = body;

                Message.findByIdAndDelete(message[0]._id, () => {
                    client.messages
                    .create({
                        body: 'Remit account created successfully',
                        from: `${to}`,
                        to: `${from}`
                    })
                    .then(message => console.log(`from: ${to}, to: ${from}, message is: \"Remit account created successfully\"`))    
                });

                const generationResult = Wallet.generateRandomWallet();

                const newUserData = {
                    password: password,
                    mnemonic: generationResult.mnemonic,
                    derivationPath: generationResult.derivationPath,
                    walletAddress: generationResult.wallet.getAddress()
                };
            
                usersFile.users[sender] = newUserData;
                fs.writeFile('./users.json', JSON.stringify(usersFile, null, 2), (err, data) => {
                    if (err)
                        return res.send(err);
                    console.log('Successfully registered new Remit user.');
                });
            }

            res.end();
        }
        else {
            let newMessage = new Message();

            newMessage.phoneNumber = from;

            newMessage.save(() => {
                client.messages
                    .create({
                        body: 'Hello, please type \"send\" OR \"create account\"',
                        from: `${to}`,
                        to: `${from}`
                    })
                    .then(message => console.log(`from: ${to}, to: ${from}, message is: \"Hello, please type \"send\" OR \"create account\"\"`));

                res.end();
            });
        }
        
        res.end();
    });
});

async function send(amount, receiverAddress, senderWallet, receiverWallet) {
    console.log(BigInt(amount));
    const transactionHash = await xpringClient.send(BigInt(amount), receiverAddress, senderWallet)
        .then(() => {
            console.log('Transaction complete...');
            checkBalance(senderWallet);
            checkBalance(receiverWallet);
        })
        .catch((err) => console.log(err));
    ;
}

async function checkBalance(wallet) {
    console.log(wallet.getAddress());
    const balance = await xpringClient.getBalance(wallet.getAddress())
        .then((balance) => console.log(`balance is: ${balance}`))
        .catch((err) => console.log(err));
}

app.get('/', (req, res) => {
    res.end();
});

http.createServer(app).listen(1337, () => {
    console.log(`Express server listening on 1337.`);
});
