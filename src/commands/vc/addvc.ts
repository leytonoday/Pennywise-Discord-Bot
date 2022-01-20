import { sendEmbed, queryDatabase } from '../../utils'
import { Channel }                  from "../../data/types"
import { Message }                  from "discord.js"
import Command                      from "../../command"

const command: Command = {
  name: "addvc",
  description: "Add a VC for external VC communication",
  aliases: ["avc"],
  callerLocations: ["GUILD_TEXT", "GUILD_PUBLIC_THREAD", "GUILD_PRIVATE_THREAD"],
  hasArgs: true,
  usage: "<channel ID> <channel name>",
  execute: async function (message: Message, args: string[]) {
    const channelID = args.shift() as string
    const channelName = args.shift() as string
    const guildId = message.guildId as string

    if (!channelName)
      return sendEmbed(message, "Error", "Provide channel name")

    const voiceChannels = getVoiceChannels(message)
    if (!voiceChannels?.get(channelID))
      return sendEmbed(message, "Error", "The given VC does not exist")

    try {
      await createTableIfNotExist(guildId)

      const currentlyAddedVcs = await queryDatabase("SELECT * from %I", guildId) as Channel[]

      if (currentlyAddedVcs.find(vc => vc.name == channelName)) 
        return sendEmbed(message, "Error", "A VC of the same name has already been added")
      if (currentlyAddedVcs.find(vc => vc.id == channelID))
        return sendEmbed(message, "Error", "A VC of the same ID has already been added")
    
      await queryDatabase("INSERT INTO %I VALUES ($1, $2)", guildId, channelName, channelID)

      sendEmbed(message, "Success", `${channelName} has been added to the VC list`)
    } catch (e) {
      throw e
    }
  }
}

export default command

function getVoiceChannels(message: Message) {
  return message.guild?.channels.cache.filter(channel => channel.type == "GUILD_VOICE")
}

async function createTableIfNotExist(guildId: string) {
  await queryDatabase("CREATE TABLE IF NOT EXISTS %I (name varchar(32), id varchar(255))", guildId)
}