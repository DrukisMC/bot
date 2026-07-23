const levels = { debug: 10, info: 20, warn: 30, error: 40 };
const configuredLevel = process.env.LOG_LEVEL?.toLowerCase() || 'info';
const threshold = levels[configuredLevel] ?? levels.info;

function write(level, message, details) {
  if (levels[level] < threshold) return;
  const suffix = details === undefined ? '' : ` ${JSON.stringify(details)}`;
  const output = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}${suffix}`;
  if (level === 'error') console.error(output); else console.log(output);
}

export const logger = {
  debug: (message, details) => write('debug', message, details),
  info: (message, details) => write('info', message, details),
  warn: (message, details) => write('warn', message, details),
  error: (message, details) => write('error', message, details)
};