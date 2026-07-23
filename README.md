# BuddyBot

Bot modular para Minecraft Bedrock Edition, escrito em Node.js e preparado para rodar no Termux. O BuddyBot conecta a um servidor Bedrock dedicado, lê mensagens do chat, responde usando o OpenRouter e oferece pontos de extensão para movimento, inventário e tarefas.

## Requisitos

- Termux com Node.js 18 ou mais recente
- Um servidor Minecraft Bedrock acessível pelo Android na mesma rede
- Uma chave de API do [OpenRouter](https://openrouter.ai/)
- Uma conta do [Playit](https://playit.gg/) se o servidor precisar ser acessado pela internet

> **Importante:** o BuddyBot não entra em mundos normais hospedados pelo aplicativo Minecraft. Use um servidor dedicado configurado abaixo ou outro servidor Bedrock real.

## Hospedar no Codespace

O mundo normal do aplicativo Minecraft não funciona como servidor dedicado. Para jogar com o bot, hospede um servidor Bedrock separado no Codespace:

```sh
sudo apt-get update && sudo apt-get install -y curl unzip
cp .env.server.example .env.server
nano .env.server
npm run server:setup
```

Em `BEDROCK_SERVER_URL`, cole a URL do pacote Linux x86_64 obtida na página oficial do servidor Bedrock. Depois, em terminais separados, mantenha estes processos ativos:

```sh
npm run server:start
npm run playit:start
```

Na primeira execução do Playit, abra o link exibido no terminal e crie um túnel **Bedrock/UDP** para a porta local `19132`. O endereço e a porta fornecidos pelo Playit serão usados tanto pelo Minecraft quanto pelo BuddyBot. Codespaces podem dormir e têm limite de uso gratuito; o servidor só fica disponível enquanto o Codespace e esses processos estiverem ativos.

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
| `MC_HOST` | sim | IP/hostname do servidor Bedrock ou endereço do Playit |
| `MC_PORT` | não | Porta Bedrock, padrão `19132` |
| `MC_VERSION` | não | Versão Bedrock do servidor, padrão `1.21.80` |
| `MC_USERNAME` | não | Nome exibido para o bot |
| `MC_OFFLINE` | não | Use `true` para servidor offline; padrão `true` |
| `OPENROUTER_API_KEY` | sim | Chave da API do OpenRouter |
| `OPENROUTER_MODEL` | não | Modelo, padrão `openai/gpt-4o-mini` |
| `BOT_SYSTEM_PROMPT` | não | Personalidade/contexto do bot |
| `LOG_LEVEL` | não | `debug`, `info`, `warn` ou `error` |

Para usar o túnel, substitua `MC_HOST` e `MC_PORT` pelos valores gerados pelo Playit. A chave do OpenRouter deve ser criada no `.env` do ambiente onde o bot vai rodar.

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