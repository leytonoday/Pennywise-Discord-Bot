import { sendEmbed, queryDatabase } from '../../utils'
import { Message }                  from "discord.js"
import Command                      from "../../command"
import config                       from "../../config.json"
import ytdl                         from "ytdl-core-discord"

const command: Command = {
  name: "setintro",
  description: "Will Set your VC intro",
  aliases: ["si"],
  callerLocations: ["GUILD_TEXT", "GUILD_PUBLIC_THREAD", "GUILD_PRIVATE_THREAD", "DM"],
  hasArgs: true,
  usage: "<youtube link>",
  execute: async function (message: Message, args: string[]) {
    await createTableIfNotExist()
    const url = args.shift() as string

    // Error handling
    if (!ytdl.validateURL(url)) 
      return sendEmbed(message, "Error", "Invalid link provided. Must be a valid YouTube link")
    if(videoLengthValid(await ytdl.getBasicInfo(url))) 
      return sendEmbed(message, "Error", `Invalid link provided. Must be ${config.introLengthLimitSeconds} seconds or less`)

    // Set intro
    const intro = await queryDatabase("SELECT * FROM intros WHERE id=$1", undefined, message.author.id) // Attempt to get intro
    if (!intro[0])
      await queryDatabase("INSERT INTO intros VALUES ($1, $2)", undefined, message.author.id, url) // Set intro if not set previously
    else
      await queryDatabase("UPDATE intros SET link = $1 WHERE id = $2", undefined, url, message.author.id) // Update intro if set previously

    sendEmbed(message, "Success", `Your intro has been set to ${url}`)
  }
}

export default command

function videoLengthValid(videoInfo: any): boolean {
  return Number.parseInt(videoInfo.videoDetails.lengthSeconds) > config.introLengthLimitSeconds
}

async function createTableIfNotExist()  {
  await queryDatabase("CREATE TABLE IF NOT EXISTS intros (id varchar(32), link varchar(255))")
}