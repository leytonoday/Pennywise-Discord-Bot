import { Message, PermissionString } from "discord.js"

type Command = {
  name: string
  description: string
  callerLocations: string[]
  hasArgs: boolean
  permission?: PermissionString
  usage?: string
  aliases?: string[]
  cooldown?: number
  execute: (message: Message, args?: any[]) => Promise<void>
}

export default Command