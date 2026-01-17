const { Telegraf } = require('telegraf');
const axios = require('axios');

const bot = new Telegraf('8519727206:AAFYEVvgZWEUoxFiJmDmhyUd-4pn9W6e9PQ'); // ← вставь сюда свой токен

// Это бесплатный ИИ (можно заменить на OpenAI, если есть ключ)
const AI_API = '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';

bot.start((ctx) => ctx.reply('Привет! Я теперь умный 😈 Пиши что угодно, я отвечу!'));

bot.on('text', async (ctx) => {
  try {
    ctx.replyWithChatAction('typing');
    
    const response = await axios.post(AI_API, {
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: ctx.message.text }],
      temperature: 0.8
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    const answer = response.data.choices[0].message.content;
    ctx.reply(answer);
  } catch (error) {
    ctx.reply('Что-то пошло не так... Попробуй ещё раз)');
  }
});

bot.launch();
console.log('Бот запущен!');
