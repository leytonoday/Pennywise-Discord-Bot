import { sendEmbed, queryDatabase } from '../../utils'
import { Message }                  from "discord.js"
import { Intro }                    from '../../data/types'
import Command                      from "../../command"

const command: Command = {
  name: "getintro",
  description: "Returns your VC intro",
  aliases: ["gi"],
  callerLocations: ["GUILD_TEXT", "GUILD_PUBLIC_THREAD", "GUILD_PRIVATE_THREAD", "DM"],
  hasArgs: false,
  usage: "<user\**> (* = optional)",
  execute: async function (message: Message, args: string[]) {
    await createTableIfNotExist()

    const targetUser = message.mentions.users.first() || message.author
    const intro = await queryDatabase("SELECT * FROM intros WHERE id=$1", undefined, targetUser.id) as Intro[]

    if (intro[0])
      sendEmbed(message, "Success", `${targetUser.username}'s intro is ${intro[0].link}`)
    else 
      sendEmbed(message, "Error", `${targetUser.username} does not have an intro`)
  }
}

export default command

async function createTableIfNotExist()  {
  await queryDatabase("CREATE TABLE IF NOT EXISTS intros (id varchar(32), link varchar(255))")
}