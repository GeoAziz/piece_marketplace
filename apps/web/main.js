const listingsBase = window.LISTINGS_BASE || 'http://localhost:4100';
const documentsBase = window.DOCUMENTS_BASE || 'http://localhost:4200';

function getToken() { return document.getElementById('idToken').value.trim(); }

async function createListing() {
  const token = getToken();
  const title = document.getElementById('title').value;
  const location = document.getElementById('location').value;
  const price = document.getElementById('price').value;
  const description = document.getElementById('description').value;
  const out = document.getElementById('createResult');
  out.textContent = 'Creating...';
  try {
    const resp = await fetch(`${listingsBase}/api/v1/listings`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, description, location, price })
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || 'Create failed');
    out.innerHTML = `Created listing: <code>${data.id}</code>`;
    document.getElementById('listingId').value = data.id;
  } catch (err) { out.textContent = 'Error: ' + err.message; }
}

async function getUploadUrl() {
  const token = getToken();
  const listingId = document.getElementById('listingId').value.trim();
  const fileEl = document.getElementById('fileInput');
  const docType = document.getElementById('docType').value;
  const out = document.getElementById('uploadResult');
  if (!listingId) return out.textContent = 'Please set listing ID';
  if (!fileEl.files || fileEl.files.length === 0) return out.textContent = 'Please choose a file';
  const file = fileEl.files[0];
  out.textContent = 'Requesting upload URL...';
  try {
    const resp = await fetch(`${documentsBase}/api/v1/listings/${listingId}/upload-url`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ filename: file.name, contentType: file.type, type: docType })
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || 'Upload URL failed');

    // Upload via PUT to signed URL
    out.textContent = 'Uploading file to signed URL...';
    const uploadResp = await fetch(data.uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file });
    if (!uploadResp.ok) throw new Error('Upload PUT failed');

    // Confirm upload
    const confirmResp = await fetch(`${documentsBase}/api/v1/listings/${listingId}/confirm`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ evidenceId: data.evidenceId })
    });
    const confirmData = await confirmResp.json();
    if (!confirmResp.ok) throw new Error(confirmData.error || 'Confirm failed');
    out.innerHTML = `Uploaded & recorded evidence: <code>${data.evidenceId}</code>`;
  } catch (err) { out.textContent = 'Error: ' + err.message; }
}

async function viewListing() {
  const id = document.getElementById('publicListingId').value.trim();
  const out = document.getElementById('publicView');
  if (!id) return out.textContent = 'Provide a listing ID';
  out.textContent = 'Loading...';
  try {
    const resp = await fetch(`${listingsBase}/api/v1/listings/${id}`);
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || 'Fetch failed');
    out.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  } catch (err) { out.textContent = 'Error: ' + err.message; }
}

document.getElementById('btnCreate').addEventListener('click', createListing);
document.getElementById('btnGetUploadUrl').addEventListener('click', getUploadUrl);
document.getElementById('btnView').addEventListener('click', viewListing);
