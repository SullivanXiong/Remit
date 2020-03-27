const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const twilio = require('twilio');
const { Wallet, XpringClient } = require("xpring-js");
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const twilioAuth = require('./TwilioAuth.json');
const client = require('twilio')(twilioAuth.accountSid, twilioAuth.authToken);

const remoteURL = "test.xrp.xpring.io:50051";
const xpringClient = new XpringClient(remoteURL, true);

const app = express();

mongoose.connect('mongodb+srv://suxiong:asdfghjkl@cluster0-a1g8y.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Successfully connected to mongoose.'))
    .catch((err) => console.log(err));

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
                else if (body.toLowerCase() === "check balance") {
                    Message.findByIdAndUpdate(message[0]._id, {"$set": {"mode": body.toLowerCase()}}, {"new": true, "upsert": true}, () => {
                        client.messages
                        .create({
                            body: 'Enter your remit nickname',
                            from: `${to}`,
                            to: `${from}`
                        })
                        .then(message => console.log(`from: ${to}, to: ${from}, message is: \"Enter your new remit nickname\"`));
                    });
                }
                else {
                    client.messages
                        .create({
                            body: 'Please type \"send\" OR \"create account\" OR \"check balance\"',
                            from: `${to}`,
                            to: `${from}`
                        })
                        .then(message => console.log(`from: ${to}, to: ${from}, message is: \"please type \"send\" OR \"create account\" OR \"check balance\"\"`));
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
                Message.findByIdAndUpdate(message[0]._id, {"$set": {"receiver": body.toLowerCase()}}, {"new": true, "upsert": true}, () => {
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
                if (body.toLowerCase() === "xrp") {
                    Message.findByIdAndUpdate(message[0]._id, {"$set": {"currency": body}}, {"new": true, "upsert": true}, () => {
                        client.messages
                        .create({
                            body: 'Enter Amount to send',
                            from: `${to}`,
                            to: `${from}`
                        })
                        .then(message => console.log(`from: ${to}, to: ${from}, message is: \"Enter Amount to send\"`));
                    });
                }
                else {
                    Message.findByIdAndUpdate(message[0]._id, {"$set": {"currency": 'XRP'}}, {"new": true, "upsert": true}, () => {
                        client.messages
                        .create({
                            body: 'We only support XRP currently, so we\'re setting your currency type to XRP. Enter Amount to send',
                            from: `${to}`,
                            to: `${from}`
                        })
                        .then(message => console.log(`from: ${to}, to: ${from}, message is: \"e only support XRP currently, so we\'re setting your currency type to XRP. Enter Amount to send\"`));
                    });
                }
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
                if (usersFile.users[message[0].sender].password === body) {
                    let sender = message[0].sender;
                    let receiver = message[0].receiver;
                    let amount = message[0].amount;
                    const senderMnemonic = usersFile.users[sender].mnemonic;
                    const senderDerivationPath = usersFile.users[sender].derivationPath;
                    const senderWallet = Wallet.generateWalletFromMnemonic(senderMnemonic, senderDerivationPath);
                    const receiverMnemonic = usersFile.users[receiver].mnemonic;
                    const receiverDerivationPath = usersFile.users[receiver].derivationPath;
                    const receiverWallet = Wallet.generateWalletFromMnemonic(receiverMnemonic, receiverDerivationPath);
                    const receiverAddress = receiverWallet.getAddress();

                    validateBalance(senderWallet, to, from, amount, receiverAddress, receiverWallet);
                }
                else {
                    console.log("could not find user");
                    Message.findByIdAndDelete(message[0]._id, () => {
                        client.messages
                        .create({
                            body: 'Password incorrect',
                            from: `${to}`,
                            to: `${from}`
                        })
                        .then(message => console.log(`from: ${to}, to: ${from}, message is: \"Password incorrect\"`))
                    });
                    res.end();
                }

                Message.findByIdAndDelete(message[0]._id, () => {
                    console.log(`conversation finished with ${message[0].sender}`);
                });
            }
            else if (message[0].mode == 'create account' && !message[0].sender && !message[0].password) {
                if (!usersFile.users[body.toLowerCase()]) {
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
                else {
                    client.messages
                        .create({
                            body: 'Nickname already exists, choose a different nickname',
                            from: `${to}`,
                            to: `${from}`
                        })
                        .then(message => console.log(`from: ${to}, to: ${from}, message is: \"Nickname already exists, choose a different nickname\"`));
                }
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
            else if (message[0].mode == 'check balance' && !message[0].sender && !message[0].password) {
                Message.findByIdAndUpdate(message[0]._id, {"$set": {"sender": body.toLowerCase()}}, {"new": true, "upsert": true}, () => {
                    client.messages
                    .create({
                        body: 'Enter your password',
                        from: `${to}`,
                        to: `${from}`
                    })
                    .then(message => console.log(`from: ${to}, to: ${from}, message is: \"Enter your password\"`));
                });   
            }
            else if (message[0].mode == 'check balance' && !message[0].password) {
                if (usersFile.users[message[0].sender].password === body) {
                    const userMnemonic = usersFile.users[message[0].sender].mnemonic;
                    const userDerivationPath = usersFile.users[message[0].sender].derivationPath;
                    const userWallet = Wallet.generateWalletFromMnemonic(userMnemonic, userDerivationPath);

                    checkBalance(userWallet, to, from, 1);
                }
                else {
                    console.log("could not find user");
                    Message.findByIdAndDelete(message[0]._id, () => {
                        client.messages
                        .create({
                            body: 'Password incorrect',
                            from: `${to}`,
                            to: `${from}`
                        })
                        .then(message => console.log(`from: ${to}, to: ${from}, message is: \"Password incorrect\"`))
                    });
                    res.end();
                }
                Message.findByIdAndDelete(message[0]._id, () => {
                    console.log(`conversation finished with ${message[0].sender}`);
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
                        body: 'Hello, please type \"send\" OR \"create account\" OR \"check balance\"',
                        from: `${to}`,
                        to: `${from}`
                    })
                    .then(message => console.log(`from: ${to}, to: ${from}, message is: \"Hello, please type \"send\" OR \"create account\" OR \"check balance\"\"`));

                res.end();
            });
        }
        
        res.end();
    });
});

