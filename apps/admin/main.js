const verificationBase = window.VERIFICATION_BASE || 'http://localhost:4300';
const documentsBase = window.DOCUMENTS_BASE || 'http://localhost:4200';

function getToken() {
  return document.getElementById('idToken').value.trim();
}

function setList(containerId, items) {
  const el = document.getElementById(containerId);
  el.innerHTML = '';
  if (!items || items.length === 0) {
    el.innerHTML = '<div class="empty">No items</div>';
    return;
  }
  items.forEach(it => {
    const node = document.createElement('div');
    node.className = 'item';
    node.innerHTML = `
      <div class="meta"><strong>ID:</strong> ${it.id} <strong>Listing:</strong> ${it.listingId || ''}</div>
      <div><strong>Filename:</strong> ${it.filename || ''} <strong>Status:</strong> ${it.status || ''}</div>
      <div class="actions">
        <button data-eid="${it.id}" class="btnDownload">Get Download URL</button>
        <select class="decision">
          <option value="accept">Accept</option>
          <option value="reject">Reject</option>
          <option value="flag">Flag</option>
        </select>
        <input class="rationale" placeholder="Rationale (optional)" />
        <button data-eid="${it.id}" class="btnSubmit">Submit Review</button>
      </div>
      <div class="output" id="out-${it.id}"></div>
    `;
    el.appendChild(node);
  });

  // attach handlers
  el.querySelectorAll('.btnDownload').forEach(btn => btn.addEventListener('click', async (e) => {
    const id = e.target.dataset.eid;
    await handleDownload(id);
  }));
  el.querySelectorAll('.btnSubmit').forEach(btn => btn.addEventListener('click', async (e) => {
    const id = e.target.dataset.eid;
    const parent = e.target.closest('.item');
    const decision = parent.querySelector('.decision').value;
    const rationale = parent.querySelector('.rationale').value;
    await handleSubmitReview(id, decision, rationale);
  }));
}

async function handleDownload(evidenceId) {
  const token = getToken();
  if (!token) return alert('Please paste an admin ID token first');
  const out = document.getElementById(`out-${evidenceId}`);
  out.textContent = 'Requesting download URL...';
  try {
    const resp = await fetch(`${documentsBase}/api/v1/evidence/${evidenceId}/download`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || 'Download failed');
    out.innerHTML = `<a href="${data.downloadUrl}" target="_blank">Open download URL</a>`;
  } catch (err) {
    out.textContent = 'Error: ' + err.message;
  }
}

async function handleSubmitReview(evidenceId, decision, rationale) {
  const token = getToken();
  if (!token) return alert('Please paste an admin ID token first');
  const out = document.getElementById(`out-${evidenceId}`);
  out.textContent = 'Submitting review...';
  try {
    const resp = await fetch(`${verificationBase}/api/v1/reviews/${evidenceId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ decision, rationale })
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || 'Review failed');
    out.textContent = `Submitted — new status: ${data.status}`;
  } catch (err) {
    out.textContent = 'Error: ' + err.message;
  }
}

async function loadQueue() {
  const token = getToken();
  if (!token) return alert('Please paste an admin ID token first');
  const outEl = document.getElementById('queue');
  outEl.textContent = 'Loading...';
  try {
    const resp = await fetch(`${verificationBase}/api/v1/reviews/queue`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || 'Failed to load');
    setList('queue', data.items || []);
  } catch (err) {
    outEl.textContent = 'Error: ' + err.message;
  }
}

async function loadAuditLogs() {
  const token = getToken();
  if (!token) return alert('Please paste an admin ID token first');
  const outEl = document.getElementById('audit');
  outEl.textContent = 'Loading...';
  try {
    const resp = await fetch(`${verificationBase}/api/v1/audit-logs`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || 'Failed to load');
    setList('audit', data.items || []);
  } catch (err) {
    outEl.textContent = 'Error: ' + err.message;
  }
}

document.getElementById('btnLoadQueue').addEventListener('click', loadQueue);
document.getElementById('btnAuditLogs').addEventListener('click', loadAuditLogs);

// initial empty lists
setList('queue', []);
setList('audit', []);
