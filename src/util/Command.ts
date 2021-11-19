import { SlashCommandBuilder } from '@discordjs/builders';

class Command extends SlashCommandBuilder {
  constructor() {
    super();
    this.setName();
  }
}
