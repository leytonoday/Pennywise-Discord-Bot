import { queryDatabase, sendEmbed } from "../../utils"
import { languages }                from "../../data/commonData"
import { Channel }                  from "../../data/types"
import { Message }                  from "discord.js"
import Command                      from "../../command"
import config                       from "../../config.json"
import axios                        from "axios"
import { 
  joinVoiceChannel, 
  DiscordGatewayAdapterCreator, 
  createAudioResource, 
  createAudioPlayer, 
  StreamType, 
  AudioPlayerStatus,
  VoiceConnectionStatus } from "@discordjs/voice"

const command: Command = {
  name: "say",
  description: "Will speak in the VC for you",
  aliases: ["s"],
  callerLocations: ["GUILD_TEXT"],
  hasArgs: true,
  usage: "<channel\\*> <language\\*> <text> (* = optional)",
  execute: async function (message: Message, args: string[]) {
    let textToSay = getTextToSay(args)
    const vcId = await getVcId(message, textToSay)
    if (!vcId) 
      return sendEmbed(message, "Error", "Either the speficied VC hasn't been added yet (use adv), or you aren't in a VC. In the latter case, you must specify the VC name in quotes after the say command")
    
    // Remove channel name if the user not in VC so the bot doesn't say it. It leaves the quotes in, but that doesn't affect the audio
    if (isCallerExternal(message)) 
      textToSay = textToSay.replace(getChannelName(textToSay), "") 

    // Error handle text input
    if (!textToSay)
      return sendEmbed(message, "Error", "No text provided")
    if (textToSay.length > config.sayCharLimit)
      return sendEmbed(message, "Error", `Character limit of ${config.sayCharLimit} exceeded`)

    // Get language code
    const languageCode = getLanguageCode(args)
    if (languageCode) // Remove language code so that bot doesn't say it
      textToSay = textToSay.replace(languageCode, "")

    // Join VC & create AudioPlayer
    const connection = joinVoiceChannel({
      channelId: vcId,
      guildId: message.guildId as string,
      adapterCreator: message.guild?.voiceAdapterCreator as DiscordGatewayAdapterCreator
    })
    connection.on(VoiceConnectionStatus.Disconnected, () => connection.destroy()) // If forcefully disconnected, destroy connection

    const audioPlayer = createAudioPlayer()
    audioPlayer.on(AudioPlayerStatus.Idle, () => connection.destroy())
    connection.subscribe(audioPlayer)

    // Play text-to-speech
    const audioResource = createAudioResource(`data:audio/ogg;base64,${await textToSpeech(textToSay, languageCode)}`, { inputType: StreamType.OggOpus })
    audioPlayer.play(audioResource)
  }
}

function getTextToSay(args: string[]): string {
  return args.join(" ")
}

async function getVcId(message: Message, textToSay: string): Promise<string> {
  // If they are currently in voice chat, return the channel id
  if (message.member?.voice.channel) 
    return message.member.voice.channel.id
  else {
    // If they are not currently in voice chat, extract the channel name from the quotes, and query the database for the channel id
    const channelName = getChannelName(textToSay)
    if (!channelName) 
      return ""
    
    try {
      const currentlyAddedVcs = await queryDatabase("SELECT * FROM %I", message.guildId as string)
      const targetVC: Channel | undefined = currentlyAddedVcs.find(vc => vc.name === channelName)

      if (!targetVC)
        return ""

      return targetVC.id
    } catch (e) {
      throw e
    }
  }
}

function isCallerExternal(message: Message): boolean {
  if (message.member?.voice.channel) 
    return message.member.voice.channel.id === undefined
  return true
}

function getChannelName(input: string): string {
  const regexMatches = input.match(/["']\s*(.*?)\s*["']/) // get text in quotes, single quites or double
  if (regexMatches !== null)
    return regexMatches[1]
  return ""
}

function getLanguageCode(args: string[]): string | undefined {
  const languageCodes = languages.map(language => language.code)
  return args.find(arg => languageCodes.includes(arg))
}

async function textToSpeech(input: string, languageCode: string | undefined): Promise<string> {
  languageCode = languageCode === undefined ? "en-US" : languageCode 
  const audioReply = await axios.post(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${config.ttsApiKey}`, {
    input: { text: input },
    voice: { languageCode, ssmlGender: "MALE" },
    audioConfig: { audioEncoding: "OGG_OPUS" }
  })
  return audioReply.data.audioContent 
}

export default command