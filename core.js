// ============================================================
// BMS Portal - Core Application State & Shared Utilities v3.0
// Shared state across admin.html, staff.html, and dealer.html
// ============================================================

const DEFAULT_HOME_BANNERS = [
    {
        id: "banner-sanitary-ware",
        tag: "100% VITREOUS CHINA",
        title: "Vitreous China One-Piece & Wall Hung",
        subtitle: "Tornado 4D Rimless Flush • Nano Glaze Anti-Bacterial Technology",
        badge: "10-Year Craftsmanship Guarantee",
        btnText: "Explore Sanitary Ware",
        btnTarget: "products",
        bgGradient: "transparent",
        imageUrl: "banners/banner1.jpg",
        mobileImageUrl: "banners/banner1.jpg"
    },
    {
        id: "banner-art-basins",
        tag: "DESIGNER LUXURY",
        title: "Handcrafted Art Basins & Modular Vanities",
        subtitle: "Matte Finish Table-Top Basins • Waterproof PVC Vanity Cabinets",
        badge: "Exclusive Morbi Craft",
        btnText: "View Art Basins",
        btnTarget: "products",
        bgGradient: "transparent",
        imageUrl: "banners/banner2.jpg",
        mobileImageUrl: "banners/banner2.jpg"
    },
    {
        id: "banner-kitchen-sinks",
        tag: "MODULAR KITCHEN",
        title: "Quartz Granite & 304 Steel Kitchen Sinks",
        subtitle: "Scratch-Proof Quartz Stone • Anti-Corrosion Heavy Duty Handmade Sinks",
        badge: "Direct Factory Pricing",
        btnText: "Explore Kitchen Sinks",
        btnTarget: "products",
        bgGradient: "transparent",
        imageUrl: "banners/banner3.jpg",
        mobileImageUrl: "banners/banner3.jpg"
    },
    {
        id: "banner-luxury-showers",
        tag: "WELLNESS & FITTINGS",
        title: "Concealed Rainfall Showers & Bath Fittings",
        subtitle: "Thermostatic Water Mixers • Multi-Flow Luxury Shower Systems",
        badge: "High Pressure Certified",
        btnText: "View Shower Systems",
        btnTarget: "products",
        bgGradient: "transparent",
        imageUrl: "banners/banner4.jpg",
        mobileImageUrl: "banners/banner4.jpg"
    }
];

const DEFAULT_HOME_CATEGORY_CARDS = [
    {
        id: "catcard-1",
        title: "Sanitary Ware",
        subtitle: "One-Piece, Wall-Hung & Closets",
        category: "Sanitary Ware",
        icon: "fa-toilet",
        active: true
    },
    {
        id: "catcard-2",
        title: "Kitchen Sinks",
        subtitle: "Stainless Steel, Handmade 304 & Quartz",
        category: "Kitchen Sinks",
        icon: "fa-sink",
        active: true
    },
    {
        id: "catcard-3",
        title: "Vanity Cabinets & Mirrors",
        subtitle: "PVC Vanity Cabinets & LED Mirrors",
        category: "Vanity Cabinets & Mirrors",
        icon: "fa-cubes",
        active: true
    },
    {
        id: "catcard-4",
        title: "Drain Covers & Accessories",
        subtitle: "FRP Manhole Covers & Fittings",
        category: "Drain Covers & Accessories",
        icon: "fa-circle-dot",
        active: true
    }
];

const DEFAULT_CATEGORY_TREE = {
    "Sanitary Ware": ["One Piece Closet", "Table Top Basin", "Wall Hung Closet", "Counter Wash Basin", "Water Closet & Pan"],
    "Ceramic Sanitary Ware": ["One Piece Closet", "Table Top Basin", "Wall Hung Closet", "Counter Wash Basin", "Water Closet & Pan"],
    "Kitchen Sinks": ["Stainless Steel Sink", "Handmade 304 Sink", "Quartz Granite Sink"],
    "Vanity Cabinets & Mirrors": ["PVC Vanity Cabinets", "LED Smart Mirrors"],
    "Drain Covers & Accessories": ["Manhole Drain Covers", "CP Fittings & Couplings"]
};

const DEFAULT_CATEGORIES = ["Sanitary Ware", "Kitchen Sinks", "Vanity Cabinets & Mirrors", "Drain Covers & Accessories"];

function normalizeCategoryName(catName) {
    if (!catName || catName === 'all') return 'all';
    const trimmed = String(catName).trim();
    const available = (typeof state !== 'undefined' && state && Array.isArray(state.categories) && state.categories.length > 0)
        ? state.categories
        : DEFAULT_CATEGORIES;
    
    // 1. Exact match in available categories
    const exact = available.find(c => c && c.trim().toLowerCase() === trimmed.toLowerCase());
    if (exact) return exact;

    // 2. Known alias mappings
    const lower = trimmed.toLowerCase();
    if (lower.includes('ceramic') || lower.includes('sanitary')) {
        const sw = available.find(c => c && c.toLowerCase().includes('sanitary'));
        if (sw) return sw;
    }
    if (lower.includes('sink')) {
        const ks = available.find(c => c && c.toLowerCase().includes('sink'));
        if (ks) return ks;
    }
    if (lower.includes('vanity') || lower.includes('mirror')) {
        const vm = available.find(c => c && c.toLowerCase().includes('vanity'));
        if (vm) return vm;
    }
    if (lower.includes('drain') || lower.includes('cover')) {
        const dc = available.find(c => c && c.toLowerCase().includes('drain'));
        if (dc) return dc;
    }

    return trimmed;
}
window.normalizeCategoryName = normalizeCategoryName;

function isProductInCategory(product, targetCat) {
    if (!product || !targetCat || targetCat === 'all') return true;
    const pCat = String(product.category || '').trim();
    const tCat = String(targetCat).trim();
    if (pCat === tCat) return true;
    if (normalizeCategoryName(pCat) === normalizeCategoryName(tCat)) return true;
    const pLow = pCat.toLowerCase();
    const tLow = tCat.toLowerCase();
    if ((pLow.includes('sanitary') || pLow.includes('ceramic')) && (tLow.includes('sanitary') || tLow.includes('ceramic'))) return true;
    if (pLow.includes('sink') && tLow.includes('sink')) return true;
    if (pLow.includes('vanity') && tLow.includes('vanity')) return true;
    if (pLow.includes('drain') && tLow.includes('drain')) return true;
    return false;
}
window.isProductInCategory = isProductInCategory;

function sortProductsBySubcategoryAndOrder(products, categoryName) {
    if (!products || !Array.isArray(products)) return [];
    const tree = (typeof state !== 'undefined' && state && state.categoryTree && Object.keys(state.categoryTree).length > 0)
        ? state.categoryTree
        : DEFAULT_CATEGORY_TREE;

    const getSubCatIndex = (p) => {
        const cat = p.category || categoryName || '';
        const normCat = (typeof normalizeCategoryName === 'function') ? normalizeCategoryName(cat) : cat;
        const subCats = tree[cat] || tree[normCat] || (DEFAULT_CATEGORY_TREE && (DEFAULT_CATEGORY_TREE[normCat] || DEFAULT_CATEGORY_TREE[cat])) || [];
        const sc = p.subcategory || p.subCategory || '';
        if (!sc) return 9999;
        const idx = subCats.findIndex(s => s && s.trim().toLowerCase() === sc.trim().toLowerCase());
        return idx === -1 ? 9999 : idx;
    };

    const getDisplayOrder = (p) => {
        const num = parseInt(p.displayOrder, 10);
        return isNaN(num) ? 9999 : num;
    };

    return [...products].sort((a, b) => {
        // If sorting across multiple categories, sort by category order first
        if (!categoryName || categoryName === 'all') {
            const catA = (typeof normalizeCategoryName === 'function') ? normalizeCategoryName(a.category) : (a.category || '');
            const catB = (typeof normalizeCategoryName === 'function') ? normalizeCategoryName(b.category) : (b.category || '');
            if (catA !== catB) {
                const available = (typeof state !== 'undefined' && state && state.categories) ? state.categories : DEFAULT_CATEGORIES;
                const cIdxA = available.indexOf(catA);
                const cIdxB = available.indexOf(catB);
                const finalCIdxA = cIdxA === -1 ? 9999 : cIdxA;
                const finalCIdxB = cIdxB === -1 ? 9999 : cIdxB;
                if (finalCIdxA !== finalCIdxB) return finalCIdxA - finalCIdxB;
            }
        }

        // 1. Sort by Subcategory order (as set in Category Manager)
        const subIdxA = getSubCatIndex(a);
        const subIdxB = getSubCatIndex(b);
        if (subIdxA !== subIdxB) return subIdxA - subIdxB;

        // 2. Sort by Product displayOrder within that subcategory
        const ordA = getDisplayOrder(a);
        const ordB = getDisplayOrder(b);
        if (ordA !== ordB) return ordA - ordB;

        // 3. Fallback: Model name
        return (a.model || '').localeCompare(b.model || '');
    });
}
window.sortProductsBySubcategoryAndOrder = sortProductsBySubcategoryAndOrder;

const DEFAULT_PRODUCTS = [
    { id: "prod-1", category: "Ceramic Sanitary Ware", subcategory: "One Piece Closet", model: "ONE PIECE", grade: "ROK", material: "Vitreous China", colour: "White", price: 1950, billRate: 550, weight: 38, stock: 100, displayOrder: 10, isHot: true },
    { id: "prod-2", category: "Ceramic Sanitary Ware", subcategory: "Wall Hung Closet", model: "Wall Hung", grade: "ROK", material: "Vitreous China", colour: "White", price: 680, billRate: 100, weight: 15, stock: 120, displayOrder: 20, isHot: false },
    { id: "prod-3", category: "Ceramic Sanitary Ware", subcategory: "One Piece Closet", model: "717-Amaze S-9\",P-7\"", grade: "Premium", material: "Vitreous China", colour: "White", price: 2000, billRate: 500, weight: 15, stock: 80, displayOrder: 30, isHot: false },
    { id: "prod-4", category: "Ceramic Sanitary Ware", subcategory: "One Piece Closet", model: "719-Volvo S-9\",P-7\"", grade: "Premium", material: "Vitreous China", colour: "White", price: 2000, billRate: 500, weight: 15, stock: 85, displayOrder: 40, isHot: false },
    { id: "prod-5", category: "Ceramic Sanitary Ware", subcategory: "One Piece Closet", model: "701-Alaska S-9\",S-12\",P-7\"", grade: "Premium", material: "Vitreous China", colour: "White", price: 1900, billRate: 500, weight: 15, stock: 90, displayOrder: 50, isHot: false },
    { id: "prod-5-std", category: "Ceramic Sanitary Ware", subcategory: "One Piece Closet", model: "701-Alaska S-9\",S-12\",P-7\"", grade: "STD", material: "Vitreous China", colour: "White", price: 1450, billRate: 400, weight: 15, stock: 75, displayOrder: 52, isHot: false },
    { id: "prod-5-com", category: "Ceramic Sanitary Ware", subcategory: "One Piece Closet", model: "701-Alaska S-9\",S-12\",P-7\"", grade: "Commercial", material: "Vitreous China", colour: "White", price: 1250, billRate: 350, weight: 15, stock: 60, displayOrder: 54, isHot: false },
    { id: "prod-6", category: "Ceramic Sanitary Ware", subcategory: "One Piece Closet", model: "721-Dero S-4\",S-9\",S-12\",P-7\"", grade: "ROK", material: "Vitreous China", colour: "White", price: 1850, billRate: 0, weight: 15, stock: 50, displayOrder: 60, isHot: false },
    { id: "prod-6-std", category: "Ceramic Sanitary Ware", subcategory: "One Piece Closet", model: "721-Dero S-4\",S-9\",S-12\",P-7\"", grade: "STD", material: "Vitreous China", colour: "White", price: 1350, billRate: 0, weight: 15, stock: 40, displayOrder: 62, isHot: false },
    { id: "prod-7", category: "Ceramic Sanitary Ware", subcategory: "One Piece Closet", model: "720-Cruz S-9\",P-7\"", grade: "ROK", material: "Vitreous China", colour: "White", price: 1900, billRate: 500, weight: 15, stock: 70, displayOrder: 70, isHot: false },
    { id: "prod-8", category: "Ceramic Sanitary Ware", subcategory: "One Piece Closet", model: "718-Orbit (Rimless) S-9\",P-7\"", grade: "Premium", material: "Vitreous China", colour: "White", price: 2000, billRate: 500, weight: 15, stock: 150, displayOrder: 80, isHot: true },
    { id: "prod-9", category: "Ceramic Sanitary Ware", subcategory: "One Piece Closet", model: "714-Venue (Tornado 4D) S-9\",S-12\"", grade: "Premium", material: "Vitreous China", colour: "White", price: 2000, billRate: 500, weight: 15, stock: 140, displayOrder: 90, isHot: true },
    { id: "prod-10", category: "Ceramic Sanitary Ware", subcategory: "One Piece Closet", model: "724-Brezza (Syphonic) S-9\"", grade: "ROK", material: "Vitreous China", colour: "White", price: 2000, billRate: 730, weight: 15, stock: 60, displayOrder: 100, isHot: false },
    { id: "prod-11", category: "Kitchen Sinks", subcategory: "Stainless Steel Sink", model: "Single Bowl 18x16", grade: "Premium", material: "304 Stainless Steel", colour: "Satin", price: 1500, billRate: 400, weight: 15, stock: 40, displayOrder: 110, isHot: false },
    { id: "prod-12", category: "Kitchen Sinks", subcategory: "Stainless Steel Sink", model: "Double Bowl 37x18", grade: "Premium", material: "304 Stainless Steel", colour: "Glossy", price: 3800, billRate: 1000, weight: 15, stock: 20, displayOrder: 120, isHot: false },
    { id: "prod-13", category: "Kitchen Sinks", subcategory: "Stainless Steel Sink", model: "Single Bowl 21x18 (Deep)", grade: "ROK", material: "202 Stainless Steel", colour: "Satin", price: 1800, billRate: 500, weight: 15, stock: 35, displayOrder: 130, isHot: false },
    { id: "prod-14", category: "Kitchen Sinks", subcategory: "Handmade 304 Sink", model: "Handmade Single Bowl 24x18", grade: "Premium", material: "Handmade 304 Steel", colour: "Matte", price: 4200, billRate: 1200, weight: 15, stock: 35, displayOrder: 140, isHot: true },
    { id: "prod-15", category: "Kitchen Sinks", subcategory: "Handmade 304 Sink", model: "Handmade Double Bowl 45x20", grade: "Premium", material: "Handmade 304 Steel", colour: "Matte", price: 8500, billRate: 2500, weight: 15, stock: 15, displayOrder: 150, isHot: false },
    { id: "prod-16", category: "Kitchen Sinks", subcategory: "Handmade 304 Sink", model: "Handmade Apron Single 30x18", grade: "Premium", material: "Handmade 304 Steel", colour: "Matte Black", price: 6500, billRate: 2000, weight: 15, stock: 10, displayOrder: 160, isHot: false },
    { id: "prod-25", category: "Kitchen Sinks", subcategory: "Quartz Granite Sink", model: "Quartz Single Bowl 21x18", grade: "Premium", material: "Quartz Granite", colour: "Metallic Black", price: 5500, billRate: 1500, weight: 15, stock: 25, displayOrder: 170, isHot: true },
    { id: "prod-26", category: "Kitchen Sinks", subcategory: "Quartz Granite Sink", model: "Quartz Double Bowl 36x18", grade: "Premium", material: "Quartz Granite", colour: "White Pearl", price: 11000, billRate: 3000, weight: 12, stock: 12, displayOrder: 180, isHot: false },
    { id: "prod-27", category: "Kitchen Sinks", subcategory: "Quartz Granite Sink", model: "Quartz Single Bowl 24x20", grade: "Premium", material: "Quartz Granite", colour: "Sandy Beige", price: 7200, billRate: 2000, weight: 15, stock: 18, displayOrder: 190, isHot: false },
    { id: "prod-17", category: "Ceramic Sanitary Ware", subcategory: "Table Top Basin", finishType: "Designer Art", model: "Table Top Basin Round", grade: "Premium", material: "Vitreous China", colour: "Matte Black", price: 2500, billRate: 800, weight: 15, stock: 50, displayOrder: 200, isHot: true },
    { id: "prod-18", category: "Ceramic Sanitary Ware", subcategory: "Table Top Basin", finishType: "White & Gold", model: "Table Top Basin Oval", grade: "Premium", material: "Vitreous China", colour: "White & Gold", price: 3200, billRate: 1000, weight: 15, stock: 45, displayOrder: 210, isHot: false },
    { id: "prod-19", category: "Ceramic Sanitary Ware", subcategory: "Table Top Basin", finishType: "Marble Look", model: "Table Top Marble Look", grade: "Premium", material: "Vitreous China", colour: "Marble White", price: 4000, billRate: 1200, weight: 15, stock: 30, displayOrder: 220, isHot: false },
    { id: "prod-20", category: "Vanity Cabinets & Mirrors", subcategory: "PVC Vanity Cabinets", model: "Luxury Cabinet Vanity 600mm", grade: "Premium", material: "Waterproof PVC", colour: "Grey Slate", price: 12500, billRate: 4000, weight: 15, stock: 10, displayOrder: 230, isHot: true },
    { id: "prod-21", category: "Vanity Cabinets & Mirrors", subcategory: "PVC Vanity Cabinets", model: "Premium Cabinet Vanity 800mm", grade: "Premium", material: "Waterproof PVC", colour: "Blue Pastel", price: 16500, billRate: 5000, weight: 15, stock: 8, displayOrder: 240, isHot: false },
    { id: "prod-22", category: "Drain Covers & Accessories", subcategory: "Manhole Drain Covers", model: "FRP Cover 12x12", grade: "ROK", material: "Heavy Duty FRP", colour: "Black", price: 650, billRate: 200, weight: 15, stock: 100, displayOrder: 250, isHot: false },
    { id: "prod-23", category: "Drain Covers & Accessories", subcategory: "Manhole Drain Covers", model: "FRP Cover 18x18", grade: "ROK", material: "Heavy Duty FRP", colour: "Grey", price: 1200, billRate: 350, weight: 15, stock: 80, displayOrder: 260, isHot: false },
    { id: "prod-24", category: "Drain Covers & Accessories", subcategory: "Manhole Drain Covers", model: "FRP Cover 24x24", grade: "ROK", material: "Heavy Duty FRP", colour: "Grey", price: 1800, billRate: 500, weight: 15, stock: 60, displayOrder: 270, isHot: false },
    { id: "prod-28", category: "Drain Covers & Accessories", subcategory: "CP Fittings & Couplings", model: "Hydraulic Slim Seat Cover", grade: "Premium", material: "Heavy Virgin PP", colour: "White", price: 240, billRate: 60, weight: 1.5, stock: 200, displayOrder: 280, isHot: true, packagingType: "dual", boxQty: 20, boxPrice: 195, boxBillRate: 50 },
    { id: "prod-29", category: "Drain Covers & Accessories", subcategory: "CP Fittings & Couplings", model: "Soft Close Seat Cover Standard", grade: "ROK", material: "Standard PP", colour: "White", price: 200, billRate: 50, weight: 1.2, stock: 300, displayOrder: 290, isHot: false, packagingType: "dual", boxQty: 20, boxPrice: 165, boxBillRate: 40 }
];

const DEFAULT_MERCHANTS = [
    {
        id: "merch-1",
        uid: "MEH811",
        name: "Mehta Traders",
        ownerName: "Haresh Mehta",
        address: "Morbi Road, Rajkot, Gujarat",
        city: "Rajkot",
        pincode: "360001",
        phone: "919876543210",
        callingPhone: "9876543210",
        gst: "24AAACM1234A1Z5",
        pin: "123456",
        creditDays: 30,
        allowedGrades: ["Premium", "ROK"],
        globalDiscount: -10,
        specialRates: {
            "prod-1": { price: 1800, billRate: 500 },
            "prod-11": { price: 1400, billRate: 380 }
        }
    },
    {
        id: "merch-2",
        uid: "PAT512",
        name: "Patel Sanitary Mart",
        ownerName: "Ketan Patel",
        address: "GIDC, Ahmedabad, Gujarat",
        city: "Ahmedabad",
        pincode: "382445",
        phone: "919876543211",
        callingPhone: "9876543211",
        gst: "24AAPCP5678B2Z1",
        pin: "567890",
        creditDays: 45,
        allowedGrades: ["Premium", "ROK", "STD"],
        globalDiscount: 0,
        specialRates: {}
    },
    {
        id: "merch-3",
        uid: "GAN903",
        name: "Shree Ganesh Ceramics",
        ownerName: "Ghanshyambhai",
        address: "Varachha Main Road, Surat, Gujarat",
        city: "Surat",
        pincode: "395006",
        phone: "919876543212",
        callingPhone: "9876543212",
        gst: "24AABCS9988C1Z9",
        pin: "112233",
        creditDays: 30,
        allowedGrades: ["Premium", "ROK", "STD", "Commercial"],
        globalDiscount: -5,
        specialRates: {}
    },
    {
        id: "merch-4",
        uid: "KRI404",
        name: "Krishna Bath Gallery",
        ownerName: "Rajeshbhai Krishna",
        address: "Sayajigunj, Vadodara, Gujarat",
        city: "Vadodara",
        pincode: "390005",
        phone: "919876543213",
        callingPhone: "9876543213",
        gst: "24AAECK4433D1Z0",
        pin: "3344",
        creditDays: 15,
        allowedGrades: ["Premium"],
        globalDiscount: 5,
        specialRates: {}
    }
];

