// Services functions
async function loadServicesFromSheet() {
  try {
    const response = await fetch(SERVICES_URL);
    const csvText = await response.text();
    const rows = [];
    const lines = csvText.split(/\r?\n/);
    for (const line of lines) {
      if (line.trim() === '') continue;
      let row = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') { inQuotes = !inQuotes; }
        else if (char === ',' && !inQuotes) { row.push(current.trim()); current = ''; }
        else { current += char; }
      }
      row.push(current.trim());
      rows.push(row);
    }
    if (rows.length === 0) throw new Error('Data kosong');
    const headers = rows[0];
    const keywordRows = rows.slice(1);
    const services = [];
    for (let i = 0; i < headers.length; i++) {
      const label = headers[i];
      if (!label || label.trim() === '') continue;
      const keywords = [];
      for (let j = 0; j < keywordRows.length; j++) {
        let keyword = keywordRows[j][i];
        if (keyword && keyword.trim() !== '') {
          keyword = keyword.replace(/^"|"$/g, '').trim();
          const parts = keyword.split(/[,;]+/);
          for (const part of parts) {
            const cleanPart = part.trim().toLowerCase();
            if (cleanPart.length > 0) keywords.push(cleanPart);
          }
        }
      }
      services.push({ 
        label, 
        keywords, 
        desc: `Layanan ${label} oleh Suruhboy`, 
        iconFile: ICON_MAP[label] || `${label.toLowerCase().replace(/[^a-z]/g, '')}.png` 
      });
    }
    return services;
  } catch (error) {
    console.error('Gagal load sheet:', error);
    return [
      {label:"Antar Makanan", keywords:["antar","makanan","food"], desc:"Pesan antar makanan", iconFile:"makan.png"},
      {label:"Kirim Barang", keywords:["kirim","barang","paket"], desc:"Kirim paket", iconFile:"barang.png"},
      {label:"Antar Orang", keywords:["antar","orang","jemput"], desc:"Jemput antar orang", iconFile:"orang.png"},
      {label:"Titip Belanja", keywords:["titip","belanja"], desc:"Titip belanja", iconFile:"belanja.png"},
      {label:"Bersih-Bersih", keywords:["bersih","cleaning"], desc:"Layanan bersih", iconFile:"bersih.png"},
      {label:"Caregiver/Jaga RS", keywords:["caregiver","rs","sakit"], desc:"Pendamping RS", iconFile:"caregiver.png"},
      {label:"Jasa Nemenin", keywords:["nemenin","temani"], desc:"Teman pendamping", iconFile:"nemenin.png"},
      {label:"Custom Request", keywords:["custom","request"], desc:"Request khusus", iconFile:"custom.png"}
    ];
  }
}

function renderMenuGrid() {
  const menuGrid = document.getElementById('menuGrid');
  if (!menuGrid) return;
  if (!servicesData.length) { 
    menuGrid.innerHTML = '<div style="grid-column:span 4; text-align:center; padding:20px;">Memuat layanan...</div>'; 
    return; 
  }
  menuGrid.innerHTML = '';
  servicesData.forEach(service => {
    let displayLabel = service.label;
    if (service.label === "Caregiver/Jaga RS") displayLabel = "Caregiver/\nJaga RS";
    else if (service.label === "Bersih-Bersih") displayLabel = "Bersih-\nBersih";
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-service', service.label);
    card.innerHTML = `<div class="icon"><img src="${service.iconFile}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27%3E%3Ctext x=%2750%%27 y=%2750%%27 fill=%27%23E88D2A%27 font-size=%2712%27%3E${service.label.charAt(0)}%3C/text%3E%3C/svg%3E'"></div><div class="title">${displayLabel}</div>`;
    card.addEventListener('click', () => window.showServiceDetail(service.label));
    menuGrid.appendChild(card);
  });
}

