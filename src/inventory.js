export class Inventory {
  constructor(client) { this.client = client; this.items = []; }
  list() { return [...this.items]; }
  async collect(itemName, quantity = 1) { throw new Error(`Coleta de ${itemName} ainda não foi implementada.`); }
  async equip(itemName) { throw new Error(`Equipar ${itemName} ainda não foi implementado.`); }
}