# twitch-ouija

This is a twitch bot that monitors a configured twitch channel for text.
As users chat, a buffer is filled up, and when it's threshold is passed, it'll send an Ably message containing the most frequently used character from a list of allowed characters.

This message can be subscribed to by the spiritboard app, and that app can move the planchette to that letter.

# How to configure

You'll need to add a `.env` file before you run this application with the following keys:

```
BOTNAME=OuijaBot
BOTPASSWORD=ouath:token
CHANNEL=TwitchChannelName
ABLY_API_KEY=Ably:ApiKey
ABLY_CHANNEL=spiritboard-twitchplays
BATCH_THRESHOLD=100
```

Most of those settings are obvious - BATCH_THRESHOLD is the number of allowed characters seen before a message is sent.

# How to run 

```bash
npm install
npm run start
```