import { logger } from './logger.js';

export function sendChat(client, message) {
  const text = String(message).replace(/\s+/g, ' ').trim().slice(0, 256);
  if (!text) return;
  client.queue('text', { type: 'chat', needs_translation: false, source_name: process.env.MC_USERNAME || 'BuddyBot', message: text, filtered_message: text, xuid: '', platform_chat_id: '' });
  logger.debug('Mensagem enviada ao Minecraft', { text });
}

export function extractChat(packet) {
  if (!packet || packet.type === 'announcement') return null;
  const message = packet.message?.trim();
  return message ? { author: packet.source_name || 'jogador', message } : null;
}