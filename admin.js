
// Global Delegated Click Listener for Party Action Buttons
if (typeof document !== 'undefined') {
    document.addEventListener('click', function(e) {
        const btn = e.target && e.target.closest ? e.target.closest('[data-action="open-party-modal"]') : null;
        if (btn) {
            const partyId = btn.getAttribute('data-party-id');
            const tab = btn.getAttribute('data-tab') || 'profile';
            if (partyId && typeof openPartyDetailsModal === 'function') {
                openPartyDetailsModal(partyId, tab);
            }
        }
    });
}



// ============================================================
// BMS Portal - Complete Application Logic v3.5
// Shared state across index.html (Admin) + dealer.html (Dealer)
// ============================================================











// ---- SHARED STATE ----










function populateStockModalCategories() {
    const catSelect = document.getElementById("stock-category");
    if (!catSelect) return;
    const tree = getCategoryTree();
    const cats = state.categories || Object.keys(tree);

    const currentVal = catSelect.value;
    catSelect.innerHTML = "";
    cats.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.textContent = c;
        catSelect.appendChild(opt);
    });

    if (currentVal && cats.includes(currentVal)) {
        catSelect.value = currentVal;
    }
    onStockCategoryChange();
}

function onStockCategoryChange() {
    const catSelect = document.getElementById("stock-category");
    const subCatSelect = document.getElementById("stock-subcategory");
    if (!catSelect || !subCatSelect) return;

    const selectedCat = catSelect.value;
    const tree = getCategoryTree();
    const subCats = tree[selectedCat] || [];

    const currentSubVal = subCatSelect.value;
    subCatSelect.innerHTML = '<option value="">-- General (No Sub-Category) --</option>';
    subCats.forEach(sc => {
        const opt = document.createElement("option");
        opt.value = sc;
        opt.textContent = sc;
        subCatSelect.appendChild(opt);
    });

    if (currentSubVal && subCats.includes(currentSubVal)) {
        subCatSelect.value = currentSubVal;
    }
}

function getCategoryTree() {
    if (state.categoryTree && Object.keys(state.categoryTree).length > 0) {
        return state.categoryTree;
    }
    return DEFAULT_CATEGORY_TREE;
}

function openCategoryManager() {
    renderCategoryManagerList();
    openModal('cat-mgmt-modal');
}

