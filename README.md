# NovaRetail IT Support Agentic RAG Copilot

An end-to-end Forward Deployed Engineer (FDE) project for a fictional retail company's internal IT support team. The application combines LangGraph, OpenAI chat and embeddings, a private Pinecone knowledge base, Tavily web search, FastAPI, and two web interfaces: a built-in HTML/CSS/JavaScript interface and a separate Next.js frontend.

> **Project status:** The API, agent workflow, ingestion code, sample knowledge base, audit logging, and both interfaces are in this repository. Running chat and indexing requires installed dependencies, service credentials, and network access.

## Deploy to Vercel

Import this repository with the **Services** preset. `vercel.json` deploys the Next.js interface as `frontend` at `/` and the FastAPI service as `api` at `/api/*`. The browser calls the API through the same domain, so no service binding is needed. `Agentic-RAG-Demo/` is reference material and is not deployed as a service.

Set `OPENAI_API_KEY`, `PINECONE_API_KEY`, and `TAVILY_API_KEY` in the Vercel project's environment variables before using chat. Set `ADMIN_API_KEY` to a long, unique secret if document upload is needed. With no admin key configured, uploads are disabled. The Pinecone index must have the dimension required by `EMBEDDING_MODEL` (1536 for the default model); the application will fail with a configuration error instead of deleting an incompatible index.

Vercel functions use temporary storage. Uploaded files and the SQLite audit database are stored under `/tmp` there, and may disappear between invocations. Ingested vectors persist in Pinecone. Use a durable database if audit retention is required. The API does not authenticate chat requests; add access protection before using this as a private IT service.

## 1. Business problem

**Customer:** NovaRetail, a fictional company with roughly 3,000 employees.

The IT team maintains internal instructions for VPN access, password resets, MFA, software installation, and lost devices. Employees may still open repetitive tickets because the right document is hard to find, search results can be noisy, and a general chatbot can invent company policy. Current vendor outages may also require information newer than the private knowledge base.

For example:

- **“How do I connect to the company VPN from home?”** The sample handbook contains company-specific steps. The copilot should use private knowledge.
- **“What is the latest Microsoft Teams outage guidance?”** If the private documents are insufficient, the workflow can search the public web and label the answer as external information.

The goal is to search private documents first, judge whether they support an answer, use web search when needed, retry weak searches with a rewritten query, and show the decision path.

## 2. Why this is an FDE project

The project connects a customer support problem to a usable application:

```text
Customer support problem
  → private document ingestion
  → vector search and evidence grading
  → conditional agent workflow
  → API and employee interface
  → audit trail and operational feedback
```

The repository includes these application layers. Production hardening, deployment packaging, and automated end-to-end coverage remain future work.

## 3. Architecture

```text
Employee
   │
   ├── FastAPI-served UI (/) ───────────────────────┐
   └── Next.js UI (localhost:3000) ── /api rewrite ┤
                                                   ▼
                                         FastAPI (localhost:8080)
                                         /api/chat  /api/ingest
                                                   │
                                                   ▼
                                            LangGraph workflow
                                               │         │
                                    private KB │         │ weak evidence
                                               ▼         ▼
                                      Pinecone index   Tavily search
                                      OpenAI embeddings    │
                                               └────┬──────┘
                                                    ▼
                                      OpenAI answer generation
                                                    │
                                      answer + sources + trace
                                                    │
                                           SQLite query audit
```

The backend serves its built-in UI at `http://127.0.0.1:8080/`. The separate Next.js UI runs at `http://localhost:3000/` and forwards `/api/*` requests to the backend through `frontend/next.config.ts`.

## 4. Agentic RAG workflow

The graph in `app/rag/workflow.py` follows this path:

```text
Question
  ↓
Route question with OpenAI
  ├── Greeting or simple chat → direct response
  └── IT support question
       ↓
     Retrieve private Pinecone documents
       ↓
     Grade private evidence
       ├── Good → answer from private KB, with source filenames
       └── Weak → search Tavily
                    ↓
                  Grade web evidence
                    ├── Good → answer from web, labeled external
                    └── Weak → rewrite query and retry retrieval
                                  ↓
                              Retry limit reached?
                                └── Yes → insufficient-evidence response
```

The workflow permits up to `MAX_RETRIES` query rewrites (default: `1`). A retry goes back through private retrieval and grading before any further web search. The API returns the answer, `source_used`, trace messages, citations when available, and the final query text. Branch decisions depend on model output and retrieved evidence, so demo paths are examples rather than guarantees.

## 5. Technology stack

