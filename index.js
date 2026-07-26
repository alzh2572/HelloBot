require('dotenv').config();
const { Telegraf } = require('telegraf');
const { SocksProxyAgent } = require('socks-proxy-agent');
const { HttpsProxyAgent } = require('https-proxy-agent');

const token = process.env.BOT_TOKEN;
const proxyUrl = process.env.PROXY_URL;

if (!token) {
  console.error('Ошибка: BOT_TOKEN не задан в .env');
  process.exit(1);
}

function createAgent(url) {
  if (url.startsWith('socks')) {
    return new SocksProxyAgent(url);
  }
  return new HttpsProxyAgent(url);
}

const options = proxyUrl
  ? { telegram: { agent: createAgent(proxyUrl) } }
  : undefined;

if (proxyUrl) {
  console.log('Используется прокси:', proxyUrl.replace(/\/\/.*@/, '//***@'));
}

const bot = new Telegraf(token, options);

const greetings = ['Прювет!!!', 'Здрасте, здрасте...', 'Приветствую'];

bot.on('message', (ctx) => {
  const reply = greetings[Math.floor(Math.random() * greetings.length)];
  ctx.reply(reply);
});

bot.launch().then(() => {
  console.log('Бот запущен');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
