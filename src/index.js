import 'dotenv/config';
import { BuddyBot } from './bot.js';
import { logger } from './logger.js';

if (!process.env.MC_HOST) {
  logger.error('MC_HOST não configurado. Copie .env.example para .env e informe o IP do servidor.');
  process.exit(1);
}

const bot = new BuddyBot().connect();
const shutdown = signal => { logger.info(`Recebido ${signal}; encerrando...`); bot.disconnect(); process.exit(0); };
process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));