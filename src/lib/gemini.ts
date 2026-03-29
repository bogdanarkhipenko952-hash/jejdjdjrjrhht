import { GoogleGenAI, ThinkingLevel } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const searchJobs = async (category: string, budget: string, timeframe: string) => {
  const now = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
  const todayDate = new Date().toLocaleDateString('ru-RU', { timeZone: 'Europe/Moscow' });

  const prompt = `
Текущее время и дата (МСК): ${now}. Сегодняшняя дата: ${todayDate}.

Ты — продвинутый AI-ассистент для поиска СВЕЖИХ разовых заказов (фриланс, подработка).
Пользователь ищет заказы по категории: "${category}".
Желаемый бюджет: около ${budget} руб.
Свежесть: СТРОГО за последние ${timeframe} (относительно текущего времени ${now}).

ТВОЯ ЗАДАЧА:
1. Использовать Google Search для поиска по открытым Telegram-каналам (используй site:t.me/s/ или популярные агрегаторы вакансий).
2. Искать в популярных чатах и каналах для фрилансеров.
3. КРИТИЧЕСКИ ВАЖНО: ОТФИЛЬТРОВАТЬ старые вакансии. Если вакансия опубликована вчера или раньше — ИГНОРИРУЙ ЕЁ. Ищи только вакансии за ${todayDate} или опубликованные буквально только что.
4. Найти 3-5 максимально релевантных и свежих заказов (именно разовые задачи, не постоянная работа).
5. В поле "url" ОБЯЗАТЕЛЬНО указывать прямую ссылку на КОНКРЕТНЫЙ ПОСТ (например, https://t.me/freelance_ru/12345), а не просто на канал (не https://t.me/freelance_ru). Это очень важно!

Ответь СТРОГО в формате JSON (массив объектов). Никакого текста до или после JSON.
Формат объекта:
{
  "id": "уникальный_строковый_id",
  "title": "Название задачи",
  "description": "Краткое описание задачи",
  "price": "Цена (число или строка, например '5000 руб')",
  "timePosted": "Точное время публикации (например, 'Сегодня в 14:30' или '15 минут назад')",
  "source": "Название канала/чата",
  "url": "Ссылка на конкретный пост (https://t.me/.../...)"
}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
        tools: [{ googleSearch: {} }],
        toolConfig: { includeServerSideToolInvocations: true },
      }
    });

    const text = response.text || '';
    // Extract JSON from markdown if present
    const jsonMatch = text.match(/```(?:json)?\n([\s\S]*?)\n```/) || text.match(/\[\s*\{[\s\S]*\}\s*\]/);
    const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
    
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error searching jobs:", error);
    throw error;
  }
};