async function send(amount, receiverAddress, senderWallet, receiverWallet, to, from) {
    const dropToFull = amount * 1000000
    console.log(BigInt(dropToFull));
    const transactionHash = await xpringClient.send(BigInt(dropToFull), receiverAddress, senderWallet)
        .then(() => {
            console.log('Transaction complete...');
            checkBalance(senderWallet, to, from, 0);
        })
        .catch((err) => console.log(err));
    ;
}

async function checkBalance(wallet, to, from, mode) {
    console.log(wallet.getAddress());
    const balance = await xpringClient.getBalance(wallet.getAddress())
        .then((balance) => {
            console.log(`Balance is: ${balance}`);
            newBalance = balance/1000000;
            if (mode == 0) {
                client.messages
                    .create({
                        body: `Your new balance is: ${newBalance} XRP`,
                        from: `${to}`,
                        to: `${from}`
                    })
                    .then(message => { 
                        console.log(`from: ${to}, to: ${from}, message is: \"Your new balance is: ${newBalance} XRP\"`);
                    });
            }
            else {
                client.messages
                    .create({
                        body: `Your balance is: ${newBalance} XRP`,
                        from: `${to}`,
                        to: `${from}`
                    })
                    .then(message => { 
                        console.log(`from: ${to}, to: ${from}, message is: \"Your balance is: ${newBalance} XRP\"`);
                    });
            }
        })
        .catch((err) => {
            console.log('Balance is: 0');
            client.messages
                .create({
                    body: `Your balance is: 0 XRP`,
                    from: `${to}`,
                    to: `${from}`
                })
                .then(message => { 
                    console.log(`from: ${to}, to: ${from}, message is: \"Your balance is: 0 XRP\"`);
                });
        });
}

async function validateBalance(wallet, to, from, amount, receiverAddress, receiverWallet) {
    console.log(wallet.getAddress());
    const balance = await xpringClient.getBalance(wallet.getAddress())
        .then((balance) => {
            console.log(`Balance is: ${balance}`);
            newBalance = balance/1000000;
            if (newBalance <= 30) {
                client.messages
                    .create({
                        body: `Your balance is: ${newBalance} XRP, which is the required amount to maintain keep your wallet up and running therefore the transaction cannot happen.`,
                        from: `${to}`,
                        to: `${from}`
                    })
                    .then(message => { 
                        console.log(`from: ${to}, to: ${from}, message is: \"Your balance is: ${newBalance} XRP, which is the required amount to maintain keep your wallet up and running therefore the transaction cannot happen.\"`);
                    });
            }
            else
                send(amount, receiverAddress, wallet, receiverWallet, to, from);
        })
        .catch((err) => {
            console.log('Balance is: 0');
            client.messages
                .create({
                    body: `Your balance is: 0 XRP`,
                    from: `${to}`,
                    to: `${from}`
                })
                .then(message => { 
                    console.log(`from: ${to}, to: ${from}, message is: \"Your balance is: 0 XRP\"`);
                });
        });
}

app.get('/', (req, res) => {
    res.end();
});

http.createServer(app).listen(1337, () => {
    console.log(`Express server listening on 1337.`);
});
