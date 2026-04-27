// Agent functions
let isLoadingAgent = false;
let loadingInterval;
const loadingTexts = ["Membaca data dari Google Sheets", "Mencari agent aktif di area", "Memeriksa ketersediaan..."];

function parseTimestamp(str) {
  if (!str) return new Date(0);
  const match = String(str).match(/(\d{1,2})\/(\d{1,2})\/(\d{4})[,.\s]+(\d{1,2})[.:](\d{2})[.:](\d{2})/);
  if (match) return new Date(match[3], match[2]-1, match[1], match[4], match[5], match[6]);
  return new Date(str);
}

async function loadAgentStatusFromSheet() {
  try {
    const response = await fetch(AGENT_URL);
    const csvText = await response.text();
    const lines = csvText.split(/\r?\n/);
    if (lines.length < 2) throw new Error('Data kosong');
    const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());
    let idxTimestamp = 0, idxNama = 1, idxUsername = 2, idxAction = 3, idxAreas = 4;
    for (let i = 0; i < headers.length; i++) {
      const h = headers[i].toLowerCase();
      if (h.includes('timestamp')) idxTimestamp = i;
      if (h.includes('nama') && h.includes('agent')) idxNama = i;
      if (h === 'username') idxUsername = i;
      if (h === 'action') idxAction = i;
      if (h.includes('area')) idxAreas = i;
    }
    const allRows = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const cells = [];
      let inQuote = false;
      let current = '';
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') { inQuote = !inQuote; }
        else if (char === ',' && !inQuote) { cells.push(current.trim()); current = ''; }
        else { current += char; }
      }
      cells.push(current.trim());
      if (cells.length < 5) continue;
      const timestamp = cells[idxTimestamp]?.replace(/^"|"$/g, '') || '';
      const namaAgent = cells[idxNama]?.replace(/^"|"$/g, '') || '';
      const username = cells[idxUsername]?.replace(/^"|"$/g, '') || '';
      const action = cells[idxAction]?.replace(/^"|"$/g, '') || '';
      let areasRaw = cells[idxAreas]?.replace(/^"|"$/g, '') || '';
      if (!namaAgent || namaAgent === 'Nama Agent') continue;
      let areas = [];
      if (areasRaw && areasRaw !== '-') { areas = areasRaw.split(',').map(a => a.trim()).filter(a => a); }
      allRows.push({ timestamp, timestampObj: parseTimestamp(timestamp), namaAgent, username, action: action.toLowerCase(), areas });
    }
    const latestPerAgent = new Map();
    allRows.forEach(row => {
      const key = row.username;
      const existing = latestPerAgent.get(key);
      if (!existing || row.timestampObj > existing.timestampObj) latestPerAgent.set(key, row);
    });
    allAgents = [];
    onlineAgents = [];
    for (const [_, agent] of latestPerAgent) {
      const isOnline = agent.action === 'online';
      allAgents.push({ namaAgent: agent.namaAgent, username: agent.username, isOnline, areas: agent.areas, lastTimestamp: agent.timestamp });
      if (isOnline && agent.areas.length > 0) onlineAgents.push({ namaAgent: agent.namaAgent, areas: agent.areas, lastActive: agent.timestamp });
    }
    console.log(`✅ Online agents: ${onlineAgents.length}`);
    return true;
  } catch (error) { 
    console.error('❌ Error loading agent status:', error); 
    return false; 
  }
}

function getAgentAvailability(area) {
  const availableAgents = onlineAgents.filter(agent => agent.areas.some(a => a.toLowerCase() === area.toLowerCase()));
  const agentCount = availableAgents.length;
  if (agentCount === 0) { 
    return { status: 'none', message: 'Maaf, belum ada agent yang siap di area ini', detail: 'Saat ini belum ada agent yang sedang online di area ini. Silakan coba lagi nanti atau pilih area lain.', agentCount: 0 }; 
  } else { 
    return { status: 'ready', message: 'Ada agent yang siap bantu!', detail: `Tersedia ${agentCount} agent siap di area ${area}. Agent akan segera menjemput pesanan Anda.`, agentCount, isReady: true, agents: availableAgents }; 
  }
}

function startLoading() {
  const overlay = document.getElementById('loadingOverlay');
  const loadingText = document.getElementById('loadingText');
  let idx = 0;
  loadingText.textContent = loadingTexts[0];
  loadingInterval = setInterval(() => { idx = (idx + 1) % loadingTexts.length; loadingText.textContent = loadingTexts[idx]; }, 800);
  overlay.classList.add('show');
}

