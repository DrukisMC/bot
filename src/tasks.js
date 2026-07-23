import { logger } from './logger.js';

export class TaskManager {
  constructor(context) { this.context = context; this.registry = new Map(); this.running = new Map(); }
  register(name, task) { this.registry.set(name, task); return this; }
  list() { return [...this.registry.keys()]; }
  active() { return [...this.running.keys()]; }
  start(name) {
    const task = this.registry.get(name);
    if (!task) throw new Error(`Tarefa desconhecida: ${name}.`);
    if (this.running.has(name)) throw new Error(`Tarefa ${name} já está ativa.`);
    const execution = Promise.resolve(task(this.context)).catch(error => logger.error(`Tarefa ${name} falhou`, { error: error.message })).finally(() => this.running.delete(name));
    this.running.set(name, execution);
  }
  stop(name) { if (!this.running.delete(name)) throw new Error(`Tarefa ${name} não está ativa.`); }
  stopAll() { this.running.clear(); }
}