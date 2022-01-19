import { MessageEmbed, Message } from "discord.js"
import { embedColour } from "./config.json"
import { databaseClients } from "./data/commonData"
import format from "pg-format"

export function sendEmbed(message: Message, title: string, description: string) {
  const embed = new MessageEmbed()
    .setTitle(title)
    .setDescription(description)
    .setColor(embedColour)
  message.channel.send({embeds: [embed]})
}

export async function queryDatabase(query: string, guildId: string, ...args: string[]) {
  const databaseClient = await databaseClients.connect()
  let data = []

  try {
    const { rows } = await databaseClient.query(format(query, guildId), args)
    data = rows
  } catch (e) {
    await databaseClient.query("ROLLBACK")
    throw e
  } finally {
    databaseClient.release()
  }
  
  return data
}