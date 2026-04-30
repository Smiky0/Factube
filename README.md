# Factube

Factube is an automated fact-checking platform that leverages generative AI to analyze YouTube video transcripts and identify claims that require verification. The system employs web search integration and multi-model AI redundancy to ensure accurate, current fact-checking against real-time information.

## Overview

Factube addresses the challenge of identifying potentially false or misleading claims in video content by automating the fact-checking process. Rather than relying solely on LLM training data—which becomes outdated—the platform performs real-time web searches to verify claims against current information before rendering verdicts.

The architecture separates concerns into a React-based frontend for user interaction and a Node.js/Hono backend for transcript extraction, web search integration, and AI-powered fact-checking.

## Architecture

### Technology Stack

**Frontend:**
- React 19 with TypeScript
- Vite for build tooling and development server
- TailwindCSS 4 for styling
- React Router for navigation
- Motion for animations
- Hugeicons for icon components
- YouTubei.js for YouTube metadata extraction

**Backend:**
- Node.js with TypeScript
- Hono framework for HTTP routing and middleware
- Generative AI models: Google Gemini, Groq (Mixtral), and OpenRouter (Llama)
- Supabase PostgreSQL for conclusion caching
- YouTube Transcript Plus for transcript extraction
- DuckDuckGo API for web search (no key required)

## Generative AI Architecture

Factube employs a multi-model approach to ensure reliability and accuracy:

### Primary Models
1. **Google Gemini** (Primary) - Flash model with thinking capabilities and native web search support
2. **Groq Mixtral** (Fallback) - Low-latency open-weight model
3. **OpenRouter Llama 70B** (Final fallback) - Robust open-source model

### AI-Powered Workflow

The fact-checking pipeline operates as follows:

1. **Transcript Extraction**: System retrieves YouTube video transcript using YouTubei.js
2. **Claim Extraction**: Identifies hard factual claims (statistics, dates, attributions, scientific claims)
3. **Web Search Context**: Performs targeted searches for major claims using DuckDuckGo
4. **Fact-Checking with AI**: Sends transcript + search results to generative AI with explicit instructions to prioritize current search data over training data
5. **Verdict Assignment**: AI assigns verdicts (true/false/misleading/unverifiable) with confidence scores
6. **Persistence**: Results are cached in Supabase to avoid re-processing

### Prompt Engineering

The system uses carefully crafted system and user prompts that:
- Emphasize prioritizing web search results over model training data
- Define clear verdict categories
- Request structured JSON output
- Include confidence scoring
- Extract and classify ignored content (humor, opinions, anecdotes)

## Project Structure

```
factube/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── VideoDetails.tsx    # Video metadata display
│   │   │   ├── TranscriptContent.tsx # Fact-checking results display
│   │   │   ├── StatusScreen.tsx    # Loading/error states
│   │   │   └── Footer.tsx
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── About.tsx
│   │   │   └── NotFound.tsx
│   │   ├── lib/
│   │   │   ├── fetchVideoDetails.ts
│   │   │   └── youtubeParser.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── server/                         # Node.js/Hono backend
│   ├── src/
│   │   ├── lib/
│   │   │   ├── geminiClient.ts     # Gemini AI integration
│   │   │   ├── groqClient.ts       # Groq AI integration
│   │   │   ├── openRouterClient.ts # OpenRouter AI integration
│   │   │   ├── supabaseClient.ts   # Database connection
│   │   │   ├── webSearch.ts        # Web search utility
│   │   │   └── prompt.ts           # AI system/user prompts
│   │   ├── services/
│   │   │   ├── factCheck.ts        # Orchestrates AI models with fallbacks
│   │   │   ├── getTranscript.ts    # YouTube transcript extraction
│   │   │   ├── getVideoDetails.ts  # Video metadata retrieval
│   │   │   ├── ytParser.ts         # URL parsing utilities
│   │   │   └── databaseAction.ts   # Supabase operations
│   │   └── index.ts                # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

## Setup and Installation

### Prerequisites

- Node.js 18+ and pnpm
- YouTube video URLs for testing
- API keys for:
  - Google Gemini API
  - Groq API
  - OpenRouter API
  - Supabase PostgreSQL instance

### Environment Configuration

Create a `.env` file in the `server/` directory:

```env
# AI Models
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
OPENROUTER_API_KEY=your_openrouter_api_key

# Database
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Frontend communication
CLIENT_URL=http://localhost:5173
```

### Installation

```bash
# Install client dependencies
cd client
pnpm install

# Install server dependencies
cd ../server
pnpm install
```

### Development

In separate terminals:

```bash
# Terminal 1: Start backend (port 3000)
cd server
pnpm run dev

