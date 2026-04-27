// Slider functions
async function loadSliderFromSheet() {
  try {
    const response = await fetch(SLIDER_URL);
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
    
    const headers = rows[0].map(h => h.toLowerCase().trim());
    let judulIdx = headers.findIndex(h => h === 'judul');
    let subJudulIdx = headers.findIndex(h => h === 'sub_judul');
    let badgeIdx = headers.findIndex(h => h === 'badge');
    
    if (judulIdx === -1) judulIdx = 0;
    if (subJudulIdx === -1) subJudulIdx = 1;
    if (badgeIdx === -1) badgeIdx = 2;
    
    const dataRows = rows.slice(1);
    const slides = [];
    
    for (let i = 0; i < dataRows.length && i < 4; i++) {
      const row = dataRows[i];
      if (row.length === 0) continue;
      const judul = row[judulIdx] || '';
      const subJudul = row[subJudulIdx] || '';
      const badge = row[badgeIdx] || '';
      
      slides.push({ judul, subJudul, badge, imageUrl: `slider${i + 1}.jpg` });
    }
    
    return slides;
  } catch (error) {
    console.error('Error loading slider:', error);
    return [
      { judul: "Promo Spesial", subJudul: "Diskon 50% untuk pengguna baru", badge: "HOT", imageUrl: "slider1.jpg" },
      { judul: "Layanan 24 Jam", subJudul: "Siap melayani kapan saja", badge: "NEW", imageUrl: "slider2.jpg" },
      { judul: "Gratis Ongkir", subJudul: "Minimal belanja Rp 50.000", badge: "PROMO", imageUrl: "slider3.jpg" },
      { judul: "Cashback 10%", subJudul: "Setiap transaksi via aplikasi", badge: "DISKON", imageUrl: "slider4.jpg" }
    ];
  }
}

function renderSlider(slides) {
  if (!slides || slides.length === 0) return;
  sliderData = slides;
  
  const sliderTrack = document.getElementById('sliderTrack');
  const sliderDots = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  
  if (!sliderTrack) return;
  
  sliderTrack.innerHTML = slides.map((slide, idx) => `
    <div class="slider-slide">
      <div class="slider-card">
        <img 
          src="${slide.imageUrl}" 
          alt="${slide.judul}" 
          onerror="this.onerror=null; this.src='https://picsum.photos/id/108/400/200'"
        >
        <div class="slider-overlay">
          ${slide.badge ? `<span class="slider-badge">${slide.badge}</span>` : ''}
          <h3>${slide.judul}</h3>
          <p>${slide.subJudul}</p>
        </div>
      </div>
    </div>
  `).join('');
  
  sliderDots.innerHTML = slides.map((_, i) => `<div class="slider-dot ${i === currentSlideIndex ? 'active' : ''}" data-index="${i}"></div>`).join('');
  
  updateSliderPosition();
  
  document.querySelectorAll('.slider-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.getAttribute('data-index'));
      if (!isNaN(index)) {
        currentSlideIndex = index;
        updateSliderPosition();
        updateDotsActive();
        resetAutoSlide();
      }
    });
  });
  
  if (prevBtn) {
    prevBtn.onclick = () => {
      currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
      updateSliderPosition();
      updateDotsActive();
      resetAutoSlide();
    };
  }
  
  if (nextBtn) {
    nextBtn.onclick = () => {
      currentSlideIndex = (currentSlideIndex + 1) % slides.length;
      updateSliderPosition();
      updateDotsActive();
      resetAutoSlide();
    };
  }
}

function updateSliderPosition() {
  const sliderTrack = document.getElementById('sliderTrack');
  if (sliderTrack) sliderTrack.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
}

function updateDotsActive() {
  document.querySelectorAll('.slider-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlideIndex);
  });
}

function startAutoSlide(intervalMs = 5000) {
  if (slideInterval) clearInterval(slideInterval);
  slideInterval = setInterval(() => {
    if (sliderData.length > 0) {
      currentSlideIndex = (currentSlideIndex + 1) % sliderData.length;
      updateSliderPosition();
      updateDotsActive();
    }
  }, intervalMs);
}

function resetAutoSlide() {
  if (slideInterval) { clearInterval(slideInterval); startAutoSlide(5000); }
}

function setupSliderTouch() {
  const sliderContainer = document.querySelector('.slider-container');
  if (!sliderContainer) return;
  let touchStartX = 0, touchEndX = 0;
  sliderContainer.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; });
  sliderContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchEndX < touchStartX - 50) {
      currentSlideIndex = (currentSlideIndex + 1) % sliderData.length;
      updateSliderPosition(); updateDotsActive(); resetAutoSlide();
    } else if (touchEndX > touchStartX + 50) {
      currentSlideIndex = (currentSlideIndex - 1 + sliderData.length) % sliderData.length;
      updateSliderPosition(); updateDotsActive(); resetAutoSlide();
    }
  });
}
