import { sendEmbed, queryDatabase }  from "./utils"
import { commands }   from "./data/common"
import { Intro }      from "./data/types"
import Command        from "./command"
import config         from "./config.json"
import ytdl           from "ytdl-core"
import path           from "path"
import util           from "util"
import fs             from "fs"
import { 
  Client, 
  Intents, 
  Collection,
  Message, 
  TextChannel, 
  GuildMember, 
  VoiceState,
  User } from "discord.js"
import { 
  joinVoiceChannel, 
  DiscordGatewayAdapterCreator, 
  createAudioResource, 
  createAudioPlayer, 
  StreamType, 
  AudioPlayerStatus,
  VoiceConnectionStatus } from "@discordjs/voice"

export default class Bot {
  client: Client
  commands: Collection<string, Command>
  cooldowns: Collection<string, Collection<string, number>>

  constructor() {
    this.client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] })
    this.commands = new Collection()
    this.cooldowns = new Collection()
  }

  start() {
    this.client.login(config.token)
  }

  async init() {
    await this.loadCommands()
    this.initCooldowns()
    this.setEventHandlers()
  }

  private async loadCommands() {
    const commandsFolder = path.join(process.cwd(), "dist/commands")
    const readDir = util.promisify(fs.readdir)
    const folders = await readDir(commandsFolder)
    
    for (const folder of folders) {
      const files = (await readDir(`${commandsFolder}/${folder}`)).filter(file => file.endsWith(".js")) // filter to remove sourceMaps
      
      for (const file of files) {
        const command = (await import(`${commandsFolder}/${folder}/${file}`)).default
        this.commands.set(command.name, command)
        commands.set(command.name, command) // this is for the commonData folder, so that the commands are accessible outside of this class 
      }
    }
  }

  initCooldowns() {
    for(const [name, _] of this.commands) 
      this.cooldowns.set(name, new Collection<string, number>())
  }
  
  private async setEventHandlers() {
    this.client.on("ready", () =>
      console.log(`${config.name} Ready`)
    )
    this.client.on("messageCreate", (message: Message) =>
      this.handleMessage(message)
    )
    this.client.on("voiceStateUpdate", (oldState: VoiceState, newState: VoiceState) => 
      this.handleVoiceStateUpdate(oldState, newState)
    )
  }
  
  handleMessage(message: Message) {
    if (!this.hasPrefix(message) || this.isUserBot(message.author))
      return
      
    const command = this.getCommand(message)
    if (!command)
      return

    try {
      if (!this.isCallerLocationValid(message, command)) 
        throw `The command "${command.name}" can not be called from this location.`
    
      if(!this.isCallerAuthorized(message, command)) 
        throw "The caller is not authorized to use this command."
        
      if(!this.isBotAuthorized(message, command)) 
        throw `${config.name} is not authorized to use this command.`
      
      if (!this.isCooledDown(message, command))
        throw `The command "${command.name}" has a cooldown period of ${this.getCooldownInSeconds(command)} seconds.`
      
      const args = this.getArguments(message)
      if (command.hasArgs && !args.length)
        throw `The command "${command.name}" requires arguments, and you didn't provide any.`

      command.execute(message, args)

    } catch (error) {
      if (typeof error === "string")
        sendEmbed(message, "Error", error)
      else 
        sendEmbed(message, "Error", `An error occured executing the "${command.name}" command.`)
    }
  }

  async handleVoiceStateUpdate (oldState: VoiceState, newState: VoiceState) {
    if (!oldState.channel && newState.channel) { // If the user has joined the VC not coming from another one
      const member = newState.member as GuildMember

      if (this.isUserBot(member.user)) 
        return

      const intro = await queryDatabase("SELECT * FROM intros WHERE id=$1", undefined, member.id) as Intro[]
      if (!intro[0]) 
        return

      // Join VC & create AudioPlayer
      const connection = joinVoiceChannel({
        channelId: newState.channel.id,
        guildId: member.guild.id as string,
        adapterCreator: member.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator
      })
      connection.on(VoiceConnectionStatus.Disconnected, () => connection.destroy()) // If forcefully disconnected, destroy connection

      const audioPlayer = createAudioPlayer()
      audioPlayer.on(AudioPlayerStatus.Idle, () => connection.destroy())
      connection.subscribe(audioPlayer)
      
      // Play YouTube link
      const audioResource = createAudioResource(ytdl(intro[0].link, { filter: 'audioonly' }), { inputType: StreamType.Arbitrary })
      audioPlayer.play(audioResource)
    }
  }

  hasPrefix(message: Message): boolean {
    return message.content.startsWith(config.prefix)
  }

  isUserBot(user: User): boolean {
    return user.bot
  }

  getArguments(message: Message): string[] {
    const args = message.content.trim().split(/ +/)
    args.shift() // The first element is actually the command name, which isn't a part of the arguments. So remove that
    return args
  }

  getCommand(message: Message): Command | undefined {
    const commandName = message.content.slice(config.prefix.length).trim().split(/ +/)[0].toLowerCase()
    return this.commands.get(commandName) || this.commands.find(command => command.aliases !== undefined && command.aliases.includes(commandName)) // Check aliases also
  }

  isCallerLocationValid(message: Message, command: Command): boolean {
    return command.callerLocations.includes(message.channel.type)
  }

  isCallerAuthorized(message: Message, command: Command): boolean {
    if (!command.permission || (message.channel as TextChannel).permissionsFor(message.author)?.has(command.permission))
      return true
    return false
  }

  isBotAuthorized(message: Message, command: Command): boolean {
    if (!command.permission || (message.channel as TextChannel).permissionsFor(message.guild?.me as GuildMember))
      return true
    return false
  }

  isCooledDown(message: Message, command: Command): boolean {
    const timestamps = this.cooldowns.get(command.name)
    const cooldownDuration = command.cooldown || config.defaultCooldown
    const expirationTime = timestamps?.get(message.author.id) 

    if (expirationTime !== undefined) {
      if(Date.now() < expirationTime + cooldownDuration)
        return false
    }

    timestamps?.set(message.author.id, Date.now())
    setTimeout(() => timestamps?.delete(message.author.id), cooldownDuration)
    return true
  }

  getCooldownInSeconds(command: Command) {
    return (command.cooldown || config.defaultCooldown)/1000
  }
}