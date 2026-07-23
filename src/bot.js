import { EventEmitter } from 'node:events';
import { createClient } from 'bedrock-protocol';
import { logger } from './logger.js';
import { extractChat, sendChat } from './chat.js';
import { OpenRouterAI, logAIError } from './ai.js';
import { createCommandHandler } from './commands.js';
import { TaskManager } from './tasks.js';
import { Movement } from './movement.js';
import { Inventory } from './inventory.js';

export class BuddyBot extends EventEmitter {
  constructor() {
    super(); this.client = null;
    this.ai = new OpenRouterAI({ apiKey: process.env.OPENROUTER_API_KEY, model: process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini', systemPrompt: process.env.BOT_SYSTEM_PROMPT || 'Responda de forma breve e útil dentro do Minecraft.', maxHistory: process.env.MAX_HISTORY });
    this.tasks = new TaskManager({ bot: this });
  }

  connect() {
    this.client = createClient({ host: process.env.MC_HOST, port: Number(process.env.MC_PORT || 19132), username: process.env.MC_USERNAME || 'BuddyBot', offline: process.env.MC_OFFLINE !== 'false' });
    this.movement = new Movement(this.client); this.inventory = new Inventory(this.client);
    const send = message => sendChat(this.client, message);
    this.handleCommand = createCommandHandler({ send, tasks: this.tasks, stop: () => this.disconnect() });
    this.client.on('join', () => { logger.info(`Conectado ao Minecraft em ${process.env.MC_HOST}:${process.env.MC_PORT || 19132}`); send('BuddyBot conectado. Use !help.'); this.emit('ready'); });
    this.client.on('text', packet => this.onText(packet));
    this.client.on('error', error => logger.error('Erro do cliente Bedrock', { error: error.message }));
    this.client.on('close', () => logger.warn('Conexão Bedrock encerrada'));
    return this;
  }

  async onText(packet) {
    const chat = extractChat(packet);
    if (!chat || chat.author === (process.env.MC_USERNAME || 'BuddyBot')) return;
    logger.info(`${chat.author}: ${chat.message}`);
    if (await this.handleCommand(chat.message, chat.author)) return;
    try { sendChat(this.client, await this.ai.reply(chat.message, chat.author)); }
    catch (error) { logAIError(error); sendChat(this.client, 'Não consegui consultar a IA agora.'); }
  }

  disconnect() { this.tasks.stopAll(); this.client?.disconnect(); logger.info('BuddyBot desligado'); }
}