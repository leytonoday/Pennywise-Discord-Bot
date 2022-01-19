import { Message, PermissionString } from "discord.js"

export type CommandExecution = (message: Message, args: any[]) => Promise<void>

type Command = {
  name: string
  description: string
  callerLocations: string[]
  hasArgs: boolean
  permission?: PermissionString
  usage?: string
  aliases?: string[]
  cooldown?: number
  execute: CommandExecution
}

export default Command