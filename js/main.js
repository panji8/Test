// Main initialization
async function init() {
  // Load services
  servicesData = await loadServicesFromSheet();
  renderMenuGrid();
  
  // Load agent status
  await loadAgentStatusFromSheet();
  startAutoRefresh();
  
  // Load and render slider
  const sliderDataLoaded = await loadSliderFromSheet();
  renderSlider(sliderDataLoaded);
  startAutoSlide(5000);
  setupSliderTouch();
  
  // Hide all secondary pages initially
  document.getElementById('searchResultPage').style.display = 'none';
  document.getElementById('agentCheckPage').style.display = 'none';
  document.getElementById('serviceDetailContainer').style.display = 'none';
  const allPages = ['privacyPage', 'termsPage', 'contactPage', 'helpCenterPage', 'registerAgentPage'];
  allPages.forEach(page => { 
    const el = document.getElementById(page); 
    if (el) el.style.display = 'none'; 
  });
  
  // Setup event listeners
  const homeSearchWrapper = document.getElementById('homeSearchWrapper');
  const homeSearchInput = document.getElementById('homeSearchInput');
  const backToHomeBtn = document.getElementById('backToHomeBtn');
  const backFromAgentBtn = document.getElementById('backFromAgentBtn');
  const checkAgentCard = document.getElementById('checkAgentCard');
  const checkAgentBtn = document.getElementById('checkAgentBtn');
  const resultSearchInput = document.getElementById('resultSearchInput');
  
  homeSearchWrapper.addEventListener('click', openSearchPage);
  homeSearchInput.addEventListener('click', openSearchPage);
  backToHomeBtn.addEventListener('click', backToHome);
  if (backFromAgentBtn) backFromAgentBtn.addEventListener('click', backToHome);
  if (checkAgentCard) checkAgentCard.addEventListener('click', openAgentCheckPage);
  if (checkAgentBtn) checkAgentBtn.addEventListener('click', checkAgentAvailability);
  if (resultSearchInput) resultSearchInput.addEventListener('input', (e) => performResultSearch(e.target.value));
  
  // Setup contact and info page links
  setupContactButtons();
  setupInfoPageLinks();
}

// Start the application
init();
