import { sendEmbed, queryDatabase } from '../../utils'
import { Message, User }            from "discord.js"
import { Intro }                    from '../../data/types'
import Command                      from "../../command"

const command: Command = {
  name: "delintro",
  description: "Deletes your VC intro",
  aliases: ["di"],
  callerLocations: ["GUILD_TEXT", "GUILD_PUBLIC_THREAD", "GUILD_PRIVATE_THREAD", "DM"],
  hasArgs: false,
  usage: "<user\**> (* = optional)",
  execute: async function (message: Message, args: string[]) {
    await createTableIfNotExist()

    // Set intro
    const intro = await queryDatabase("SELECT * FROM intros WHERE id=$1", undefined, message.author.id) // Attempt to get intro
    if (!intro[0])
      return sendEmbed(message, "Error", "You do not have an intro to delete")

    await queryDatabase("DELETE FROM intros WHERE id=$1", undefined, message.author.id) // Delete intro
    sendEmbed(message, "Success", "Your intro has been deleted")
  }
}

export default command

async function createTableIfNotExist()  {
  await queryDatabase("CREATE TABLE IF NOT EXISTS intros (id varchar(32), link varchar(255))")
}
