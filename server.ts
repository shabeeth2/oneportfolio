import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';

function getPort(): number {
  const portArgIndex = process.argv.indexOf('--port');
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    const parsed = Number(process.argv[portArgIndex + 1]);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  // In development, the dev server must run on port 3000
  if (!isProduction) {
    return 3000;
  }
  return Number(process.env.PORT) || 3000;
}

function getHost(): string {
  const hostArgIndex = process.argv.indexOf('--host');
  if (hostArgIndex !== -1 && process.argv[hostArgIndex + 1]) {
    return process.argv[hostArgIndex + 1];
  }
  return '0.0.0.0';
}

const PORT = getPort();
const HOST = getHost();

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTION = `You are the AI Architecture & Portfolio Copilot for Mohamed Shabeeth N.
You speak with professional technical authority, clarity, and precision as an AI Engineering assistant representing Shabeeth.

Key Profile & Background:
- Role: AI Engineer at Tata Consultancy Services (TCS), Chennai, India (since September 2024).
- Key Recognition: Recipient of the prestigious TCS AI Fridays Innovator Award 2025 for breakthrough work on enterprise LLM & Agentic architectures.
- Specialization: Production Agentic RAG, Tool-Calling Systems, Speculative Execution for LLMs, Safe Query Orchestration, LLM Evaluation & Guardrails.
- Contact: mohamed.shabeeth@gmail.com | Based in Chennai, Tamil Nadu, India. Open for consulting, architectural advisory, and technical engineering engagements.

Key Projects & Deep Technical Specs:
1. Talk2Data (Natural Language to SQL Agent):
   - Problem: Enterprise SQL generation by LLMs risks data corruption, SQL injection, and hallucinated schema joins.
   - Solution: AST-level SQL validation parser that strictly enforces SELECT-only query constructs.
   - Architecture: Integrates Model Context Protocol (MCP) approval gates prior to database driver execution. Built with FastAPI, PostgreSQL, and schema-constrained tool-calling.
   - Project ID: '01'

2. SpecExec (Speculative Execution Runtime for LLM Agents):
   - Problem: Sequential multi-step agent tool calling creates crippling end-to-end latency in production.
   - Solution: Speculative execution runtime that concurrently predicts and launches read-only side-effect-free tool calls ahead of sequential model steps.
   - Metric: Achieved a validated 51.8% median latency reduction across simulated agent benchmark traces without risking unauthorized data mutations.
   - Project ID: '02'

3. Duet (Visual Review & Element-Level Annotation Studio):
   - Problem: Reviewing human and AI-generated web interfaces lacks granular, coordinate-anchored spatial feedback.
   - Solution: DOM coordinate-anchored comment threads with live collaborative state, automated layout checks, and self-contained static HTML bundle export.
   - Tech: FastAPI, PostgreSQL, WebSocket/SSE live sync, HTML5 DOM traversal.
   - Project ID: '03'

Core Skills & Stack:
- Architectures: Agentic RAG, ReAct, Plan-and-Execute, Speculative Multi-agent Execution, Model Context Protocol (MCP), AST Validation.
- RAG & Vector: Hybrid search (BM25 + Dense vector embeddings), Cross-encoder reranking, Query routing, Self-reflective validation (corrective RAG), Chunking strategies. Vector databases: Qdrant, Pinecone, Chroma, pgvector.
- Evaluation & Guardrails: Ragas, TruLens, DeepEval, NeMo Guardrails, Llama Guard.
- Engineering: Python (Asyncio), FastAPI, TypeScript, React, Docker, Linux, Git.

Response Guidelines:
- Answer directly and concisely in 1–2 crisp, impactful sentences.
- Never output long essay walls, multi-bullet lists, or verbose disclaimers.
- Focus on the core engineering value and keep responses minimal.
- Suggest relevant interactive actions when discussing projects or consulting.
`;

