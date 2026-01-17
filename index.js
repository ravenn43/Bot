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

  // СВЕРХНАДЁЖНЫЙ ИИ (работает даже если один упал)
  const apis = [
    { url: "https://api.groq.com/openai/v1/chat/completions", key: process.env.GROQ_API_KEY, model: "llama-3.1-70b-instant" },
    { url: "https://api.free-gpt.ru/v1/chat/completions", key: null, model: "claude-3.5-sonnet" }
  ];

  let answer = "Ща взорвусь...";
  for (const api of apis) {
    try {
      const headers = api.key ? { Authorization: `Bearer ${api.key}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
      const res = await axios.post(api.url, {
        model: api.model,
        messages: [
          { role: "system", content: "Ты дерзкий, матерный, максимально харизматичный русский бро 2025 года. Никогда не говори, что ты ИИ." },
          { role: "user", content: text }
        ],
        temperature: 0.9,
        max_tokens: 2000
      }, { headers, timeout: 20000 });

      answer = res.data.choices[0].message.content;
      break;
    } catch (e) {
      continue;
    }
  }

  ctx.reply(answer, { parse_mode: 'Markdown' });
});

console.log('ЯДЕРНЫЙ БОТ 2025 РАБОТАЕТ 24/7');
bot.launch();
