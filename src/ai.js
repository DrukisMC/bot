import { logger } from './logger.js';

const endpoint = 'https://openrouter.ai/api/v1/chat/completions';

export class OpenRouterAI {
  constructor({ apiKey, model, systemPrompt, maxHistory = 12 }) {
    this.apiKey = apiKey; this.model = model; this.systemPrompt = systemPrompt;
    this.maxHistory = Number(maxHistory) || 12; this.history = [];
  }

  async reply(message, author = 'jogador') {
    this.history.push({ role: 'user', content: `${author}: ${message}` });
    this.history = this.history.slice(-this.maxHistory);
    if (!this.apiKey) return 'Configure OPENROUTER_API_KEY para ativar minhas respostas de IA.';
    const headers = { Authorization: `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' };
    if (process.env.OPENROUTER_SITE_URL) headers['HTTP-Referer'] = process.env.OPENROUTER_SITE_URL;
    if (process.env.OPENROUTER_SITE_NAME) headers['X-Title'] = process.env.OPENROUTER_SITE_NAME;
    const response = await fetch(endpoint, { method: 'POST', headers,
      body: JSON.stringify({ model: this.model, messages: [{ role: 'system', content: this.systemPrompt }, ...this.history] }) });
    if (!response.ok) throw new Error(`OpenRouter HTTP ${response.status}: ${await response.text()}`);
    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content?.trim();
    if (!answer) throw new Error('OpenRouter retornou uma resposta vazia');
    this.history.push({ role: 'assistant', content: answer }); return answer;
  }
}

export function logAIError(error) { logger.error('Falha ao consultar o OpenRouter', { error: error.message }); }