// Rich fallback knowledge dictionary for instantaneous answers if external API is rate-limited or busy
function getRichFallback(queryText: string): { reply: string; tags: string[]; actions: Array<{ label: string; type: string; projectId?: string; payload?: string }> } {
  const trimmed = queryText.trim().toLowerCase();
  const isGreeting = /^(hi|hello|hey|hiya|greetings|good morning|good afternoon|good evening|yo|sup|namaste|vanakkam)\b/i.test(trimmed) || trimmed === 'hi' || trimmed === 'hello' || trimmed === 'hey';

  if (isGreeting) {
    return {
      reply: "Hello! I'm Mohamed Shabeeth's AI Architecture Copilot. How can I help you explore his work or systems today?",
      tags: [],
      actions: [
        { label: 'Inspect SpecExec', type: 'open_project', projectId: '02' },
        { label: 'Inspect Talk2Data', type: 'open_project', projectId: '01' },
      ],
    };
  }

  const q = trimmed;

  if (q.includes('specexec') || q.includes('speculative') || q.includes('51.8') || q.includes('latency')) {
    return {
      reply: `**SpecExec** is a speculative execution runtime that concurrently precomputes read-only tool calls mid-stream, cutting median latency by **51.8%** on simulated agent benchmarks without risking side effects.`,
      tags: [],
      actions: [
        { label: 'Inspect SpecExec', type: 'open_project', projectId: '02' },
      ],
    };
  }

  if (q.includes('talk2data') || q.includes('sql') || q.includes('ast') || q.includes('select-only') || q.includes('database')) {
    return {
      reply: `**Talk2Data** is a natural language database interface with compiler-level **SELECT-only AST validation** and Model Context Protocol (MCP) approval gates for zero-trust query execution.`,
      tags: [],
      actions: [
        { label: 'Inspect Talk2Data', type: 'open_project', projectId: '01' },
      ],
    };
  }

  if (q.includes('duet') || q.includes('review') || q.includes('annotation') || q.includes('artifact')) {
    return {
      reply: `**Duet** is a visual artifact review studio for human and AI-generated HTML, featuring element-level DOM coordinate annotations and standalone bundle export.`,
      tags: [],
      actions: [
        { label: 'Inspect Duet', type: 'open_project', projectId: '03' },
      ],
    };
  }

  if (q.includes('tcs') || q.includes('innovator') || q.includes('award') || q.includes('fridays') || q.includes('who is') || q.includes('background') || q.includes('about')) {
    return {
      reply: `**Mohamed Shabeeth N** is an AI Engineer at **TCS Chennai** and recipient of the **TCS AI Fridays Innovator Award 2025**, specializing in production Agentic RAG and AST-governed tool calling.`,
      tags: [],
      actions: [
        { label: 'View About', type: 'scroll_section', payload: 'about' },
        { label: 'Consult', type: 'open_contact' },
      ],
    };
  }

  if (q.includes('contact') || q.includes('hire') || q.includes('consult') || q.includes('email') || q.includes('collaborate')) {
    return {
      reply: `Mohamed Shabeeth is available for enterprise consulting and AI architecture advisory at **mohamed.shabeeth@gmail.com**.`,
      tags: [],
      actions: [
        { label: 'Contact', type: 'open_contact' },
      ],
    };
  }

  return {
    reply: `Mohamed Shabeeth N is an AI Engineer at TCS specializing in production Agentic RAG, AST-verified SQL tool calling (Talk2Data), and speculative execution runtimes (SpecExec).`,
    tags: [],
    actions: [
      { label: 'Inspect SpecExec', type: 'open_project', projectId: '02' },
      { label: 'Inspect Talk2Data', type: 'open_project', projectId: '01' },
    ],
  };
}