const DEFAULT_FIREBASE_CONFIG = {
    apiKey: "AIzaSyBFDl4KVuUfFAVRWqzTVqjs4EG-BpzTZH0",
    authDomain: "rabbitbathware-d9d1b.firebaseapp.com",
    databaseURL: "https://rabbitbathware-d9d1b-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "rabbitbathware-d9d1b",
    storageBucket: "rabbitbathware-d9d1b.firebasestorage.app",
    messagingSenderId: "589259338882",
    appId: "1:589259338882:web:ec25ce7838b6e67a62f09b",
    measurementId: "G-3TEHE9CGMZ"
};
window.DEFAULT_FIREBASE_CONFIG = DEFAULT_FIREBASE_CONFIG;

const DEFAULT_SETTINGS = {
    adminWA: "919876543210",
    gstRate: 18,
    companyName: "Shree Ram Bathware",
    currencySymbol: "\u20B9",
    allAsPerOrder: false,
    masterAdminPwd: "2628",
    adminPwd: "2628",
    staffPwd: "1122",
    ownerPhone: "919876543210",
    masterRecoveryKey: "RABBIT-OWNER-9999",
    firebaseConfigJSON: JSON.stringify(DEFAULT_FIREBASE_CONFIG)
};

// ---- SHARED STATE ----
let state = {
    categories: [...DEFAULT_CATEGORIES],
    categoryTree: { ...DEFAULT_CATEGORY_TREE },
    categoryMeta: {},
    products: [...DEFAULT_PRODUCTS],
    merchants: [...DEFAULT_MERCHANTS],
    orders: [],
    ledger: [],
    settings: { ...DEFAULT_SETTINGS },
    homeBanners: [...DEFAULT_HOME_BANNERS],
    homeCategoryCards: [...DEFAULT_HOME_CATEGORY_CARDS],
    dealerRequests: [],
    otpRequests: []
};

// Generate a random merchant ID if needed
function generateMerchantUID(m) {
    const name = m.name || 'MER';
    const namePrefix = name.trim().slice(0, 3).toUpperCase();
    return namePrefix + Math.floor(100 + Math.random() * 900).toString();
}

// Helper functions for Public/Private Category Visibility
function isCategoryPublic(catName) {
    if (!state.categoryMeta || !state.categoryMeta[catName]) return true; // Default public
    return state.categoryMeta[catName].isPublic !== false;
}

function isCategoryVisibleToMerchant(catName, merchant) {
    // 1. Public / Mandatory Category -> Visible to EVERYONE (Guests & All Merchants)
    if (isCategoryPublic(catName)) return true;

    // 2. Private Category -> Requires Dealer Login and Merchant Authorization
    if (!merchant) return false; // Guest cannot see private categories

    const allowed = merchant.allowedPrivateCategories || [];
    return allowed.includes(catName);
}

function canMerchantViewOffers(merchant) {
    if (!merchant) return false;
    return merchant.allowOffers === true;
}

// State Loading and Initialization
let _firebaseInitialized = false;
let _isSyncingFromRemote = false;

// Global Debounce Utility
function debounce(func, delay = 200) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}
window.debounce = debounce;

// Performance Memoization Cache for Merchant Metrics
let _perfCache = new Map();
function invalidatePerformanceCache() {
    _perfCache.clear();
}
window.invalidatePerformanceCache = invalidatePerformanceCache;

function getEffectiveFirebaseConfig() {
    if (state && state.settings && state.settings.firebaseConfigJSON) {
        try {
            const parsed = typeof state.settings.firebaseConfigJSON === 'string'
                ? JSON.parse(state.settings.firebaseConfigJSON)
                : state.settings.firebaseConfigJSON;
            if (parsed && parsed.apiKey && parsed.databaseURL && !parsed.apiKey.includes('...')) {
                return parsed;
            }
        } catch (err) {}
    }
    return DEFAULT_FIREBASE_CONFIG;
}

function sanitizeStaffData(target) {
    if (!target) return;
    try {
        if (Array.isArray(target.products)) {
            target.products.forEach(p => {
                if (!p) return;
                p.price = 0;
                p.billRate = 0;
                p.boxPrice = 0;
                p.boxBillRate = 0;
                if (p.specifications && p.specifications.mrp) {
                    delete p.specifications.mrp;
                }
            });
        }
        if (Array.isArray(target.merchants)) {
            target.merchants.forEach(m => {
                if (!m) return;
                m.specialRates = {};
                m.balances = {};
                m.openingBalance = 0;
                m.currentBalance = 0;
            });
        }
        if (Array.isArray(target.orders)) {
            target.orders.forEach(o => {
                if (!o) return;
                o.totalBill = 0;
                o.totalCash = 0;
                o.totalAmount = 0;
                delete o.financials;
                if (Array.isArray(o.items)) {
                    o.items.forEach(it => {
                        it.price = 0;
                        it.billRate = 0;
                        it.total = 0;
                        it.cashAmount = 0;
                        it.billAmount = 0;
                    });
                }
            });
        }
        target.ledger = [];
    } catch(err) {
        console.error("sanitizeStaffData error:", err);
    }
}
window.sanitizeStaffData = sanitizeStaffData;