# Terminal 2: Start frontend (port 5173)
cd client
pnpm run dev
```

Navigate to `http://localhost:5173` in your browser.

### Build for Production

```bash
# Build client
cd client
pnpm run build

# Build server
cd server
pnpm run build
```

Start production server with `pnpm start`.

## API Endpoints

### GET /api/video_details

Retrieves YouTube video metadata.

**Query Parameters:**
- `q` (required): YouTube video ID

**Response:**
```json
{
  "basic_info": {
    "title": "string",
    "author": "string",
    "thumbnail": [{"url": "string"}],
    "like_count": "number"
  },
  "secondary_info": {
    "owner": {
      "subscriber_count": {"text": "string"}
    }
  }
}
```

### POST /url

Triggers fact-checking for a YouTube video. Returns cached results if available, otherwise extracts transcript and performs AI fact-checking.

**Query Parameters:**
- `q` (required): YouTube video ID

**Response:**
```json
{
  "conclusion": {
    "overall_verdict": "true|false|misleading|unverifiable",
    "summary": "string",
    "claims": [
      {
        "id": "number",
        "timestamp_seconds": "number",
        "claim": "string",
        "verdict": "true|false|misleading|unverifiable",
        "explanation": "string",
        "source": "string|null",
        "confidence": "number (0.0-1.0)"
      }
    ],
    "ignored": [
      {
        "timestamp_seconds": "number",
        "reason": "humor|opinion|anecdote|filler",
        "text": "string"
      }
    ]
  }
}
```

## Fact-Checking Logic

### Claim Classification

The system extracts and classifies content as:
- **Claims**: Verifiable factual statements requiring fact-checking
- **Ignored**: Opinions, humor, anecdotes, filler content (not fact-checked)

### Verdict Definitions

- **True**: Factually accurate according to current web search results
- **False**: Factually incorrect according to current web search results
- **Misleading**: Technically true but presented deceptively or lacks critical context
- **Unverifiable**: Cannot be confirmed despite web search attempts

### Confidence Scoring

Confidence (0.0 to 1.0) reflects the certainty of the verdict based on search result quality and relevance. Low confidence indicates ambiguous findings or limited search results.

## Error Handling and Resilience

The system implements graceful degradation:

1. **Model Fallback Chain**: If Gemini fails (quota exceeded, rate limit), system automatically attempts Groq, then OpenRouter
2. **Search Failure Handling**: Web search failures are logged but don't block fact-checking; AI proceeds with training data if search unavailable
3. **Database Caching**: Results are cached to reduce redundant API calls and provide faster repeated lookups
4. **Rate Limiting**: API implements IP-based rate limiting (10 requests per minute) to prevent abuse

## Performance Considerations

- Transcript extraction typically takes 2-5 seconds depending on video length
- AI fact-checking with web search context averages 5-15 seconds
- Database lookups are sub-100ms for cached results
- Web search operations are parallelized for major claims to minimize latency

## Development Guidelines

### Code Style
- TypeScript for type safety across the stack
- ESLint configuration enforces consistent formatting
- Functional components in React with hooks
- Error handling with try-catch blocks and explicit error messaging

### Git Workflow
- Feature branches off main
- Descriptive commit messages
- Pull requests require review before merge

### Testing Recommendations
- Unit tests for prompt engineering logic
- Integration tests for API endpoints
- End-to-end tests for fact-checking workflows
- Load testing for concurrent requests

## Known Limitations

1. **YouTube Transcripts**: Only works with videos that have transcripts available; some videos lack manual or auto-generated transcripts
2. **Web Search Context**: DuckDuckGo API has rate limits; high-volume deployments should consider premium search APIs
3. **AI Model Accuracy**: Fact-checking quality depends on model capabilities; edge cases may require manual review
4. **Language Support**: Currently optimized for English-language content
5. **Real-time Updates**: Supabase caching means updates require manual invalidation or cache expiry logic

## Future Enhancements

- Multi-language support with automatic translation
- Advanced caching with TTL-based invalidation
- Custom search providers (Google Search, Bing) with fallback chains
- Claim ranking by relevance and impact
- Citation extraction from search results
- Fact-checker dashboard for result analytics
- API authentication and usage tracking

## Contributing

Contributions are welcome. Ensure all changes:
- Pass TypeScript compilation
- Follow ESLint rules
- Include error handling
- Are tested manually with various YouTube URLs
- Update documentation if API contracts change

## License

MIT LICENSE

## Support

For issues, feature requests, or questions, please open an issue on the project repository.
