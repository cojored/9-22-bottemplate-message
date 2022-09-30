import {
  ButtonInteraction,
  Message,
  ModalSubmitInteraction,
  SelectMenuInteraction,
} from "discord.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import fs from "fs";
import Command from "../Types/Command.js";

export default class CommandHandler {
  private cmds: {
    [key: string]: Command;
  };
  private prefix: string;
  constructor(prefix: string) {
    this.cmds = {};
    this.prefix = prefix;
    let commandFolder = "../Commands/";
    fs.readdirSync(__dirname + "/" + commandFolder).forEach(async (file) => {
      if (file.endsWith(".js")) {
        let command: Command = (
          await import(`file://${__dirname}/${commandFolder}/${file}`)
        ).default;
        this.cmds[command.name] = command;
      }
    });
  }
  get commands() {
    let commands: Array<Command> = [];
    Object.values(this.cmds).map((x) => {
      let data: Command = {
        name: x.name,
        description: x.description,
        usage: x.usage,
      };
      commands.push(data);
    });
    return commands;
  }
  run(message: Message) {
    const args = message.content.slice(this.prefix.length).trim().split(/ +/);
    const command = args.shift() as string;
    const cmd = this.cmds[command];
    if (cmd) {
      cmd.execute!(message, args);
    }
  }
  async button(interaction: ButtonInteraction, cmdName: string) {
    if (this.cmds[cmdName]) {
      let command = this.cmds[cmdName];
      command.button?.(interaction, interaction.customId.split("|")[1]);
    }
  }
  async modal(interaction: ModalSubmitInteraction, cmdName: string) {
    if (this.cmds[cmdName]) {
      let command = this.cmds[cmdName];
      command.modal?.(interaction, interaction.customId.split("|")[1]);
    }
  }
  async selectMenu(interaction: SelectMenuInteraction, cmdName: string) {
    if (this.cmds[cmdName]) {
      let command = this.cmds[cmdName];
      command.selectMenu?.(interaction, interaction.customId.split("|")[1]);
    }
  }
}
