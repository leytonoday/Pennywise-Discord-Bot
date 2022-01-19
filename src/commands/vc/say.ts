import { Message } from "discord.js"
import Command from "../../command"
import axios from "axios"
import { databaseClients } from "../../data/commonData" 

const command: Command = {
  name: "say",
  description: "Will speak in the VC for you",
  aliases: ["s"],
  callerLocations: ["GUILD_TEXT"],
  hasArgs: false,
  usage: "<channel\\*> <language\\*> <text> (* = optional)",
  execute: async function (message: Message, args: string[]) {
    const vcId = getVcId(message)
    console.log(vcId)
  }
}

function getVcId(message: Message): string {
  if (message.member?.voice.channel)
    return message.member.voice.channel.id 
  else {
    return ""
  }
}

function isChannelInQuotes(input: string) {
  
}

function channelNameToId(input: string) {
  const regexArray = input.match(/["']\s*(.*?)\s*["']/)
  if (regexArray !== null) {
    const channelName = regexArray[1]
    
  }
  return ""
}

export default command