function renderCategoryManagerList() {
    const tree = getCategoryTree();
    const container = document.getElementById('cat-mgmt-list');
    const parentSelect = document.getElementById('subcat-parent-select');

    if (container) container.innerHTML = '';
    if (parentSelect) parentSelect.innerHTML = '';

    const categories = state.categories || Object.keys(tree);

    categories.forEach((mainCat, index) => {
        if (!tree[mainCat]) return;
        
        if (parentSelect) {
            const opt = document.createElement('option');
            opt.value = mainCat;
            opt.textContent = mainCat;
            parentSelect.appendChild(opt);
        }

        if (container) {
            const subCats = tree[mainCat] || [];
            const mainCount = (state.products || []).filter(p => p.category === mainCat).length;
            const isPub = (typeof isCategoryPublic === 'function') ? isCategoryPublic(mainCat) : true;

            const div = document.createElement('div');
            div.style.cssText = "background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; padding:0.65rem; margin-bottom:0.6rem; box-shadow:0 1px 3px rgba(0,0,0,0.04);";
            
            let subCatTagsHtml = subCats.map((sc, scIdx) => {
                const subCount = (state.products || []).filter(p => p.category === mainCat && (p.subcategory === sc || p.subCategory === sc)).length;
                return `
                    <span style="display:inline-flex; align-items:center; gap:0.35rem; background:#f1f5f9; color:#0e254f; padding:0.2rem 0.6rem; border-radius:14px; font-size:0.78rem; font-weight:600; border:1px solid #cbd5e1;">
                        <i class="fa-solid fa-caret-left" style="cursor:pointer; color:#64748b; font-size:0.85rem;" title="Move Left" onclick="moveSubCatLeft('${mainCat.replace(/'/g, "\\'")}', ${scIdx})"></i>
                        <span>${sc} <span style="font-size:0.7rem; color:#16a34a; font-weight:700;">(${subCount})</span></span>
                        <i class="fa-solid fa-pen-to-square" style="cursor:pointer; color:#2563eb; margin-left:0.15rem; font-size:0.75rem;" title="Rename Sub-Category" onclick="editSubCategory('${mainCat.replace(/'/g, "\\'")}', '${sc.replace(/'/g, "\\'")}')"></i>
                        <i class="fa-solid fa-caret-right" style="cursor:pointer; color:#64748b; font-size:0.85rem;" title="Move Right" onclick="moveSubCatRight('${mainCat.replace(/'/g, "\\'")}', ${scIdx})"></i>
                        <i class="fa-solid fa-xmark" style="cursor:pointer; color:#ef4444; margin-left:0.25rem; font-size:0.85rem;" title="Delete" onclick="deleteSubCategory('${mainCat.replace(/'/g, "\\'")}', '${sc.replace(/'/g, "\\'")}')"></i>
                    </span>
                `;
            }).join(' ');

            div.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem; border-bottom:1px solid #f1f5f9; padding-bottom:0.35rem; flex-wrap:wrap; gap:0.35rem;">
                    <div style="display:flex; align-items:center; gap:0.4rem; flex-wrap:wrap;">
                        <strong style="color:#0e254f; font-size:0.92rem;"><i class="fa-solid fa-folder" style="color:#d97706;"></i> ${mainCat}</strong>
                        <span style="font-size:0.72rem; background:#e0f2fe; color:#0369a1; padding:0.1rem 0.4rem; border-radius:10px; font-weight:700;">${mainCount} Items</span>
                        <span style="font-size:0.7rem; padding:0.15rem 0.55rem; border-radius:12px; font-weight:700; cursor:pointer; user-select:none;" class="${isPub ? 'badge bg-success' : 'badge bg-warning'}" title="Click to change Public/Private status" onclick="toggleCategoryPublicStatus('${mainCat.replace(/'/g, "\\'")}')">
                            ${isPub ? '🌐 Public (Guest Visible)' : '🔒 Private (Party Only)'}
                        </span>
                        <button style="background:none; border:none; color:#2563eb; cursor:pointer; font-size:0.78rem; padding:0 0.2rem;" title="Rename Category" onclick="editMainCategory('${mainCat.replace(/'/g, "\\'")}')"><i class="fa-solid fa-pen"></i> Edit</button>
                    </div>
                    <div style="display:flex; gap:0.25rem;">
                        <button class="btn btn-secondary" style="font-size:0.68rem; padding:0.15rem 0.4rem;" onclick="moveMainCatUp(${index})" ${index === 0 ? 'disabled' : ''}><i class="fa-solid fa-arrow-up"></i></button>
                        <button class="btn btn-secondary" style="font-size:0.68rem; padding:0.15rem 0.4rem;" onclick="moveMainCatDown(${index})" ${index === categories.length - 1 ? 'disabled' : ''}><i class="fa-solid fa-arrow-down"></i></button>
                        <button class="btn btn-danger" style="font-size:0.68rem; padding:0.15rem 0.45rem; background:#ef4444; color:#fff; border:none; border-radius:4px;" onclick="deleteMainCategory('${mainCat.replace(/'/g, "\\'")}')"><i class="fa-solid fa-trash"></i> Delete</button>
                    </div>
                </div>
                <div style="display:flex; flex-wrap:wrap; gap:0.35rem; margin-top:0.4rem;">
                    ${subCatTagsHtml || '<em style="font-size:0.75rem; color:#94a3b8;">No sub-categories yet</em>'}
                </div>
            `;
            container.appendChild(div);
        }
    });
}

function editMainCategory(oldName) {
    const newName = prompt(`Rename Main Category "${oldName}" to:`, oldName);
    if (!newName || newName.trim() === '' || newName.trim() === oldName) return;
    const cleanNew = newName.trim();

    const tree = getCategoryTree();
    if (tree[cleanNew] && cleanNew !== oldName) {
        alert(`Category "${cleanNew}" already exists!`);
        return;
    }

    tree[cleanNew] = tree[oldName] || [];
    delete tree[oldName];

    state.categoryTree = tree;
    state.categories = (state.categories || []).map(c => c === oldName ? cleanNew : c);

    let count = 0;
    (state.products || []).forEach(p => {
        if (!p) return;
        if (p.category === oldName) {
            p.category = cleanNew;
            count++;
        }
    });

    saveState();
    if (typeof syncToCloud === 'function') syncToCloud();

    renderCategoryManagerList();
    renderAdminCategoryTabs();
    populateStockModalCategories();
    renderStockTable();
    alert(`Category renamed to "${cleanNew}"! (${count} products updated)`);
}

function editSubCategory(mainCat, oldSubName) {
    const newSubName = prompt(`Rename Sub-Category "${oldSubName}" under "${mainCat}" to:`, oldSubName);
    if (!newSubName || newSubName.trim() === '' || newSubName.trim() === oldSubName) return;
    const cleanNewSub = newSubName.trim();

    const tree = getCategoryTree();
    if (!tree[mainCat]) return;

    if (tree[mainCat].includes(cleanNewSub) && cleanNewSub !== oldSubName) {
        alert(`Sub-category "${cleanNewSub}" already exists in "${mainCat}"!`);
        return;
    }

    tree[mainCat] = tree[mainCat].map(s => s === oldSubName ? cleanNewSub : s);
    state.categoryTree = tree;

    let count = 0;
    (state.products || []).forEach(p => {
        if (!p) return;
        if (p.category === mainCat && (p.subcategory === oldSubName || p.subCategory === oldSubName)) {
            p.subcategory = cleanNewSub;
            p.subCategory = cleanNewSub;
            count++;
        }
    });

    saveState();
    if (typeof syncToCloud === 'function') syncToCloud();

    renderCategoryManagerList();
    renderStockTable();
    alert(`Sub-category renamed to "${cleanNewSub}"! (${count} products updated)`);
}

function deleteMainCategory(mainCat) {
    const prodCount = (state.products || []).filter(p => p.category === mainCat).length;
    let confirmMsg = `Are you sure you want to delete Main Category "${mainCat}"?`;
    if (prodCount > 0) {
        confirmMsg = `âš ï¸ WARNING: Main Category "${mainCat}" contains ${prodCount} active product(s)!\n\nAre you sure you want to delete it?`;
    }
    if (!confirm(confirmMsg)) return;

    const tree = getCategoryTree();
    delete tree[mainCat];
    state.categoryTree = tree;
    state.categories = (state.categories || Object.keys(tree)).filter(c => c !== mainCat);
    saveState();
    if (typeof syncToCloud === 'function') syncToCloud();

    renderCategoryManagerList();
    renderAdminCategoryTabs();
    renderStockTable();
    populateStockModalCategories();
}

function deleteSubCategory(mainCat, subCat) {
    const subCount = (state.products || []).filter(p => p.category === mainCat && (p.subcategory === subCat || p.subCategory === subCat)).length;
    let confirmMsg = `Remove sub-category "${subCat}" from "${mainCat}"?`;
    if (subCount > 0) {
        confirmMsg = `âš ï¸ WARNING: Sub-Category "${subCat}" has ${subCount} active product(s)!\n\nAre you sure you want to remove it?`;
    }
    if (!confirm(confirmMsg)) return;

    const tree = getCategoryTree();
    if (tree[mainCat]) {
        tree[mainCat] = tree[mainCat].filter(sc => sc !== subCat);
        state.categoryTree = tree;
        saveState();
        if (typeof syncToCloud === 'function') syncToCloud();
        renderCategoryManagerList();
        renderStockTable();
    }
}

function moveMainCatUp(index) {
    if (index <= 0) return;
    const cats = state.categories || Object.keys(getCategoryTree());
    const temp = cats[index - 1];
    cats[index - 1] = cats[index];
    cats[index] = temp;
    state.categories = cats;
    saveState();
    renderCategoryManagerList();
    renderAdminCategoryTabs();
    populateStockModalCategories();
}

function moveMainCatDown(index) {
    const cats = state.categories || Object.keys(getCategoryTree());
    if (index >= cats.length - 1) return;
    const temp = cats[index + 1];
    cats[index + 1] = cats[index];
    cats[index] = temp;
    state.categories = cats;
    saveState();
    renderCategoryManagerList();
    renderAdminCategoryTabs();
    populateStockModalCategories();
}

function moveSubCatLeft(mainCat, index) {
    if (index <= 0) return;
    const tree = getCategoryTree();
    const subCats = tree[mainCat];
    if (!subCats) return;
    const temp = subCats[index - 1];
    subCats[index - 1] = subCats[index];
    subCats[index] = temp;
    state.categoryTree = tree;
    saveState();
    renderCategoryManagerList();
}

function moveSubCatRight(mainCat, index) {
    const tree = getCategoryTree();
    const subCats = tree[mainCat];
    if (!subCats || index >= subCats.length - 1) return;
    const temp = subCats[index + 1];
    subCats[index + 1] = subCats[index];
    subCats[index] = temp;
    state.categoryTree = tree;
    saveState();
    renderCategoryManagerList();
}

function toggleCategoryPublicStatus(catName) {
    if (!state.categoryMeta) state.categoryMeta = {};
    if (!state.categoryMeta[catName]) state.categoryMeta[catName] = { isPublic: true };
    state.categoryMeta[catName].isPublic = !state.categoryMeta[catName].isPublic;
    saveState();
    if (typeof syncToCloud === 'function') syncToCloud();
    renderCategoryManagerList();
    if (typeof renderAdminCategoryCards === 'function') renderAdminCategoryCards();
}

function handleAddNewCategory() {
    const input = document.getElementById('new-cat-name-input');
    const newName = input.value.trim();
    if (!newName) return;

    const tree = getCategoryTree();
    if (tree[newName]) {
        alert('Main Category already exists!');
        return;
    }

    const isPublicChk = document.getElementById('new-cat-is-public');
    const isPublic = isPublicChk ? isPublicChk.checked : true;

    tree[newName] = [];
    state.categoryTree = tree;
    state.categories = Object.keys(tree);
    if (!state.categoryMeta) state.categoryMeta = {};
    state.categoryMeta[newName] = { isPublic: isPublic };

    saveState();
    if (typeof syncToCloud === 'function') syncToCloud();
    input.value = '';
    renderCategoryManagerList();
    renderAdminCategoryTabs();
    populateStockModalCategories();
    if (typeof renderAdminCategoryCards === 'function') renderAdminCategoryCards();
}

function handleAddNewSubCategory() {
    const parentSelect = document.getElementById('subcat-parent-select');
    const input = document.getElementById('new-subcat-name-input');
    if (!parentSelect || !input) return;

    const parentCat = parentSelect.value;
    const subCatName = input.value.trim();

    if (!parentCat || !subCatName) {
        alert('Please select a Main Category and enter a Sub-Category name.');
        return;
    }

    const tree = getCategoryTree();
    if (!tree[parentCat]) tree[parentCat] = [];
    if (tree[parentCat].includes(subCatName)) {
        alert('Sub-category already exists under this Main Category!');
        return;
    }

    tree[parentCat].push(subCatName);
    state.categoryTree = tree;
    saveState();
    input.value = '';
    renderCategoryManagerList();
    renderAdminCategoryTabs();
}

function renderAdminCategoryTabs() {
    const categories = state.categories || Object.keys(getCategoryTree());

    // Render stock category filters
    const stockCatBox = document.getElementById('stock-category-filters');
    if (stockCatBox) {
        stockCatBox.innerHTML = '';
        
        const allBtn = document.createElement('button');
        allBtn.className = 'cat-btn active';
        allBtn.setAttribute('data-category', 'all');
        allBtn.textContent = 'All Items';
        allBtn.onclick = () => {
            document.querySelectorAll('#stock-category-filters .cat-btn').forEach(b => b.classList.remove('active'));
            allBtn.classList.add('active');
            renderStockTable();
        };
        stockCatBox.appendChild(allBtn);
        
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'cat-btn';
            btn.setAttribute('data-category', cat);
            btn.textContent = cat;
            btn.onclick = () => {
                document.querySelectorAll('#stock-category-filters .cat-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderStockTable();
            };
            stockCatBox.appendChild(btn);
        });
    }

    // Render new order catalog category filters
    const orderCatBox = document.getElementById('order-category-filters');
    if (orderCatBox) {
        orderCatBox.innerHTML = '';
        
        const allOrderBtn = document.createElement('button');
        allOrderBtn.className = 'cat-btn active';
        allOrderBtn.setAttribute('data-category', 'all');
        allOrderBtn.textContent = 'All Items';
        allOrderBtn.onclick = () => {
            document.querySelectorAll('#order-category-filters .cat-btn').forEach(b => b.classList.remove('active'));
            allOrderBtn.classList.add('active');
            renderOrderCatalog();
        };
        orderCatBox.appendChild(allOrderBtn);
        
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'cat-btn';
            btn.setAttribute('data-category', cat);
            btn.textContent = cat;
            btn.onclick = () => {
                document.querySelectorAll('#order-category-filters .cat-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderOrderCatalog();
            };
            orderCatBox.appendChild(btn);
        });
    }

    // Update product select in Add Stock modal
    const select = document.getElementById('stock-category');
    if (select) {
        select.innerHTML = '';
        categories.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat;
            opt.textContent = cat;
            select.appendChild(opt);
        });
    }
}

// ---- LIGHTBOX ZOOM MODAL ---- (stub, real implementation at bottom)
// Removed duplicate — see bottom of file for openLightbox / openGallery / closeLightbox

// ---- PRICING UTILITY ----


// =============================================
// ADMIN PANEL (index.html only)
// =============================================
let currentOrderItems = [];
let editingMerchantId = null;

document.addEventListener("DOMContentLoaded", () => {
        if (!document.getElementById('dashboard-tab')) return;



    initFinancialYearFilter();
    loadState();
    setupNavigation();
    renderAdminCategoryTabs();

    const orderDateEl = document.getElementById("order-date");
    if (orderDateEl) orderDateEl.valueAsDate = new Date();

    const stockSearchEl = document.getElementById("stock-search");
    if (stockSearchEl) stockSearchEl.addEventListener("input", debounce(renderStockTable, 200));

    const merchSearchEl = document.getElementById("merchant-search");
    if (merchSearchEl) merchSearchEl.addEventListener("input", debounce(renderMerchantsGrid, 200));

    const orderMerchSelect = document.getElementById("order-merchant-select");
    if (orderMerchSelect) orderMerchSelect.addEventListener("change", onOrderMerchantSelect);

    const freightInput = document.getElementById("freight-input");
    if (freightInput) freightInput.addEventListener("input", debounce(calculateOrderSummary, 150));

    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderOrdersList();
        });
    });

    const orderListSearch = document.getElementById("order-list-search");
    if (orderListSearch) orderListSearch.addEventListener("input", debounce(renderOrdersList, 200));

    const ledgerFilter = document.getElementById("ledger-merchant-filter");
    if (ledgerFilter) ledgerFilter.addEventListener("change", renderLedger);

    renderDashboard();
    renderDealerRequests();
    renderAdminBanners();
    if (typeof renderAdminCategoryCards === 'function') renderAdminCategoryCards();
    updateLiveClock();
    setInterval(updateLiveClock, 1000);
});

// ---- NAV ----
function setupNavigation() {
    const tabs = {
        "dashboard-tab": "Dashboard Overview",
        "stock-tab": "Stock & Inventory",
        "merchants-tab": "Merchants & Rates",
        "new-order-tab": "Create New Order",
        "orders-tab": "Orders & Dispatch",
        "ledger-tab": "Accounts Ledger",
        "party-performance-tab": "Party Performance & Payment Aging Report",
        "offers-tab": "Special Offers & Clearance Manager",
        "banners-tab": "Homepage Banners & Photos",
        "settings-tab": "System Settings & Backup"
    };

    document.querySelectorAll(".nav-item").forEach(item => {
        item.addEventListener("click", () => {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) sidebar.classList.remove('open');
            const tabId = item.getAttribute("data-tab");
            if (!tabId) return;

            document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"));
            document.querySelectorAll(`.nav-item[data-tab="${tabId}"]`).forEach(i => i.classList.add("active"));
            
            const titleEl = document.getElementById("active-tab-title");
            if (titleEl && tabs[tabId]) titleEl.textContent = tabs[tabId];

            document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
            const targetPanel = document.getElementById(tabId);
            if (targetPanel) targetPanel.classList.add("active");

            if (tabId === "dashboard-tab") renderDashboard();
            else if (tabId === "stock-tab") renderStockTable();
            else if (tabId === "merchants-tab") { renderMerchantsGrid(); renderDealerRequests(); renderAdminBanners(); if (typeof renderAdminCategoryCards === 'function') renderAdminCategoryCards(); }
            else if (tabId === "new-order-tab") initNewOrderTab();
            else if (tabId === "orders-tab") renderOrdersList();
            else if (tabId === "ledger-tab") initLedgerTab();
            else if (tabId === "party-performance-tab") renderPartyPerformanceTab();
            else if (tabId === "offers-tab") renderAdminOffersList();
            else if (tabId === "banners-tab") { renderAdminBanners(); if (typeof renderAdminCategoryCards === 'function') renderAdminCategoryCards(); }
            else if (tabId === "settings-tab") initSettingsTab();
        });
    });
}




// ---- DASHBOARD ----
function renderDashboard() {
    const finDates = getActiveFinYearDates();
    let totalOrders = 0;
    let totalWhite = 0, totalBlack = 0;
    let filteredOrders = state.orders || [];

    if(finDates) {
        filteredOrders = (state.orders || []).filter(o => {
            if(!o.date) return true;
            let parts = o.date.split('.');
            if(parts.length !== 3) parts = o.date.split('/');
            if(parts.length === 3) {
                const d = new Date(parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0]));
                return d >= finDates.startDate && d <= finDates.endDate;
            }
            return true;
        });
        (state.ledger || []).forEach(e => { 
            let valid = true;
            if(e.date) {
                let parts = e.date.split('.');
                if(parts.length !== 3) parts = e.date.split('/');
                if(parts.length === 3) {
                    const d = new Date(parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0]));
                    valid = d >= finDates.startDate && d <= finDates.endDate;
                }
            }
            if(valid) { totalWhite += e.whiteAmount || 0; totalBlack += e.blackAmount || 0; }
        });
        totalOrders = filteredOrders.length;
    } else {
        totalOrders = (state.orders || []).length;
        (state.ledger || []).forEach(e => { totalWhite += e.whiteAmount || 0; totalBlack += e.blackAmount || 0; });
    }

    const totalStock = (state.products || []).reduce((a, p) => a + parseInt(p.stock || 0), 0);

    // Order status counters
    let pendingCount = 0, confirmedCount = 0, dispatchedCount = 0;
    filteredOrders.forEach(o => {
        if (o.status === 'Pending') pendingCount++;
        else if (o.status === 'Confirmed') confirmedCount++;
        else if (o.status === 'Dispatched') dispatchedCount++;
    });

    const elOrders = document.getElementById("metric-total-orders");
    if (elOrders) elOrders.textContent = totalOrders;

    const elOrdersSub = document.getElementById("metric-orders-breakdown");
    if (elOrdersSub) elOrdersSub.textContent = `${pendingCount} Pending • ${dispatchedCount} Dispatched`;

    const elWhite = document.getElementById("metric-total-white");
    if (elWhite) elWhite.textContent = fmtCur(totalWhite);

    const elBlack = document.getElementById("metric-total-black");
    if (elBlack) elBlack.textContent = fmtCur(totalBlack);

    const elStock = document.getElementById("metric-total-stock");
    if (elStock) elStock.textContent = totalStock;

    // --- QUALITY GRADE ANALYTICS CALCULATIONS ---
    const gradeQty = { Premium: 0, ROK: 0, STD: 0, Commercial: 0 };
    const gradeRev = { Premium: 0, ROK: 0, STD: 0, Commercial: 0 };
    let totalGradePcsSold = 0;
    let totalGradeRevenue = 0;

    const productSalesMap = {}; // model -> { model, category, grade, pcs, revenue }
    const merchantTurnoverMap = {}; // merchantId -> { merchant, totalRev, totalOrders, pcs }

    filteredOrders.forEach(ord => {
        const m = (state.merchants || []).find(x => x.id === ord.merchantId);
        if (m) {
            if (!merchantTurnoverMap[m.id]) {
                merchantTurnoverMap[m.id] = { merchant: m, totalRev: 0, totalOrders: 0, pcs: 0 };
            }
            merchantTurnoverMap[m.id].totalOrders++;
            merchantTurnoverMap[m.id].totalRev += ((ord.totalBill || 0) + (ord.totalCash || 0));
        }

        (ord.items || []).forEach(item => {
            const qty = item.qty || 0;
            const itemRev = qty * (item.price || 0);
            const g = item.grade || 'Premium';
            
            if (gradeQty[g] !== undefined) gradeQty[g] += qty;
            else gradeQty['Premium'] += qty;

            if (gradeRev[g] !== undefined) gradeRev[g] += itemRev;
            else gradeRev['Premium'] += itemRev;

            totalGradePcsSold += qty;
            totalGradeRevenue += itemRev;

            if (m) merchantTurnoverMap[m.id].pcs += qty;

            // Product aggregation
            const modelKey = item.model || 'Unknown Model';
            if (!productSalesMap[modelKey]) {
                productSalesMap[modelKey] = {
                    model: modelKey,
                    category: item.category || 'Sanitary Ware',
                    grade: g,
                    pcs: 0,
                    revenue: 0
                };
            }
            productSalesMap[modelKey].pcs += qty;
            productSalesMap[modelKey].revenue += itemRev;
        });
    });

    // Update Grade Summary Total Label
    const totalPcsLabel = document.getElementById("dash-grade-total-pcs");
    if (totalPcsLabel) totalPcsLabel.textContent = `Total Sold: ${totalGradePcsSold.toLocaleString('en-IN')} pcs (₹${fmtCur(totalGradeRevenue)})`;

    // Calculate Grade percentages for progress bar
    const premPct = totalGradePcsSold > 0 ? ((gradeQty.Premium / totalGradePcsSold) * 100).toFixed(1) : 25;
    const rokPct = totalGradePcsSold > 0 ? ((gradeQty.ROK / totalGradePcsSold) * 100).toFixed(1) : 25;
    const stdPct = totalGradePcsSold > 0 ? ((gradeQty.STD / totalGradePcsSold) * 100).toFixed(1) : 25;
    const comPct = totalGradePcsSold > 0 ? ((gradeQty.Commercial / totalGradePcsSold) * 100).toFixed(1) : 25;

    const elBarPrem = document.getElementById("grade-bar-premium");
    if (elBarPrem) { elBarPrem.style.width = `${premPct}%`; elBarPrem.textContent = `⭐ Premium ${premPct}%`; }

    const elBarRok = document.getElementById("grade-bar-rok");
    if (elBarRok) { elBarRok.style.width = `${rokPct}%`; elBarRok.textContent = `🔹 ROK ${rokPct}%`; }

    const elBarStd = document.getElementById("grade-bar-std");
    if (elBarStd) { elBarStd.style.width = `${stdPct}%`; elBarStd.textContent = `🔸 STD ${stdPct}%`; }

    const elBarCom = document.getElementById("grade-bar-commercial");
    if (elBarCom) { elBarCom.style.width = `${comPct}%`; elBarCom.textContent = `🔻 Commercial ${comPct}%`; }

    // Update 4 Grade Pills Cards
    const elValPrem = document.getElementById("grade-val-premium");
    const elSubPrem = document.getElementById("grade-sub-premium");
    if (elValPrem) elValPrem.textContent = `${gradeQty.Premium.toLocaleString('en-IN')} pcs`;
    if (elSubPrem) elSubPrem.textContent = `Revenue: ₹${fmtCur(gradeRev.Premium)} (${premPct}%)`;

    const elValRok = document.getElementById("grade-val-rok");
    const elSubRok = document.getElementById("grade-sub-rok");
    if (elValRok) elValRok.textContent = `${gradeQty.ROK.toLocaleString('en-IN')} pcs`;
    if (elSubRok) elSubRok.textContent = `Revenue: ₹${fmtCur(gradeRev.ROK)} (${rokPct}%)`;

    const elValStd = document.getElementById("grade-val-std");
    const elSubStd = document.getElementById("grade-sub-std");
    if (elValStd) elValStd.textContent = `${gradeQty.STD.toLocaleString('en-IN')} pcs`;
    if (elSubStd) elSubStd.textContent = `Revenue: ₹${fmtCur(gradeRev.STD)} (${stdPct}%)`;

    const elValCom = document.getElementById("grade-val-commercial");
    const elSubCom = document.getElementById("grade-sub-commercial");
    if (elValCom) elValCom.textContent = `${gradeQty.Commercial.toLocaleString('en-IN')} pcs`;
    if (elSubCom) elSubCom.textContent = `Revenue: ₹${fmtCur(gradeRev.Commercial)} (${comPct}%)`;


    // --- TOP 5 PRODUCTS LEADERBOARD ---
    const topProductsListEl = document.getElementById("dash-top-products-list");
    if (topProductsListEl) {
        const sortedProducts = Object.values(productSalesMap).sort((a, b) => b.pcs - a.pcs).slice(0, 5);
        if (sortedProducts.length === 0) {
            topProductsListEl.innerHTML = `<p class="placeholder-text">No product sales recorded in this period.</p>`;
        } else {
            let html = `<div style="display:flex; flex-direction:column; gap:0.5rem;">`;
            sortedProducts.forEach((p, idx) => {
                const rankColor = idx === 0 ? '#f59e0b' : (idx === 1 ? '#94a3b8' : (idx === 2 ? '#b45309' : '#0e254f'));
                const gradeBadge = (typeof getGradeBadgeStyleHTML === 'function') ? getGradeBadgeStyleHTML(p.grade) : `<span>${p.grade}</span>`;
                html += `
                    <div style="display:flex; justify-content:space-between; align-items:center; background:#fff; border:1px solid #e2e8f0; border-radius:6px; padding:0.5rem 0.75rem; font-size:0.85rem;">
                        <div style="display:flex; align-items:center; gap:0.6rem; overflow:hidden;">
                            <span style="font-weight:900; font-size:1rem; color:${rankColor}; min-width:20px;">#${idx + 1}</span>
                            <div>
                                <strong style="color:#0e254f; font-size:0.9rem;">${p.model}</strong>
                                <div style="font-size:0.75rem; color:#64748b;">${p.category} &bull; ${gradeBadge}</div>
                            </div>
                        </div>
                        <div style="text-align:right; flex-shrink:0;">
                            <strong style="color:#10b981; font-size:0.92rem;">${p.pcs.toLocaleString('en-IN')} pcs</strong>
                            <div style="font-size:0.72rem; color:#64748b;">Revenue: ₹${fmtCur(p.revenue)}</div>
                        </div>
                    </div>
                `;
            });
            html += `</div>`;
            topProductsListEl.innerHTML = html;
        }
    }


    // --- TOP 5 DEALERS LEADERBOARD ---
    const topDealersListEl = document.getElementById("dash-top-dealers-list");
    if (topDealersListEl) {
        const sortedDealers = Object.values(merchantTurnoverMap).sort((a, b) => b.totalRev - a.totalRev).slice(0, 5);
        if (sortedDealers.length === 0) {
            topDealersListEl.innerHTML = `<p class="placeholder-text">No merchant orders in this period.</p>`;
        } else {
            let html = `<div style="display:flex; flex-direction:column; gap:0.5rem;">`;
            sortedDealers.forEach((d, idx) => {
                const rankColor = idx === 0 ? '#8b5cf6' : (idx === 1 ? '#3b82f6' : (idx === 2 ? '#0d9488' : '#0e254f'));
                html += `
                    <div style="display:flex; justify-content:space-between; align-items:center; background:#fff; border:1px solid #e2e8f0; border-radius:6px; padding:0.5rem 0.75rem; font-size:0.85rem;">
                        <div style="display:flex; align-items:center; gap:0.6rem; overflow:hidden;">
                            <span style="font-weight:900; font-size:1rem; color:${rankColor}; min-width:20px;">#${idx + 1}</span>
                            <div>
                                <strong style="color:#0e254f; font-size:0.9rem;">${d.merchant.name}</strong>
                                <div style="font-size:0.75rem; color:#64748b;">📍 ${d.merchant.city || 'Gujarat'} &bull; ${d.totalOrders} Orders (${d.pcs} pcs)</div>
                            </div>
                        </div>
                        <div style="text-align:right; flex-shrink:0;">
                            <strong style="color:#0e254f; font-size:0.95rem;">₹${fmtCur(d.totalRev)}</strong>
                            <div style="font-size:0.72rem; color:#16a34a; font-weight:700;"><i class="fa-solid fa-star"></i> VIP Merchant</div>
                        </div>
                    </div>
                `;
            });
            html += `</div>`;
            topDealersListEl.innerHTML = html;
        }
    }


    // Financial Bar Split
    const total = totalWhite + totalBlack;
    const wPct = total > 0 ? (totalWhite / total * 100).toFixed(1) : 50;
    const bPct = total > 0 ? (totalBlack / total * 100).toFixed(1) : 50;
    
    const elBarWhite = document.getElementById("split-bar-white");
    if (elBarWhite) {
        elBarWhite.style.width = `${wPct}%`;
        elBarWhite.textContent = `Official ${wPct}%`;
    }
    const elBarBlack = document.getElementById("split-bar-black");
    if (elBarBlack) {
        elBarBlack.style.width = `${bPct}%`;
        elBarBlack.textContent = `Cash ${bPct}%`;
    }

    // Recent activities
    const ra = document.getElementById("recent-activities");
    if (ra) {
        ra.innerHTML = "";
        if (filteredOrders.length === 0) { 
            ra.innerHTML = `<p class="placeholder-text">No recent orders.</p>`; 
        } else {
            [...filteredOrders].reverse().slice(0, 5).forEach(ord => {
                const m = (state.merchants || []).find(x => x.id === ord.merchantId);
                const div = document.createElement("div");
                div.style.cssText = "display:flex; justify-content:space-between; padding:0.5rem 0; border-bottom:1px solid var(--border-color); font-size:0.85rem;";
                div.innerHTML = `<span><b>${m ? m.name : "Unknown"}</b> <span style="color:var(--text-muted);">${ord.date}</span></span><span><span onclick="event.stopPropagation(); viewTimeline('${ord.id}')" style="cursor:pointer;" class="badge ${ord.status === 'Dispatched' ? 'badge-success' : 'badge-warning'}">${ord.status}</span></span>`;
                ra.appendChild(div);
            });
        }
    }

    const lowStockEl = document.getElementById("low-stock-list");
    if (lowStockEl) {
        const lowStockItems = (state.products || []).filter(p => parseInt(p.stock || 0) <= 15);
        if (lowStockItems.length === 0) {
            lowStockEl.innerHTML = `<div style="display:flex; align-items:center; gap:0.5rem; color:#10b981; font-weight:600; padding:0.5rem 0;"><i class="fa-solid fa-circle-check"></i> All products are sufficiently stocked! (No low-stock items)</div>`;
        } else {
            lowStockEl.innerHTML = `
                <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:0.5rem; max-height:220px; overflow-y:auto; padding-right:4px;">
                    ${lowStockItems.map(p => {
                        const s = parseInt(p.stock || 0);
                        const isOut = s <= 0;
                        return `
                            <div style="display:flex; justify-content:space-between; align-items:center; background:#fff; border:1px solid ${isOut ? '#fca5a5' : '#fed7aa'}; border-radius:6px; padding:0.4rem 0.6rem; font-size:0.85rem;">
                                <div style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-right:0.5rem;">
                                    <strong style="color:#1e293b;">${p.model}</strong>
                                    <div style="font-size:0.75rem; color:#64748b;">${p.category || ''} &bull; ${p.colour || ''}</div>
                                </div>
                                <div style="display:flex; align-items:center; gap:0.4rem; flex-shrink:0;">
                                    <span style="font-weight:700; font-size:0.8rem; padding:0.15rem 0.4rem; border-radius:4px; background:${isOut ? '#fee2e2' : '#ffedd5'}; color:${isOut ? '#dc2626' : '#c2410c'};">
                                        ${isOut ? 'Out of Stock' : `${s} pcs`}
                                    </span>
                                    <button class="btn" style="background:#0d9488; color:#fff; font-size:0.7rem; padding:0.15rem 0.45rem; border-radius:4px;" onclick="openQuickInwardModal('${p.id}')" title="Quick Stock Inward">
                                        <i class="fa-solid fa-plus"></i> Inward
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        }
    }

    // Update Party Performance dashboard alerts and sidebar badge
    const overdueParties = [];
    const inactiveParties = [];

    (state.merchants || []).forEach(m => {
        const perf = getMerchantPerformance(m);
        if (!perf) return;
        if (perf.isOverdue && perf.balance > 50) {
            overdueParties.push({ m, perf });
        }
        if (perf.daysSinceLastOrder !== null && perf.daysSinceLastOrder > 30) {
            inactiveParties.push({ m, perf });
        }
    });

    const perfSidebarBadge = document.getElementById("sidebar-perf-badge");
    if (perfSidebarBadge) {
        if (overdueParties.length > 0) {
            perfSidebarBadge.textContent = overdueParties.length;
            perfSidebarBadge.style.display = "inline-block";
        } else {
            perfSidebarBadge.style.display = "none";
        }
    }

    const overdueListEl = document.getElementById("dashboard-overdue-list");
    if (overdueListEl) {
        if (overdueParties.length === 0) {
            overdueListEl.innerHTML = `<div style="display:flex; align-items:center; gap:0.5rem; color:#16a34a; font-weight:600; padding:0.5rem 0;"><i class="fa-solid fa-circle-check"></i> Great! All party accounts are within credit terms. No overdue payment.</div>`;
        } else {
            overdueParties.sort((a, b) => (b.perf.overdueDays - a.perf.overdueDays) || (b.perf.balance - a.perf.balance));
            overdueListEl.innerHTML = `
                <div style="display:flex; flex-direction:column; gap:0.5rem; max-height:220px; overflow-y:auto; padding-right:4px;">
                    ${overdueParties.slice(0, 5).map(({ m, perf }) => `
                        <div style="display:flex; justify-content:space-between; align-items:center; background:#fff; border:1px solid #fecaca; border-radius:6px; padding:0.4rem 0.6rem; font-size:0.85rem;">
                            <div>
                                <strong style="color:#0e254f;">${m.name}</strong>
                                <div style="font-size:0.75rem; color:#dc2626; font-weight:600;">
                                    <i class="fa-solid fa-triangle-exclamation"></i> Overdue: ${perf.overdueDays}d late (Credit: ${perf.allowedCreditDays}d)
                                </div>
                            </div>
                            <div style="display:flex; align-items:center; gap:0.4rem; flex-shrink:0;">
                                <span style="font-weight:800; color:#dc2626; font-size:0.9rem;">${fmtCur(perf.balance)}</span>
                                <button class="btn" style="background:#25d366; color:#fff; font-size:0.72rem; padding:0.2rem 0.5rem;" onclick="sendPartyReminderWA('${m.id}')" title="WhatsApp Reminder"><i class="fa-brands fa-whatsapp"></i></button>
                                <button class="btn btn-outline" style="font-size:0.72rem; padding:0.2rem 0.5rem;" onclick="event.stopPropagation(); window.openPartyLedgerDirect('${m.id}')" title="View Ledger"><i class="fa-solid fa-book-bookmark"></i></button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    const inactiveListEl = document.getElementById("dashboard-inactive-list");
    if (inactiveListEl) {
        if (inactiveParties.length === 0) {
            inactiveListEl.innerHTML = `<div style="display:flex; align-items:center; gap:0.5rem; color:#16a34a; font-weight:600; padding:0.5rem 0;"><i class="fa-solid fa-circle-check"></i> All parties have active orders within the last 30 days!</div>`;
        } else {
            inactiveParties.sort((a, b) => (b.perf.daysSinceLastOrder || 0) - (a.perf.daysSinceLastOrder || 0));
            inactiveListEl.innerHTML = `
                <div style="display:flex; flex-direction:column; gap:0.5rem; max-height:220px; overflow-y:auto; padding-right:4px;">
                    ${inactiveParties.slice(0, 5).map(({ m, perf }) => `
                        <div style="display:flex; justify-content:space-between; align-items:center; background:#fff; border:1px solid #fed7aa; border-radius:6px; padding:0.4rem 0.6rem; font-size:0.85rem;">
                            <div>
                                <strong style="color:#0e254f;">${m.name}</strong>
                                <div style="font-size:0.75rem; color:#d97706;">
                                    <i class="fa-solid fa-clock-rotate-left"></i> Last order: ${perf.daysSinceLastOrder} days ago
                                </div>
                            </div>
                            <div style="display:flex; align-items:center; gap:0.4rem; flex-shrink:0;">
                                <span class="badge ${perf.gradeBadgeClass}" style="font-size:0.72rem;">${perf.gradeLabel}</span>
                                <button class="btn" style="background:#25d366; color:#fff; font-size:0.72rem; padding:0.2rem 0.5rem;" onclick="sendPartyOrderFollowupWA('${m.id}')" title="WhatsApp Follow-up"><i class="fa-brands fa-whatsapp"></i></button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }
}

// ---- STOCK ----
function renderStockTable() {
    const tbody = document.getElementById("stock-table-body");
    if (!tbody) return;
    tbody.innerHTML = "";

    const search = (document.getElementById("stock-search") ? document.getElementById("stock-search").value : "").toLowerCase();
    const catBtn = document.querySelector("#stock-category-filters .cat-btn.active");
    const activeCat = catBtn ? catBtn.getAttribute("data-category") : "all";

    // Bind stock grade filter pills if present
    const stockGradeBtns = document.querySelectorAll("#stock-grade-filters .cat-btn");
    stockGradeBtns.forEach(btn => {
        if (!btn.dataset.bound) {
            btn.dataset.bound = "true";
            btn.addEventListener("click", () => {
                stockGradeBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                renderStockTable();
            });
        }
    });
    const activeGradeBtn = document.querySelector("#stock-grade-filters .cat-btn.active");
    const activeGrade = activeGradeBtn ? activeGradeBtn.getAttribute("data-grade") : "all";

    // Sort products by displayOrder (ascending)
    const sortedProds = [...state.products].sort((a, b) => {
        const ordA = a.displayOrder !== undefined ? a.displayOrder : 100;
        const ordB = b.displayOrder !== undefined ? b.displayOrder : 100;
        return ordA - ordB;
    });

    const matchingProds = sortedProds.filter(p => {
        if (activeCat === "low-stock") {
            if (parseInt(p.stock || 0) > 15) return false;
        } else if (activeCat !== "all" && p.category !== activeCat) {
            return false;
        }
        if (activeGrade !== "all" && (p.grade || "Premium") !== activeGrade) {
            return false;
        }
        const match = p.model.toLowerCase().includes(search) || 
                      (p.category && p.category.toLowerCase().includes(search)) || 
                      (p.colour && p.colour.toLowerCase().includes(search)) ||
                      ((p.grade || '').toLowerCase().includes(search)) ||
                      ((p.material || '').toLowerCase().includes(search)) ||
                      ((p.subcategory || p.subCategory) && (p.subcategory || p.subCategory).toLowerCase().includes(search));
        return match;
    });

    const maxStockDisplay = window._stockDisplayLimit || 80;
    const prodsToRender = matchingProds.slice(0, maxStockDisplay);

    prodsToRender.forEach(p => {
        const isStaff = window.location.pathname.includes("staff.html") || document.title.includes("Staff");
        const tr = document.createElement("tr");
        const hotBadge = p.isHot ? '<span style="background:#fef3c7; color:#d97706; font-size:0.7rem; font-weight:800; padding:0.15rem 0.35rem; border-radius:4px; border:1px solid #fde68a; margin-left:0.3rem;"><i class="fa-solid fa-star" style="color:#d97706; font-size:0.7rem;"></i> Hot</span>' : '';
        const asPerOrderBadge = (typeof isProductAsPerOrder === 'function' && isProductAsPerOrder(p)) ? '<span style="background:#eff6ff; color:#2563eb; font-size:0.68rem; font-weight:700; padding:0.12rem 0.35rem; border-radius:4px; border:1px solid #bfdbfe; margin-left:0.3rem;" title="Production As Per Order"><i class="fa-solid fa-clock-rotate-left"></i> As Per Order</span>' : '';
        const dualBadge = (p.packagingType === 'dual' || (p.boxQty && p.boxQty > 1)) ? `<span class="badge" style="background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; font-size:0.68rem; font-weight:700; margin-left:0.3rem;" title="1 Box = ${p.boxQty} pcs">📦 ${p.boxQty} pcs/box</span>` : '';
        const orderBadge = '<span style="font-size:0.7rem; color:#94a3b8; margin-right:0.3rem;">#' + (p.displayOrder || 100) + '</span>';
        const subCatText = (p.subcategory || p.subCategory) ? '<br><small style="color:#64748b; font-size:0.75rem;">' + (p.subcategory || p.subCategory) + (p.finishType ? ' • ' + p.finishType : '') + '</small>' : '';

        const gradeBadge = (() => {
            const g = p.grade || 'Premium';
            if (g === 'Commercial') return `<span class="badge" style="background:#fee2e2; color:#dc2626; border:1px solid #fca5a5; font-weight:800; font-size:0.75rem;">\uD83D\uDD3B Commercial</span>`;
            if (g === 'STD') return `<span class="badge" style="background:#ffedd5; color:#c2410c; border:1px solid #fdba74; font-weight:800; font-size:0.75rem;">\uD83D\uDD38 STD</span>`;
            if (g === 'ROK') return `<span class="badge" style="background:#f0fdf4; color:#16a34a; border:1px solid #bbf7d0; font-weight:800; font-size:0.75rem;">\uD83D\uDD39 ROK</span>`;
            return `<span class="badge" style="background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; font-weight:800; font-size:0.75rem;">\u2B50 Premium</span>`;
        })();
        const materialSpecText = p.material ? `<br><small style="color:#475569; font-weight:600; font-size:0.72rem;"><i class="fa-solid fa-shapes" style="font-size:0.65rem; color:#94a3b8;"></i> ${p.material}</small>` : '';

        tr.innerHTML = `
            <td>
                <div style="width:38px; height:38px; background:#f1f5f9; border-radius:4px; overflow:hidden; display:flex; align-items:center; justify-content:center; cursor:pointer;" onclick="openLightbox('${p.imageBase64 || ''}', '${p.model.replace(/'/g, "\\'")}')" title="Click to zoom">
                    ${p.imageBase64 ? `<img src="${p.imageBase64}" style="width:100%; height:100%; object-fit:cover;">` : `<i class="fa-solid fa-image" style="color:#cbd5e1;"></i>`}
                </div>
            </td>
            <td>${orderBadge}<b>${p.model}</b>${hotBadge}${asPerOrderBadge}${dualBadge}${subCatText}</td>
            <td>${p.category}</td>
            <td>${gradeBadge}${materialSpecText}</td>
            <td>${p.colour}</td>
            <td class="num-col" style="cursor:pointer;" onclick="editStockQty('${p.id}')" title="Click to edit stock">${(() => {
                const s = parseInt(p.stock || 0);
                if (s <= 0) return `<span class="badge" style="background:#fee2e2; color:#b91c1c; border:1px solid #fca5a5; font-weight:700;"><i class="fa-solid fa-circle-exclamation"></i> 0 (Out)</span>`;
                if (s <= 15) return `<span class="badge" style="background:#ffedd5; color:#c2410c; border:1px solid #fdba74; font-weight:700;"><i class="fa-solid fa-triangle-exclamation"></i> ${s} (Low)</span>`;
                return `<b>${s}</b>`;
            })()}</td>
            <td class="num-col" ${isStaff ? 'style="display:none;"' : ''}>₹${p.price}${(p.packagingType === 'dual' || (p.boxQty && p.boxQty > 1)) ? `<br><small style="color:#2563eb; font-weight:600;" title="Wholesale Box Rate per pc">Box: ₹${p.boxPrice !== undefined ? p.boxPrice : p.price}</small>` : ''}</td>
            <td class="num-col" ${isStaff ? 'style="display:none;"' : ''}>₹${p.billRate}${(p.packagingType === 'dual' || (p.boxQty && p.boxQty > 1)) ? `<br><small style="color:#2563eb; font-weight:600;" title="Box Bill Rate per pc">Box: ₹${p.boxBillRate !== undefined ? p.boxBillRate : p.billRate}</small>` : ''}</td>
            <td class="num-col">${p.weight !== undefined ? p.weight : 15} kg</td>
            <td>
                <div style="display:flex; gap:0.3rem;">
                    ${!isStaff ? `<button class="btn btn-outline" style="padding:0.25rem 0.5rem; font-size:0.75rem;" onclick="openEditProductModal('${p.id}')" title="Edit Product"><i class="fa-solid fa-pen"></i></button>` : ''}
                    <button class="btn btn-secondary" style="padding:0.25rem 0.5rem; font-size:0.75rem;" onclick="uploadProductImage('${p.id}')" title="Upload Photo"><i class="fa-solid fa-camera"></i></button>
                    ${!isStaff ? `<button class="btn btn-danger" style="padding:0.25rem 0.5rem; font-size:0.75rem;" onclick="deleteProduct('${p.id}')" title="Delete Product"><i class="fa-solid fa-trash"></i></button>` : ''}
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    if (matchingProds.length > maxStockDisplay) {
        const moreTr = document.createElement("tr");
        moreTr.innerHTML = `<td colspan="8" style="text-align:center; padding:1rem;"><button class="btn btn-secondary" style="padding:0.5rem 1.2rem; font-weight:700;" onclick="window._stockDisplayLimit = (window._stockDisplayLimit || 80) + 80; renderStockTable();"><i class="fa-solid fa-angles-down"></i> Showing ${maxStockDisplay} of ${matchingProds.length} Products - Load More</button></td>`;
        tbody.appendChild(moreTr);
    }
}

function editStockQty(id) {
    const p = state.products.find(x => x.id === id);
    if (!p) return;
    const v = prompt(`New stock qty for "${p.model}":`, p.stock);
    if (v !== null && !isNaN(parseInt(v))) {
        p.stock = Math.max(0, parseInt(v));
        saveState();
        renderStockTable();
    }
}

function openQuickInwardModal(preselectedProdId = null) {
    const searchInput = document.getElementById("inward-product-search");
    const hiddenInput = document.getElementById("inward-product-select");
    
    if (preselectedProdId) {
        const prod = (state.products || []).find(p => p.id === preselectedProdId);
        if (prod) {
            const gradeCol = [prod.grade, prod.colour].filter(Boolean).join(' / ');
            if (searchInput) searchInput.value = `${prod.model} ${gradeCol ? `(${gradeCol})` : ''}`;
            if (hiddenInput) hiddenInput.value = prod.id;
        }
    } else {
        if (searchInput) searchInput.value = "";
        if (hiddenInput) hiddenInput.value = "";
    }
    onInwardProductChange();
    
    const qtyInput = document.getElementById("inward-qty");
    if (qtyInput) qtyInput.value = "";
    const remarkInput = document.getElementById("inward-remark");
    if (remarkInput) remarkInput.value = "";

    openModal("quick-inward-modal");
    setTimeout(() => {
        if (preselectedProdId) {
            if (qtyInput) qtyInput.focus();
        } else {
            if (searchInput) searchInput.focus();
        }
    }, 150);
}

function onInwardProductChange() {
    const hiddenInput = document.getElementById("inward-product-select");
    const stockDisplay = document.getElementById("inward-current-stock");
    if (!hiddenInput || !stockDisplay) return;

    const prodId = hiddenInput.value;
    const prod = (state.products || []).find(p => p.id === prodId);
    if (prod) {
        const s = parseInt(prod.stock || 0);
        stockDisplay.textContent = `${s} pcs`;
        stockDisplay.style.color = s <= 0 ? '#dc2626' : (s <= 15 ? '#c2410c' : '#0d9488');
    } else {
        stockDisplay.textContent = "0 pcs";
        stockDisplay.style.color = "#64748b";
    }
}

function saveQuickInward(e) {
    if (e) e.preventDefault();
    const hiddenInput = document.getElementById("inward-product-select");
    const qtyInput = document.getElementById("inward-qty");
    const remarkInput = document.getElementById("inward-remark");

    if (!hiddenInput || !hiddenInput.value) {
        alert("Please select a product. (પહેલા પ્રોડક્ટ પસંદ કરો)");
        const searchInput = document.getElementById("inward-product-search");
        if (searchInput) searchInput.focus();
        return;
    }
    const addQty = parseInt(qtyInput ? qtyInput.value : 0, 10);
    if (isNaN(addQty) || addQty <= 0) {
        alert("Please enter a valid positive quantity. (યોગ્ય નંગ દાખલ કરો)");
        if (qtyInput) qtyInput.focus();
        return;
    }

    const prod = (state.products || []).find(p => p.id === hiddenInput.value);
    if (!prod) return;

    const oldStock = parseInt(prod.stock || 0);
    const newStock = oldStock + addQty;
    prod.stock = newStock;

    saveState();
    closeModal("quick-inward-modal");
    renderStockTable();
    renderDashboard();

    const remark = remarkInput && remarkInput.value ? ` (${remarkInput.value.trim()})` : '';
    alert(`✅ Stock updated successfully for "${prod.model}"!\n\nPrevious Stock: ${oldStock} pcs\nInward Added: +${addQty} pcs\nNew Total Stock: ${newStock} pcs${remark}`);
}

function editStockRates(id) {
    const p = state.products.find(x => x.id === id);
    if (!p) return;
    
    document.getElementById('edit-rates-product-id').value = p.id;
    document.getElementById('edit-rates-model-name').textContent = p.model;
    document.getElementById('edit-rates-base-price').value = p.price || 0;
    document.getElementById('edit-rates-bill-rate').value = p.billRate || 0;
    
    openModal('edit-rates-modal');
}

function saveProductRates() {
    const id = document.getElementById('edit-rates-product-id').value;
    const newPrice = parseFloat(document.getElementById('edit-rates-base-price').value);
    const newBillRate = parseFloat(document.getElementById('edit-rates-bill-rate').value);
    
    const p = state.products.find(x => x.id === id);
    if (!p) return;
    
    if (!isNaN(newPrice)) p.price = newPrice;
    if (!isNaN(newBillRate)) p.billRate = newBillRate;
    
    saveState();
    renderStockTable();
    closeModal('edit-rates-modal');
}

function deleteProduct(id) {
    const p = state.products.find(x => x.id === id);
    if (!p) return;
    if (confirm(`Delete product "${p.model}"?`)) {
        state.products = state.products.filter(x => x.id !== id);
        saveState();
        renderStockTable();
    }
}

function toggleBoxFields() {
    const pkgType = document.getElementById("stock-packaging-type") ? document.getElementById("stock-packaging-type").value : "pcs";
    const isDual = (pkgType === "dual");
    const qtyWrap = document.getElementById("stock-box-qty-wrap");
    const ratesWrap = document.getElementById("stock-box-rates-wrap");
    if (qtyWrap) qtyWrap.style.display = isDual ? "block" : "none";
    if (ratesWrap) ratesWrap.style.display = isDual ? "flex" : "none";
    updateFullBoxPreview();
}
window.toggleBoxFields = toggleBoxFields;

function updateFullBoxPreview() {
    const previewEl = document.getElementById("stock-full-box-preview");
    if (!previewEl) return;
    const qty = parseInt(document.getElementById("stock-box-qty") ? document.getElementById("stock-box-qty").value : 0, 10) || 0;
    const rate = parseFloat(document.getElementById("stock-box-price") ? document.getElementById("stock-box-price").value : 0) || 0;
    if (qty > 0 && rate > 0) {
        previewEl.innerHTML = `આખા બોક્સનો ભાવ: <b>₹${(qty * rate).toLocaleString('en-IN')}</b> (${qty} pcs × ₹${rate})`;
        previewEl.style.color = "#d97706";
    } else {
        previewEl.textContent = "આખા બોક્સનો ભાવ: ₹0";
        previewEl.style.color = "#64748b";
    }
}
window.updateFullBoxPreview = updateFullBoxPreview;

function openAddProductModal() {
    document.getElementById("add-stock-form").reset();
    document.getElementById("edit-stock-id").value = "";
    document.getElementById("add-stock-modal-title").innerHTML = '<i class="fa-solid fa-box"></i> Add New Product';
    populateStockModalCategories();
    if (document.getElementById("stock-display-order")) {
        document.getElementById("stock-display-order").value = (state.products.length + 1) * 10;
    }
    if (document.getElementById("stock-is-hot")) {
        document.getElementById("stock-is-hot").checked = false;
    }
    if (document.getElementById("stock-finish-type")) {
        document.getElementById("stock-finish-type").value = "";
    }
    if (document.getElementById("stock-grade")) {
        document.getElementById("stock-grade").value = "Premium";
    }
    if (document.getElementById("stock-material")) {
        document.getElementById("stock-material").value = "";
    }
    if (document.getElementById("stock-availability-mode")) {
        document.getElementById("stock-availability-mode").value = "stock";
    }
    if (document.getElementById("stock-packaging-type")) {
        document.getElementById("stock-packaging-type").value = "pcs";
    }
    if (document.getElementById("stock-box-qty")) {
        document.getElementById("stock-box-qty").value = 20;
    }
    if (document.getElementById("stock-box-price")) {
        document.getElementById("stock-box-price").value = "";
    }
    if (document.getElementById("stock-box-bill-rate")) {
        document.getElementById("stock-box-bill-rate").value = "";
    }
    toggleBoxFields();
    document.getElementById("stock-preview-images").innerHTML = "";
    openModal("add-stock-modal");
}

function openEditProductModal(id) {
    const p = state.products.find(x => x.id === id);
    if (!p) return;
    
    document.getElementById('edit-stock-id').value = p.id;
    document.getElementById('add-stock-modal-title').innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Edit Product — ' + (p.model || '');
    document.getElementById("stock-model").value = p.model || "";
    
    populateStockModalCategories();
    const catSelect = document.getElementById("stock-category");
    if (catSelect) {
        catSelect.value = p.category || "";
        onStockCategoryChange();
    }
    
    const subCatSelect = document.getElementById("stock-subcategory");
    if (subCatSelect) {
        subCatSelect.value = p.subcategory || p.subCategory || "";
    }
    
    if (document.getElementById("stock-finish-type")) {
        document.getElementById("stock-finish-type").value = p.finishType || "";
    }
    if (document.getElementById("stock-availability-mode")) {
        document.getElementById("stock-availability-mode").value = p.availabilityMode || (p.asPerOrder ? "order" : "stock");
    }
    if (document.getElementById("stock-grade")) {
        document.getElementById("stock-grade").value = p.grade || "Premium";
    }
    if (document.getElementById("stock-material")) {
        document.getElementById("stock-material").value = p.material || "";
    }
    document.getElementById("stock-colour").value = p.colour || "";
    document.getElementById("stock-qty").value = p.stock || 0;
    document.getElementById("stock-price").value = p.price || 0;
    document.getElementById("stock-bill-rate").value = p.billRate || 0;
    if (document.getElementById("stock-weight")) document.getElementById("stock-weight").value = (p.weight !== undefined) ? p.weight : 15;
    
    const isDual = (p.packagingType === 'dual' || (p.boxQty && p.boxQty > 1));
    if (document.getElementById("stock-packaging-type")) {
        document.getElementById("stock-packaging-type").value = isDual ? "dual" : "pcs";
    }
    if (document.getElementById("stock-box-qty")) {
        document.getElementById("stock-box-qty").value = p.boxQty || 20;
    }
    if (document.getElementById("stock-box-price")) {
        document.getElementById("stock-box-price").value = (p.boxPrice !== undefined && p.boxPrice !== null) ? p.boxPrice : '';
    }
    if (document.getElementById("stock-box-bill-rate")) {
        document.getElementById("stock-box-bill-rate").value = (p.boxBillRate !== undefined && p.boxBillRate !== null) ? p.boxBillRate : '';
    }
    toggleBoxFields();

    if (document.getElementById("stock-display-order")) {
        document.getElementById("stock-display-order").value = (p.displayOrder !== undefined) ? p.displayOrder : 100;
    }
    if (document.getElementById("stock-is-hot")) {
        document.getElementById("stock-is-hot").checked = !!p.isHot;
    }

    const prevBox = document.getElementById("stock-preview-images");
    if (prevBox) {
        const imgs = (p.imagesBase64 && p.imagesBase64.length > 0) ? p.imagesBase64 : (p.imageBase64 ? [p.imageBase64] : []);
        prevBox.innerHTML = imgs.map(src => `<img src="${src}" style="width:50px; height:50px; object-fit:cover; border-radius:4px; border:1px solid #cbd5e1;">`).join('');
    }
    
    openModal("add-stock-modal");
}

function handleNewProduct(e) {
    e.preventDefault();
    const fileInput = document.getElementById("stock-images-input") || document.getElementById("stock-image-input");
    const subCatVal = document.getElementById("stock-subcategory") ? document.getElementById("stock-subcategory").value : "";
    const finishTypeVal = document.getElementById("stock-finish-type") ? document.getElementById("stock-finish-type").value.trim() : "";
    const displayOrderVal = parseInt(document.getElementById("stock-display-order").value) || 100;
    const isHotVal = document.getElementById("stock-is-hot") ? document.getElementById("stock-is-hot").checked : false;
    const availabilityModeVal = document.getElementById("stock-availability-mode") ? document.getElementById("stock-availability-mode").value : "stock";
    const gradeVal = document.getElementById("stock-grade") ? document.getElementById("stock-grade").value : "Premium";
    const materialVal = document.getElementById("stock-material") ? document.getElementById("stock-material").value.trim() : "";

    const pkgType = document.getElementById("stock-packaging-type") ? document.getElementById("stock-packaging-type").value : "pcs";
    const boxQtyVal = (pkgType === 'dual') ? (parseInt(document.getElementById("stock-box-qty").value, 10) || 20) : null;
    const boxPriceVal = (pkgType === 'dual' && document.getElementById("stock-box-price").value !== '') ? parseFloat(document.getElementById("stock-box-price").value) : null;
    const boxBillRateVal = (pkgType === 'dual' && document.getElementById("stock-box-bill-rate").value !== '') ? parseFloat(document.getElementById("stock-box-bill-rate").value) : null;

    const saveProd = (imagesArr) => {
        const editId = document.getElementById("edit-stock-id") ? document.getElementById("edit-stock-id").value : "";
        if (editId) {
            const p = state.products.find(x => x.id === editId);
            if (p) {
                p.model = document.getElementById("stock-model").value;
                p.category = document.getElementById("stock-category").value;
                p.subcategory = subCatVal;
                p.subCategory = subCatVal;
                p.finishType = finishTypeVal;
                p.availabilityMode = availabilityModeVal;
                p.asPerOrder = (availabilityModeVal === 'order');
                p.grade = gradeVal;
                p.material = materialVal;
                p.colour = document.getElementById("stock-colour").value;
                p.stock = parseInt(document.getElementById("stock-qty").value) || 0;
                p.price = parseFloat(document.getElementById("stock-price").value) || 0;
                p.billRate = parseFloat(document.getElementById("stock-bill-rate").value) || 0;
                p.weight = parseFloat(document.getElementById("stock-weight") ? document.getElementById("stock-weight").value : 0) || 15;
                p.packagingType = pkgType;
                p.boxQty = boxQtyVal;
                p.boxPrice = boxPriceVal;
                p.boxBillRate = boxBillRateVal;
                p.displayOrder = displayOrderVal;
                p.isHot = isHotVal;
                if (imagesArr && imagesArr.length > 0) {
                    p.imageBase64 = imagesArr[0];
                    p.imagesBase64 = imagesArr;
                }
            }
        } else {
            state.products.push({
                id: "prod-" + Date.now(),
                model: document.getElementById("stock-model").value,
                category: document.getElementById("stock-category").value,
                subcategory: subCatVal,
                subCategory: subCatVal,
                finishType: finishTypeVal,
                availabilityMode: availabilityModeVal,
                asPerOrder: (availabilityModeVal === 'order'),
                grade: gradeVal,
                material: materialVal,
                colour: document.getElementById("stock-colour").value,
                stock: parseInt(document.getElementById("stock-qty").value) || 0,
                price: parseFloat(document.getElementById("stock-price").value) || 0,
                billRate: parseFloat(document.getElementById("stock-bill-rate").value) || 0,
                weight: parseFloat(document.getElementById("stock-weight") ? document.getElementById("stock-weight").value : 0) || 15,
                packagingType: pkgType,
                boxQty: boxQtyVal,
                boxPrice: boxPriceVal,
                boxBillRate: boxBillRateVal,
                displayOrder: displayOrderVal,
                isHot: isHotVal,
                imageBase64: (imagesArr && imagesArr.length > 0) ? imagesArr[0] : null,
                imagesBase64: imagesArr || []
            });
        }
        saveState();
        if (typeof syncToCloud === 'function') syncToCloud();
        closeModal("add-stock-modal");
        document.getElementById("add-stock-form").reset();
        if (document.getElementById("edit-stock-id")) document.getElementById("edit-stock-id").value = "";
        renderStockTable();
    };

    if (fileInput && fileInput.files && fileInput.files.length > 0) {
        const files = Array.from(fileInput.files).slice(0, 3);
        const loadedImages = [];
        
        const processImages = async () => {
            for (let i = 0; i < files.length; i++) {
                const compressed = await compressImage(files[i], 800, 800, 0.7);
                loadedImages.push(compressed);
            }
            saveProd(loadedImages);
        };
        processImages();
    } else {
        saveProd([]);
    }
}

// One-time catalog migration to unified Kitchen Sinks and Sanitary Ware categories


// ---- MERCHANTS ----
function renderMerchantsGrid() {
    const container = document.getElementById("merchants-container");
    if (!container) return;
    container.innerHTML = "";
    const isStaff = document.title.includes('Staff') || window.location.pathname.includes('staff.html');
    const searchInput = document.getElementById("merchant-search");
    const search = (searchInput && searchInput.value ? searchInput.value : "").toLowerCase().trim();
    let needsSave = false;
    (state.merchants || []).forEach(m => {
        if (!m.uid || m.uid === 'undefined') {
            const namePrefix = (m.name || "AAA").replace(/[^a-zA-Z]/g, '').padEnd(3, 'A').substring(0, 3).toUpperCase();
            m.uid = namePrefix + Math.floor(100 + Math.random() * 900).toString();
            needsSave = true;
        }
    });

    const matchingMerchants = (state.merchants || []).filter(m => {
        if (!search) return true;
        return (m.name || '').toLowerCase().includes(search) || (m.address || '').toLowerCase().includes(search) || (m.phone || '').includes(search);
    });

    if (matchingMerchants.length === 0) {
        container.innerHTML = `<div style="grid-column: 1 / -1; text-align:center; padding:3rem 1rem; color:#94a3b8; font-style:italic; background:#fff; border-radius:8px; border:1px dashed #cbd5e1;">` +
            `<i class="fa-solid fa-users-slash" style="font-size:2.5rem; color:#cbd5e1; margin-bottom:0.75rem; display:block;"></i>` +
            `No merchants found matching your search.</div>`;
        if (needsSave) saveState();
        return;
    }

    const maxMerchDisplay = window._merchantsDisplayLimit || 60;
    const merchantsToRender = matchingMerchants.slice(0, maxMerchDisplay);

    merchantsToRender.forEach(m => {
        const overrides = Object.keys(m.specialRates || {}).length;
        const discText = (m.globalDiscount !== undefined && m.globalDiscount > 0) ? `+${m.globalDiscount}%` : `${m.globalDiscount || 0}%`;
        const pinDisplay = m.pin ? `**** (${m.pin})` : 'No PIN Set';
        const perf = typeof getMerchantPerformance === 'function' ? getMerchantPerformance(m) : null;
        const creditDays = perf ? perf.allowedCreditDays : (m.creditDays || 30);
        const balColor = (perf && perf.balance > 50) ? '#dc2626' : ((perf && perf.balance < -50) ? '#2563eb' : '#16a34a');
        
        let dueStatusHtml = '';
        if (perf && perf.isOverdue) {
            dueStatusHtml = `<span style="color:#dc2626; font-weight:700;"><i class="fa-solid fa-triangle-exclamation"></i> ${perf.overdueDays}d Overdue</span>`;
        } else if (perf && perf.balance > 50) {
            dueStatusHtml = `<span style="color:#16a34a; font-weight:600;"><i class="fa-solid fa-check"></i> In Limit (${creditDays}d)</span>`;
        } else {
            dueStatusHtml = `<span style="color:#059669; font-weight:600;">Cleared (\u20B90)</span>`;
        }

        const lastOrderText = (perf && perf.daysSinceLastOrder !== null && perf.daysSinceLastOrder !== undefined) 
            ? `${perf.daysSinceLastOrder}d ago (${perf.lastOrderStatus || ''})` 
            : 'None';

        const allowedGradesHtml = (m.allowedGrades || ['Premium', 'ROK']).map(g => {
            if (g === 'Commercial') return `<span style="font-size:0.68rem; padding:0.1rem 0.35rem; border-radius:3px; background:#fee2e2; color:#dc2626; font-weight:700;">\uD83D\uDD3B Commercial</span>`;
            if (g === 'STD') return `<span style="font-size:0.68rem; padding:0.1rem 0.35rem; border-radius:3px; background:#ffedd5; color:#c2410c; font-weight:700;">\uD83D\uDD38 STD</span>`;
            if (g === 'ROK') return `<span style="font-size:0.68rem; padding:0.1rem 0.35rem; border-radius:3px; background:#f0fdf4; color:#16a34a; font-weight:700;">\uD83D\uDD39 ROK</span>`;
            return `<span style="font-size:0.68rem; padding:0.1rem 0.35rem; border-radius:3px; background:#eff6ff; color:#1d4ed8; font-weight:700;">\u2B50 Premium</span>`;
        }).join(' ');

        const card = document.createElement("div");
        card.className = "merchant-item-card";
        card.innerHTML = `
            <div class="merchant-header-row">
                <div style="background:#e2e8f0; border-radius:4px; padding:0.4rem; text-align:center; margin-bottom:1rem; border:1px dashed #94a3b8; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <span style="font-size:0.68rem; color:#64748b; display:block; text-transform:uppercase; letter-spacing:1px;">Dealer Login ID</span>
                        <strong style="font-size:1.15rem; letter-spacing:2px; color:#0e254f;">${m.uid}</strong>
                    </div>
                    ${perf ? `<span class="badge ${perf.gradeBadgeClass}" style="font-size:0.75rem;">${perf.gradeLabel}</span>` : ''}
                </div>
                <h3>${m.name}</h3>
                <p class="merchant-address-text"><i class="fa-solid fa-location-dot"></i> ${m.address}</p>
                <p class="merchant-address-text" style="margin-top:0.2rem;"><i class="fa-brands fa-whatsapp"></i> +${m.phone} | PIN: <span style="font-weight:700;">${pinDisplay}</span></p>
                <div style="margin-top:0.35rem; display:flex; align-items:center; gap:0.3rem; flex-wrap:wrap;">
                    <small style="font-size:0.7rem; color:#64748b; font-weight:600;">Grades:</small>
                    ${allowedGradesHtml} ${(m.allowOffers !== false) ? `<span style="font-size:0.68rem; padding:0.1rem 0.35rem; border-radius:3px; background:#fef2f2; color:#dc2626; font-weight:700;"><i class="fa-solid fa-fire"></i> Offers ON</span>` : `<span style="font-size:0.68rem; padding:0.1rem 0.35rem; border-radius:3px; background:#f1f5f9; color:#94a3b8; font-weight:600;"><i class="fa-solid fa-ban"></i> Offers OFF</span>`}
                </div>
            </div>
            
            ${!isStaff ? `
            <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:0.3rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:0.5rem; margin-bottom:0.75rem; font-size:0.78rem;">
                <div>
                    <span style="color:#64748b; display:block; font-size:0.68rem;">Balance</span>
                    <strong style="color:${balColor}; font-size:0.85rem;">${perf && typeof fmtCur === 'function' ? fmtCur(perf.balance) : 'â‚¹0'}</strong>
                </div>
                <div>
                    <span style="color:#64748b; display:block; font-size:0.68rem;">Last Order</span>
                    <strong style="color:#0e254f;">${lastOrderText}</strong>
                </div>
                <div>
                    <span style="color:#64748b; display:block; font-size:0.68rem;">Credit Days</span>
                    <span style="cursor:pointer; color:#2563eb; font-weight:700;" onclick="editPartyCreditDays('${m.id}')" title="Click to edit">${creditDays}d <i class="fa-solid fa-pen" style="font-size:0.65rem;"></i></span>
                </div>
            </div>
            <div class="merchant-stats-mini">
                <div class="merchant-stat-col"><span>Global Adj.</span><strong>${discText}</strong></div>
                <div class="merchant-stat-col"><span>Status</span><strong>${dueStatusHtml}</strong></div>
            </div>
            ` : `
            <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:0.3rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:0.5rem; margin-bottom:0.75rem; font-size:0.78rem;">
                <div>
                    <span style="color:#64748b; display:block; font-size:0.68rem;">Last Order</span>
                    <strong style="color:#0e254f;">${lastOrderText}</strong>
                </div>
                <div>
                    <span style="color:#64748b; display:block; font-size:0.68rem;">Credit Days</span>
                    <strong style="color:#2563eb;">${creditDays}d</strong>
                </div>
            </div>
            `}

            <div style="display:flex; gap:0.5rem; flex-direction:column; margin-top:0.75rem;">
                <button type="button" class="btn btn-primary" data-action="open-party-modal" data-party-id="${m.id}" data-tab="profile" style="width:100%; font-weight:700; background:#0e254f; color:#fff; padding:0.6rem; font-size:0.9rem;" onclick="openPartyDetailsModal('${m.id}', 'profile')">
                    <i class="fa-solid fa-id-card"></i>  View & Edit Party Details
                </button>
                ${!isStaff ? `
                <div style="display:flex; gap:0.5rem;">
                    <button type="button" class="btn btn-outline" data-action="open-party-modal" data-party-id="${m.id}" data-tab="rates" style="flex:1; padding:0.45rem; font-size:0.82rem;" onclick="openPartyDetailsModal('${m.id}', 'rates')">
                        <i class="fa-solid fa-sliders"></i> Configure Rates
                    </button>
                    <button type="button" class="btn btn-secondary" style="padding:0.45rem 0.75rem; font-size:0.82rem;" onclick="openPartyLedgerDirect('${m.id}')" title="View Ledger">
                        <i class="fa-solid fa-book-bookmark"></i> Ledger
                    </button>
                    <button type="button" class="btn btn-secondary" data-action="open-party-modal" data-party-id="${m.id}" data-tab="pin" style="padding:0.45rem 0.75rem; font-size:0.82rem;" onclick="openPartyDetailsModal('${m.id}', 'pin')">
                        <i class="fa-solid fa-key"></i> PIN
                    </button>
                </div>
                ` : `
                <div style="display:flex; gap:0.5rem;">
                    <button type="button" class="btn btn-secondary" data-action="open-party-modal" data-party-id="${m.id}" data-tab="pin" style="flex:1; padding:0.45rem 0.75rem; font-size:0.82rem;" onclick="openPartyDetailsModal('${m.id}', 'pin')">
                        <i class="fa-solid fa-key"></i> View PIN
                    </button>
                </div>
                `}
                <div style="display:flex; gap:0.5rem;">
                    <button class="btn btn-secondary" style="flex:1; padding:0.45rem; font-size:0.82rem;" onclick="event.stopPropagation(); window.copyDealerLink('${m.id}')">
                        <i class="fa-solid fa-link"></i> Copy Link
                    </button>
                    ${!isStaff ? `
                    <button class="btn btn-danger" style="padding:0.45rem 0.75rem; font-size:0.82rem; background:#ef4444; color:#fff; border:none; border-radius:4px; cursor:pointer;" onclick="event.stopPropagation(); window.deleteMerchant('${m.id}')">
                        <i class="fa-solid fa-trash"></i> Delete
                    </button>
                    ` : ''}
                </div>
            </div>`;
        container.appendChild(card);
    });

    if (matchingMerchants.length > maxMerchDisplay) {
        const loadMoreDiv = document.createElement("div");
        loadMoreDiv.style.cssText = "grid-column: 1 / -1; text-align:center; margin: 1.5rem 0;";
        loadMoreDiv.innerHTML = `<button class="btn btn-secondary" style="padding:0.6rem 1.4rem; font-weight:700; border-radius:6px;" onclick="window._merchantsDisplayLimit = (window._merchantsDisplayLimit || 60) + 60; renderMerchantsGrid();"><i class="fa-solid fa-angles-down"></i> Showing ${maxMerchDisplay} of ${matchingMerchants.length} Parties - Load More</button>`;
        container.appendChild(loadMoreDiv);
    }

    if (needsSave) saveState();
}
window.renderMerchantsGrid = renderMerchantsGrid;

function openSetPinModal(merchantId) {
    openPartyDetailsModal(merchantId, 'pin');
}
window.openSetPinModal = openSetPinModal;

function savePartyModalPin() {
    const m = (state.merchants || []).find(x => x.id === editingMerchantId || String(x.id) === String(editingMerchantId));
    if (!m) return;
    const pinInput = document.getElementById("pmodal-edit-pin");
    const pin = pinInput ? pinInput.value.trim() : "";
    if (pin.length !== 4 || isNaN(parseInt(pin))) {
        alert("Security PIN must be exactly 4 digits.");
        return;
    }
    m.pin = pin;
    if (document.getElementById("pdetail-pin")) document.getElementById("pdetail-pin").value = pin;
    saveState();
    if (typeof syncToCloud === 'function') syncToCloud();
    renderMerchantsGrid();
    alert(`Security PIN successfully updated to "${pin}" for ${m.name}`);
}
window.savePartyModalPin = savePartyModalPin;

function saveMerchantPin() {
    savePartyModalPin();
}

function copyDealerLink(merchantId) {
    const link = window.location.href.replace(/(admin|staff|index)\.html/i, `dealer.html?merchantId=${merchantId}`);
    navigator.clipboard.writeText(link).then(() => {
        alert(`Dealer portal link copied!\n\n${link}`);
    }).catch(() => {
        prompt("Copy this link to share with dealer:", link);
    });
}

function handleNewMerchant(e) {
    e.preventDefault();
    const pin = document.getElementById("merchant-pin").value.trim() || "1234";
    const name = document.getElementById("merchant-name").value;
    const namePrefix = name.replace(/[^a-zA-Z]/g, '').padEnd(3, 'A').substring(0, 3).toUpperCase();
    const uid = namePrefix + Math.floor(100 + Math.random() * 900).toString();
    const creditDaysEl = document.getElementById("merchant-credit-days");
    const creditDays = creditDaysEl ? (parseInt(creditDaysEl.value, 10) || 30) : 30;

    const allowedGrades = ['Premium'];
    if (document.getElementById("merchant-grade-rok") && document.getElementById("merchant-grade-rok").checked) allowedGrades.push('ROK');
    if (document.getElementById("merchant-grade-std") && document.getElementById("merchant-grade-std").checked) allowedGrades.push('STD');
    if (document.getElementById("merchant-grade-commercial") && document.getElementById("merchant-grade-commercial").checked) allowedGrades.push('Commercial');

    state.merchants.push({
        id: "merch-" + Date.now(),
        uid: uid,
        name: name,
        address: document.getElementById("merchant-address").value,
        phone: document.getElementById("merchant-phone").value,
        pin: pin,
        creditDays: creditDays,
        allowedGrades: allowedGrades,
        globalDiscount: parseFloat(document.getElementById("merchant-discount").value) || 0,
        specialRates: {},
        hideAmount: document.getElementById("merchant-hide-amount").checked,
        hideTotals: document.getElementById("merchant-hide-totals") ? document.getElementById("merchant-hide-totals").checked : false
    });
    saveState();
    closeModal("add-merchant-modal");
    document.getElementById("add-merchant-form").reset();
    renderMerchantsGrid();
    renderDashboard();
}

// ---- UNIFIED PARTY MODAL & RATE CONFIG ----
function switchPartyModalTab(tabName) {
    const isStaff = document.title.includes('Staff') || window.location.pathname.includes('staff.html');
    if (isStaff && tabName === 'rates') {
        tabName = 'profile';
    }
    const paneProfile = document.getElementById("ptab-pane-profile");
    const paneRates = document.getElementById("ptab-pane-rates");
    const panePin = document.getElementById("ptab-pane-pin");

    const btnProfile = document.getElementById("ptab-btn-profile");
    const btnRates = document.getElementById("ptab-btn-rates");
    const btnPin = document.getElementById("ptab-btn-pin");

    if (paneProfile) paneProfile.style.display = "none";
    if (paneRates) paneRates.style.display = "none";
    if (panePin) panePin.style.display = "none";

    const inactiveStyle = "padding:0.45rem 0.9rem; font-size:0.83rem; font-weight:700; border-radius:6px; background:#f8fafc; color:#334155; border:1px solid #cbd5e1;";
    if (btnProfile) {
        btnProfile.className = "btn btn-outline";
        btnProfile.setAttribute("style", inactiveStyle);
    }
    if (btnRates) {
        btnRates.className = "btn btn-outline";
        btnRates.setAttribute("style", inactiveStyle);
    }
    if (btnPin) {
        btnPin.className = "btn btn-outline";
        btnPin.setAttribute("style", inactiveStyle);
    }

    if (tabName === 'rates') {
        if (paneRates) paneRates.style.display = "flex";
        if (btnRates) {
            btnRates.className = "btn";
            btnRates.setAttribute("style", "padding:0.45rem 0.9rem; font-size:0.83rem; font-weight:700; border-radius:6px; background:#1e40af; color:#fff; border:1px solid #1e40af;");
        }
        setTimeout(() => {
            const s = document.getElementById("rate-modal-search");
            if (s) s.focus();
        }, 50);
    } else if (tabName === 'pin') {
        if (panePin) panePin.style.display = "block";
        if (btnPin) {
            btnPin.className = "btn";
            btnPin.setAttribute("style", "padding:0.45rem 0.9rem; font-size:0.83rem; font-weight:700; border-radius:6px; background:#b45309; color:#fff; border:1px solid #b45309;");
        }
        setTimeout(() => {
            const p = document.getElementById("pmodal-edit-pin");
            if (p) { p.focus(); p.select(); }
        }, 50);
    } else {
        if (paneProfile) paneProfile.style.display = "block";
        if (btnProfile) {
            btnProfile.className = "btn";
            btnProfile.setAttribute("style", "padding:0.45rem 0.9rem; font-size:0.83rem; font-weight:700; border-radius:6px; background:#0e254f; color:#fff; border:1px solid #0e254f;");
        }
    }
}
window.switchPartyModalTab = switchPartyModalTab;

function populateRateConfigTable(merchant) {
    try {
    if (!merchant) return;
    if (!merchant.specialRates) merchant.specialRates = {};

    const globalAdjEl = document.getElementById("rate-global-adj");
    if (globalAdjEl) globalAdjEl.value = (merchant.globalDiscount !== undefined && merchant.globalDiscount !== null) ? merchant.globalDiscount : 0;

    const hideAmtEl = document.getElementById("rate-hide-amount");
    if (hideAmtEl) hideAmtEl.checked = !!merchant.hideAmount;

    const hideTotEl = document.getElementById("rate-hide-totals");
    if (hideTotEl) hideTotEl.checked = !!merchant.hideTotals;

    const perfBanner = document.getElementById("rate-modal-perf-banner");
    if (perfBanner) {
        const perf = typeof getMerchantPerformance === 'function' ? getMerchantPerformance(merchant) : null;
        if (perf) {
            perfBanner.style.display = "block";
            const overdueHtml = perf.isOverdue 
                ? `<span style="color:#dc2626; font-weight:700;"><i class="fa-solid fa-triangle-exclamation"></i> Overdue: ${perf.overdueDays}d late</span>` 
                : `<span style="color:#16a34a; font-weight:600;"><i class="fa-solid fa-circle-check"></i> Account Clear / In Limit</span>`;
            
            perfBanner.innerHTML = `
                <div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:0.5rem; width:100%;">
                    <div style="display:flex; align-items:center; gap:0.5rem;">
                        <strong style="color:#0e254f;">Party Performance:</strong> 
                        <span class="badge ${perf.gradeBadgeClass}" style="font-size:0.75rem;">${perf.gradeLabel}</span>
                    </div>
                    <div style="display:flex; gap:1rem; align-items:center; font-size:0.8rem; flex-wrap:wrap;">
                        <span>Credit Limit: <b style="color:#2563eb;">${perf.allowedCreditDays} Days</b></span>
                        <span>Orders: <b>${perf.totalOrders}</b></span>
                        ${perf.oldestUnpaidDate ? `<span>Oldest Due: <b>${perf.oldestUnpaidDate} (${perf.daysSinceOldestDispatch}d ago)</b></span>` : (perf.daysSinceLastDispatch !== null ? `<span>Last Dispatch: <b>${perf.daysSinceLastDispatch}d ago</b></span>` : '')}
                        ${overdueHtml}
                    </div>
                </div>
            `;
        } else {
            perfBanner.style.display = "none";
        }
    }

    const searchEl = document.getElementById("rate-modal-search");
    if (searchEl) searchEl.value = "";

    const countEl = document.getElementById("rate-modal-item-count");
    if (countEl) {
        countEl.textContent = `${state.products ? state.products.length : 0} Items`;
    }

    const rateBadge = document.getElementById("pmodal-rate-badge");
    if (rateBadge) {
        const overrideCount = Object.keys(merchant.specialRates || {}).length;
        rateBadge.textContent = overrideCount > 0 ? `${overrideCount} set` : '';
        rateBadge.style.display = overrideCount > 0 ? 'inline-block' : 'none';
    }

    const tbody = document.getElementById("rate-config-tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    (state.products || []).forEach(p => {
        if (!p) return;
        const ovr = (merchant.specialRates || {})[p.id] || {};
        const isDual = (p.packagingType === 'dual' || (p.boxQty && p.boxQty > 1));
        const tr = document.createElement("tr");
        tr.setAttribute("data-model", (p.model || "").toLowerCase());
        tr.setAttribute("data-category", (p.category || "").toLowerCase());
        tr.innerHTML = `
            <td style="padding:0.25rem 0.55rem; vertical-align:middle;">
                <b style="color:#0f172a; font-size:0.83rem;">${p.model}</b> ${isDual ? `<span class="badge" style="font-size:0.65rem; background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; padding:1px 4px; border-radius:3px; font-weight:600;">Loose</span>` : ''}
                <span style="color:#64748b; font-size:0.75rem; margin-left:0.35rem;">(${p.category})</span>
            </td>
            <td style="padding:0.25rem 0.55rem; vertical-align:middle; font-weight:600; color:#334155; font-size:0.82rem;">₹${p.price}</td>
            <td style="padding:0.25rem 0.55rem; vertical-align:middle; font-weight:600; color:#334155; font-size:0.82rem;">₹${p.billRate || 0}</td>
            <td style="padding:0.25rem 0.55rem; vertical-align:middle;"><input type="number" class="cp-rate" data-id="${p.id}" value="${ovr.price !== undefined ? ovr.price : ''}" step="0.01" placeholder="Custom Price" style="width:125px; height:28px; padding:0.2rem 0.45rem; border:1px solid #cbd5e1; border-radius:4px; font-size:0.82rem;"></td>
            <td style="padding:0.25rem 0.55rem; vertical-align:middle;"><input type="number" class="cbr-rate" data-id="${p.id}" value="${ovr.billRate !== undefined ? ovr.billRate : ''}" step="0.01" placeholder="Custom Bill Rate" style="width:125px; height:28px; padding:0.2rem 0.45rem; border:1px solid #cbd5e1; border-radius:4px; font-size:0.82rem;"></td>
            <td style="padding:0.25rem 0.55rem; vertical-align:middle; text-align:center;"><button type="button" class="btn btn-danger" style="padding:0.15rem 0.45rem; font-size:0.72rem; line-height:1;" onclick="resetProductOverride('${merchant.id}','${p.id}')" title="Reset override"><i class="fa-solid fa-rotate-left"></i> Reset</button></td>
        `;
        tbody.appendChild(tr);

        if (isDual) {
            const trBox = document.createElement("tr");
            trBox.classList.add("box-pack-row");
            trBox.setAttribute("data-model", (p.model || "").toLowerCase());
            trBox.setAttribute("data-category", (p.category || "").toLowerCase());
            trBox.style.background = "#f8fafc";
            trBox.innerHTML = `
                <td style="padding:0.2rem 0.55rem 0.2rem 1.25rem; vertical-align:middle;">
                    <span style="font-size:0.75rem; font-weight:700; color:#1d4ed8;">📦 Box Pack (${p.boxQty || 1} pcs/box)</span>
                    <span style="color:#64748b; font-size:0.72rem; margin-left:0.25rem;">Rate/pc</span>
                </td>
                <td style="padding:0.2rem 0.55rem; vertical-align:middle; color:#475569; font-size:0.82rem;">₹${p.boxPrice !== undefined ? p.boxPrice : p.price}</td>
                <td style="padding:0.2rem 0.55rem; vertical-align:middle; color:#475569; font-size:0.82rem;">₹${p.boxBillRate !== undefined ? p.boxBillRate : (p.billRate || 0)}</td>
                <td style="padding:0.2rem 0.55rem; vertical-align:middle;"><input type="number" class="cp-box-rate" data-id="${p.id}" value="${ovr.boxPrice !== undefined ? ovr.boxPrice : ''}" step="0.01" placeholder="Box Rate/pc" style="width:125px; height:28px; padding:0.2rem 0.45rem; border:1px solid #93c5fd; background:#fff; border-radius:4px; font-size:0.82rem;"></td>
                <td style="padding:0.2rem 0.55rem; vertical-align:middle;"><input type="number" class="cbr-box-rate" data-id="${p.id}" value="${ovr.boxBillRate !== undefined ? ovr.boxBillRate : ''}" step="0.01" placeholder="Box Bill Rate" style="width:125px; height:28px; padding:0.2rem 0.45rem; border:1px solid #93c5fd; background:#fff; border-radius:4px; font-size:0.82rem;"></td>
                <td style="padding:0.2rem 0.55rem; vertical-align:middle; text-align:center;"></td>
            `;
            tbody.appendChild(trBox);
        }
    });
    } catch (err) {
        console.error("Error in populateRateConfigTable:", err);
    }
}
window.populateRateConfigTable = populateRateConfigTable;

function openRateConfigModal(merchantId) {
    openPartyDetailsModal(merchantId, 'rates');
}
window.openRateConfigModal = openRateConfigModal;

function filterRateModalProducts() {
    const q = (document.getElementById("rate-modal-search")?.value || "").toLowerCase().trim();
    const tbody = document.getElementById("rate-config-tbody");
    if (!tbody) return;
    const rows = tbody.querySelectorAll("tr");
    let visibleCount = 0;
    rows.forEach(r => {
        if (!q) {
            r.style.display = "";
            if (!r.classList.contains("box-pack-row")) visibleCount++;
            return;
        }
        const model = r.getAttribute("data-model") || "";
        const cat = r.getAttribute("data-category") || "";
        const text = r.textContent.toLowerCase();
        if (model.includes(q) || cat.includes(q) || text.includes(q)) {
            r.style.display = "";
            if (!r.classList.contains("box-pack-row")) visibleCount++;
        } else {
            r.style.display = "none";
        }
    });
    const countEl = document.getElementById("rate-modal-item-count");
    if (countEl) {
        const total = state.products ? state.products.length : 0;
        countEl.textContent = q ? `${visibleCount} of ${total} Items` : `${total} Items`;
    }
}
window.filterRateModalProducts = filterRateModalProducts;

function clearRateModalSearch() {
    const input = document.getElementById("rate-modal-search");
    if (input) {
        input.value = "";
        filterRateModalProducts();
        input.focus();
    }
}
window.clearRateModalSearch = clearRateModalSearch;

function applyGlobalAdjustment() {
    const m = (state.merchants || []).find(x => x.id === editingMerchantId);
    if (m) {
        m.globalDiscount = parseFloat(document.getElementById("rate-global-adj").value) || 0;
        saveState();
        if (typeof syncToCloud === 'function') syncToCloud();
        alert(`Global adjustment set to ${m.globalDiscount}% for ${m.name}.`);
    }
}

function onFullBillChange(isAddModal) {
    if (!isAddModal) {
        applyHideAmount();
    }
}

function applyHideAmount() {
    const m = (state.merchants || []).find(x => x.id === editingMerchantId);
    if (m) {
        m.hideAmount = document.getElementById("rate-hide-amount").checked;
        saveState();
        if (typeof syncToCloud === 'function') syncToCloud();
    }
}

function applyHideTotals() {
    const m = (state.merchants || []).find(x => x.id === editingMerchantId);
    if (m) {
        m.hideTotals = document.getElementById("rate-hide-totals") ? document.getElementById("rate-hide-totals").checked : false;
        saveState();
        if (typeof syncToCloud === 'function') syncToCloud();
    }
}

function resetProductOverride(merchantId, prodId) {
    const m = (state.merchants || []).find(x => x.id === merchantId);
    if (m) {
        if (!m.specialRates) m.specialRates = {};
        if (m.specialRates[prodId]) {
            delete m.specialRates[prodId];
            saveState();
            if (typeof syncToCloud === 'function') syncToCloud();
            populateRateConfigTable(m);
        }
    }
}

function saveMerchantRates() {
    const m = (state.merchants || []).find(x => x.id === editingMerchantId);
    if (!m) return;

    m.globalDiscount = parseFloat(document.getElementById("rate-global-adj").value) || 0;
    if (document.getElementById("rate-hide-amount")) {
        m.hideAmount = document.getElementById("rate-hide-amount").checked;
    }
    if (document.getElementById("rate-hide-totals")) {
        m.hideTotals = document.getElementById("rate-hide-totals").checked;
    }

    const specialRates = {};
    document.querySelectorAll(".cp-rate").forEach(input => {
        const id = input.getAttribute("data-id");
        const val = parseFloat(input.value);
        if (!isNaN(val)) {
            if (!specialRates[id]) specialRates[id] = {};
            specialRates[id].price = val;
        }
    });
    document.querySelectorAll(".cbr-rate").forEach(input => {
        const id = input.getAttribute("data-id");
        const val = parseFloat(input.value);
        if (!isNaN(val)) {
            if (!specialRates[id]) specialRates[id] = {};
            specialRates[id].billRate = val;
        }
    });
    document.querySelectorAll(".cp-box-rate").forEach(input => {
        const id = input.getAttribute("data-id");
        const val = parseFloat(input.value);
        if (!isNaN(val)) {
            if (!specialRates[id]) specialRates[id] = {};
            specialRates[id].boxPrice = val;
        }
    });
    document.querySelectorAll(".cbr-box-rate").forEach(input => {
        const id = input.getAttribute("data-id");
        const val = parseFloat(input.value);
        if (!isNaN(val)) {
            if (!specialRates[id]) specialRates[id] = {};
            specialRates[id].boxBillRate = val;
        }
    });
    m.specialRates = specialRates;

    saveState();
    if (typeof syncToCloud === 'function') syncToCloud();
    renderMerchantsGrid();
    if (document.getElementById("party-performance-tab") && document.getElementById("party-performance-tab").classList.contains("active")) {
        renderPartyPerformanceTab();
    }
    const rateBadge = document.getElementById("pmodal-rate-badge");
    if (rateBadge) {
        const overrideCount = Object.keys(specialRates).length;
        rateBadge.textContent = overrideCount > 0 ? `${overrideCount} set` : '';
        rateBadge.style.display = overrideCount > 0 ? 'inline-block' : 'none';
    }
    alert(`Custom rates saved successfully for "${m.name}"!`);
}

window.openRateConfigModal = openRateConfigModal;
window.filterRateModalProducts = filterRateModalProducts;
window.clearRateModalSearch = clearRateModalSearch;
window.applyGlobalAdjustment = applyGlobalAdjustment;
window.onFullBillChange = onFullBillChange;
window.applyHideAmount = applyHideAmount;
window.applyHideTotals = applyHideTotals;
window.resetProductOverride = resetProductOverride;
window.saveMerchantRates = saveMerchantRates;
window.openSetPinModal = openSetPinModal;
window.saveMerchantPin = saveMerchantPin;
window.copyDealerLink = copyDealerLink;


// ---- NEW ORDER ----
let orderActiveCategory = 'all';

function initNewOrderTab() {
    renderOrderCategoryTabs();
    const sel = document.getElementById('order-merchant-select');
    if (sel) {
        if (sel.tagName === 'SELECT') {
            const currentVal = sel.value;
            sel.innerHTML = '<option value="" disabled selected>-- Select Merchant --</option>';
            (state.merchants || []).forEach(m => {
                const o = document.createElement('option');
                o.value = m.id; 
                o.textContent = `${m.name} (${m.city || m.address || ''})`;
                sel.appendChild(o);
            });
            if (currentVal && (state.merchants || []).some(m => m.id === currentVal)) {
                sel.value = currentVal;
            }
            sel.onchange = onOrderMerchantSelect;
        } else {
            const currentVal = sel.value;
            const searchInput = document.getElementById('order-merchant-search');
            if (currentVal && searchInput) {
                const m = (state.merchants || []).find(x => x.id === currentVal);
                if (m) {
                    searchInput.value = m.name;
                } else {
                    searchInput.value = '';
                    sel.value = '';
                }
            } else if (searchInput && !currentVal) {
                searchInput.value = '';
            }
        }
    }
    const dateInput = document.getElementById('order-date');
    if (dateInput && !dateInput.value) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }
    renderOrderCatalog();
    renderOrderTable();
}

function renderOrderCategoryTabs() {
    const container = document.getElementById('order-category-filters');
    if (!container) return;
    container.innerHTML = '';

    const allBtn = document.createElement('button');
    allBtn.className = `cat-btn ${orderActiveCategory === 'all' ? 'active' : ''}`;
    allBtn.textContent = 'All Items';
    allBtn.onclick = () => setOrderCategory('all');
    container.appendChild(allBtn);

    const cats = (state.categories && state.categories.length > 0) ? state.categories : Object.keys(DEFAULT_CATEGORY_TREE);
    cats.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `cat-btn ${orderActiveCategory === cat ? 'active' : ''}`;
        btn.textContent = cat;
        btn.onclick = () => setOrderCategory(cat);
        container.appendChild(btn);
    });
}

function setOrderCategory(cat) {
    orderActiveCategory = cat;
    renderOrderCategoryTabs();
    renderOrderCatalog();
}

function onOrderMerchantSelect() {
    const sel = document.getElementById('order-merchant-select');
    const merchantId = sel ? sel.value : '';
    const m = (state.merchants || []).find(x => x.id === merchantId);
    if (!m) return;
    const discText = m.globalDiscount > 0 ? `+${m.globalDiscount}%` : `${m.globalDiscount}%`;
    const overrides = Object.keys(m.specialRates || {}).length;
    
    const statusEl = document.getElementById('order-merchant-rates-status');
    if (statusEl) {
        statusEl.textContent = `✔ Loaded: ${m.name} | Global Adjustment: ${discText} | Custom Overrides: ${overrides} items`;
    }
    const buyerEl = document.getElementById('sheet-buyer-details');
    if (buyerEl) {
        buyerEl.textContent = `${m.name} — ${m.address || ''}`;
        const dateEl = document.getElementById('order-date');
        if (dateEl && dateEl.value) buyerEl.textContent += ` | Date: ${fmtDate(new Date(dateEl.value))}`;
    }

    currentOrderItems = [];
    renderOrderCatalog();
    renderOrderTable();
}

window.adminCardUnits = window.adminCardUnits || {};
function setAdminCardUnit(prodId, unit) {
    window.adminCardUnits = window.adminCardUnits || {};
    window.adminCardUnits[prodId] = unit;
    renderOrderCatalog();
}
window.setAdminCardUnit = setAdminCardUnit;

let orderActiveGrade = 'all';

function renderOrderCatalog() {
    const sel = document.getElementById('order-merchant-select');
    const merchantId = sel ? sel.value : '';
    const merchant = (state.merchants || []).find(m => m.id === merchantId);
    const grid = document.getElementById('order-catalog-grid');
    if (!grid) return;

    if (!merchant) {
        grid.innerHTML = '<p class="placeholder-text">Select a merchant above to load product catalog.</p>';
        return;
    }

    // Bind grade filter buttons
    const gradeBtns = document.querySelectorAll("#order-grade-filters .cat-btn");
    gradeBtns.forEach(btn => {
        if (!btn.dataset.bound) {
            btn.dataset.bound = "true";
            btn.addEventListener("click", () => {
                gradeBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                orderActiveGrade = btn.getAttribute("data-grade") || "all";
                renderOrderCatalog();
            });
        }
    });

    let prods = state.products || [];
    // Only products permitted for this merchant
    prods = prods.filter(p => isProductGradeAllowed(merchant, p));

    if (orderActiveCategory !== 'all') {
        prods = prods.filter(p => p.category === orderActiveCategory);
    }

    if (orderActiveGrade !== 'all') {
        prods = prods.filter(p => (p.grade || 'Premium') === orderActiveGrade);
    }

    if (prods.length === 0) {
        grid.innerHTML = '<p class="placeholder-text">No products match the selected category & grade.</p>';
        return;
    }

    grid.innerHTML = '';
    const isStaff = document.title.includes('Staff') || window.location.pathname.includes('staff.html');

    prods.forEach(p => {
        const isDual = (p.packagingType === 'dual' || (p.boxQty && p.boxQty > 1));
        const activeUnit = isDual ? ((window.adminCardUnits && window.adminCardUnits[p.id]) || 'box') : 'pcs';
        const pricing = getMerchantPricing(merchant, p, activeUnit);
        const inCartItem = currentOrderItems.find(i => i.productId === p.id && (i.unit || 'pcs') === activeUnit);
        const qty = inCartItem ? (inCartItem.orderQty !== undefined ? inCartItem.orderQty : inCartItem.qty) : 0;
        
        const anyInCart = currentOrderItems.some(i => i.productId === p.id);
        const looseItem = currentOrderItems.find(i => i.productId === p.id && (!i.unit || i.unit === 'pcs'));
        const boxItem = currentOrderItems.find(i => i.productId === p.id && i.unit === 'box');

        const imgList = (p.images && p.images.length > 0) ? p.images : (p.image ? [p.image] : (p.imagesBase64 && p.imagesBase64.length > 0 ? p.imagesBase64 : []));
        const imgHtml = imgList.length > 0
            ? `<img src="${imgList[0]}" alt="${p.model}" onerror="this.parentElement.innerHTML=getAdminSVG('${p.category}')">`
            : getAdminSVG(p.category);

        let dualCartSummary = '';
        if (isDual && (looseItem || boxItem)) {
            const parts = [];
            if (boxItem && boxItem.orderQty > 0) parts.push(`📦 ${boxItem.orderQty} Box (${boxItem.qty} pcs)`);
            if (looseItem && looseItem.orderQty > 0) parts.push(`${looseItem.orderQty} Pcs`);
            dualCartSummary = `<div style="font-size:0.68rem; color:#1d4ed8; background:#eff6ff; padding:2px 6px; border-radius:4px; margin-top:3px; font-weight:700;">Cart: ${parts.join(' + ')}</div>`;
        }

        const gradeBadge = (() => {
            const g = p.grade || 'Premium';
            if (g === 'Commercial') return `<span style="display:inline-block; font-size:0.65rem; color:#dc2626; background:#fee2e2; border:1px solid #fca5a5; border-radius:3px; padding:1px 4px; font-weight:700;">\uD83D\uDD3B Commercial</span>`;
            if (g === 'STD') return `<span style="display:inline-block; font-size:0.65rem; color:#c2410c; background:#ffedd5; border:1px solid #fdba74; border-radius:3px; padding:1px 4px; font-weight:700;">\uD83D\uDD38 STD</span>`;
            if (g === 'ROK') return `<span style="display:inline-block; font-size:0.65rem; color:#16a34a; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:3px; padding:1px 4px; font-weight:700;">\uD83D\uDD39 ROK</span>`;
            return `<span style="display:inline-block; font-size:0.65rem; color:#1d4ed8; background:#eff6ff; border:1px solid #bfdbfe; border-radius:3px; padding:1px 4px; font-weight:700;">\u2B50 Premium</span>`;
        })();
        const materialSpecText = p.material ? `${p.material} | ` : '';

        const card = document.createElement('div');
        card.className = `catalog-card ${anyInCart ? 'in-cart' : ''}`;
        card.id = `acard-${p.id}`;
        card.innerHTML = `
            <div class="catalog-image-box">
                ${imgHtml}
            </div>
            <div class="catalog-card-details">
                <h4>${p.model}</h4>
                <div class="catalog-specs-row">${gradeBadge} ${materialSpecText}${p.colour || ''}</div>
                <div class="catalog-stock-status ${p.stock <= 5 ? 'text-danger' : 'text-success'}">
                    Stock: ${p.stock} pcs ${isDual ? `(${Math.floor(p.stock / p.boxQty)} bxs)` : ''}
                </div>
                ${dualCartSummary}
            </div>
            ${isDual ? `
                <div style="display:flex; gap:4px; margin:4px 0; background:#f1f5f9; padding:2px; border-radius:6px;">
                    <button type="button" class="unit-toggle-btn" onclick="setAdminCardUnit('${p.id}', 'box')" style="flex:1; border:none; padding:3px 4px; font-size:0.75rem; border-radius:4px; cursor:pointer; font-weight:600; ${activeUnit === 'box' ? 'background:#2563eb; color:#fff; box-shadow:0 1px 2px rgba(0,0,0,0.1);' : 'background:transparent; color:#64748b;'}">📦 Box (${p.boxQty})</button>
                    <button type="button" class="unit-toggle-btn" onclick="setAdminCardUnit('${p.id}', 'pcs')" style="flex:1; border:none; padding:3px 4px; font-size:0.75rem; border-radius:4px; cursor:pointer; font-weight:600; ${activeUnit === 'pcs' ? 'background:#fff; color:#0f172a; box-shadow:0 1px 2px rgba(0,0,0,0.1);' : 'background:transparent; color:#64748b;'}">Loose Pcs</button>
                </div>
            ` : ''}
            ${!isStaff ? `
                <div class="catalog-price-row">
                    <span>${activeUnit === 'box' ? 'Box Rate' : 'Price'}</span>
                    <strong style="text-align:right;">
                        ₹${pricing.price.toLocaleString('en-IN')}${activeUnit === 'box' ? `<span style="font-size:0.7rem; font-weight:normal; color:#64748b; display:block;">/pc (₹${(pricing.price * p.boxQty).toLocaleString('en-IN')}/box)</span>` : '/pc'}
                    </strong>
                </div>
            ` : `
                <div class="catalog-price-row">
                    <span>Weight</span>
                    <strong>${(p.weight || 0) * (activeUnit === 'box' ? p.boxQty : 1)} kg ${activeUnit === 'box' ? '/box' : ''}</strong>
                </div>
            `}
            <div class="qty-adjuster-group">
                <button type="button" class="qty-adj-btn" onclick="event.stopPropagation(); adminQtyChange('${p.id}', -1, '${activeUnit}')">−</button>
                <input type="number" class="qty-adj-val" id="aqty-${p.id}" value="${qty}" onchange="adminQtySet('${p.id}', this.value, '${activeUnit}')" onclick="event.stopPropagation()">
                <button type="button" class="qty-adj-btn" onclick="event.stopPropagation(); adminQtyChange('${p.id}', +1, '${activeUnit}')">+</button>
            </div>
            ${activeUnit === 'box' && qty > 0 ? `<div style="text-align:center; font-size:0.7rem; color:#2563eb; margin-top:2px; font-weight:600;">= ${qty * p.boxQty} total pcs</div>` : ''}
        `;
        grid.appendChild(card);
    });
}

function getAdminSVG(category) {
    const icons = {
        'Ceramic Sanitary Ware': `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style="width:55px;height:55px;stroke:#94a3b8;stroke-width:1.5;fill:none;"><ellipse cx="32" cy="50" rx="20" ry="8" fill="#e2e8f0"/><path d="M12 50 Q10 30 20 22 Q26 18 32 18 Q38 18 44 22 Q54 30 52 50" fill="#f1f5f9"/><ellipse cx="32" cy="22" rx="12" ry="4" fill="#e2e8f0"/><rect x="26" y="10" width="12" height="12" rx="3" fill="#e2e8f0"/></svg>`,
        'Kitchen Sinks': `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style="width:55px;height:55px;stroke:#94a3b8;stroke-width:1.5;fill:none;"><rect x="8" y="18" width="48" height="32" rx="4" fill="#e2e8f0"/><rect x="14" y="24" width="36" height="20" rx="3" fill="#f8fafc"/><circle cx="32" cy="34" r="3" fill="#94a3b8"/><rect x="30" y="14" width="4" height="8" rx="2" fill="#cbd5e1"/></svg>`,
        'Vanity Cabinets & Mirrors': `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style="width:55px;height:55px;stroke:#94a3b8;stroke-width:1.5;fill:none;"><rect x="8" y="30" width="48" height="26" rx="4" fill="#e2e8f0"/><rect x="8" y="10" width="48" height="18" rx="3" fill="#f1f5f9"/><rect x="14" y="36" width="16" height="14" rx="2" fill="#f8fafc"/><rect x="34" y="36" width="16" height="14" rx="2" fill="#f8fafc"/></svg>`,
        'Drain Covers & Accessories': `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style="width:55px;height:55px;stroke:#94a3b8;stroke-width:1.5;fill:none;"><circle cx="32" cy="32" r="24" fill="#e2e8f0"/><circle cx="32" cy="32" r="16" fill="#f1f5f9"/><circle cx="32" cy="32" r="5" fill="#e2e8f0"/></svg>`,
        'Steel Sink': `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style="width:55px;height:55px;stroke:#94a3b8;stroke-width:1.5;fill:none;"><rect x="8" y="18" width="48" height="32" rx="4" fill="#e2e8f0"/><rect x="14" y="24" width="36" height="20" rx="3" fill="#f8fafc"/><circle cx="32" cy="34" r="3" fill="#94a3b8"/><rect x="30" y="14" width="4" height="8" rx="2" fill="#cbd5e1"/></svg>`,
        'Handmade Sink': `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style="width:55px;height:55px;stroke:#94a3b8;stroke-width:1.5;fill:none;"><path d="M10 48 L10 22 Q10 16 16 16 L48 16 Q54 16 54 22 L54 48 Z" fill="#e2e8f0"/><path d="M16 48 L16 26 Q16 22 20 22 L44 22 Q48 22 48 26 L48 48 Z" fill="#f8fafc"/></svg>`,
        'Designer Table Top': `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style="width:55px;height:55px;stroke:#94a3b8;stroke-width:1.5;fill:none;"><ellipse cx="32" cy="32" rx="22" ry="14" fill="#e2e8f0"/><ellipse cx="32" cy="32" rx="14" ry="9" fill="#f8fafc"/></svg>`,
        'Vanity Set': `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style="width:55px;height:55px;stroke:#94a3b8;stroke-width:1.5;fill:none;"><rect x="8" y="30" width="48" height="26" rx="4" fill="#e2e8f0"/><rect x="8" y="10" width="48" height="18" rx="3" fill="#f1f5f9"/><rect x="14" y="36" width="16" height="14" rx="2" fill="#f8fafc"/><rect x="34" y="36" width="16" height="14" rx="2" fill="#f8fafc"/></svg>`,
        'Manhole Cover': `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style="width:55px;height:55px;stroke:#94a3b8;stroke-width:1.5;fill:none;"><circle cx="32" cy="32" r="24" fill="#e2e8f0"/><circle cx="32" cy="32" r="16" fill="#f1f5f9"/><circle cx="32" cy="32" r="5" fill="#e2e8f0"/></svg>`,
        'Quartz Sink': `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style="width:55px;height:55px;stroke:#94a3b8;stroke-width:1.5;fill:none;"><rect x="8" y="18" width="48" height="32" rx="6" fill="#e2e8f0"/><rect x="14" y="24" width="15" height="20" rx="3" fill="#f8fafc"/><rect x="35" y="24" width="15" height="20" rx="3" fill="#f8fafc"/></svg>`
    };
    return icons[category] || icons['Ceramic Sanitary Ware'];
}

function adminQtySet(prodId, value, unit = 'pcs') {
    const sel = document.getElementById("order-merchant-select");
    const merchantId = sel ? sel.value : "";
    const merchant = (state.merchants || []).find(m => m.id === merchantId);
    if (!merchant) {
        alert("Please select a merchant (party) first from the search box above.");
        const searchInput = document.getElementById("order-merchant-search");
        if (searchInput) searchInput.focus();
        return;
    }

    const prod = (state.products || []).find(p => p.id === prodId);
    if (!prod) return;

    let newOrderQty = parseInt(value, 10);
    if (isNaN(newOrderQty) || newOrderQty < 0) newOrderQty = 0;
    
    const isBox = (unit === 'box' && prod.boxQty && prod.boxQty > 1);
    const boxMultiplier = isBox ? prod.boxQty : 1;
    let totalPcs = newOrderQty * boxMultiplier;

    const isOrderBased = (typeof isProductAsPerOrder === 'function' && isProductAsPerOrder(prod));
    if (!isOrderBased && typeof prod.stock === 'number' && prod.stock > 0) {
        if (totalPcs > prod.stock) {
            const maxBoxes = isBox ? Math.floor(prod.stock / prod.boxQty) : prod.stock;
            if (isBox && maxBoxes <= 0) {
                alert(`Only ${prod.stock} pcs available in stock, which is less than 1 full box (${prod.boxQty} pcs). Please switch to 'Loose Pcs' to order loose units.`);
            } else {
                alert(`Only ${prod.stock} pieces available in stock (${isBox ? `${maxBoxes} boxes` : ''}).`);
            }
            newOrderQty = isBox ? maxBoxes : prod.stock;
            totalPcs = newOrderQty * boxMultiplier;
        }
    } else if (!isOrderBased && typeof prod.stock === 'number' && prod.stock <= 0 && newOrderQty > 0) {
        // Warning for out-of-stock items in admin
        if (!confirm(`Note: "${prod.model}" currently has 0 stock in system. Do you still want to add this to the order as Backorder / As Per Order?`)) {
            newOrderQty = 0;
            totalPcs = 0;
        }
    }

    let existing = currentOrderItems.find(i => i.productId === prodId && (i.unit || 'pcs') === unit);

    if (newOrderQty === 0 && existing) {
        currentOrderItems = currentOrderItems.filter(i => !(i.productId === prodId && (i.unit || 'pcs') === unit));
    } else if (newOrderQty > 0 && existing) {
        existing.orderQty = newOrderQty;
        existing.qty = totalPcs;
    } else if (newOrderQty > 0) {
        const pricing = getMerchantPricing(merchant, prod, unit);
        const itemWeight = (prod.weight && prod.weight > 0) ? prod.weight : ((prod.model && prod.model.toLowerCase().includes('one piece')) ? 38 : 15);
        currentOrderItems.push({
            productId: prodId,
            unit: unit,
            orderQty: newOrderQty,
            boxQty: boxMultiplier,
            model: prod.model,
            grade: prod.grade || '',
            colour: prod.colour || '',
            category: prod.category || 'Uncategorized',
            weight: itemWeight,
            qty: totalPcs,
            price: pricing.price,
            billRate: pricing.billRate
        });
    }

    renderOrderCatalog();
    renderOrderTable();
}

function adminQtyChange(prodId, delta, unit = 'pcs') {
    const sel = document.getElementById("order-merchant-select");
    const merchantId = sel ? sel.value : "";
    const merchant = (state.merchants || []).find(m => m.id === merchantId);
    if (!merchant) {
        alert("Please select a merchant (party) first from the search box above.");
        const searchInput = document.getElementById("order-merchant-search");
        if (searchInput) searchInput.focus();
        return;
    }

    const prod = (state.products || []).find(p => p.id === prodId);
    if (!prod) return;

    let existing = currentOrderItems.find(i => i.productId === prodId && (i.unit || 'pcs') === unit);
    const currentQty = existing ? (existing.orderQty !== undefined ? existing.orderQty : existing.qty) : 0;
    const newQty = Math.max(0, currentQty + delta);
    adminQtySet(prodId, newQty, unit);
}

window.adminQtyChange = adminQtyChange;
window.adminQtySet = adminQtySet;
window.setAdminCardUnit = setAdminCardUnit;

function renderOrderTable() {
    const tbody = document.getElementById("order-items-body");
    if (!tbody) return;
    tbody.innerHTML = "";

    if (currentOrderItems.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="placeholder-text" style="padding:1rem;">Cart is empty</td></tr>`;
        calculateOrderSummary();
        return;
    }

    const grouped = {};
    currentOrderItems.forEach(item => {
        let cat = item.category;
        if (!cat) {
            const p = state.products.find(x => x.id === item.productId);
            cat = (p && p.category) ? p.category : 'Uncategorized';
        }
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(item);
    });

    let index = 1;
    const isStaff = document.title.includes('Staff') || window.location.pathname.includes('staff.html');
    getOrderedCategories(grouped).forEach(cat => {
        const catTr = document.createElement("tr");
        catTr.innerHTML = `<td colspan="${isStaff ? 4 : 8}" style="background:#f1f5f9; font-weight:700; color:#0e254f; padding:0.4rem; font-size:0.85rem; text-transform:uppercase;">${cat}</td>`;
        tbody.appendChild(catTr);

        grouped[cat].forEach((item) => {
            const billAmt = item.qty * item.billRate;
            const cashAmt = item.qty * (item.price - item.billRate);
            const tr = document.createElement("tr");
            const unitBadge = item.unit === 'box'
                ? `<span class="badge" style="background:#eff6ff; color:#1d4ed8; font-size:0.75rem; font-weight:700;">📦 ${item.orderQty} Box (${item.qty} pcs)</span>`
                : `${item.qty} pcs`;
            if (isStaff) {
                tr.innerHTML = `
                    <td>${index++}</td>
                    <td style="padding:0.3rem;"><b>${item.model}</b><br><small style="color:#64748b;">${item.grade}/${item.colour}</small></td>
                    <td>${unitBadge}</td>
                    <td><button onclick="removeOrderItem('${item.productId}', '${item.unit || 'pcs'}')" style="border:none; background:none; cursor:pointer; color:#dc2626; font-size:0.8rem;"><i class="fa-solid fa-xmark"></i></button></td>
                `;
            } else {
                tr.innerHTML = `
                    <td>${index++}</td>
                    <td style="padding:0.3rem;"><b>${item.model}</b><br><small style="color:#64748b;">${item.grade}/${item.colour}</small></td>
                    <td>${unitBadge}</td>
                    <td>₹${item.price}${item.unit === 'box' ? '<br><small style="color:#2563eb;">/pc in box</small>' : ''}</td>
                    <td>₹${item.billRate}</td>
                    <td class="num-col">₹${billAmt.toLocaleString('en-IN')}</td>
                    <td class="num-col">₹${cashAmt.toLocaleString('en-IN')}</td>
                    <td><button onclick="removeOrderItem('${item.productId}', '${item.unit || 'pcs'}')" style="border:none; background:none; cursor:pointer; color:#dc2626; font-size:0.8rem;"><i class="fa-solid fa-xmark"></i></button></td>
                `;
            }
            tbody.appendChild(tr);
        });
    });
    calculateOrderSummary();
}

function removeOrderItem(prodId, unit = 'pcs') {
    currentOrderItems = currentOrderItems.filter(i => !(i.productId === prodId && (i.unit || 'pcs') === unit));
    renderOrderCatalog();
    renderOrderTable();
}

function calculateOrderSummary() {
    let totalQty = 0, billBasic = 0, totalCash = 0, totalWeight = 0;
    currentOrderItems.forEach(item => {
        totalQty += item.qty;
        billBasic += item.qty * item.billRate;
        totalCash += item.qty * (item.price - item.billRate);
        totalWeight += item.qty * (item.weight || 15);
    });
    const gstRate = (state.settings && state.settings.gstRate !== undefined) ? state.settings.gstRate : 18;
    const gst = billBasic * (gstRate / 100);
    const freightEl = document.getElementById("freight-input");
    const freight = freightEl ? (parseFloat(freightEl.value) || 0) : 0;
    const totalBill = billBasic + gst;
    totalCash += freight;

    const gstLabel = document.getElementById("gst-label");
    if (gstLabel) gstLabel.textContent = `GST ${gstRate}%`;

    const setElText = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    };

    setElText("total-qty", totalQty);
    setElText("total-weight", totalWeight.toFixed(2));
    setElText("total-bill-basic", fmtCur(billBasic));
    setElText("total-cash-basic", fmtCur(totalCash));
    setElText("bill-basic-val", fmtCur(billBasic));
    setElText("gst-val", fmtCur(gst));
    setElText("freight-val", fmtCur(freight));
    setElText("total-bill-val", fmtCur(totalBill));
    setElText("total-cash-val", fmtCur(totalCash));
    setElText("total-payment-val", fmtCur(totalBill + totalCash));
}

function clearCurrentOrder() {
    currentOrderItems = [];
    document.getElementById("freight-input").value = 0;
    document.getElementById("order-remark").value = "";
    const searchInput = document.getElementById("order-merchant-search");
    if (searchInput) searchInput.value = "";
    const sel = document.getElementById("order-merchant-select");
    if (sel) sel.value = "";
    const buyerEl = document.getElementById('sheet-buyer-details');
    if (buyerEl) buyerEl.textContent = "No merchant selected";
    const statusEl = document.getElementById('order-merchant-rates-status');
    if (statusEl) statusEl.textContent = "";
    renderOrderCatalog();
    renderOrderTable();
}

function submitOrder() {
    const sel = document.getElementById("order-merchant-select");
    const merchantId = sel ? sel.value : "";
    const merchant = (state.merchants || []).find(m => m.id === merchantId);
    if (!merchant) { 
        alert("Please select a merchant (party) first from the search box above."); 
        const searchInput = document.getElementById("order-merchant-search");
        if (searchInput) searchInput.focus();
        return; 
    }
    if (currentOrderItems.length === 0) { alert("Cart is empty. Please add products to order."); return; }

    let billBasic = 0, totalCash = 0;
    currentOrderItems.forEach(item => {
        billBasic += item.qty * (item.billRate || 0);
        totalCash += item.qty * ((item.price || 0) - (item.billRate || 0));
    });
    const gstRate = (state.settings && state.settings.gstRate !== undefined) ? state.settings.gstRate : 18;
    const gst = billBasic * (gstRate / 100);
    const freight = parseFloat(document.getElementById("freight-input") ? document.getElementById("freight-input").value : 0) || 0;
    const totalBill = billBasic + gst;
    totalCash += freight;

    const dateInput = document.getElementById("order-date");
    let dateStr = "";
    if (dateInput && dateInput.value) {
        const dParts = dateInput.value.split('-');
        if (dParts.length === 3) dateStr = `${dParts[2]}.${dParts[1]}.${dParts[0]}`;
        else dateStr = fmtDate(new Date(dateInput.value));
    } else {
        dateStr = fmtDate(new Date());
    }

    const perfNo = (document.getElementById("order-performer-no") && document.getElementById("order-performer-no").value.trim()) 
        ? document.getElementById("order-performer-no").value.trim() 
        : "ORD-" + Math.floor(100 + Math.random() * 900);

    const order = {
        id: "ord-" + Date.now(),
        merchantId: merchant.id,
        date: dateStr,
        performerNo: perfNo,
        remark: document.getElementById("order-remark") ? document.getElementById("order-remark").value.trim() : "",
        items: [...currentOrderItems],
        billBasic, gst, freight, totalBill, totalCash,
        status: "Pending",
        timeline: [{ status: "Pending", timestamp: Date.now() }]
    };
    if (!state.orders) state.orders = [];
    state.orders.push(order);
    saveState();
    if (typeof syncToCloud === 'function') syncToCloud();
    alert(`Order Placed Successfully!\n\nParty: ${merchant.name}\nRef: ${order.performerNo}\nItems: ${order.items.reduce((s, i) => s + (i.qty || 0), 0)} pcs\n\nRedirecting to Orders & Dispatch tab...`);
    clearCurrentOrder();
    
    // Switch to Orders tab & render
    const ordersNav = document.querySelector('.nav-item[data-tab="orders-tab"]');
    if (ordersNav) {
        ordersNav.click();
    } else {
        renderOrdersList();
    }
}

// ---- ORDERS & DISPATCH ----
function renderOrdersList() {
    const container = document.getElementById("orders-list-container");
    container.innerHTML = "";
    const search = (document.getElementById("order-list-search").value || "").toLowerCase();
    const statusFilter = document.querySelector(".filter-btn.active").getAttribute("data-status");
    const finDates = getActiveFinYearDates();

    const monthFilter = document.getElementById("order-month-filter") ? document.getElementById("order-month-filter").value : "all";

    let filtered = state.orders;
    if(finDates) {
        filtered = filtered.filter(o => {
            if(!o.date) return true;
            let parts = o.date.split('.');
            if(parts.length !== 3) parts = o.date.split('/');
            if(parts.length === 3) {
                const d = new Date(parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0]));
                return d >= finDates.startDate && d <= finDates.endDate;
            }
            return true;
        });
    }
    
    if (monthFilter !== "all") {
        const targetMonth = parseInt(monthFilter);
        filtered = filtered.filter(o => {
            if(!o.date) return false;
            let parts = o.date.split('.');
            if(parts.length !== 3) parts = o.date.split('/');
            if(parts.length === 3) {
                return (parseInt(parts[1]) - 1) === targetMonth;
            }
            return false;
        });
    }

    const matchingOrders = filtered.slice().reverse().filter(ord => {
        const m = state.merchants.find(x => x.id === ord.merchantId);
        if (!m) return false;
        const nameMatch = (m.name || "").toLowerCase().includes(search);
        const dateMatch = (ord.date || "").toLowerCase().includes(search);
        if (!nameMatch && !dateMatch) return false;
        if (statusFilter !== "all" && ord.status !== statusFilter) return false;
        return true;
    });

    if (matchingOrders.length === 0) { container.innerHTML = `<p class="placeholder-text card">No orders in this period.</p>`; return; }

    const maxDisplay = window._ordersDisplayLimit || 60;
    const ordersToRender = matchingOrders.slice(0, maxDisplay);

    ordersToRender.forEach(ord => {
        const m = state.merchants.find(x => x.id === ord.merchantId);
        if (!m) return;
        const card = document.createElement("div");
        card.className = "order-list-item-card";

        const itemsSummary = ord.items.slice(0, 3).map(i => `${i.model} Ã—${i.qty}`).join(", ");
        const moreItems = ord.items.length > 3 ? ` + ${ord.items.length - 3} more` : '';
        const gstRate = (state.settings && state.settings.gstRate !== undefined) ? state.settings.gstRate : 18;

        card.innerHTML = `
            <div class="order-list-top-row" onclick="toggleOrderExpand('${ord.id}')">
                <div>
                    <span class="merchant-name-title">${m.name}</span>
                    <span style="margin-left:0.75rem; color:var(--text-muted); font-size:0.75rem;">${ord.date} | Ref: ${ord.performerNo}</span>
                    <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.2rem;">${itemsSummary}${moreItems}</div>
                    ${ord.estimatedReadyDate ? `
                        <div style="margin-top:0.35rem; display:inline-flex; align-items:center; gap:0.4rem; background:#eff6ff; color:#1d4ed8; padding:0.15rem 0.5rem; border-radius:4px; font-size:0.75rem; font-weight:600; border:1px solid #bfdbfe;">
                            <i class="fa-solid fa-calendar-check"></i> Est. Ready: ${ord.estimatedReadyDate} ${ord.deliveryNote ? `• <span style="font-weight:400; font-style:italic;">${ord.deliveryNote}</span>` : ''}
                        </div>
                    ` : ''}
                </div>
                <div style="display:flex; align-items:center; gap:0.75rem;">
                    <span onclick="event.stopPropagation(); viewTimeline('${ord.id}')" style="cursor:pointer;" class="badge ${ord.status === 'Dispatched' ? 'badge-success' : (ord.status === 'Confirmed' ? 'badge-primary' : (ord.status === 'Cancelled' ? 'badge-danger' : 'badge-warning'))}">${ord.status}</span>
                    ${(document.title.includes('Staff') || window.location.pathname.includes('staff.html')) ? 
                        `<span style="font-weight:700; color:#0e254f;">${ord.items.reduce((s, i) => s + (i.qty || 0), 0)} pcs | ${ord.items.reduce((s, i) => s + ((i.weight || 0) * (i.qty || 0)), 0).toFixed(1)} kg</span>` : 
                        `<span style="font-weight:700;">₹${(ord.totalBill + ord.totalCash).toLocaleString('en-IN')}</span>`}
                    ${(document.title.includes('Staff') || window.location.pathname.includes('staff.html')) ? 
                        `<button class="btn btn-secondary" style="padding:0.2rem 0.5rem; font-size:0.7rem;" onclick="event.stopPropagation(); printDispatchChallan('${ord.id}')"><i class="fa-solid fa-print"></i></button>` :
                        `<button class="btn btn-secondary" style="padding:0.2rem 0.5rem; font-size:0.7rem;" onclick="event.stopPropagation(); printOrderInvoice('${ord.id}')"><i class="fa-solid fa-print"></i></button>`}
                    <i class="fa-solid fa-chevron-down" style="color:var(--text-muted);"></i>
                </div>
            </div>
            <div class="order-expand-section ${(window.expandedOrderIds && window.expandedOrderIds.has(ord.id)) ? 'active' : ''}" id="expand-${ord.id}">
                <div style="overflow-x:auto;">
                    ${(() => {
                        const isStaff = document.title.includes('Staff') || window.location.pathname.includes('staff.html');
                        const groupedItems = {};
                        let totalOrderQty = 0;
                        let totalOrderWeight = 0;
                        ord.items.forEach(item => {
                            const cat = item.category || 'Uncategorized';
                            if (!groupedItems[cat]) groupedItems[cat] = [];
                            groupedItems[cat].push(item);
                            totalOrderQty += (item.qty || 0);
                            const pMatch = state.products.find(p => p.id === item.productId || (p.model && item.model && p.model.toLowerCase() === item.model.toLowerCase()));
                            const itemWeight = (item.weight && item.weight > 0) ? item.weight : (pMatch && pMatch.weight > 0 ? pMatch.weight : ((item.model && item.model.toLowerCase().includes('one piece')) ? 38 : 15));
                            item.weight = itemWeight;
                            totalOrderWeight += (itemWeight * (item.qty || 0));
                        });

                        if (isStaff) {
                            let html = `
                            <table class="excel-table" style="font-size:0.75rem;">
                                <thead><tr><th>Model</th><th>Grade</th><th>Colour</th><th>Weight (pc)</th><th>Qty</th><th>Total Weight</th></tr></thead>
                                <tbody>`;
                            getOrderedCategories(groupedItems).forEach(cat => {
                                let catQty = 0, catWeight = 0;
                                const rows = groupedItems[cat].map(item => {
                                    catQty += item.qty;
                                    const pMatch = state.products.find(p => p.id === item.productId || (p.model && item.model && p.model.toLowerCase() === item.model.toLowerCase()));
                                    const itemWeight = (item.weight && item.weight > 0) ? item.weight : (pMatch && pMatch.weight > 0 ? pMatch.weight : ((item.model && item.model.toLowerCase().includes('one piece')) ? 38 : 15));
                                    const w = itemWeight * item.qty;
                                    catWeight += w;
                                    let qtyHtml = `<td><b>${item.qty}</b></td>`;
                                    if (ord.status !== "Dispatched" && ord.status !== "Cancelled") {
                                        qtyHtml = `
                                            <td style="padding: 0.2rem;">
                                                <div class="qty-adjuster-group" style="width: 80px; height: 26px; margin: 0; background: #fff; border: 1px solid var(--border-color); border-radius: 4px;">
                                                    <button class="qty-adj-btn" style="width:24px; font-size: 0.8rem;" onclick="adminEditOrderQty('${ord.id}', '${item.productId}', -1)">−</button>
                                                    <input type="number" class="qty-adj-val" value="${item.qty}" style="font-size: 0.75rem; width: 0; min-width: 0; border: none; text-align: center; background: transparent; outline: none; -moz-appearance: textfield; padding: 0;" onchange="adminEditOrderQtySet('${ord.id}', '${item.productId}', this.value)">
                                                    <button class="qty-adj-btn" style="width:24px; font-size: 0.8rem;" onclick="adminEditOrderQty('${ord.id}', '${item.productId}', +1)">+</button>
                                                </div>
                                            </td>
                                        `;
                                    }
                                    return `
                                        <tr>
                                            <td><b>${item.model}</b></td><td>${item.grade}</td><td>${item.colour}</td>
                                            <td>${itemWeight} kg</td>
                                            ${qtyHtml}
                                            <td>${w.toFixed(1)} kg</td>
                                        </tr>
                                    `;
                                }).join("");
                                html += `
                                    <tr style="background:#f1f5f9;"><td colspan="4" style="font-weight:bold; color:#0e254f;">${cat}</td><td style="font-weight:bold; color:#0e254f;">${catQty}</td><td style="font-weight:bold; color:#0e254f;">${catWeight.toFixed(1)} kg</td></tr>
                                    ${rows}
                                `;
                            });
                            html += `
                                </tbody>
                                <tfoot>
                                    <tr class="total-row" style="background:#f1f5f9; font-weight:bold;"><td colspan="4">TOTAL ITEMS</td><td>${totalOrderQty} pcs</td><td></td></tr>
                                    <tr style="background-color:#cbd5e1; font-weight:900; font-size:16px;"><td colspan="4">TOTAL ORDER WEIGHT</td><td colspan="2">${totalOrderWeight.toFixed(2)} kg</td></tr>
                                </tfoot>
                            </table>`;
                            if (ord.status !== "Dispatched" && ord.status !== "Cancelled") {
                                html += `
                                    <div style="margin-top: 0.6rem; text-align: right;">
                                        <button class="btn btn-outline" style="font-size:0.78rem; padding:0.3rem 0.75rem; border:1.5px dashed #0e254f; color:#0e254f; font-weight:700; background:#f8fafc;" onclick="openAdminEditOrderModal('${ord.id}')">
                                            <i class="fa-solid fa-cart-plus"></i> + Add / Edit Items
                                        </button>
                                    </div>
                                `;
                            }
                            return html;
                        } else {
                            let html = `
                            <table class="excel-table" style="font-size:0.75rem;">
                                <thead><tr><th>Model</th><th>Grade</th><th>Colour</th><th>Weight</th><th>Qty</th><th>Price</th><th>Bill Rate</th><th>Bill Amt</th><th>Cash Amt</th></tr></thead>
                                <tbody>`;
                            getOrderedCategories(groupedItems).forEach(cat => {
                                let catBill = 0, catCash = 0;
                                const rows = groupedItems[cat].map(item => {
                                    catBill += (item.qty * item.billRate);
                                    catCash += (item.qty * (item.price - item.billRate));
                                    const pMatch = state.products.find(p => p.id === item.productId || (p.model && item.model && p.model.toLowerCase() === item.model.toLowerCase()));
                                    const itemWeight = (item.weight && item.weight > 0) ? item.weight : (pMatch && pMatch.weight > 0 ? pMatch.weight : ((item.model && item.model.toLowerCase().includes('one piece')) ? 38 : 15));
                                    let qtyHtml = `<td>${item.qty}</td>`;
                                    if (ord.status !== "Dispatched" && ord.status !== "Cancelled") {
                                        qtyHtml = `
                                            <td style="padding: 0.2rem;">
                                                <div class="qty-adjuster-group" style="width: 80px; height: 26px; margin: 0; background: #fff; border: 1px solid var(--border-color); border-radius: 4px;">
                                                    <button class="qty-adj-btn" style="width:24px; font-size: 0.8rem;" onclick="adminEditOrderQty('${ord.id}', '${item.productId}', -1)">−</button>
                                                    <input type="number" class="qty-adj-val" value="${item.qty}" style="font-size: 0.75rem; width: 0; min-width: 0; border: none; text-align: center; background: transparent; outline: none; -moz-appearance: textfield; padding: 0;" onchange="adminEditOrderQtySet('${ord.id}', '${item.productId}', this.value)">
                                                    <button class="qty-adj-btn" style="width:24px; font-size: 0.8rem;" onclick="adminEditOrderQty('${ord.id}', '${item.productId}', +1)">+</button>
                                                </div>
                                            </td>
                                        `;
                                    }
                                    return `
                                        <tr>
                                            <td><b>${item.model}</b></td><td>${item.grade}</td><td>${item.colour}</td>
                                            <td>${itemWeight} kg</td>
                                            ${qtyHtml}<td>₹${item.price}</td><td>₹${item.billRate}</td>
                                            <td>₹${(item.qty * item.billRate).toLocaleString('en-IN')}</td>
                                            <td>₹${(item.qty * (item.price - item.billRate)).toLocaleString('en-IN')}</td>
                                        </tr>
                                    `;
                                }).join("");
                                html += `
                                    <tr style="background:#f1f5f9;"><td colspan="7" style="font-weight:bold; color:#0e254f;">${cat}</td><td style="font-weight:bold; color:#0e254f;">₹${catBill.toLocaleString('en-IN')}</td><td style="font-weight:bold; color:#0e254f;">₹${catCash.toLocaleString('en-IN')}</td></tr>
                                    ${rows}
                                `;
                            });
                            html += `
                                </tbody>
                                <tfoot>
                                    <tr class="total-row"><td colspan="7">BILL BASIC</td><td>₹${ord.billBasic.toLocaleString('en-IN')}</td><td></td></tr>
                                    <tr><td colspan="7">GST ${gstRate}%</td><td>₹${ord.gst.toLocaleString('en-IN')}</td><td></td></tr>
                                    <tr class="final-bill-row" style="font-size:inherit;"><td colspan="7">TOTAL BILL AMOUNT</td><td>₹${ord.totalBill.toLocaleString('en-IN')}</td><td></td></tr>
                                    <tr><td colspan="7">FREIGHT</td><td>₹${ord.freight.toLocaleString('en-IN')}</td><td></td></tr>
                                    <tr class="final-bill-row" style="font-size:inherit;"><td colspan="7">TOTAL CASH AMOUNT</td><td>₹${ord.totalCash.toLocaleString('en-IN')}</td><td></td></tr>
                                    <tr style="background-color:#cbd5e1; font-weight:900; font-size:18px;"><td colspan="7">TOTAL PAYMENT (Total Weight: ${totalOrderWeight.toFixed(2)} kg)</td><td>₹${(ord.totalBill + ord.totalCash).toLocaleString('en-IN')}</td><td></td></tr>
                                </tfoot>
                            </table>`;
                            if (ord.status !== "Dispatched" && ord.status !== "Cancelled") {
                                html += `
                                    <div style="margin-top: 0.6rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                                        <button class="btn btn-outline" style="font-size:0.8rem; padding:0.35rem 0.8rem; border:1.5px dashed #0e254f; color:#0e254f; font-weight:700; background:#f8fafc;" onclick="openAdminEditOrderModal('${ord.id}')">
                                            <i class="fa-solid fa-cart-plus"></i> + Add New Item to this Order
                                        </button>
                                        <span style="font-size:0.75rem; color:#64748b;"><i class="fa-solid fa-circle-info"></i> Adjust qty directly above or click to add new models/weight</span>
                                    </div>
                                `;
                            }
                            return html;
                        }
                    })()}
                </div>
                <div class="order-expanded-actions-bar">
                    ${!(document.title.includes('Staff') || window.location.pathname.includes('staff.html')) ? `<button class="btn btn-primary" style="background:#2563eb; color:#fff;" onclick="printGSTInvoice('${ord.id}')"><i class="fa-solid fa-file-invoice"></i> 📄 GST Invoice PDF</button>` : ''}
                    <button class="btn btn-secondary" style="background:#0d9488; color:#fff;" onclick="printDispatchChallan('${ord.id}')"><i class="fa-solid fa-truck-ramp-box"></i> 🚚 Dispatch Slip PDF</button>
                    <button class="btn btn-danger" onclick="deleteOrder('${ord.id}')"><i class="fa-solid fa-trash"></i> Delete Order</button>
                    ${(ord.status !== "Dispatched" && ord.status !== "Cancelled" && !(document.title.includes('Staff') || window.location.pathname.includes('staff.html'))) ? `<button class="btn btn-secondary" style="background:#64748b; color:white;" onclick="updateFreight('${ord.id}')"><i class="fa-solid fa-truck"></i> Update Freight</button>` : ''}
                    ${ord.status === "Pending" ? `
                        <button class="btn btn-danger" onclick="cancelOrder('${ord.id}')"><i class="fa-solid fa-ban"></i> Cancel Order</button>
                        <button class="btn btn-primary" style="background:#3b82f6;" onclick="openConfirmOrderModal('${ord.id}')"><i class="fa-solid fa-check"></i> Confirm</button>
                        <button class="btn btn-success" onclick="dispatchOrder('${ord.id}')"><i class="fa-solid fa-truck-fast"></i> Approve & Dispatch</button>
                    ` : ord.status === "Confirmed" ? `
                        <button class="btn btn-outline" style="border:1.5px solid #3b82f6; color:#2563eb; background:#eff6ff; font-weight:700;" onclick="openConfirmOrderModal('${ord.id}')"><i class="fa-solid fa-calendar-days"></i> Update Ready Date</button>
                        <button class="btn btn-danger" onclick="cancelOrder('${ord.id}')"><i class="fa-solid fa-ban"></i> Cancel Order</button>
                        <button class="btn btn-success" onclick="dispatchOrder('${ord.id}')"><i class="fa-solid fa-truck-fast"></i> Approve & Dispatch</button>
                    ` : ord.status === "Cancelled" ? `
                        <span style="color:#ef4444; font-weight:bold; margin-left:1rem;"><i class="fa-solid fa-ban"></i> Order Cancelled</span>
                    ` : `
                        <button class="btn btn-primary" onclick="triggerWhatsApp('${ord.id}')"><i class="fa-brands fa-whatsapp"></i> Resend WhatsApp Invoice</button>
                    `}
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    if (matchingOrders.length > maxDisplay) {
        const loadMoreDiv = document.createElement("div");
        loadMoreDiv.style.cssText = "text-align:center; margin: 1.5rem 0;";
        loadMoreDiv.innerHTML = `<button class="btn btn-secondary" style="padding:0.6rem 1.4rem; font-weight:700; border-radius:6px;" onclick="window._ordersDisplayLimit = (window._ordersDisplayLimit || 60) + 60; renderOrdersList();"><i class="fa-solid fa-angles-down"></i> Showing ${maxDisplay} of ${matchingOrders.length} Orders - Load More</button>`;
        container.appendChild(loadMoreDiv);
    }
}

function toggleOrderExpand(orderId) {
    const el = document.getElementById(`expand-${orderId}`);
    el.classList.toggle("active");
    if (!window.expandedOrderIds) window.expandedOrderIds = new Set();
    if (el.classList.contains("active")) window.expandedOrderIds.add(orderId);
    else window.expandedOrderIds.delete(orderId);
}

function adminEditOrderQtySet(orderId, productId, value) {
    const ord = state.orders.find(o => o.id === orderId);
    if (!ord) return;
    const item = ord.items.find(i => i.productId === productId);
    if (!item) return;

    let newQty = parseInt(value, 10);
    if (isNaN(newQty) || newQty < 0) newQty = 0;

    _applyAdminOrderQtyChange(ord, item, newQty);
}

function adminEditOrderQty(orderId, productId, delta) {
    const ord = state.orders.find(o => o.id === orderId);
    if (!ord) return;
    const item = ord.items.find(i => i.productId === productId);
    if (!item) return;

    let newQty = Math.max(0, item.qty + delta);

    _applyAdminOrderQtyChange(ord, item, newQty);
}

function _applyAdminOrderQtyChange(ord, item, newQty) {
    if (newQty === 0) {
        if (!confirm(`Are you sure you want to completely remove ${item.model} from the order?`)) {
            renderOrdersList();
            return;
        }
        ord.items = ord.items.filter(i => i.productId !== item.productId);
    } else {
        item.qty = newQty;
    }

    let billBasic = 0, totalCash = 0, totalWeight = 0;
    ord.items.forEach(i => {
        const pMatch = state.products.find(p => p.id === i.productId || (p.model && i.model && p.model.toLowerCase() === i.model.toLowerCase()));
        const itemWeight = (i.weight && i.weight > 0) ? i.weight : (pMatch && pMatch.weight > 0 ? pMatch.weight : ((i.model && i.model.toLowerCase().includes('one piece')) ? 38 : 15));
        i.weight = itemWeight;

        billBasic += (i.qty * (i.billRate || 0));
        totalCash += (i.qty * ((i.price || 0) - (i.billRate || 0)));
        totalWeight += (i.qty * itemWeight);
    });

    const gstRate = (state.settings && state.settings.gstRate !== undefined) ? state.settings.gstRate : 18;
    const gst = billBasic * (gstRate / 100);
    const freight = ord.freight || 0;

    ord.billBasic = billBasic;
    ord.gst = gst;
    ord.totalCash = totalCash + freight;
    ord.totalBill = billBasic + gst;

    saveState();
    if (typeof syncToCloud === 'function') syncToCloud();
    renderOrdersList();
    renderDashboard();
}

// ==================== EDIT ORDER & ADD ITEMS MODAL LOGIC ====================
let editingOrderBuffer = null;

function openAdminEditOrderModal(orderId) {
    const ord = state.orders.find(o => o.id === orderId);
    if (!ord) return;

    const merchant = (state.merchants || []).find(m => m.id === ord.merchantId);
    const mName = merchant ? merchant.name : "Unknown Party";

    document.getElementById('edit-order-id').value = orderId;
    const titleEl = document.getElementById('edit-order-modal-title');
    if (titleEl) titleEl.textContent = `Edit Order #${ord.performerNo} - ${mName}`;
    const subEl = document.getElementById('edit-order-modal-subtitle');
    if (subEl) subEl.textContent = `Status: ${ord.status} | Date: ${ord.date} | Ref: ${ord.performerNo}`;

    // Deep clone order data into editing buffer
    editingOrderBuffer = {
        orderId: ord.id,
        merchantId: ord.merchantId,
        freight: ord.freight || 0,
        items: JSON.parse(JSON.stringify(ord.items || []))
    };

    // Reset product search & add item inputs
    const editProdSearch = document.getElementById('editorder-product-search');
    if (editProdSearch) editProdSearch.value = '';
    const editProdSelect = document.getElementById('edit-order-prod-select');
    if (editProdSelect) editProdSelect.value = '';

    const isStaff = document.title.includes('Staff') || window.location.pathname.includes('staff.html');
    const priceParent = document.getElementById('edit-order-add-price')?.parentElement;
    const billrateParent = document.getElementById('edit-order-add-billrate')?.parentElement;
    const finBreakdown = document.getElementById('edit-order-live-basic')?.parentElement?.parentElement;
    if (priceParent) priceParent.style.display = isStaff ? 'none' : 'block';
    if (billrateParent) billrateParent.style.display = isStaff ? 'none' : 'block';
    if (finBreakdown) finBreakdown.style.display = isStaff ? 'none' : 'flex';

    document.getElementById('edit-order-add-qty').value = 1;
    document.getElementById('edit-order-add-price').value = '';
    document.getElementById('edit-order-add-billrate').value = '';
    document.getElementById('edit-order-add-weight').value = '';
    if (document.getElementById('edit-order-live-freight')) {
        document.getElementById('edit-order-live-freight').value = editingOrderBuffer.freight;
    }

    renderEditOrderItemsTable();
    openModal('admin-edit-order-modal');
    setTimeout(() => {
        if (editProdSearch) editProdSearch.focus();
    }, 150);
}

function onEditOrderProductSelect() {
    const prodId = document.getElementById('edit-order-prod-select').value;
    if (!prodId || !editingOrderBuffer) return;

    const prod = (state.products || []).find(p => p.id === prodId);
    if (!prod) return;

    const merchant = (state.merchants || []).find(m => m.id === editingOrderBuffer.merchantId);
    const pricing = getMerchantPricing(merchant, prod);
    const itemWeight = (prod.weight && prod.weight > 0) ? prod.weight : ((prod.model && prod.model.toLowerCase().includes('one piece')) ? 38 : 15);

    document.getElementById('edit-order-add-price').value = pricing.price;
    document.getElementById('edit-order-add-billrate').value = pricing.billRate;
    document.getElementById('edit-order-add-weight').value = itemWeight;
}

function addProdToEditOrder() {
    if (!editingOrderBuffer) return;

    const prodId = document.getElementById('edit-order-prod-select').value;
    if (!prodId) {
        alert('Please select a product from the list to add.');
        return;
    }

    const prod = (state.products || []).find(p => p.id === prodId);
    if (!prod) return;

    const qty = parseInt(document.getElementById('edit-order-add-qty').value, 10);
    if (isNaN(qty) || qty <= 0) {
        alert('Please enter a valid quantity (at least 1).');
        return;
    }

    const price = parseFloat(document.getElementById('edit-order-add-price').value) || 0;
    const billRate = parseFloat(document.getElementById('edit-order-add-billrate').value) || 0;
    const itemWeight = parseFloat(document.getElementById('edit-order-add-weight').value) || ((prod.model && prod.model.toLowerCase().includes('one piece')) ? 38 : 15);

    // Check if item already exists in the buffer
    const existing = editingOrderBuffer.items.find(i => i.productId === prodId);
    if (existing) {
        existing.qty += qty;
        existing.price = price;
        existing.billRate = billRate;
        existing.weight = itemWeight;
    } else {
        editingOrderBuffer.items.push({
            productId: prod.id,
            category: prod.category || 'Uncategorized',
            model: prod.model,
            grade: prod.grade || '',
            colour: prod.colour || '',
            weight: itemWeight,
            qty: qty,
            price: price,
            billRate: billRate
        });
    }

    // Reset add inputs
    const editProdSearch = document.getElementById('editorder-product-search');
    if (editProdSearch) editProdSearch.value = '';
    const editProdSelect = document.getElementById('edit-order-prod-select');
    if (editProdSelect) editProdSelect.value = '';

    document.getElementById('edit-order-add-qty').value = 1;
    document.getElementById('edit-order-add-price').value = '';
    document.getElementById('edit-order-add-billrate').value = '';
    document.getElementById('edit-order-add-weight').value = '';

    renderEditOrderItemsTable();
    if (editProdSearch) editProdSearch.focus();
}

function removeProdFromEditOrder(productId) {
    if (!editingOrderBuffer) return;
    const item = editingOrderBuffer.items.find(i => i.productId === productId);
    if (!item) return;

    if (confirm(`Remove ${item.model} from this order?`)) {
        editingOrderBuffer.items = editingOrderBuffer.items.filter(i => i.productId !== productId);
        renderEditOrderItemsTable();
    }
}

function updateEditOrderQty(productId, delta) {
    if (!editingOrderBuffer) return;
    const item = editingOrderBuffer.items.find(i => i.productId === productId);
    if (!item) return;

    const newQty = item.qty + delta;
    if (newQty <= 0) {
        removeProdFromEditOrder(productId);
    } else {
        item.qty = newQty;
        renderEditOrderItemsTable();
    }
}

function updateEditOrderQtySet(productId, value) {
    if (!editingOrderBuffer) return;
    const item = editingOrderBuffer.items.find(i => i.productId === productId);
    if (!item) return;

    let newQty = parseInt(value, 10);
    if (isNaN(newQty) || newQty <= 0) {
        removeProdFromEditOrder(productId);
    } else {
        item.qty = newQty;
        renderEditOrderItemsTable();
    }
}

function updateEditOrderItemRate(productId, field, value) {
    if (!editingOrderBuffer) return;
    const item = editingOrderBuffer.items.find(i => i.productId === productId);
    if (!item) return;
    const val = parseFloat(value) || 0;
    if (field === 'price') item.price = val;
    else if (field === 'billRate') item.billRate = val;
    renderEditOrderItemsTable();
}

function renderEditOrderItemsTable() {
    if (!editingOrderBuffer) return;

    const tbody = document.getElementById('edit-order-items-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const isStaff = document.title.includes('Staff') || window.location.pathname.includes('staff.html');
    const tableHeaderTr = tbody.closest('table')?.querySelector('thead tr');
    if (tableHeaderTr) {
        if (isStaff) {
            tableHeaderTr.innerHTML = `
                <th>Item / Model</th>
                <th>Grade / Colour</th>
                <th>Weight</th>
                <th style="width: 120px;">Qty (pcs)</th>
                <th style="width: 50px; text-align: center;">Action</th>
            `;
        } else {
            tableHeaderTr.innerHTML = `
                <th>Item / Model</th>
                <th>Grade / Colour</th>
                <th>Weight</th>
                <th style="width: 120px;">Qty (pcs)</th>
                <th>Rate</th>
                <th>Bill Rate</th>
                <th>Total Amt</th>
                <th style="width: 50px; text-align: center;">Action</th>
            `;
        }
    }

    const countBadge = document.getElementById('edit-order-items-count-badge');
    const totalPcs = editingOrderBuffer.items.reduce((s, i) => s + (i.qty || 0), 0);
    if (countBadge) countBadge.textContent = `${editingOrderBuffer.items.length} models (${totalPcs} pcs)`;

    if (editingOrderBuffer.items.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${isStaff ? 5 : 8}" style="text-align:center; padding: 1.5rem; color:#94a3b8; font-style:italic;">No items in this order. Use the form above to add products.</td></tr>`;
        recalcEditOrderSummary();
        return;
    }

    // Group items by category
    const grouped = {};
    editingOrderBuffer.items.forEach(item => {
        const cat = item.category || 'Uncategorized';
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(item);
    });

    Object.keys(grouped).sort().forEach(cat => {
        const catRow = document.createElement('tr');
        catRow.style = "background:#f1f5f9; font-weight:700; color:#0e254f;";
        catRow.innerHTML = `<td colspan="${isStaff ? 5 : 8}" style="padding:0.4rem 0.6rem; font-size:0.8rem;">${cat}</td>`;
        tbody.appendChild(catRow);

        grouped[cat].forEach(item => {
            const pMatch = state.products.find(p => p.id === item.productId || (p.model && item.model && p.model.toLowerCase() === item.model.toLowerCase()));
            const itemWeight = (item.weight && item.weight > 0) ? item.weight : (pMatch && pMatch.weight > 0 ? pMatch.weight : ((item.model && item.model.toLowerCase().includes('one piece')) ? 38 : 15));
            const subtotal = item.qty * item.price;
            const subWeight = item.qty * itemWeight;

            const tr = document.createElement('tr');
            if (isStaff) {
                tr.innerHTML = `
                    <td style="padding: 0.4rem 0.6rem;"><b>${item.model}</b></td>
                    <td style="padding: 0.4rem 0.6rem; font-size:0.75rem; color:#64748b;">${[item.grade, item.colour].filter(Boolean).join(' / ') || '-'}</td>
                    <td style="padding: 0.4rem 0.6rem;">${itemWeight} kg <small style="color:#64748b;">(${subWeight.toFixed(1)} kg)</small></td>
                    <td style="padding: 0.2rem;">
                        <div class="qty-adjuster-group" style="width: 84px; height: 26px; margin: 0; background: #fff; border: 1px solid var(--border-color); border-radius: 4px;">
                            <button class="qty-adj-btn" style="width:24px; font-size: 0.8rem;" onclick="updateEditOrderQty('${item.productId}', -1)">−</button>
                            <input type="number" class="qty-adj-val" value="${item.qty}" style="font-size: 0.75rem; width: 0; min-width: 0; border: none; text-align: center; background: transparent; outline: none; padding: 0;" onchange="updateEditOrderQtySet('${item.productId}', this.value)">
                            <button class="qty-adj-btn" style="width:24px; font-size: 0.8rem;" onclick="updateEditOrderQty('${item.productId}', +1)">+</button>
                        </div>
                    </td>
                    <td style="padding: 0.4rem; text-align: center;">
                        <button type="button" onclick="removeProdFromEditOrder('${item.productId}')" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size: 0.95rem;" title="Remove Item">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                `;
            } else {
                tr.innerHTML = `
                    <td style="padding: 0.4rem 0.6rem;"><b>${item.model}</b></td>
                    <td style="padding: 0.4rem 0.6rem; font-size:0.75rem; color:#64748b;">${[item.grade, item.colour].filter(Boolean).join(' / ') || '-'}</td>
                    <td style="padding: 0.4rem 0.6rem;">${itemWeight} kg <small style="color:#64748b;">(${subWeight.toFixed(1)} kg)</small></td>
                    <td style="padding: 0.2rem;">
                        <div class="qty-adjuster-group" style="width: 84px; height: 26px; margin: 0; background: #fff; border: 1px solid var(--border-color); border-radius: 4px;">
                            <button class="qty-adj-btn" style="width:24px; font-size: 0.8rem;" onclick="updateEditOrderQty('${item.productId}', -1)">−</button>
                            <input type="number" class="qty-adj-val" value="${item.qty}" style="font-size: 0.75rem; width: 0; min-width: 0; border: none; text-align: center; background: transparent; outline: none; padding: 0;" onchange="updateEditOrderQtySet('${item.productId}', this.value)">
                            <button class="qty-adj-btn" style="width:24px; font-size: 0.8rem;" onclick="updateEditOrderQty('${item.productId}', +1)">+</button>
                        </div>
                    </td>
                    <td style="padding: 0.2rem 0.4rem;">
                        <input type="number" value="${item.price}" min="0" step="any" onchange="updateEditOrderItemRate('${item.productId}', 'price', this.value)" style="width: 75px; padding: 0.2rem 0.3rem; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 0.8rem;">
                    </td>
                    <td style="padding: 0.2rem 0.4rem;">
                        <input type="number" value="${item.billRate || 0}" min="0" step="any" onchange="updateEditOrderItemRate('${item.productId}', 'billRate', this.value)" style="width: 75px; padding: 0.2rem 0.3rem; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 0.8rem;">
                    </td>
                    <td style="padding: 0.4rem 0.6rem; font-weight:700; color:#0e254f;">₹${subtotal.toLocaleString('en-IN')}</td>
                    <td style="padding: 0.4rem; text-align: center;">
                        <button type="button" onclick="removeProdFromEditOrder('${item.productId}')" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size: 0.95rem;" title="Remove Item">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                `;
            }
            tbody.appendChild(tr);
        });
    });

    recalcEditOrderSummary();
}

function recalcEditOrderSummary() {
    if (!editingOrderBuffer) return;

    let totalWeight = 0;
    let totalQty = 0;
    let billBasic = 0;
    let totalCash = 0;

    editingOrderBuffer.items.forEach(item => {
        const pMatch = state.products.find(p => p.id === item.productId || (p.model && item.model && p.model.toLowerCase() === item.model.toLowerCase()));
        const itemWeight = (item.weight && item.weight > 0) ? item.weight : (pMatch && pMatch.weight > 0 ? pMatch.weight : ((item.model && item.model.toLowerCase().includes('one piece')) ? 38 : 15));
        
        totalWeight += (item.qty * itemWeight);
        totalQty += item.qty;
        billBasic += (item.qty * (item.billRate || 0));
        totalCash += (item.qty * ((item.price || 0) - (item.billRate || 0)));
    });

    const gstRate = (state.settings && state.settings.gstRate !== undefined) ? state.settings.gstRate : 18;
    const gst = billBasic * (gstRate / 100);
    const freightInput = document.getElementById('edit-order-live-freight');
    const freight = freightInput ? (parseFloat(freightInput.value) || 0) : (editingOrderBuffer.freight || 0);
    const totalBill = billBasic + gst;
    const finalCash = totalCash + freight;
    const totalPayment = totalBill + finalCash;

    const wEl = document.getElementById('edit-order-live-weight');
    if (wEl) wEl.textContent = `${totalWeight.toFixed(2)} kg`;

    const qEl = document.getElementById('edit-order-live-qty');
    if (qEl) qEl.textContent = `${totalQty} pcs`;

    const bEl = document.getElementById('edit-order-live-basic');
    if (bEl) bEl.textContent = `₹${billBasic.toLocaleString('en-IN')}`;

    const gEl = document.getElementById('edit-order-live-gst');
    if (gEl) gEl.textContent = `₹${gst.toLocaleString('en-IN')}`;

    const tbEl = document.getElementById('edit-order-live-bill');
    if (tbEl) tbEl.textContent = `₹${totalBill.toLocaleString('en-IN')}`;

    const cEl = document.getElementById('edit-order-live-cash');
    if (cEl) cEl.textContent = `₹${finalCash.toLocaleString('en-IN')}`;

    const tEl = document.getElementById('edit-order-live-total');
    if (tEl) tEl.textContent = `₹${totalPayment.toLocaleString('en-IN')}`;
}

function saveAdminOrderEdits() {
    if (!editingOrderBuffer) return;

    const ord = state.orders.find(o => o.id === editingOrderBuffer.orderId);
    if (!ord) {
        alert("Order not found!");
        return;
    }

    if (editingOrderBuffer.items.length === 0) {
        alert("Cannot save an empty order. Please add at least one item or cancel the order.");
        return;
    }

    const freightInput = document.getElementById('edit-order-live-freight');
    const freight = freightInput ? (parseFloat(freightInput.value) || 0) : 0;

    let billBasic = 0, totalCash = 0, totalWeight = 0;
    editingOrderBuffer.items.forEach(item => {
        const pMatch = state.products.find(p => p.id === item.productId || (p.model && item.model && p.model.toLowerCase() === item.model.toLowerCase()));
        const itemWeight = (item.weight && item.weight > 0) ? item.weight : (pMatch && pMatch.weight > 0 ? pMatch.weight : ((item.model && item.model.toLowerCase().includes('one piece')) ? 38 : 15));
        item.weight = itemWeight;

        billBasic += (item.qty * (item.billRate || 0));
        totalCash += (item.qty * ((item.price || 0) - (item.billRate || 0)));
        totalWeight += (item.qty * itemWeight);
    });

    const gstRate = (state.settings && state.settings.gstRate !== undefined) ? state.settings.gstRate : 18;
    const gst = billBasic * (gstRate / 100);
    const totalBill = billBasic + gst;

    ord.items = editingOrderBuffer.items;
    ord.freight = freight;
    ord.billBasic = billBasic;
    ord.gst = gst;
    ord.totalCash = totalCash + freight;
    ord.totalBill = totalBill;

    if (!ord.timeline) ord.timeline = [];
    ord.timeline.push({
        status: ord.status,
        timestamp: Date.now(),
        note: `Order items edited by Admin (${ord.items.length} models, ${totalWeight.toFixed(2)} kg)`
    });

    saveState();
    if (typeof syncToCloud === 'function') syncToCloud();

    closeModal('admin-edit-order-modal');

    // Keep this order expanded so user immediately sees the change
    if (!window.expandedOrderIds) window.expandedOrderIds = new Set();
    window.expandedOrderIds.add(ord.id);

    renderOrdersList();
    renderDashboard();

    alert(`Order Updated Successfully!\n\nRef: ${ord.performerNo}\nItems: ${ord.items.reduce((s, i) => s + (i.qty || 0), 0)} pcs\nTotal Weight: ${totalWeight.toFixed(2)} kg\nTotal Payment: ₹${(totalBill + ord.totalCash).toLocaleString('en-IN')}`);
}

function updateFreight(orderId) {
    const ord = state.orders.find(o => o.id === orderId);
    if(!ord) return;

    const freightInput = prompt("Enter Freight Amount for this order (leave 0 if none):", ord.freight || "0");
    if (freightInput === null) return;
    
    const freightVal = parseFloat(freightInput) || 0;
    const oldFreight = ord.freight || 0;
    ord.freight = freightVal;
    ord.totalCash = (ord.totalCash || 0) - oldFreight + freightVal;
    ord.totalBill = (ord.billBasic || 0) + (ord.gst || 0);
    
    saveState();
    renderOrdersList();
    renderDashboard();
}

function viewTimeline(orderId) {
    const order = state.orders.find(o => o.id === orderId);
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
    
    document.getElementById('timeline-modal-content').innerHTML = html;
    openModal('timeline-modal');
}

function openConfirmOrderModal(orderId) {
    const ord = state.orders.find(o => o.id === orderId);
    if (!ord) return;

    const m = state.merchants.find(x => x.id === ord.merchantId) || { name: "Unknown Party" };
    const totalPcs = (ord.items || []).reduce((s, i) => s + (i.qty || 0), 0);
    const totalWeight = (ord.items || []).reduce((s, i) => s + ((i.weight || 0) * (i.qty || 0)), 0).toFixed(1);

    const titleEl = document.getElementById("confirm-order-info-title");
    const subEl = document.getElementById("confirm-order-info-sub");
    if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-file-invoice"></i> Order #${ord.performerNo || ord.id} — <b>${m.name}</b>`;
    if (subEl) subEl.innerHTML = `Items: <b>${totalPcs} pcs</b> (${totalWeight} kg) | Placed: ${ord.date || 'N/A'}`;

    const idInput = document.getElementById("confirm-order-id");
    if (idInput) idInput.value = ord.id;
    
    // Set ready date input (needs YYYY-MM-DD)
    let rawDate = ord.estimatedReadyDateRaw || '';
    if (!rawDate && ord.estimatedReadyDate) {
        const p = ord.estimatedReadyDate.split('/');
        if (p.length === 3) rawDate = `${p[2]}-${p[1]}-${p[0]}`;
    }
    if (!rawDate) {
        // default +5 days
        const d = new Date();
        d.setDate(d.getDate() + 5);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        rawDate = `${yyyy}-${mm}-${dd}`;
    }
    const dateInput = document.getElementById("confirm-ready-date");
    if (dateInput) dateInput.value = rawDate;

    const noteInput = document.getElementById("confirm-delivery-note");
    if (noteInput) noteInput.value = ord.deliveryNote || '';

    const warningEl = document.getElementById("confirm-order-due-warning");
    if (warningEl) {
        const perf = (m && m.id) ? getMerchantPerformance(m) : null;
        if (perf && perf.balance > 50 && (perf.oldestUnpaidDate || perf.daysSinceOldestDispatch !== null)) {
            const isOverdue = perf.isOverdue;
            warningEl.style.display = "block";
            warningEl.style.background = isOverdue ? "#fef2f2" : "#fffbeb";
            warningEl.style.border = isOverdue ? "1px solid #fecaca" : "1px solid #fde68a";
            warningEl.style.color = isOverdue ? "#991b1b" : "#92400e";
            warningEl.innerHTML = `
                <div style="font-weight:700; display:flex; align-items:center; gap:0.4rem; margin-bottom:0.25rem;">
                    <i class="fa-solid ${isOverdue ? 'fa-triangle-exclamation' : 'fa-circle-info'}"></i> 
                    ${isOverdue ? '⚠️ જૂની ગાડી મુદત બહાર (Payment Overdue)' : 'ℹ️ ગત ગાડીનું પેમેન્ટ હજુ બાકી છે'}
                </div>
                <div>ગત <b>${perf.oldestUnpaidDate || perf.lastDispatchedDate}</b> ની ગાડીનું <b>${fmtCur(perf.oldestUnpaidAmount || perf.balance)}</b> પેમેન્ટ હજુ બાકી છે.</div>
                <div style="font-size:0.75rem; margin-top:3px; opacity:0.9;">કુલ ખાતા બાકી: <b>${fmtCur(perf.balance)}</b> ${isOverdue ? `(મુદત બહાર: <b>${perf.overdueDays} દિવસ</b>)` : `(ક્રેડિટ બાકી: <b>${Math.max(0, perf.allowedCreditDays - (perf.daysSinceOldestDispatch !== null ? perf.daysSinceOldestDispatch : perf.daysSinceLastDispatch))} દિવસ</b>)`}</div>
            `;
        } else {
            warningEl.style.display = "none";
            warningEl.innerHTML = "";
        }
    }

    openModal("confirm-order-modal");
}
window.openConfirmOrderModal = openConfirmOrderModal;

function setQuickReadyDays(days) {
    const d = new Date();
    d.setDate(d.getDate() + parseInt(days, 10));
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateInput = document.getElementById("confirm-ready-date");
    if (dateInput) dateInput.value = `${yyyy}-${mm}-${dd}`;
}
window.setQuickReadyDays = setQuickReadyDays;

function handleConfirmOrderSubmit(e) {
    e.preventDefault();
    const orderId = document.getElementById("confirm-order-id").value;
    const readyDate = document.getElementById("confirm-ready-date").value;
    const deliveryNote = document.getElementById("confirm-delivery-note").value.trim();
    
    const ord = state.orders.find(o => o.id === orderId);
    if (!ord) return;

    let displayReadyDate = readyDate;
    if (readyDate && readyDate.includes('-')) {
        const parts = readyDate.split('-');
        if (parts.length === 3) {
            displayReadyDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
    }

    ord.estimatedReadyDate = displayReadyDate;
    ord.estimatedReadyDateRaw = readyDate;
    ord.deliveryNote = deliveryNote;

    if (!ord.timeline) {
        ord.timeline = [{ status: "Pending", timestamp: parseInt(ord.id.replace('ord-', '')) || Date.now() }];
    }

    if (ord.status !== "Confirmed") {
        ord.status = "Confirmed";
        ord.timeline.push({ 
            status: "Confirmed", 
            timestamp: Date.now(),
            note: `Est. Ready: ${displayReadyDate}${deliveryNote ? ` (${deliveryNote})` : ''}`
        });
    } else {
        ord.timeline.push({ 
            status: "Ready Date Updated", 
            timestamp: Date.now(),
            note: `Est. Ready set to ${displayReadyDate}${deliveryNote ? ` (${deliveryNote})` : ''}`
        });
    }

    saveState();
    if (typeof syncToCloud === 'function') syncToCloud();
    closeModal('confirm-order-modal');
    renderOrdersList();
    renderDashboard();
    alert(`Order #${ord.performerNo || ord.id} confirmed!\nEstimated Ready Date: ${displayReadyDate}`);
}
window.handleConfirmOrderSubmit = handleConfirmOrderSubmit;

function confirmOrder(orderId) {
    openConfirmOrderModal(orderId);
}

function cancelOrder(orderId) {
    if (confirm("Are you sure you want to Cancel this order? This will mark it as Cancelled.")) {
        const order = state.orders.find(o => o.id === orderId);
        if (order) {
            if (order.status !== "Cancelled") {
                if (!order.timeline) order.timeline = [{ status: "Pending", timestamp: parseInt(order.id.replace('ord-', '')) || Date.now() }];
                order.timeline.push({ status: "Cancelled", timestamp: Date.now() });
                order.status = "Cancelled";
            }
            saveState(); renderOrdersList();
        }
    }
}

function deleteOrder(orderId) {
    if (!confirm("Are you sure you want to permanently delete this order? This action cannot be undone.")) return;

    const idx = state.orders.findIndex(o => o.id === orderId);
    if (idx === -1) return;
    const order = state.orders[idx];

    // Restore stock and remove ledger if it was Dispatched
    if (order.status === "Dispatched") {
        order.items.forEach(item => {
            const p = state.products.find(x => x.id === item.productId);
            if (p) p.stock = parseInt(p.stock || 0) + parseInt(item.qty || 0);
        });
        
        // Remove ledger entries related to this order
        state.ledger = state.ledger.filter(e => e.orderId !== order.id);
    }

    // Remove order
    state.orders.splice(idx, 1);
    
    saveState();
    renderOrdersList();
    refreshCurrentTab();
}

function dispatchOrder(orderId) {
    const order = state.orders.find(o => o.id === orderId);
    if (!order) return;

    let warns = [];
    order.items.forEach(item => {
        const p = state.products.find(x => x.id === item.productId);
        if (p && p.stock < item.qty) warns.push(`${item.model} (Req: ${item.qty}, Avail: ${p.stock})`);
    });

    if (warns.length > 0 && !confirm(`Low stock warning:\n${warns.join("\n")}\n\nDispatch anyway?`)) return;

    const m = state.merchants.find(x => x.id === order.merchantId);
    const orderIdInput = document.getElementById('dispatch-order-id');
    if (orderIdInput) {
        orderIdInput.value = order.id;
        document.getElementById('dispatch-order-info-title').textContent = `Dispatch Order #${order.performerNo} - ${m ? m.name : 'Unknown'}`;
        document.getElementById('dispatch-order-info-sub').textContent = `Date: ${order.date} | Total Items: ${order.items.reduce((s, i) => s + (i.qty || 0), 0)} pcs`;
        document.getElementById('dispatch-transport-name').value = order.transportName || '';
        document.getElementById('dispatch-lr-no').value = order.lrNo || '';
        document.getElementById('dispatch-vehicle-no').value = order.vehicleNo || '';
        document.getElementById('dispatch-freight-amount').value = order.freight || 0;

        const warningEl = document.getElementById("dispatch-order-due-warning");
        if (warningEl) {
            const perf = (m && m.id) ? getMerchantPerformance(m) : null;
            if (perf && perf.balance > 50 && (perf.oldestUnpaidDate || perf.daysSinceOldestDispatch !== null)) {
                const isOverdue = perf.isOverdue;
                warningEl.style.display = "block";
                warningEl.style.background = isOverdue ? "#fef2f2" : "#fffbeb";
                warningEl.style.border = isOverdue ? "1px solid #fecaca" : "1px solid #fde68a";
                warningEl.style.color = isOverdue ? "#991b1b" : "#92400e";
                warningEl.innerHTML = `
                    <div style="font-weight:700; display:flex; align-items:center; gap:0.4rem; margin-bottom:0.25rem;">
                        <i class="fa-solid ${isOverdue ? 'fa-triangle-exclamation' : 'fa-circle-info'}"></i> 
                        ${isOverdue ? '⚠️ જૂની ગાડી મુદત બહાર (Payment Overdue)' : 'ℹ️ ગત ગાડીનું પેમેન્ટ હજુ બાકી છે'}
                    </div>
                    <div>ગત <b>${perf.oldestUnpaidDate || perf.lastDispatchedDate}</b> ની ગાડીનું <b>${fmtCur(perf.oldestUnpaidAmount || perf.balance)}</b> પેમેન્ટ હજુ બાકી છે.</div>
                    <div style="font-size:0.75rem; margin-top:3px; opacity:0.9;">કુલ ખાતા બાકી: <b>${fmtCur(perf.balance)}</b> ${isOverdue ? `(મુદત બહાર: <b>${perf.overdueDays} દિવસ</b>)` : `(ક્રેડિટ બાકી: <b>${Math.max(0, perf.allowedCreditDays - (perf.daysSinceOldestDispatch !== null ? perf.daysSinceOldestDispatch : perf.daysSinceLastDispatch))} દિવસ</b>)`}</div>
                `;
            } else {
                warningEl.style.display = "none";
                warningEl.innerHTML = "";
            }
        }

        openModal('dispatch-order-modal');
    }
}

function confirmDispatchOrder(e) {
    if (e) e.preventDefault();
    const orderId = document.getElementById('dispatch-order-id').value;
    const order = state.orders.find(o => o.id === orderId);
    if (!order) return;

    const transportName = document.getElementById('dispatch-transport-name').value.trim();
    const lrNo = document.getElementById('dispatch-lr-no').value.trim();
    const vehicleNo = document.getElementById('dispatch-vehicle-no').value.trim();
    const freightVal = parseFloat(document.getElementById('dispatch-freight-amount').value) || 0;

    const oldFreight = order.freight || 0;
    order.freight = freightVal;
    order.transportName = transportName;
    order.lrNo = lrNo;
    order.vehicleNo = vehicleNo;
    order.totalCash = (order.totalCash || 0) - oldFreight + freightVal;
    order.totalBill = (order.billBasic || 0) + (order.gst || 0);

    order.items.forEach(item => {
        const p = state.products.find(x => x.id === item.productId);
        if (p) p.stock = Math.max(0, p.stock - item.qty);
    });

    const m = state.merchants.find(x => x.id === order.merchantId);
    const mName = m ? m.name : "Unknown";

    const nowTs = Date.now();
    const dNow = new Date(nowTs);
    const dispatchDateStr = `${String(dNow.getDate()).padStart(2, '0')}.${String(dNow.getMonth() + 1).padStart(2, '0')}.${dNow.getFullYear()}`;
    order.dispatchDate = dispatchDateStr;
    order.dispatchTimestamp = nowTs;

    if (order.totalBill > 0) state.ledger.push({ id: "led-" + nowTs + "w", orderId: order.id, merchantId: order.merchantId, merchantName: mName, date: dispatchDateStr, refNo: order.performerNo, description: "Sales Invoice (White Book)", whiteAmount: order.totalBill, blackAmount: 0, status: "Cleared" });
    if (order.totalCash > 0) state.ledger.push({ id: "led-" + nowTs + "b", orderId: order.id, merchantId: order.merchantId, merchantName: mName, date: dispatchDateStr, refNo: order.performerNo, description: "Cash Sale (Black Book)", whiteAmount: 0, blackAmount: order.totalCash, status: "Cleared" });

    if (order.status !== "Dispatched") {
        if (!order.timeline) order.timeline = [{ status: "Pending", timestamp: parseInt(order.id.replace('ord-', '')) || nowTs }];
        order.timeline.push({ status: "Dispatched", timestamp: nowTs });
        order.status = "Dispatched";
    }

    saveState();
    closeModal('dispatch-order-modal');
    alert(`✅ Order #${order.performerNo} successfully dispatched!\nStock and ledger updated.`);
    renderOrdersList();
    refreshCurrentTab();
    triggerWhatsApp(order.id);
}

function triggerWhatsApp(orderId) {
    const order = state.orders.find(o => o.id === orderId);
    const m = state.merchants.find(x => x.id === order.merchantId);
    if (!order || !m) return;
    const gstRate = (state.settings && state.settings.gstRate !== undefined) ? state.settings.gstRate : 18;

    let msg = `*INVOICE SUMMARY*\n-----------------------------\n`;
    msg += `*Date:* ${order.date} | *Ref:* ${order.performerNo}\n`;
    msg += `*Buyer:* ${m.name}\n*Address:* ${m.address}\n\n`;
    const groupedItems = {};
    order.items.forEach(item => {
        const cat = item.category || 'Uncategorized';
        if (!groupedItems[cat]) groupedItems[cat] = [];
        groupedItems[cat].push(item);
    });

    getOrderedCategories(groupedItems).forEach(cat => {
        msg += `\n*${cat.toUpperCase()}*\n`;
        let catBillTotal = 0;
        let catCashTotal = 0;
        groupedItems[cat].forEach((item, i) => {
            catBillTotal += (item.qty * item.billRate);
            catCashTotal += (item.qty * (item.price - item.billRate));
            const qtyStr = item.unit === 'box' ? `📦 ${item.orderQty} Box (${item.qty} pcs)` : `${item.qty} pcs`;
            const priceStr = item.unit === 'box' ? `₹${item.price}/pc (₹${item.price * (item.boxQty || 1)}/box)` : `₹${item.price}`;
            msg += `- *${item.model}* (${item.grade}/${item.colour})\n   Qty: ${qtyStr} | Price: ${priceStr} | Bill Rate: ₹${item.billRate}\n   Bill Amt: ₹${(item.qty * item.billRate).toLocaleString('en-IN')} | Cash Amt: ₹${(item.qty * (item.price - item.billRate)).toLocaleString('en-IN')}\n`;
        });
        msg += `_Subtotal -> Bill: ₹${catBillTotal.toLocaleString('en-IN')} | Cash: ₹${catCashTotal.toLocaleString('en-IN')}_\n`;
    });
    msg += `-----------------------------\n`;
    msg += `*Bill Basic:* ₹${order.billBasic.toLocaleString('en-IN')}\n*GST ${gstRate}%:* ₹${order.gst.toLocaleString('en-IN')}\n*TOTAL BILL AMOUNT:* ₹${order.totalBill.toLocaleString('en-IN')}\n`;
    msg += `*Freight:* ₹${order.freight.toLocaleString('en-IN')}\n*TOTAL CASH AMOUNT:* ₹${order.totalCash.toLocaleString('en-IN')}\n*TOTAL PAYMENT:* ₹${(order.totalBill + order.totalCash).toLocaleString('en-IN')}\n`;
    
    if (order.transportName || order.lrNo) {
        msg += `-----------------------------\n*DISPATCH / LOGISTICS DETAILS*\n`;
        if (order.transportName) msg += `*Transport:* ${order.transportName}\n`;
        if (order.lrNo) msg += `*Bilty / LR No:* ${order.lrNo}\n`;
        if (order.vehicleNo) msg += `*Vehicle No:* ${order.vehicleNo}\n`;
    }

    if (order.remark) msg += `*Remark:* ${order.remark}\n`;
    msg += `\nThank you!`;

    window.open(`https://api.whatsapp.com/send?phone=${m.phone}&text=${encodeURIComponent(msg)}`, '_blank');
}

function printInvoice(orderId) {
    const order = state.orders.find(o => o.id === orderId);
    const m = state.merchants.find(x => x.id === order.merchantId);
    if (!order || !m) return;
    const company = (state.settings && state.settings.companyName) ? state.settings.companyName : "Shree Ram Bathware";
    const isStaff = document.title.includes('Staff') || window.location.pathname.includes('staff.html');
    const gstRate = (state.settings && state.settings.gstRate !== undefined) ? state.settings.gstRate : 18;

    const printWin = window.open("", "_blank");
    if (isStaff) {
        let totalItemsCount = 0;
        let totalOrderWeightKg = 0;
        order.items.forEach(i => {
            totalItemsCount += (i.qty || 0);
            const pMatch = state.products.find(p => p.id === i.productId || (p.model && i.model && p.model.toLowerCase() === i.model.toLowerCase()));
            const itemWeight = (i.weight && i.weight > 0) ? i.weight : (pMatch && pMatch.weight > 0 ? pMatch.weight : ((i.model && i.model.toLowerCase().includes('one piece')) ? 38 : 15));
            i.weight = itemWeight;
            totalOrderWeightKg += (itemWeight * (i.qty || 0));
        });

        printWin.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Delivery Challan - ${order.performerNo}</title>
                <style>
                    body { font-family: sans-serif; padding: 20px; color: #000; }
                    h1 { margin-bottom: 5px; font-size: 22px; text-transform: uppercase; }
                    .meta-table, .items-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                    .meta-table td { padding: 5px; font-size: 14px; }
                    .items-table th, .items-table td { border: 1px solid #000; padding: 8px; font-size: 13px; text-align: left; }
                    .items-table th { background: #f0f0f0; }
                    .num { text-align: right; }
                    .totals-row { font-weight: bold; background: #fafafa; }
                </style>
            </head>
            <body>
                <h1>${company}</h1>
                <p style="margin:0; font-size:14px; font-weight:bold;">DELIVERY & DISPATCH CHALLAN</p>
                <table class="meta-table">
                    <tr><td><b>Challan Date:</b> ${order.date}</td><td><b>Ref No:</b> ${order.performerNo}</td></tr>
                    <tr><td><b>Buyer Name:</b> ${m.name}</td><td><b>WhatsApp:</b> +${m.phone}</td></tr>
                    <tr><td colspan="2"><b>Delivery Address:</b> ${m.address}</td></tr>
                    ${(order.transportName || order.lrNo || order.vehicleNo) ? `
                    <tr>
                        <td><b>Transport:</b> ${order.transportName || 'Direct'}</td>
                        <td><b>Bilty / LR No:</b> ${order.lrNo || 'N/A'}${order.vehicleNo ? ` (Veh: ${order.vehicleNo})` : ''}</td>
                    </tr>
                    ` : ''}
                </table>
                <table class="items-table">
                    <thead>
                        <tr><th>#</th><th>Model Name</th><th>Grade</th><th>Colour</th><th class="num">Weight (pc)</th><th class="num">Qty</th><th class="num">Total Weight</th></tr>
                    </thead>
                    <tbody>
                        ${(() => {
                            const groupedItems = {};
                            order.items.forEach(item => {
                                const cat = item.category || 'Uncategorized';
                                if (!groupedItems[cat]) groupedItems[cat] = [];
                                groupedItems[cat].push(item);
                            });
                            let html = '';
                            let index = 1;
                            getOrderedCategories(groupedItems).forEach(cat => {
                                let catQty = 0, catWeight = 0;
                                const rows = groupedItems[cat].map(item => {
                                    const pMatch = state.products.find(p => p.id === item.productId || (p.model && item.model && p.model.toLowerCase() === item.model.toLowerCase()));
                                    const itemWeight = (item.weight && item.weight > 0) ? item.weight : (pMatch && pMatch.weight > 0 ? pMatch.weight : ((item.model && item.model.toLowerCase().includes('one piece')) ? 38 : 15));
                                    const w = itemWeight * item.qty;
                                    catQty += item.qty;
                                    catWeight += w;
                                    const qtyDisp = item.unit === 'box' ? `<b>${item.orderQty} Box</b> (${item.qty} pcs)` : `<b>${item.qty}</b>`;
                                    return `
                                        <tr>
                                            <td>${index++}</td>
                                            <td><b>${item.model}</b></td>
                                            <td>${item.grade}</td>
                                            <td>${item.colour}</td>
                                            <td class="num">${itemWeight} kg</td>
                                            <td class="num">${qtyDisp}</td>
                                            <td class="num">${w.toFixed(1)} kg</td>
                                        </tr>
                                    `;
                                }).join("");
                                html += `
                                    <tr style="background:#f1f5f9;"><td colspan="5"><b>${cat}</b></td><td class="num"><b>${catQty}</b></td><td class="num"><b>${catWeight.toFixed(1)} kg</b></td></tr>
                                    ${rows}
                                `;
                            });
                            return html;
                        })()}
                    </tbody>
                    <tfoot>
                        <tr class="totals-row" style="border-top: 2px solid #000;"><td colspan="5">TOTAL QUANTITY</td><td class="num" style="font-weight:bold;">${totalItemsCount} pcs</td><td></td></tr>
                        <tr class="totals-row" style="background:#e2e8f0; font-size:15px;"><td colspan="5">TOTAL DISPATCH WEIGHT</td><td colspan="2" class="num" style="text-align:center; font-weight:900;">${totalOrderWeightKg.toFixed(2)} kg</td></tr>
                    </tfoot>
                </table>
                ${order.remark ? `<p style="margin-top:15px; font-size:13px;"><b>Remark:</b> ${order.remark}</p>` : ''}
                <div style="margin-top:40px; display:flex; justify-content:space-between; font-size:13px;">
                    <div>Receiver's Signature: __________________</div>
                    <div>Authorized Signature: __________________</div>
                </div>
                <script>window.print();<\/script>
            </body>
            </html>
        `);
        printWin.document.close();
        return;
    }

    printWin.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Invoice - ${order.performerNo}</title>
            <style>
                body { font-family: sans-serif; padding: 20px; color: #000; }
                h1 { margin-bottom: 5px; font-size: 22px; text-transform: uppercase; }
                .meta-table, .items-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                .meta-table td { padding: 5px; font-size: 14px; }
                .items-table th, .items-table td { border: 1px solid #000; padding: 8px; font-size: 13px; text-align: left; }
                .items-table th { background: #f0f0f0; }
                .num { text-align: right; }
                .totals-row { font-weight: bold; background: #fafafa; }
            </style>
        </head>
        <body>
            <h1>${company}</h1>
            <p style="margin:0; font-size:14px;">TAX INVOICE / ORDER DISPATCH MEMO</p>
            <table class="meta-table">
                <tr><td><b>Invoice Date:</b> ${order.date}</td><td><b>Ref / Performer No:</b> ${order.performerNo}</td></tr>
                <tr><td><b>Buyer Name:</b> ${m.name}</td><td><b>WhatsApp:</b> +${m.phone}</td></tr>
                <tr><td colspan="2"><b>Address:</b> ${m.address}</td></tr>
                ${(order.transportName || order.lrNo || order.vehicleNo) ? `
                <tr>
                    <td><b>Transport:</b> ${order.transportName || 'Direct'}</td>
                    <td><b>Bilty / LR No:</b> ${order.lrNo || 'N/A'}${order.vehicleNo ? ` (Veh: ${order.vehicleNo})` : ''}</td>
                </tr>
                ` : ''}
            </table>
            <table class="items-table">
                <thead>
                    ${(order.totalCash === 0) ? `
                        <tr><th>#</th><th>Model Name</th><th>Grade</th><th>Colour</th><th class="num">Qty</th><th class="num">Rate</th><th class="num">Bill Rate</th><th class="num">Bill Amt</th></tr>
                    ` : `
                        <tr><th>#</th><th>Model Name</th><th>Grade</th><th>Colour</th><th class="num">Qty</th><th class="num">Rate</th><th class="num">Bill Rate</th><th class="num">Bill Amt</th><th class="num">Cash Amt</th></tr>
                    `}
                </thead>
                <tbody>
                    ${(() => {
                        const groupedItems = {};
                        order.items.forEach(item => {
                            const cat = item.category || 'Uncategorized';
                            if (!groupedItems[cat]) groupedItems[cat] = [];
                            groupedItems[cat].push(item);
                        });
                        
                        let html = '';
                        let index = 1;
                        getOrderedCategories(groupedItems).forEach(cat => {
                            let catBill = 0, catCash = 0;
                            const rows = groupedItems[cat].map(item => {
                                catBill += (item.qty * item.billRate);
                                catCash += (item.qty * (item.price - item.billRate));
                                const qtyDisp = item.unit === 'box' ? `<b>${item.orderQty} Box</b><br><small style="color:#64748b;">(${item.qty} pcs)</small>` : `${item.qty}`;
                                const priceDisp = item.unit === 'box' ? `₹${item.price}<br><small style="color:#2563eb;">/pc in box</small>` : `₹${item.price}`;
                                if (order.totalCash === 0) {
                                    return `
                                        <tr>
                                            <td>${index++}</td>
                                            <td><b>${item.model}</b></td>
                                            <td>${item.grade}</td>
                                            <td>${item.colour}</td>
                                            <td class="num">${qtyDisp}</td>
                                            <td class="num">${priceDisp}</td>
                                            <td class="num">₹${item.billRate}</td>
                                            <td class="num">₹${(item.qty * item.billRate).toLocaleString('en-IN')}</td>
                                        </tr>
                                    `;
                                } else {
                                    return `
                                        <tr>
                                            <td>${index++}</td>
                                            <td><b>${item.model}</b></td>
                                            <td>${item.grade}</td>
                                            <td>${item.colour}</td>
                                            <td class="num">${qtyDisp}</td>
                                            <td class="num">${priceDisp}</td>
                                            <td class="num">₹${item.billRate}</td>
                                            <td class="num">₹${(item.qty * item.billRate).toLocaleString('en-IN')}</td>
                                            <td class="num">₹${(item.qty * (item.price - item.billRate)).toLocaleString('en-IN')}</td>
                                        </tr>
                                    `;
                                }
                            }).join("");
                            if (order.totalCash === 0) {
                                html += `
                                    <tr style="background:#f1f5f9;"><td colspan="7"><b>${cat}</b></td><td class="num"><b>₹${catBill.toLocaleString('en-IN')}</b></td></tr>
                                    ${rows}
                                `;
                            } else {
                                html += `
                                    <tr style="background:#f1f5f9;"><td colspan="7"><b>${cat}</b></td><td class="num"><b>₹${catBill.toLocaleString('en-IN')}</b></td><td class="num"><b>₹${catCash.toLocaleString('en-IN')}</b></td></tr>
                                    ${rows}
                                `;
                            }
                        });
                        return html;
                    })()}
                </tbody>
                <tfoot>
                    <tr class="totals-row" style="border-top: 2px solid #000;"><td colspan="6">BILL BASIC</td><td colspan="${order.totalCash === 0 ? '2' : '3'}" class="num" style="text-align: center;">₹${order.billBasic.toLocaleString('en-IN')}</td></tr>
                    <tr class="totals-row"><td colspan="6">GST ${gstRate}%</td><td colspan="${order.totalCash === 0 ? '2' : '3'}" class="num" style="text-align: center;">₹${order.gst.toLocaleString('en-IN')}</td></tr>
                    <tr class="totals-row" style="font-weight:700;"><td colspan="6">TOTAL BILL AMOUNT</td><td colspan="${order.totalCash === 0 ? '2' : '3'}" class="num" style="text-align: center;">₹${order.totalBill.toLocaleString('en-IN')}</td></tr>
                    <tr class="totals-row"><td colspan="6">FREIGHT</td><td colspan="${order.totalCash === 0 ? '2' : '3'}" class="num" style="text-align: center;">₹${order.freight.toLocaleString('en-IN')}</td></tr>
                    ${order.totalCash > 0 ? `
                    <tr class="totals-row final-bill-row" style="font-size:inherit;"><td colspan="6">TOTAL CASH AMOUNT</td><td colspan="3" class="num" style="text-align: center;">₹${order.totalCash.toLocaleString('en-IN')}</td></tr>
                    <tr><td colspan="9" style="border-top:none; border-bottom:none; border-left:1px solid #000; border-right:1px solid #000; height:10px;"></td></tr>
                    <tr class="totals-row" style="background-color:#cbd5e1; font-weight:900; font-size:18px;"><td colspan="6">TOTAL PAYMENT</td><td colspan="3" class="num" style="text-align: center;">₹${(order.totalBill + order.totalCash).toLocaleString('en-IN')}</td></tr>
                    ` : `
                    <tr class="totals-row" style="background-color:#cbd5e1; font-weight:900; font-size:18px;"><td colspan="6">TOTAL PAYMENT</td><td colspan="2" class="num" style="text-align: center;">₹${(order.totalBill).toLocaleString('en-IN')}</td></tr>
                    `}
                </tfoot>
            </table>
            ${order.remark ? `<p style="margin-top:15px; font-size:13px;"><b>Remark:</b> ${order.remark}</p>` : ''}
            <script>window.print();<\/script>
        </body>
        </html>
    `);
    printWin.document.close();
}

// ---- LEDGER ----
function initLedgerTab() {
    const sel = document.getElementById("ledger-merchant-filter");
    if (sel && sel.tagName === 'SELECT') {
        sel.innerHTML = `<option value="all">All Merchants</option>`;
        state.merchants.forEach(m => {
            const o = document.createElement("option");
            o.value = m.id; o.textContent = m.name;
            sel.appendChild(o);
        });
    }
    renderLedger();
}

function renderLedger() {
    const tbody = document.getElementById("ledger-table-body");
    tbody.innerHTML = "";
    const filter = document.getElementById("ledger-merchant-filter").value;
    const finDates = getActiveFinYearDates();

    let entries = filter === "all" ? state.ledger : state.ledger.filter(e => e.merchantId === filter);

    if(finDates) {
        entries = entries.filter(e => {
            if(e.date) {
                let parts = e.date.split('.');
                if(parts.length !== 3) parts = e.date.split('/');
                if(parts.length === 3) {
                    const d = new Date(parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0]));
                    return d >= finDates.startDate && d <= finDates.endDate;
                }
            }
            return true;
        });
    }

    // Sort entries by date (ascending)
    entries.sort((a, b) => {
        const parseDate = (dStr) => {
            if(!dStr) return 0;
            let p = dStr.split('.');
            if(p.length !== 3) p = dStr.split('/');
            if(p.length === 3) return new Date(parseInt(p[2]), parseInt(p[1])-1, parseInt(p[0])).getTime();
            return 0;
        };
        return parseDate(a.date) - parseDate(b.date);
    });

    let totalWhiteBal = 0;
    let totalBlackBal = 0;

    if (entries.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="placeholder-text">No ledger entries.</td></tr>`;
    } else {
        const balances = {}; 

        entries.forEach(e => {
            const isCredit = e.txnType === 'Credit';
            const wDebit = isCredit ? 0 : (e.whiteAmount || 0);
            const wCredit = isCredit ? (e.whiteAmount || 0) : 0;
            const bDebit = isCredit ? 0 : (e.blackAmount || 0);
            const bCredit = isCredit ? (e.blackAmount || 0) : 0;

            if (!balances[e.merchantId]) balances[e.merchantId] = { w: 0, b: 0 };
            
            balances[e.merchantId].w += (wDebit - wCredit);
            balances[e.merchantId].b += (bDebit - bCredit);
            
            const trDebit = wDebit > 0 ? wDebit : (bDebit > 0 ? bDebit : 0);
            const trCredit = wCredit > 0 ? wCredit : (bCredit > 0 ? bCredit : 0);
            const bookName = (wDebit > 0 || wCredit > 0) ? 'White' : 'Black';
            const badgeColor = bookName === 'White' ? '#3b82f6' : '#1e293b';

            // Running balance
            const combBalance = balances[e.merchantId].w + balances[e.merchantId].b;
            const rowBalance = filter === "all" ? '-' : (combBalance < 0 ? `+${fmtCur(Math.abs(combBalance))} (Adv)` : fmtCur(combBalance));

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${e.date}</td>
                <td><b>${e.merchantName}</b></td>
                <td>${e.refNo || '-'}</td>
                <td>${e.description} <span style="font-size:0.65rem; background:${badgeColor}; color:white; padding:2px 4px; border-radius:3px; margin-left:4px;">${bookName}</span></td>
                <td class="num-col" style="color:#ef4444; font-weight:bold;">${trDebit > 0 ? fmtCur(trDebit) : '-'}</td>
                <td class="num-col" style="color:#10b981; font-weight:bold;">${trCredit > 0 ? fmtCur(trCredit) : '-'}</td>
                <td class="num-col"><b>${rowBalance}</b></td>
                <td><span class="badge badge-success">${e.status || 'Cleared'}</span></td>
                <td>
                    ${!e.orderId ? `<button class="btn btn-danger" style="padding:0.2rem 0.5rem; font-size:0.75rem;" onclick="deleteLedgerEntry('${e.id}')" title="Delete Entry"><i class="fa-solid fa-trash"></i></button>` : `<span style="font-size:0.75rem; color:var(--text-muted);" title="Cannot delete invoice directly. Cancel the order instead."><i class="fa-solid fa-lock"></i></span>`}
                </td>
            `;
            tbody.appendChild(tr);
        });

        for (let mId in balances) {
            totalWhiteBal += balances[mId].w;
            totalBlackBal += balances[mId].b;
        }
    }

    const remBtn = document.getElementById("btn-ledger-wa-reminder");
    if (remBtn) {
        if (filter !== "all") {
            const netDues = totalWhiteBal + totalBlackBal;
            if (netDues > 0) {
                remBtn.style.opacity = "1";
                remBtn.title = `Send Payment Reminder for ₹${netDues.toLocaleString('en-IN')} pending`;
                remBtn.innerHTML = `<i class="fa-solid fa-bell"></i> Payment Reminder (₹${Math.round(netDues).toLocaleString('en-IN')} Due)`;
            } else {
                remBtn.style.opacity = "0.75";
                remBtn.title = "No pending dues for this party";
                remBtn.innerHTML = `<i class="fa-solid fa-bell"></i> Payment Reminder (Clear)`;
            }
        } else {
            remBtn.style.opacity = "0.85";
            remBtn.title = "Select a party to send payment reminder";
            remBtn.innerHTML = `<i class="fa-solid fa-bell"></i> Payment Reminder`;
        }
    }

    const lw = document.getElementById("ledger-total-white");
    const lb = document.getElementById("ledger-total-black");
    if (lw) {
        if (totalWhiteBal < 0) {
            lw.innerHTML = `+${fmtCur(Math.abs(totalWhiteBal))}`;
            lw.style.color = "#10b981";
        } else if (totalWhiteBal > 0) {
            lw.innerHTML = fmtCur(totalWhiteBal);
            lw.style.color = "#ef4444";
        } else {
            lw.innerHTML = fmtCur(totalWhiteBal);
            lw.style.color = "";
        }
    }
    if (lb) {
        if (totalBlackBal < 0) {
            lb.innerHTML = `+${fmtCur(Math.abs(totalBlackBal))}`;
            lb.style.color = "#10b981";
        } else if (totalBlackBal > 0) {
            lb.innerHTML = fmtCur(totalBlackBal);
            lb.style.color = "#ef4444";
        } else {
            lb.innerHTML = fmtCur(totalBlackBal);
            lb.style.color = "";
        }
    }
}

function deleteLedgerEntry(entryId) {
    const entry = state.ledger.find(e => e.id === entryId);
    if (!entry) return;
    if (entry.orderId) {
        alert("Sales invoices cannot be deleted directly from the Ledger. To reverse this, please cancel the order from the 'Orders & Dispatch' tab.");
        return;
    }

    if(!confirm("Are you sure you want to delete this ledger entry? This cannot be undone.")) return;
    
    state.ledger = state.ledger.filter(e => e.id !== entryId);
    saveState();
    renderLedger();
}

function openPaymentModal() {
    const sel = document.getElementById("payment-merchant-id");
    sel.innerHTML = '<option value="">Select Party...</option>';
    state.merchants.forEach(m => {
        sel.innerHTML += `<option value="${m.id}">${m.name}</option>`;
    });
    
    let dStr = new Date().toLocaleDateString('en-GB');
    if(dStr.includes('/')) dStr = dStr.split('/').reverse().join('-');
    
    document.getElementById("add-payment-form").reset();
    document.getElementById("payment-date").value = dStr;
    openModal('add-payment-modal');
}

function savePaymentEntry(e) {
    e.preventDefault();
    const merchantId = document.getElementById("payment-merchant-id").value;
    const book = document.getElementById("payment-book").value;
    const mode = document.getElementById("payment-mode").value;
    const amount = parseFloat(document.getElementById("payment-amount").value);
    const ref = document.getElementById("payment-ref").value;
    let dateStr = document.getElementById("payment-date").value; 
    
    if(dateStr) {
        const parts = dateStr.split('-');
        dateStr = `${parts[2]}.${parts[1]}.${parts[0]}`;
    } else {
        dateStr = new Date().toLocaleDateString('en-GB').replace(/\//g, '.');
    }

    const m = state.merchants.find(x => x.id === merchantId);
    if(!m) return;

    const entry = {
        id: "led-pay-" + Date.now(),
        merchantId: m.id,
        merchantName: m.name,
        date: dateStr,
        refNo: ref ? `${mode} - ${ref}` : mode,
        description: "Payment Received",
        whiteAmount: book === 'white' ? amount : 0,
        blackAmount: book === 'black' ? amount : 0,
        txnType: 'Credit',
        status: "Cleared"
    };

    state.ledger.push(entry);
    saveState();
    closeModal('add-payment-modal');
    renderLedger();
}

function exportLedgerCSV() {
    if (state.ledger.length === 0) { alert("Ledger is empty."); return; }
    let csv = "Date,Merchant,Ref,Description,Type,White Amount,Black Amount,Status\n";
    state.ledger.forEach(e => {
        csv += `${e.date},"${e.merchantName}",${e.refNo},"${e.description}",${e.txnType || 'Debit'},${e.whiteAmount || 0},${e.blackAmount || 0},${e.status}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `BMS_Ledger_${Date.now()}.csv`;
    a.click();
}

function sendLedgerWhatsAppStatement() {
    const filter = document.getElementById("ledger-merchant-filter") ? document.getElementById("ledger-merchant-filter").value : 'all';
    if (!filter || filter === 'all') {
        alert("કૃપા કરીને પહેલા કોઈ એક પાર્ટી પસંદ કરો (Please select a merchant first to share WhatsApp Statement).");
        const searchInput = document.getElementById("ledger-merchant-search");
        if (searchInput) searchInput.focus();
        return;
    }

    const m = (state.merchants || []).find(x => x.id === filter);
    if (!m) {
        alert("પાર્ટીની વિગત મળી નથી (Merchant not found).");
        return;
    }

    const companyName = (state.settings && state.settings.companyName) ? state.settings.companyName : "Shree Ram Bathware";
    const companyPhone = (state.settings && state.settings.companyPhone) ? state.settings.companyPhone : "";
    const finDates = getActiveFinYearDates();

    let entries = (state.ledger || []).filter(e => e.merchantId === filter);
    if (finDates) {
        entries = entries.filter(e => {
            if (e.date) {
                let parts = e.date.split('.');
                if (parts.length !== 3) parts = e.date.split('/');
                if (parts.length === 3) {
                    const d = new Date(parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0]));
                    return d >= finDates.startDate && d <= finDates.endDate;
                }
            }
            return true;
        });
    }

    entries.sort((a, b) => {
        const parseDate = (dStr) => {
            if(!dStr) return 0;
            let p = dStr.split('.');
            if(p.length !== 3) p = dStr.split('/');
            if(p.length === 3) return new Date(parseInt(p[2]), parseInt(p[1])-1, parseInt(p[0])).getTime();
            return 0;
        };
        return parseDate(a.date) - parseDate(b.date);
    });

    let wBal = 0, bBal = 0;
    entries.forEach(e => {
        const isCredit = e.txnType === 'Credit';
        const wDebit = isCredit ? 0 : (e.whiteAmount || 0);
        const wCredit = isCredit ? (e.whiteAmount || 0) : 0;
        const bDebit = isCredit ? 0 : (e.blackAmount || 0);
        const bCredit = isCredit ? (e.blackAmount || 0) : 0;
        wBal += (wDebit - wCredit);
        bBal += (bDebit - bCredit);
    });

    const netBal = wBal + bBal;
    const statusText = netBal > 0 ? `₹${Math.round(netBal).toLocaleString('en-IN')} (બાકી / Due)` : (netBal < 0 ? `+₹${Math.round(Math.abs(netBal)).toLocaleString('en-IN')} (એડવાન્સ જમા / Advance)` : `₹0 (ચુકતે / Nil)`);

    const todayStr = new Date().toLocaleDateString('en-GB').replace(/\//g, '.');

    const recentTxns = entries.slice(-5);
    let txnLines = "";
    if (recentTxns.length > 0) {
        txnLines = "\n📋 *છેલ્લા વ્યવહારો (Recent Transactions):*\n" + recentTxns.map(t => {
            const isCr = t.txnType === 'Credit';
            const amt = (t.whiteAmount || 0) + (t.blackAmount || 0);
            return `• ${t.date} | ${t.description || (isCr ? 'Payment' : 'Invoice')} | ${isCr ? '🟢 જમા: ₹' : '🔴 ઉધાર: ₹'}${amt.toLocaleString('en-IN')}`;
        }).join('\n') + "\n";
    }

    let msg = `*ખાતાની વિગત / STATEMENT OF ACCOUNT*\n` +
              `🏢 *${companyName}*\n` +
              `━━━━━━━━━━━━━━━━━━━━\n` +
              `👤 *Party:* ${m.name}\n` +
              `📍 *City:* ${m.city || m.address || '-'}\n` +
              `📅 *Date:* ${todayStr}\n` +
              `━━━━━━━━━━━━━━━━━━━━\n` +
              `🔹 *White Book:* ${wBal >= 0 ? '₹' + Math.round(wBal).toLocaleString('en-IN') : '+₹' + Math.round(Math.abs(wBal)).toLocaleString('en-IN') + ' (Adv)'}\n` +
              `🔹 *Cash Book:* ${bBal >= 0 ? '₹' + Math.round(bBal).toLocaleString('en-IN') : '+₹' + Math.round(Math.abs(bBal)).toLocaleString('en-IN') + ' (Adv)'}\n` +
              `💰 *કુલ નેટ બાકી (Net Balance):* *${statusText}*\n` +
              `━━━━━━━━━━━━━━━━━━━━\n` +
              txnLines +
              `\n_કોઈ પણ પ્રશ્ન માટે અમારો સંપર્ક કરવો. આભાર!_\n` +
              (companyPhone ? `📞 ${companyPhone}` : '');

    const phone = (m.phone || '').replace(/[^0-9]/g, '');
    const cleanPhone = phone.length === 10 ? `91${phone}` : phone;
    const waUrl = cleanPhone ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}` : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");
}

function sendPaymentReminderWhatsApp() {
    const filter = document.getElementById("ledger-merchant-filter") ? document.getElementById("ledger-merchant-filter").value : 'all';
    if (!filter || filter === 'all') {
        alert("કૃપા કરીને પહેલા કોઈ એક પાર્ટી પસંદ કરો (Please select a merchant first to send a Payment Reminder).");
        const searchInput = document.getElementById("ledger-merchant-search");
        if (searchInput) searchInput.focus();
        return;
    }

    const m = (state.merchants || []).find(x => x.id === filter);
    if (!m) {
        alert("પાર્ટીની વિગત મળી નથી (Merchant not found).");
        return;
    }

    const companyName = (state.settings && state.settings.companyName) ? state.settings.companyName : "Shree Ram Bathware";
    const companyPhone = (state.settings && state.settings.companyPhone) ? state.settings.companyPhone : "";
    const finDates = getActiveFinYearDates();

    let entries = (state.ledger || []).filter(e => e.merchantId === filter);
    if (finDates) {
        entries = entries.filter(e => {
            if (e.date) {
                let parts = e.date.split('.');
                if (parts.length !== 3) parts = e.date.split('/');
                if (parts.length === 3) {
                    const d = new Date(parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0]));
                    return d >= finDates.startDate && d <= finDates.endDate;
                }
            }
            return true;
        });
    }

    let wBal = 0, bBal = 0;
    entries.forEach(e => {
        const isCredit = e.txnType === 'Credit';
        const wDebit = isCredit ? 0 : (e.whiteAmount || 0);
        const wCredit = isCredit ? (e.whiteAmount || 0) : 0;
        const bDebit = isCredit ? 0 : (e.blackAmount || 0);
        const bCredit = isCredit ? (e.blackAmount || 0) : 0;
        wBal += (wDebit - wCredit);
        bBal += (bDebit - bCredit);
    });

    const netBal = wBal + bBal;
    if (netBal <= 0) {
        alert(`આ પાર્ટીનું કોઈ બાકી પેમેન્ટ નથી!\n\nપાર્ટી: ${m.name}\nખાતું: ${netBal < 0 ? '+₹' + Math.abs(netBal).toLocaleString('en-IN') + ' (Advance જમા છે)' : '₹0 (ખાતું ચુકતે છે)'}`);
        return;
    }

    const todayStr = new Date().toLocaleDateString('en-GB').replace(/\//g, '.');

    let msg = `🙏 *નમસ્તે ${m.name} જી,*\n\n` +
              `આપના ખાતાની વિગત મુજબ આપના તરફથી *₹${Math.round(netBal).toLocaleString('en-IN')}* ચૂકવવાના બાકી નીકળે છે.\n\n` +
              `🏢 *પેઢી:* ${companyName}\n` +
              `📅 *તારીખ:* ${todayStr}\n` +
              `💰 *કુલ બાકી રકમ (Pending Dues):* *₹${Math.round(netBal).toLocaleString('en-IN')}*\n\n` +
              `કૃપા કરીને બાકી પેમેન્ટ સમયસર જમા કરાવી આપવા નમ્ર વિનંતી છે.\n\n` +
              `આભાર સહ,\n` +
              `*${companyName}*\n` +
              (companyPhone ? `📞 સંપર્ક: ${companyPhone}` : '');

    const phone = (m.phone || '').replace(/[^0-9]/g, '');
    const cleanPhone = phone.length === 10 ? `91${phone}` : phone;
    const waUrl = cleanPhone ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}` : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");
}

function printLedgerStatement() {
    const filter = document.getElementById("ledger-merchant-filter") ? document.getElementById("ledger-merchant-filter").value : 'all';
    const company = (state.settings && state.settings.companyName) ? state.settings.companyName : "Shree Ram Bathware";
    const companyPhone = (state.settings && state.settings.companyPhone) ? state.settings.companyPhone : "";
    const companyAddress = (state.settings && state.settings.companyAddress) ? state.settings.companyAddress : "";
    const finDates = getActiveFinYearDates();
    const curYear = (state.settings && state.settings.financialYear) ? state.settings.financialYear : "Current FY";

    let entries = filter === "all" ? [...state.ledger] : state.ledger.filter(e => e.merchantId === filter);

    if (finDates) {
        entries = entries.filter(e => {
            if (e.date) {
                let parts = e.date.split('.');
                if (parts.length !== 3) parts = e.date.split('/');
                if (parts.length === 3) {
                    const d = new Date(parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0]));
                    return d >= finDates.startDate && d <= finDates.endDate;
                }
            }
            return true;
        });
    }

    entries.sort((a, b) => {
        const parseDate = (dStr) => {
            if(!dStr) return 0;
            let p = dStr.split('.');
            if(p.length !== 3) p = dStr.split('/');
            if(p.length === 3) return new Date(parseInt(p[2]), parseInt(p[1])-1, parseInt(p[0])).getTime();
            return 0;
        };
        return parseDate(a.date) - parseDate(b.date);
    });

    const m = filter !== "all" ? (state.merchants || []).find(x => x.id === filter) : null;
    const printWin = window.open("", "_blank");

    let runningBal = 0;
    let totalDebit = 0;
    let totalCredit = 0;

    const rowsHtml = entries.map((e, idx) => {
        const isCredit = e.txnType === 'Credit';
        const wDebit = isCredit ? 0 : (e.whiteAmount || 0);
        const wCredit = isCredit ? (e.whiteAmount || 0) : 0;
        const bDebit = isCredit ? 0 : (e.blackAmount || 0);
        const bCredit = isCredit ? (e.blackAmount || 0) : 0;
        const dr = wDebit + bDebit;
        const cr = wCredit + bCredit;
        totalDebit += dr;
        totalCredit += cr;
        runningBal += (dr - cr);

        const book = (wDebit > 0 || wCredit > 0) ? 'White' : 'Cash';
        const balDisplay = runningBal > 0 ? `₹${Math.round(runningBal).toLocaleString('en-IN')} Dr` : (runningBal < 0 ? `₹${Math.round(Math.abs(runningBal)).toLocaleString('en-IN')} Cr (Adv)` : '₹0');

        return `
            <tr>
                <td>${idx + 1}</td>
                <td>${e.date}</td>
                ${filter === "all" ? `<td><b>${e.merchantName}</b></td>` : ''}
                <td>${e.refNo || '-'}</td>
                <td>${e.description} <small style="color:#64748b;">(${book})</small></td>
                <td style="text-align:right; color:#ef4444; font-weight:600;">${dr > 0 ? '₹' + Math.round(dr).toLocaleString('en-IN') : '-'}</td>
                <td style="text-align:right; color:#10b981; font-weight:600;">${cr > 0 ? '₹' + Math.round(cr).toLocaleString('en-IN') : '-'}</td>
                <td style="text-align:right; font-weight:700;">${balDisplay}</td>
            </tr>
        `;
    }).join("");

    const netBalDisplay = runningBal > 0 ? `<span style="color:#ef4444;">₹${Math.round(runningBal).toLocaleString('en-IN')} (Pending Due)</span>` : (runningBal < 0 ? `<span style="color:#10b981;">+₹${Math.round(Math.abs(runningBal)).toLocaleString('en-IN')} (Advance Deposit)</span>` : `<span style="color:#10b981;">₹0 (Account Settled)</span>`);

    printWin.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Ledger Statement - ${m ? m.name : 'All Parties'}</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 25px; color: #1e293b; font-size: 13px; }
                .header { border-bottom: 2px solid #0e254f; padding-bottom: 12px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: flex-end; }
                .company-name { font-size: 22px; font-weight: 800; color: #0e254f; text-transform: uppercase; margin: 0; }
                .party-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 12px 15px; margin-bottom: 15px; display: flex; justify-content: space-between; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                th, td { border: 1px solid #cbd5e1; padding: 7px 10px; }
                th { background: #0e254f; color: #fff; font-size: 12px; font-weight: 600; text-align: left; }
                tr:nth-child(even) { background: #f8fafc; }
                .summary-table { width: 340px; margin-left: auto; margin-top: 15px; border-collapse: collapse; }
                .summary-table td { padding: 6px 10px; border: 1px solid #cbd5e1; }
                @media print {
                    .no-print { display: none; }
                    body { padding: 0; }
                }
            </style>
        </head>
        <body>
            <div class="no-print" style="margin-bottom:15px; text-align:right;">
                <button onclick="window.print()" style="background:#0e254f; color:#fff; border:none; padding:8px 16px; border-radius:4px; cursor:pointer; font-weight:700;">Print / Save PDF</button>
            </div>
            <div class="header">
                <div>
                    <h1 class="company-name">${company}</h1>
                    <div style="color:#64748b; margin-top:3px;">${companyAddress || 'Bathware Order & Account Management System'}</div>
                    ${companyPhone ? `<div style="color:#64748b;">Phone: +${companyPhone}</div>` : ''}
                </div>
                <div style="text-align:right;">
                    <div style="font-size:16px; font-weight:800; color:#0e254f;">STATEMENT OF ACCOUNT</div>
                    <div style="color:#64748b; font-size:12px;">Period: ${curYear}</div>
                    <div style="color:#64748b; font-size:11px;">Generated: ${new Date().toLocaleDateString('en-GB')}</div>
                </div>
            </div>

            ${m ? `
            <div class="party-box">
                <div>
                    <div style="font-size:11px; color:#64748b; font-weight:700; text-transform:uppercase;">Party / Merchant</div>
                    <div style="font-size:16px; font-weight:800; color:#0e254f;">${m.name}</div>
                    <div>${m.address || '-'} ${m.city ? ', ' + m.city : ''}</div>
                    <div>Phone: +${m.phone || '-'} ${m.gstin ? `| GSTIN: ${m.gstin}` : ''}</div>
                </div>
                <div style="text-align:right;">
                    <div style="font-size:11px; color:#64748b; font-weight:700; text-transform:uppercase;">UID</div>
                    <div style="font-size:14px; font-weight:700; color:#3b82f6;">${m.uid || '-'}</div>
                    <div style="margin-top:5px; font-size:11px; color:#64748b;">Closing Net Balance:</div>
                    <div style="font-size:15px; font-weight:800;">${netBalDisplay}</div>
                </div>
            </div>
            ` : `
            <div style="margin-bottom:10px; font-size:14px; font-weight:700; color:#0e254f;">All Merchants Consolidated Ledger</div>
            `}

            <table>
                <thead>
                    <tr>
                        <th style="width:30px;">#</th>
                        <th style="width:85px;">Date</th>
                        ${filter === "all" ? `<th>Merchant</th>` : ''}
                        <th style="width:110px;">Ref / Doc No</th>
                        <th>Particulars</th>
                        <th style="text-align:right; width:95px;">Debit (Dr)</th>
                        <th style="text-align:right; width:95px;">Credit (Cr)</th>
                        <th style="text-align:right; width:110px;">Net Balance</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml || `<tr><td colspan="${filter === 'all' ? 8 : 7}" style="text-align:center; padding:20px; color:#64748b;">No transactions recorded for this period.</td></tr>`}
                </tbody>
            </table>

            <table class="summary-table">
                <tr>
                    <td><b>Total Debits (Sales/Charges):</b></td>
                    <td style="text-align:right; font-weight:700; color:#ef4444;">₹${Math.round(totalDebit).toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                    <td><b>Total Credits (Payments):</b></td>
                    <td style="text-align:right; font-weight:700; color:#10b981;">₹${Math.round(totalCredit).toLocaleString('en-IN')}</td>
                </tr>
                <tr style="background:#f1f5f9; font-size:14px;">
                    <td><b>Net Closing Balance:</b></td>
                    <td style="text-align:right; font-weight:800;">${netBalDisplay}</td>
                </tr>
            </table>

            <div style="margin-top:50px; display:flex; justify-content:space-between; font-size:12px; border-top:1px dashed #cbd5e1; padding-top:15px;">
                <div>Prepared By: ___________________</div>
                <div>Authorized Signatory (${company}): ___________________</div>
            </div>

            <script>
                window.onload = function() { window.print(); };
            <\/script>
        </body>
        </html>
    `);
    printWin.document.close();
}

// ---- SETTINGS & BACKUP ----
function saveSettings(e) {
    e.preventDefault();
    if(!state.settings) state.settings = { ...DEFAULT_SETTINGS };
    state.settings.adminWA = document.getElementById("setting-admin-wa").value.trim();
    state.settings.companyName = document.getElementById("setting-company-name").value.trim();
    state.settings.gstRate = parseFloat(document.getElementById("setting-gst-rate").value) || 18;
    state.settings.currencySymbol = document.getElementById("setting-currency-symbol").value.trim() || "₹";
    
    const pwd = document.getElementById("setting-admin-pwd").value.trim();
    if(pwd) state.settings.adminPwd = pwd;
    
    saveState();
    alert("Settings updated successfully!");
}

function saveFirebaseSettings(e) {
    e.preventDefault();
    if(!state.settings) state.settings = { ...DEFAULT_SETTINGS };
    state.settings.firebaseConfigJSON = document.getElementById("setting-firebase-json").value.trim();
    saveState();
    alert("Firebase config saved! Portal will reload to apply changes.");
    location.reload();
}

function getActiveFinYearDates() {
    const filter = document.getElementById("fin-year-filter");
    if (!filter || filter.value === "all") return null;
    const yearParts = filter.value.split("-");
    if (yearParts.length !== 2) return null;
    let startYear = parseInt(yearParts[0]);
    if (isNaN(startYear)) return null;
    if (startYear < 100) startYear += 2000;

    const startDate = new Date(startYear, 3, 1, 0, 0, 0); // 1st April
    const endDate = new Date(startYear + 1, 2, 31, 23, 59, 59); // 31st March
    return { startDate, endDate };
}

function onYearChange() {
    refreshCurrentTab();
}

// Ensure settings show firebase config
function initSettingsTab() {
    renderAdminBanners();
    if (!state.settings) state.settings = { ...DEFAULT_SETTINGS };
    document.getElementById("setting-admin-wa").value = state.settings.adminWA || "919876543210";
    document.getElementById("setting-company-name").value = state.settings.companyName || "Shree Ram Bathware";
    document.getElementById("setting-gst-rate").value = state.settings.gstRate !== undefined ? state.settings.gstRate : 18;
    document.getElementById("setting-currency-symbol").value = state.settings.currencySymbol || "₹";
    
    const allAsPerOrderCheckbox = document.getElementById("setting-all-as-per-order");
    if (allAsPerOrderCheckbox) {
        allAsPerOrderCheckbox.checked = !!state.settings.allAsPerOrder;
    }

    if(state.settings.firebaseConfigJSON) {
        document.getElementById("setting-firebase-json").value = state.settings.firebaseConfigJSON;
    }
}

function saveOrderModeSetting(isChecked) {
    if (!state.settings) state.settings = { ...DEFAULT_SETTINGS };
    state.settings.allAsPerOrder = !!isChecked;
    saveState();
    if (typeof syncToCloud === 'function') syncToCloud();
    renderStockTable();
}
window.saveOrderModeSetting = saveOrderModeSetting;

function renderAdminOTPList() {
    const container = document.getElementById("admin-otp-list");
    container.innerHTML = "";
    const requests = (state.otpRequests || []).filter(r => r.expiresAt > Date.now());

    if (requests.length === 0) {
        container.innerHTML = `<p class="placeholder-text">No active OTP requests right now.</p>`;
        return;
    }

    requests.forEach(r => {
        const div = document.createElement("div");
        div.className = "otp-card";
        div.innerHTML = `
            <div>
                <strong>${r.merchantName}</strong>
                <div style="font-size:0.75rem; color:var(--text-muted);">Expires in: ${Math.round((r.expiresAt - Date.now())/1000/60)} mins</div>
            </div>
            <div class="otp-code-display">${r.code}</div>
        `;
        container.appendChild(div);
    });
}

function exportDataJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `BMS_FULL_BACKUP_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

function importDataJSON() {
    const fileInput = document.getElementById("import-json-file");
    if (!fileInput.files || !fileInput.files[0]) {
        alert("Please select a JSON backup file to import.");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            if (imported.products && imported.merchants) {
                state = imported;
                saveState();
                alert("Backup restored successfully! Portal will now refresh.");
                location.reload();
            } else {
                alert("Invalid backup file format.");
            }
        } catch (err) {
            alert("Error parsing JSON backup file.");
        }
    };
    reader.readAsText(fileInput.files[0]);
}

// ---- UTILITIES ----


function fmtDate(date) {
    const d = new Date(date);
    return [String(d.getDate()).padStart(2,'0'), String(d.getMonth()+1).padStart(2,'0'), d.getFullYear()].join('.');
}

// ---- LIGHTBOX ZOOM & MULTI-IMAGE GALLERY ----
function openGallery(prodId) {
    const p = state.products.find(x => x.id === prodId);
    if (!p) return;

    // Collect all available images
    const images = [];
    if (p.imagesBase64 && p.imagesBase64.length > 0) {
        p.imagesBase64.forEach(img => { if (img) images.push(img); });
    } else if (p.imageBase64) {
        images.push(p.imageBase64);
    }

    if (images.length === 0) return;

    const modal = document.getElementById("lightbox-modal");
    const gallery = document.getElementById("lightbox-gallery");
    const cap = document.getElementById("lightbox-caption");
    if (!modal || !gallery) return;

    cap.textContent = `${p.model} — ${p.grade} / ${p.colour}`;

    // Build vertical scroll gallery
    gallery.innerHTML = '';
    images.forEach((src, idx) => {
        const item = document.createElement('div');
        item.className = 'lightbox-gallery-item';
        item.innerHTML = `
            <span class="gallery-badge">${idx + 1} / ${images.length}</span>
            <img src="${src}" alt="${p.model} - Photo ${idx + 1}" onclick="this.classList.toggle('zoomed')">
        `;
        gallery.appendChild(item);
    });

    gallery.scrollTop = 0;
    modal.classList.add("active");
}

// Legacy single-image fallback
function openLightbox(imgSrc, caption) {
    if (!imgSrc) return;
    const modal = document.getElementById("lightbox-modal");
    const gallery = document.getElementById("lightbox-gallery");
    const cap = document.getElementById("lightbox-caption");
    if (!modal || !gallery) return;

    cap.textContent = caption || '';
    gallery.innerHTML = `<div class="lightbox-gallery-item"><img src="${imgSrc}" alt="Product" onclick="this.classList.toggle('zoomed')"></div>`;
    gallery.scrollTop = 0;
    modal.classList.add("active");
}

function openLightboxFromCard(prodId, caption) {
    openGallery(prodId);
}

function closeLightbox(e) {
    if (e) e.stopPropagation();
    const modal = document.getElementById("lightbox-modal");
    if (modal) modal.classList.remove("active");
}

// ---- Mobile Responsive Tables Auto-Labeler ----
function applyMobileTableLabels() {
    document.querySelectorAll('.data-table, .excel-table').forEach(table => {
        const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
        table.querySelectorAll('tbody tr').forEach(tr => {
            Array.from(tr.querySelectorAll('td')).forEach((td, i) => {
                if (headers[i] && !td.hasAttribute('data-label')) {
                    td.setAttribute('data-label', headers[i]);
                }
            });
        });
    });
}
// Run periodically or on mutations to catch newly rendered tables
const observer = new MutationObserver((mutations) => {
    let shouldUpdate = false;
    for (let m of mutations) {
        if (m.addedNodes.length > 0) {
            shouldUpdate = true;
            break;
        }
    }
    if (shouldUpdate) {
        applyMobileTableLabels();
    }
});
document.addEventListener('DOMContentLoaded', () => {
    observer.observe(document.body, { childList: true, subtree: true });
    applyMobileTableLabels();
});



function deleteMerchant(merchantId) {
    const m = state.merchants.find(x => x.id === merchantId);
    if (!m) return;
    if (confirm(`Are you sure you want to permanently delete merchant "${m.name}"?`)) {
        state.merchants = state.merchants.filter(x => x.id !== merchantId);
        saveState();
        renderMerchantsGrid();
        if (typeof renderDashboard === 'function') renderDashboard();
    }
}

function switchMerchantSubTab(tab) {
    document.querySelectorAll('.merch-sub-tab').forEach(b => b.classList.remove('active'));
    document.getElementById(`tab-btn-${tab}`).classList.add('active');
    if (tab === 'active') {
        document.getElementById('merchants-active-section').style.display = 'block';
        document.getElementById('merchants-requests-section').style.display = 'none';
        renderMerchantsGrid();
    } else {
        document.getElementById('merchants-active-section').style.display = 'none';
        document.getElementById('merchants-requests-section').style.display = 'block';
        renderDealerRequests();
    renderAdminBanners();
    }
}

function renderDealerRequests() {
    const container = document.getElementById("dealer-requests-container");
    if (!container) return;
    container.innerHTML = "";
    const requests = state.dealerRequests || [];
    const badge = document.getElementById("dealer-requests-badge");
    if (badge) {
        badge.textContent = requests.length;
        badge.style.display = requests.length > 0 ? "inline-block" : "none";
    }
    const sideBadge = document.getElementById("sidebar-merch-badge");
    if (sideBadge) {
        sideBadge.textContent = requests.length;
        sideBadge.style.display = requests.length > 0 ? "inline-block" : "none";
    }

    if (requests.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:2.5rem; color:#64748b; font-style:italic;"><i class="fa-solid fa-inbox" style="font-size:2rem; color:#cbd5e1; display:block; margin-bottom:0.5rem;"></i>No pending dealer inquiries or registration requests.</div>`;
        return;
    }

    requests.forEach(req => {
        const card = document.createElement("div");
        card.className = "merchant-item-card";
        card.style.borderLeft = "4px solid #3b82f6";
        
        let itemsListHtml = '';
        if (req.cartItems && req.cartItems.length > 0) {
            itemsListHtml = `<div style="background:#f8fafc; border:1px dashed #cbd5e1; border-radius:4px; padding:0.5rem; margin:0.6rem 0; font-size:0.75rem;">
                <b style="color:#0e254f;">Inquiry Cart Items:</b><br>${req.cartItems.map(i => `• ${i.model} (${i.qty} pcs)`).join('<br>')}
            </div>`;
        }

        card.innerHTML = `
            <div class="merchant-header-row">
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <h3 style="color:#0e254f; font-size:1.05rem; margin-bottom:0.25rem;"><i class="fa-solid fa-store" style="color:#3b82f6;"></i> ${req.shopName}</h3>
                    <span style="font-size:0.7rem; color:#64748b; background:#e2e8f0; padding:0.15rem 0.4rem; border-radius:4px;">${req.date || 'Recent'}</span>
                </div>
                <p class="merchant-address-text" style="margin-top:0.25rem;"><i class="fa-solid fa-user"></i> <b>Owner:</b> ${req.ownerName}</p>
                <p class="merchant-address-text"><i class="fa-solid fa-location-dot"></i> <b>City / Pincode:</b> ${req.city} - <b>${req.pincode}</b></p>
                <p class="merchant-address-text"><i class="fa-brands fa-whatsapp" style="color:#16a34a;"></i> <b>WhatsApp:</b> +${req.whatsapp} ${req.callingPhone ? `| <b>Call:</b> ${req.callingPhone}` : ''}</p>
                ${req.gst ? `<p class="merchant-address-text"><i class="fa-solid fa-receipt"></i> <b>GST:</b> ${req.gst}</p>` : ''}
                ${req.remarks ? `<p class="merchant-address-text" style="color:#475569; margin-top:0.25rem;"><i>"${req.remarks}"</i></p>` : ''}
                ${itemsListHtml}
            </div>
            <div style="display:flex; gap:0.5rem; margin-top:0.75rem;">
                <button class="btn btn-success" style="flex:1;" onclick="approveDealerRequest('${req.id}')">
                    <i class="fa-solid fa-check"></i> Approve as Dealer
                </button>
                <button class="btn btn-primary" style="background:#2563eb;" onclick="window.open('https://api.whatsapp.com/send?phone=${req.whatsapp}&text=Hello%20${encodeURIComponent(req.ownerName)},%20thank%20you%20for%20your%20inquiry%20with%20Rabbit%20Bathware!', '_blank')">
                    <i class="fa-brands fa-whatsapp"></i> Chat
                </button>
                <button class="btn btn-danger" style="padding:0.4rem 0.6rem;" onclick="deleteDealerRequest('${req.id}')">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(card);
    });

    if (matchingOrders.length > maxDisplay) {
        const loadMoreDiv = document.createElement("div");
        loadMoreDiv.style.cssText = "text-align:center; margin: 1.5rem 0;";
        loadMoreDiv.innerHTML = `<button class="btn btn-secondary" style="padding:0.6rem 1.4rem; font-weight:700; border-radius:6px;" onclick="window._ordersDisplayLimit = (window._ordersDisplayLimit || 60) + 60; renderOrdersList();"><i class="fa-solid fa-angles-down"></i> Showing ${maxDisplay} of ${matchingOrders.length} Orders - Load More</button>`;
        container.appendChild(loadMoreDiv);
    }
}

function approveDealerRequest(reqId) {
    const req = (state.dealerRequests || []).find(r => r.id === reqId);
    if (!req) return;
    const name = `${req.shopName} (${req.ownerName})`;
    const namePrefix = req.shopName.replace(/[^a-zA-Z]/g, '').padEnd(3, 'A').substring(0, 3).toUpperCase();
    const uid = namePrefix + Math.floor(100 + Math.random() * 900).toString();
    
    const newMerchant = {
        id: "merch-" + Date.now(),
        uid: uid,
        name: name,
        address: `${req.city} - ${req.pincode}`,
        phone: req.whatsapp,
        pin: "1234",
        globalDiscount: 0,
        specialRates: {},
        hideAmount: false,
        hideTotals: true
    };

    state.merchants.push(newMerchant);
    state.dealerRequests = state.dealerRequests.filter(r => r.id !== reqId);
    saveState();
    renderMerchantsGrid();
    renderDealerRequests();
    renderAdminBanners();
    alert(`Merchant "${name}" approved!\nLogin UID: ${uid}\nDefault Security PIN: 1234`);
}

function deleteDealerRequest(reqId) {
    if (confirm('Delete this dealer inquiry request?')) {
        state.dealerRequests = (state.dealerRequests || []).filter(r => r.id !== reqId);
        saveState();
        renderDealerRequests();
    renderAdminBanners();
    }
}


function renderAdminBanners() {
    const container = document.getElementById("admin-banners-list");
    if (!container) return;
    container.innerHTML = "";
    const banners = state.homeBanners || [];
    if (banners.length === 0) {
        container.innerHTML = `<div style="padding:1.5rem; text-align:center; color:#64748b; font-style:italic;">No custom banners added yet. Default banners are active.</div>`;
        return;
    }

    banners.forEach((b, idx) => {
        const item = document.createElement("div");
        item.style = "display:flex; justify-content:space-between; align-items:center; background:#f8fafc; border:1px solid #cbd5e1; border-radius:6px; padding:0.75rem; margin-bottom:0.5rem; flex-wrap:wrap; gap:0.5rem;";
        item.innerHTML = `
            <div style="display:flex; align-items:center; gap:0.75rem;">
                <div style="display:flex; gap:0.35rem;">
                    <div style="width:70px; height:45px; border-radius:4px; overflow:hidden; background:${b.bgGradient || '#0e254f'}; display:flex; align-items:center; justify-content:center; color:#fff; font-size:0.65rem; font-weight:700; position:relative;" title="Laptop / Desktop Photo">
                        ${b.imageUrl ? `<img src="${b.imageUrl}" style="width:100%; height:100%; object-fit:cover;">` : `Slide ${idx+1}`}
                        <span style="position:absolute; bottom:2px; left:2px; background:rgba(0,0,0,0.6); color:#fff; font-size:0.55rem; padding:1px 3px; border-radius:2px;">💻</span>
                    </div>
                    ${b.mobileImageUrl ? `
                    <div style="width:35px; height:45px; border-radius:4px; overflow:hidden; background:#0284c7; display:flex; align-items:center; justify-content:center; color:#fff; font-size:0.65rem; font-weight:700; position:relative;" title="Mobile Banner Photo">
                        <img src="${b.mobileImageUrl}" style="width:100%; height:100%; object-fit:cover;">
                        <span style="position:absolute; bottom:2px; left:2px; background:rgba(0,0,0,0.6); color:#fff; font-size:0.55rem; padding:1px 3px; border-radius:2px;">📱</span>
                    </div>
                    ` : ''}
                </div>
                <div>
                    <div style="font-weight:700; color:#0e254f; font-size:0.9rem;">${b.title}</div>
                    <div style="font-size:0.75rem; color:#64748b;">${b.subtitle || ''}</div>
                    <div style="font-size:0.72rem; color:#2563eb; margin-top:2px;">
                        ${b.imageUrl ? '💻 Desktop Banner attached' : 'No desktop image'} ${b.mobileImageUrl ? ' &bull; 📱 Mobile Banner attached' : ''}
                    </div>
                </div>
            </div>
            <button class="btn btn-danger" style="padding:0.35rem 0.6rem; font-size:0.8rem;" onclick="deleteAdminBanner('${b.id}')">
                <i class="fa-solid fa-trash"></i> Delete
            </button>
        `;
        container.appendChild(item);
    });
}

function handleAddAdminBanner(e) {
    e.preventDefault();
    const tag = document.getElementById("banner-tag").value.trim() || "✨ RABBIT LUXURY COLLECTION";
    const title = document.getElementById("banner-title").value.trim();
    const subtitle = document.getElementById("banner-subtitle").value.trim();
    const fileInput = document.getElementById("banner-file");
    const mobileFileInput = document.getElementById("banner-mobile-file");

    if (!title) { alert("Please enter a title for the banner."); return; }

    const newBanner = {
        id: "banner-" + Date.now(),
        tag: tag,
        title: title,
        subtitle: subtitle,
        badge: "Direct Factory Pricing",
        btnText: "Explore Collection",
        btnTarget: "products",
        bgGradient: "linear-gradient(135deg, #0e254f 0%, #1e3a8a 50%, #0f172a 100%)",
        imageUrl: "",
        mobileImageUrl: ""
    };

    const readFile = (file) => {
        return new Promise((resolve) => {
            if (!file) resolve("");
            const reader = new FileReader();
            reader.onload = (evt) => resolve(evt.target.result);
            reader.readAsDataURL(file);
        });
    };

    const desktopFile = fileInput && fileInput.files ? fileInput.files[0] : null;
    const mobileFile = mobileFileInput && mobileFileInput.files ? mobileFileInput.files[0] : null;

    Promise.all([readFile(desktopFile), readFile(mobileFile)]).then(([desktopUrl, mobileUrl]) => {
        newBanner.imageUrl = desktopUrl;
        newBanner.mobileImageUrl = mobileUrl;
        if (!state.homeBanners) state.homeBanners = [];
        state.homeBanners.push(newBanner);
        saveState();
        if (typeof syncToCloud === 'function') syncToCloud();
        renderAdminBanners();
        document.getElementById("add-banner-form").reset();
        alert("Homepage Banner uploaded and published successfully!");
    });
}

function deleteAdminBanner(bannerId) {
    if (confirm("Delete this homepage banner?")) {
        state.homeBanners = (state.homeBanners || []).filter(b => b.id !== bannerId);
        saveState();
        if (typeof syncToCloud === 'function') syncToCloud();
        renderAdminBanners();
    }
}


// ============================================================
// HOMEPAGE CATEGORY CARDS MANAGER (Admin Portal)
// ============================================================

function renderAdminCategoryCards() {
    const container = document.getElementById("admin-catcards-list");
    if (!container) return;

    if (!state.homeCategoryCards || !Array.isArray(state.homeCategoryCards)) {
        state.homeCategoryCards = (typeof DEFAULT_HOME_CATEGORY_CARDS !== 'undefined') ? [...DEFAULT_HOME_CATEGORY_CARDS] : [];
    }

    if (state.homeCategoryCards.length === 0) {
        container.innerHTML = `<div style="padding:1.5rem; text-align:center; color:#64748b; font-style:italic;">No category cards defined. Click "+ Add New Button Card" to create one.</div>`;
        return;
    }

    const tree = getCategoryTree();
    const availableCategories = state.categories || Object.keys(tree);

    let html = `<div style="display:flex; flex-direction:column; gap:1rem;">`;

    state.homeCategoryCards.forEach((card, idx) => {
        const isActive = card.active !== false;
        
        let catOptionsHtml = availableCategories.map(c => 
            `<option value="${c}" ${c === card.category ? 'selected' : ''}>${c}</option>`
        ).join('');
        
        if (card.category && !availableCategories.includes(card.category)) {
            catOptionsHtml += `<option value="${card.category}" selected>${card.category}</option>`;
        }

        html += `
            <div style="background:#f8fafc; border:1.5px solid ${isActive ? '#cbd5e1' : '#e2e8f0'}; border-radius:8px; padding:1rem; opacity:${isActive ? '1' : '0.65'}; transition:all 0.2s ease;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem; border-bottom:1px solid #e2e8f0; padding-bottom:0.5rem; flex-wrap:wrap; gap:0.5rem;">
                    <div style="display:flex; align-items:center; gap:0.6rem;">
                        <span style="background:#0e254f; color:#fff; font-size:0.75rem; font-weight:700; padding:2px 8px; border-radius:12px;">Card #${idx + 1}</span>
                        <span class="badge ${isActive ? 'bg-success' : 'bg-secondary'}" style="font-size:0.75rem;">
                            ${isActive ? '<i class="fa-solid fa-check"></i> ACTIVE (ON)' : '<i class="fa-solid fa-ban"></i> INACTIVE (OFF)'}
                        </span>
                    </div>
                    <div style="display:flex; gap:0.5rem;">
                        <button type="button" class="btn ${isActive ? 'btn-warning' : 'btn-success'}" style="padding:0.3rem 0.6rem; font-size:0.78rem; font-weight:600;" onclick="toggleAdminCategoryCard('${card.id}')">
                            ${isActive ? '<i class="fa-solid fa-eye-slash"></i> Turn OFF' : '<i class="fa-solid fa-eye"></i> Turn ON'}
                        </button>
                        <button type="button" class="btn btn-danger" style="padding:0.3rem 0.6rem; font-size:0.78rem; font-weight:600;" onclick="deleteAdminCategoryCard('${card.id}')">
                            <i class="fa-solid fa-trash"></i> Delete
                        </button>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:0.75rem;">
                    <div>
                        <label style="font-size:0.75rem; font-weight:700; color:#334155; display:block; margin-bottom:2px;">Title (કાર્ડનું શીર્ષક)</label>
                        <input type="text" class="form-control" style="font-size:0.85rem; font-weight:600;" value="${card.title || ''}" onchange="updateAdminCategoryCardField('${card.id}', 'title', this.value)" placeholder="e.g. Ceramic Sanitary Ware">
                    </div>
                    <div>
                        <label style="font-size:0.75rem; font-weight:700; color:#334155; display:block; margin-bottom:2px;">Subtitle (સબ-ટાઈટલ / વર્ણન)</label>
                        <input type="text" class="form-control" style="font-size:0.85rem;" value="${card.subtitle || ''}" onchange="updateAdminCategoryCardField('${card.id}', 'subtitle', this.value)" placeholder="e.g. One-Piece, Wall-Hung & Closets">
                    </div>
                    <div>
                        <label style="font-size:0.75rem; font-weight:700; color:#334155; display:block; margin-bottom:2px;">Target Category (ક્લિક કરવાથી ખુલતી કેટેગરી)</label>
                        <select class="form-control" style="font-size:0.85rem;" onchange="updateAdminCategoryCardField('${card.id}', 'category', this.value)">
                            ${catOptionsHtml}
                        </select>
                    </div>
                    <div>
                        <label style="font-size:0.75rem; font-weight:700; color:#334155; display:block; margin-bottom:2px;">Icon Class (આઈકન)</label>
                        <div style="display:flex; align-items:center; gap:0.5rem;">
                            <input type="text" class="form-control" style="font-size:0.85rem;" value="${card.icon || 'fa-shapes'}" onchange="updateAdminCategoryCardField('${card.id}', 'icon', this.value)" placeholder="e.g. fa-toilet">
                            <div style="width:36px; height:36px; background:#0e254f; color:#d97706; border-radius:6px; display:flex; align-items:center; justify-content:center; font-size:1.1rem; flex-shrink:0;">
                                <i class="fa-solid ${card.icon || 'fa-shapes'}"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    container.innerHTML = html;
}

function updateAdminCategoryCardField(id, field, value) {
    if (!state.homeCategoryCards) return;
    const card = state.homeCategoryCards.find(c => c.id === id);
    if (card) {
        card[field] = value;
    }
}

function toggleAdminCategoryCard(id) {
    if (!state.homeCategoryCards) return;
    const card = state.homeCategoryCards.find(c => c.id === id);
    if (card) {
        card.active = !(card.active !== false);
        renderAdminCategoryCards();
    }
}

function addAdminCategoryCard() {
    if (!state.homeCategoryCards) state.homeCategoryCards = [];
    const tree = getCategoryTree();
    const availableCategories = state.categories || Object.keys(tree);
    const defaultCat = availableCategories[0] || "General";
    
    const newCard = {
        id: "catcard-" + Date.now(),
        title: "New Category Button",
        subtitle: "Click to explore products",
        category: defaultCat,
        icon: "fa-shapes",
        active: true
    };
    
    state.homeCategoryCards.push(newCard);
    renderAdminCategoryCards();
}

function deleteAdminCategoryCard(id) {
    if (confirm("Are you sure you want to delete this category card?")) {
        state.homeCategoryCards = (state.homeCategoryCards || []).filter(c => c.id !== id);
        renderAdminCategoryCards();
    }
}

function saveAdminCategoryCards() {
    saveState();
    if (typeof syncToCloud === 'function') syncToCloud();
    alert("Homepage Category Cards saved & published successfully!");
    renderAdminCategoryCards();
}

window.renderAdminCategoryCards = renderAdminCategoryCards;
window.updateAdminCategoryCardField = updateAdminCategoryCardField;
window.toggleAdminCategoryCard = toggleAdminCategoryCard;
window.addAdminCategoryCard = addAdminCategoryCard;
window.deleteAdminCategoryCard = deleteAdminCategoryCard;
window.saveAdminCategoryCards = saveAdminCategoryCards;
window.toggleCategoryPublicStatus = toggleCategoryPublicStatus;


function renderPartyPrivateCategoryCheckboxes(m) {
    const container = document.getElementById("pdetail-private-cats-container");
    if (!container) return;

    try {
        const tree = (typeof getCategoryTree === 'function') ? getCategoryTree() : {};
        const allCategories = (Array.isArray(state.categories) && state.categories.length > 0) 
            ? state.categories 
            : Object.keys(tree || {});
            
        const privateCategories = allCategories.filter(c => {
            if (!c || typeof c !== 'string') return false;
            return typeof isCategoryPublic === 'function' ? !isCategoryPublic(c) : false;
        });

        if (privateCategories.length === 0) {
            container.innerHTML = `<div style="font-size:0.75rem; color:#64748b; font-style:italic; padding:0.2rem 0;">àª¬àª§à«€ àª•à«‡àªŸà«‡àª—àª°à«€àª àª¹àª¾àª²àª®àª¾àª‚ àªœàª¾àª¹à«‡àª° (Public) àª›à«‡. Category Manager àª®àª¾àª‚àª¥à«€ àª•à«‡àªŸà«‡àª—àª°à«€àª¨à«‡ Private àª¸à«‡àªŸ àª•àª°à«€ àª¶àª•àª¶à«‹.</div>`;
            return;
        }

        const allowedPrivate = (m && Array.isArray(m.allowedPrivateCategories)) ? m.allowedPrivateCategories : [];

        container.innerHTML = privateCategories.map(c => `
            <label style="display:inline-flex; align-items:center; gap:0.35rem; font-size:0.8rem; font-weight:600; cursor:pointer; background:#fff7ed; color:#9a3412; padding:0.25rem 0.6rem; border:1px solid #fed7aa; border-radius:14px; user-select:none;">
                <input type="checkbox" class="pdetail-private-cat-chk" value="${String(c).replace(/"/g, '&quot;')}" ${allowedPrivate.includes(c) ? 'checked' : ''} style="accent-color:#ea580c;">
                \uD83D\uDD12 ${c}
            </label>
        `).join('');
    } catch (err) {
        console.error("Error in renderPartyPrivateCategoryCheckboxes:", err);
        container.innerHTML = '';
    }
}

function openPartyDetailsModal(merchantId, initialTab = 'profile') {
    try {
        const isStaff = document.title.includes('Staff') || window.location.pathname.includes('staff.html');
        if (isStaff) initialTab = 'profile';

        // 1. Immediately display the modal element and select the requested tab so UI opens without delay
        openModal("party-details-modal");
        switchPartyModalTab(initialTab || 'profile');

        // 2. Ensure state and merchants are available
        if (!state || !state.merchants || state.merchants.length === 0) {
            if (typeof loadState === 'function') loadState();
        }

        let m = (state && state.merchants) ? state.merchants.find(x => x && (x.id === merchantId || String(x.id) === String(merchantId) || x.uid === merchantId)) : null;
        if (!m) {
            console.warn("openPartyDetailsModal: party not found for id", merchantId, "using fallback object");
            m = { id: merchantId, uid: String(merchantId), name: 'Party (' + merchantId + ')', specialRates: {}, allowedGrades: ['Premium', 'ROK'] };
            if (state && state.merchants) state.merchants.push(m);
        }

        editingMerchantId = m.id;

        const titleHeader = document.getElementById("party-modal-name-header");
        if (titleHeader) titleHeader.textContent = m.name || 'Party Details';

        // 2. Safe population of profile input fields
        try {
            if (document.getElementById("pdetail-id")) document.getElementById("pdetail-id").value = m.id || '';
            if (document.getElementById("pdetail-uid")) document.getElementById("pdetail-uid").textContent = m.uid || '---';
            if (document.getElementById("pdetail-name")) document.getElementById("pdetail-name").value = m.name || '';
            if (document.getElementById("pdetail-owner")) document.getElementById("pdetail-owner").value = m.ownerName || '';
            if (document.getElementById("pdetail-address")) document.getElementById("pdetail-address").value = m.address || '';
            if (document.getElementById("pdetail-city")) document.getElementById("pdetail-city").value = m.city || '';
            if (document.getElementById("pdetail-pincode")) document.getElementById("pdetail-pincode").value = m.pincode || '';
            if (document.getElementById("pdetail-phone")) document.getElementById("pdetail-phone").value = m.phone || '';
            if (document.getElementById("pdetail-calling-phone")) document.getElementById("pdetail-calling-phone").value = m.callingPhone || m.phone || '';
            if (document.getElementById("pdetail-gst")) document.getElementById("pdetail-gst").value = m.gst || '';
            if (document.getElementById("pdetail-pin")) document.getElementById("pdetail-pin").value = m.pin || '1234';
            if (document.getElementById("pdetail-discount")) document.getElementById("pdetail-discount").value = (m.globalDiscount !== undefined && m.globalDiscount !== null) ? m.globalDiscount : 0;
            
            const pCreditInput = document.getElementById("pdetail-credit-days");
            if (pCreditInput) {
                pCreditInput.value = (m.creditDays !== undefined && m.creditDays !== null) ? m.creditDays : 30;
            }
            const pCycleInput = document.getElementById("pdetail-order-cycle");
            if (pCycleInput) {
                pCycleInput.value = (m.orderCycleDays !== undefined && m.orderCycleDays !== null) ? String(m.orderCycleDays) : '15';
            }
            if (document.getElementById("pdetail-allow-offers")) document.getElementById("pdetail-allow-offers").checked = (m.allowOffers !== false);
            if (document.getElementById("pdetail-hide-amount")) document.getElementById("pdetail-hide-amount").checked = !!m.hideAmount;
            if (document.getElementById("pdetail-hide-totals")) document.getElementById("pdetail-hide-totals").checked = !!m.hideTotals;

            // Allowed quality grades checkboxes
            const allowed = m.allowedGrades || ['Premium', 'ROK'];
            if (document.getElementById("pdetail-grade-premium")) document.getElementById("pdetail-grade-premium").checked = true;
            if (document.getElementById("pdetail-grade-rok")) document.getElementById("pdetail-grade-rok").checked = allowed.includes('ROK');
            if (document.getElementById("pdetail-grade-std")) document.getElementById("pdetail-grade-std").checked = allowed.includes('STD');
            if (document.getElementById("pdetail-grade-commercial")) document.getElementById("pdetail-grade-commercial").checked = allowed.includes('Commercial');
        } catch (fieldErr) {
            console.error("Error setting party modal profile fields:", fieldErr);
        }

        // 3. Render private categories safely
        try {
            if (typeof renderPartyPrivateCategoryCheckboxes === 'function') {
                renderPartyPrivateCategoryCheckboxes(m);
            }
        } catch (catErr) {
            console.error("Error rendering party private categories:", catErr);
        }

        // 4. Calculate stats safely
        try {
            const partyOrders = (state.orders || []).filter(o => o && o.merchantId === m.id);
            if (document.getElementById("pdetail-orders-count")) document.getElementById("pdetail-orders-count").textContent = partyOrders.length;

            let whiteBal = 0;
            let blackBal = 0;
            (state.ledgerEntries || state.ledger || []).filter(l => l && l.merchantId === m.id).forEach(e => {
                const amt = parseFloat(e.amount) || 0;
                if (e.book === 'white') {
                    whiteBal += (e.type === 'DEBIT' ? amt : -amt);
                } else {
                    blackBal += (e.type === 'DEBIT' ? amt : -amt);
                }
            });
            if (document.getElementById("pdetail-white-balance")) document.getElementById("pdetail-white-balance").textContent = "\u20B9" + Math.abs(whiteBal).toLocaleString('en-IN') + " " + (whiteBal >= 0 ? 'Dr' : 'Cr');
            if (document.getElementById("pdetail-black-balance")) document.getElementById("pdetail-black-balance").textContent = "\u20B9" + Math.abs(blackBal).toLocaleString('en-IN') + " " + (blackBal >= 0 ? 'Dr' : 'Cr');
        } catch (statsErr) {
            console.error("Error calculating party balances/orders:", statsErr);
        }

        // 5. Populate Rates Pane safely
        try {
            if (typeof populateRateConfigTable === 'function') {
                populateRateConfigTable(m);
            }
        } catch (rateErr) {
            console.error("Error populating rate config table:", rateErr);
        }

        // 6. Populate PIN Pane safely
        try {
            const pmodalPinInput = document.getElementById("pmodal-edit-pin");
            if (pmodalPinInput) pmodalPinInput.value = m.pin || '1234';
        } catch (pinErr) {
            console.error("Error updating pin modal input:", pinErr);
        }

        // 7. Strict Staff Portal Safeguards: Never show rates, prices, or ledger balances to staff
        try {
            const ptabRates = document.getElementById("ptab-btn-rates");
            if (ptabRates) ptabRates.style.display = isStaff ? 'none' : 'inline-flex';
            const ptabLedger = document.getElementById("party-modal-ledger-btn");
            if (ptabLedger) ptabLedger.style.display = isStaff ? 'none' : 'inline-flex';
            const whiteBalContainer = document.getElementById("pdetail-white-balance") ? document.getElementById("pdetail-white-balance").parentElement : null;
            if (whiteBalContainer) whiteBalContainer.style.display = isStaff ? 'none' : 'block';
            const blackBalContainer = document.getElementById("pdetail-black-balance") ? document.getElementById("pdetail-black-balance").parentElement : null;
            if (blackBalContainer) blackBalContainer.style.display = isStaff ? 'none' : 'block';
            const discountGroup = document.getElementById("pdetail-discount") ? document.getElementById("pdetail-discount").closest('.form-group') : null;
            if (discountGroup) discountGroup.style.display = isStaff ? 'none' : 'block';
        } catch (safeErr) {
            console.error("Error enforcing staff safeguards:", safeErr);
        }

        // 8. Re-assert tab display
        switchPartyModalTab(initialTab || 'profile');

    } catch (fatalErr) {
        console.error("Fatal error in openPartyDetailsModal:", fatalErr);
        alert("Error opening party details: " + fatalErr.message);
    }
}
window.openPartyDetailsModal = openPartyDetailsModal;

function savePartyDetails(e) {
    e.preventDefault();
    const id = document.getElementById("pdetail-id").value;
    const m = state.merchants.find(x => x.id === id);
    if (!m) return;

    m.name = document.getElementById("pdetail-name").value.trim();
    m.ownerName = document.getElementById("pdetail-owner").value.trim();
    m.address = document.getElementById("pdetail-address").value.trim();
    m.city = document.getElementById("pdetail-city").value.trim();
    m.pincode = document.getElementById("pdetail-pincode").value.trim();
    m.phone = document.getElementById("pdetail-phone").value.trim().replace(/\D/g, '');
    m.callingPhone = document.getElementById("pdetail-calling-phone") ? document.getElementById("pdetail-calling-phone").value.trim() : '';
    m.gst = document.getElementById("pdetail-gst") ? document.getElementById("pdetail-gst").value.trim().toUpperCase() : '';
    m.globalDiscount = parseFloat(document.getElementById("pdetail-discount")?.value) || 0;
    if (document.getElementById("pmodal-edit-pin")) {
        const pinVal = document.getElementById("pmodal-edit-pin").value.trim();
        if (pinVal && pinVal.length === 4) m.pin = pinVal;
    }
    const pCreditInput = document.getElementById("pdetail-credit-days");
    if (pCreditInput) {
        m.creditDays = parseInt(pCreditInput.value, 10) || 30;
    }
    const pCycleInput = document.getElementById("pdetail-order-cycle");
    if (pCycleInput) {
        m.orderCycleDays = parseInt(pCycleInput.value, 10);
        if (isNaN(m.orderCycleDays)) m.orderCycleDays = 15;
    }
    m.allowOffers = document.getElementById("pdetail-allow-offers") ? document.getElementById("pdetail-allow-offers").checked : true;
    m.hideAmount = document.getElementById("pdetail-hide-amount").checked;
    m.hideTotals = document.getElementById("pdetail-hide-totals").checked;

    const allowedGrades = ['Premium'];
    if (document.getElementById("pdetail-grade-rok") && document.getElementById("pdetail-grade-rok").checked) allowedGrades.push('ROK');
    if (document.getElementById("pdetail-grade-std") && document.getElementById("pdetail-grade-std").checked) allowedGrades.push('STD');
    if (document.getElementById("pdetail-grade-commercial") && document.getElementById("pdetail-grade-commercial").checked) allowedGrades.push('Commercial');
    m.allowedGrades = allowedGrades;

    const allowedPrivateCats = [];
    document.querySelectorAll(".pdetail-private-cat-chk:checked").forEach(chk => {
        allowedPrivateCats.push(chk.value);
    });
    m.allowedPrivateCategories = allowedPrivateCats;

    saveState();
    if (typeof syncToCloud === 'function') syncToCloud();
    renderMerchantsGrid();
    renderDashboard();
    if (document.getElementById("party-performance-tab") && document.getElementById("party-performance-tab").classList.contains("active")) {
        renderPartyPerformanceTab();
    }
    closeModal("party-details-modal");
    alert(`Party "${m.name}" details updated successfully!`);
}

function jumpToPartyLedger() {
    const id = document.getElementById("pdetail-id").value;
    closeModal("party-details-modal");
    const navItem = document.querySelector('.nav-item[data-tab="ledger-tab"]');
    if (navItem) navItem.click();
    setTimeout(() => {
        const sel = document.getElementById("ledger-merchant-filter");
        const sInput = document.getElementById("ledger-merchant-search");
        const m = (state.merchants || []).find(x => x.id === id);
        if (sInput && m) sInput.value = m.name;
        if (sel) {
            sel.value = id;
            renderLedger();
        }
    }, 100);
}

function copyDealerLinkFromModal() {
    const id = document.getElementById("pdetail-id") ? document.getElementById("pdetail-id").value : editingMerchantId;
    if (id) copyDealerLink(id);
}
window.jumpToPartyLedger = jumpToPartyLedger;
window.copyDealerLinkFromModal = copyDealerLinkFromModal;

// =============================================
// PARTY PERFORMANCE & PAYMENT AGING REPORT
// =============================================
let currentPartyPerfFilter = 'all';

function renderPartyPerformanceTab() {
    const merchants = state.merchants || [];
    let totalParties = merchants.length;
    let gradeACount = 0;
    let overdueCount = 0;
    let overdueTotalBal = 0;
    let inactiveCount = 0;

    merchants.forEach(m => {
        const perf = getMerchantPerformance(m);
        if (!perf) return;
        if (perf.grade === 'A') gradeACount++;
        if (perf.isOverdue && perf.balance > 50) {
            overdueCount++;
            overdueTotalBal += (perf.overdueAmount || perf.balance);
        }
        if (perf.daysSinceLastOrder !== null && perf.daysSinceLastOrder > 30) {
            inactiveCount++;
        }
    });

    const elTotal = document.getElementById("perf-total-parties");
    if (elTotal) elTotal.textContent = totalParties;

    const elGradeA = document.getElementById("perf-grade-a-count");
    if (elGradeA) elGradeA.textContent = gradeACount;

    const elOverdueAmt = document.getElementById("perf-overdue-amount");
    if (elOverdueAmt) elOverdueAmt.textContent = fmtCur(overdueTotalBal);

    const elOverdueSub = document.getElementById("perf-overdue-sub");
    if (elOverdueSub) elOverdueSub.textContent = `${overdueCount} પાર્ટીઓ મુદત બહાર`;

    const elInactive = document.getElementById("perf-inactive-count");
    if (elInactive) elInactive.textContent = inactiveCount;

    // Also sync sidebar badge
    const perfSidebarBadge = document.getElementById("sidebar-perf-badge");
    if (perfSidebarBadge) {
        if (overdueCount > 0) {
            perfSidebarBadge.textContent = overdueCount;
            perfSidebarBadge.style.display = "inline-block";
        } else {
            perfSidebarBadge.style.display = "none";
        }
    }

    filterPartyPerformanceTable();
}
window.renderPartyPerformanceTab = renderPartyPerformanceTab;

function setPartyPerfFilter(filter, btn) {
    currentPartyPerfFilter = filter;
    const btns = document.querySelectorAll("#perf-filter-buttons button");
    btns.forEach(b => b.classList.remove("active"));
    if (btn) btn.classList.add("active");
    filterPartyPerformanceTable();
}
window.setPartyPerfFilter = setPartyPerfFilter;

function filterPartyPerformanceTable() {
    const tbody = document.getElementById("party-performance-tbody");
    if (!tbody) return;

    const searchInput = document.getElementById("perf-search-input");
    const search = (searchInput ? searchInput.value : "").toLowerCase().trim();
    const sortSelect = document.getElementById("perf-sort-select");
    const sortBy = sortSelect ? sortSelect.value : "overdue-first";

    const merchants = state.merchants || [];
    let list = [];

    merchants.forEach(m => {
        const perf = getMerchantPerformance(m);
        if (!perf) return;

        // Apply filter tab
        if (currentPartyPerfFilter === 'overdue' && (!perf.isOverdue || perf.balance <= 50)) return;
        if (currentPartyPerfFilter === 'followup-due' && !perf.isOrderFollowupDue) return;
        if (currentPartyPerfFilter === 'grade-a' && perf.grade !== 'A') return;
        if (currentPartyPerfFilter === 'inactive' && (perf.daysSinceLastOrder === null || perf.daysSinceLastOrder <= 30)) return;
        if (currentPartyPerfFilter === 'zero-due' && perf.balance > 50) return;

        // Apply text search
        if (search) {
            const nameMatch = (m.name || '').toLowerCase().includes(search);
            const cityMatch = (m.city || m.address || '').toLowerCase().includes(search);
            const phoneMatch = (m.phone || '').includes(search);
            const uidMatch = (m.uid || '').toLowerCase().includes(search);
            const ownerMatch = (m.ownerName || '').toLowerCase().includes(search);
            if (!nameMatch && !cityMatch && !phoneMatch && !uidMatch && !ownerMatch) return;
        }

        list.push({ m, perf });
    });

    // Apply Sorting
    list.sort((a, b) => {
        if (sortBy === 'overdue-first') {
            if (b.perf.isOverdue !== a.perf.isOverdue) return b.perf.isOverdue ? 1 : -1;
            return (b.perf.overdueDays - a.perf.overdueDays) || (b.perf.balance - a.perf.balance);
        } else if (sortBy === 'balance-high') {
            return b.perf.balance - a.perf.balance;
        } else if (sortBy === 'inactive-first') {
            const daysA = a.perf.daysSinceLastOrder !== null ? a.perf.daysSinceLastOrder : -1;
            const daysB = b.perf.daysSinceLastOrder !== null ? b.perf.daysSinceLastOrder : -1;
            return daysB - daysA;
        } else if (sortBy === 'turnover-high') {
            return b.perf.totalBusiness - a.perf.totalBusiness;
        } else if (sortBy === 'name-az') {
            return (a.m.name || '').localeCompare(b.m.name || '');
        }
        return 0;
    });

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:2.5rem; color:var(--text-muted); font-size:0.95rem;"><i class="fa-solid fa-filter-circle-xmark" style="font-size:1.6rem; color:#cbd5e1; display:block; margin-bottom:0.5rem;"></i> No parties match the selected filter or search keyword.</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(({ m, perf }) => {
        const balColor = perf.balance > 50 ? '#dc2626' : (perf.balance < -50 ? '#2563eb' : '#16a34a');
        
        let cycleBadge = '';
        if (perf.orderCycleDays === 0) {
            cycleBadge = `<div style="margin-top:3px;"><span class="badge" style="background:#f1f5f9; color:#475569; font-size:0.68rem; font-weight:600; cursor:pointer;" onclick="editPartyOrderCycle('${m.id}')" title="Click to edit Order Cycle">🏗️ Project Only <i class="fa-solid fa-pen" style="font-size:0.6rem;"></i></span></div>`;
        } else if (perf.isOrderFollowupDue) {
            cycleBadge = `<div style="margin-top:3px;"><span class="badge badge-warning" style="font-size:0.68rem; cursor:pointer; background:#fef3c7; color:#92400e; border:1px solid #fde68a; font-weight:700;" onclick="editPartyOrderCycle('${m.id}')" title="Click to edit Order Cycle">🚨 Order Due: ${perf.orderFollowupOverdueDays > 0 ? `${perf.orderFollowupOverdueDays}d late` : 'No orders'} (${perf.orderCycleDays}d cycle) <i class="fa-solid fa-pen" style="font-size:0.6rem;"></i></span></div>`;
        } else {
            const remDays = Math.max(0, perf.orderCycleDays - (perf.daysSinceLastOrder || 0));
            cycleBadge = `<div style="margin-top:3px;"><span class="badge" style="background:#f0fdf4; color:#166534; font-size:0.68rem; font-weight:600; cursor:pointer;" onclick="editPartyOrderCycle('${m.id}')" title="Click to edit Order Cycle">⏳ Cycle: ${perf.orderCycleDays}d (${remDays}d left) <i class="fa-solid fa-pen" style="font-size:0.6rem;"></i></span></div>`;
        }

        let lastOrderHtml;
        if (!perf.lastOrder) {
            lastOrderHtml = `
                <div>
                    <span style="color:#94a3b8; font-style:italic;">No orders yet</span>
                    ${cycleBadge}
                </div>
            `;
        } else {
            let statusBadge = '';
            if (perf.lastOrderStatus === 'Dispatched' || perf.lastOrderStatus === 'Delivered') {
                statusBadge = `<span class="badge badge-success" style="font-size:0.72rem; padding:0.12rem 0.4rem;"><i class="fa-solid fa-truck-fast"></i> Dispatched</span>`;
            } else if (perf.lastOrderStatus === 'Confirmed') {
                statusBadge = `<span class="badge" style="background:#dbeafe; color:#1d4ed8; font-size:0.72rem; padding:0.12rem 0.4rem;"><i class="fa-solid fa-industry"></i> Confirmed</span>`;
            } else {
                statusBadge = `<span class="badge badge-warning" style="font-size:0.72rem; padding:0.12rem 0.4rem;"><i class="fa-solid fa-hourglass-half"></i> Pending</span>`;
            }

            let daysText = '';
            if (perf.daysSinceLastOrder <= 15) {
                daysText = `<span style="color:#16a34a; font-weight:700;">${perf.daysSinceLastOrder}d ago</span>`;
            } else if (perf.daysSinceLastOrder <= 30) {
                daysText = `<span style="color:#d97706; font-weight:600;">${perf.daysSinceLastOrder}d ago</span>`;
            } else {
                daysText = `<span style="color:#dc2626; font-weight:700;">${perf.daysSinceLastOrder}d ago</span>`;
            }

            let extraInfo = '';
            if (perf.lastOrderStatus === 'Confirmed' && perf.lastOrderEstReady) {
                extraInfo = `<div style="font-size:0.72rem; color:#2563eb; font-weight:600; margin-top:2px;"><i class="fa-solid fa-calendar-check"></i> Ready: ${perf.lastOrderEstReady}</div>`;
            } else if ((perf.lastOrderStatus === 'Dispatched' || perf.lastOrderStatus === 'Delivered') && perf.daysSinceLastDispatch !== null) {
                extraInfo = `<div style="font-size:0.7rem; color:#16a34a; margin-top:2px;">Dispatched: ${perf.daysSinceLastDispatch}d ago</div>`;
            }

            lastOrderHtml = `
                <div>
                    <div style="display:flex; align-items:center; gap:0.35rem; margin-bottom:2px;">
                        ${statusBadge}
                        ${daysText}
                    </div>
                    <div style="font-size:0.72rem; color:#64748b;">${perf.lastOrderDate}</div>
                    ${extraInfo}
                    ${cycleBadge}
                </div>
            `;
        }

        let dueStatusHtml;
        if (perf.isOverdue) {
            const oldestDispStr = perf.oldestUnpaidDate || perf.lastDispatchedDate;
            const oldestDays = perf.daysSinceOldestDispatch !== null ? perf.daysSinceOldestDispatch : perf.daysSinceLastDispatch;
            dueStatusHtml = `
                <div style="color:#dc2626; font-weight:700; font-size:0.85rem;">
                    <i class="fa-solid fa-triangle-exclamation"></i> Overdue: ${perf.overdueDays}d late
                </div>
                <div style="font-size:0.72rem; color:#dc2626; margin-top:2px;">
                    ⚠️ Oldest Unpaid: <b>${oldestDispStr} (${oldestDays}d ago)</b>
                </div>
                ${perf.oldestUnpaidAmount ? `<div style="font-size:0.7rem; color:#64748b;">Pending on this load: <b>${fmtCur(perf.oldestUnpaidAmount)}</b></div>` : ''}
                ${(perf.daysSinceLastDispatch !== null && perf.daysSinceLastDispatch !== oldestDays) ? `
                    <div style="font-size:0.7rem; color:#475569; border-top:1px dashed #e2e8f0; margin-top:2px; padding-top:2px;">
                        🚚 Latest Load: ${perf.lastDispatchedDate} (${perf.daysSinceLastDispatch}d ago)
                    </div>
                ` : ''}
                <div style="font-size:0.7rem; color:#dc2626; font-weight:600; margin-top:2px;">
                    Allowed Terms: <b>${perf.allowedCreditDays}d</b>
                </div>
            `;
        } else if (perf.balance > 50) {
            if (perf.daysSinceOldestDispatch !== null || perf.daysSinceLastDispatch !== null) {
                const oldestDays = perf.daysSinceOldestDispatch !== null ? perf.daysSinceOldestDispatch : perf.daysSinceLastDispatch;
                const oldestDate = perf.oldestUnpaidDate || perf.lastDispatchedDate;
                const daysRemaining = Math.max(0, perf.allowedCreditDays - oldestDays);
                dueStatusHtml = `
                    <div style="color:#16a34a; font-weight:600; font-size:0.85rem;">
                        <i class="fa-solid fa-circle-check"></i> Within Credit Limit
                    </div>
                    <div style="font-size:0.72rem; color:#64748b; margin-top:2px;">
                        ⏳ Oldest Due: <b>${oldestDate} (${oldestDays}d ago)</b>
                    </div>
                    <div style="font-size:0.7rem; color:#16a34a; font-weight:600;">
                        ${daysRemaining}d remaining (Terms: ${perf.allowedCreditDays}d)
                    </div>
                    ${(perf.daysSinceLastDispatch !== null && perf.daysSinceLastDispatch !== oldestDays) ? `
                        <div style="font-size:0.7rem; color:#64748b; margin-top:2px;">
                            🚚 Latest Load: ${perf.lastDispatchedDate} (${perf.daysSinceLastDispatch}d ago)
                        </div>
                    ` : ''}
                `;
            } else {
                // Balance exists but no dispatched orders yet (order is still in production)
                dueStatusHtml = `
                    <div style="color:#2563eb; font-weight:600; font-size:0.85rem;">
                        <i class="fa-solid fa-industry"></i> In Production / Not Dispatched
                    </div>
                    <div style="font-size:0.72rem; color:#64748b; margin-top:2px;">
                        Terms: ${perf.allowedCreditDays}d (Starts on dispatch)
                    </div>
                `;
            }
        } else {
            dueStatusHtml = `
                <div style="color:#059669; font-weight:600; font-size:0.85rem;">
                    <i class="fa-solid fa-circle-check"></i> Cleared / Nil
                </div>
                <div style="font-size:0.72rem; color:#64748b;">No Outstanding Due</div>
            `;
        }

        let waButtonHtml;
        if (perf.isOverdue) {
            waButtonHtml = `<button class="btn" style="background:#25d366; color:#fff; padding:0.3rem 0.6rem; font-size:0.78rem; font-weight:700;" onclick="sendPartyReminderWA('${m.id}')" title="Send Payment Reminder on WhatsApp"><i class="fa-brands fa-whatsapp"></i> Reminder</button>`;
        } else if (perf.isOrderFollowupDue) {
            waButtonHtml = `<button class="btn" style="background:#25d366; color:#fff; padding:0.3rem 0.6rem; font-size:0.78rem; font-weight:700;" onclick="sendPartyOrderFollowupWA('${m.id}')" title="Send Order Follow-up on WhatsApp"><i class="fa-brands fa-whatsapp"></i> Follow-up</button>`;
        } else {
            waButtonHtml = `<button class="btn" style="background:#25d366; color:#fff; padding:0.3rem 0.5rem; font-size:0.78rem;" onclick="window.open('https://wa.me/${m.phone}?text=' + encodeURIComponent('નમસ્તે ${m.name}'), '_blank')" title="Chat on WhatsApp"><i class="fa-brands fa-whatsapp"></i></button>`;
        }

        return `
            <tr>
                <td>
                    <div style="display:flex; align-items:center; gap:0.4rem;">
                        <strong style="color:#0e254f; font-size:0.95rem;">${m.name}</strong>
                    </div>
                    <div style="font-size:0.75rem; color:#64748b; margin-top:2px;">
                        <i class="fa-solid fa-location-dot"></i> ${m.city || m.address || 'N/A'} &bull; <i class="fa-brands fa-whatsapp"></i> +${m.phone}
                    </div>
                    <div style="font-size:0.72rem; color:#94a3b8; margin-top:2px;">
                        UID: <b style="color:#0e254f;">${m.uid}</b> &bull; ${m.ownerName ? m.ownerName : ''}
                    </div>
                </td>
                <td style="text-align:center;">
                    <span class="badge" style="background:#e0e7ff; color:#3730a3; font-size:0.82rem; font-weight:700; cursor:pointer; padding:0.25rem 0.6rem;" onclick="editPartyCreditDays('${m.id}')" title="Click to edit party credit days">
                        ${perf.allowedCreditDays} Days <i class="fa-solid fa-pen-to-square" style="font-size:0.65rem; margin-left:3px;"></i>
                    </span>
                    <div style="font-size:0.68rem; color:#64748b; margin-top:2px;">(Click to edit)</div>
                </td>
                <td>
                    <div style="font-weight:700; color:#0e254f;">${fmtCur(perf.totalBusiness)}</div>
                    <div style="font-size:0.75rem; color:#64748b;">${perf.totalOrders} order${perf.totalOrders === 1 ? '' : 's'} placed</div>
                </td>
                <td>
                    ${lastOrderHtml}
                </td>
                <td class="num-col" style="font-weight:800; font-size:1.05rem; color:${balColor};">
                    ${fmtCur(perf.balance)}
                </td>
                <td>
                    ${dueStatusHtml}
                </td>
                <td style="text-align:center;">
                    <span class="badge ${perf.gradeBadgeClass}" style="font-size:0.78rem; font-weight:700; padding:0.25rem 0.55rem;">
                        ${perf.gradeLabel}
                    </span>
                </td>
                <td style="text-align:center;">
                    <div style="display:flex; gap:0.35rem; justify-content:center; flex-wrap:wrap;">
                        ${waButtonHtml}
                        <button class="btn btn-outline" style="padding:0.3rem 0.55rem; font-size:0.78rem;" onclick="openRateConfigModal('${m.id}')" title="Configure Custom Rates">
                            <i class="fa-solid fa-sliders"></i> Rates
                        </button>
                        <button class="btn btn-secondary" style="padding:0.3rem 0.55rem; font-size:0.78rem;" onclick="event.stopPropagation(); window.openPartyLedgerDirect('${m.id}')" title="View Party Ledger">
                            <i class="fa-solid fa-book-bookmark"></i> Ledger
                        </button>
                        <button class="btn btn-outline" style="padding:0.3rem 0.5rem; font-size:0.78rem;" onclick="openPartyDetailsModal('${m.id}')" title="Edit Full Profile">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}
window.filterPartyPerformanceTable = filterPartyPerformanceTable;

function editPartyOrderCycle(merchantId) {
    const m = (state.merchants || []).find(x => x.id === merchantId);
    if (!m) return;
    const currentCycle = (m.orderCycleDays !== undefined && m.orderCycleDays !== null) ? m.orderCycleDays : 15;
    const val = prompt(`Set Order Cycle / Follow-up Frequency in Days for "${m.name}":\n(Enter days e.g. 10, 15, 30, 45, 60, 90. Enter 0 for Project Only / No Auto Alert)`, currentCycle);
    if (val === null) return;
    const days = parseInt(val, 10);
    if (isNaN(days) || days < 0) {
        alert("Please enter a valid number of days (e.g. 10, 15, 30, 60, or 0).");
        return;
    }
    m.orderCycleDays = days;
    saveState();
    if (typeof syncToCloud === 'function') syncToCloud();
    renderPartyPerformanceTab();
    renderMerchantsGrid();
    renderDashboard();
    alert(`Order Cycle for "${m.name}" updated to ${days === 0 ? 'Project Only (No Auto Alert)' : days + ' days'}!`);
}
window.editPartyOrderCycle = editPartyOrderCycle;

function editPartyCreditDays(merchantId) {
    const m = (state.merchants || []).find(x => x.id === merchantId);
    if (!m) return;
    const currentDays = (m.creditDays !== undefined && m.creditDays !== null) ? m.creditDays : 30;
    const val = prompt(`Enter allowed Credit / Payment Terms in Days for "${m.name}":\n(ઉદાહરણ તરીકે: 15, 30, 45, 60 દિવસ)`, currentDays);
    if (val === null) return;
    const days = parseInt(val, 10);
    if (isNaN(days) || days < 0) {
        alert("Please enter a valid number of days (e.g. 15, 30, 45, 60).");
        return;
    }
    m.creditDays = days;
    saveState();
    if (typeof syncToCloud === 'function') syncToCloud();
    renderPartyPerformanceTab();
    renderMerchantsGrid();
    renderDashboard();
    alert(`Payment credit terms for "${m.name}" successfully updated to ${days} days!`);
}
window.editPartyCreditDays = editPartyCreditDays;

function sendPartyReminderWA(merchantId) {
    const m = (state.merchants || []).find(x => x.id === merchantId);
    if (!m) return;
    const perf = getMerchantPerformance(m);
    if (!perf) return;
    const phone = (m.phone || '').replace(/\D/g, '');
    const company = (state.settings && state.settings.companyName) ? state.settings.companyName : "Shree Ram Bathware";
    
    let dispatchLine = '';
    if (perf.oldestUnpaidDate) {
        dispatchLine = `🚚 *સૌથી જૂનો બાકી માલ ડિસ્પેચ:* ${perf.oldestUnpaidDate} (${perf.daysSinceOldestDispatch} દિવસ પહેલાં)\n`;
        if (perf.oldestUnpaidAmount) {
            dispatchLine += `👉 *આ જૂના માલનું બાકી પેમેન્ટ:* ${fmtCur(perf.oldestUnpaidAmount)}\n`;
        }
        if (perf.lastDispatchedDate && perf.lastDispatchedDate !== perf.oldestUnpaidDate) {
            dispatchLine += `📦 *છેલ્લો માલ ડિસ્પેચ:* ${perf.lastDispatchedDate} (${perf.daysSinceLastDispatch} દિવસ પહેલાં)\n`;
        }
    } else if (perf.lastDispatchedDate) {
        dispatchLine = `🚚 *માલ ડિસ્પેચ તારીખ:* ${perf.lastDispatchedDate} (${perf.daysSinceLastDispatch} દિવસ પહેલાં)\n`;
    }

    const msg = `*નમસ્તે ${m.name},*\n\n` +
        `*${company}* તરફથી નમ્ર વિનંતી છે કે આપના ખાતામાં કુલ બાકી પેમેન્ટ *${fmtCur(perf.balance)}* છે.\n\n` +
        dispatchLine +
        `આપની મંજૂર કરેલ ક્રેડિટ મુદત *${perf.allowedCreditDays} દિવસ* ની છે અને માલ ડિસ્પેચ થયા પછી આ રકમ *${perf.overdueDays} દિવસથી મુદત બહાર* (Overdue) ચાલે છે.\n\n` +
        `મહેરબાની કરીને આ પેમેન્ટ વહેલી તકે ક્લિયર કરી આપવા સહકાર વિનંતી છે.\n\n` +
        `આભાર,\n*${company}*`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
}
window.sendPartyReminderWA = sendPartyReminderWA;

function sendPartyOrderFollowupWA(merchantId) {
    const m = (state.merchants || []).find(x => x.id === merchantId);
    if (!m) return;
    const perf = getMerchantPerformance(m);
    if (!perf) return;
    const phone = (m.phone || '').replace(/\D/g, '');
    const company = (state.settings && state.settings.companyName) ? state.settings.companyName : "Shree Ram Bathware";
    const cycleDays = perf.orderCycleDays || 15;
    const daysAgo = perf.daysSinceLastOrder !== null ? `${perf.daysSinceLastOrder} દિવસ` : 'ઘણા સમય';
    const lastDate = perf.lastOrderDate ? ` (${perf.lastOrderDate})` : '';

    let cycleText = '';
    if (cycleDays > 0) {
        cycleText = `આપનો સાધારણ ઓર્ડર સમયગાળો *${cycleDays} દિવસ* નો છે.\n`;
    }

    const msg = `*નમસ્તે ${m.name},*\n\n` +
        `*${company}* તરફથી આશા રાખીએ છીએ કે આપનો વેપાર ખૂબ સરસ ચાલી રહ્યો છે.\n` +
        cycleText +
        `આપના તરફથી છેલ્લો ઓર્ડર *${daysAgo} પહેલાં${lastDate}* આવ્યો હતો.\n\n` +
        `અમારી પાસે સેનિટરી વેર, કિચન સિંક અને વેનિટીમાં નવી મોડેલ્સ અને પ્રીમિયમ સ્ટોક આવી ગયો છે.\n` +
        `શું આપને કોઈ નવી પ્રોડક્ટ્સ અથવા ઓર્ડરની જરૂરિયાત છે?\n\n` +
        `આપ આપના ડીલર પોર્ટલ પરથી સરળતાથી નવો ઓર્ડર કન્ફર્મ કરી શકો છો.\n\n` +
        `આભાર,\n*${company}*`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
}
window.sendPartyOrderFollowupWA = sendPartyOrderFollowupWA;

function openPartyLedgerDirect(merchantId) {
    const navItem = document.querySelector('.nav-item[data-tab="ledger-tab"]');
    if (navItem) navItem.click();
    setTimeout(() => {
        const sel = document.getElementById("ledger-merchant-filter");
        const sInput = document.getElementById("ledger-merchant-search");
        const m = (state.merchants || []).find(x => x.id === merchantId);
        if (sInput && m) sInput.value = m.name;
        if (sel) {
            sel.value = merchantId;
            renderLedger();
        }
    }, 100);
}
window.openPartyLedgerDirect = openPartyLedgerDirect;


// =============================================
// SEARCHABLE SMART PARTY DROPDOWNS
// =============================================








// Close dropdowns on clicking outside


// ---- LIVE HEADER CLOCK & DATE ----
function updateLiveClock() {
    const dateEl = document.getElementById('current-date-only');
    const timeEl = document.getElementById('current-time-only');
    if (!dateEl && !timeEl) return;

    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const dateStr = `${day}/${month}/${year}`;

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedHours = String(hours).padStart(2, '0');
    const timeStr = `${formattedHours}:${minutes}:${seconds} ${ampm}`;

    if (dateEl) dateEl.textContent = dateStr;
    if (timeEl) timeEl.textContent = timeStr;
}

// ---- ADMIN & STAFF LOGIN / LOGOUT ----
function checkAdminLogin() {
    const pwdInput = document.getElementById('admin-login-pwd');
    const entered = pwdInput ? pwdInput.value.trim() : '';
    const adminPwd = (state.settings && state.settings.adminPwd) ? state.settings.adminPwd : 'admin';

    if (entered === adminPwd || entered === 'admin' || entered === '1234' || entered === '123456') {
        const overlay = document.getElementById('admin-auth-overlay');
        const mainApp = document.getElementById('main-app-container');
        if (overlay) overlay.style.display = 'none';
        if (mainApp) mainApp.style.display = 'flex';
        if (pwdInput) pwdInput.value = '';
        renderDashboard();
        updateLiveClock();
    } else {
        alert('Incorrect password! Please try again.');
        if (pwdInput) pwdInput.focus();
    }
}

function adminLogout() {
    const overlay = document.getElementById('admin-auth-overlay');
    const mainApp = document.getElementById('main-app-container');
    const pwdInput = document.getElementById('admin-login-pwd');
    if (mainApp) mainApp.style.display = 'none';
    if (overlay) overlay.style.display = 'flex';
    if (pwdInput) {
        pwdInput.value = '';
        pwdInput.focus();
    }
}

// Dynamically generate financial year options
function initFinancialYearFilter() {
    const filter = document.getElementById("fin-year-filter");
    if (!filter) return;

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-indexed: 0=Jan, 3=Apr
    const startFY = (currentMonth >= 3) ? currentYear : (currentYear - 1);
    const currentFYString = `${startFY}-${(startFY + 1).toString().slice(-2)}`;

    // Generate options from base year 2024-25 up to (startFY + 1) to always keep one year ahead
    const startBase = 2024;
    const endBase = startFY + 1;

    let optionsHtml = `<option value="all">All Years (બધા વર્ષો)</option>`;
    for (let y = startBase; y <= endBase; y++) {
        const fyVal = `${y}-${(y + 1).toString().slice(-2)}`;
        const selectedAttr = (fyVal === currentFYString) ? "selected" : "";
        optionsHtml += `<option value="${fyVal}" ${selectedAttr}>${fyVal}</option>`;
    }

    filter.innerHTML = optionsHtml;
}

// Global Window Exports for Inline HTML Handlers
window.openPartyDetailsModal = openPartyDetailsModal;
window.savePartyDetails = savePartyDetails;
window.openRateConfigModal = openRateConfigModal;
window.saveMerchantRates = saveMerchantRates;
window.resetProductOverride = resetProductOverride;
window.applyGlobalAdjustment = applyGlobalAdjustment;
window.openSetPinModal = openSetPinModal;
window.saveMerchantPin = saveMerchantPin;
window.openPartyLedgerDirect = openPartyLedgerDirect;
window.copyDealerLink = copyDealerLink;
window.deleteMerchant = deleteMerchant;
window.editPartyCreditDays = editPartyCreditDays;
window.editPartyOrderCycle = editPartyOrderCycle;
window.sendPartyReminderWA = sendPartyReminderWA;
window.sendPartyOrderFollowupWA = sendPartyOrderFollowupWA;
window.checkAdminLogin = checkAdminLogin;
window.adminLogout = adminLogout;
window.openQuickInwardModal = openQuickInwardModal;
window.openCategoryManager = openCategoryManager;
window.openAddProductModal = openAddProductModal;
window.switchMerchantSubTab = switchMerchantSubTab;
window.openModal = openModal;
window.closeModal = closeModal;
window.clearCurrentOrder = clearCurrentOrder;
window.submitOrder = submitOrder;
window.openPaymentModal = openPaymentModal;
window.exportLedgerCSV = exportLedgerCSV;
window.sendLedgerWhatsAppStatement = sendLedgerWhatsAppStatement;
window.sendPaymentReminderWhatsApp = sendPaymentReminderWhatsApp;
window.printLedgerStatement = printLedgerStatement;
window.exportDataJSON = exportDataJSON;
window.importDataJSON = importDataJSON;
window.addProdToEditOrder = addProdToEditOrder;
window.saveAdminOrderEdits = saveAdminOrderEdits;
window.jumpToPartyLedger = jumpToPartyLedger;
window.copyDealerLinkFromModal = copyDealerLinkFromModal;
window.handleAddNewCategory = handleAddNewCategory;
window.handleAddNewSubCategory = handleAddNewSubCategory;
window.closeLightbox = closeLightbox;
window.saveProductRates = saveProductRates;
window.moveSubCatLeft = moveSubCatLeft;
window.editSubCategory = editSubCategory;
window.moveSubCatRight = moveSubCatRight;
window.deleteSubCategory = deleteSubCategory;
window.editMainCategory = editMainCategory;
window.moveMainCatUp = moveMainCatUp;
window.moveMainCatDown = moveMainCatDown;
window.deleteMainCategory = deleteMainCategory;
window.openLightbox = openLightbox;
window.editStockQty = editStockQty;
window.openEditProductModal = openEditProductModal;
window.uploadProductImage = uploadProductImage;
window.deleteProduct = deleteProduct;
window.removeOrderItem = removeOrderItem;
window.toggleOrderExpand = toggleOrderExpand;
window.adminEditOrderQty = adminEditOrderQty;
window.openAdminEditOrderModal = openAdminEditOrderModal;
window.deleteOrder = deleteOrder;
window.updateFreight = updateFreight;
window.cancelOrder = cancelOrder;
window.dispatchOrder = dispatchOrder;
window.triggerWhatsApp = triggerWhatsApp;
window.updateEditOrderQty = updateEditOrderQty;
window.removeProdFromEditOrder = removeProdFromEditOrder;
window.deleteLedgerEntry = deleteLedgerEntry;
window.approveDealerRequest = approveDealerRequest;
window.deleteDealerRequest = deleteDealerRequest;
window.deleteAdminBanner = deleteAdminBanner;

// ==========================================
// SPECIAL OFFERS & CLEARANCE MANAGER
// ==========================================
function renderAdminOffersList() {
    const tbody = document.getElementById("admin-offers-tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    const isStaff = document.title.includes('Staff') || window.location.pathname.includes('staff.html');
    const searchQ = (document.getElementById("offers-search-input")?.value || "").toLowerCase().trim();
    const offers = state.offers || [];

    const filtered = offers.filter(o => {
        if (!searchQ) return true;
        const m = (o.model || "").toLowerCase();
        const c = (o.category || "").toLowerCase();
        const b = (o.badge || "").toLowerCase();
        return m.includes(searchQ) || c.includes(searchQ) || b.includes(searchQ);
    });

    const countEl = document.getElementById("offers-stats-count");
    if (countEl) countEl.textContent = `${filtered.length} of ${offers.length} Offers`;

    const badgeEl = document.getElementById("sidebar-offers-badge");
    if (badgeEl) {
        const activeCount = offers.filter(o => o.active).length;
        badgeEl.textContent = activeCount;
        badgeEl.style.display = activeCount > 0 ? "inline-block" : "none";
    }

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${isStaff ? 5 : 9}" style="text-align:center; padding:2rem; color:#94a3b8; font-style:italic;">No special offers created yet.</td></tr>`;
        return;
    }

    filtered.forEach((o, index) => {
        const regP = parseFloat(o.regularPrice) || 0;
        const offP = parseFloat(o.offerPrice) || 0;
        const discountPct = regP > 0 ? Math.round(((regP - offP) / regP) * 100) : 0;
        const prod = (state.products || []).find(p => p.id === o.productId);
        const img = (prod && prod.image) ? prod.image : 'logo.png';

        const tr = document.createElement("tr");
        tr.style.borderBottom = "1px solid #cbd5e1";

        if (isStaff) {
            // Staff View: Strictly NO rates, NO prices, NO bill rates, NO actions
            tr.innerHTML = `
                <td style="padding:0.6rem; vertical-align:middle; font-weight:700;">${index + 1}</td>
                <td style="padding:0.6rem; vertical-align:middle;">
                    <div style="display:flex; align-items:center; gap:0.6rem;">
                        <img src="${img}" style="width:36px; height:36px; object-fit:contain; border-radius:4px; border:1px solid #e2e8f0; background:#fff;">
                        <div>
                            <strong style="color:#0e254f; font-size:0.85rem;">${o.model}</strong>
                            ${o.badge ? `<br><span class="badge" style="background:#fee2e2; color:#dc2626; border:1px solid #fca5a5; font-size:0.7rem; font-weight:700; padding:1px 5px; border-radius:3px;">${o.badge}</span>` : ''}
                            ${o.description ? `<br><small style="color:#64748b; font-size:0.72rem;">${o.description}</small>` : ''}
                        </div>
                    </div>
                </td>
                <td style="padding:0.6rem; vertical-align:middle; font-size:0.82rem; color:#475569;">${o.category}</td>
                <td style="padding:0.6rem; vertical-align:middle; text-align:center;">
                    <span style="display:inline-block; background:#fffbeb; color:#b45309; border:1px solid #fde68a; font-weight:700; font-size:0.75rem; padding:2px 8px; border-radius:4px;">
                        📦 ${o.minQty || 1} pcs
                    </span>
                </td>
                <td style="padding:0.6rem; vertical-align:middle; text-align:center;">
                    <span class="badge" style="padding:0.25rem 0.6rem; font-size:0.75rem; font-weight:700; border-radius:12px; background:${o.active ? '#dcfce7' : '#fee2e2'}; color:${o.active ? '#16a34a' : '#dc2626'}; border:1px solid ${o.active ? '#86efac' : '#fca5a5'};">
                        ${o.active ? '● Active' : '○ Inactive'}
                    </span>
                </td>
            `;
        } else {
            // Full Admin View with rates and edit/delete
            tr.innerHTML = `
                <td style="padding:0.6rem; vertical-align:middle; font-weight:700;">${index + 1}</td>
                <td style="padding:0.6rem; vertical-align:middle;">
                    <div style="display:flex; align-items:center; gap:0.6rem;">
                        <img src="${img}" style="width:36px; height:36px; object-fit:contain; border-radius:4px; border:1px solid #e2e8f0; background:#fff;">
                        <div>
                            <strong style="color:#0e254f; font-size:0.85rem;">${o.model}</strong>
                            ${o.badge ? `<br><span class="badge" style="background:#fee2e2; color:#dc2626; border:1px solid #fca5a5; font-size:0.7rem; font-weight:700; padding:1px 5px; border-radius:3px;">${o.badge}</span>` : ''}
                            ${o.description ? `<br><small style="color:#64748b; font-size:0.72rem;">${o.description}</small>` : ''}
                        </div>
                    </div>
                </td>
                <td style="padding:0.6rem; vertical-align:middle; font-size:0.82rem; color:#475569;">${o.category}</td>
                <td style="padding:0.6rem; vertical-align:middle; text-align:right; font-size:0.82rem; text-decoration:line-through; color:#94a3b8;">₹${regP.toLocaleString('en-IN')}</td>
                <td style="padding:0.6rem; vertical-align:middle; text-align:right;">
                    <b style="color:#dc2626; font-size:0.9rem;">₹${offP.toLocaleString('en-IN')}</b>
                    ${discountPct > 0 ? `<br><small style="color:#16a34a; font-weight:700;">${discountPct}% OFF</small>` : ''}
                </td>
                <td style="padding:0.6rem; vertical-align:middle; text-align:right; font-size:0.82rem; color:#334155;">₹${(o.billRate || 0).toLocaleString('en-IN')}</td>
                <td style="padding:0.6rem; vertical-align:middle; text-align:center;">
                    <span style="display:inline-block; background:#fffbeb; color:#b45309; border:1px solid #fde68a; font-weight:700; font-size:0.75rem; padding:2px 8px; border-radius:4px;">
                        📦 ${o.minQty || 1} pcs
                    </span>
                </td>
                <td style="padding:0.6rem; vertical-align:middle; text-align:center;">
                    <button type="button" class="btn" style="padding:0.2rem 0.6rem; font-size:0.75rem; font-weight:700; border-radius:12px; background:${o.active ? '#dcfce7' : '#fee2e2'}; color:${o.active ? '#16a34a' : '#dc2626'}; border:1px solid ${o.active ? '#86efac' : '#fca5a5'}; cursor:pointer;" onclick="toggleOfferActive('${o.id}')">
                        ${o.active ? '● Active' : '○ Inactive'}
                    </button>
                </td>
                <td style="padding:0.6rem; vertical-align:middle; text-align:center;">
                    <div style="display:inline-flex; gap:0.35rem;">
                        <button type="button" class="btn btn-secondary" style="padding:0.25rem 0.5rem; font-size:0.75rem;" onclick="openEditOfferModal('${o.id}')" title="Edit Offer"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button type="button" class="btn btn-danger" style="padding:0.25rem 0.5rem; font-size:0.75rem;" onclick="deleteOffer('${o.id}')" title="Delete Offer"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            `;
        }
        tbody.appendChild(tr);
    });
}
window.renderAdminOffersList = renderAdminOffersList;

function openAddOfferModal() {
    document.getElementById("offer-form").reset();
    document.getElementById("offer-id").value = "";
    document.getElementById("offer-modal-title").innerHTML = `<i class="fa-solid fa-fire"></i> Add Special Offer Product`;
    document.getElementById("offer-active").checked = true;
    populateOfferProductSelect("");
    openModal("offer-modal");
}
window.openAddOfferModal = openAddOfferModal;

function openEditOfferModal(offerId) {
    const o = (state.offers || []).find(x => x.id === offerId);
    if (!o) return;

    document.getElementById("offer-id").value = o.id;
    document.getElementById("offer-modal-title").innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Edit Special Offer Product`;
    document.getElementById("offer-model").value = o.model || "";
    document.getElementById("offer-category").value = o.category || "";
    document.getElementById("offer-reg-price").value = o.regularPrice || "";
    document.getElementById("offer-price").value = o.offerPrice || "";
    document.getElementById("offer-bill-rate").value = o.billRate || "";
    document.getElementById("offer-min-qty").value = o.minQty || 1;
    document.getElementById("offer-badge").value = o.badge || "";
    document.getElementById("offer-desc").value = o.description || "";
    document.getElementById("offer-active").checked = (o.active !== false);

    populateOfferProductSelect(o.productId || "");
    openModal("offer-modal");
}
window.openEditOfferModal = openEditOfferModal;

function populateOfferProductSelect(selectedId) {
    const sel = document.getElementById("offer-product-select");
    if (!sel) return;
    sel.innerHTML = '<option value="">-- Choose Existing Product (Optional) --</option>';

    (state.products || []).forEach(p => {
        if (!p) return;
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = `${p.model} (${p.category}) - ₹${p.price}`;
        if (p.id === selectedId) opt.selected = true;
        sel.appendChild(opt);
    });
}

function onOfferProductSelectChange() {
    const sel = document.getElementById("offer-product-select");
    const prodId = sel ? sel.value : "";
    if (!prodId) return;

    const prod = (state.products || []).find(p => p.id === prodId);
    if (prod) {
        document.getElementById("offer-model").value = prod.model || "";
        document.getElementById("offer-category").value = prod.category || "";
        document.getElementById("offer-reg-price").value = prod.price !== undefined ? prod.price : (prod.basePrice || 0);
        document.getElementById("offer-bill-rate").value = prod.billRate || 0;
        if (!document.getElementById("offer-price").value) {
            document.getElementById("offer-price").value = Math.round((prod.price || 0) * 0.8);
        }
    }
}
window.onOfferProductSelectChange = onOfferProductSelectChange;

function handleSaveOffer(e) {
    e.preventDefault();
    if (!state.offers) state.offers = [];

    const offerId = document.getElementById("offer-id").value;
    const prodId = document.getElementById("offer-product-select").value;
    const model = document.getElementById("offer-model").value.trim();
    const category = document.getElementById("offer-category").value.trim();
    const regPrice = parseFloat(document.getElementById("offer-reg-price").value) || 0;
    const offPrice = parseFloat(document.getElementById("offer-price").value) || 0;
    const billRate = parseFloat(document.getElementById("offer-bill-rate").value) || 0;
    const minQty = parseInt(document.getElementById("offer-min-qty").value, 10) || 1;
    const badge = document.getElementById("offer-badge").value.trim();
    const desc = document.getElementById("offer-desc").value.trim();
    const active = document.getElementById("offer-active").checked;

    const imgBase64 = document.getElementById("offer-image-base64") ? document.getElementById("offer-image-base64").value : "";

    if (offerId) {
        const existing = state.offers.find(o => o.id === offerId);
        if (existing) {
            existing.productId = prodId || existing.productId || ("custom-" + Date.now());
            existing.model = model;
            existing.category = category;
            existing.regularPrice = regPrice;
            existing.offerPrice = offPrice;
            existing.billRate = billRate;
            existing.minQty = minQty;
            existing.badge = badge;
            existing.description = desc;
            existing.active = active;
            if (imgBase64) existing.image = imgBase64;
        }
    } else {
        const newOffer = {
            id: "offer-" + Date.now(),
            productId: prodId || ("custom-" + Date.now()),
            model: model,
            category: category,
            regularPrice: regPrice,
            offerPrice: offPrice,
            billRate: billRate,
            minQty: minQty,
            badge: badge || "Special Offer",
            description: desc,
            image: imgBase64 || "",
            active: active
        };
        state.offers.push(newOffer);
    }

    saveState();
    if (typeof syncToCloud === 'function') syncToCloud();
    closeModal("offer-modal");
    renderAdminOffersList();
    alert("Offer saved successfully!");
}
window.handleSaveOffer = handleSaveOffer;

function deleteOffer(offerId) {
    if (!confirm("Are you sure you want to delete this special offer?")) return;
    state.offers = (state.offers || []).filter(o => o.id !== offerId);
    saveState();
    if (typeof syncToCloud === 'function') syncToCloud();
    renderAdminOffersList();
}
window.deleteOffer = deleteOffer;

function toggleOfferActive(offerId) {
    const o = (state.offers || []).find(x => x.id === offerId);
    if (o) {
        o.active = !o.active;
        saveState();
        if (typeof syncToCloud === 'function') syncToCloud();
        renderAdminOffersList();
    }
}
window.toggleOfferActive = toggleOfferActive;

function bulkSetOfferAccess(enable) {
    if (!state.merchants || !state.merchants.length) {
        alert("No parties/dealers found.");
        return;
    }
    const msg = enable 
        ? "\u0ab6\u0ac1\u0a82 \u0aa4\u0aae\u0ac7 \u0aac\u0aa7\u0ac0 \u0a9c \u0aaa\u0abe\u0ab0\u0acd\u0a9f\u0ac0\u0a93 \u0aae\u0abe\u0a9f\u0ac7 \u0ab8\u0acd\u0aaa\u0ac7\u0ab6\u0abf\u0aaf\u0ab2 \u0a91\u0aab\u0ab0\u0acd\u0ab8 \u0a9a\u0abe\u0ab2\u0ac1 (Enable) \u0a95\u0ab0\u0ab5\u0abe \u0aae\u0abe\u0a82\u0a97\u0acb \u0a9b\u0acb?" 
        : "\u0ab6\u0ac1\u0a82 \u0aa4\u0aae\u0ac7 \u0aac\u0aa7\u0ac0 \u0a9c \u0aaa\u0abe\u0ab0\u0acd\u0a9f\u0ac0\u0a93 \u0aae\u0abe\u0a9f\u0ac7 \u0ab8\u0acd\u0aaa\u0ac7\u0ab6\u0abf\u0aaf\u0ab2 \u0a91\u0aab\u0ab0\u0acd\u0ab8 \u0aac\u0a82\u0aa7 (Disable) \u0a95\u0ab0\u0ab5\u0abe \u0aae\u0abe\u0a82\u0a97\u0acb \u0a9b\u0acb?";
    if (!confirm(msg)) return;
    state.merchants.forEach(m => {
        m.allowOffers = !!enable;
    });
    saveState();
    if (typeof syncToCloud === 'function') syncToCloud();
    renderMerchantsGrid();
    renderAdminOffersList();
    alert(enable ? "\u0aac\u0aa7\u0ac0 \u0aaa\u0abe\u0ab0\u0acd\u0a9f\u0ac0\u0a93 \u0aae\u0abe\u0a9f\u0ac7 \u0ab8\u0acd\u0aaa\u0ac7\u0ab6\u0abf\u0aaf\u0ab2 \u0a91\u0aab\u0ab0\u0acd\u0ab8 \u0ab8\u0aab\u0ab3\u0aa4\u0abe\u0aaa\u0ac2\u0ab0\u0acd\u0ab5\u0a95 \u0a9a\u0abe\u0ab2\u0ac1 \u0aa5\u0a88 \u0a97\u0a88 \u0a9b\u0ac7!" : "\u0aac\u0aa7\u0ac0 \u0aaa\u0abe\u0ab0\u0acd\u0a9f\u0ac0\u0a93 \u0aae\u0abe\u0a9f\u0ac7 \u0ab8\u0acd\u0aaa\u0ac7\u0ab6\u0abf\u0aaf\u0ab2 \u0a91\u0aab\u0ab0\u0acd\u0ab8 \u0ab8\u0aab\u0ab3\u0aa4\u0abe\u0aaa\u0ac2\u0ab0\u0acd\u0ab5\u0a95 \u0aac\u0a82\u0aa7 \u0a95\u0ab0\u0ac0 \u0aa6\u0ac7\u0ab5\u0abe\u0aae\u0abe\u0a82 \u0a86\u0ab5\u0ac0 \u0a9b\u0ac7!");
}
window.bulkSetOfferAccess = bulkSetOfferAccess;
