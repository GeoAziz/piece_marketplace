function timestamp() { return new Date().toISOString(); }

function info(msg, meta) { console.log(JSON.stringify({ level: 'info', ts: timestamp(), msg, meta: meta || null })); }
function warn(msg, meta) { console.warn(JSON.stringify({ level: 'warn', ts: timestamp(), msg, meta: meta || null })); }
function error(msg, meta) { console.error(JSON.stringify({ level: 'error', ts: timestamp(), msg, meta: meta || null })); }

module.exports = { info, warn, error };
