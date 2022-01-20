import { sendEmbed, queryDatabase } from '../../utils'
import { Message }                  from "discord.js"
import Command                      from "../../command"

const command: Command = {
  name: "delvc",
  description: "Delete a VC you have stored for external VC communication",
  aliases: ["dvc"],
  callerLocations: ["GUILD_TEXT", "GUILD_PUBLIC_THREAD", "GUILD_PRIVATE_THREAD"],
  hasArgs: true,
  usage: "<channel ID>",
  execute: async function (message: Message, args: string[]) {
    const vcToDelete = args.shift() as string
    const guildId = message.guildId as string

    try {
      await createTableIfNotExist(guildId)

      const currentlyAddedVcs = await queryDatabase("SELECT * from %I", guildId)
      if (!currentlyAddedVcs.find(vc => vc.id == vcToDelete))
        return sendEmbed(message, "Error", `Could not find channel ${vcToDelete}`)
    
      await queryDatabase("DELETE FROM %I WHERE id=$1", guildId, vcToDelete)

      sendEmbed(message, "Success", `${vcToDelete} has been removed from the VC list`)
    } catch (e) {
      throw e
    }
  }
}

export default command

async function createTableIfNotExist(guildId: string) {
  await queryDatabase("CREATE TABLE IF NOT EXISTS %I (name varchar(32), id varchar(255))", guildId)
}