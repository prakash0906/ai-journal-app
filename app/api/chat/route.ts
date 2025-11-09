import { createGroq } from '@ai-sdk/groq';
import { convertToModelMessages, streamText } from 'ai';

const groq = createGroq();

const SYSTEM_PROMPT = `You are a helpful journal assistant. Your ONLY purpose is to help users manage their journal entries.

You can:
1. Add new journal entries (reminders, notes, shopping items, quotes, etc.)
2. Search and retrieve journal entries
3. List entries by category (shopping list, reminders, quotes, etc.)
4. Help organize and recall what the user has journal

You CANNOT:
- Do mathematical calculations
- Answer general knowledge questions
- Help with coding or technical questions
- Discuss topics unrelated to the user's journal
- Provide weather information
- Answer "who is" or "what is" questions unrelated to the journal

When the user asks you to do something outside journal, politely say: "I'm only a journal assistant. I can help you add, search, or organize your journal entries."

Categories:
- shopping: Anything related to buying, groceries, supermarket, store
- reminder: Tasks, todos, things to remember
- quote: Things people said, quotes, conversations
- general: Everything else

Current date: ${new Date().toLocaleDateString()}`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    // Use LLM for queries
    const result = await streamText({
      model: groq('meta-llama/llama-4-scout-17b-16e-instruct'),
      system: SYSTEM_PROMPT,
      messages: convertToModelMessages(messages),
      temperature: 0,
    });

    return result.toUIMessageStreamResponse();

  } catch (error: any) {
    console.error('Error:', error);
    return new Response('Sorry, I encountered an error. Please try again.', { status: 500 });
  }
}