function reconcileDispatchedOrdersToLedger(targetState) {
    if (!targetState) return false;
    if (!Array.isArray(targetState.ledger)) targetState.ledger = [];
    if (!Array.isArray(targetState.orders)) return false;

    let modified = false;
    const deletedOrderIds = Array.isArray(targetState.deletedOrderIds) ? targetState.deletedOrderIds : [];
    const validOrders = targetState.orders.filter(o => o && o.id);
    const validOrderMap = new Map();
    validOrders.forEach(o => validOrderMap.set(o.id, o));

    // 1. Remove orphaned sales invoices whose orders are deleted or no longer Dispatched/Delivered
    const initialLen = targetState.ledger.length;
    targetState.ledger = targetState.ledger.filter(l => {
        if (!l) return false;
        if (!l.orderId) return true; // Keep manual payments / receipts / credits
        // If order was explicitly deleted
        if (deletedOrderIds.includes(l.orderId)) return false;
        // If order does not exist in state.orders
        const order = validOrderMap.get(l.orderId);
        if (!order) return false;
        // If order exists but is Cancelled or Pending (not Dispatched or Delivered)
        if (order.status !== "Dispatched" && order.status !== "Delivered") return false;
        return true;
    });
    if (targetState.ledger.length !== initialLen) {
        modified = true;
    }

    // 2. Add active dispatched orders if missing from ledger
    validOrders.forEach(order => {
        if (!order || (order.status !== "Dispatched" && order.status !== "Delivered")) return;

        // Check if white entry exists for this order
        const hasWhiteEntry = targetState.ledger.some(e => e && e.orderId === order.id && ((e.whiteAmount && e.whiteAmount > 0) || (e.id && e.id.endsWith('w'))));
        // Check if black entry exists for this order
        const hasBlackEntry = targetState.ledger.some(e => e && e.orderId === order.id && ((e.blackAmount && e.blackAmount > 0) || (e.id && e.id.endsWith('b'))));

        const m = (targetState.merchants || []).find(x => x.id === order.merchantId);
        const mName = m ? m.name : (order.merchantName || "Party");
        const dDate = order.dispatchDate || order.date || (new Date().toLocaleDateString('en-GB')).replace(/\//g, '.');
        const dTs = order.dispatchTimestamp || order.timestamp || Date.now();
        const refNo = order.performerNo || "INV-" + (order.id ? order.id.slice(-4) : "001");

        const billAmt = (typeof order.totalBill === 'number' && order.totalBill > 0) ? order.totalBill : 0;
        const cashAmt = (typeof order.totalCash === 'number' && order.totalCash > 0) ? order.totalCash : 0;

        if (!hasWhiteEntry && billAmt > 0) {
            targetState.ledger.push({
                id: "led-" + dTs + "w",
                orderId: order.id,
                merchantId: order.merchantId,
                merchantName: mName,
                date: dDate,
                refNo: refNo,
                description: "Sales Invoice (Official Book)",
                whiteAmount: billAmt,
                blackAmount: 0,
                status: "Cleared"
            });
            modified = true;
        }

        if (!hasBlackEntry && cashAmt > 0) {
            targetState.ledger.push({
                id: "led-" + dTs + "b",
                orderId: order.id,
                merchantId: order.merchantId,
                merchantName: mName,
                date: dDate,
                refNo: refNo,
                description: "Cash Sale (Black Book)",
                whiteAmount: 0,
                blackAmount: cashAmt,
                status: "Cleared"
            });
            modified = true;
        }
    });

    return modified;
}
window.reconcileDispatchedOrdersToLedger = reconcileDispatchedOrdersToLedger;

function initFirebaseSync() {
    try {
        if (typeof firebase === 'undefined') {
            console.warn("Firebase SDK not loaded.");
            return;
        }
        
        const config = getEffectiveFirebaseConfig();
        if (!config || !config.apiKey || !config.databaseURL) {
            console.warn("Firebase config incomplete.");
            return;
        }
        
        if (!firebase.apps.length) {
            firebase.initializeApp(config);
        }
        window.firebaseDB = firebase.database();
        _firebaseInitialized = true;
        console.log("Firebase Realtime Cloud Database connected successfully! (rabbitbathware-d9d1b)");

        // Realtime Listener across all India branches & devices
        window.firebaseDB.ref("bms_state").on("value", (snapshot) => {
            const remoteVal = snapshot.val();
            if (remoteVal && typeof remoteVal === 'object' && Object.keys(remoteVal).length > 0) {
                _isSyncingFromRemote = true;
                
                if (remoteVal.homeBanners && !Array.isArray(remoteVal.homeBanners)) {
                    remoteVal.homeBanners = Object.values(remoteVal.homeBanners);
                }
                if (state && state.homeBanners && !Array.isArray(state.homeBanners)) {
                    state.homeBanners = Object.values(state.homeBanners);
                }

                // Track & merge tombstones so permanently deleted items are NEVER resurrected
                const remoteDeletedMerchants = Array.isArray(remoteVal.deletedMerchantIds) ? remoteVal.deletedMerchantIds : [];
                const localDeletedMerchants = (state && Array.isArray(state.deletedMerchantIds)) ? state.deletedMerchantIds : [];
                const allDeletedMerchants = Array.from(new Set([...remoteDeletedMerchants, ...localDeletedMerchants]));
                remoteVal.deletedMerchantIds = allDeletedMerchants;
                if (state) state.deletedMerchantIds = allDeletedMerchants;

                const remoteDeletedReqs = Array.isArray(remoteVal.deletedDealerRequestIds) ? remoteVal.deletedDealerRequestIds : [];
                const localDeletedReqs = (state && Array.isArray(state.deletedDealerRequestIds)) ? state.deletedDealerRequestIds : [];
                const allDeletedReqs = Array.from(new Set([...remoteDeletedReqs, ...localDeletedReqs]));
                remoteVal.deletedDealerRequestIds = allDeletedReqs;
                if (state) state.deletedDealerRequestIds = allDeletedReqs;

                const remoteDeletedProducts = Array.isArray(remoteVal.deletedProductIds) ? remoteVal.deletedProductIds : [];
                const localDeletedProducts = (state && Array.isArray(state.deletedProductIds)) ? state.deletedProductIds : [];
                const allDeletedProducts = Array.from(new Set([...remoteDeletedProducts, ...localDeletedProducts]));
                remoteVal.deletedProductIds = allDeletedProducts;
                if (state) state.deletedProductIds = allDeletedProducts;

                const remoteDeletedOrders = Array.isArray(remoteVal.deletedOrderIds) ? remoteVal.deletedOrderIds : [];
                const localDeletedOrders = (state && Array.isArray(state.deletedOrderIds)) ? state.deletedOrderIds : [];
                const allDeletedOrders = Array.from(new Set([...remoteDeletedOrders, ...localDeletedOrders]));
                remoteVal.deletedOrderIds = allDeletedOrders;
                if (state) state.deletedOrderIds = allDeletedOrders;

                // Strip any deleted items from remoteVal
                if (Array.isArray(remoteVal.merchants)) {
                    remoteVal.merchants = remoteVal.merchants.filter(m => m && !allDeletedMerchants.includes(m.id));
                }
                if (Array.isArray(remoteVal.dealerRequests)) {
                    remoteVal.dealerRequests = remoteVal.dealerRequests.filter(r => r && !allDeletedReqs.includes(r.id));
                }
                if (Array.isArray(remoteVal.products)) {
                    remoteVal.products = remoteVal.products.filter(p => p && !allDeletedProducts.includes(p.id));
                }
                if (Array.isArray(remoteVal.orders)) {
                    remoteVal.orders = remoteVal.orders.filter(o => o && !allDeletedOrders.includes(o.id));
                }
                if (Array.isArray(remoteVal.ledger)) {
                    remoteVal.ledger = remoteVal.ledger.filter(l => l && (!l.orderId || !allDeletedOrders.includes(l.orderId)));
                }

                // Smart Merge to ensure locally added data (e.g. from Mobile) is never lost
                let hasLocalAdditions = false;
                if (state) {
                    // 1. Merge Merchants (excluding deleted)
                    if (Array.isArray(state.merchants) && state.merchants.length > 0) {
                        const remoteMerchants = Array.isArray(remoteVal.merchants) ? remoteVal.merchants : [];
                        const mergedMerchants = [...remoteMerchants];
                        state.merchants.forEach(lm => {
                            if (!lm || allDeletedMerchants.includes(lm.id)) return;
                            if (!mergedMerchants.some(rm => (rm.id && rm.id === lm.id) || (rm.uid && rm.uid === lm.uid))) {
                                mergedMerchants.push(lm);
                                hasLocalAdditions = true;
                            }
                        });
                        remoteVal.merchants = mergedMerchants;
                    }

                    // 2. Merge Products (excluding deleted)
                    if (Array.isArray(state.products) && state.products.length > 0) {
                        const remoteProducts = Array.isArray(remoteVal.products) ? remoteVal.products : [];
                        const mergedProducts = [...remoteProducts];
                        state.products.forEach(lp => {
                            if (!lp || allDeletedProducts.includes(lp.id)) return;
                            if (!mergedProducts.some(rp => rp.id && rp.id === lp.id)) {
                                mergedProducts.push(lp);
                                hasLocalAdditions = true;
                            }
                        });
                        remoteVal.products = mergedProducts;
                    }

                    // 3. Merge Orders (excluding deleted)
                    if (Array.isArray(state.orders) && state.orders.length > 0) {
                        const remoteOrders = Array.isArray(remoteVal.orders) ? remoteVal.orders : [];
                        const mergedOrders = [...remoteOrders];
                        state.orders.forEach(lo => {
                            if (!lo || allDeletedOrders.includes(lo.id)) return;
                            if (!mergedOrders.some(ro => ro.id && ro.id === lo.id)) {
                                mergedOrders.push(lo);
                                hasLocalAdditions = true;
                            }
                        });
                        remoteVal.orders = mergedOrders;
                    }

                    // 4. Merge Dealer Requests (excluding deleted)
                    if (Array.isArray(state.dealerRequests) && state.dealerRequests.length > 0) {
                        const remoteReqs = Array.isArray(remoteVal.dealerRequests) ? remoteVal.dealerRequests : [];
                        const mergedReqs = [...remoteReqs];
                        state.dealerRequests.forEach(lr => {
                            if (!lr || allDeletedReqs.includes(lr.id)) return;
                            if (!mergedReqs.some(rr => rr.id && rr.id === lr.id)) {
                                mergedReqs.push(lr);
                                hasLocalAdditions = true;
                            }
                        });
                        remoteVal.dealerRequests = mergedReqs;
                    }

                    // 5. Merge Home Banners (protect custom banners with images)
                    if (Array.isArray(state.homeBanners) && state.homeBanners.length > 0) {
                        const remoteBanners = Array.isArray(remoteVal.homeBanners) ? remoteVal.homeBanners : [];
                        const hasCustomInRemote = remoteBanners.some(b => b && (b.imageUrl || b.mobileImageUrl));
                        const hasCustomInLocal = state.homeBanners.some(b => b && (b.imageUrl || b.mobileImageUrl));
                        if (hasCustomInRemote) {
                            remoteVal.homeBanners = remoteBanners;
                        } else if (hasCustomInLocal) {
                            remoteVal.homeBanners = state.homeBanners;
                            hasLocalAdditions = true;
                        }
                    }

                    // 6. Merge Ledger (protect local ledger transactions & ensure array)
                    const remoteLedger = Array.isArray(remoteVal.ledger) ? remoteVal.ledger : [];
                    const mergedLedger = [...remoteLedger];
                    if (Array.isArray(state.ledger) && state.ledger.length > 0) {
                        state.ledger.forEach(ll => {
                            if (!ll || !ll.id) return;
                            if (ll.orderId && allDeletedOrders.includes(ll.orderId)) return;
                            if (!mergedLedger.some(rl => rl.id === ll.id)) {
                                mergedLedger.push(ll);
                                hasLocalAdditions = true;
                            }
                        });
                    }
                    remoteVal.ledger = mergedLedger;
                }

                if (!Array.isArray(remoteVal.ledger)) {
                    remoteVal.ledger = [];
                }

                state = remoteVal;

                // Self-healing: Reconcile dispatched orders into state.ledger if missing
                if (typeof reconcileDispatchedOrdersToLedger === 'function') {
                    if (reconcileDispatchedOrdersToLedger(state)) {
                        hasLocalAdditions = true;
                    }
                }
                const isStaffSession = typeof window !== 'undefined' && (window.location.pathname.includes('staff.html') || document.title.includes('Staff'));
                if (isStaffSession && typeof sanitizeStaffData === 'function') {
                    sanitizeStaffData(state);
                }
                try {
                    localStorage.setItem("bms_state", JSON.stringify(state));
                } catch(e) {}
                invalidatePerformanceCache();
                _isSyncingFromRemote = false;
                
                // If local had newer items not yet in cloud, push merged state back to cloud
                if (hasLocalAdditions) {
                    console.log("Local items merged with cloud state, syncing back to Firebase...");
                    debouncedCloudPush();
                }

                // Dispatch event across tabs and portals
                window.dispatchEvent(new CustomEvent('bms_remote_sync', { detail: state }));
                if (typeof refreshCurrentTab === 'function') {
                    refreshCurrentTab();
                } else if (typeof renderDashboard === 'function') {
                    renderDashboard();
                }
            } else {
                // If cloud database is empty, seed it with current local state!
                console.log("Cloud RTDB is empty. Seeding local state to Firebase...");
                syncToCloud();
            }
        });
    } catch (e) {
        console.error("Firebase sync initialization error:", e);
    }
}
window.initFirebaseSync = initFirebaseSync;

const debouncedCloudPush = debounce(() => {
    if (_isSyncingFromRemote || !_firebaseInitialized || !window.firebaseDB) return;
    try {
        const isStaff = typeof window !== 'undefined' && (window.location.pathname.includes('staff.html') || document.title.includes('Staff'));
        if (isStaff) {
            if (state.orders) window.firebaseDB.ref("bms_state/orders").set(JSON.parse(JSON.stringify(state.orders)));
            if (state.dealerRequests) window.firebaseDB.ref("bms_state/dealerRequests").set(JSON.parse(JSON.stringify(state.dealerRequests)));
            if (state.products && Array.isArray(state.products)) {
                const stockMap = {};
                state.products.forEach(p => { if (p && p.id) stockMap[p.id] = (p.stock || 0); });
                window.firebaseDB.ref("bms_state/products").once('value').then(snap => {
                    const cProds = snap.val();
                    if (cProds && Array.isArray(cProds)) {
                        cProds.forEach(cp => {
                            if (cp && cp.id && stockMap[cp.id] !== undefined) cp.stock = stockMap[cp.id];
                        });
                        window.firebaseDB.ref("bms_state/products").set(cProds);
                    }
                }).catch(() => {});
            }
            return;
        }

        const cleanState = JSON.parse(JSON.stringify(state));
        window.firebaseDB.ref("bms_state").set(cleanState).catch(err => {
            console.warn("Cloud sync push error:", err);
        });
    } catch (e) {
        console.error("Error pushing state to Firebase:", e);
    }
}, 600);

function instantCloudPush() {
    if (!_firebaseInitialized || !window.firebaseDB) return;
    try {
        const isStaff = typeof window !== 'undefined' && (window.location.pathname.includes('staff.html') || document.title.includes('Staff'));
        if (isStaff) {
            if (state.orders) window.firebaseDB.ref("bms_state/orders").set(JSON.parse(JSON.stringify(state.orders)));
            if (state.dealerRequests) window.firebaseDB.ref("bms_state/dealerRequests").set(JSON.parse(JSON.stringify(state.dealerRequests)));
            if (state.products && Array.isArray(state.products)) {
                const stockMap = {};
                state.products.forEach(p => { if (p && p.id) stockMap[p.id] = (p.stock || 0); });
                window.firebaseDB.ref("bms_state/products").once('value').then(snap => {
                    const cProds = snap.val();
                    if (cProds && Array.isArray(cProds)) {
                        cProds.forEach(cp => {
                            if (cp && cp.id && stockMap[cp.id] !== undefined) cp.stock = stockMap[cp.id];
                        });
                        window.firebaseDB.ref("bms_state/products").set(cProds);
                    }
                }).catch(() => {});
            }
            return;
        }

        const cleanState = JSON.parse(JSON.stringify(state));
        window.firebaseDB.ref("bms_state").set(cleanState).catch(err => {
            console.warn("Instant cloud push error:", err);
        });
    } catch (e) {
        console.error("Error in instantCloudPush:", e);
    }
}
window.instantCloudPush = instantCloudPush;

function syncToCloud(immediate = false) {
    if (_isSyncingFromRemote) return;
    if (immediate) {
        instantCloudPush();
    } else {
        debouncedCloudPush();
    }
}
window.syncToCloud = syncToCloud;

function loadState() {
    const saved = localStorage.getItem("bms_state");
    if (saved) {
        try {
            state = JSON.parse(saved);
            if (!state.categories || state.categories.length === 0) {
                state.categories = Object.keys(DEFAULT_CATEGORY_TREE);
            }
            if (!state.categoryTree || Object.keys(state.categoryTree).length === 0) {
                state.categoryTree = DEFAULT_CATEGORY_TREE;
            }
            if (!state.categoryMeta) state.categoryMeta = {};
            // Ensure default metadata for all categories
            (state.categories || []).forEach(c => {
                if (!state.categoryMeta[c]) {
                    state.categoryMeta[c] = { isPublic: true };
                }
            });

            if (!state.products || state.products.length === 0) {
                state.products = [...DEFAULT_PRODUCTS];
            } else {
                state.products.forEach(p => {
                    if (!p.grade) p.grade = 'Premium';
                    if (!p.material) {
                        const sub = (p.subcategory || '').toLowerCase();
                        if (sub.includes('steel')) p.material = '304 Stainless Steel';
                        else if (sub.includes('quartz')) p.material = 'Quartz Granite';
                        else if (sub.includes('pvc') || sub.includes('vanity')) p.material = 'Waterproof PVC';
                        else if (sub.includes('frp') || sub.includes('drain') || sub.includes('manhole')) p.material = 'Heavy Duty FRP';
                        else if (sub.includes('cp') || sub.includes('fitting') || sub.includes('seat')) p.material = 'Standard PP';
                        else p.material = 'Vitreous China';
                    }
                });
                // Ensure new demo items (prod-5-std, prod-5-com, prod-6-std) are populated if missing
                DEFAULT_PRODUCTS.forEach(dp => {
                    if (!state.products.some(p => p.id === dp.id)) {
                        state.products.push(dp);
                    }
                });
            }
            if (!state.merchants || state.merchants.length === 0) {
                state.merchants = [...DEFAULT_MERCHANTS];
            } else {
                state.merchants.forEach(m => {
                    if (!m.uid) m.uid = generateMerchantUID(m);
                    if (!m.pin || m.pin.length < 6) {
                        if (m.pin === '1234') m.pin = '123456';
                        else if (m.pin === '5678') m.pin = '567890';
                        else if (m.pin === '1122') m.pin = '112233';
                        else if (m.pin) m.pin = (m.pin + '000000').slice(0, 6);
                        else m.pin = '123456';
                    }
                    if (m.creditDays === undefined || m.creditDays === null) m.creditDays = 30;
                    if (m.orderCycleDays === undefined || m.orderCycleDays === null) m.orderCycleDays = 15;
                    if (!m.allowedGrades || !Array.isArray(m.allowedGrades) || m.allowedGrades.length === 0) {
                        const dm = DEFAULT_MERCHANTS.find(d => d.id === m.id || d.uid === m.uid);
                        m.allowedGrades = dm ? [...dm.allowedGrades] : ['Premium', 'ROK'];
                    }
                    if (!m.allowedPrivateCategories || !Array.isArray(m.allowedPrivateCategories)) {
                        m.allowedPrivateCategories = [];
                    }
                });
                DEFAULT_MERCHANTS.forEach(dm => {
                    if (!state.merchants.some(m => m.id === dm.id || m.uid === dm.uid)) {
                        if (!state.deletedMerchantIds || !state.deletedMerchantIds.includes(dm.id)) {
                            state.merchants.push(dm);
                        }
                    }
                });
            }
            if (!state.orders) state.orders = [];
            if (!state.ledger) state.ledger = [];
            if (typeof reconcileDispatchedOrdersToLedger === 'function') {
                reconcileDispatchedOrdersToLedger(state);
            }
            if (!state.settings) state.settings = { ...DEFAULT_SETTINGS };
            if (!state.settings.masterAdminPwd) {
                state.settings.masterAdminPwd = state.settings.adminPwd || "2628";
            }
            if (!state.settings.adminPwd) {
                state.settings.adminPwd = "2628";
            }
            if (!state.settings.staffPwd) {
                state.settings.staffPwd = "1122";
            }
            if (!state.settings.firebaseConfigJSON || state.settings.firebaseConfigJSON.includes('...')) {
                state.settings.firebaseConfigJSON = JSON.stringify(DEFAULT_FIREBASE_CONFIG);
            }
            if (state.homeBanners && !Array.isArray(state.homeBanners)) {
                state.homeBanners = Object.values(state.homeBanners);
            }
            if (!state.homeBanners || state.homeBanners.length === 0) state.homeBanners = [...DEFAULT_HOME_BANNERS];
            if (!state.homeCategoryCards || state.homeCategoryCards.length === 0) state.homeCategoryCards = [...DEFAULT_HOME_CATEGORY_CARDS];
            if (!state.dealerRequests) state.dealerRequests = [];
            if (!state.dealerActivities) state.dealerActivities = [];
            if (!state.otpRequests) state.otpRequests = [];
            if (!state.offers) state.offers = [
                {
                    id: "offer-1",
                    productId: "prod-1",
                    model: "One Piece Closet - Rimless Tornado 4D",
                    category: "Ceramic Sanitary Ware",
                    regularPrice: 4200,
                    offerPrice: 3200,
                    billRate: 1500,
                    minQty: 10,
                    badge: "Special Bulk Offer",
                    description: "Minimum 10 pcs quantity required for offer rate.",
                    active: true
                }
            ];
        } catch (e) {
            console.error("Error loading state from localStorage", e);
            initStateDefaults();
        }
    } else {
        initStateDefaults();
    }
    if (state) {
        if (Array.isArray(state.deletedMerchantIds) && Array.isArray(state.merchants)) {
            state.merchants = state.merchants.filter(m => m && !state.deletedMerchantIds.includes(m.id));
        }
        if (Array.isArray(state.deletedDealerRequestIds) && Array.isArray(state.dealerRequests)) {
            state.dealerRequests = state.dealerRequests.filter(r => r && !state.deletedDealerRequestIds.includes(r.id));
        }
        if (Array.isArray(state.deletedProductIds) && Array.isArray(state.products)) {
            state.products = state.products.filter(p => p && !state.deletedProductIds.includes(p.id));
        }
        if (Array.isArray(state.deletedOrderIds) && Array.isArray(state.orders)) {
            state.orders = state.orders.filter(o => o && !state.deletedOrderIds.includes(o.id));
        }
    }
    migrateProductCategories();
    invalidatePerformanceCache();
    const isStaffSessionLocal = typeof window !== 'undefined' && (window.location.pathname.includes('staff.html') || document.title.includes('Staff'));
    if (isStaffSessionLocal && typeof sanitizeStaffData === 'function') {
        sanitizeStaffData(state);
    }
    initFirebaseSync();
}

function initStateDefaults() {
    const defaultMeta = {};
    Object.keys(DEFAULT_CATEGORY_TREE).forEach(c => {
        defaultMeta[c] = { isPublic: true };
    });
    state = {
        categoryTree: DEFAULT_CATEGORY_TREE,
        categories: Object.keys(DEFAULT_CATEGORY_TREE),
        categoryMeta: defaultMeta,
        products: [...DEFAULT_PRODUCTS],
        merchants: [...DEFAULT_MERCHANTS],
        offers: [
            {
                id: "offer-1",
                productId: "prod-1",
                model: "One Piece Closet - Rimless Tornado 4D",
                category: "Ceramic Sanitary Ware",
                regularPrice: 4200,
                offerPrice: 3200,
                billRate: 1500,
                minQty: 10,
                badge: "Special Bulk Offer",
                description: "Minimum 10 pcs quantity required for offer rate.",
                active: true
            }
        ],
        orders: [],
        ledger: [],
        settings: { ...DEFAULT_SETTINGS },
        homeBanners: [...DEFAULT_HOME_BANNERS],
        homeCategoryCards: [...DEFAULT_HOME_CATEGORY_CARDS],
        dealerRequests: [],
        otpRequests: []
    };
    saveState();
}

function saveState() {
    try {
        localStorage.setItem("bms_state", JSON.stringify(state));
    } catch (e) {
        console.error("Error saving state to localStorage", e);
        if (e.name === 'QuotaExceededError') {
            console.warn("LocalStorage quota exceeded! Please connect Firebase Realtime DB in Settings.");
        }
    }
    invalidatePerformanceCache();
    syncToCloud();
}

function migrateProductCategories() {
    let modified = false;
    (state.products || []).forEach(p => {
        if (p.category === 'Steel Sink') {
            p.category = 'Kitchen Sinks';
            p.subcategory = 'Stainless Steel Sink';
            p.subCategory = 'Stainless Steel Sink';
            modified = true;
        } else if (p.category === 'Handmade Sink') {
            p.category = 'Kitchen Sinks';
            p.subcategory = 'Handmade 304 Sink';
            p.subCategory = 'Handmade 304 Sink';
            modified = true;
        } else if (p.category === 'Quartz Sink') {
            p.category = 'Kitchen Sinks';
            p.subcategory = 'Quartz Granite Sink';
            p.subCategory = 'Quartz Granite Sink';
            modified = true;
        }
    });
    if (modified) saveState();
}

// Quality Grade definitions
const QUALITY_GRADES = ['Premium', 'ROK', 'STD', 'Commercial'];
window.QUALITY_GRADES = QUALITY_GRADES;

// Helper: Get allowed grades for a merchant (default is Premium only for public/guest)
function getMerchantAllowedGrades(merchant) {
    if (!merchant || !merchant.allowedGrades || !Array.isArray(merchant.allowedGrades) || merchant.allowedGrades.length === 0) {
        return ['Premium'];
    }
    // Always include Premium
    if (!merchant.allowedGrades.includes('Premium')) {
        return ['Premium', ...merchant.allowedGrades];
    }
    return merchant.allowedGrades;
}
window.getMerchantAllowedGrades = getMerchantAllowedGrades;

// Helper: Check if a product's quality grade is allowed for a merchant
function isProductGradeAllowed(merchant, prod) {
    if (!prod) return false;
    const prodGrade = prod.grade || 'Premium';
    const allowed = getMerchantAllowedGrades(merchant);
    return allowed.includes(prodGrade);
}
window.isProductGradeAllowed = isProductGradeAllowed;

// Helper: Check if a product is 'As Per Order' (ઓર્ડર મુજબ)
function isProductAsPerOrder(prod) {
    if (typeof state !== 'undefined' && state.settings && state.settings.allAsPerOrder) {
        return true;
    }
    return !!(prod && (prod.availabilityMode === 'order' || prod.asPerOrder));
}
window.isProductAsPerOrder = isProductAsPerOrder;

// Shared Cart Key Parser for Standard & Dual Unit items + Special Offers
function parseCartKey(cartKey) {
    if (!cartKey) return { prodId: '', unit: 'pcs', isOffer: false, offerId: null, cartKey: '' };
    if (typeof cartKey === 'string' && cartKey.startsWith('offer:')) {
        const parts = cartKey.split(':');
        const offerId = parts[1] || '';
        const unit = parts[2] || 'pcs';
        return { prodId: offerId, unit: unit, isOffer: true, offerId: offerId, cartKey: cartKey };
    }
    if (typeof cartKey === 'string' && cartKey.includes(':')) {
        const parts = cartKey.split(':');
        return { prodId: parts[0], unit: parts[1], isOffer: false, offerId: null, cartKey: cartKey };
    }
    const prod = (typeof state !== 'undefined' && state.products) ? state.products.find(p => p.id === cartKey) : null;
    const isDual = prod && (prod.packagingType === 'dual' || (prod.boxQty && prod.boxQty > 1));
    const activeUnit = isDual ? ((typeof window !== 'undefined' && window.dealerCardUnits && window.dealerCardUnits[cartKey]) || 'box') : 'pcs';
    const normalizedKey = isDual ? `${cartKey}:${activeUnit}` : cartKey;
    return { prodId: cartKey, unit: activeUnit, isOffer: false, offerId: null, cartKey: normalizedKey };
}
window.parseCartKey = parseCartKey;

// Robust date parser (handles DD/MM/YYYY, DD.MM.YYYY, YYYY-MM-DD, timestamp)
function parseDateToTs(dStr) {
    if (!dStr) return 0;
    if (typeof dStr === 'number') return dStr;
    if (dStr.includes('/')) {
        const p = dStr.split('/');
        if (p.length === 3) return new Date(parseInt(p[2]), parseInt(p[1]) - 1, parseInt(p[0])).getTime();
    }
    if (dStr.includes('.')) {
        const p = dStr.split('.');
        if (p.length === 3) return new Date(parseInt(p[2]), parseInt(p[1]) - 1, parseInt(p[0])).getTime();
    }
    if (dStr.includes('-')) {
        const p = dStr.split('-');
        if (p.length === 3) {
            if (p[0].length === 4) return new Date(parseInt(p[0]), parseInt(p[1]) - 1, parseInt(p[2])).getTime();
            else return new Date(parseInt(p[2]), parseInt(p[1]) - 1, parseInt(p[0])).getTime();
        }
    }
    return new Date(dStr).getTime() || 0;
}
window.parseDateToTs = parseDateToTs;

// Calculate performance metrics for any merchant
function getMerchantPerformance(merchant) {
    if (!merchant) return null;
    const isMasterAdmin = (typeof window !== 'undefined' && (window.location.pathname.includes('master_admin.html') || (document && document.title && document.title.includes('Master Admin')) || window.IS_MASTER_ADMIN === true));
    const cacheKey = (merchant.id || merchant.name) + '_' + (merchant.orderCycleDays || 15) + '_' + (merchant.creditDays || 30) + '_' + (isMasterAdmin ? 'master' : 'admin');
    if (typeof _perfCache !== 'undefined' && _perfCache.has(cacheKey)) {
        return _perfCache.get(cacheKey);
    }
    const allOrders = (typeof state !== 'undefined' && state.orders) ? state.orders : [];
    const orders = allOrders.filter(o => o.merchantId === merchant.id && o.status !== 'Cancelled');
    
    // Sort descending by date
    orders.sort((a, b) => {
        const tsA = a.timestamp || parseDateToTs(a.date);
        const tsB = b.timestamp || parseDateToTs(b.date);
        return tsB - tsA;
    });

    const totalOrders = orders.length;
    // In Admin Portal: ONLY official billing (totalBill) is counted. Cash is strictly omitted.
    const totalBusiness = orders.reduce((sum, o) => sum + (o.totalBill || 0) + (isMasterAdmin ? (o.totalCash || 0) : 0), 0);

    let lastOrder = null;
    let lastOrderDate = null;
    let daysSinceLastOrder = null;
    let lastOrderStatus = 'None';
    let lastOrderEstReady = null;

    if (orders.length > 0) {
        lastOrder = orders[0];
        lastOrderDate = lastOrder.date;
        lastOrderStatus = lastOrder.status || 'Pending';
        lastOrderEstReady = lastOrder.estimatedReadyDate || null;
        const ts = lastOrder.timestamp || parseDateToTs(lastOrder.date);
        if (ts > 0) {
            daysSinceLastOrder = Math.max(0, Math.floor((Date.now() - ts) / (1000 * 60 * 60 * 24)));
        }
    }

    // Helper to get dispatch timestamp
    const getDispatchTs = (ord) => {
        if (ord.dispatchTimestamp) return ord.dispatchTimestamp;
        if (ord.timeline && Array.isArray(ord.timeline)) {
            const dispEvt = ord.timeline.find(e => e.status === 'Dispatched');
            if (dispEvt && dispEvt.timestamp) return dispEvt.timestamp;
        }
        if (ord.dispatchDate) return parseDateToTs(ord.dispatchDate);
        return ord.timestamp || parseDateToTs(ord.date);
    };

    const getDispatchDateStr = (ord) => {
        if (ord.dispatchDate) return ord.dispatchDate;
        if (ord.timeline && Array.isArray(ord.timeline)) {
            const dispEvt = ord.timeline.find(e => e.status === 'Dispatched');
            if (dispEvt && dispEvt.timestamp) {
                const d = new Date(dispEvt.timestamp);
                return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
            }
        }
        return ord.date;
    };

    // Ledger balance & payment tracking
    const allLedger = (typeof state !== 'undefined' && state.ledger) ? state.ledger : [];
    const ledger = allLedger.filter(l => l.merchantId === merchant.id);
    let totalDebit = 0;
    let totalCredit = 0;
    let lastPaymentDate = null;
    let daysSinceLastPayment = null;

    const payments = ledger.filter(l => (parseFloat(l.credit) || (l.txnType === 'Credit' ? (l.whiteAmount || 0) + (isMasterAdmin ? (l.blackAmount || 0) : 0) : 0)) > 0);
    payments.sort((a, b) => (b.timestamp || parseDateToTs(b.date)) - (a.timestamp || parseDateToTs(a.date)));
    if (payments.length > 0) {
        lastPaymentDate = payments[0].date;
        const pTs = payments[0].timestamp || parseDateToTs(payments[0].date);
        if (pTs > 0) {
            daysSinceLastPayment = Math.max(0, Math.floor((Date.now() - pTs) / (1000 * 60 * 60 * 24)));
        }
    }

    // Opening balances
    const opWhite = parseFloat(merchant.openingBalanceWhite) || 0;
    const opBlack = isMasterAdmin ? (parseFloat(merchant.openingBalanceBlack) || 0) : 0;
    totalDebit += (opWhite + opBlack);

    ledger.forEach(l => {
        const isCredit = l.txnType === 'Credit';
        const dAmt = (!isCredit ? ((l.whiteAmount || 0) + (isMasterAdmin ? (l.blackAmount || 0) : 0)) : 0);
        const cAmt = (isCredit ? ((l.whiteAmount || 0) + (isMasterAdmin ? (l.blackAmount || 0) : 0)) : 0);
        totalDebit += dAmt;
        totalCredit += cAmt;
    });
    const balance = totalDebit - totalCredit;

    const allowedCreditDays = parseInt(merchant.creditDays, 10) || 30;

    // Track Dispatched Orders with FIFO Smart Aging
    const dispatchedOrders = orders.filter(o => o.status === 'Dispatched' || o.status === 'Delivered');
    let lastDispatchedOrder = null;
    let lastDispatchedDate = null;
    let daysSinceLastDispatch = null;

    let oldestUnpaidOrder = null;
    let oldestUnpaidDate = null;
    let daysSinceOldestDispatch = null;
    let oldestUnpaidAmount = 0;
    let unpaidDispatches = [];
    let overdueDispatches = [];
    let overdueAmount = 0;
    let isOverdue = false;
    let overdueDays = 0;

    if (dispatchedOrders.length > 0) {
        // Sort descending to obtain the latest dispatched order
        dispatchedOrders.sort((a, b) => getDispatchTs(b) - getDispatchTs(a));
        lastDispatchedOrder = dispatchedOrders[0];
        lastDispatchedDate = getDispatchDateStr(lastDispatchedOrder);
        const latestTs = getDispatchTs(lastDispatchedOrder);
        if (latestTs > 0) {
            daysSinceLastDispatch = Math.max(0, Math.floor((Date.now() - latestTs) / (1000 * 60 * 60 * 24)));
        }

        // FIFO Matching: Sort chronological (oldest dispatch first)
        const fifoDispatches = [...dispatchedOrders].sort((a, b) => getDispatchTs(a) - getDispatchTs(b));
        let remainingCredit = Math.max(0, totalCredit);

        fifoDispatches.forEach(ord => {
            const ordAmt = (ord.totalBill || 0) + (isMasterAdmin ? (ord.totalCash || 0) : 0);
            if (remainingCredit >= ordAmt) {
                remainingCredit -= ordAmt;
                // Dispatched load fully cleared by prior credits
            } else {
                const unpaid = ordAmt - remainingCredit;
                remainingCredit = 0;
                const dTs = getDispatchTs(ord);
                const dAge = dTs > 0 ? Math.max(0, Math.floor((Date.now() - dTs) / (1000 * 60 * 60 * 24))) : 0;
                const isOrdOverdue = balance > 50 && dAge > allowedCreditDays;

                const item = {
                    order: ord,
                    orderId: ord.id,
                    performerNo: ord.performerNo,
                    dispatchDate: getDispatchDateStr(ord),
                    dispatchTs: dTs,
                    totalAmount: ordAmt,
                    unpaidAmount: unpaid,
                    ageDays: dAge,
                    isOverdue: isOrdOverdue,
                    overdueDays: isOrdOverdue ? (dAge - allowedCreditDays) : 0
                };

                unpaidDispatches.push(item);
                if (isOrdOverdue) {
                    overdueDispatches.push(item);
                    overdueAmount += unpaid;
                }
            }
        });

        if (balance > 50 && unpaidDispatches.length > 0) {
            oldestUnpaidOrder = unpaidDispatches[0].order;
            oldestUnpaidDate = unpaidDispatches[0].dispatchDate;
            daysSinceOldestDispatch = unpaidDispatches[0].ageDays;
            oldestUnpaidAmount = unpaidDispatches[0].unpaidAmount;

            if (daysSinceOldestDispatch > allowedCreditDays) {
                isOverdue = true;
                overdueDays = daysSinceOldestDispatch - allowedCreditDays;
            }
            if (overdueAmount > balance) overdueAmount = balance;
        }
    }

    // Determine smart auto-rating using FIFO aging
    let grade = 'B';
    let gradeLabel = 'Grade B (Regular)';
    let gradeBadgeClass = 'badge-warning';

    if (totalOrders === 0) {
        grade = 'New';
        gradeLabel = 'New Party';
        gradeBadgeClass = 'badge-secondary';
    } else if (daysSinceLastOrder !== null && daysSinceLastOrder > 45) {
        grade = 'Dormant';
        gradeLabel = 'Dormant (Inactive)';
        gradeBadgeClass = 'badge-dark';
    } else if (isOverdue && overdueDays > 10) {
        grade = 'C';
        gradeLabel = 'Grade C (High Risk)';
        gradeBadgeClass = 'badge-danger';
    } else if (!isOverdue && (balance <= 50 || (daysSinceOldestDispatch !== null && daysSinceOldestDispatch <= allowedCreditDays))) {
        grade = 'A';
        gradeLabel = 'Grade A (VIP / Star)';
        gradeBadgeClass = 'badge-success';
    }

    const orderCycleDays = (merchant.orderCycleDays !== undefined && merchant.orderCycleDays !== null) ? parseInt(merchant.orderCycleDays, 10) : 15;

    let isOrderFollowupDue = false;
    let orderFollowupOverdueDays = 0;
    let orderFollowupStatus = "Active";

    if (orderCycleDays === 0) {
        orderFollowupStatus = "Project Party (Manual / Custom)";
        isOrderFollowupDue = false;
    } else if (daysSinceLastOrder === null) {
        isOrderFollowupDue = true;
        orderFollowupOverdueDays = 0;
        orderFollowupStatus = "No Orders Yet";
    } else if (daysSinceLastOrder > orderCycleDays) {
        isOrderFollowupDue = true;
        orderFollowupOverdueDays = daysSinceLastOrder - orderCycleDays;
        orderFollowupStatus = `Due: ${orderFollowupOverdueDays}d late`;
    } else {
        isOrderFollowupDue = false;
        const remaining = orderCycleDays - daysSinceLastOrder;
        orderFollowupStatus = `Active: ${remaining}d left`;
    }

    const perfResult = {
        merchant,
        totalOrders,
        totalBusiness,
        lastOrder,
        lastOrderDate,
        daysSinceLastOrder,
        lastOrderStatus,
        lastOrderEstReady,
        lastDispatchedOrder,
        lastDispatchedDate,
        daysSinceLastDispatch,
        oldestUnpaidOrder,
        oldestUnpaidDate,
        daysSinceOldestDispatch,
        oldestUnpaidAmount,
        unpaidDispatches,
        overdueDispatches,
        overdueAmount,
        balance,
        lastPaymentDate,
        daysSinceLastPayment,
        allowedCreditDays,
        isOverdue,
        overdueDays,
        orderCycleDays,
        isOrderFollowupDue,
        orderFollowupOverdueDays,
        orderFollowupStatus,
        grade,
        gradeLabel,
        gradeBadgeClass
    };
    if (typeof _perfCache !== 'undefined') {
        _perfCache.set(cacheKey, perfResult);
    }
    return perfResult;
}
window.getMerchantPerformance = getMerchantPerformance;

// Currency Formatter
function fmtCur(num) {
    if (num === undefined || num === null) return '₹0';
    return '₹' + Number(num).toLocaleString('en-IN');
}

// Pricing calculation based on active merchant and standard/special rates
function getMerchantPricing(merchant, product, unit = 'pcs') {
    if (!product) return { price: 0, billRate: 0, pcsPrice: 0, pcsBillRate: 0, boxPrice: 0, boxBillRate: 0, unit: 'pcs' };
    
    let basePrice = product.price !== undefined ? product.price : (product.basePrice || 0);
    let billRate = product.billRate || 0;
    let baseBoxPrice = product.boxPrice !== undefined ? product.boxPrice : basePrice;
    let baseBoxBillRate = product.boxBillRate !== undefined ? product.boxBillRate : billRate;

    let resPrice = basePrice;
    let resBillRate = billRate;
    let resBoxPrice = baseBoxPrice;
    let resBoxBillRate = baseBoxBillRate;

    if (merchant) {
        // 1. Check special product rates if defined
        if (merchant.specialRates && merchant.specialRates[product.id]) {
            const spec = merchant.specialRates[product.id];
            if (spec.price !== undefined) resPrice = spec.price;
            if (spec.billRate !== undefined) resBillRate = spec.billRate;
            if (spec.boxPrice !== undefined) resBoxPrice = spec.boxPrice;
            else resBoxPrice = (product.boxPrice !== undefined ? product.boxPrice : resPrice);
            if (spec.boxBillRate !== undefined) resBoxBillRate = spec.boxBillRate;
            else resBoxBillRate = (product.boxBillRate !== undefined ? product.boxBillRate : resBillRate);
        } else if (merchant.globalDiscount) {
            const factor = 1 + (merchant.globalDiscount / 100);
            resPrice = Math.round(basePrice * factor);
            resBillRate = Math.round(billRate * factor);
            resBoxPrice = Math.round(baseBoxPrice * factor);
            resBoxBillRate = Math.round(baseBoxBillRate * factor);
        }

        // Bill Percentage / Full Bill: calculate bill rate
        if (merchant.billPercentage !== undefined && merchant.billPercentage !== null && merchant.billPercentage > 0 && (!merchant.specialRates || !merchant.specialRates[product.id] || merchant.specialRates[product.id].billRate === undefined)) {
            resBillRate = Math.round(resPrice * (merchant.billPercentage / 100));
            resBoxBillRate = Math.round(resBoxPrice * (merchant.billPercentage / 100));
        } else if (merchant.hideAmount || merchant.fullBill || merchant.isFullBill) {
            resBillRate = resPrice;
            resBoxBillRate = resBoxPrice;
        }
    }

    const isBox = (unit === 'box' && product.boxQty && product.boxQty > 1);
    const activePrice = isBox ? resBoxPrice : resPrice;
    const activeBillRate = isBox ? resBoxBillRate : resBillRate;

    return {
        price: activePrice,
        billRate: activeBillRate,
        pcsPrice: resPrice,
        pcsBillRate: resBillRate,
        boxPrice: resBoxPrice,
        boxBillRate: resBoxBillRate,
        unit: isBox ? 'box' : 'pcs'
    };
}

// Modal Toggle Helpers - Single Click Instant Switch
function openModal(id) {
    // Close any currently active modals instantly to prevent double-backdrop click blocking
    const activeModals = document.querySelectorAll('.modal-overlay.active');
    activeModals.forEach(otherModal => {
        if (otherModal.id !== id) {
            otherModal.classList.remove('active');
            otherModal.style.display = 'none';
        }
    });

    const m = document.getElementById(id);
    if (m) {
        m.style.display = 'flex';
        m.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close Modal
function closeModal(id) {
    const m = document.getElementById(id);
    if (m) {
        m.classList.remove('active');
        m.style.display = 'none';
        
        // Restore scrolling only if no other active modals are open
        const activeModals = document.querySelectorAll('.modal-overlay.active');
        if (activeModals.length === 0) {
            document.body.style.overflow = 'auto';
        }
    }
}
window.openModal = openModal;
window.closeModal = closeModal;

// Global Backdrop Click & Escape Key to Close Modals
if (typeof document !== 'undefined') {
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList && e.target.classList.contains('modal-overlay') && e.target.classList.contains('active')) {
            closeModal(e.target.id);
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal-overlay.active');
            if (activeModal && activeModal.id) {
                closeModal(activeModal.id);
            }
        }
    });
}

