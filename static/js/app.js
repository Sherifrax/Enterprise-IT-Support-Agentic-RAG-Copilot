const chat = document.getElementById('chat');
const form = document.getElementById('chatForm');
const question = document.getElementById('question');
const trace = document.getElementById('trace');
const sourceUsed = document.getElementById('sourceUsed');
let busy = false;

function appendInline(parent, value) {
  value.split(/(\*\*[^*]+\*\*)/g).forEach(part => {
    if (part.startsWith('**') && part.endsWith('**')) { const strong = document.createElement('strong'); strong.textContent = part.slice(2, -2); parent.appendChild(strong); }
    else parent.appendChild(document.createTextNode(part));
  });
}
function renderMessageText(container, value, role) {
  if (role === 'user') { container.textContent = value; return; }
  value.split('\n').forEach(line => {
    const row = document.createElement('div');
    if (!line.trim()) { row.className = 'message-spacer'; container.appendChild(row); return; }
    const bullet = line.match(/^\s*[-*]\s+(.+)$/);
    const numbered = line.match(/^\s*(\d+)\.\s+(.+)$/);
    const heading = line.match(/^#{1,3}\s+(.+)$/);
    if (bullet || numbered) {
      row.className = 'message-list-row';
      const marker = document.createElement('span'); marker.className = 'message-list-number'; marker.textContent = bullet ? '•' : `${numbered[1]}.`;
      const body = document.createElement('span'); appendInline(body, bullet ? bullet[1] : numbered[2]); row.append(marker, body);
    } else { row.className = heading ? 'message-heading' : 'message-line'; appendInline(row, heading ? heading[1] : line); }
    container.appendChild(row);
  });
}

function addMessage(role, text, source = '', citations = []) {
  document.getElementById('chatEmpty')?.remove();
  const row = document.createElement('div'); row.className = `message message-${role}`;
  const avatar = document.createElement('div'); avatar.className = 'message-avatar'; avatar.textContent = role === 'user' ? '◉' : '✦';
  const body = document.createElement('div'); body.className = 'message-body';
  const label = document.createElement('span'); label.className = 'message-label'; label.textContent = role === 'user' ? 'YOU' : 'NOVARETAIL AGENT';
  const content = document.createElement('div'); content.className = 'message-text'; renderMessageText(content, text, role);
  body.append(label, content);
  if (source) { const badge = document.createElement('div'); badge.className = 'message-source'; const dot = document.createElement('span'); dot.className = 'message-source-dot'; badge.append(dot, document.createTextNode(`SOURCE / ${source}`)); body.appendChild(badge); }
  if (citations.length) {
    const refs = document.createElement('div'); refs.className = 'message-citations';
    const heading = document.createElement('strong'); heading.textContent = 'REFERENCES'; refs.appendChild(heading);
    citations.forEach((citation) => {
      let safeUrl;
      try { const parsed = new URL(citation.url); if (['http:', 'https:'].includes(parsed.protocol)) safeUrl = parsed.href; } catch (_) { /* File sources do not have URLs. */ }
      const item = document.createElement(safeUrl ? 'a' : 'span'); item.textContent = citation.title || 'Untitled source';
      if (safeUrl) { item.href = safeUrl; item.target = '_blank'; item.rel = 'noopener noreferrer'; }
      refs.appendChild(item);
    }); body.appendChild(refs);
  }
  row.append(avatar, body); chat.appendChild(row); chat.scrollTop = chat.scrollHeight;
}
function renderTrace(items) {
  trace.replaceChildren();
  items.forEach((item, i) => { const row = document.createElement('div'); row.className = 'trace-item'; const node = document.createElement('div'); node.className = 'trace-node'; node.textContent = '✓'; const content = document.createElement('div'); const number = document.createElement('small'); number.textContent = `STEP ${String(i + 1).padStart(2, '0')}`; const label = document.createElement('p'); label.textContent = item; content.append(number, label); row.append(node, content); trace.appendChild(row); });
}
async function askAgent(value) {
  const q = value.trim(); if (!q || busy) return;
  busy = true; form.querySelector('button').disabled = true; document.querySelectorAll('.example').forEach(button => button.disabled = true);
  addMessage('user', q); question.value = ''; document.getElementById('charCount').textContent = '0 / 3000'; renderTrace(['Running LangGraph workflow...']); sourceUsed.textContent = 'Running…';
  try { const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: q }) }); const data = await res.json(); if (!res.ok) throw new Error(typeof data.detail === 'string' ? data.detail : 'Request failed'); addMessage('assistant', data.answer, data.source_used, data.citations || []); renderTrace(data.trace || []); sourceUsed.textContent = data.source_used || 'Unknown'; }
  catch (error) { addMessage('assistant', `Error: ${error.message}`); renderTrace(['Request failed']); sourceUsed.textContent = 'Error'; }
  finally { busy = false; form.querySelector('button').disabled = false; document.querySelectorAll('.example').forEach(button => button.disabled = false); }
}
form.addEventListener('submit', event => { event.preventDefault(); askAgent(question.value); });
question.addEventListener('input', () => { document.getElementById('charCount').textContent = `${question.value.length} / 3000`; question.style.height = 'auto'; question.style.height = `${Math.min(question.scrollHeight, 140)}px`; });
question.addEventListener('keydown', event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); askAgent(question.value); } });
document.querySelectorAll('.example').forEach(button => button.addEventListener('click', () => askAgent(button.textContent.replace(/^\d\d/, '').replace('↗', '').trim())));
const modal = document.getElementById('uploadModal');
const closeModal = () => modal.classList.add('hidden');
document.getElementById('openUpload').addEventListener('click', () => { modal.classList.remove('hidden'); document.getElementById('adminKey').focus(); document.getElementById('siteNav').classList.remove('nav-links-open'); document.getElementById('menuToggle').setAttribute('aria-expanded', 'false'); document.getElementById('menuToggle').setAttribute('aria-label', 'Open menu'); document.getElementById('menuToggle').textContent = '☰'; });
document.getElementById('closeUpload').addEventListener('click', closeModal);
modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });
document.getElementById('uploadBtn').addEventListener('click', async () => {
  const file = document.getElementById('fileInput').files[0]; const key = document.getElementById('adminKey').value; const status = document.getElementById('uploadStatus');
  if (!file) { status.textContent = 'Choose a file first.'; return; }
  const button = document.getElementById('uploadBtn'); button.disabled = true; status.textContent = 'Indexing document...'; const fd = new FormData(); fd.append('file', file);
  try { const response = await fetch('/api/ingest', { method: 'POST', headers: { 'X-Admin-Key': key }, body: fd }); const data = await response.json(); if (!response.ok) throw new Error(typeof data.detail === 'string' ? data.detail : 'Upload failed'); status.textContent = `Indexed ${data.file}: ${data.chunks} chunks.`; }
  catch (error) { status.textContent = `Error: ${error.message}`; }
  finally { button.disabled = false; }
});
const nav = document.getElementById('siteNav'); const menuToggle = document.getElementById('menuToggle');
menuToggle.addEventListener('click', () => { const open = nav.classList.toggle('nav-links-open'); menuToggle.setAttribute('aria-expanded', String(open)); menuToggle.textContent = open ? '×' : '☰'; menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); });
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { nav.classList.remove('nav-links-open'); menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', 'Open menu'); menuToggle.textContent = '☰'; }));
const traceToggle = document.getElementById('traceToggle');
traceToggle.addEventListener('click', () => { const open = document.getElementById('agent-trace').classList.toggle('trace-column-open'); traceToggle.setAttribute('aria-expanded', String(open)); traceToggle.textContent = open ? 'Hide trace ↗' : 'View trace ↗'; });
