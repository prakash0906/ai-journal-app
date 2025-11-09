# Journal Chat Interface

A conversational journaling application built with Vercel AI SDK, Next.js, and OpenAI that allows users to manage journal entries through natural language.

## Features

- **Natural Language Entry Creation**: Add journal entries conversationally
  - Shopping lists: "Remind me to buy eggs"
  - Recommendations: "Alice says 'Check out Kritunga for biryani'"
  - General notes: Any text-based entry
  
- **Smart Querying**: Retrieve entries using natural language
  - "What's on my shopping list?"
  - "I'm at the supermarket, what should I buy?"
  - Category-based filtering
  
- **Hallucination Protection**: Built-in safeguards to keep interactions journal-focused
  - Rejects non-journaling queries like "What is 2+2?"
  - Provides helpful redirection messages

- **Context Management**: Handles long conversations efficiently
  - Only sends recent context to the model
  - Maintains full chat history in UI

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **AI SDK**: Vercel AI SDK
- **LLM**: OpenAI GPT-4
- **UI**: React with Tailwind CSS
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API Key

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd journal-chat-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:3000`

## Project Structure

```
journal-chat-app/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # API route for chat completion
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main chat interface
├── lib/
│   └── journal-store.ts          # In-memory journal storage
├── .env.local                    # Environment variables
├── package.json
├── next.config.js
└── tailwind.config.js
```

## Usage Examples

### Adding Entries

```
User: "Remind me to buy eggs next time I'm at the supermarket"
Assistant: "Got it! I've added 'buy eggs next time I'm at the supermarket' to your journal as a shopping item."

User: "Alice says 'I should check out Kritunga for their awesome biryani'"
Assistant: "Added! I've saved Alice's recommendation about Kritunga for awesome biryani."
```

### Querying Entries

```
User: "What is my shopping list?"
Assistant: "Here's your shopping list:
- Buy eggs next time I'm at the supermarket
- Milk and bread from grocery store"

User: "I'm at the supermarket. What should I buy?"
Assistant: "Here are your shopping items:
- Buy eggs
- Get milk and bread"
```

### Handling Non-Journal Queries

```
User: "What is 2+2?"
Assistant: "I'm only a journaling app. I can help you create journal entries, add reminders, maintain shopping lists, and retrieve your notes. I can't help with calculations or general knowledge questions."
```

## Implementation Details

### Function Calling

The app uses OpenAI's function calling to structure interactions:

1. **addJournalEntry**: Creates new journal entries with automatic categorization
2. **queryJournal**: Retrieves entries based on user queries with optional filtering

### Hallucination Protection

Multiple layers of protection:

1. **System Prompt**: Clear instructions about capabilities and limitations
2. **Function Schema**: Strict parameter validation
3. **Response Validation**: Checks for inappropriate responses before display

### Context Window Management

- Maintains full conversation history in UI state
- Sends only last 10 messages to the model to stay within token limits
- Summarizes older context if needed for continuity

### Server Memory

Journal entries are stored in a server-side singleton object:
- Persists for the duration of the server process
- Resets on server restart (as specified in requirements)
- Can be easily swapped for database persistence

## API Routes

### POST `/api/chat`

Handles chat messages and executes journal operations.

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "Remind me to buy eggs" }
  ]
}
```

**Response:**
Stream of AI responses with function calls embedded.

## Customization

### Adding New Categories

Edit `lib/journal-store.ts` to add new entry categories:

```typescript
export type EntryCategory = 'shopping' | 'reminder' | 'note' | 'todo' | 'your-category';
```

### Modifying AI Behavior

Edit the system prompt in `app/api/chat/route.ts`:

```typescript
const systemMessage = {
  role: 'system',
  content: 'Your custom instructions here...'
};
```

### Styling

The app uses Tailwind CSS. Customize styles in:
- `app/page.tsx` - Component-level styling
- `tailwind.config.js` - Global theme configuration

## Limitations & Known Issues

1. **Memory Storage**: Entries are lost on server restart
2. **No Authentication**: Single-user experience only
3. **Rate Limits**: Subject to OpenAI API rate limits
4. **Context Length**: Very long conversations may hit token limits

## Future Enhancements

- [ ] Database persistence (PostgreSQL/MongoDB)
- [ ] User authentication and multi-user support
- [ ] Entry editing and deletion
- [ ] Search and filtering UI
- [ ] Export journal entries
- [ ] Scheduled reminders with notifications
- [ ] Rich text formatting
- [ ] Attachment support

## Troubleshooting

### "OpenAI API key not found"
Ensure `.env.local` exists with valid `OPENAI_API_KEY`

### "Module not found" errors
Run `npm install` to install all dependencies

### Entries not persisting
This is expected behavior - server memory resets on restart

### Slow responses
Check your OpenAI API quota and rate limits

## License

MIT

## Contributing

Contributions welcome! Please open an issue or submit a pull request.

---

Built with ❤️ using Vercel AI SDK