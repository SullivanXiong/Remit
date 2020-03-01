# /usr/bin/env python
# Download the twilio-python library from twilio.com/docs/libraries/python
from flask import Flask, request, redirect
from twilio import twiml
from twilio.twiml.messaging_response import Message, MessagingResponse

app = Flask(__name__)

@app.route("/sms", methods=['GET', 'POST'])
def sms_ahoy_reply():
    """Respond to incoming messages with a friendly SMS."""
    # Get the message the user sent our Twilio number
    body = request.values.get('Body', None)
    # Start our response
    resp = MessagingResponse()

    # Add a message
    if body == 'hello':
        resp.message("Hi!")
        return str(resp)
    elif body == 'bye':
        resp.message("Goodbye")
        return str(resp)
    resp.message("I didn't understand that. please input 'hello' or 'bye'.")
    return str(resp)


if __name__ == "__main__":
    app.run(debug=True)