// =============================================
// SEARCHABLE SMART PARTY DROPDOWNS
// =============================================
// SEARCHABLE DROPDOWN WITH KEYPAD (ARROW KEYS + ENTER) SUPPORT
let activeDropdownIndex = { order: -1, ledger: -1, payment: -1 };

function openSearchableDropdown(type) {
    const listEl = document.getElementById(`${type}-merchant-dropdown-list`);
    if (!listEl) return;
    activeDropdownIndex[type] = -1;
    renderSearchableDropdownOptions(type, '');
    listEl.style.display = 'block';
}

function filterSearchableDropdown(type) {
    const inputEl = document.getElementById(`${type}-merchant-search`);
    const query = inputEl ? inputEl.value.trim().toLowerCase() : '';
    const listEl = document.getElementById(`${type}-merchant-dropdown-list`);
    if (listEl) listEl.style.display = 'block';
    activeDropdownIndex[type] = -1;
    renderSearchableDropdownOptions(type, query);
}

function renderSearchableDropdownOptions(type, query) {
    const listEl = document.getElementById(`${type}-merchant-dropdown-list`);
    if (!listEl) return;
    listEl.innerHTML = '';
    activeDropdownIndex[type] = -1;

    const merchants = state.merchants || [];
    let optionCount = 0;
    
    // For ledger, include 'All Merchants' option at top
    if (type === 'ledger' && (!query || 'all merchants'.includes(query) || 'badhi party'.includes(query))) {
        const allItem = document.createElement('div');
        const currIdx = optionCount++;
        allItem.className = 'searchable-dropdown-option';
        allItem.setAttribute('data-index', currIdx);
        allItem.setAttribute('data-is-all', 'true');
        allItem.style = 'padding:0.6rem 0.75rem; border-bottom:1px solid #e2e8f0; cursor:pointer; font-weight:700; color:#0e254f; background:#f8fafc; display:flex; justify-content:space-between; align-items:center; transition:background 0.15s;';
        allItem.innerHTML = `<span><i class="fa-solid fa-users"></i> All Merchants (બધી પાર્ટીઓ)</span> <span style="font-size:0.75rem; color:#64748b;">${merchants.length} Parties</span>`;
        allItem.onmousedown = (ev) => { ev.preventDefault(); selectSearchableParty('ledger', 'all', 'All Merchants'); };
        allItem.onclick = () => selectSearchableParty('ledger', 'all', 'All Merchants');
        allItem.onmouseenter = () => {
            activeDropdownIndex[type] = currIdx;
            updateDropdownHighlight(type);
        };
        listEl.appendChild(allItem);
    }

    const filtered = merchants.filter(m => {
        if (!query) return true;
        const name = (m.name || '').toLowerCase();
        const addr = (m.address || '').toLowerCase();
        const city = (m.city || '').toLowerCase();
        const phone = (m.phone || '').toLowerCase();
        const uid = (m.uid || '').toLowerCase();
        return name.includes(query) || addr.includes(query) || city.includes(query) || phone.includes(query) || uid.includes(query);
    });

    if (filtered.length === 0 && optionCount === 0) {
        listEl.innerHTML += `<div style="padding:0.8rem; text-align:center; color:#64748b; font-style:italic; font-size:0.85rem;"><i class="fa-solid fa-face-frown"></i> No party found matching "${query}"</div>`;
        return;
    }

    filtered.forEach(m => {
        const item = document.createElement('div');
        const currIdx = optionCount++;
        item.className = 'searchable-dropdown-option';
        item.setAttribute('data-index', currIdx);
        item.setAttribute('data-party-id', m.id);
        item.setAttribute('data-party-name', m.name);
        item.style = 'padding:0.55rem 0.75rem; border-bottom:1px solid #f1f5f9; cursor:pointer; display:flex; justify-content:space-between; align-items:center; transition:background 0.15s; background:#fff;';
        
        item.innerHTML = `
            <div>
                <div style="font-weight:700; color:#0e254f; font-size:0.88rem;">${m.name}</div>
                <div style="font-size:0.75rem; color:#64748b;">${m.city || m.address || ''} | +${m.phone || ''}</div>
            </div>
            <span style="font-size:0.7rem; background:#e2e8f0; color:#0e254f; font-weight:700; padding:0.15rem 0.4rem; border-radius:4px;">${m.uid || 'UID'}</span>
        `;
        item.onmousedown = (ev) => { ev.preventDefault(); selectSearchableParty(type, m.id, m.name); };
        item.onclick = () => selectSearchableParty(type, m.id, m.name);
        item.onmouseenter = () => {
            activeDropdownIndex[type] = currIdx;
            updateDropdownHighlight(type);
        };
        listEl.appendChild(item);
    });
}

function updateDropdownHighlight(type) {
    const listEl = document.getElementById(`${type}-merchant-dropdown-list`);
    if (!listEl) return;
    const options = listEl.querySelectorAll('.searchable-dropdown-option');
    const activeIdx = activeDropdownIndex[type];

    options.forEach((opt, idx) => {
        if (idx === activeIdx) {
            opt.classList.add('selected-dropdown-option');
            opt.style.background = '#dbeafe'; // Soft highlight blue
            opt.style.borderLeft = '4px solid #0e254f';
            opt.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        } else {
            opt.classList.remove('selected-dropdown-option');
            opt.style.background = (opt.getAttribute('data-is-all') === 'true') ? '#f8fafc' : '#ffffff';
            opt.style.borderLeft = 'none';
        }
    });
}

function handleSearchableDropdownKeydown(e, type) {
    const listEl = document.getElementById(`${type}-merchant-dropdown-list`);
    if (!listEl) return;

    if (listEl.style.display === 'none') {
        if (e.key === 'ArrowDown' || e.key === 'Enter') {
            e.preventDefault();
            openSearchableDropdown(type);
            return;
        }
    }

    const options = listEl.querySelectorAll('.searchable-dropdown-option');
    if (!options || options.length === 0) return;

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeDropdownIndex[type]++;
        if (activeDropdownIndex[type] >= options.length) {
            activeDropdownIndex[type] = 0; // Wrap to top
        }
        updateDropdownHighlight(type);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeDropdownIndex[type]--;
        if (activeDropdownIndex[type] < 0) {
            activeDropdownIndex[type] = options.length - 1; // Wrap to bottom
        }
        updateDropdownHighlight(type);
    } else if (e.key === 'Enter') {
        e.preventDefault();
        let idx = activeDropdownIndex[type];
        if (idx < 0 || idx >= options.length) {
            idx = 0; // Default to first match if user just hit enter!
        }
        if (options[idx]) {
            options[idx].click();
        }
    } else if (e.key === 'Escape' || e.key === 'Tab') {
        listEl.style.display = 'none';
        activeDropdownIndex[type] = -1;
    }
}

function selectSearchableParty(type, id, name) {
    const inputEl = document.getElementById(`${type}-merchant-search`);
    const hiddenEl = document.getElementById(type === 'payment' ? 'payment-merchant-id' : (type === 'order' ? 'order-merchant-select' : 'ledger-merchant-filter'));
    const listEl = document.getElementById(`${type}-merchant-dropdown-list`);

    if (inputEl) inputEl.value = name;
    if (hiddenEl) hiddenEl.value = id;
    if (listEl) listEl.style.display = 'none';
    activeDropdownIndex[type] = -1;

    if (type === 'order') {
        if (typeof onOrderMerchantSelect === 'function') onOrderMerchantSelect();
    } else if (type === 'ledger') {
        if (typeof renderLedger === 'function') renderLedger();
    }
}

// =============================================
// SEARCHABLE PRODUCT DROPDOWN WITH KEYPAD (ARROW KEYS + ENTER) SUPPORT
let activeProductDropdownIndex = { inward: -1, editorder: -1 };

function openSearchableProductDropdown(type) {
    const listEl = document.getElementById(`${type}-product-dropdown-list`);
    if (!listEl) return;
    activeProductDropdownIndex[type] = -1;
    renderSearchableProductDropdownOptions(type, '');
    listEl.style.display = 'block';
}

function filterSearchableProductDropdown(type) {
    const inputEl = document.getElementById(`${type}-product-search`);
    const query = inputEl ? inputEl.value.trim().toLowerCase() : '';
    const listEl = document.getElementById(`${type}-product-dropdown-list`);
    if (listEl) listEl.style.display = 'block';
    activeProductDropdownIndex[type] = -1;
    renderSearchableProductDropdownOptions(type, query);
}

function renderSearchableProductDropdownOptions(type, query) {
    const listEl = document.getElementById(`${type}-product-dropdown-list`);
    if (!listEl) return;
    listEl.innerHTML = '';
    activeProductDropdownIndex[type] = -1;

    const products = state.products || [];
    let optionCount = 0;

    const filtered = products.filter(p => {
        if (!query) return true;
        const model = (p.model || '').toLowerCase();
        const cat = (p.category || '').toLowerCase();
        const subcat = (p.subcategory || p.subCategory || '').toLowerCase();
        const colour = (p.colour || '').toLowerCase();
        const grade = (p.grade || '').toLowerCase();
        return model.includes(query) || cat.includes(query) || subcat.includes(query) || colour.includes(query) || grade.includes(query);
    });

    if (filtered.length === 0) {
        listEl.innerHTML = `<div style="padding:0.8rem; text-align:center; color:#64748b; font-style:italic; font-size:0.85rem;"><i class="fa-solid fa-face-frown"></i> No product found matching "${query}"</div>`;
        return;
    }

    filtered.forEach(p => {
        const item = document.createElement('div');
        const currIdx = optionCount++;
        const s = parseInt(p.stock || 0);
        const gradeCol = [p.grade, p.colour].filter(Boolean).join(' / ');
        const labelText = `${p.model} ${gradeCol ? `(${gradeCol})` : ''}`;

        item.className = 'searchable-product-option';
        item.setAttribute('data-index', currIdx);
        item.setAttribute('data-prod-id', p.id);
        item.setAttribute('data-prod-name', labelText);
        item.style = 'padding:0.5rem 0.75rem; border-bottom:1px solid #f1f5f9; cursor:pointer; display:flex; justify-content:space-between; align-items:center; transition:background 0.15s; background:#fff;';

        item.innerHTML = `
            <div style="flex:1; min-width:0; padding-right:0.5rem;">
                <div style="font-weight:700; color:#0e254f; font-size:0.85rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${p.model}</div>
                <div style="font-size:0.72rem; color:#64748b; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${p.category || 'Uncategorized'}${gradeCol ? ` | ${gradeCol}` : ''}</div>
            </div>
            <div style="text-align:right; flex-shrink:0;">
                <span style="font-size:0.75rem; font-weight:700; color:${s <= 0 ? '#ef4444' : (s <= 15 ? '#ea580c' : '#0d9488')}; background:#f1f5f9; padding:0.15rem 0.45rem; border-radius:4px;">${s} pcs</span>
            </div>
        `;

        item.onmousedown = (ev) => { ev.preventDefault(); selectSearchableProduct(type, p.id, labelText); };
        item.onclick = () => selectSearchableProduct(type, p.id, labelText);
        item.onmouseenter = () => {
            activeProductDropdownIndex[type] = currIdx;
            updateProductDropdownHighlight(type);
        };
        listEl.appendChild(item);
    });
}

