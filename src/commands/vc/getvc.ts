import { Message } from "discord.js"
import Command from "../../command"
import { sendEmbed, queryDatabase } from '../../utils'

const command: Command = {
  name: "getvc",
  description: "Returns a list of all VCs added for your server",
  aliases: ["gvc"],
  callerLocations: ["GUILD_TEXT", "GUILD_PUBLIC_THREAD", "GUILD_PRIVATE_THREAD"],
  hasArgs: false,
  execute: async function (message: Message) {
    const guildId = message.guildId as string
    try {
      await createTableIfNotExist(guildId)

      const vcs = await queryDatabase("SELECT * FROM %I", guildId)
      
      let vcStrings = vcs.map(vc => `${vc.name} - ${vc.id}`)
      if (!vcStrings.length)
        vcStrings.push("None")

      sendEmbed(message, `VCs Added to ${message.guild?.name}`, vcStrings.join("\n"))
    } catch (e) {
      throw e
    }
  }
}

export default command

async function createTableIfNotExist(guildId: string) {
  await queryDatabase("CREATE TABLE IF NOT EXISTS %I (name varchar(32), id varchar(255))", guildId)
}