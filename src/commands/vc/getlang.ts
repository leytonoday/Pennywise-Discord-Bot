import { Message } from "discord.js"
import Command from "../../command"
import { sendEmbed } from "../../utils"
import { languages } from "../../data/commonData"

const command: Command = {
  name: "getlang",
  description: "Provides a list of all VCs supported language codes",
  aliases: ["gl"],
  callerLocations: ["GUILD_TEXT", "DM", "GUILD_PUBLIC_THREAD", "GUILD_PRIVATE_THREAD"],
  hasArgs: false,
  execute: async function (message: Message) {
    let output = languages.map(lang => `${lang.code} - ${lang.name}`).join("\n")
    sendEmbed(message, "Supported Languages", output)
  }
}

export default command