function updateProductDropdownHighlight(type) {
    const listEl = document.getElementById(`${type}-product-dropdown-list`);
    if (!listEl) return;
    const options = listEl.querySelectorAll('.searchable-product-option');
    const activeIdx = activeProductDropdownIndex[type];

    options.forEach((opt, idx) => {
        if (idx === activeIdx) {
            opt.classList.add('selected-dropdown-option');
            opt.style.background = '#ccfbf1'; // Soft highlight teal/cyan
            opt.style.borderLeft = '4px solid #0d9488';
            opt.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        } else {
            opt.classList.remove('selected-dropdown-option');
            opt.style.background = '#ffffff';
            opt.style.borderLeft = 'none';
        }
    });
}

function handleSearchableProductDropdownKeydown(e, type) {
    const listEl = document.getElementById(`${type}-product-dropdown-list`);
    if (!listEl) return;

    if (listEl.style.display === 'none') {
        if (e.key === 'ArrowDown' || e.key === 'Enter') {
            e.preventDefault();
            openSearchableProductDropdown(type);
            return;
        }
    }

    const options = listEl.querySelectorAll('.searchable-product-option');
    if (!options || options.length === 0) return;

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeProductDropdownIndex[type]++;
        if (activeProductDropdownIndex[type] >= options.length) {
            activeProductDropdownIndex[type] = 0; // Wrap to top
        }
        updateProductDropdownHighlight(type);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeProductDropdownIndex[type]--;
        if (activeProductDropdownIndex[type] < 0) {
            activeProductDropdownIndex[type] = options.length - 1; // Wrap to bottom
        }
        updateProductDropdownHighlight(type);
    } else if (e.key === 'Enter') {
        e.preventDefault();
        let idx = activeProductDropdownIndex[type];
        if (idx < 0 || idx >= options.length) {
            idx = 0; // Default to first match if user just hits enter!
        }
        if (options[idx]) {
            options[idx].click();
        }
    } else if (e.key === 'Escape' || e.key === 'Tab') {
        listEl.style.display = 'none';
        activeProductDropdownIndex[type] = -1;
    }
}

function selectSearchableProduct(type, id, label) {
    const inputEl = document.getElementById(`${type}-product-search`);
    const hiddenEl = document.getElementById(type === 'inward' ? 'inward-product-select' : 'edit-order-prod-select');
    const listEl = document.getElementById(`${type}-product-dropdown-list`);

    if (inputEl) inputEl.value = label;
    if (hiddenEl) hiddenEl.value = id;
    if (listEl) listEl.style.display = 'none';
    activeProductDropdownIndex[type] = -1;

    if (type === 'inward') {
        if (typeof onInwardProductChange === 'function') onInwardProductChange();
        const qtyInput = document.getElementById('inward-qty');
        if (qtyInput) {
            setTimeout(() => { qtyInput.focus(); qtyInput.select(); }, 50);
        }
    } else if (type === 'editorder') {
        if (typeof onEditOrderProductSelect === 'function') onEditOrderProductSelect();
        const qtyInput = document.getElementById('edit-order-add-qty');
        if (qtyInput) {
            setTimeout(() => { qtyInput.focus(); qtyInput.select(); }, 50);
        }
    }
}

// Close dropdowns on clicking outside
document.addEventListener('click', (e) => {
    ['payment', 'order', 'ledger'].forEach(type => {
        const searchInput = document.getElementById(`${type}-merchant-search`);
        const listEl = document.getElementById(`${type}-merchant-dropdown-list`);
        if (listEl && listEl.style.display !== 'none') {
            if (searchInput && !searchInput.contains(e.target) && !listEl.contains(e.target)) {
                listEl.style.display = 'none';
                activeDropdownIndex[type] = -1;
            }
        }
    });
    ['inward', 'editorder'].forEach(type => {
        const searchInput = document.getElementById(`${type}-product-search`);
        const listEl = document.getElementById(`${type}-product-dropdown-list`);
        if (listEl && listEl.style.display !== 'none') {
            if (searchInput && !searchInput.contains(e.target) && !listEl.contains(e.target)) {
                listEl.style.display = 'none';
                activeProductDropdownIndex[type] = -1;
            }
        }
    });
});

// Global keyboard navigation listener for any active search input
document.addEventListener('keydown', (e) => {
    ['order', 'ledger', 'payment'].forEach(type => {
        const searchInput = document.getElementById(`${type}-merchant-search`);
        if (searchInput && document.activeElement === searchInput) {
            handleSearchableDropdownKeydown(e, type);
        }
    });
    ['inward', 'editorder'].forEach(type => {
        const searchInput = document.getElementById(`${type}-product-search`);
        if (searchInput && document.activeElement === searchInput) {
            handleSearchableProductDropdownKeydown(e, type);
        }
    });
});

// Helper to sort category groups in orders
function getOrderedCategories(grouped) {
    if (!grouped) return [];
    const keys = Object.keys(grouped);
    const orderList = state.categories || Object.keys(DEFAULT_CATEGORY_TREE);
    if (!orderList || orderList.length === 0) return keys;
    return keys.sort((a, b) => {
        let idxA = orderList.indexOf(a);
        let idxB = orderList.indexOf(b);
        if (idxA === -1) idxA = 999;
        if (idxB === -1) idxB = 999;
        return idxA - idxB;
    });
}

function compressImage(file, maxWidth, maxHeight, quality) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                let width = img.width;
                let height = img.height;
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
                if (height > maxHeight) {
                    width = Math.round((width * maxHeight) / height);
                    height = maxHeight;
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

function getYouTubeEmbedUrl(url) {
    if (!url || typeof url !== 'string') return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
}
window.getYouTubeEmbedUrl = getYouTubeEmbedUrl;

function uploadProductImage(id) {
    if (typeof openProductMediaModal === 'function') {
        openProductMediaModal(id);
        return;
    }
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = async (e) => {
        const files = Array.from(e.target.files).slice(0, 8); // increased limit to 8 photos
        if (files.length === 0) return;
        const p = state.products.find(x => x.id === id);
        if (!p) return;

        const loadedImages = [...(p.imagesBase64 || (p.imageBase64 ? [p.imageBase64] : []))];
        for (let i = 0; i < files.length; i++) {
            if (loadedImages.length >= 8) break;
            const compressedBase64 = await compressImage(files[i], 900, 900, 0.75);
            loadedImages.push(compressedBase64);
        }
        
        p.imageBase64 = loadedImages[0] || null;
        p.imagesBase64 = loadedImages;
        saveState();
        if (typeof renderStockTable === 'function') renderStockTable();
    };
    input.click();
}
window.uploadProductImage = uploadProductImage;


function viewTimeline(orderId) {
    if (!orderId && typeof lastSubmittedOrder !== 'undefined' && lastSubmittedOrder) {
        orderId = lastSubmittedOrder.id;
    }
    if (!orderId && typeof state !== 'undefined' && state.orders && state.orders.length > 0) {
        orderId = state.orders[state.orders.length - 1].id;
    }
    const order = (typeof state !== 'undefined' && state.orders) ? state.orders.find(o => o.id === orderId) : null;
    if (!order) return;
    
    let html = '';
    let timelineData = [];
    if (order.timeline && order.timeline.length > 0) {
        timelineData = order.timeline;
    } else {
        const cTime = parseInt(order.id.replace('ord-', '')) || Date.now();
        timelineData.push({ status: 'Pending', timestamp: cTime });
        if (order.status === 'Confirmed' || order.status === 'Dispatched' || order.status === 'Delivered') {
            timelineData.push({ status: 'Confirmed', timestamp: cTime + 60000 });
        }
        if (order.status === 'Dispatched' || order.status === 'Delivered') {
            timelineData.push({ status: 'Dispatched', timestamp: cTime + 120000 });
        }
        if (order.status === 'Delivered') {
            timelineData.push({ status: 'Delivered', timestamp: cTime + 180000 });
        }
        if (order.status === 'Cancelled') {
            timelineData.push({ status: 'Cancelled', timestamp: cTime + 60000 });
        }
    }
    
    html += `<div style="font-size:0.85rem; color:#475569; position:relative; padding-left:14px; border-left:2px solid #cbd5e1; margin-left:6px;">`;
    timelineData.forEach((event, idx) => {
        const evtDate = new Date(event.timestamp).toLocaleString('en-IN', {day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'});
        const isLast = idx === timelineData.length - 1;
        const dotColor = event.status === 'Cancelled' ? '#ef4444' : (event.status === 'Dispatched' || event.status === 'Delivered' ? '#10b981' : '#3b82f6');
        html += `<div style="margin-bottom:${isLast ? '0' : '1.25rem'}; position:relative;">
            <div style="position:absolute; left:-19.5px; top:4px; width:10px; height:10px; border-radius:50%; background:${dotColor}; border:2px solid #fff;"></div>
            <div style="font-weight:700; color:#0e254f; font-size:1rem;">${event.status}</div>
            <div style="font-size:0.85rem; margin-top:2px;">${evtDate}</div>
            ${event.note ? `<div style="font-size:0.75rem; color:#475569; margin-top:3px; background:#f1f5f9; padding:2px 6px; border-radius:4px; display:inline-block;"><i class="fa-solid fa-comment-dots" style="color:#64748b;"></i> ${event.note}</div>` : ''}
        </div>`;
    });
    html += `</div>`;

    if (order.estimatedReadyDate) {
        html += `
            <div style="margin-top:1.25rem; background:#eff6ff; border:1px solid #bfdbfe; border-radius:6px; padding:0.6rem 0.8rem; font-size:0.82rem; color:#1d4ed8;">
                <div style="font-weight:700; margin-bottom:0.25rem;"><i class="fa-solid fa-calendar-check"></i> Estimated Ready / Dispatch Date:</div>
                <div style="font-size:1rem; font-weight:700; color:#1e40af;">${order.estimatedReadyDate}</div>
                ${order.deliveryNote ? `<div style="font-size:0.8rem; color:#475569; margin-top:0.25rem;"><b>Production Remark:</b> ${order.deliveryNote}</div>` : ''}
            </div>
        `;
    }

    if (order.transportName || order.lrNo || order.vehicleNo) {
        html += `
            <div style="margin-top:0.75rem; background:#f0f9ff; border:1px solid #bae6fd; border-radius:6px; padding:0.6rem 0.8rem; font-size:0.82rem; color:#0369a1;">
                <div style="font-weight:700; margin-bottom:0.25rem;"><i class="fa-solid fa-truck-fast"></i> Logistics Details:</div>
                <div><b>Transport:</b> ${order.transportName || 'Direct'}</div>
                <div><b>LR / Bilty No:</b> ${order.lrNo || 'N/A'}</div>
                ${order.vehicleNo ? `<div><b>Vehicle No:</b> ${order.vehicleNo}</div>` : ''}
            </div>
        `;
    }
    
    const contentEl = document.getElementById('timeline-modal-content');
    if (contentEl) {
        contentEl.innerHTML = html;
        openModal('timeline-modal');
    }
}
window.viewTimeline = viewTimeline;
window.viewDealerTimeline = viewTimeline;

// ============================================================
// PDF & INVOICE ENGINE (GST PROFORMA & DISPATCH CHALLAN)
// ============================================================

function numberToWordsINR(num) {
    if (num === null || num === undefined || isNaN(num)) return "Zero Rupees Only";
    num = Math.round(Number(num));
    if (num === 0) return "Zero Rupees Only";

    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
        'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    function inWords(n) {
        if (n < 20) return a[n];
        if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
        if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + inWords(n % 100) : '');
        if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + inWords(n % 1000) : '');
        if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + inWords(n % 100000) : '');
        return inWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + inWords(n % 10000000) : '');
    }

    return "Rupees " + inWords(num) + " Only";
}

function getHSNCodeForCategory(cat) {
    if (!cat) return "6910";
    const lower = cat.toLowerCase();
    if (lower.includes('sanitary') || lower.includes('closet') || lower.includes('basin')) return "6910";
    if (lower.includes('sink')) return lower.includes('quartz') ? "6802" : "7324";
    if (lower.includes('vanity') || lower.includes('cabinet')) return "3922";
    if (lower.includes('mirror')) return "7009";
    if (lower.includes('fitting') || lower.includes('coupling')) return "8481";
    if (lower.includes('cover') || lower.includes('frp')) return "3926";
    return "6910";
}

function getGradeBadgeStyleHTML(grade) {
    if (grade === 'Premium') return `<span style="background:#fef3c7; color:#b45309; border:1px solid #fde68a; padding:1px 5px; border-radius:3px; font-weight:700; font-size:11px;">⭐ Premium</span>`;
    if (grade === 'ROK') return `<span style="background:#e0f2fe; color:#0369a1; border:1px solid #bae6fd; padding:1px 5px; border-radius:3px; font-weight:700; font-size:11px;">🔹 ROK</span>`;
    if (grade === 'STD') return `<span style="background:#ffedd5; color:#c2410c; border:1px solid #fed7aa; padding:1px 5px; border-radius:3px; font-weight:700; font-size:11px;">🔸 STD</span>`;
    if (grade === 'Commercial') return `<span style="background:#fee2e2; color:#b91c1c; border:1px solid #fca5a5; padding:1px 5px; border-radius:3px; font-weight:700; font-size:11px;">🔻 Commercial</span>`;
    return `<span style="background:#f1f5f9; color:#475569; padding:1px 5px; border-radius:3px; font-weight:600; font-size:11px;">${grade || 'Standard'}</span>`;
}

function printGSTInvoice(orderId) {
    if (document.title.includes('Staff') || window.location.pathname.includes('staff.html')) {
        generatePDFInvoiceHTML(orderId, 'challan');
        return;
    }
    generatePDFInvoiceHTML(orderId, 'invoice');
}

function printDispatchChallan(orderId) {
    generatePDFInvoiceHTML(orderId, 'challan');
}

function printOrderInvoice(orderId) {
    if (document.title.includes('Staff') || window.location.pathname.includes('staff.html')) {
        generatePDFInvoiceHTML(orderId, 'challan');
        return;
    }
    generatePDFInvoiceHTML(orderId, 'invoice');
}

