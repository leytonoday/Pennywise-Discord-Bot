import { Message } from "discord.js"
import Command from "../../command"
import { commands } from "../../data/commonData" 
import { sendEmbed } from '../../utils'
import config from "../../config.json"

const command: Command = {
  name: "help",
  description: "Returns list all commands, or a specific command info",
  aliases: ["h"],
  callerLocations: ["GUILD_TEXT", "DM", "GUILD_PUBLIC_THREAD", "GUILD_PRIVATE_THREAD"],
  hasArgs: false,
  cooldown: 2000,
  execute: async function (message: Message, args: string[]) {
    const commandName = args.shift()
    let output = ""

    if (!commandName) // If no particular command name is given, provide the basic usage of every command
      output = createAllCommandsHelpString()
    else {
      const command = getCommand(commandName)
      if (!command) 
        return sendEmbed(message, "Error", `${commandName} is not a command`)
      output = createCommandHelpString(command)
    }

    return sendEmbed(message, "Command List", output)
  }
}

export default command

function getCommand(commandName: string): Command | undefined {
  return commands.get(commandName) || commands.find(command => command.aliases !== undefined && command.aliases.includes(commandName))
}

function createCommandHelpString(command: Command): string {
  const info = [] // Probably a better way to do this
  info.push(`Name: ${command.name}`)
  info.push(`Description: ${command.description}`)
  info.push(`Aliases: ${command.aliases?.join(", ")}`)
  info.push(`Args: ${command.hasArgs}`)
  if (command.usage)
    info.push(`Usage: ${command.usage}`)
  return info.join("\n")
}

function createAllCommandsHelpString(): string {
  return commands.map(i => `${config.prefix}**${i.name}** - ${i.description}`).join("\n")
}