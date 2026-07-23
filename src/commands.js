export function createCommandHandler({ send, tasks, stop }) {
  return async function handle(input, author) {
    if (!input.startsWith('!')) return false;
    const [command, action, name] = input.slice(1).trim().split(/\s+/);
    if (command === 'help') return send('Comandos: !help, !status, !task list, !task start <nome>, !task stop <nome>, !stop');
    if (command === 'status') return send(`BuddyBot online. Tarefas ativas: ${tasks.active().join(', ') || 'nenhuma'}.`);
    if (command === 'stop') { send(`Desligando a pedido de ${author}.`); return stop(); }
    if (command === 'task' && action === 'list') return send(`Tarefas: ${tasks.list().join(', ') || 'nenhuma'}.`);
    if (command === 'task' && (action === 'start' || action === 'stop')) {
      if (!name) return send(`Uso: !task ${action} <nome>`);
      try { action === 'start' ? tasks.start(name) : tasks.stop(name); return send(`Tarefa ${name}: ${action === 'start' ? 'iniciada' : 'interrompida'}.`); }
      catch (error) { return send(error.message); }
    }
    return send('Comando desconhecido. Use !help.');
  };
}