<p align="center">
  <a href="#-tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-projeto">Projeto</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
</p>

<p align="center">
  <img  src="https://img.shields.io/static/v1?label=license&message=MIT&color=8257E6&labelColor=121214" alt="License">
</p>

<br>

## 🚀 Tecnologias

Tecnologias e bibliotecas que utilizei durante este projeto:

- [ChatGPT](https://www.npmjs.com/package/chatgpt)
- [Typescript](https://www.typescriptlang.org/)
- [WhatsappWebJs](https://github.com/pedroslopez/whatsapp-web.js/)
- [QrCodeTerminal](https://www.npmjs.com/package/qrcode-terminal)
- [DotEnv](https://www.npmjs.com/package/dotenv)
- [Nodemon](https://www.npmjs.com/package/nodemon)
- [TsNode](https://www.npmjs.com/package/ts-node)
- [EditorConfig](https://editorconfig.org/)
- [TypeOrm](https://typeorm.io/)
- [PgSql](https://www.npmjs.com/package/pg)
- [Docker](https://www.docker.com/)

## Back-End
- SOLID
- Funções Reutilizáveis
- Clean Code
- Design Patterns ( Repository Pattern, Early Return, Singleton Pattern, Service Pattern )

## 💻 Projeto

Este projeto tem por fim ser um BOT pessoal no Whatsapp, cujo qual o usuário pode personalizá-lo e usufruir de suas funcionalidades. Surgiu com base a minha necessidade de otimizar minha rotina, além de me auxiliar como um todo durente o desenvolvimento de minhas aplicações.

Obs: Em desenvolvimento

## 👨‍💻 Instalação

`Clone o repositório:`

git clone https://github.com/LuiFeAn/GPTWhats

`Faça o login no site da OpenIA e obtenha sua key para utilizar a API`

Você pode acessá-lo por aqui: <a href="https://platform.openai.com/">OpenIA</a>

`Crie um arquivo .env com seguinte variável de ambiente e insira sua key da API do ChatGPT:`

OPENIA_KEY=suachavedaopenia

`Observação:`

1 - A conexão com o banco de dados só é necessária se você quiser armazenar os IDS e outras informações em um local mais sólido. Do contrário, não é necessário preencher as variáveis de ambiente referentes ao banco de dados.

`Instale todos os pacotes:`

npm install || yarn install

## Build 🔥🍕

npm run build || yarn run build

## Inicialização 👽

```bash

## 🤖 Inicialização ( Produção )
## OBS: Necessário realizar a BUILD

npm run bot || yarn run bot

## 🤖 Inicialização ( Desenvolvimento )

npm run dev-bot || yarn run dev-bot
