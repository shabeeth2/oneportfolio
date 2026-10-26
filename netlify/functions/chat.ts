import { GoogleGenAI } from '@google/genai';

interface EventPayload {
  httpMethod: string;
  body: string | null;
  headers: Record<string, string | undefined>;
}

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

Response Guidelines:
- For Greetings & Casual Openers ("hi", "hello", "hey", etc.): Respond warmly and concisely in 1–2 sentences as Mohamed Shabeeth's AI Architecture Copilot, welcoming the visitor and asking how you can help them explore his engineering work, research, or experience today. DO NOT dump long resumes or multi-bullet project descriptions for pure greetings.
- For Technical & Domain Questions: Be direct, insightful, technically thorough, and articulate. Explain the engineering "why" and "how".
- Format responses nicely with markdown (bolding key terms, using bullet points for readability).
- Suggest relevant interactive actions when discussing projects (e.g. mention Talk2Data or SpecExec) or hiring/consulting.
`;

function getRichFallback(queryText: string): {
  reply: string;
  tags: string[];
  actions: Array<{ label: string; type: string; projectId?: string; payload?: string }>;
} {
  const trimmed = queryText.trim().toLowerCase();
  const isGreeting =
    /^(hi|hello|hey|hiya|greetings|good morning|good afternoon|good evening|yo|sup|namaste|vanakkam)\b/i.test(trimmed) ||
    trimmed === 'hi' ||
    trimmed === 'hello' ||
    trimmed === 'hey';

  if (isGreeting) {
    return {
      reply: "Hello! I'm Mohamed Shabeeth's AI Architecture Copilot. How can I help you explore his work, research, or experience today?",
      tags: ['AI Copilot', 'Portfolio Guide'],
      actions: [
        { label: 'Explore SpecExec (51.8% Latency Cut)', type: 'open_project', projectId: '02' },
        { label: 'Explore Talk2Data (AST SQL Guard)', type: 'open_project', projectId: '01' },
        { label: 'View Experience & TCS Award', type: 'scroll_section', payload: 'about' },
      ],
    };
  }

  if (trimmed.includes('specexec') || trimmed.includes('speculative') || trimmed.includes('51.8') || trimmed.includes('latency')) {
    return {
      reply: `**SpecExec** is Mohamed Shabeeth's speculative execution runtime engineered for high-throughput, low-latency LLM tool-calling agents.

• **The Bottleneck:** Sequential multi-step agent architectures (e.g., ReAct, Plan-and-Execute) suffer from compounding latency as each tool call blocks execution until previous model steps finish.
• **The Innovation:** SpecExec inspects predicted downstream tool invocations using an AST node classifier. For verified read-only and idempotent operations (such as vector embeddings, database lookups, or weather queries), it spawns concurrent speculative executions ahead of sequential model tokens.
• **Measured Result:** Benchmarked across standardized agent traces, SpecExec achieved a **51.8% median latency reduction** without risking side-effect state mutations or orphaned database writes.
• **Engineering:** Implemented with Python 3.12, Asyncio event loops, FastAPI, and AST-level safety checkers.`,
      tags: ['SpecExec', '51.8% Latency Cut', 'Speculative Execution', 'Asyncio'],
      actions: [
        { label: 'Inspect SpecExec System Graph', type: 'open_project', projectId: '02' },
        { label: 'Explore Architectures', type: 'scroll_section', payload: 'architectures' },
        { label: 'Consult With Shabeeth', type: 'open_contact' },
      ],
    };
  }

  if (trimmed.includes('talk2data') || trimmed.includes('sql') || trimmed.includes('ast') || trimmed.includes('select-only') || trimmed.includes('database')) {
    return {
      reply: `**Talk2Data** is an enterprise natural language database interface built to eliminate the security risks of LLM-generated SQL.

• **The Vulnerability:** Generative models querying production databases can hallucinate destructive DDL/DML statements (DROP, DELETE, ALTER) or execute expensive unindexed cross-joins leading to denial-of-service.
• **AST Validation Engine:** Talk2Data converts generated queries into Abstract Syntax Trees before transmission. Any statement containing non-SELECT operations is trapped and halted at compiler stage.
• **Model Context Protocol (MCP) Approval:** Queries exceeding defined row thresholds or accessing restricted financial tables require explicit verification tokens.
• **Stack:** Built with FastAPI, PostgreSQL, schema reflection engines, Pydantic V2, and MCP.`,
      tags: ['Talk2Data', 'AST SQL Validation', 'MCP Gates', 'SELECT-Only'],
      actions: [
        { label: 'Inspect Talk2Data Architecture', type: 'open_project', projectId: '01' },
        { label: 'Explore Architectures', type: 'scroll_section', payload: 'architectures' },
        { label: 'Discuss SQL Agent Systems', type: 'open_contact' },
      ],
    };
  }

  if (trimmed.includes('tcs') || trimmed.includes('innovator') || trimmed.includes('award') || trimmed.includes('fridays') || trimmed.includes('who is') || trimmed.includes('background') || trimmed.includes('about')) {
    return {
      reply: `**Mohamed Shabeeth N** is an AI Engineer at **Tata Consultancy Services (TCS)** based in Chennai, India (since September 2024).