function showServiceDetail(serviceName) {
  const homePage = document.getElementById('homePage');
  const searchResultPage = document.getElementById('searchResultPage');
  const serviceDetailContainer = document.getElementById('serviceDetailContainer');
  
  homePage.style.display = 'none';
  searchResultPage.style.display = 'none';
  serviceDetailContainer.style.display = 'block';
  
  const detail = SERVICE_DETAILS[serviceName];
  if (!detail) return;
  
  serviceDetailContainer.innerHTML = `
    <div class="service-detail-page" style="display:block">
      <div class="service-detail-container">
        <div class="service-detail-header">
          <div class="service-back-btn" id="backFromServiceBtn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1B2A4A" stroke-width="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </div>
          <div>
            <h2 style="font-size:18px; font-weight:700;">${serviceName}</h2>
            <p style="font-size:12px; color:#7A8BA0;">Detail layanan & pemesanan</p>
          </div>
        </div>
        
        <div class="service-detail-hero">
          <div class="service-detail-icon">
            <img src="${detail.icon}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27%3E%3Ctext x=%2750%%27 y=%2750%%27 fill=%27%23E88D2A%27 font-size=%2714%27%3E${serviceName.charAt(0)}%3C/text%3E%3C/svg%3E'">
          </div>
          <h2>${serviceName}</h2>
          <p>${detail.description}</p>
        </div>
        
        <div class="service-info-card">
          <h3><i class="fas fa-check-circle" style="color:#E88D2A;"></i> Yang Didapatkan</h3>
          <ul>${detail.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}</ul>
          <div class="price-tag">${detail.price}</div>
          <div class="price-note">${detail.priceNote}</div>
        </div>
        
        <div class="order-form-card">
          <h3><i class="fas fa-clipboard-list" style="color:#E88D2A;"></i> Form Pemesanan</h3>
          <form id="serviceOrderForm">
            <div class="form-group">
              <label>Nama Lengkap</label>
              <input type="text" id="orderName" placeholder="Masukkan nama Anda" required>
            </div>
            <div class="form-group">
              <label>Nomor WhatsApp</label>
              <input type="tel" id="orderPhone" placeholder="08123456789" required>
            </div>
            <div class="form-group">
              <label>Alamat Lengkap</label>
              <textarea id="orderAddress" placeholder="Masukkan alamat lengkap" required></textarea>
            </div>
            <div class="form-group">
              <label>Detail Pesanan</label>
              <textarea id="orderDetails" placeholder="Jelaskan detail pesanan Anda" required></textarea>
            </div>
            <button type="button" class="btn-order-service" id="submitServiceOrder">
              <i class="fab fa-whatsapp"></i> Pesan via WhatsApp
            </button>
          </form>
        </div>
        
        <div class="service-footer">
          <i class="fas fa-shield-alt"></i> Aman & Terpercaya
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('backFromServiceBtn').addEventListener('click', () => {
    serviceDetailContainer.style.display = 'none';
    document.getElementById('homePage').style.display = 'block';
  });
  
  document.getElementById('submitServiceOrder').addEventListener('click', () => {
    const name = document.getElementById('orderName').value.trim();
    const phone = document.getElementById('orderPhone').value.trim();
    const address = document.getElementById('orderAddress').value.trim();
    const details = document.getElementById('orderDetails').value.trim();
    if (!name || !phone || !address || !details) { 
      alert('Harap lengkapi semua form terlebih dahulu!'); 
      return; 
    }
    const message = `🛵 ORDER SURUHBOY 🛵\n\n📋 Layanan: ${serviceName}\n👤 Nama: ${name}\n📱 WhatsApp: ${phone}\n📍 Alamat: ${address}\n📝 Detail: ${details}\n\n✅ Mohon konfirmasi pesanan ini.`;
    window.open(`https://wa.me/${CONTACTS.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  });
}

function openSearchPage() {
  const homePage = document.getElementById('homePage');
  const serviceDetailContainer = document.getElementById('serviceDetailContainer');
  
  homePage.style.display = 'none';
  serviceDetailContainer.style.display = 'none';
  document.getElementById('searchResultPage').style.display = 'block';
  setTimeout(() => { 
    document.getElementById('resultSearchInput').focus(); 
    performResultSearch(''); 
  }, 50);
}

function performResultSearch(query) {
  if (!servicesData.length) return;
  const lowerQuery = query.toLowerCase().trim();
  let filteredServices = servicesData;
  if (lowerQuery !== '') {
    filteredServices = servicesData.filter(service => 
      service.label.toLowerCase().includes(lowerQuery) || 
      service.keywords.some(kw => kw.toLowerCase().includes(lowerQuery))
    );
  }
  document.getElementById('searchQueryDisplay').textContent = lowerQuery === '' ? 'semua layanan' : query;
  const resultContainer = document.getElementById('resultListContainer');
  if (filteredServices.length === 0) {
    resultContainer.innerHTML = `<div class="no-result-search"><p>Tidak ada layanan yang cocok dengan "<strong>${query}</strong>"</p></div>`;
    return;
  }
  resultContainer.innerHTML = filteredServices.map(service => `
    <div class="result-card" data-service="${service.label}">
      <div class="result-icon">
        <img src="${service.iconFile}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27%3E%3Ctext x=%2750%%27 y=%2750%%27 fill=%27%23E88D2A%27 font-size=%2712%27%3E${service.label.charAt(0)}%3C/text%3E%3C/svg%3E'">
      </div>
      <div class="result-info">
        <div class="result-title">${service.label}</div>
        <div class="result-desc">${service.desc}</div>
      </div>
    </div>
  `).join('');
  document.querySelectorAll('.result-card').forEach(card => { 
    card.addEventListener('click', () => showServiceDetail(card.getAttribute('data-service'))); 
  });
}

function backToHome() {
  document.getElementById('homePage').style.display = 'block';
  document.getElementById('searchResultPage').style.display = 'none';
  document.getElementById('serviceDetailContainer').style.display = 'none';
  document.getElementById('resultSearchInput').value = '';
}

// Expose functions globally
window.showServiceDetail = showServiceDetail;
window.openSearchPage = openSearchPage;
window.backToHome = backToHome;
window.performResultSearch = performResultSearch;
