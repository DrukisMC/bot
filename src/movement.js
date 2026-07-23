export class Movement {
  constructor(client) { this.client = client; }
  async moveTo(position) { throw new Error(`Navegação até ${JSON.stringify(position)} ainda não foi implementada.`); }
  stop() { return undefined; }
}