function stopLoading() { 
  const overlay = document.getElementById('loadingOverlay'); 
  if (loadingInterval) clearInterval(loadingInterval); 
  overlay.classList.remove('show'); 
}

function orderNowAgent(area) { 
  const message = `🛵 PESANAN SURUHBOY 🛵\n\n📍 Area: ${area}\n✅ Saya ingin memesan layanan. Mohon konfirmasi.\n\nTerima kasih!`;
  window.open(`https://wa.me/${CONTACTS.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
}

function resetAgentCheck() { 
  document.getElementById('agentResultSection').classList.add('hidden'); 
  document.getElementById('areaSelect').value = ''; 
  window.scrollTo({ top: 0, behavior: 'smooth' }); 
}

function populateAreaSelect() { 
  const select = document.getElementById('areaSelect'); 
  if (!select) return;
  select.innerHTML = '<option value="" disabled selected>-- Pilih Kecamatan --</option>' + KECAMATAN.map(area => `<option value="${area}">${area}</option>`).join(''); 
}

async function checkAgentAvailability() {
  const areaSelect = document.getElementById('areaSelect');
  const selectedArea = areaSelect.value;
  if (!selectedArea) { alert('Silakan pilih area jemput terlebih dahulu'); return; }
  if (isLoadingAgent) return;
  isLoadingAgent = true;
  startLoading();
  try {
    const success = await loadAgentStatusFromSheet();
    if (!success) throw new Error('Gagal load data');
    await new Promise(resolve => setTimeout(resolve, 500));
    const availability = getAgentAvailability(selectedArea);
    stopLoading();
    const resultSection = document.getElementById('agentResultSection');
    const { status, message, detail, agentCount } = availability;
    const statusIcon = status === 'ready' ? 'fas fa-check-circle' : 'fas fa-times-circle';
    const statusClass = status === 'ready' ? 'agent-status-ready' : 'agent-status-none';
    const actionButtons = status === 'ready' ? 
      `<div class="agent-action-buttons"><button class="btn-order-agent" onclick="orderNowAgent('${selectedArea}')"><i class="fas fa-shopping-cart"></i> Pesan Sekarang</button><button class="btn-reset-agent" onclick="resetAgentCheck()"><i class="fas fa-undo"></i> Cek Area Lain</button></div>` : 
      `<div class="agent-action-buttons"><button class="btn-reset-agent" onclick="resetAgentCheck()"><i class="fas fa-undo"></i> Cek Area Lain</button></div>`;
    resultSection.innerHTML = `
      <div class="agent-result-card">
        <div class="agent-status-icon ${statusClass}"><i class="${statusIcon}"></i></div>
        <div class="agent-result-message">${message}</div>
        <div class="agent-result-detail">${detail}</div>
        ${agentCount > 0 ? `<div class="agent-badge-count"><i class="fas fa-user-check"></i> ${agentCount} agent aktif di area ini</div>` : ''}
        ${status === 'ready' ? `<div class="agent-info-box"><i class="fas fa-bolt"></i> Estimasi waktu tunggu: 10-15 menit</div>` : ''}
        ${actionButtons}
      </div>
    `;
    resultSection.classList.remove('hidden');
    resultSection.scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    stopLoading();
    const resultSection = document.getElementById('agentResultSection');
    resultSection.innerHTML = `
      <div class="agent-result-card">
        <div style="color:#B91C1C; text-align:center; padding:20px;">
          <i class="fas fa-exclamation-triangle fa-2x"></i>
          <p>Gagal mengambil data ketersediaan agent. Silakan coba lagi.</p>
        </div>
        <button class="btn-reset-agent" onclick="resetAgentCheck()" style="width:100%;">Coba Lagi</button>
      </div>
    `;
    resultSection.classList.remove('hidden');
  }
  isLoadingAgent = false;
}

function openAgentCheckPage() {
  document.getElementById('homePage').style.display = 'none';
  document.getElementById('searchResultPage').style.display = 'none';
  document.getElementById('serviceDetailContainer').style.display = 'none';
  document.getElementById('agentCheckPage').style.display = 'block';
  populateAreaSelect();
}

let autoRefreshInterval;
function startAutoRefresh() { 
  autoRefreshInterval = setInterval(async () => { 
    if (!isLoadingAgent) { 
      await loadAgentStatusFromSheet(); 
    } 
  }, 15000); 
}

// Expose functions globally
window.orderNowAgent = orderNowAgent;
window.resetAgentCheck = resetAgentCheck;
window.checkAgentAvailability = checkAgentAvailability;
window.openAgentCheckPage = openAgentCheckPage;
