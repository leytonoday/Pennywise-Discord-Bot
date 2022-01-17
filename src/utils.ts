import { MessageEmbed, Message } from "discord.js"
import { embedColour } from "./config.json"

export function sendEmbed(message: Message, title: string, description: string) {
  const embed = new MessageEmbed()
    .setTitle(title)
    .setDescription(description)
    .setColor(embedColour)
  message.channel.send({embeds: [embed]})
}