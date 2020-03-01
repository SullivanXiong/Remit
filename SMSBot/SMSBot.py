from twilio.rest import Client

# Your Account SID from twilio.com/console
account_sid = "AC926d327c34e7d74764d5fcde8141d5d2"
# Your Auth Token from twilio.com/console
auth_token  = "49e0bca2ec0ed226640bcc52ffe1d761"

client = Client(account_sid, auth_token)

message = client.messages.create(
            to="+15304913465", 
            from_="+18052932821",
            body="Hello from Python!")

print(message.sid)
