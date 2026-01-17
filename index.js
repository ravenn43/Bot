const { Telegraf } = require('telegraf');
const axios = require('axios');

const bot = new Telegraf('8519727206:AAFYEVvgZWEUoxFiJmDmhyUd-4pn9W6e9PQ'); // ← вставь сюда свой токен

// Это бесплатный ИИ (можно заменить на OpenAI, если есть ключ)
const AI_API = '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';

bot.start((ctx) => ctx.reply('Привет! Я теперь умный 😈 Пиши что угодно, я отвечу!'));

bot.on('text', async (ctx) => {
  try {
          ctx.replyWithChatAction('typing');

      // СВЕРХЯДЕРКА 2025 — работает всегда
      const apis = [
        { url: "https://api.groq.com/openai/v1/chat/completions", key: process.env.GROQ_API_KEY, model: "llama-3.1-70b-instant" },
        { url: "https://api.free-gpt.ru/v1/chat/completions", key: null, model: "claude-3.5-sonnet" },
        { url: "https://api.openrouter.ai/api/v1/chat/completions", key: process.env.OPENROUTER_KEY || "sk-or-v1-xxxx", model: "anthropic/claude-3.5-sonnet" }
      ];

      let answer = "Ща взорвусь нахуй...";
      for (const api of apis) {
        try {
          const headers = api.key ? { Authorization: `Bearer ${api.key}` } : {};
          const res = await axios.post(api.url, {
            model: api.model,
            messages: [{ role: "system", content: "Ты дерзкий матерный русский бро 2025 года" }, { role: "user", content: text }],
            temperature: 0.9,
            max_tokens: 2000
          }, { headers, timeout: 15000 });

          answer = res.data.choices[0].message.content;
          break;
        } catch (e) {
          continue;
        }
      }

      ctx.reply(answer, { parse_mode: 'Markdown' });

bot.launch();
console.log('Бот запущен!');