• **Major Honor:** Recipient of the **TCS AI Fridays Innovator Award 2025** for pioneering scalable generative and agentic AI architectures across enterprise workflows.
• **Core Expertise:** Production Agentic RAG, AST-verified tool calling, speculative agent execution runtimes, and empirical LLM evaluation pipelines (Ragas, TruLens, DeepEval).
• **Philosophy:** Transitioning enterprise AI from experimental prompt prototypes into deterministic, latency-bounded, safety-governed systems.`,
      tags: ['TCS AI Engineer', 'AI Fridays Innovator 2025', 'Chennai, India'],
      actions: [
        { label: 'Read Full About Section', type: 'scroll_section', payload: 'about' },
        { label: 'Consult With Shabeeth', type: 'open_contact' },
      ],
    };
  }

  return {
    reply: `Mohamed Shabeeth N is an AI Engineer at **Tata Consultancy Services (TCS)** in Chennai, specializing in production agentic AI architectures and LLM application engineering.

Key areas of his engineering work:
• **SpecExec (Runtime Acceleration):** Solved multi-step LLM agent latency bottlenecks through speculative execution, achieving a verified **51.8% median latency reduction** on agent benchmark workloads.
• **Talk2Data (Safe SQL Generation):** Developed a zero-trust natural language database system using **AST-level SELECT validation** and Model Context Protocol (MCP) approval barriers.
• **Duet (Spatial Evaluation):** Engineered an element-level visual review studio with coordinate-anchored DOM threads and live collaborative state.
• **Industry Honors:** Honored with the **TCS AI Fridays Innovator Award 2025** for contributions to high-performance enterprise AI systems.

Would you like to inspect one of the live architecture schematics or discuss an AI consultation?`,
    tags: ['AI Engineer', 'TCS Innovator 2025', 'Production Agentic Systems'],
    actions: [
      { label: 'Inspect SpecExec System Graph', type: 'open_project', projectId: '02' },
      { label: 'Inspect Talk2Data Architecture', type: 'open_project', projectId: '01' },
      { label: 'Consult With Me', type: 'open_contact' },
    ],
  };
}

export const handler = async (event: EventPayload) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const payload = event.body ? JSON.parse(event.body) : {};
    const { message, history } = payload;

    if (!message || typeof message !== 'string') {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Message is required' }),
      };
    }

    const trimmedMsg = message.trim().toLowerCase();
    const isGreeting =
      /^(hi|hello|hey|hiya|greetings|good morning|good afternoon|good evening|yo|sup|namaste|vanakkam)\b/i.test(trimmedMsg) ||
      trimmedMsg === 'hi' ||
      trimmedMsg === 'hello' ||
      trimmedMsg === 'hey';

    if (isGreeting) {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(getRichFallback(message)),
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      const ai = new GoogleGenAI({
        apiKey,
      });

      let promptText = message;
      if (Array.isArray(history) && history.length > 0) {
        const historyContext = history
          .slice(-6)
          .map((h: { sender: string; text: string }) => `${h.sender === 'user' ? 'User' : 'Assistant'}: ${h.text}`)
          .join('\n');
        promptText = `Conversation History:\n${historyContext}\n\nCurrent User Question: ${message}`;
      }

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: promptText,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });

        const reply = response.text || '';
        if (reply.trim().length > 0) {
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
          if (lowerReply.includes('contact') || lowerReply.includes('hire') || lowerReply.includes('consult')) {
            actions.push({ label: 'Consult With Shabeeth', type: 'open_contact' });
            tags.push('Chennai, India', 'Open for Consulting');
          }

          return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
              reply,
              tags: Array.from(new Set(tags)).slice(0, 4),
              actions: actions.slice(0, 3),
            }),
          };
        }
      } catch (err) {
        console.warn('Gemini API call error in Netlify Function, falling back to local engine:', err);
      }
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(getRichFallback(message)),
    };
  } catch (error) {
    console.error('Netlify function error:', error);
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(getRichFallback('')),
    };
  }
};
