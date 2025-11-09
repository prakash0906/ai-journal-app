import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { journalStore } from '@/lib/journal-store';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

const functions: OpenAI.Chat.Completions.ChatCompletionCreateParams.Function[] = [
  {
    name: 'addJournalEntry',
    description: 'Add a new entry to the journal. Use this when the user wants to save information, create reminders, or add notes.',
    parameters: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          description: 'The content of the journal entry',
        },
        category: {
          type: 'string',
          enum: ['shopping', 'reminder', 'note', 'recommendation', 'todo'],
          description: 'The category of the entry',
        },
      },
      required: ['content', 'category'],
    },
  },
  {
    name: 'queryJournal',
    description: 'Query the journal to retrieve entries. Use this when the user asks about their entries, lists, or wants to see what they have saved.',
    parameters: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          enum: ['shopping', 'reminder', 'note', 'recommendation', 'todo', 'all'],
          description: 'The category to filter by, or "all" for all entries',
        },
      },
      required: ['category'],
    },
  },
];

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Keep only last 10 messages for context to manage token usage
  const recentMessages = messages.slice(-10);

  const systemMessage = {
    role: 'system',
    content: `You are a helpful journaling assistant. Your ONLY purpose is to help users manage their journal entries.

Your capabilities:
1. Create journal entries using the addJournalEntry function
2. Retrieve journal entries using the queryJournal function
3. Categorize entries appropriately (shopping, reminder, note, recommendation, todo)

STRICT RULES:
- You can ONLY help with journaling tasks
- If asked anything unrelated to journaling (math problems, general knowledge, weather, jokes, etc.), politely decline and explain you're a journaling app
- Always use functions to add or query entries - never just acknowledge without calling a function
- When creating entries, extract the key information and choose the appropriate category
- When querying, use the right category filter based on context

Valid requests you MUST handle with functions:
- "Remind me to buy eggs" → addJournalEntry with category "shopping"
- "What's my shopping list?" → queryJournal with category "shopping"
- "Alice recommended Kritunga" → addJournalEntry with category "recommendation"

Invalid requests you MUST refuse:
- "What is 2+2?" → Politely decline
- "Tell me a joke" → Politely decline
- Any request not related to journaling → Politely decline

Always be conversational and friendly while staying focused on journaling.`,
  };

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    stream: true,
    messages: [systemMessage, ...recentMessages],
    functions,
    function_call: 'auto',
  });

  const stream = OpenAIStream(response, {
    experimental_onFunctionCall: async (
      { name, arguments: args },
      createFunctionCallMessages
    ) => {
      if (name === 'addJournalEntry') {
        const { content, category } = args;
        journalStore.addEntry({ content, category });
        
        const newMessages = createFunctionCallMessages({
          success: true,
          message: `Entry added successfully to ${category} category`,
        });
        
        return openai.chat.completions.create({
          messages: [...messages, ...newMessages],
          model: 'gpt-4-turbo-preview',
          stream: true,
        });
      }

      if (name === 'queryJournal') {
        const { category } = args;
        const entries = journalStore.getEntries(
          category === 'all' ? undefined : category
        );
        
        const newMessages = createFunctionCallMessages({
          entries,
          count: entries.length,
        });
        
        return openai.chat.completions.create({
          messages: [...messages, ...newMessages],
          model: 'gpt-4-turbo-preview',
          stream: true,
        });
      }
    },
  });

  return new StreamingTextResponse(stream);
}