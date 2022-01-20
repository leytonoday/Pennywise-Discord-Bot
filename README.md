# Pennywise-Discord-Bot
<div align="center">
<img src="https://user-images.githubusercontent.com/36010516/150417811-6fbb3737-7209-45ae-8f3b-efd6d98f3fbd.png" width="150" height="150">
</div>

The Pennywise Discord bot is used to aid users who do not have a microphone, or are untable to talk and to make voice chats a more personized experience. 
I created this bot for 2 reasons:
- To practice my TypeScript after reading Modern JavaScript for the Impatient by Cay S. Horstmann and Programming TypeScript by Boris Cherny
- To create a unique feature to attract users to my discord server

This program was written using NodeJS with TypeScript, and uses PostgreSQL to store it's data. Assuming your server is running on Ubuntu, or some other flavour of linux, then this video will show 
you how to set up the PostgreSQL database: https://www.youtube.com/watch?v=-LwI4HMR_Eg&t=649s. 

## Features
This bot has two unique features, which are:
- Google Cloud API text-to-speech, for a rich sounding synthesized voice, supporting many languages
- Voice Chat introductions. This can be set by the user using the ```!setintro``` command. The intro can be a 5 second YouTube video, the audio from which will be played
every time then user joins the VC


### Commands 
This is a list of all commands:
- !setintro \<youtube link\> - Set your intro to a youtube video that is sub 5 seconds
- !delintro - Delete your intro, or tag a user and delete their intro if you're above them in your server hierarchy
- !getintro - Get your intro
- !addvc \<channel_ID\> \<channel name\> - Registers the channel in the Pennywise database. You can now speak in this channel externally
- !delvc \<channel_ID\> - Deletes the channel in the Pennywise database. You can no longer speak in this channel externally
- !getvc - Lists all registered voice channels for your server
- !getlang - Lists all languages supported by the text-to-speech
- !say <text> - If you're in a VC, this will make Pennywise join the VC and read out your message to the other users.
- !say \<channel name\> \<language *\> \<text\> - If you're not in a VC, this will make Pennywise join the specified channel and read your message to the other users. If a 
language code is specified, it will change the language accordingly (get a list of all langauges using !getLang). 
- !help - Get a list of all commands
- !help \<command\> - Get a detailed description of a specific command
- !prefix - Return prefix (!)

## Project Setup

Create a PostgreSQL database called "pennywise_data". Either use the credentials in ```config.json``` or change them and use your own. 


In order to use the Google text-to-speech, you must register with google (https://cloud.google.com/text-to-speech) and receive your authentication key for use of the API. Once you have
this key, set the ```ttsApiKey``` variable in ```config.josn```.

## Run bot 

Using npm:
```
npm install
```
Using Yarn:
```
yarn install
```

Once this is complete, the bot is ready to be deployed. Run 
```
npm run start
```

