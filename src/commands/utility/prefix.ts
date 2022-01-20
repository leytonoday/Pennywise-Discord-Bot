import { Message }  from "discord.js"
import { prefix }   from "../../config.json"
import Command      from "../../command"

const command: Command = {
  name: "prefix",
  description: "Returns the prefix for commands",
  aliases: ["p"],
  callerLocations: ["GUILD_TEXT", "DM", "GUILD_PUBLIC_THREAD", "GUILD_PRIVATE_THREAD"],
  hasArgs: false,
  execute: async function (message: Message) {
    message.channel.send(prefix)
  }
}

export default command