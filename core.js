// ============================================================
// BMS Portal - Core Application State & Shared Utilities v3.0
// Shared state across admin.html, staff.html, and dealer.html
// ============================================================

const DEFAULT_HOME_BANNERS = [
    {
        id: "banner-1",
        tag: "LUXURY BATHWARE COLLECTION",
        title: "The Brilliance of Luxury Reimagined",
        subtitle: "Direct Factory Dispatch of 100% Vitreous China Sanitary Ware, Designer Basins & Quartz Sinks.",
        badge: "10-Year Craftsmanship Guarantee",
        btnText: "Explore Collection",
        btnTarget: "products",
        bgGradient: "linear-gradient(135deg, #0e254f 0%, #1e3a8a 50%, #0f172a 100%)",
        imageUrl: ""
    },
    {
        id: "banner-2",
        tag: "TOP SELLING SANITARY WARE",
        title: "Vitreous China One-Piece & Wall Hung",
        subtitle: "Engineered with Tornado 4D Flush & Nano Stain-Free Glaze for ultimate hygiene and luxury.",
        badge: "Eco-Saver 3L / 6L Dual Flush",
        btnText: "View Sanitary Ware",
        btnTarget: "products",
        bgGradient: "linear-gradient(135deg, #1e293b 0%, #334155 50%, #0e254f 100%)",
        imageUrl: ""
    },
    {
        id: "banner-3",
        tag: "DESIGNER ART BASINS & VANITIES",
        title: "Artistic Table Tops & Modular Vanities",
        subtitle: "Handcrafted finishes, marble textures, and waterproof cabinetry made for premium homes.",
        badge: "Waterproof HD Cabinets",
        btnText: "Become a Dealer",
        btnTarget: "register",
        bgGradient: "linear-gradient(135deg, #0f172a 0%, #1e40af 60%, #1e3a8a 100%)",
        imageUrl: ""
    }
];

const DEFAULT_HOME_CATEGORY_CARDS = [
    {
        id: "catcard-1",
        title: "Ceramic Sanitary Ware",
        subtitle: "One-Piece, Wall-Hung & Closets",
        category: "Ceramic Sanitary Ware",
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
        title: "Drain Covers & Fittings",
        subtitle: "FRP Manhole Covers & Accessories",
        category: "Drain Covers & Fittings",
        icon: "fa-circle-dot",
        active: true
    }
];

const DEFAULT_CATEGORY_TREE = {
    "Ceramic Sanitary Ware": ["One Piece Closet", "Table Top Basin", "Wall Hung Closet", "Counter Wash Basin", "Water Closet & Pan"],
    "Kitchen Sinks": ["Stainless Steel Sink", "Handmade 304 Sink", "Quartz Granite Sink"],
    "Vanity Cabinets & Mirrors": ["PVC Vanity Cabinets", "LED Smart Mirrors"],
    "Drain Covers & Accessories": ["Manhole Drain Covers", "CP Fittings & Couplings"]
};

const DEFAULT_CATEGORIES = Object.keys(DEFAULT_CATEGORY_TREE);

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
        pin: "1234",
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
        pin: "5678",
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
        pin: "1122",
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

