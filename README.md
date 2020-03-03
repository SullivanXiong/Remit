# Remit
Remit is a peer-to-peer payment system with a quick one time set up process. Once you create an account, either through SMS or the website, making a transaction takes only a couple of seconds.

# Technologies utilized:
Xpring-js
Nodejs
Heroku
Ngrok
Twilio Autopilot SMSBot
Firebase Services
  FireStore
  Firebase Database
  Firebase Authentication
  Firebase Hosting
HTML/CSS/JS/JQuery/BootStrap

# Challenges I ran into
Originally we were going to use Interledger, we spent many hours trying to wrap our head around it and utilize it but in the end we dropped it because we found out that it would require many more hours of learning OTHER api's built on the open source platform in order to make anything of interledger. We stuck with Xpring however because it was much simpler to set up a testing environment.

As of right now Remit can only perform XRP to XRP transactions because we're using Xpring Ledger and not Interledger; The "$" on our website is a bit misleading and will be fixed soon.

# What's next for Remit?
We're planning on redesigning our website to look much better, we're going to implement Interledger so that our peer-to-peer payment system can support more currencies than just XRP, and we're also looking to develop a much better authentication system for the internetless SMS authentication.

Some of our ideas for a more secure SMS authentication as of right now are: single-use SMS passwords (we'll have a way for you to create a new single-use one), possibly some type of physical hardware key of some sort, or through the use of some type of encryption protocol.

We're also planning to acquire a phone number in every country code so that the SMSBot can be accessible globally when we're in production.

# How can you currently test run Remit?
You'll have to run the xpring.js that's inside of the app directory
something along the lines of
```
cd -/Remit/app
node xpring.js
```

As for the web application you'll need to download the node package (firebase) and server the content locally
```
cd -/Remit/public
firebase serve
```


As of currently there is no availability yet the public to test out the SMSBot because it's on AutoPilot and was built through the Twilio Dashboard interface and not through Command Line Interface through the use of a backend server like nodejs + twilio API. More about this can be seen in the SMSBot directory as JPEGs of proof of the Twilio Dashboard.

# NOT TO BE CONFUSED WITH SMSBot.js and SMSBot.py
That was just us playing around with the Twilio API on python and nodejs BEFORE we decided to use the Dashboard Interface's AutoPilot feature which was just much easier and less work to develop a fully fledged SMSbot.
```
cd -/Remit/SMSBot
```
