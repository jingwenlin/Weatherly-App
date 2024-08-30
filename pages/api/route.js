import OpenAI from 'openai';

export default async function handler(req, res) {
  const { weatherData } = req.body;

  const description = weatherData.weather[0].description;
  const temperature = weatherData.main.temp;

  console.log('Received request to /api/route with data:', req.body);

  let openai;
  try {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log('OpenAI client initialized');
  } catch (error) {
    console.error('OpenAI Initialization Error:', error);
    return res.status(500).json({ error: 'Failed to initialize OpenAI' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that provides weather summaries.',
        },
        {
          role: 'user',
          content: `The weather is described as ${description} with a temperature of ${temperature}°F. Please provide a summary.`,
        },
      ],
      max_tokens: 50,
    });

    const summary = completion.choices[0].message.content.trim();
    return res.status(200).json({ summary });
  } catch (error) {
    console.error('Error generating summary:', error);
    return res.status(500).json({ error: 'Error generating summary' });
  }
}