const DEFAULT_SETTINGS = {
    adminWA: "919876543210",
    gstRate: 18,
    companyName: "Shree Ram Bathware",
    currencySymbol: "₹",
    allAsPerOrder: false
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

function initFirebaseSync() {
    try {
        if (typeof firebase === 'undefined') return;
        if (!state.settings || !state.settings.firebaseConfigJSON) return;
        
        let config;
        try {
            config = typeof state.settings.firebaseConfigJSON === 'string' 
                ? JSON.parse(state.settings.firebaseConfigJSON) 
                : state.settings.firebaseConfigJSON;
        } catch (err) {
            console.warn("Invalid Firebase Config JSON:", err);
            return;
        }
        
        if (!config || !config.apiKey || !config.databaseURL) {
            return;
        }
        
        if (!firebase.apps.length) {
            firebase.initializeApp(config);
        }
        window.firebaseDB = firebase.database();
        _firebaseInitialized = true;
        console.log("Firebase Realtime Cloud Database connected successfully!");

        // Realtime Listener across all India branches
        window.firebaseDB.ref("bms_state").on("value", (snapshot) => {
            const remoteVal = snapshot.val();
            if (remoteVal && typeof remoteVal === 'object' && Object.keys(remoteVal).length > 0) {
                _isSyncingFromRemote = true;
                state = remoteVal;
                try {
                    localStorage.setItem("bms_state", JSON.stringify(state));
                } catch(e) {}
                invalidatePerformanceCache();
                _isSyncingFromRemote = false;
                
                // Dispatch event or call active tab refresher
                window.dispatchEvent(new CustomEvent('bms_remote_sync', { detail: state }));
                if (typeof refreshCurrentTab === 'function') {
                    refreshCurrentTab();
                } else if (typeof renderDashboard === 'function') {
                    renderDashboard();
                }
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
        window.firebaseDB.ref("bms_state").set(state).catch(err => {
            console.warn("Cloud sync push error:", err);
        });
    } catch (e) {
        console.error("Error pushing state to Firebase:", e);
    }
}, 600);

function syncToCloud() {
    if (_isSyncingFromRemote) return;
    debouncedCloudPush();
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
                    if (!m.pin) m.pin = '1234';
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
                        state.merchants.push(dm);
                    }
                });
            }
            if (!state.orders) state.orders = [];
            if (!state.ledger) state.ledger = [];
            if (!state.settings) state.settings = { ...DEFAULT_SETTINGS };
            if (!state.homeBanners || state.homeBanners.length === 0) state.homeBanners = [...DEFAULT_HOME_BANNERS];
            if (!state.homeCategoryCards || state.homeCategoryCards.length === 0) state.homeCategoryCards = [...DEFAULT_HOME_CATEGORY_CARDS];
            if (!state.dealerRequests) state.dealerRequests = [];
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
    migrateProductCategories();
    invalidatePerformanceCache();
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
    const cacheKey = (merchant.id || merchant.name) + '_' + (merchant.orderCycleDays || 15) + '_' + (merchant.creditDays || 30);
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
    const totalBusiness = orders.reduce((sum, o) => sum + (o.totalBill || 0) + (o.totalCash || 0), 0);

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

    const payments = ledger.filter(l => (parseFloat(l.credit) || (l.txnType === 'Credit' ? (l.whiteAmount || 0) + (l.blackAmount || 0) : 0)) > 0);
    payments.sort((a, b) => (b.timestamp || parseDateToTs(b.date)) - (a.timestamp || parseDateToTs(a.date)));
    if (payments.length > 0) {
        lastPaymentDate = payments[0].date;
        const pTs = payments[0].timestamp || parseDateToTs(payments[0].date);
        if (pTs > 0) {
            daysSinceLastPayment = Math.max(0, Math.floor((Date.now() - pTs) / (1000 * 60 * 60 * 24)));
        }
    }

    ledger.forEach(l => {
        const isCredit = l.txnType === 'Credit';
        const dAmt = (parseFloat(l.debit) || (!isCredit ? (l.whiteAmount || 0) + (l.blackAmount || 0) : 0));
        const cAmt = (parseFloat(l.credit) || (isCredit ? (l.whiteAmount || 0) + (l.blackAmount || 0) : 0));
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
            const ordAmt = (ord.totalBill || 0) + (ord.totalCash || 0);
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

        // Full Bill (No Cash Split): Bill rate is 100% of price
        if (merchant.hideAmount || merchant.fullBill || merchant.isFullBill) {
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

function uploadProductImage(id) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = async (e) => {
        const files = Array.from(e.target.files).slice(0, 3); // max 3 photos
        if (files.length === 0) return;
        const p = state.products.find(x => x.id === id);
        if (!p) return;

        const loadedImages = [];
        for (let i = 0; i < files.length; i++) {
            const compressedBase64 = await compressImage(files[i], 800, 800, 0.7);
            loadedImages.push(compressedBase64);
        }
        
        p.imageBase64 = loadedImages[0];
        p.imagesBase64 = loadedImages;
        saveState();
        if (typeof renderStockTable === 'function') renderStockTable();
    };
    input.click();
}


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

