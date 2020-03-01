const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const { Wallet, XpringClient } = require("xpring-js"); 
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://remit-3446b.firebaseio.com'
});
// Get a database reference to our posts
var db = admin.firestore();

const remoteURL = "grpc.xpring.tech:80";
const xpringClient = new XpringClient(remoteURL);


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



async function foo() {
const wallet = Wallet.generateWalletFromSeed("sn8m93fLXCkDbcTgH7637zrAmVU3j");
const recipientWallet = Wallet.generateWalletFromSeed("ssUtALeNQC27BbQ8yY41AVuzjCSXC");

console.log(wallet.getAddress()); // XVMFQQBMhdouRqhPMuawgBMN1AVFTofPAdRsXG5RkPtUPNQ
console.log(wallet.getPublicKey()); // 031D68BC1A142E6766B2BDFB006CCFE135EF2E0E2E94ABB5CF5C9AB6104776FBAE
console.log(wallet.getPrivateKey()); // 0090802A50AA84EFB6CDB225F17C27616EA94048C179142FECF03F4712A07EA7A4


const testNetAddress = wallet.getAddress();
const balance = await xpringClient.getBalance(testNetAddress);
const recipientBalance = await xpringClient.getBalance(recipientWallet.getAddress());
console.log(balance.value);

const amount = BigInt("10000");
const recipientAddress = recipientWallet.getAddress();
const result = await xpringClient.send(amount, recipientAddress, wallet)
console.log(result);

console.log(balance.value);
console.log(recipientBalance.value);
}

app.options('/transactionDetails', (req, res) => {
  console.log("hahaha");
  sendMoney(req.body.sender, req.body.receiver, req.body.amount);
});

const PORT = process.env.PORT || 1338
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})

async function sendMoney(sender, receiver, amount) {
  db.collection("users").doc(sender).get().then(
    async (senderSnap) => {
      db.collection("users").doc(receiver).get().then(
        async (receiverSnap) => {
          var wallet = Wallet.generateWalletFromSeed(senderSnap.get("secret"));
          var amountInt = BigInt(amount);
          await xpringClient.send(amountInt, receiverSnap.get("address"), wallet);
          console.log(await xpringClient.getBalance(senderSnap.get("address")));
          console.log(await xpringClient.getBalance(receiverSnap.get("address")));
        }
      )
    }
  );
}