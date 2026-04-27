// Info pages functions
function showInfoPage(pageId) {
  const homePage = document.getElementById('homePage');
  const searchResultPage = document.getElementById('searchResultPage');
  const agentCheckPage = document.getElementById('agentCheckPage');
  const serviceDetailContainer = document.getElementById('serviceDetailContainer');
  
  homePage.style.display = 'none';
  searchResultPage.style.display = 'none';
  agentCheckPage.style.display = 'none';
  serviceDetailContainer.style.display = 'none';
  document.getElementById(pageId).style.display = 'block';
  
  if (pageId === 'helpCenterPage') {
    setTimeout(() => {
      document.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', () => { 
          q.classList.toggle('active'); 
          q.nextElementSibling.classList.toggle('show'); 
        });
      });
    }, 100);
  }
  
  if (pageId === 'registerAgentPage') {
    setTimeout(() => {
      document.getElementById('submitRegisterBtn')?.addEventListener('click', () => {
        const nama = document.getElementById('regNama')?.value.trim();
        const wa = document.getElementById('regWhatsapp')?.value.trim();
        const alamat = document.getElementById('regAlamat')?.value.trim();
        const kecamatan = document.getElementById('regKecamatan')?.value;
        const kendaraan = document.getElementById('regKendaraan')?.value;
        const pengalaman = document.getElementById('regPengalaman')?.value.trim();
        const selectedAreas = [];
        document.querySelectorAll('#areaCheckboxes input:checked').forEach(cb => selectedAreas.push(cb.value));
        if (!nama || !wa || !alamat || !kecamatan || selectedAreas.length === 0) { 
          alert('Harap lengkapi semua data yang diperlukan'); 
          return; 
        }
        const message = `📋 PENDAFTARAN AGENT SURUHBOY 📋\n\n👤 Nama: ${nama}\n📱 WhatsApp: ${wa}\n📍 Alamat: ${alamat}\n🏘️ Kecamatan: ${kecamatan}\n🗺️ Area Operasional: ${selectedAreas.join(', ')}\n🛵 Kendaraan: ${kendaraan || '-'}\n📝 Pengalaman: ${pengalaman || '-'}\n\n✅ Mohon verifikasi data pendaftaran ini.`;
        window.open(`https://wa.me/${CONTACTS.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
      });
    }, 100);
  }
}

function hideAllInfoPages() { 
  document.getElementById('homePage').style.display = 'block'; 
  const pages = ['privacyPage', 'termsPage', 'contactPage', 'helpCenterPage', 'registerAgentPage', 'agentCheckPage'];
  pages.forEach(page => { 
    const el = document.getElementById(page); 
    if (el) el.style.display = 'none'; 
  }); 
}

function setupInfoPageLinks() {
  document.getElementById('privacyLink').addEventListener('click', () => showInfoPage('privacyPage'));
  document.getElementById('termsLink').addEventListener('click', () => showInfoPage('termsPage'));
  document.getElementById('contactLink').addEventListener('click', () => showInfoPage('contactPage'));
  document.getElementById('backFromPrivacyBtn').addEventListener('click', hideAllInfoPages);
  document.getElementById('backFromTermsBtn').addEventListener('click', hideAllInfoPages);
  document.getElementById('backFromContactBtn').addEventListener('click', hideAllInfoPages);
  document.getElementById('backFromHelpCenterBtn').addEventListener('click', hideAllInfoPages);
  document.getElementById('backFromRegisterBtn').addEventListener('click', hideAllInfoPages);
  document.getElementById('helpCenterCard').addEventListener('click', () => showInfoPage('helpCenterPage'));
  document.getElementById('marketplaceCard').addEventListener('click', () => {
    window.location.href = 'jasa-lain.html';
  });
  document.getElementById('registerAgentCard').addEventListener('click', () => showInfoPage('registerAgentPage'));
}

function setupContactButtons() {
  document.getElementById('waChatBtn').addEventListener('click', () => window.open(`https://wa.me/${CONTACTS.whatsapp}?text=Halo%20Suruhboy%2C%20saya%20butuh%20bantuan`, '_blank'));
  document.getElementById('fabBtn').addEventListener('click', () => window.open(`https://wa.me/${CONTACTS.whatsapp}?text=Halo%20Suruhboy%2C%20saya%20butuh%20bantuan`, '_blank'));
  document.getElementById('instagramBtn').addEventListener('click', () => window.open(CONTACTS.instagram, '_blank'));
  document.getElementById('tiktokBtn').addEventListener('click', () => window.open(CONTACTS.tiktok, '_blank'));
  document.getElementById('emailBtn').addEventListener('click', () => window.location.href = `mailto:${CONTACTS.email}`);
  document.getElementById('youtubeBtn').addEventListener('click', () => window.open(CONTACTS.youtube, '_blank'));
  document.getElementById('linkedinBtn').addEventListener('click', () => window.open(CONTACTS.linkedin, '_blank'));
}

// Expose functions globally
window.showInfoPage = showInfoPage;
window.hideAllInfoPages = hideAllInfoPages;