async function startServer() {
  const app = express();

  app.use(express.json());

  // API endpoint for AI portfolio assistant with intelligent multi-tier fallback
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Message is required' });
        return;
      }

      const trimmedMsg = message.trim().toLowerCase();
      const isGreeting =
        /^(hi|hello|hey|hiya|greetings|good morning|good afternoon|good evening|yo|sup|namaste|vanakkam)\b/i.test(trimmedMsg) ||
        trimmedMsg === 'hi' ||
        trimmedMsg === 'hello' ||
        trimmedMsg === 'hey';

      // For casual greetings, return the warm friendly greeting with interactive action chips instantly
      if (isGreeting) {
        const greetingResponse = getRichFallback(message);
        res.json(greetingResponse);
        return;
      }

      // Format previous chat history if provided
      let promptText = message;
      if (Array.isArray(history) && history.length > 0) {
        const historyContext = history
          .slice(-6)
          .map((h: { sender: string; text: string }) => `${h.sender === 'user' ? 'User' : 'Assistant'}: ${h.text}`)
          .join('\n');
        promptText = `Conversation History:\n${historyContext}\n\nCurrent User Question: ${message}`;
      }

      let reply = '';

      const withTimeout = <T>(promise: Promise<T>, ms = 4500): Promise<T> =>
        Promise.race([
          promise,
          new Promise<T>((_, reject) => setTimeout(() => reject(new Error('LLM call timeout')), ms)),
        ]);

      if (process.env.GEMINI_API_KEY) {
        // Try tier 1: gemini-3.8-flash with timeout
        try {
          const response = await withTimeout(
            ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: promptText,
              config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                temperature: 0.7,
              },
            }),
            4500
          );
          reply = response.text || '';
        } catch (tier1Err) {
          console.warn('Gemini 3.8 flash call encountered timeout or error, trying flash-lite fallback:', tier1Err);
          try {
            // Try tier 2: gemini-3.1-flash-lite with quick timeout
            const responseLite = await withTimeout(
              ai.models.generateContent({
                model: 'gemini-3.1-flash-lite',
                contents: promptText,
                config: {
                  systemInstruction: SYSTEM_INSTRUCTION,
                  temperature: 0.7,
                },
              }),
              3000
            );
            reply = responseLite.text || '';
          } catch (tier2Err) {
            console.warn('Gemini 3.1 flash lite also unavailable or timed out, using rich knowledge fallback:', tier2Err);
          }
        }
      }

      // If live Gemini responded, parse and build actions/tags
      if (reply && reply.trim().length > 0) {
        const lowerReply = (reply + ' ' + message).toLowerCase();
        const actions: Array<{ label: string; type: string; projectId?: string; payload?: string }> = [];
        const tags: string[] = [];

        if (lowerReply.includes('specexec') || lowerReply.includes('51.8') || lowerReply.includes('latency')) {
          actions.push({ label: 'Inspect SpecExec Architecture', type: 'open_project', projectId: '02' });
          tags.push('SpecExec', '51.8% Latency Cut');
        }
        if (lowerReply.includes('talk2data') || lowerReply.includes('ast') || lowerReply.includes('sql')) {
          actions.push({ label: 'Inspect Talk2Data Architecture', type: 'open_project', projectId: '01' });
          tags.push('Talk2Data', 'AST Validation');
        }
        if (lowerReply.includes('duet') || lowerReply.includes('annotation') || lowerReply.includes('review studio')) {
          actions.push({ label: 'Inspect Duet Review Studio', type: 'open_project', projectId: '03' });
          tags.push('Duet Studio');
        }
        if (lowerReply.includes('contact') || lowerReply.includes('hire') || lowerReply.includes('consult') || lowerReply.includes('email') || lowerReply.includes('reach')) {
          actions.push({ label: 'Consult With Shabeeth', type: 'open_contact' });
          tags.push('Chennai, India', 'Open for Consulting');
        }

        const trimmedMsg = message.trim().toLowerCase();
        const isUserGreeting = /^(hi|hello|hey|hiya|greetings|good morning|good afternoon|good evening|yo|sup|namaste|vanakkam)\b/i.test(trimmedMsg) || trimmedMsg === 'hi' || trimmedMsg === 'hello' || trimmedMsg === 'hey';

        if (isUserGreeting && actions.length === 0) {
          actions.push(
            { label: 'Explore SpecExec (51.8% Latency Cut)', type: 'open_project', projectId: '02' },
            { label: 'Explore Talk2Data (AST SQL Guard)', type: 'open_project', projectId: '01' },
            { label: 'View Experience & TCS Award', type: 'scroll_section', payload: 'about' },
          );
          tags.push('AI Copilot', 'Portfolio Guide');
        }

        res.json({
          reply,
          tags: Array.from(new Set(tags)).slice(0, 4),
          actions: actions.slice(0, 3),
        });
        return;
      }

      // If API was unavailable or errored out, seamlessly return rich domain response (never an error or vague stub!)
      const fallback = getRichFallback(message);
      res.json(fallback);
    } catch (err) {
      console.error('Unhandled chat endpoint error:', err);
      const fallback = getRichFallback(req.body?.message || '');
      res.json(fallback);
    }
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  if (!isProduction) {
    // Mount Vite middleware in development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
