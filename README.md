# BuddyBot

Bot modular para Minecraft Bedrock Edition, escrito em Node.js e preparado para rodar no Termux. O BuddyBot conecta a um servidor Bedrock acessível pela rede local, lê mensagens do chat, responde usando o OpenRouter e oferece pontos de extensão para movimento, inventário e tarefas.

## Requisitos

- Termux com Node.js 18 ou mais recente
- Um servidor Minecraft Bedrock acessível pelo Android na mesma rede
- Uma chave de API do [OpenRouter](https://openrouter.ai/)

> **Importante sobre LAN:** mundos hospedados diretamente pelo Minecraft Bedrock normalmente usam descoberta/convites e podem não aceitar conexões de clientes externos por IP e porta. Para uma conexão estável, use um servidor Bedrock dedicado (ou um proxy compatível) escutando no IP LAN do dispositivo que hospeda o mundo. O telefone que executa o BuddyBot precisa alcançar esse IP.

## Instalação no Termux

```sh
pkg update
pkg install nodejs-lts git
git clone <url-do-seu-repositorio> BuddyBot
cd BuddyBot
npm install
cp .env.example .env
${EDITOR:-nano} .env
chmod +x start.sh
./start.sh
```

O projeto usa o backend RakNet JavaScript para evitar a compilação de módulos C++ no Android. Como o `createClient` padrão faz um ping usando o módulo nativo, o BuddyBot usa um adaptador próprio sem esse ping. Se a conexão falhar por versão, ajuste `MC_VERSION` para a versão do servidor.

Se você já tentou instalar e recebeu erro de `raknet-native`, limpe a instalação parcial e repita:

```sh
rm -rf node_modules
npm install
```

## Configuração

Copie `.env.example` para `.env` e informe:

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `MC_HOST` | sim | IP ou hostname do servidor Bedrock |
| `MC_PORT` | não | Porta Bedrock, padrão `19132` |
| `MC_VERSION` | não | Versão Bedrock do servidor, padrão `1.21.80` |
| `MC_USERNAME` | não | Nome exibido para o bot |
| `MC_OFFLINE` | não | Use `true` para servidor offline; padrão `true` |
| `OPENROUTER_API_KEY` | sim | Chave da API do OpenRouter |
| `OPENROUTER_MODEL` | não | Modelo, padrão `openai/gpt-4o-mini` |
| `BOT_SYSTEM_PROMPT` | não | Personalidade/contexto do bot |
| `LOG_LEVEL` | não | `debug`, `info`, `warn` ou `error` |

O `.env` não deve ser commitado. Nunca compartilhe sua chave de API.

## Comandos no chat

- `!help` mostra os comandos disponíveis
- `!status` mostra conexão e tarefas ativas
- `!stop` encerra o processo do bot
- `!task list` lista as tarefas registradas
- `!task start <nome>` inicia uma tarefa registrada
- `!task stop <nome>` interrompe uma tarefa

Mensagens que não começam com `!` são enviadas ao OpenRouter. O histórico é mantido em memória por sessão.

## Estrutura

```text
src/
	index.js       inicialização e desligamento
	bot.js         conexão Bedrock e roteamento de eventos
	ai.js          cliente HTTP do OpenRouter
	chat.js        histórico e envio de mensagens
	commands.js    comandos administrativos
	movement.js    API de movimento (extensível)
	inventory.js   API de inventário (extensível)
	tasks.js       registro e ciclo de vida de tarefas
	logger.js      logger simples para Termux
```

Os módulos de movimento e inventário não fingem executar ações que ainda não estão implementadas: eles definem contratos claros para adicionar navegação, coleta, mineração, plantio e gerenciamento de itens sem reescrever o núcleo.

## Desenvolvimento

```sh
npm run check
npm start
```

Para testar a conectividade sem OpenRouter, deixe `OPENROUTER_API_KEY` vazio: o bot continuará conectando e responderá no chat com uma mensagem de configuração ausente.