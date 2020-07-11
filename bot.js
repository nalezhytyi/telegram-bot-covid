/* eslint-disable no-console */
require('dotenv').config();
const { Telegraf } = require('telegraf');
const api = require('covid19-api');
const Markup = require('telegraf/markup');
const COUNTRIES_LIST = require('./constants');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) =>
  ctx.reply(
    `
Привет ${ctx.message.from.first_name}! 😷
Чекни статистику по Коронавирусу 🦠
Введи название страны на английском языке 🇺🇸
Примеры: /help.`,
    Markup.keyboard([
      ['US', 'RUSSIA'],
      ['UKRAINE', 'CHINA'],
    ])
      .resize()
      .extra()
  )
);
bot.help((ctx) =>
  ctx.reply(`
Вот тебе подсказка, можешь вводить эти страны:
${COUNTRIES_LIST}`)
);
bot.on('text', async (ctx) => {
  let data = {};
  try {
    data = await api.getReportsByCountries(ctx.message.text);
    const formatData = `
Страна: ${data[0][0].country}
Случаи: ${data[0][0].cases} 🤒
Смертей: ${data[0][0].deaths} 🏥
Вылечено: ${data[0][0].recovered} 🚑
  `;
    ctx.replyWithPhoto({ url: `${data[0][0].flag}` });
    ctx.reply(formatData);
  } catch {
    ctx.reply(`
Такой страны не существует! 🏳
Введи название страны на английском языке. 🇺🇸
Примеры: /help
`);
  }
});
bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.launch();
console.log('Бот онлайн');
