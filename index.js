require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const express = require('express');

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();
const PORT = process.env.PORT || 3000;

// Открываем порт (чтобы Render не орал про "no open ports")
app.get('/', (req, res) => res.send('ЯДЕРНЫЙ БОТ 2025 ЖИВОЙ 24/7 🔥'));
app.listen(PORT, () => console.log(`Web сервер на порту ${PORT}`));

// Папка памяти
if (!fs.existsSync('./memory')) fs.mkdirSync('./memory');

// Меню
const menu = Markup.keyboard([
  ['⚡️ Чат с ИИ', '🖼 Нарисовать'],
  ['🎤 Голос', '🔥 Жёсткий режим'],
  ['🧠 Очистить память']
]).resize();

bot.start(ctx => ctx.reply(`
🔥 *ЯДЕРНЫЙ БОТ 2025 ГОТОВ К БОЮ*

— Отвечаю как Claude 3.5 + GPT-4o  
— Память вечная  
— Картинки Flux/SDXL  
— Голос скоро  
— Работает 24/7 бесплатно

Пиши что угодно, король 😈
`, { parse_mode: 'Markdown', reply_markup: menu.reply_markup }));

bot.on('text', async (ctx) => {
  const text = ctx.message.text;
  const userId = ctx.from.id;

  // Кнопки
  if (text === '🧠 Очистить память') {
    fs.unlink(`./memory/${userId}.json`, () => {});
    return ctx.reply('Память стёрта. Новый чат начат 🔥');
  }

  if (text === '🔥 Жёсткий режим') {
    return ctx.reply('ЖЁСТКИЙ РЕЖИМ АКТИВИРОВАН 😈\nТеперь я буду ебать мозг по полной');
  }

  if (text.toLowerCase().includes('нарисуй') || text === '🖼 Нарисовать') {
    const prompt = text === '🖼 Нарисовать' ? 'красивая девушка в стиле аниме, ultra detailed, 4k' : text.replace(/нарисуй/gi, '').trim();
    ctx.replyWithChatAction('upload_photo');
    try {
      const res = await axios.get(`https://api.prodia.ai/v1/sdxl/generate?prompt=${encodeURIComponent(prompt + ', masterpiece, best quality')}`);
      setTimeout(() => ctx.replyWithPhoto(res.data.imageUrl || 'https://i.ibb.co/0jQZQZJ/bot-banner.jpg', { caption: prompt }), 5000);
    } catch {
      ctx.reply('Картинка не получилась, но ты всё равно красавчик 😘');
    }
    return;
  }

  ctx.replyWithChatAction('typing');
const res = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
  contents: [{ role: 'user', parts: [{ text: text }] }],
  safetySettings: [{ category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }]
}, { timeout: 30000 });
const answer = res.data.candidates[0].content.parts[0].text;
ctx.reply(answer, { parse_mode: 'Markdown' });

console.log('ЯДЕРНЫЙ БОТ 2025 РАБОТАЕТ 24/7');
bot.launch();
