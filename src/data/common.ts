import { Collection } from "discord.js"
import { Language }   from "./types"
import { Pool }       from "pg"
import Command        from "../command"
import config         from "../config.json"

// Populated by bot.ts. This is made to make commands accessible outside of this class 
export let commands: Collection<string, Command> = new Collection()

export const databaseClients = new Pool({
  host: config.phHost,
  user: config.pgUser,
  port: config.pgPort,
  password: config.pgPassword,
  database: config.pgDatabase
})

export const languages: Language[] = [
  {code: "af-ZA", name: "Afrikaans"},
  {code: "ar-XA", name: "Arabic"},
  {code: "bn-IN", name: "Bengali"},
  {code: "bg-BG", name: "Bulgarian"},
  {code: "ca-ES", name: "Catalan"},
  {code: "cs-CZ", name: "Czech"},
  {code: "da-DK", name: "Danish"},
  {code: "nl-BE", name: "Dutch"},
  {code: "nl-NL", name: "Dutch"},
  {code: "en-AU", name: "English Australia"},
  {code: "en-IN", name: "English India"},
  {code: "en-US", name: "English United States"},
  {code: "en-GB", name: "English United Kingdom"},
  {code: "fil-PH", name: "Filipino"},
  {code: "fi-FI", name: "Finnish"},
  {code: "fr-CA", name: "French Canada"},
  {code: "fr-FR", name: "French France"},
  {code: "de-DE", name: "German"},
  {code: "gu-IN", name: "Gujarati"},
  {code: "hi-IN", name: "Hindi"},
  {code: "hu-HU", name: "Hungarian"},
  {code: "is-IS", name: "Icelandic"},
  {code: "id-ID", name: "Indonesian"},
  {code: "it-IT", name: "Italian"},
  {code: "ja-JP", name: "Japanese"},
  {code: "kn-IN", name: "Kannada"},
  {code: "ko-KR", name: "Korean"},
  {code: "lv-LV", name: "Latvian"},
  {code: "ms-MY", name: "Malay"},
  {code: "ml-IN", name: "Malayalam"},
  {code: "cmn-CN", name: "Mandarin Chinese China"},
  {code: "cmn-TW", name: "Mandarin Chinese Taiwan"},
  {code: "el-GR", name: "Greek"},
  {code: "nb-NO", name: "Norwegian"},
  {code: "pa-IN", name: "Panjabi"},
  {code: "pl-PL", name: "Polish"},
  {code: "pt-PT", name: "Portuguese Portugal"},
  {code: "pt-BR", name: "Portuguese Brazil"},
  {code: "ro-RO", name: "Romanian"},
  {code: "ru-RU", name: "Russian"},
  {code: "sr-RS", name: "Serbian"},
  {code: "sk-SK", name: "Slovak"},
  {code: "es-ES", name: "Spanish Spain"},
  {code: "es-US", name: "Spanish United States"},
  {code: "sv-SE", name: "Swedish"},
  {code: "ta-IN", name: "Tamil"},
  {code: "te-IN", name: "Telugu"},
  {code: "th-TH", name: "Thai"},
  {code: "tr-TR", name: "Turkish"},
  {code: "uk-UA", name: "Ukrainian"},
  {code: "vi-VN", name: "Vietcodese"},
  {code: "yue-HK", name: "Yue Chinese"},
]
