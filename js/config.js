// Konfigurasi Google Sheets
const CONFIG = {
  SHEET_ID: '1ia6zeUJZv2Wp1OkO2XbJQFoJfiUnseN9HpEyIEDazTE',
  SERVICES_GID: '1142979216',
  SLIDER_GID: '800306065',
  AGENT_SPREADSHEET_ID: '1FgWiv56J2w7A0WprwqOKJMU7BO4mX3jotW3IC397rWg',
  AGENT_SHEET_GID: '1931290882'
};

// Kontak
const CONTACTS = {
  whatsapp: '62882007670299',
  email: 'suruhboy.id@gmail.com',
  instagram: 'https://instagram.com/suruhboy.id',
  tiktok: 'https://tiktok.com/@jasasuruhboyolali',
  youtube: 'https://youtube.com/@suruhboy',
  linkedin: 'https://linkedin.com/company/suruhboy'
};

// Daftar Kecamatan
const KECAMATAN = ["Ampel","Andong","Banyudono","Boyolali Kota","Cepogo","Juwangi","Karanggede","Kemusu","Klego","Mojosongo","Musuk","Ngemplak","Nogosari","Sambi","Sawit","Selo","Simo","Tamansari","Teras","Wonosegoro"];

// Ikon Mapping
const ICON_MAP = {
  "Antar Makanan": "makan.png",
  "Kirim Barang": "barang.png",
  "Antar Orang": "orang.png",
  "Titip Belanja": "belanja.png",
  "Bersih-Bersih": "bersih.png",
  "Caregiver/Jaga RS": "caregiver.png",
  "Jasa Nemenin": "nemenin.png",
  "Custom Request": "custom.png"
};

// Detail Layanan
const SERVICE_DETAILS = {
  "Antar Makanan": {
    icon: "makan.png",
    description: "Layanan pesan antar makanan dari berbagai restoran favorit Anda.",
    features: ["Pesan dari berbagai restoran", "Pengantaran cepat & aman", "Tracking pesanan real-time", "Bisa pesan untuk banyak orang"],
    price: "Mulai Rp 10.000",
    priceNote: "Harga tergantung jarak dan berat"
  },
  "Kirim Barang": {
    icon: "barang.png",
    description: "Kirim paket, dokumen, atau barang apapun ke seluruh wilayah dengan aman dan cepat.",
    features: ["Asuransi barang gratis", "Tracking real-time", "Packing aman", "Bisa COD"],
    price: "Mulai Rp 15.000",
    priceNote: "Harga tergantung berat dan jarak"
  },
  "Antar Orang": {
    icon: "orang.png",
    description: "Layanan jemput dan antar orang ke tujuan.",
    features: ["Driver ramah & profesional", "Armada nyaman", "Bisa antar bandara/stasiun", "Menunggu gratis 15 menit"],
    price: "Mulai Rp 20.000",
    priceNote: "Harga tergantung jarak"
  },
  "Titip Belanja": {
    icon: "belanja.png",
    description: "Titip belanja kebutuhan Anda di pasar/swalayan.",
    features: ["Belanja di pasar/swalayan pilihan", "Foto bukti belanja", "Bisa request produk tertentu", "Laporan lengkap"],
    price: "Mulai Rp 15.000",
    priceNote: "+ biaya belanja"
  },
  "Bersih-Bersih": {
    icon: "bersih.png",
    description: "Layanan bersih-bersih rumah, kantor, atau apartemen.",
    features: ["Peralatan bersih disediakan", "Tenaga profesional", "Bisa request area spesifik", "Garansi kepuasan"],
    price: "Mulai Rp 50.000",
    priceNote: "Harga tergantung luas area"
  },
  "Caregiver/Jaga RS": {
    icon: "caregiver.png",
    description: "Layanan pendamping lansia, anak, atau pasien di rumah sakit.",
    features: ["Pendamping lansia di rumah", "Jaga pasien di rumah sakit", "Bantuan makan dan minum obat", "Tenaga terlatih & bersertifikat", "24/7 siap bantu", "Laporan harian perkembangan"],
    price: "Mulai Rp 75.000",
    priceNote: "Harga per shift (8 jam)"
  },
  "Jasa Nemenin": {
    icon: "nemenin.png",
    description: "Layanan pendamping berbagai aktivitas.",
    features: ["Pendamping ramah & sabar", "Bisa untuk berbagai aktivitas", "Fleksibel waktu", "Bisa harian/mingguan"],
    price: "Mulai Rp 40.000",
    priceNote: "Harga per jam"
  },
  "Custom Request": {
    icon: "custom.png",
    description: "Butuh layanan khusus? Ceritakan kebutuhan Anda.",
    features: ["Layanan sesuai permintaan", "Konsultasi gratis", "Harga transparan", "Garansi kepuasan"],
    price: "Hubungi CS",
    priceNote: "Harga tergantung permintaan"
  }
};

// URLs
const SERVICES_URL = `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/export?format=csv&gid=${CONFIG.SERVICES_GID}`;
const SLIDER_URL = `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/export?format=csv&gid=${CONFIG.SLIDER_GID}`;
const AGENT_URL = `https://docs.google.com/spreadsheets/d/${CONFIG.AGENT_SPREADSHEET_ID}/export?format=csv&gid=${CONFIG.AGENT_SHEET_GID}`;

// Global state
let servicesData = [];
let onlineAgents = [];
let allAgents = [];
let sliderData = [];
let currentSlideIndex = 0;
let slideInterval;