function generatePDFInvoiceHTML(orderId, docType = 'invoice') {
    const order = state.orders ? state.orders.find(o => o.id === orderId) : null;
    const m = order && state.merchants ? state.merchants.find(x => x.id === order.merchantId) : null;
    if (!order || !m) {
        alert("Order details or merchant information not found.");
        return;
    }

    const settings = state.settings || {};
    const companyName = settings.companyName || "Shree Ram Bathware";
    const companyPhone = settings.adminPhone || "919876543210";
    const companyGstin = settings.gstin || "24AAAAA0000A1Z5";
    const companyAddress = settings.address || "Morbi - Rajkot National Highway, Gujarat - 363642";
    const gstRate = settings.gstRate !== undefined ? settings.gstRate : 18;

    const printWin = window.open("", "_blank");
    if (!printWin) {
        alert("Pop-up blocker is preventing the invoice from opening. Please allow pop-ups.");
        return;
    }

    let totalQtyPcs = 0;
    let totalWeightKg = 0;
    const groupedItems = {};

    order.items.forEach(item => {
        const cat = item.category || 'Ceramic Sanitary Ware';
        if (!groupedItems[cat]) groupedItems[cat] = [];
        groupedItems[cat].push(item);
        
        totalQtyPcs += (item.qty || 0);
        const pMatch = (state.products || []).find(p => p.id === item.productId || (p.model && item.model && p.model.toLowerCase() === item.model.toLowerCase()));
        const itemWeight = (item.weight && item.weight > 0) ? item.weight : (pMatch && pMatch.weight > 0 ? pMatch.weight : ((item.model && item.model.toLowerCase().includes('one piece')) ? 38 : 15));
        item.weight = itemWeight;
        totalWeightKg += (itemWeight * (item.qty || 0));
    });

    const isInvoice = (docType === 'invoice');
    const docTitle = isInvoice ? `GST PROFORMA TAX INVOICE` : `DELIVERY & DISPATCH CHALLAN`;
    const docSubtitle = isInvoice ? `PROFORMA INVOICE / ORDER BILLING MEMO` : `WAREHOUSE LOADING SLIP & TRANSPORT MEMO`;

    let htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>${isInvoice ? 'Invoice' : 'Challan'} - ${order.performerNo || order.id}</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
            * { box-sizing: border-box; font-family: 'Outfit', 'Helvetica Neue', Arial, sans-serif; }
            body { margin: 0; padding: 20px; color: #1e293b; background: #fff; font-size: 13px; line-height: 1.4; }
            
            .no-print-bar {
                background: #0e254f; color: #fff; padding: 12px 20px; border-radius: 8px; margin-bottom: 20px;
                display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 12px rgba(14,37,79,0.25);
            }
            .no-print-bar h3 { margin: 0; font-size: 15px; font-weight: 700; color: #38bdf8; display: flex; align-items: center; gap: 8px; }
            .no-print-bar .btn-group { display: flex; gap: 10px; }
            .action-btn {
                padding: 7px 14px; border-radius: 6px; border: none; font-weight: 700; font-size: 12px; cursor: pointer;
                display: inline-flex; align-items: center; gap: 6px; text-decoration: none; transition: 0.2s;
            }
            .btn-print { background: #2563eb; color: #fff; }
            .btn-print:hover { background: #1d4ed8; }
            .btn-switch { background: #0d9488; color: #fff; }
            .btn-switch:hover { background: #0f766e; }
            .btn-close { background: #64748b; color: #fff; }

            .invoice-card {
                border: 2px solid #0e254f; border-radius: 8px; padding: 20px; max-width: 900px; margin: 0 auto; background: #fff;
            }

            .company-header {
                display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0e254f;
                padding-bottom: 12px; margin-bottom: 15px;
            }
            .brand-box h1 { margin: 0; font-size: 24px; color: #0e254f; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
            .brand-box p { margin: 2px 0 0 0; font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
            .doc-type-badge {
                text-align: right; background: #f0f7ff; border: 1.5px solid #2563eb; padding: 8px 14px; border-radius: 6px;
            }
            .doc-type-badge h2 { margin: 0; font-size: 14px; color: #1e40af; font-weight: 800; text-transform: uppercase; }
            .doc-type-badge span { font-size: 11px; color: #475569; font-weight: 600; display: block; margin-top: 2px; }

            .info-grid {
                display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;
            }
            .info-box {
                background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px 12px; font-size: 12px;
            }
            .info-box-header { font-weight: 800; color: #0e254f; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 6px; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }
            .info-row { display: flex; justify-content: space-between; margin-bottom: 3px; }
            .info-label { color: #64748b; font-weight: 600; }
            .info-val { color: #0f172a; font-weight: 700; text-align: right; }

            .items-table {
                width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 12px;
            }
            .items-table th {
                background: #0e254f; color: #fff; padding: 8px 10px; text-align: left; font-weight: 700; font-size: 11px; text-transform: uppercase;
            }
            .items-table td {
                padding: 8px 10px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #f1f5f9; color: #1e293b;
            }
            .items-table td:last-child { border-right: none; }
            .items-table tr.category-row { background: #e0f2fe; color: #0369a1; font-weight: 800; }
            .num-col { text-align: right; }

            .totals-section {
                display: grid; grid-template-columns: 1.2fr 1fr; gap: 15px; margin-top: 15px; border-top: 2px solid #0e254f; padding-top: 15px;
            }
            .notes-box { font-size: 11px; color: #475569; }
            .notes-box h4 { margin: 0 0 4px 0; color: #0e254f; font-size: 12px; }
            .words-highlight { background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; font-weight: 700; padding: 6px 10px; border-radius: 4px; margin-bottom: 8px; font-size: 11.5px; }

            .summary-table { width: 100%; border-collapse: collapse; font-size: 12px; }
            .summary-table td { padding: 4px 8px; }
            .summary-table tr.grand-total { background: #0e254f; color: #fff; font-weight: 900; font-size: 14px; }
            .summary-table tr.grand-total td { padding: 8px; color: #fff; }

            .signature-row {
                display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px; padding-top: 10px; font-size: 12px; font-weight: 700; color: #475569;
            }

            @media print {
                .no-print-bar { display: none !important; }
                body { padding: 0; background: #fff; }
                .invoice-card { border: 1px solid #000; box-shadow: none; border-radius: 0; }
                .items-table th { background: #1e293b !important; color: #fff !important; -webkit-print-color-adjust: exact; }
                .summary-table tr.grand-total { background: #1e293b !important; color: #fff !important; -webkit-print-color-adjust: exact; }
                @page { size: A4 portrait; margin: 10mm; }
            }
        </style>
    </head>
    <body>

        <!-- TOP BAR (SCREEN ONLY) -->
        <div class="no-print-bar">
            <h3>📄 ${docTitle} (${order.performerNo || order.id})</h3>
            <div class="btn-group">
                <button class="action-btn btn-print" onclick="window.print()"><i class="fa-solid fa-print"></i> 🖨️ Print / Save PDF</button>
                ${isInvoice ? 
                    `<button class="action-btn btn-switch" onclick="window.opener ? window.opener.printDispatchChallan('${order.id}') : printDispatchChallan('${order.id}');"><i class="fa-solid fa-truck"></i> 🚚 View Dispatch Challan</button>` :
                    ((document.title.includes('Staff') || window.location.pathname.includes('staff.html')) ? '' : `<button class="action-btn btn-switch" onclick="window.opener ? window.opener.printGSTInvoice('${order.id}') : printGSTInvoice('${order.id}');"><i class="fa-solid fa-file-invoice"></i> 📄 View GST Invoice</button>`)
                }
                <button class="action-btn btn-close" onclick="window.close()">❌ Close</button>
            </div>
        </div>

        <!-- PRINTABLE CARD -->
        <div class="invoice-card">

            <!-- HEADER -->
            <div class="company-header">
                <div class="brand-box">
                    <h1>${companyName}</h1>
                    <p>MANUFACTURERS &amp; DISTRIBUTORS OF SANITARY WARE &amp; BATHWARE</p>
                    <div style="font-size:11px; color:#475569; margin-top:4px;">
                        📍 ${companyAddress}<br>
                        📞 WhatsApp / Phone: +${companyPhone} | GSTIN: <strong>${companyGstin}</strong>
                    </div>
                </div>
                <div class="doc-type-badge">
                    <h2>${docTitle}</h2>
                    <span>${docSubtitle}</span>
                    <strong style="color:#0e254f; font-size:12px; margin-top:4px; display:block;">FINANCIAL YEAR: 2026-27</strong>
                </div>
            </div>

            <!-- TWO-COLUMN META -->
            <div class="info-grid">
                <!-- BUYER DETAILS -->
                <div class="info-box">
                    <div class="info-box-header">👤 BUYER DETAILS (બિલ લેનાર વેપારી)</div>
                    <div class="info-row"><span class="info-label">Party Name:</span> <span class="info-val" style="font-size:13px; color:#0e254f;">${m.name}</span></div>
                    <div class="info-row"><span class="info-label">Proprietor / Contact:</span> <span class="info-val">${m.ownerName || 'N/A'}</span></div>
                    <div class="info-row"><span class="info-label">Address &amp; City:</span> <span class="info-val">${m.address || ''}, ${m.city || ''} ${m.pincode ? '- ' + m.pincode : ''}</span></div>
                    <div class="info-row"><span class="info-label">Mobile / WhatsApp:</span> <span class="info-val">+${m.phone}</span></div>
                    <div class="info-row"><span class="info-label">Party GSTIN:</span> <span class="info-val" style="color:#2563eb;">${m.gst || 'URP (Unregistered)'}</span></div>
                </div>

                <!-- INVOICE & LOGISTICS META -->
                <div class="info-box">
                    <div class="info-box-header">📋 ORDER &amp; TRANSPORT DETAILS</div>
                    <div class="info-row"><span class="info-label">Ref / Performer No:</span> <span class="info-val" style="font-size:13px; color:#0e254f;">${order.performerNo || order.id}</span></div>
                    <div class="info-row"><span class="info-label">Order Date:</span> <span class="info-val">${order.date}</span></div>
                    <div class="info-row"><span class="info-label">Payment Terms:</span> <span class="info-val">${m.creditDays || 30} Days Credit</span></div>
                    <div class="info-row"><span class="info-label">Transport Name:</span> <span class="info-val" style="color:#0d9488;">${order.transportName || 'Direct Transport'}</span></div>
                    <div class="info-row"><span class="info-label">Bilty / LR No:</span> <span class="info-val">${order.lrNo || 'Pending'} ${order.vehicleNo ? `(Veh: ${order.vehicleNo})` : ''}</span></div>
                </div>
            </div>

            <!-- ITEM TABLE -->
            <table class="items-table">
                <thead>
                    ${isInvoice ? `
                        <tr>
                            <th style="width:35px;">#</th>
                            <th>Model / Product Name</th>
                            <th style="width:90px;">Grade</th>
                            <th>Material / Finish</th>
                            <th style="width:65px;">HSN</th>
                            <th class="num" style="width:85px;">Qty</th>
                            <th class="num" style="width:75px;">Rate (₹)</th>
                            <th class="num" style="width:85px;">Taxable Amt</th>
                        </tr>
                    ` : `
                        <tr>
                            <th style="width:35px;">#</th>
                            <th>Model / Product Name</th>
                            <th style="width:95px;">Grade</th>
                            <th>Material Spec</th>
                            <th>Color</th>
                            <th class="num" style="width:75px;">Weight (pc)</th>
                            <th class="num" style="width:100px;">Dispatch Qty</th>
                            <th class="num" style="width:100px;">Total Weight</th>
                        </tr>
                    `}
                </thead>
                <tbody>
                    ${(() => {
                        let html = '';
                        let index = 1;
                        (typeof getOrderedCategories === 'function' ? getOrderedCategories(groupedItems) : Object.keys(groupedItems)).forEach(cat => {
                            let catQty = 0, catWeight = 0, catTaxable = 0;
                            const hsnCode = getHSNCodeForCategory(cat);
                            
                            const rows = groupedItems[cat].map(item => {
                                catQty += item.qty;
                                const itemWeight = item.weight || 15;
                                const totalItemWeight = itemWeight * item.qty;
                                catWeight += totalItemWeight;

                                const gradeBadge = getGradeBadgeStyleHTML(item.grade);
                                const materialText = item.material || (item.finishType ? item.finishType : 'Standard Specification');
                                const qtyDisp = item.unit === 'box' ? `<b>${item.orderQty} Box</b><br><small style="color:#64748b;">(${item.qty} pcs)</small>` : `<b>${item.qty} pcs</b>`;

                                if (isInvoice) {
                                    const bRate = item.billRate || 0;
                                    const taxable = item.qty * bRate;
                                    catTaxable += taxable;
                                    return `
                                        <tr>
                                            <td>${index++}</td>
                                            <td><strong style="color:#0e254f;">${item.model}</strong></td>
                                            <td>${gradeBadge}</td>
                                            <td style="font-size:11px; color:#475569;">${materialText}</td>
                                            <td style="font-size:11px; color:#64748b;">${hsnCode}</td>
                                            <td class="num">${qtyDisp}</td>
                                            <td class="num">₹${bRate.toLocaleString('en-IN')}</td>
                                            <td class="num"><strong>₹${taxable.toLocaleString('en-IN')}</strong></td>
                                        </tr>
                                    `;
                                } else {
                                    return `
                                        <tr>
                                            <td>${index++}</td>
                                            <td><strong style="color:#0e254f;">${item.model}</strong></td>
                                            <td>${gradeBadge}</td>
                                            <td style="font-size:11px; color:#475569;">${materialText}</td>
                                            <td>${item.colour || 'White'}</td>
                                            <td class="num">${itemWeight} kg</td>
                                            <td class="num">${qtyDisp}</td>
                                            <td class="num"><strong>${totalItemWeight.toFixed(1)} kg</strong></td>
                                        </tr>
                                    `;
                                }
                            }).join("");

                            if (isInvoice) {
                                html += `
                                    <tr class="category-row">
                                        <td colspan="5"><strong>📁 ${cat}</strong> (HSN: ${hsnCode})</td>
                                        <td class="num"><strong>${catQty} pcs</strong></td>
                                        <td></td>
                                        <td class="num"><strong>₹${catTaxable.toLocaleString('en-IN')}</strong></td>
                                    </tr>
                                    ${rows}
                                `;
                            } else {
                                html += `
                                    <tr class="category-row">
                                        <td colspan="6"><strong>📁 ${cat}</strong></td>
                                        <td class="num"><strong>${catQty} pcs</strong></td>
                                        <td class="num"><strong>${catWeight.toFixed(1)} kg</strong></td>
                                    </tr>
                                    ${rows}
                                `;
                            }
                        });
                        return html;
                    })()}
                </tbody>
            </table>

            <!-- FOOTER TOTALS -->
            ${isInvoice ? `
                <div class="totals-section">
                    <div class="notes-box">
                        <div class="words-highlight">
                            💬 <strong>Amount in Words:</strong> ${numberToWordsINR(order.totalBill + (order.totalCash || 0))}
                        </div>
                        <h4>🏦 Bank Payment Details:</h4>
                        <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:6px 10px; border-radius:4px; margin-bottom:8px;">
                            Account Name: <strong>${companyName}</strong><br>
                            Bank: <strong>HDFC Bank Ltd.</strong> | A/C No: <strong>50200088991122</strong> | IFSC: <strong>HDFC0001234</strong>
                        </div>
                        <h4>📜 Terms &amp; Conditions:</h4>
                        <ol style="margin:0; padding-left:16px; font-size:10.5px; color:#64748b;">
                            <li>Goods once sold will not be taken back or exchanged.</li>
                            <li>Interest @ 18% per annum will be charged if payment is delayed beyond credit period.</li>
                            <li>All disputes are subject to Morbi / Rajkot Jurisdiction.</li>
                        </ol>
                    </div>

                    <div>
                        <table class="summary-table">
                            <tr><td>Bill Basic (Taxable Value):</td><td class="num">₹${(order.billBasic || 0).toLocaleString('en-IN')}</td></tr>
                            <tr><td>CGST (9%):</td><td class="num">₹${((order.gst || 0) / 2).toLocaleString('en-IN')}</td></tr>
                            <tr><td>SGST (9%):</td><td class="num">₹${((order.gst || 0) / 2).toLocaleString('en-IN')}</td></tr>
                            <tr style="border-top:1px solid #cbd5e1; font-weight:700;"><td>Subtotal Bill Amount:</td><td class="num">₹${(order.totalBill || 0).toLocaleString('en-IN')}</td></tr>
                            ${(order.freight && order.freight > 0) ? `<tr><td>Freight / Cartage Charges:</td><td class="num">₹${order.freight.toLocaleString('en-IN')}</td></tr>` : ''}
                            ${(order.totalCash && order.totalCash > 0) ? `<tr><td>Additional Cash Amount:</td><td class="num">₹${order.totalCash.toLocaleString('en-IN')}</td></tr>` : ''}
                            <tr class="grand-total">
                                <td>GRAND TOTAL PAYMENT:</td>
                                <td class="num">₹${((order.totalBill || 0) + (order.totalCash || 0)).toLocaleString('en-IN')}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            ` : `
                <div class="totals-section">
                    <div class="notes-box">
                        <div class="words-highlight">
                            🚚 <strong>Net Loading Weight:</strong> ${totalWeightKg.toFixed(2)} kg (${(totalWeightKg / 1000).toFixed(3)} Tonnes)
                        </div>
                        <h4>📝 Dispatch Notes:</h4>
                        <p style="margin:4px 0; font-size:11px;">${order.remark ? `<strong>Remark:</strong> ${order.remark}` : 'All items verified and inspected before dispatch from warehouse.'}</p>
                    </div>

                    <div>
                        <table class="summary-table">
                            <tr><td>Total Items Count:</td><td class="num"><strong>${totalQtyPcs} pcs</strong></td></tr>
                            <tr><td>Net Truck Load Weight:</td><td class="num"><strong>${totalWeightKg.toFixed(2)} kg</strong></td></tr>
                            <tr class="grand-total">
                                <td>TOTAL LOADING WEIGHT:</td>
                                <td class="num">${(totalWeightKg / 1000).toFixed(3)} Tonnes</td>
                            </tr>
                        </table>
                    </div>
                </div>
            `}

            <!-- SIGNATURES -->
            <div class="signature-row">
                <div>
                    <div>Receiver / Driver Signature</div>
                    <div style="margin-top:25px; border-top:1px dashed #94a3b8; width:180px;"></div>
                </div>
                <div style="text-align:right;">
                    <div>For <strong>${companyName}</strong></div>
                    <div style="margin-top:25px; border-top:1px dashed #94a3b8; width:200px; margin-left:auto;"></div>
                    <div style="font-size:10px; color:#94a3b8; margin-top:2px;">(Authorized Signatory)</div>
                </div>
            </div>

        </div>

    </body>
    </html>
    `;

    printWin.document.write(htmlContent);
    printWin.document.close();
}

window.numberToWordsINR = numberToWordsINR;
window.printGSTInvoice = printGSTInvoice;
window.printDispatchChallan = printDispatchChallan;
window.printOrderInvoice = printOrderInvoice;




// ==========================================
// INTERACTIVE IMAGE CROPPER & ZOOM ADJUSTER
// ==========================================
const _cropperState = {
    img: null,
    scale: 1.0,
    baseScale: 1.0,
    minScale: 0.5,
    maxScale: 3.5,
    posX: 0,
    posY: 0,
    rotation: 0,
    isDragging: false,
    startX: 0,
    startY: 0,
    startPosX: 0,
    startPosY: 0,
    queue: [],
    queueIndex: 0,
    onComplete: null,
    results: [],
    prevModalId: null
};

function cropperInitEvents() {
    const vp = document.getElementById("cropper-viewport-container");
    if (!vp || vp._hasEvents) return;
    vp._hasEvents = true;

    // Mouse drag
    vp.addEventListener("mousedown", (e) => {
        e.preventDefault();
        _cropperState.isDragging = true;
        _cropperState.startX = e.clientX;
        _cropperState.startY = e.clientY;
        _cropperState.startPosX = _cropperState.posX;
        _cropperState.startPosY = _cropperState.posY;
        vp.style.cursor = "grabbing";
    });

    window.addEventListener("mousemove", (e) => {
        if (!_cropperState.isDragging) return;
        const rect = vp.getBoundingClientRect();
        const ratio = 600 / (rect.width || 320);
        _cropperState.posX = _cropperState.startPosX + (e.clientX - _cropperState.startX) * ratio;
        _cropperState.posY = _cropperState.startPosY + (e.clientY - _cropperState.startY) * ratio;
        cropperRedraw();
    });

    window.addEventListener("mouseup", () => {
        if (_cropperState.isDragging) {
            _cropperState.isDragging = false;
            vp.style.cursor = "grab";
        }
    });

    // Mouse wheel zoom
    vp.addEventListener("wheel", (e) => {
        e.preventDefault();
        const step = e.deltaY < 0 ? 0.08 : -0.08;
        cropperZoomStep(step);
    }, { passive: false });

    // Touch events for mobile
    let initialTouchDist = 0;
    let initialTouchScale = 1.0;

    vp.addEventListener("touchstart", (e) => {
        if (e.touches.length === 1) {
            _cropperState.isDragging = true;
            _cropperState.startX = e.touches[0].clientX;
            _cropperState.startY = e.touches[0].clientY;
            _cropperState.startPosX = _cropperState.posX;
            _cropperState.startPosY = _cropperState.posY;
        } else if (e.touches.length === 2) {
            _cropperState.isDragging = false;
            initialTouchDist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            initialTouchScale = _cropperState.scale;
        }
    }, { passive: false });

    vp.addEventListener("touchmove", (e) => {
        e.preventDefault();
        if (e.touches.length === 1 && _cropperState.isDragging) {
            const rect = vp.getBoundingClientRect();
            const ratio = 600 / (rect.width || 320);
            _cropperState.posX = _cropperState.startPosX + (e.touches[0].clientX - _cropperState.startX) * ratio;
            _cropperState.posY = _cropperState.startPosY + (e.touches[0].clientY - _cropperState.startY) * ratio;
            cropperRedraw();
        } else if (e.touches.length === 2 && initialTouchDist > 0) {
            const newDist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            const newScale = Math.min(Math.max(initialTouchScale * (newDist / initialTouchDist), 0.5), 3.5);
            _cropperState.scale = newScale;
            const slider = document.getElementById("cropper-zoom-slider");
            if (slider) slider.value = newScale.toFixed(2);
            const lbl = document.getElementById("cropper-zoom-label");
            if (lbl) lbl.textContent = Math.round(newScale * 100) + "%";
            cropperRedraw();
        }
    }, { passive: false });

    vp.addEventListener("touchend", () => {
        _cropperState.isDragging = false;
        initialTouchDist = 0;
    });
}

function openImageCropper(items, onComplete, options) {
    const list = Array.isArray(items) ? items : [items];
    if (list.length === 0) return;

    _cropperState.queue = list;
    _cropperState.queueIndex = 0;
    _cropperState.results = [];
    _cropperState.onComplete = onComplete;
    _cropperState.options = options || {};

    const active = document.querySelector('.modal-overlay.active');
    _cropperState.prevModalId = active ? active.id : null;

    cropperInitEvents();
    cropperLoadCurrent();
}
window.openImageCropper = openImageCropper;

function cropperLoadCurrent() {
    const item = _cropperState.queue[_cropperState.queueIndex];
    if (!item) return;

    const total = _cropperState.queue.length;
    const currentNum = _cropperState.queueIndex + 1;

    const titleEl = document.getElementById("cropper-modal-title");
    if (titleEl) {
        if (total > 1) {
            titleEl.innerHTML = `<i class="fa-solid fa-crop-simple" style="color:#2563eb;"></i> Adjust Photo (${currentNum} of ${total})`;
        } else {
            titleEl.innerHTML = `<i class="fa-solid fa-crop-simple" style="color:#2563eb;"></i> Adjust &amp; Crop Photo`;
        }
    }

    const applyBtnText = document.getElementById("cropper-apply-text");
    if (applyBtnText) {
        applyBtnText.textContent = (currentNum < total) ? "Apply & Next" : "Save & Apply";
    }

    const skipBtn = document.getElementById("cropper-skip-btn");
    if (skipBtn) {
        skipBtn.style.display = (total > 1) ? "inline-block" : "none";
    }

    const img = new Image();
    img.onload = () => {
        _cropperState.img = img;
        const iw = img.naturalWidth || img.width;
        const ih = img.naturalHeight || img.height;
        _cropperState.rotation = 0;
        _cropperState.posX = 0;
        _cropperState.posY = 0;
        _cropperState.scale = 1.0;
        _cropperState.baseScale = Math.min(600 / iw, 600 / ih);

        const slider = document.getElementById("cropper-zoom-slider");
        if (slider) slider.value = "1.0";
        const lbl = document.getElementById("cropper-zoom-label");
        if (lbl) lbl.textContent = "100%";

        openModal("image-cropper-modal");
        const m = document.getElementById("image-cropper-modal");
        if (m) m.style.zIndex = "3500";

        cropperRedraw();
    };
    img.src = item;
}

function cropperRedraw() {
    const canvas = document.getElementById("cropper-canvas");
    if (!canvas || !_cropperState.img) return;
    const ctx = canvas.getContext("2d");
    const cw = canvas.width;
    const ch = canvas.height;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, cw, ch);

    const iw = _cropperState.img.naturalWidth || _cropperState.img.width;
    const ih = _cropperState.img.naturalHeight || _cropperState.img.height;
    const totalScale = _cropperState.baseScale * _cropperState.scale;

    ctx.save();
    ctx.translate(cw / 2 + _cropperState.posX, ch / 2 + _cropperState.posY);
    ctx.rotate((_cropperState.rotation * Math.PI) / 180);
    ctx.scale(totalScale, totalScale);
    ctx.drawImage(_cropperState.img, -iw / 2, -ih / 2, iw, ih);
    ctx.restore();
}
window.cropperRedraw = cropperRedraw;

function cropperZoomStep(delta) {
    let next = _cropperState.scale + delta;
    next = Math.min(Math.max(next, 0.5), 3.5);
    _cropperState.scale = next;
    const slider = document.getElementById("cropper-zoom-slider");
    if (slider) slider.value = next.toFixed(2);
    const lbl = document.getElementById("cropper-zoom-label");
    if (lbl) lbl.textContent = Math.round(next * 100) + "%";
    cropperRedraw();
}
window.cropperZoomStep = cropperZoomStep;

function cropperOnZoomSlider(val) {
    const next = Math.min(Math.max(parseFloat(val) || 1, 0.5), 3.5);
    _cropperState.scale = next;
    const lbl = document.getElementById("cropper-zoom-label");
    if (lbl) lbl.textContent = Math.round(next * 100) + "%";
    cropperRedraw();
}
window.cropperOnZoomSlider = cropperOnZoomSlider;

function cropperRotate90() {
    _cropperState.rotation = (_cropperState.rotation + 90) % 360;
    if (_cropperState.img) {
        const iw = _cropperState.img.naturalWidth || _cropperState.img.width;
        const ih = _cropperState.img.naturalHeight || _cropperState.img.height;
        const is90or270 = (_cropperState.rotation % 180 !== 0);
        const effW = is90or270 ? ih : iw;
        const effH = is90or270 ? iw : ih;
        _cropperState.baseScale = Math.min(600 / effW, 600 / effH);
    }
    cropperRedraw();
}
window.cropperRotate90 = cropperRotate90;

function cropperResetTransform() {
    _cropperState.scale = 1.0;
    _cropperState.posX = 0;
    _cropperState.posY = 0;
    _cropperState.rotation = 0;
    if (_cropperState.img) {
        const iw = _cropperState.img.naturalWidth || _cropperState.img.width;
        const ih = _cropperState.img.naturalHeight || _cropperState.img.height;
        _cropperState.baseScale = Math.min(600 / iw, 600 / ih);
    }
    const slider = document.getElementById("cropper-zoom-slider");
    if (slider) slider.value = "1.0";
    const lbl = document.getElementById("cropper-zoom-label");
    if (lbl) lbl.textContent = "100%";
    cropperRedraw();
}
window.cropperResetTransform = cropperResetTransform;

function cropperGetCroppedDataUrl() {
    if (!_cropperState.img) return null;
    const outCanvas = document.createElement("canvas");
    outCanvas.width = 900;
    outCanvas.height = 900;
    const ctx = outCanvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 900, 900);

    const iw = _cropperState.img.naturalWidth || _cropperState.img.width;
    const ih = _cropperState.img.naturalHeight || _cropperState.img.height;
    const ratio = 900 / 600;
    const totalScale = _cropperState.baseScale * _cropperState.scale * ratio;

    ctx.save();
    ctx.translate(450 + _cropperState.posX * ratio, 450 + _cropperState.posY * ratio);
    ctx.rotate((_cropperState.rotation * Math.PI) / 180);
    ctx.scale(totalScale, totalScale);
    ctx.drawImage(_cropperState.img, -iw / 2, -ih / 2, iw, ih);
    ctx.restore();

    return outCanvas.toDataURL("image/jpeg", 0.82);
}

function confirmImageCrop() {
    const cropped = cropperGetCroppedDataUrl();
    if (cropped) {
        _cropperState.results.push(cropped);
    }
    if (_cropperState.queueIndex + 1 < _cropperState.queue.length) {
        _cropperState.queueIndex++;
        cropperLoadCurrent();
    } else {
        finishCropperSession();
    }
}
window.confirmImageCrop = confirmImageCrop;

function skipImageCrop() {
    const orig = _cropperState.queue[_cropperState.queueIndex];
    if (orig) {
        _cropperState.results.push(orig);
    }
    if (_cropperState.queueIndex + 1 < _cropperState.queue.length) {
        _cropperState.queueIndex++;
        cropperLoadCurrent();
    } else {
        finishCropperSession();
    }
}
window.skipImageCrop = skipImageCrop;

function finishCropperSession() {
    closeModal("image-cropper-modal");
    const prev = _cropperState.prevModalId;
    if (prev && prev !== "image-cropper-modal") {
        setTimeout(() => {
            openModal(prev);
        }, 50);
    }
    if (typeof _cropperState.onComplete === 'function') {
        _cropperState.onComplete(_cropperState.results);
    }
    _cropperState.queue = [];
    _cropperState.results = [];
}

function cancelImageCrop() {
    closeModal("image-cropper-modal");
    const prev = _cropperState.prevModalId;
    if (prev && prev !== "image-cropper-modal") {
        setTimeout(() => {
            openModal(prev);
        }, 50);
    }
    _cropperState.queue = [];
    _cropperState.results = [];
}
window.cancelImageCrop = cancelImageCrop;

// ==========================================================================
// MULTI-CATEGORY SPECIFICATIONS & CAD BLUEPRINT ENGINE
// ==========================================================================
function escapeHtml(str) {
    if (str === undefined || str === null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
window.escapeHtml = escapeHtml;

const SPECS_TEMPLATES = {
    toilet: {
        id: 'toilet',
        label: 'Toilets & Sanitary Ware',
        fields: [
            { key: 'dimensionsMm', label: 'Dimensions (Millimeters)', placeholder: 'e.g. 695 x 385 x 690 mm', default: '695 x 385 x 690 mm' },
            { key: 'dimensionsInches', label: 'Dimensions (Inches)', placeholder: 'e.g. 27.4" x 15.2" x 27.2"', default: '27.4" x 15.2" x 27.2"' },
            { key: 'flushingSystem', label: 'Flushing System', placeholder: 'e.g. 4D Tornado Whirlpool / 100% Rimless', default: '4D Tornado Whirlpool / 100% Rimless Siphonic' },
            { key: 'installation', label: 'Installation / Mounting', placeholder: 'e.g. Floor Mounted (S-Trap 300mm / 12")', default: 'Floor Mounted (S-Trap 300mm / 12")' },
            { key: 'seatCover', label: 'Seat Cover Specification', placeholder: 'e.g. Slim Duroplast (UF) Soft-Close Seat with Quick Release', default: 'Slim Duroplast (UF) Soft-Close Seat with Quick Release' },
            { key: 'ceramicVitrification', label: 'Ceramic Vitrification', placeholder: 'e.g. Triple-Glazed 1280°C High Density Vitreous China', default: 'Triple-Glazed 1280°C High Density Vitreous China' },
            { key: 'colorFinish', label: 'Color & Finish', placeholder: 'e.g. Glacier Pure White (UltraClean Gloss)', default: 'Glacier Pure White (UltraClean Gloss)' },
            { key: 'warranty', label: 'Warranty Coverage', placeholder: 'e.g. 10 Years Ceramic Glaze Warranty', default: '10 Years Ceramic Glaze Warranty' }
        ],
        defaultFeatures: [
            "360° Tornado Whirlpool Hydro-Cleansing",
            "100% Rimless Flushing Hygiene",
            "UltraClean Nano Anti-Bacterial Glaze",
            "Dual Flush 3/6 L (Eco-Efficiency)",
            "UF Soft-Close Heavy Slim Seat",
            "10-Year Ceramic Glaze Warranty"
        ]
    },
    basin: {
        id: 'basin',
        label: 'Wash Basins & Table Tops',
        fields: [
            { key: 'dimensionsMm', label: 'Dimensions (Millimeters)', placeholder: 'e.g. 480 x 370 x 135 mm', default: '480 x 370 x 135 mm' },
            { key: 'dimensionsInches', label: 'Dimensions (Inches)', placeholder: 'e.g. 18.9" x 14.6" x 5.3"', default: '18.9" x 14.6" x 5.3"' },
            { key: 'mountingType', label: 'Mounting / Vessel Type', placeholder: 'e.g. Countertop / Table Top Vessel Mount', default: 'Countertop / Table Top Vessel Mount' },
            { key: 'overflowType', label: 'Overflow & Waste Specification', placeholder: 'e.g. Integrated Overflow Channel / Standard 32mm Waste', default: 'Integrated Overflow Channel / Standard 32mm Waste' },
            { key: 'ceramicVitrification', label: 'Ceramic Vitrification', placeholder: 'e.g. 1280°C Vitrified Architectural Ceramic', default: '1280°C Vitrified Architectural Ceramic' },
            { key: 'colorFinish', label: 'Color & Finish', placeholder: 'e.g. Pure White (UltraClean Gloss)', default: 'Pure White (UltraClean Gloss)' },
            { key: 'warranty', label: 'Warranty Coverage', placeholder: 'e.g. 10 Years Ceramic Glaze Warranty', default: '10 Years Ceramic Glaze Warranty' }
        ],
        defaultFeatures: [
            "Vitrified High-Density Fine Ceramic",
            "Stain & Acid Resistant Ultra-Smooth Glaze",
            "Precision Thin-Edge Architectural Crafting",
            "Zero Water Absorption Rate (<0.2%)",
            "Easy Clean Anti-Limescale Nano-Coat",
            "10-Year Ceramic Glaze Warranty"
        ]
    },
    sink: {
        id: 'sink',
        label: 'Kitchen Sinks (Steel & Quartz)',
        fields: [
            { key: 'dimensionsMm', label: 'Dimensions (Millimeters)', placeholder: 'e.g. 610 x 457 x 230 mm (24" x 18" x 9")', default: '610 x 457 x 230 mm (24" x 18" x 9")' },
            { key: 'dimensionsInches', label: 'Dimensions (Inches)', placeholder: 'e.g. 24.0" x 18.0" x 9.0"', default: '24.0" x 18.0" x 9.0"' },
            { key: 'materialGrade', label: 'Material & Grade', placeholder: 'e.g. AISI-304 Food-Grade Stainless Steel / 80% Quartz Granite', default: 'AISI-304 Food-Grade Heavy Stainless Steel' },
            { key: 'bowlType', label: 'Bowl Configuration', placeholder: 'e.g. Single Deep Bowl with R10 Easy-Clean Radius Corners', default: 'Single Deep Bowl with R10 Easy-Clean Radius Corners' },
            { key: 'thickness', label: 'Sheet Thickness / Gauge', placeholder: 'e.g. 1.2 mm (18 Gauge) Heavy-Duty Sheet', default: '1.2 mm (18 Gauge) Heavy-Duty Sheet' },
            { key: 'soundDeadening', label: 'Sound Dampening & Coating', placeholder: 'e.g. Full Under-Body Anti-Condensation Coating & 3mm Acoustic Pads', default: 'Full Under-Body Anti-Condensation Coating & 3mm Acoustic Pads' },
            { key: 'colorFinish', label: 'Color & Finish', placeholder: 'e.g. Brushed Satin Hydrophobic Finish / Metallic Black', default: 'Brushed Satin Hydrophobic Finish' },
            { key: 'warranty', label: 'Warranty Coverage', placeholder: 'e.g. 5 Years Rabbit Engineered Warranty', default: '5 Years Rabbit Engineered Warranty' }
        ],
        defaultFeatures: [
            "AISI-304 Heavy Duty Food-Grade Steel",
            "1.2mm Sheet Thickness Heavy-Duty Build",
            "Acoustic Sound-Deadening Rubber Dampener Pads",
            "Anti-Condensation Protective Under-Body Shield",
            "R10 Radius Easy-Clean Curved Corners",
            "5-Year Manufacturer Warranty Coverage"
        ]
    },
    faucet: {
        id: 'faucet',
        label: 'Bath Fittings & Faucets',
        fields: [
            { key: 'dimensionsMm', label: 'Dimensions / Spout Reach', placeholder: 'e.g. Height 180mm x Spout Reach 140mm', default: 'Height 180mm x Spout Reach 140mm' },
            { key: 'bodyMaterial', label: 'Body Material', placeholder: 'e.g. High-Grade Virgin Brass Ingot', default: 'High-Grade Virgin Brass Ingot' },
            { key: 'cartridge', label: 'Cartridge Specification', placeholder: 'e.g. 35mm Ceramic Disc Cartridge (500k Cycles Tested)', default: '35mm Ceramic Disc Cartridge (500k Cycles Tested)' },
            { key: 'flowType', label: 'Flow & Aerator Type', placeholder: 'e.g. Neoperl Honeycomb Splash-Free Aerator Flow', default: 'Neoperl Honeycomb Splash-Free Aerator Flow' },
            { key: 'colorFinish', label: 'Surface Finish', placeholder: 'e.g. Multi-Layer Mirror Chrome Finish', default: 'Multi-Layer Mirror Chrome Finish' },
            { key: 'warranty', label: 'Warranty Coverage', placeholder: 'e.g. 7 Years Comprehensive Warranty', default: '7 Years Comprehensive Warranty' }
        ],
        defaultFeatures: [
            "Forged Virgin Brass Core Construction",
            "Smooth 1/4-Turn High-Life Ceramic Disc Valve",
            "Splash-Free Water-Saving Aerated Flow",
            "Corrosion-Resistant Salt-Spray Tested Coating",
            "Standard 1/2-Inch BSP Connection",
            "7-Year Manufacturer Warranty"
        ]
    },
    general: {
        id: 'general',
        label: 'General & Other Products',
        fields: [
            { key: 'dimensionsMm', label: 'Dimensions (Millimeters)', placeholder: 'e.g. 600 x 400 mm', default: '600 x 400 mm' },
            { key: 'dimensionsInches', label: 'Dimensions (Inches)', placeholder: 'e.g. 23.6" x 15.7"', default: '23.6" x 15.7"' },
            { key: 'materialGrade', label: 'Material & Construction', placeholder: 'e.g. Premium High-Density Material', default: 'Premium High-Density Material' },
            { key: 'installation', label: 'Installation / Usage', placeholder: 'e.g. Standard Surface Mount', default: 'Standard Surface Mount' },
            { key: 'colorFinish', label: 'Color & Finish', placeholder: 'e.g. Standard Finish', default: 'Standard Finish' },
            { key: 'warranty', label: 'Warranty Coverage', placeholder: 'e.g. 1 Year Warranty', default: '1 Year Warranty' }
        ],
        defaultFeatures: [
            "High Quality Construction Material",
            "Precision Engineered Architecture",
            "Stain & Wear Resistant Protective Coating",
            "Manufacturer Warranty Included"
        ]
    }
};
window.SPECS_TEMPLATES = SPECS_TEMPLATES;

function detectSpecsTemplate(category, subcategory, model) {
    const text = `${category || ''} ${subcategory || ''} ${model || ''}`.toLowerCase();
    if (text.includes('sink') || text.includes('kitchen')) return 'sink';
    if (text.includes('basin') || text.includes('table top') || text.includes('tabletop') || text.includes('vanity') || text.includes('art')) return 'basin';
    if (text.includes('faucet') || text.includes('tap') || text.includes('fitting') || text.includes('shower') || text.includes('valve') || text.includes('cock') || text.includes('cp')) return 'faucet';
    if (text.includes('closet') || text.includes('one piece') || text.includes('wall hung') || text.includes('toilet') || text.includes('pan') || text.includes('sanitary') || text.includes('urinal')) return 'toilet';
    return 'general';
}
window.detectSpecsTemplate = detectSpecsTemplate;

function getProductSpecs(p) {
    if (!p) return null;
    const cat = (p.category || '').toLowerCase();
    const sub = (p.subcategory || p.subCategory || '').toLowerCase();
    const model = (p.model || '').toLowerCase();
    
    // Existing user-saved specs
    const userSpecs = p.specs || {};
    const templateId = userSpecs.template || detectSpecsTemplate(p.category, p.subcategory, p.model);
    const tmpl = SPECS_TEMPLATES[templateId] || SPECS_TEMPLATES.general;

    // Build specs object with backward compatibility
    const specs = {
        template: templateId,
        dimensionsMm: userSpecs.dimensionsMm || tmpl.fields.find(f => f.key === 'dimensionsMm')?.default || "695 x 385 x 690 mm",
        dimensionsInches: userSpecs.dimensionsInches || tmpl.fields.find(f => f.key === 'dimensionsInches')?.default || '27.4" x 15.2" x 27.2"',
        colorFinish: userSpecs.colorFinish || (p.colour ? `${p.colour} (UltraClean Gloss)` : (tmpl.fields.find(f => f.key === 'colorFinish')?.default || 'Pure White')),
        warranty: userSpecs.warranty || tmpl.fields.find(f => f.key === 'warranty')?.default || '10 Years Warranty',
        mrp: (userSpecs.mrp !== undefined && userSpecs.mrp !== null && userSpecs.mrp !== '') ? Number(userSpecs.mrp) : (p.price ? Math.round(p.price * 1.55) : 10400),
        cadBlueprintUrl: userSpecs.cadBlueprintUrl || null,
        keyFeatures: (Array.isArray(userSpecs.keyFeatures) && userSpecs.keyFeatures.length > 0)
            ? userSpecs.keyFeatures
            : (typeof userSpecs.keyFeatures === 'string' && userSpecs.keyFeatures.trim())
                ? userSpecs.keyFeatures.split(',').map(s => s.trim()).filter(Boolean)
                : tmpl.defaultFeatures,
        customSpecs: Array.isArray(userSpecs.customSpecs) ? userSpecs.customSpecs : []
    };

    // Category-specific fields copied from userSpecs or template default
    tmpl.fields.forEach(f => {
        if (!specs[f.key]) {
            specs[f.key] = userSpecs[f.key] !== undefined ? userSpecs[f.key] : (userSpecs.isCustomConfigured ? '' : f.default);
        }
    });

    // Toilet specifics fallback
    if (templateId === 'toilet') {
        if (!specs.flushingSystem) specs.flushingSystem = userSpecs.flushingSystem || "4D Tornado Whirlpool / 100% Rimless Siphonic";
        if (!specs.installation) {
            if (sub.includes('p-trap') || model.includes('p-trap') || model.includes('p trap')) {
                specs.installation = "Floor Mounted (P-Trap 180mm)";
            } else if (model.includes('s-9') || model.includes('s9') || model.includes('225')) {
                specs.installation = "Floor Mounted (S-Trap 225mm / 9\")";
            } else if (model.includes('s-4') || model.includes('s4') || model.includes('100')) {
                specs.installation = "Floor Mounted (S-Trap 100mm / 4\")";
            } else {
                specs.installation = "Floor Mounted (S-Trap 300mm / 12\")";
            }
        }
        if (!specs.seatCover) specs.seatCover = userSpecs.seatCover || "Slim Duroplast (UF) Soft-Close Seat with Quick Release";
        if (!specs.ceramicVitrification) specs.ceramicVitrification = userSpecs.ceramicVitrification || "Triple-Glazed 1280°C High Density Vitreous China";
    }

    return specs;
}
window.getProductSpecs = getProductSpecs;

function getSpecsCADBlueprintSVG(p, specs) {
    const templateId = (specs && specs.template) ? specs.template : detectSpecsTemplate(p?.category, p?.subcategory, p?.model);
    const dim = (specs && specs.dimensionsMm) ? specs.dimensionsMm : "695 x 385 x 690 mm";
    const parts = dim.split('x').map(s => s.trim().replace('mm',''));
    const len = parts[0] || '695';
    const wid = parts[1] || '385';
    const ht = parts[2] || '690';
    const model = (p && p.model) ? p.model : "RABBIT WORLD";
    const finish = (specs && specs.colorFinish) ? specs.colorFinish : "Pure White";

    if (templateId === 'sink') {
        const mat = (specs && specs.materialGrade) ? specs.materialGrade : "AISI-304 SS";
        const bowl = (specs && specs.bowlType) ? specs.bowlType : "Single Bowl";
        return `
        <svg viewBox="0 0 500 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#091428; border-radius:8px; font-family:monospace;">
            <defs>
                <pattern id="cadGridSink" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e3a8a" stroke-width="0.5" stroke-opacity="0.45"/>
                </pattern>
                <marker id="cadArrowSink" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                    <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8"/>
                </marker>
            </defs>
            <rect width="100%" height="100%" fill="#070f20"/>
            <rect width="100%" height="100%" fill="url(#cadGridSink)"/>
            <rect x="4" y="4" width="492" height="492" fill="none" stroke="#38bdf8" stroke-width="1" stroke-opacity="0.6"/>
            <rect x="7" y="7" width="486" height="486" fill="none" stroke="#1e3a8a" stroke-width="0.75" stroke-dasharray="3,3"/>

            <text x="30" y="42" fill="#38bdf8" font-size="11" font-weight="bold" letter-spacing="1.5">TECHNICAL CAD BLUEPRINT — SINK ARCHITECTURE</text>
            <text x="30" y="58" fill="#94a3b8" font-size="9">SCALE 1:10 • ALL DIMENSIONS IN MM</text>

            <g transform="translate(60, 90)">
                <!-- Outer Rim -->
                <rect x="20" y="20" width="260" height="200" rx="12" fill="none" stroke="#e2e8f0" stroke-width="2.5"/>
                <!-- Inner Bowl -->
                <rect x="40" y="40" width="220" height="160" rx="10" fill="none" stroke="#38bdf8" stroke-width="2"/>
                <!-- Drain Hole -->
                <circle cx="150" cy="120" r="26" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="3,3"/>
                <circle cx="150" cy="120" r="14" fill="#38bdf8" fill-opacity="0.25" stroke="#38bdf8" stroke-width="1.2"/>
                <circle cx="150" cy="120" r="3" fill="#f59e0b"/>

                <!-- Dimension Lines -->
                <line x1="20" y1="235" x2="280" y2="235" stroke="#38bdf8" stroke-width="1.2" marker-start="url(#cadArrowSink)" marker-end="url(#cadArrowSink)"/>
                <text x="150" y="250" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">${len} mm (Length)</text>

                <line x1="295" y1="20" x2="295" y2="220" stroke="#38bdf8" stroke-width="1.2" marker-start="url(#cadArrowSink)" marker-end="url(#cadArrowSink)"/>
                <text x="308" y="125" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle" transform="rotate(90, 308, 125)">${wid} mm (Width)</text>

                <!-- Drain Callout -->
                <line x1="150" y1="120" x2="200" y2="60" stroke="#f59e0b" stroke-width="1" stroke-dasharray="2,2"/>
                <text x="205" y="58" fill="#fbbf24" font-size="8" font-weight="bold">DRAIN CENTER Ø90mm</text>
            </g>

            <!-- Side Depth Profile -->
            <g transform="translate(365, 80)">
                <rect x="0" y="0" width="105" height="130" rx="4" fill="#0f172a" fill-opacity="0.8" stroke="#1e3a8a" stroke-width="1"/>
                <text x="52" y="16" fill="#94a3b8" font-size="7.5" text-anchor="middle" font-weight="bold">DEPTH PROFILE</text>
                <path d="M 15,30 L 25,30 L 25,100 L 80,100 L 80,30 L 90,30" fill="none" stroke="#38bdf8" stroke-width="1.8"/>
                <line x1="10" y1="30" x2="10" y2="100" stroke="#38bdf8" stroke-width="1" marker-start="url(#cadArrowSink)" marker-end="url(#cadArrowSink)"/>
                <text x="-65" y="7" transform="rotate(-90)" fill="#38bdf8" font-size="8" font-weight="bold" text-anchor="middle">${ht} mm</text>
            </g>

            <g transform="translate(210, 410)">
                <rect x="0" y="0" width="260" height="60" fill="#070d19" stroke="#38bdf8" stroke-width="1"/>
                <line x1="0" y1="20" x2="260" y2="20" stroke="#1e3a8a" stroke-width="0.8"/>
                <line x1="0" y1="40" x2="260" y2="40" stroke="#1e3a8a" stroke-width="0.8"/>
                <line x1="130" y1="20" x2="130" y2="60" stroke="#1e3a8a" stroke-width="0.8"/>

                <text x="8" y="14" fill="#38bdf8" font-size="8.5" font-weight="bold">${model.substring(0, 32)}</text>
                <text x="8" y="32" fill="#94a3b8" font-size="7.5">MATERIAL: <tspan fill="#f8fafc">${mat.substring(0,14)}</tspan></text>
                <text x="138" y="32" fill="#94a3b8" font-size="7.5">BOWL: <tspan fill="#f8fafc">${bowl.substring(0,14)}</tspan></text>
                <text x="8" y="52" fill="#94a3b8" font-size="7.5">FINISH: <tspan fill="#f8fafc">${finish.substring(0,16)}</tspan></text>
                <text x="138" y="52" fill="#fbbf24" font-size="7.5" font-weight="bold">RABBIT QA PASSED</text>
            </g>
        </svg>
        `;
    }

    if (templateId === 'basin') {
        const mount = (specs && specs.mountingType) ? specs.mountingType : "Table Top";
        return `
        <svg viewBox="0 0 500 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#091428; border-radius:8px; font-family:monospace;">
            <defs>
                <pattern id="cadGridBasin" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e3a8a" stroke-width="0.5" stroke-opacity="0.45"/>
                </pattern>
                <marker id="cadArrowBasin" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                    <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8"/>
                </marker>
            </defs>
            <rect width="100%" height="100%" fill="#070f20"/>
            <rect width="100%" height="100%" fill="url(#cadGridBasin)"/>
            <rect x="4" y="4" width="492" height="492" fill="none" stroke="#38bdf8" stroke-width="1" stroke-opacity="0.6"/>
            <rect x="7" y="7" width="486" height="486" fill="none" stroke="#1e3a8a" stroke-width="0.75" stroke-dasharray="3,3"/>

            <text x="30" y="42" fill="#38bdf8" font-size="11" font-weight="bold" letter-spacing="1.5">TECHNICAL CAD BLUEPRINT — ART BASIN</text>
            <text x="30" y="58" fill="#94a3b8" font-size="9">SCALE 1:10 • ALL DIMENSIONS IN MM</text>

            <g transform="translate(60, 95)">
                <!-- Basin Outer Rim -->
                <ellipse cx="140" cy="110" rx="120" ry="85" fill="none" stroke="#e2e8f0" stroke-width="2.5"/>
                <!-- Basin Inner Wall -->
                <ellipse cx="140" cy="110" rx="105" ry="72" fill="none" stroke="#38bdf8" stroke-width="1.8"/>
                <!-- Tap Hole / Waste Hole -->
                <circle cx="140" cy="110" r="16" fill="#38bdf8" fill-opacity="0.25" stroke="#38bdf8" stroke-width="1.5"/>
                <circle cx="140" cy="110" r="3" fill="#f59e0b"/>

                <!-- Dimensions -->
                <line x1="20" y1="210" x2="260" y2="210" stroke="#38bdf8" stroke-width="1.2" marker-start="url(#cadArrowBasin)" marker-end="url(#cadArrowBasin)"/>
                <text x="140" y="225" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">${len} mm (Length)</text>

                <line x1="275" y1="25" x2="275" y2="195" stroke="#38bdf8" stroke-width="1.2" marker-start="url(#cadArrowBasin)" marker-end="url(#cadArrowBasin)"/>
                <text x="288" y="110" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle" transform="rotate(90, 288, 110)">${wid} mm (Width)</text>
            </g>

            <!-- Elevation Profile -->
            <g transform="translate(365, 80)">
                <rect x="0" y="0" width="105" height="130" rx="4" fill="#0f172a" fill-opacity="0.8" stroke="#1e3a8a" stroke-width="1"/>
                <text x="52" y="16" fill="#94a3b8" font-size="7.5" text-anchor="middle" font-weight="bold">HEIGHT PROFILE</text>
                <path d="M 15,35 C 15,95 90,95 90,35 Z" fill="none" stroke="#38bdf8" stroke-width="2"/>
                <line x1="10" y1="35" x2="10" y2="95" stroke="#38bdf8" stroke-width="1" marker-start="url(#cadArrowBasin)" marker-end="url(#cadArrowBasin)"/>
                <text x="-65" y="7" transform="rotate(-90)" fill="#38bdf8" font-size="8" font-weight="bold" text-anchor="middle">${ht} mm</text>
            </g>

            <g transform="translate(210, 410)">
                <rect x="0" y="0" width="260" height="60" fill="#070d19" stroke="#38bdf8" stroke-width="1"/>
                <line x1="0" y1="20" x2="260" y2="20" stroke="#1e3a8a" stroke-width="0.8"/>
                <line x1="0" y1="40" x2="260" y2="40" stroke="#1e3a8a" stroke-width="0.8"/>
                <line x1="130" y1="20" x2="130" y2="60" stroke="#1e3a8a" stroke-width="0.8"/>

                <text x="8" y="14" fill="#38bdf8" font-size="8.5" font-weight="bold">${model.substring(0, 32)}</text>
                <text x="8" y="32" fill="#94a3b8" font-size="7.5">MOUNT: <tspan fill="#f8fafc">${mount.substring(0,14)}</tspan></text>
                <text x="138" y="32" fill="#94a3b8" font-size="7.5">GLAZE: <tspan fill="#f8fafc">1280°C Vitrified</tspan></text>
                <text x="8" y="52" fill="#94a3b8" font-size="7.5">FINISH: <tspan fill="#f8fafc">${finish.substring(0,16)}</tspan></text>
                <text x="138" y="52" fill="#fbbf24" font-size="7.5" font-weight="bold">RABBIT QA PASSED</text>
            </g>
        </svg>
        `;
    }

    // Default Toilet WC CAD Blueprint
    const trap = (specs && specs.installation) ? specs.installation : "S-Trap 300mm";
    const flush = (specs && specs.flushingSystem) ? specs.flushingSystem : "Tornado Flush";

    return `
    <svg viewBox="0 0 500 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#091428; border-radius:8px; font-family:monospace;">
        <defs>
            <pattern id="cadGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e3a8a" stroke-width="0.5" stroke-opacity="0.45"/>
            </pattern>
            <marker id="cadArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8"/>
            </marker>
        </defs>
        <rect width="100%" height="100%" fill="#070f20"/>
        <rect width="100%" height="100%" fill="url(#cadGrid)"/>
        
        <rect x="4" y="4" width="492" height="492" fill="none" stroke="#38bdf8" stroke-width="1" stroke-opacity="0.6"/>
        <rect x="7" y="7" width="486" height="486" fill="none" stroke="#1e3a8a" stroke-width="0.75" stroke-dasharray="3,3"/>

        <text x="30" y="42" fill="#38bdf8" font-size="11" font-weight="bold" letter-spacing="1.5">TECHNICAL CAD BLUEPRINT</text>
        <text x="30" y="58" fill="#94a3b8" font-size="9">SCALE 1:10 • ALL DIMENSIONS IN MM</text>

        <g transform="translate(60, 90)">
            <path d="M 30,30 L 110,30 L 105,170 L 35,170 Z" fill="none" stroke="#e2e8f0" stroke-width="2"/>
            <path d="M 25,25 L 115,25 L 115,30 L 25,30 Z" fill="#38bdf8" fill-opacity="0.3" stroke="#38bdf8" stroke-width="1.5"/>
            <circle cx="70" cy="22" r="5" fill="#38bdf8"/>

            <path d="M 105,130 C 130,130 180,135 250,140 C 275,142 290,165 285,200 C 275,260 230,270 200,270 L 40,270 L 40,240 C 60,240 85,240 100,210 C 115,180 105,150 105,130 Z" fill="none" stroke="#e2e8f0" stroke-width="2.2"/>
            <ellipse cx="205" cy="148" rx="70" ry="12" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3,3"/>
            
            <path d="M 180,160 C 180,210 130,210 130,240 L 130,270" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="4,3"/>
            <path d="M 210,160 C 210,230 160,230 160,270" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="4,3"/>

            <line x1="15" y1="25" x2="15" y2="270" stroke="#38bdf8" stroke-width="1.2" marker-start="url(#cadArrow)" marker-end="url(#cadArrow)"/>
            <text x="-150" y="9" transform="rotate(-90)" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">${ht} mm</text>

            <line x1="30" y1="288" x2="285" y2="288" stroke="#38bdf8" stroke-width="1.2" marker-start="url(#cadArrow)" marker-end="url(#cadArrow)"/>
            <text x="157" y="302" fill="#38bdf8" font-size="10" font-weight="bold" text-anchor="middle">${len} mm</text>

            <line x1="145" y1="260" x2="145" y2="320" stroke="#f59e0b" stroke-width="1.2" stroke-dasharray="3,3"/>
            <circle cx="145" cy="270" r="3" fill="#f59e0b"/>
            <text x="145" y="332" fill="#fbbf24" font-size="8.5" font-weight="bold" text-anchor="middle">TRAP CENTER</text>
            <text x="145" y="343" fill="#94a3b8" font-size="7.5" text-anchor="middle">${trap}</text>
        </g>

        <g transform="translate(350, 60)">
            <rect x="0" y="0" width="115" height="150" rx="4" fill="#0f172a" fill-opacity="0.8" stroke="#1e3a8a" stroke-width="1"/>
            <text x="52" y="16" fill="#94a3b8" font-size="7.5" text-anchor="middle" font-weight="bold">TOP PROFILE</text>
            <rect x="15" y="24" width="85" height="32" rx="2" fill="none" stroke="#38bdf8" stroke-width="1.2"/>
            <path d="M 20,56 C 20,130 95,130 95,56 Z" fill="none" stroke="#e2e8f0" stroke-width="1.5"/>
            <ellipse cx="57" cy="85" rx="22" ry="30" fill="none" stroke="#38bdf8" stroke-width="1" stroke-dasharray="2,2"/>
            <line x1="15" y1="140" x2="100" y2="140" stroke="#38bdf8" stroke-width="1" marker-start="url(#cadArrow)" marker-end="url(#cadArrow)"/>
            <text x="57" y="137" fill="#38bdf8" font-size="8" font-weight="bold" text-anchor="middle">${wid} mm</text>
        </g>

        <g transform="translate(210, 410)">
            <rect x="0" y="0" width="260" height="60" fill="#070d19" stroke="#38bdf8" stroke-width="1"/>
            <line x1="0" y1="20" x2="260" y2="20" stroke="#1e3a8a" stroke-width="0.8"/>
            <line x1="0" y1="40" x2="260" y2="40" stroke="#1e3a8a" stroke-width="0.8"/>
            <line x1="130" y1="20" x2="130" y2="60" stroke="#1e3a8a" stroke-width="0.8"/>

            <text x="8" y="14" fill="#38bdf8" font-size="8.5" font-weight="bold">${model.substring(0, 32)}</text>
            <text x="8" y="32" fill="#94a3b8" font-size="7.5">FINISH: <tspan fill="#f8fafc">${finish.substring(0,16)}</tspan></text>
            <text x="138" y="32" fill="#94a3b8" font-size="7.5">TRAP: <tspan fill="#f8fafc">${trap.substring(0,14)}</tspan></text>
            <text x="8" y="52" fill="#94a3b8" font-size="7.5">FLUSH: <tspan fill="#f8fafc">${flush.substring(0,16)}</tspan></text>
            <text x="138" y="52" fill="#fbbf24" font-size="7.5" font-weight="bold">RABBIT QA PASSED</text>
        </g>
    </svg>
    `;
}
window.getSpecsCADBlueprintSVG = getSpecsCADBlueprintSVG;


// ============================================================
// DEALER ANALYTICS & ACTIVITY TRACKING SUBSYSTEM v1.0
// ============================================================

function recordDealerActivity(merchantId, actionType, details = {}) {
    if (typeof state === 'undefined' || !state) return;
    if (!state.dealerActivities) state.dealerActivities = [];
    
    // Find matching merchant (by ID, UID, or phone)
    const m = (state.merchants || []).find(x => 
        x.id === merchantId || 
        x.uid === merchantId || 
        String(x.id) === String(merchantId) || 
        (x.phone && merchantId && String(x.phone).endsWith(String(merchantId)))
    );
    
    const now = Date.now();
    const actId = 'act-' + now + '-' + Math.floor(Math.random() * 1000);
    
    const entry = {
        id: actId,
        merchantId: m ? m.id : (merchantId || 'guest'),
        merchantName: m ? m.name : (details.dealerName || 'Guest / Prospective Dealer'),
        merchantCity: m ? (m.address ? m.address.split(',')[0].trim() : '') : (details.city || ''),
        merchantPhone: m ? m.phone : (details.phone || ''),
        action: actionType, // 'visit' | 'pdf' | 'cart' | 'order' | 'lockout'
        title: details.title || (actionType === 'visit' ? 'Portal Visited' : actionType === 'pdf' ? 'Catalog PDF Downloaded' : 'Activity Recorded'),
        description: details.description || '',
        priceMode: details.priceMode || '',
        itemCount: details.itemCount || 0,
        timestamp: now,
        dateStr: new Date(now).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true })
    };

    if (m) {
        if (!m.activityLog) m.activityLog = [];
        if (actionType === 'visit') {
            m.visits = (m.visits || 0) + 1;
            m.lastVisit = now;
        } else if (actionType === 'pdf') {
            m.pdfCount = (m.pdfCount || 0) + 1;
            m.lastPdfAt = now;
            m.lastPdfMode = details.priceMode || 'Custom Rates';
        } else if (actionType === 'cart') {
            m.lastCartAt = now;
            m.cartCount = details.itemCount || 0;
        } else if (actionType === 'order') {
            m.lastOrderAt = now;
        } else if (actionType === 'lockout') {
            m.lastLockoutAt = now;
        }
        m.activityLog.unshift(entry);
        if (m.activityLog.length > 40) m.activityLog.pop();
    }

    state.dealerActivities.unshift(entry);
    if (state.dealerActivities.length > 250) state.dealerActivities.pop();

    if (typeof saveState === 'function') saveState();
    if (typeof syncToCloud === 'function') syncToCloud();
    return entry;
}
window.recordDealerActivity = recordDealerActivity;

function seedInitialDealerAnalyticsIfEmpty() {
    if (typeof state === 'undefined' || !state || !state.merchants || state.merchants.length === 0) return;
    if (!state.dealerActivities) state.dealerActivities = [];
    
    // Check if any dealer already has visits
    const hasAnyVisits = state.merchants.some(m => (m.visits || 0) > 0);
    if (hasAnyVisits && state.dealerActivities.length > 0) return;

    const sampleData = [
        { name: "Mehta Traders", visits: 19, pdfCount: 5, lastMode: "Custom Product Rates", city: "Rajkot", daysAgo: 0.1 },
        { name: "Patel Sanitary & Ceramics", visits: 12, pdfCount: 3, lastMode: "Trade Discount 40%", city: "Ahmedabad", daysAgo: 0.4 },
        { name: "Shree Ram Bath Gallery", visits: 8, pdfCount: 2, lastMode: "Original MRP", city: "Surat", daysAgo: 1.2 },
        { name: "Ambica Ceramics", visits: 15, pdfCount: 4, lastMode: "Custom Product Rates", city: "Morbi", daysAgo: 1.8 },
        { name: "Shreeji Bath Collection", visits: 6, pdfCount: 1, lastMode: "Original MRP", city: "Vadodara", daysAgo: 2.5 },
        { name: "Krishna Tiles & Bath", visits: 3, pdfCount: 0, lastMode: "", city: "Jamnagar", daysAgo: 4.1 },
        { name: "Balaji Marble & Sanitary", visits: 1, pdfCount: 0, lastMode: "", city: "Bhavnagar", daysAgo: 6.0 }
    ];

    const now = Date.now();
    sampleData.forEach((item, idx) => {
        const m = state.merchants.find(x => x.name.toLowerCase().includes(item.name.toLowerCase().split(' ')[0]));
        if (m) {
            m.visits = item.visits;
            m.pdfCount = item.pdfCount;
            m.lastVisit = now - Math.round(item.daysAgo * 86400000);
            if (item.pdfCount > 0) {
                m.lastPdfAt = now - Math.round((item.daysAgo + 0.1) * 86400000);
                m.lastPdfMode = item.lastMode;
            }
            if (!m.activityLog) m.activityLog = [];

            // Add activity entries
            if (item.pdfCount > 0) {
                const pdfAct = {
                    id: 'act-seed-pdf-' + idx,
                    merchantId: m.id,
                    merchantName: m.name,
                    merchantCity: item.city,
                    merchantPhone: m.phone,
                    action: 'pdf',
                    title: 'Downloaded Catalog PDF',
                    description: `Price Mode: ${item.lastMode} (Client Order Sheet Generated)`,
                    priceMode: item.lastMode,
                    timestamp: m.lastPdfAt,
                    dateStr: new Date(m.lastPdfAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true })
                };
                m.activityLog.push(pdfAct);
                state.dealerActivities.push(pdfAct);
            }

            const visitAct = {
                id: 'act-seed-visit-' + idx,
                merchantId: m.id,
                merchantName: m.name,
                merchantCity: item.city,
                merchantPhone: m.phone,
                action: 'visit',
                title: 'Dealer Portal Opened',
                description: `Browsed Sanitary Ware & Art Basins catalog`,
                timestamp: m.lastVisit,
                dateStr: new Date(m.lastVisit).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true })
            };
            m.activityLog.push(visitAct);
            state.dealerActivities.push(visitAct);
        }
    });

    state.dealerActivities.sort((a, b) => b.timestamp - a.timestamp);
    if (typeof saveState === 'function') saveState();
}
window.seedInitialDealerAnalyticsIfEmpty = seedInitialDealerAnalyticsIfEmpty;



// ============================================================
// GEOGRAPHIC & COORDINATE UTILITIES FOR TERRITORY MANAGEMENT
// ============================================================

const GUJARAT_CITY_COORDINATES = {
    "rajkot": { lat: 22.3039, lng: 70.8022 },
    "ahmedabad": { lat: 23.0225, lng: 72.5714 },
    "surat": { lat: 21.1702, lng: 72.8311 },
    "morbi": { lat: 22.8120, lng: 70.8378 },
    "vadodara": { lat: 22.3072, lng: 73.1812 },
    "jamnagar": { lat: 22.4707, lng: 70.0577 },
    "bhavnagar": { lat: 21.7645, lng: 72.1519 },
    "junagadh": { lat: 21.5222, lng: 70.4579 },
    "gandhinagar": { lat: 23.2156, lng: 72.6369 },
    "mehsana": { lat: 23.5880, lng: 72.3693 },
    "bhuj": { lat: 23.2420, lng: 69.6669 },
    "anand": { lat: 22.5645, lng: 72.9289 },
    "bharuch": { lat: 21.7051, lng: 72.9959 },
    "vapi": { lat: 20.3893, lng: 72.9106 },
    "himatnagar": { lat: 23.5977, lng: 72.9698 },
    "palanpur": { lat: 24.1725, lng: 72.4344 }
};
window.GUJARAT_CITY_COORDINATES = GUJARAT_CITY_COORDINATES;

function getMerchantCoordinates(m) {
    if (!m) return null;
    if (m.lat && m.lng && !isNaN(m.lat) && !isNaN(m.lng)) {
        return { lat: parseFloat(m.lat), lng: parseFloat(m.lng), isGps: true };
    }
    const fullText = ((m.city || '') + ' ' + (m.address || '')).toLowerCase();
    for (const [cityName, coords] of Object.entries(GUJARAT_CITY_COORDINATES)) {
        if (fullText.includes(cityName)) {
            const hash = (m.id || m.name || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
            const offsetLat = ((hash % 10) - 5) * 0.008;
            const offsetLng = (((hash * 3) % 10) - 5) * 0.008;
            return { lat: coords.lat + offsetLat, lng: coords.lng + offsetLng, isGps: false };
        }
    }
    return { lat: 22.8120, lng: 70.8378, isGps: false };
}
window.getMerchantCoordinates = getMerchantCoordinates;

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return parseFloat((R * c).toFixed(2));
}
window.calculateDistanceKm = calculateDistanceKm;

