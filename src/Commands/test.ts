import { Message } from "discord.js";

export default {
  name: "test",
  description: "Test Command",
  async execute(message: Message, args: String[]) {
    message.reply("Hello World");
  },
};