| Layer | Technology | Role in this repository |
| --- | --- | --- |
| Workflow | LangGraph | Stateful routing and conditional transitions |
| Chat model | OpenAI via `ChatOpenAI` | Routing, grading, rewriting, and answers |
| Embeddings | OpenAI `text-embedding-3-small` by default | Vectorizing private documents and questions |
| Vector database | Pinecone | Private knowledge retrieval |
| External search | Tavily | Fallback for weak private evidence |
| API | FastAPI | Health, chat, and document ingestion endpoints |
| Built-in UI | Jinja2, HTML, CSS, JavaScript | Interface served by FastAPI |
| Separate UI | Next.js, React, Tailwind CSS | Alternate interface with an API proxy |
| Audit | SQLite | Stores questions, source selection, and trace |

The current code does not use Groq or HuggingFace embeddings, despite their presence in the reference project. No Dockerfile is present.

## 6. Project structure

```text
NovaRetail/
├── app/
│   ├── api/routes.py           # Health, chat, and upload endpoints
│   ├── core/config.py          # Environment settings and paths
│   ├── core/logging.py         # Logging setup
│   ├── rag/state.py            # Graph state and structured decisions
│   ├── rag/vectorstore.py      # OpenAI embeddings and Pinecone access
│   ├── rag/workflow.py         # LangGraph decision flow
│   ├── services/audit.py       # SQLite audit records
│   ├── services/ingestion.py   # PDF/TXT/MD/DOCX loading and chunking
│   └── main.py                 # FastAPI app and built-in UI
├── data/sample_kb/             # Sample company handbook and runbook
├── frontend/                   # Separate Next.js interface
├── static/                     # Built-in UI styles and JavaScript
├── templates/index.html        # Built-in UI page
├── uploads/                    # Uploaded documents at runtime
├── .env.example
├── ingest_sample_kb.py         # Index sample documents
├── requirements.txt
├── run.py                      # Starts Uvicorn on 127.0.0.1:8080
└── README.md
```

`Agentic-RAG-Demo/` is separate reference material inside this directory. The `tests/` directory exists but currently contains no tests.

## 7. Local setup

Run these commands from the `NovaRetail/` directory.

### Step 1 — Create and activate a virtual environment

macOS/Linux:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Windows PowerShell:

```powershell
py -m venv .venv
.venv\Scripts\Activate.ps1
```

### Step 2 — Install Python dependencies

```bash
python -m pip install -r requirements.txt
```

Run the command with the environment active. `python-docx` supplies the `docx` import used by ingestion; `pypdf` supports PDF loading. If `pip` alone is unavailable, `python -m pip` still targets the active Python interpreter.

### Step 3 — Configure `.env`

Copy the starter file, then add the variables below:

```bash
cp .env.example .env
```

```dotenv
OPENAI_API_KEY=your_openai_api_key
TAVILY_API_KEY=your_tavily_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=fde-it-support-rag
PINECONE_NAMESPACE=company-it-kb
OPENAI_MODEL=gpt-4o-mini
EMBEDDING_MODEL=text-embedding-3-small
ADMIN_API_KEY=replace-with-a-long-random-secret
APP_ENV=development
```

The checked-in `.env.example` currently lists Tavily and Pinecone keys plus an unused `GROQ_API_KEY`; it does not list every setting the running code uses. Add `OPENAI_API_KEY` yourself. The code uses OpenAI for chat and embeddings. It does not read `GROQ_API_KEY`.

| Variable | Purpose | Default in `config.py` |
| --- | --- | --- |
| `OPENAI_API_KEY` | Chat model and embeddings | Empty; needed for chat and indexing |
| `TAVILY_API_KEY` | Public web fallback | Empty; needed when web fallback runs |
| `PINECONE_API_KEY` | Private vector index | Empty; needed for retrieval and indexing |
| `PINECONE_INDEX_NAME` | Pinecone index | `fde-it-support-rag` |
| `PINECONE_NAMESPACE` | Namespace for vectors | `company-it-kb` |
| `OPENAI_MODEL` | Chat model | `gpt-4o-mini` |
| `EMBEDDING_MODEL` | OpenAI embedding model | `text-embedding-3-small` |
| `TOP_K` | Number of private chunks retrieved | `4` |
| `MAX_RETRIES` | Query rewrite retries | `1` |
| `ADMIN_API_KEY` | Header value for document uploads | Empty; upload disabled |
| `APP_ENV` | Environment label | `development` |

`.env` is ignored by Git. Change the default admin key before sharing the app. Chat questions and workflow traces are written to `data/audit.db`, so treat that database as potentially sensitive. The current API does not authenticate chat requests, and the admin key is the only upload check; do not expose this development setup publicly without access controls.

