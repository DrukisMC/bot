import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { Client } = require('bedrock-protocol/src/client.js');

export function createTermuxClient(options) {
  const client = new Client({
    ...options,
    version: options.version || '1.21.80',
    raknetBackend: 'jsp-raknet',
    useRaknetWorkers: false,
    delayedInit: true
  });

  client.once('connect_allowed', () => client.connect());
  client.init();
  return client;
}