**Pinecone index caution:** `ensure_index()` creates a serverless index in AWS `us-east-1` if one is missing. If an existing index has a different embedding dimension, the application raises an error. Use a dedicated index name. The default `text-embedding-3-small` dimension is `1536`.

### Step 4 — Index the sample knowledge base

```bash
python ingest_sample_kb.py
```

This reads the files in `data/sample_kb/`, splits their text into chunks of 900 characters with 120-character overlap, embeds the chunks, and adds them to the configured Pinecone namespace. It calls external OpenAI and Pinecone services.

### Step 5 — Start the backend and built-in UI

```bash
python run.py
```

- Built-in UI: `http://127.0.0.1:8080/`
- API docs: `http://127.0.0.1:8080/docs`
- Health endpoint: `http://127.0.0.1:8080/api/health`

`run.py` starts Uvicorn with reload enabled. Leave this terminal open while using the app.

### Optional — Start the separate Next.js UI

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000/`. Keep the Python backend running on port 8080; the Next.js rewrite points there. For repeatable installs with the checked-in lockfile, `npm ci` can replace `npm install`.

## 8. Demo scenarios

These prompts show intended decisions. Actual grades and answers can vary with the models, index contents, and available web results.

| Scenario | Prompt | Intended path |
| --- | --- | --- |
| Private KB | “How do I connect to the company VPN from home?” | Retrieve handbook → good private evidence → company answer |
| Policy | “Can IT support ask me to share my MFA code?” | Retrieve handbook → good private evidence → company answer |
| Current information | “What is the latest Microsoft Teams outage guidance?” | Weak private evidence → Tavily search → external answer if evidence is good |
| Query rewrite | “My work communication app is acting strange after the new update. What should I do?” | Weak evidence → rewrite → retry, subject to `MAX_RETRIES` |
| Direct conversation | “Hello!” | Direct response without private or web retrieval |

The sample handbook says employees must not share passwords or MFA codes with support personnel. The UI shows graph decisions in its trace panel and labels the final source.

## 9. Document upload

Both interfaces offer a company document upload control. The API accepts `.pdf`, `.txt`, `.md`, and `.docx` files:

```text
Upload → validate extension → save under uploads/ → load text
       → chunk → OpenAI embeddings → Pinecone indexing
```

Enter the `ADMIN_API_KEY` value from `.env` in the UI. The backend requires it in the `X-Admin-Key` header. New vectors are added to the configured Pinecone namespace and are available to later retrievals. Uploads require valid OpenAI and Pinecone credentials.

## 10. API endpoints

### `GET /api/health`

Returns the application status and service name:

```json
{"status": "ok", "service": "NovaRetail"}
```

This checks that the API process responds; it does not test OpenAI, Tavily, or Pinecone connectivity.

### `POST /api/chat`

Request:

```json
{"question": "How do I reset my company password?"}
```

Illustrative response shape:

```json
{
  "answer": "...",
  "source_used": "private_kb",
  "trace": ["Router → KB", "Private KB retrieval → 4 chunks", "KB evidence grade → GOOD", "Answer generation → PRIVATE KB"],
  "citations": [{"title": "company_it_handbook.md", "url": "", "type": "private_kb"}],
  "rewritten_query": "How do I reset my company password?"
}
```

The question must contain 2–3,000 characters. `source_used` can be `private_kb`, `web_search`, `direct`, or `insufficient_evidence` for a completed workflow.

### `POST /api/ingest`

Send a multipart `file` and the `X-Admin-Key` header. Example:

```bash
curl -X POST http://127.0.0.1:8080/api/ingest \
  -H "X-Admin-Key: your-admin-key" \
  -F "file=@data/sample_kb/company_it_handbook.md"
```

The response reports the stored filename, number of chunks, and number of vector IDs created. Unsupported extensions return HTTP 400; an invalid admin key returns HTTP 401.

## 11. Current limitations and next steps

- No automated tests are currently present in `tests/`.
- No Dockerfile or deployment configuration is present.
- The `/api/health` endpoint does not verify external dependencies.
- The upload endpoint validates the filename extension but does not enforce a file size limit or inspect file content.
- Query audit records are local SQLite data; retention and access controls are not implemented.
- The Next.js frontend is configured for a backend at `127.0.0.1:8080`; change its rewrite destination for another environment.
- The checked-in `.env.example` needs updating to reflect the OpenAI-based implementation.

These are implementation gaps to address before treating the app as a production internal service.
