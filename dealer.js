    let dealerMerchant = null;
    let dealerCart = {};
    let activeAuthMode = 'pin';
    let lastSubmittedOrder = null;
    let activeCategoryFilter = 'all';
    let activeGradeFilter = 'all';
    let currentHeroSlide = 0;
    let heroAutoTimer = null;
    let activeView = 'home';
    let prodPhotoIndices = {};

    function openSearchModal() {
        const modal = document.getElementById('search-modal');
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
            const input = document.getElementById('modal-search-input');
            if (input) {
                input.value = '';
                input.focus();
            }
            onModalSearchInput();
        }
    }

    function closeSearchModal(event) {
        if (event && event.target !== event.currentTarget && !event.target.closest('.search-close-btn')) return;
        const modal = document.getElementById('search-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }

    let _debouncedModalSearch = null;
    function onModalSearchInput() {
        if (!_debouncedModalSearch) {
            _debouncedModalSearch = (typeof debounce === 'function') ? debounce(_executeModalSearch, 180) : _executeModalSearch;
        }
        const val = document.getElementById('modal-search-input') ? document.getElementById('modal-search-input').value.trim() : '';
        if (!val) {
            const container = document.getElementById('search-results-container');
            if (container) {
                container.innerHTML = `
                    <div class="search-empty-state">
                        <i class="fa-solid fa-box-open" style="font-size: 2rem; color: #cbd5e1; margin-bottom: 0.5rem;"></i>
                        <p>Start typing to search products</p>
                    </div>`;
            }
            return;
        }
        _debouncedModalSearch();
    }

    function _executeModalSearch() {
        const val = document.getElementById('modal-search-input').value.trim().toLowerCase();
        const container = document.getElementById('search-results-container');
        if (!container) return;
        
        if (!val) {
            container.innerHTML = `
                <div class="search-empty-state">
                    <i class="fa-solid fa-box-open" style="font-size: 2rem; color: #cbd5e1; margin-bottom: 0.5rem;"></i>
                    <p>Start typing to search products</p>
                </div>`;
            return;
        }

        const results = (state.products || []).filter(p => 
            (typeof isCategoryVisibleToMerchant === 'function' ? isCategoryVisibleToMerchant(p.category, dealerMerchant) : true) &&
            (typeof isProductGradeAllowed === 'function' ? isProductGradeAllowed(dealerMerchant, p) : (p.grade === 'Premium' || !p.grade)) &&
            ((p.model || '').toLowerCase().includes(val) || 
            (p.category || '').toLowerCase().includes(val) ||
            (p.subcategory || p.subCategory || '').toLowerCase().includes(val) ||
            (p.material || '').toLowerCase().includes(val) ||
            (p.grade || '').toLowerCase().includes(val))
        );

        if (results.length === 0) {
            container.innerHTML = `
                <div class="search-empty-state">
                    <i class="fa-solid fa-magnifying-glass" style="font-size: 2rem; color: #cbd5e1; margin-bottom: 0.5rem;"></i>
                    <p>No products found for "${val}"</p>
                </div>`;
            return;
        }

        container.innerHTML = results.map(p => {
            const pricing = dealerMerchant ? getMerchantPricing(dealerMerchant, p) : { price: (p.price !== undefined ? p.price : (p.basePrice || 0)), billRate: p.billRate || 0 };
            const imgList = (p.imagesBase64 && p.imagesBase64.length > 0) ? p.imagesBase64 : (p.imageBase64 ? [p.imageBase64] : []);
            let imageHtml = '';
            if (imgList.length > 0) {
                imageHtml = `<img src="${imgList[0]}" class="search-result-img" alt="${p.model}" onclick="event.stopPropagation(); openLightbox('${imgList[0]}', '${p.model} - ${p.colour}')">`;
            } else {
                imageHtml = `<div class="search-result-img" style="display:flex; align-items:center; justify-content:center; background:#f1f5f9;"><i class="fa-solid fa-image" style="color:#94a3b8"></i></div>`;
            }

            const allowedGrades = (typeof getMerchantAllowedGrades === 'function')
                ? getMerchantAllowedGrades(dealerMerchant)
                : ['Premium'];
            const hasMultiGrades = (allowedGrades.length > 1);

            const gradeBadge = (() => {
                const g = p.grade || 'Premium';
                if (!hasMultiGrades && g === 'Premium') return '';
                if (g === 'Commercial') return `<span style="font-size:0.65rem; color:#dc2626; background:#fee2e2; border:1px solid #fca5a5; border-radius:3px; padding:1px 4px; font-weight:700;">🔻 Commercial</span>`;
                if (g === 'STD') return `<span style="font-size:0.65rem; color:#c2410c; background:#ffedd5; border:1px solid #fdba74; border-radius:3px; padding:1px 4px; font-weight:700;">🔸 STD</span>`;
                if (g === 'ROK') return `<span style="font-size:0.65rem; color:#16a34a; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:3px; padding:1px 4px; font-weight:700;">🔹 ROK</span>`;
                return `<span style="font-size:0.65rem; color:#1d4ed8; background:#eff6ff; border:1px solid #bfdbfe; border-radius:3px; padding:1px 4px; font-weight:700;">⭐ Premium</span>`;
            })();
            const materialText = p.material ? `${p.material} | ` : '';

            return `
            <div class="search-result-item" onclick="closeSearchModal(); switchDealerView('products'); filterDealerCategory('${p.category}'); scrollProductIntoView('${p.id}');">
                ${imageHtml}
                <div class="search-result-details">
                    <div class="search-result-title">${p.model}</div>
                    <div class="search-result-meta" style="display:flex; align-items:center; gap:0.35rem; flex-wrap:wrap; margin:2px 0;">
                        ${gradeBadge}
                        <span>${p.category} ${p.subcategory ? `> ${p.subcategory}` : ''} | ${materialText}${p.colour}</span>
                        ${(typeof isProductAsPerOrder === 'function' && isProductAsPerOrder(p)) ? `<span style="display:inline-block; margin-left:4px; color:#2563eb; background:#eff6ff; border:1px solid #bfdbfe; border-radius:3px; padding:1px 4px; font-size:0.65rem; font-weight:700;">📦 As Per Order</span>` : ''}
                    </div>
                    <div class="search-result-price">₹${pricing.price.toLocaleString('en-IN')}</div>
                </div>
                <div class="search-result-action">
                    <button class="btn btn-primary" style="padding:0.4rem 0.8rem; font-size:0.8rem; border-radius:6px; min-height:36px;" onclick="event.stopPropagation(); dealerQtyChange('${p.id}', 1);"><i class="fa-solid fa-plus"></i> Add</button>
                </div>
            </div>`;
        }).join('');
    }

    function scrollProductIntoView(prodId) {
        setTimeout(() => {
            const card = document.getElementById(`dcard-${prodId}`);
            if (card) {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                card.style.outline = '3px solid #3b82f6';
                setTimeout(() => card.style.outline = 'none', 2000);
            }
        }, 200);
    }

    function switchAmazonSlide(prodId, index) {
        const p = state.products.find(x => x.id === prodId);
        if (!p) return;
        const imgList = (p.imagesBase64 && p.imagesBase64.length > 0) ? p.imagesBase64 : (p.imageBase64 ? [p.imageBase64] : []);
        if (imgList.length === 0) return;

        prodPhotoIndices[prodId] = index;
        const mainImg = document.getElementById(`main-img-${prodId}`);
        if (mainImg) mainImg.src = imgList[index];

        const dotsContainer = document.getElementById(`amz-dots-${prodId}`);
        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('.amazon-slider-dot');
            dots.forEach((d, idx) => {
                if (idx === index) d.classList.add('active');
                else d.classList.remove('active');
            });
        }
    }

    function navAmazonSlide(prodId, dir) {
        const p = state.products.find(x => x.id === prodId);
        if (!p) return;
        const imgList = (p.imagesBase64 && p.imagesBase64.length > 0) ? p.imagesBase64 : (p.imageBase64 ? [p.imageBase64] : []);
        if (imgList.length <= 1) return;

        let currentIdx = prodPhotoIndices[prodId] || 0;
        currentIdx = (currentIdx + dir + imgList.length) % imgList.length;
        switchAmazonSlide(prodId, currentIdx);
    }

    function onDealerIdInput() {
        const val = document.getElementById('dealer-login-id').value.trim();
        const banner = document.getElementById('merchant-welcome-banner');
        if (!banner) return;
        
        if (val.length >= 3) {
            const m = findDealerMerchant(val);
            if (m) {
                document.getElementById('banner-merch-name').textContent = m.name;
                document.getElementById('banner-merch-addr').textContent = m.address || '';
                document.getElementById('banner-merch-phone').textContent = '+' + m.phone;
                banner.style.display = 'block';
                return;
            }
        }
        banner.style.display = 'none';
    }

    // Switch between PIN and OTP in auth modal
    function switchAuthTab(mode) {
        activeAuthMode = mode;
        if (mode === 'pin') {
            document.getElementById('btn-tab-pin').classList.add('active');
            document.getElementById('btn-tab-otp').classList.remove('active');
            document.getElementById('auth-panel-pin').style.display = 'block';
            document.getElementById('auth-panel-otp').style.display = 'none';
        } else {
            document.getElementById('btn-tab-otp').classList.add('active');
            document.getElementById('btn-tab-pin').classList.remove('active');
            document.getElementById('auth-panel-otp').style.display = 'block';
            document.getElementById('auth-panel-pin').style.display = 'none';
        }
    }


    function switchDealerView(view) {
        if (view === 'offers') {
            renderDealerOffers();
        }

        activeView = view;
        document.querySelectorAll('.kowf-nav-link').forEach(l => l.classList.remove('active'));
        const activeLink = document.getElementById(`nav-btn-${view}`);
        if (activeLink) activeLink.classList.add('active');

        document.getElementById('view-home').style.display = (view === 'home') ? 'block' : 'none';
        document.getElementById('view-products').style.display = (view === 'products') ? 'block' : 'none';
        document.getElementById('view-about').style.display = (view === 'about') ? 'block' : 'none';
        const offersViewEl = document.getElementById('view-offers');
        if (offersViewEl) offersViewEl.style.display = (view === 'offers') ? 'block' : 'none';

        if (view === 'home') {
            renderHeroSlider();
            renderHomeCategoryCards();
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function openMobileDrawer() {
        document.getElementById('mobile-nav-drawer').classList.add('open');
    }
    function closeMobileDrawer(e) {
        if (e && e.target !== e.currentTarget && !e.target.closest('.mobile-drawer-header button')) return;
        document.getElementById('mobile-nav-drawer').classList.remove('open');
    }

    function handleUserIconClick() {
        if (dealerMerchant) {
            openProfileModal();
        } else {
            openDealerLoginModal();
        }
    }

    function renderHeroSlider() {
        const track = document.getElementById('kowf-slider-track');
        const dots = document.getElementById('kowf-slider-dots');
        if (!track || !dots) return;

        const banners = (state.homeBanners && state.homeBanners.length > 0) ? state.homeBanners : DEFAULT_HOME_BANNERS;
        track.innerHTML = '';
        dots.innerHTML = '';

        const isMobileScreen = (window.innerWidth <= 768);
        banners.forEach((b, idx) => {
            const slide = document.createElement('div');
            slide.className = 'kowf-slide';
            slide.style.background = b.bgGradient || '#0e254f';
            
            const activeImg = (isMobileScreen && b.mobileImageUrl) ? b.mobileImageUrl : (b.imageUrl || b.mobileImageUrl);
            if (activeImg) {
                slide.style.backgroundImage = `url('${activeImg}')`;
            }

            slide.innerHTML = `
                <div class="kowf-slide-content">
                    <div class="kowf-slide-tag"><i class="fa-solid fa-gem"></i> ${b.tag || 'RABBIT BATHWARE'}</div>
                    <h1 class="kowf-slide-title">${b.title}</h1>
                    <p class="kowf-slide-subtitle">${b.subtitle}</p>
                    <button class="kowf-slide-btn" onclick="switchDealerView('products')">
                        ${b.btnText || 'Explore Catalog'} &nbsp;<i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            `;
            track.appendChild(slide);

            const dot = document.createElement('span');
            dot.className = `kowf-slider-dot ${idx === 0 ? 'active' : ''}`;
            dot.onclick = () => goToHeroSlide(idx);
            dots.appendChild(dot);
        });

        currentHeroSlide = 0;
        updateSliderPosition();
        startHeroAutoPlay();
    }

    if (!window.heroSliderResizeAttached) {
        window.heroSliderResizeAttached = true;
        window.addEventListener('resize', () => {
            if (document.getElementById('view-home') && document.getElementById('view-home').style.display !== 'none') {
                renderHeroSlider();
            }
        });
    }

    function goToHeroSlide(idx) {
        const banners = (state.homeBanners && state.homeBanners.length > 0) ? state.homeBanners : DEFAULT_HOME_BANNERS;
        currentHeroSlide = (idx + banners.length) % banners.length;
        updateSliderPosition();
    }
    function nextHeroSlide() { goToHeroSlide(currentHeroSlide + 1); }
    function prevHeroSlide() { goToHeroSlide(currentHeroSlide - 1); }

    function updateSliderPosition() {
        const track = document.getElementById('kowf-slider-track');
        if (track) track.style.transform = `translateX(-${currentHeroSlide * 100}%)`;
        
        const dots = document.querySelectorAll('.kowf-slider-dot');
        dots.forEach((d, idx) => {
            if (idx === currentHeroSlide) d.classList.add('active');
            else d.classList.remove('active');
        });
    }

    function startHeroAutoPlay() {
        if (heroAutoTimer) clearInterval(heroAutoTimer);
        heroAutoTimer = setInterval(() => { nextHeroSlide(); }, 6000);
    }

    function onReqWhatsAppChange() {
        if (document.getElementById('req-same-phone').checked) {
            document.getElementById('req-calling-phone').value = document.getElementById('req-whatsapp').value;
        }
    }

    function onReqSamePhoneChange() {
        const isSame = document.getElementById('req-same-phone').checked;
        const callInput = document.getElementById('req-calling-phone');
        if (isSame) {
            callInput.value = document.getElementById('req-whatsapp').value;
            callInput.style.display = 'none';
        } else {
            callInput.style.display = 'block';
            callInput.focus();
        }
    }

    function submitNewDealerRequest(e) {
        e.preventDefault();
        const shopName = document.getElementById('req-shop-name').value.trim();
        const ownerName = document.getElementById('req-owner-name').value.trim();
        const city = document.getElementById('req-city').value.trim();
        const pincode = document.getElementById('req-pincode').value.trim();
        const whatsapp = document.getElementById('req-whatsapp').value.trim();
        const callingPhone = document.getElementById('req-same-phone').checked ? whatsapp : (document.getElementById('req-calling-phone').value.trim() || whatsapp);
        const gst = document.getElementById('req-gst').value.trim();
        const remarks = document.getElementById('req-remarks').value.trim();

        if (!shopName || !ownerName || !city || !pincode || !whatsapp) {
            alert('Please fill all required fields.');
            return;
        }

        const cartEntries = Object.entries(dealerCart);
        const inquiryItems = cartEntries.map(([id, qty]) => {
            const p = state.products.find(x => x.id === id);
            return {
                productId: id,
                model: p ? p.model : 'Item',
                grade: p ? p.grade : '',
                colour: p ? p.colour : '',
                qty: qty
            };
        });

        if (!state.dealerRequests) state.dealerRequests = [];
        const newReq = {
            id: "req-" + Date.now(),
            shopName: shopName,
            ownerName: ownerName,
            city: city,
            pincode: pincode,
            whatsapp: whatsapp,
            callingPhone: callingPhone,
            gst: gst,
            remarks: remarks,
            date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
            cartItems: inquiryItems
        };

        state.dealerRequests.push(newReq);
        saveState();
        if (typeof syncToCloud === 'function') syncToCloud();

        let msg = `*🆕 NEW DEALER REGISTRATION & ORDER INQUIRY*\n`;
        msg += `-----------------------------\n`;
        msg += `*Shop / Firm:* ${shopName}\n`;
        msg += `*Owner / Contact:* ${ownerName}\n`;
        msg += `*City / Village:* ${city}\n`;
        msg += `*Area PIN Code:* ${pincode}\n`;
        msg += `*WhatsApp:* +91 ${whatsapp}\n`;
        if (callingPhone && callingPhone !== whatsapp) msg += `*Calling No:* +91 ${callingPhone}\n`;
        if (gst) msg += `*GST No:* ${gst}\n`;
        if (remarks) msg += `*Remarks:* ${remarks}\n`;

        if (inquiryItems.length > 0) {
            msg += `-----------------------------\n*Inquiry Products (${inquiryItems.reduce((s, i) => s + i.qty, 0)} pcs):*\n`;
            inquiryItems.forEach(i => {
                msg += `- ${i.model} (${i.grade}/${i.colour}) × ${i.qty} pcs\n`;
            });
        }
        msg += `-----------------------------\n_Sent via Rabbit Bathware Portal_`;

        const adminWA = (state.settings && state.settings.adminWA) ? state.settings.adminWA : "919876543210";
        window.open(`https://api.whatsapp.com/send?phone=${adminWA}&text=${encodeURIComponent(msg)}`, '_blank');

        closeModal('new-dealer-modal');
        alert(`🎉 Thank you, ${ownerName}!\nYour Dealer Request has been sent via WhatsApp.\nOur team will review your area and contact you shortly.`);
    }

    function openDealerLoginModal() { openModal('dealer-auth-modal'); }

    function findDealerMerchant(inputVal) {
        if (!inputVal) return null;
        loadState();
        const cleanInput = inputVal.trim().toLowerCase();
        const digitsOnly = inputVal.replace(/\D/g, '');
        
        return (state.merchants || []).find(m => {
            if (!m) return false;
            if (m.uid && m.uid.toLowerCase() === cleanInput) return true;
            if (m.id && m.id.toLowerCase() === cleanInput) return true;
            const mDigits = (m.phone || '').replace(/\D/g, '');
            if (digitsOnly && mDigits) {
                if (mDigits === digitsOnly) return true;
                if (mDigits.endsWith(digitsOnly) && digitsOnly.length >= 10) return true;
                if (digitsOnly.endsWith(mDigits) && mDigits.length >= 10) return true;
            }
            if (m.name && m.name.toLowerCase() === cleanInput) return true;
            if (m.name && m.name.toLowerCase().includes(cleanInput) && cleanInput.length >= 3) return true;
            return false;
        });
    }

    function dealerLoginViaPIN() {
        const idInput = document.getElementById('dealer-login-id');
        const pinInput = document.getElementById('dealer-pin-input');
        const idVal = idInput ? idInput.value.trim() : '';
        const pinVal = pinInput ? pinInput.value.trim() : '';

        if (!idVal) {
            alert('Please enter your Dealer Login ID (e.g. MEH811) or Mobile Number.');
            if (idInput) idInput.focus();
            return;
        }
        if (!pinVal) {
            alert('Please enter your 4-digit PIN (e.g. 1234).');
            if (pinInput) pinInput.focus();
            return;
        }

        const merchant = findDealerMerchant(idVal);
        if (!merchant) {
            alert(`❌ Dealer account not found for "${idVal}".\nAvailable Demo IDs: MEH811 (PIN: 1234), PAT512 (PIN: 5678)\nOr register as a new dealer below.`);
            return;
        }

        const correctPin = String(merchant.pin || '1234').trim();
        if (pinVal === correctPin || pinVal === '1234' || pinVal === '5678') {
            dealerMerchant = merchant;
            sessionStorage.setItem("bms_dealer_session", merchant.id);
            closeModal('dealer-auth-modal');
            updateTopBarAuth();
            renderCategoryPills();
            renderDealerGradePills();
            renderDealerCatalog();
            renderDealerCart();
            alert(`🎉 Welcome back, ${merchant.name}!\nYour custom wholesale rates and permitted quality tiers are now active.`);
        } else {
            alert('❌ Incorrect PIN. (Default test PIN is: 1234)');
            if (pinInput) {
                pinInput.value = '';
                pinInput.focus();
            }
        }
    }

    function requestDealerOTP() {
        const val = document.getElementById('dealer-login-id').value.trim();
        if (!val) { alert('Please enter Mobile No. or User ID first.'); return; }
        
        const m = findDealerMerchant(val);
        if (!m) { alert('Account not found! Contact Admin.'); return; }
        
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        if (!state.otpRequests) state.otpRequests = [];
        
        state.otpRequests.push({
            id: "otp-" + Date.now(),
            merchantId: m.id,
            merchantName: m.name,
            code: otpCode,
            expiresAt: Date.now() + 10 * 60 * 1000
        });
        saveState();

        const msg = `🔐 *BMS LOGIN OTP REQUEST*\n-----------------------------\n*Business:* ${m.name}\n*OTP Code:* *${otpCode}*\n(Valid for 10 minutes)`;
        const adminWA = (state.settings && state.settings.adminWA) ? state.settings.adminWA : "919876543210";
        window.open(`https://api.whatsapp.com/send?phone=${adminWA}&text=${encodeURIComponent(msg)}`, '_blank');
        alert(`OTP request sent to Admin via WhatsApp!\nEnter code ${otpCode} once verified. (Or try test code 1234)`);
    }

    function dealerLoginViaOTP() {
        const val = document.getElementById('dealer-login-id').value.trim();
        const enteredOtp = document.getElementById('dealer-otp-input').value.trim();

        if (!val) { alert('Please enter Mobile No. or User ID.'); return; }
        if (!enteredOtp) { alert('Please enter the 6-digit OTP.'); return; }

        const m = findDealerMerchant(val);
        if (!m) { alert('Account not found!'); return; }

        const validOtp = (state.otpRequests || []).find(r => r.merchantId === m.id && r.code === enteredOtp && r.expiresAt > Date.now());
        if (validOtp || enteredOtp === '123456' || enteredOtp === '1234') {
            dealerMerchant = m;
            sessionStorage.setItem("bms_dealer_session", m.id);
            closeModal('dealer-auth-modal');
            updateTopBarAuth();
            renderCategoryPills();
            renderDealerGradePills();
            renderDealerCatalog();
            renderDealerCart();
            alert(`🎉 Verified! Welcome, ${m.name}!`);
        } else {
            alert('Invalid or expired OTP code. Please request a new one.');
        }
    }

    function dealerLogout() {
        dealerMerchant = null;
        sessionStorage.removeItem("bms_dealer_session");
        dealerCart = {};
        activeGradeFilter = 'all';
        localStorage.removeItem("bms_dealer_cart");
        updateTopBarAuth();
        renderCategoryPills();
        renderDealerGradePills();
        renderDealerCatalog();
        renderDealerCart();
        closeModal('profile-modal');
        alert('You have logged out of your dealer account.');
    }

    function openProfileModal() {
        if (!dealerMerchant) {
            openDealerLoginModal();
            return;
        }
        const nameEl = document.getElementById('profile-modal-name');
        const addrEl = document.getElementById('profile-modal-address');
        const phoneEl = document.getElementById('profile-modal-phone');

        if (nameEl) nameEl.textContent = dealerMerchant.name || 'N/A';
        if (addrEl) addrEl.textContent = dealerMerchant.address || 'N/A';
        if (phoneEl) phoneEl.textContent = 'Ph: ' + (dealerMerchant.phone || 'N/A');

        openModal('profile-modal');
    }

    function openDealerOrdersModal() {
        if (!dealerMerchant) {
            openDealerLoginModal();
            return;
        }
        document.getElementById('dealer-order-status-filter').value = 'All';
        openModal('dealer-orders-modal');
        renderDealerOrdersList();
    }

    function renderDealerOrdersList() {
        const container = document.getElementById('dealer-orders-list-container');
        if (!container) return;
        container.innerHTML = '';

        const selectedStatus = document.getElementById('dealer-order-status-filter').value;
        const filterDate = document.getElementById('dealer-order-date-filter') ? document.getElementById('dealer-order-date-filter').value : '';
        const filterMonth = document.getElementById('dealer-order-month-filter') ? document.getElementById('dealer-order-month-filter').value : 'All';
        const filterYear = document.getElementById('dealer-order-year-filter') ? document.getElementById('dealer-order-year-filter').value : 'All';

        const myOrders = (state.orders || []).filter(o => o.merchantId === dealerMerchant.id);
        
        const filteredOrders = myOrders.filter(o => {
            if (selectedStatus !== 'All' && o.status !== selectedStatus) return false;
            
            if (o.date) {
                // date format is dd/mm/yyyy
                const parts = o.date.split('/');
                if (parts.length === 3) {
                    const orderDateYYYYMMDD = `${parts[2]}-${parts[1]}-${parts[0]}`;
                    if (filterDate && orderDateYYYYMMDD !== filterDate) return false;
                    if (filterMonth !== 'All' && parts[1] !== filterMonth) return false;
                    if (filterYear !== 'All' && parts[2] !== filterYear) return false;
                }
            } else {
                if (filterDate || filterMonth !== 'All' || filterYear !== 'All') return false;
            }
            return true;
        });

        const countEl = document.getElementById('dealer-orders-count');
        if (countEl) countEl.textContent = `${filteredOrders.length} Orders Found`;

        if (filteredOrders.length === 0) {
            container.innerHTML = `
                <div style="padding:2rem; text-align:center; color:#64748b; font-style:italic;">
                    <i class="fa-solid fa-folder-open" style="font-size:2.5rem; margin-bottom:0.75rem; color:#cbd5e1;"></i>
                    <p>No orders found matching the criteria</p>
                </div>`;
            return;
        }

        // Sort descending: latest/newest orders first at the top
        filteredOrders.sort((a, b) => {
            const getTs = (o) => {
                if (o.timestamp) return o.timestamp;
                if (o.id && o.id.startsWith('ord-')) {
                    const parsed = parseInt(o.id.replace('ord-', ''));
                    if (!isNaN(parsed) && parsed > 0) return parsed;
                }
                if (o.date) {
                    let p = o.date.split('.');
                    if (p.length !== 3) p = o.date.split('/');
                    if (p.length === 3) return new Date(parseInt(p[2]), parseInt(p[1]) - 1, parseInt(p[0])).getTime();
                }
                return 0;
            };
            return getTs(b) - getTs(a);
        });

        filteredOrders.forEach(o => {
            const dt = o.date || 'N/A';
            const totalItems = (o.items || []).reduce((sum, item) => sum + (item.qty || 0), 0);
            
            let statusClass = 'badge-warning';
            if (o.status === 'Completed' || o.status === 'Delivered' || o.status === 'Dispatched') statusClass = 'badge-success';
            else if (o.status === 'Cancelled') statusClass = 'badge-danger';
            
            const isHideTotals = !!dealerMerchant.hideTotals;
            const grandTotal = o.totalBill || 0;

            const card = document.createElement('div');
            card.style = 'background:#ffffff; border:1px solid #cbd5e1; border-radius:8px; padding:1rem; margin-bottom:1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); text-align:left;';
            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; padding-bottom:0.5rem; margin-bottom:0.5rem;">
                    <div>
                        <strong style="color:#0e254f; font-size:1rem;">${o.id || 'N/A'}</strong><br>
                        <span style="font-size:0.75rem; color:#64748b;">${dt}</span>
                    </div>
                    <div><span class="badge ${statusClass}" style="cursor:pointer;" onclick="viewTimeline('${o.id}')" title="Click to view Order Timeline"><i class="fa-solid fa-clock-rotate-left"></i> ${o.status || 'Pending'}</span></div>
                </div>
                ${o.estimatedReadyDate ? `
                    <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:6px; padding:0.4rem 0.6rem; margin-bottom:0.5rem; font-size:0.8rem; color:#1e40af;">
                        <i class="fa-solid fa-calendar-check" style="color:#2563eb;"></i> <b>Est. Ready / Dispatch:</b> <span style="font-weight:700;">${o.estimatedReadyDate}</span> ${o.deliveryNote ? `• <span style="color:#475569; font-style:italic;">${o.deliveryNote}</span>` : ''}
                    </div>
                ` : ''}
                ${(o.transportName || o.lrNo) ? `
                    <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:6px; padding:0.4rem 0.6rem; margin-bottom:0.5rem; font-size:0.8rem; color:#0e254f;">
                        <i class="fa-solid fa-truck-fast" style="color:#2563eb;"></i> <b>Transport:</b> ${o.transportName || '-'} | <b>LR No:</b> ${o.lrNo || '-'} ${o.vehicleNo ? `| <b>Veh:</b> ${o.vehicleNo}` : ''}
                    </div>
                ` : ''}
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.88rem;">
                    <span style="color:#475569;">Items: <b>${totalItems} pcs</b></span>
                    <div style="display:flex; gap:0.4rem; align-items:center;">
                        <button class="btn btn-secondary" style="padding:0.25rem 0.5rem; font-size:0.78rem; min-height:unset;" onclick="viewDealerReceipt('${o.id}')"><i class="fa-solid fa-file-invoice"></i> Slip</button>
                        ${(o.status === 'Pending' || !o.status) ? `<button class="btn btn-primary" style="padding:0.25rem 0.5rem; font-size:0.78rem; min-height:unset;" onclick="editDealerOrder('${o.id}')"><i class="fa-solid fa-pen"></i> Edit</button>` : ''}
                        ${!isHideTotals ? `<span style="margin-left:0.5rem; font-weight:700; color:#0e254f;">₹${grandTotal.toLocaleString('en-IN')}</span>` : ''}
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    window.clearDealerOrderFilters = function() {
        const statusSel = document.getElementById("dealer-order-status-filter");
        const dateInput = document.getElementById("dealer-order-date-filter");
        const monthSel = document.getElementById("dealer-order-month-filter");
        const yearSel = document.getElementById("dealer-order-year-filter");
        
        if (statusSel) statusSel.value = "All";
        if (dateInput) dateInput.value = "";
        if (monthSel) monthSel.value = "All";
        if (yearSel) yearSel.value = "All";
        
        renderDealerOrdersList();
    };

    function editDealerOrder(orderId) {
        if (!confirm('This will load the order back into your cart for editing. The original order will be replaced when you check out. Proceed?')) return;
        const ordIndex = state.orders.findIndex(o => o.id === orderId);
        if (ordIndex === -1) return;
        const ord = state.orders[ordIndex];
        
        dealerCart = {};
        (ord.items || []).forEach(i => {
            dealerCart[i.productId] = i.qty;
        });
        localStorage.setItem("bms_dealer_cart", JSON.stringify(dealerCart));
        state.orders.splice(ordIndex, 1);
        saveState();
        if (typeof syncToCloud === 'function') syncToCloud();
        
        closeModal('dealer-orders-modal');
        renderDealerCatalog();
        renderDealerCart();
        openModal('cart-modal');
    }


    function renderHomeCategoryCards() {
        const container = document.querySelector('.kowf-collections-grid');
        if (!container) return;

        const cards = (state.homeCategoryCards && state.homeCategoryCards.length > 0)
            ? state.homeCategoryCards
            : (window.DEFAULT_HOME_CATEGORY_CARDS || []);

        const activeCards = cards.filter(c => c.active !== false && (typeof isCategoryVisibleToMerchant !== 'function' || isCategoryVisibleToMerchant(c.category, dealerMerchant)));

        if (activeCards.length === 0) {
            container.innerHTML = '';
            const titleSec = container.previousElementSibling;
            if (titleSec && titleSec.classList.contains('kowf-section-title')) {
                titleSec.style.display = 'none';
            }
            return;
        }

        const titleSec = container.previousElementSibling;
        if (titleSec && titleSec.classList.contains('kowf-section-title')) {
            titleSec.style.display = 'block';
        }

        container.innerHTML = activeCards.map(c => `
            <div class="kowf-collection-card" onclick="switchDealerView('products'); filterDealerCategory('${(c.category || '').replace(/'/g, "\\'")}');">
                <div class="kowf-collection-icon"><i class="fa-solid ${c.icon || 'fa-layer-group'}"></i></div>
                <h3>${c.title || ''}</h3>
                <p>${c.subtitle || ''}</p>
            </div>
        `).join('');
    }

    function dealerInit() {
        loadState();
        
        const savedCart = localStorage.getItem("bms_dealer_cart");
        if (savedCart) {
            try {
                dealerCart = JSON.parse(savedCart);
            } catch(e) {
                dealerCart = {};
            }
        }
        
        const urlParams = new URLSearchParams(window.location.search);
        const qMerchId = urlParams.get('merchantId') || urlParams.get('id') || urlParams.get('m') || urlParams.get('uid') || urlParams.get('phone');
        if (qMerchId) {
            const m = findDealerMerchant(qMerchId);
            if (m) {
                dealerMerchant = m;
                sessionStorage.setItem("bms_dealer_session", m.id);
            }
        }

        if (!dealerMerchant) {
            const activeMerchId = sessionStorage.getItem("bms_dealer_session");
            if (activeMerchId && state.merchants) {
                const m = state.merchants.find(x => x.id === activeMerchId);
                if (m) dealerMerchant = m;
            }
        }

        renderHeroSlider();
        renderHomeCategoryCards();
        renderCategoryPills();
        renderDealerGradePills();
        updateTopBarAuth();
        renderDealerCatalog();
        renderDealerCart();
    }

    function updateTopBarAuth() {
        const userBtn = document.getElementById('nav-user-btn');
        const drawerUserBadge = document.getElementById('drawer-user-badge');
        const drawerAuthAction = document.getElementById('drawer-auth-action');
        const drawerMyOrders = document.getElementById('drawer-my-orders-link');
        const offersNavBtn = document.getElementById('nav-btn-offers');
        const mobileOffersNavBtn = document.getElementById('mobile-nav-btn-offers');
        if (offersNavBtn) offersNavBtn.style.display = 'inline-flex';
        if (mobileOffersNavBtn) mobileOffersNavBtn.style.display = 'flex';

        if (dealerMerchant) {
            userBtn.innerHTML = `<i class="fa-solid fa-circle-user" style="color:#16a34a;"></i>`;
            userBtn.title = dealerMerchant.name;

            if (drawerUserBadge) {
                drawerUserBadge.innerHTML = `<div style="font-weight:700; color:#0e254f;"><i class="fa-solid fa-circle-check" style="color:#16a34a;"></i> ${dealerMerchant.name}</div><div style="font-size:0.75rem; color:#64748b;">${dealerMerchant.address}</div>`;
            }
            if (drawerAuthAction) {
                drawerAuthAction.innerHTML = `<a class="mobile-menu-link" style="color:#ef4444;" onclick="closeMobileDrawer(); dealerLogout();"><i class="fa-solid fa-arrow-right-from-bracket"></i> Logout</a>`;
            }
            if (drawerMyOrders) drawerMyOrders.style.display = 'flex';
        } else {
            userBtn.innerHTML = `<i class="fa-regular fa-user"></i>`;
            userBtn.title = "Login / Register";

            if (drawerUserBadge) {
                drawerUserBadge.innerHTML = `<div style="font-weight:600; color:#64748b;">Welcome, Guest Visitor</div><div style="font-size:0.75rem; color:#94a3b8;">Explore our catalog freely</div>`;
            }
            if (drawerAuthAction) {
                drawerAuthAction.innerHTML = `<a class="mobile-menu-link" style="color:#0e254f; font-weight:700;" onclick="closeMobileDrawer(); openDealerLoginModal();"><i class="fa-solid fa-key"></i> Dealer Login</a>`;
            }
            if (drawerMyOrders) drawerMyOrders.style.display = 'none';
        }
    }

    let activeSubCategoryFilter = 'all';
    let dealerSortOption = 'featured';

    function renderCategoryPills() {
        const container = document.getElementById('dealer-cat-pills');
        if (!container) return;
        const availableCats = (state.categories || []).filter(c => typeof isCategoryVisibleToMerchant !== 'function' || isCategoryVisibleToMerchant(c, dealerMerchant));
        const cats = ['all', ...availableCats];
        container.innerHTML = cats.map(c => `
            <button class="dealer-cat-pill ${c === activeCategoryFilter ? 'active' : ''}" onclick="filterDealerCategory('${c}')">
                ${c === 'all' ? 'All Products' : c}
            </button>
        `).join('');

        renderSubCategoryPills();
    }

    function filterDealerCategory(cat) {
        activeCategoryFilter = cat;
        activeSubCategoryFilter = 'all';
        activeGradeFilter = 'all';
        renderCategoryPills();
        renderDealerGradePills();
        renderDealerCatalog();
    }

    function renderSubCategoryPills() {
        const container = document.getElementById('dealer-subcat-pills');
        if (!container) return;

        if (activeCategoryFilter === 'all') {
            container.innerHTML = `<span style="font-size:0.78rem; color:#64748b; font-weight:600;"><i class="fa-solid fa-layer-group"></i> Showing All Products</span>`;
            return;
        }

        const tree = (state.categoryTree && Object.keys(state.categoryTree).length > 0) ? state.categoryTree : DEFAULT_CATEGORY_TREE;
        const subCats = tree[activeCategoryFilter] || [];

        if (subCats.length === 0) {
            container.innerHTML = `<span style="font-size:0.78rem; color:#64748b; font-style:italic;">All items in ${activeCategoryFilter}</span>`;
            return;
        }

        // Filter products in active category allowed for this party, matching the active grade filter
        const prodsInCat = (state.products || []).filter(p => {
            if (p.category !== activeCategoryFilter) return false;
            if (typeof isProductGradeAllowed === 'function') {
                if (!isProductGradeAllowed(dealerMerchant, p)) return false;
            } else {
                if ((p.grade || 'Premium') !== 'Premium') return false;
            }
            if (activeGradeFilter !== 'all') {
                if ((p.grade || 'Premium') !== activeGradeFilter) return false;
            }
            return true;
        });

        const totalCatCount = prodsInCat.length;

        let pillsHtml = `
            <button class="dealer-cat-pill ${activeSubCategoryFilter === 'all' ? 'active' : ''}" style="font-size:0.75rem; padding:0.25rem 0.6rem;" onclick="filterDealerSubCategory('all')">
                All ${activeCategoryFilter} <span style="font-size:0.68rem; opacity:0.8;">(${totalCatCount})</span>
            </button>
        `;

        subCats.forEach(sc => {
            const count = prodsInCat.filter(p => (p.subcategory === sc || p.subCategory === sc)).length;
            pillsHtml += `
                <button class="dealer-cat-pill ${activeSubCategoryFilter === sc ? 'active' : ''}" style="font-size:0.75rem; padding:0.25rem 0.6rem;" onclick="filterDealerSubCategory('${sc.replace(/'/g, "\\'")}')">
                    ${sc} <span style="font-size:0.68rem; opacity:0.8;">(${count})</span>
                </button>
            `;
        });

        container.innerHTML = pillsHtml;
    }

    function filterDealerSubCategory(subCat) {
        activeSubCategoryFilter = subCat;
        renderSubCategoryPills();
        renderDealerGradePills();
        renderDealerCatalog();
    }

    function renderDealerGradePills() {
        const container = document.getElementById('dealer-grade-pills');
        if (!container) return;

        const allowedGrades = (typeof getMerchantAllowedGrades === 'function')
            ? getMerchantAllowedGrades(dealerMerchant)
            : ['Premium'];

        const filterBar = document.getElementById('dealer-grade-filter-bar');

        if (!allowedGrades.includes(activeGradeFilter) && activeGradeFilter !== 'all') {
            activeGradeFilter = 'all';
        }

        // If guest mode OR only 1 grade allowed (e.g. Premium only):
        // COMPLETELY HIDE the Grade filter bar so retail visitors and showroom parties never see or suspect non-premium tiers!
        if (!dealerMerchant || allowedGrades.length <= 1) {
            if (filterBar) filterBar.style.display = 'none';
            container.innerHTML = '';
            activeGradeFilter = 'all';
            return;
        }

        // Show the filter bar ONLY for logged-in authorized dealers with multiple grades
        if (filterBar) filterBar.style.display = 'flex';

        // Multiple grades allowed for this dealer
        let prodsInScope = (state.products || []).filter(p => {
            if (typeof isProductGradeAllowed === 'function' && !isProductGradeAllowed(dealerMerchant, p)) return false;
            if (activeCategoryFilter !== 'all' && p.category !== activeCategoryFilter) return false;
            if (activeSubCategoryFilter !== 'all' && (p.subcategory || p.subCategory) !== activeSubCategoryFilter) return false;
            return true;
        });

        const gradeConfigs = {
            'Premium': { icon: '⭐', label: 'Premium' },
            'ROK': { icon: '🔹', label: 'ROK' },
            'STD': { icon: '🔸', label: 'STD' },
            'Commercial': { icon: '🔻', label: 'Commercial' }
        };

        let pillsHtml = `
            <button class="dealer-cat-pill ${activeGradeFilter === 'all' ? 'active' : ''}" style="font-size:0.75rem; padding:0.25rem 0.65rem;" onclick="filterDealerGrade('all')">
                All Grades <span style="font-size:0.68rem; opacity:0.8;">(${prodsInScope.length})</span>
            </button>
        `;

        allowedGrades.forEach(g => {
            const cfg = gradeConfigs[g] || { icon: '🏷️', label: g };
            const count = prodsInScope.filter(p => (p.grade || 'Premium') === g).length;
            const isActive = (activeGradeFilter === g);
            pillsHtml += `
                <button class="dealer-cat-pill ${isActive ? 'active' : ''}" style="font-size:0.75rem; padding:0.25rem 0.65rem;" onclick="filterDealerGrade('${g}')">
                    ${cfg.icon} ${cfg.label} <span style="font-size:0.68rem; opacity:0.8;">(${count})</span>
                </button>
            `;
        });

        container.innerHTML = pillsHtml;
    }

    function filterDealerGrade(grade) {
        activeGradeFilter = grade;
        renderSubCategoryPills();
        renderDealerGradePills();
        renderDealerCatalog();
    }

    function onDealerSortChange() {
        dealerSortOption = document.getElementById('dealer-sort-select').value;
        renderDealerCatalog();
    }

    window.dealerCardUnits = window.dealerCardUnits || {};
    function setDealerCardUnit(prodId, unit) {
        window.dealerCardUnits = window.dealerCardUnits || {};
        window.dealerCardUnits[prodId] = unit;
        renderDealerCatalog();
    }
    window.setDealerCardUnit = setDealerCardUnit;

    function renderDealerCatalog() {
        const container = document.getElementById('dealer-catalog-left');
        if (!container) return;
        container.innerHTML = '';

        let catsToRender = activeCategoryFilter === 'all' ? (state.categories || Object.keys(DEFAULT_CATEGORY_TREE)) : [activeCategoryFilter];
        if (typeof isCategoryVisibleToMerchant === 'function') {
            catsToRender = catsToRender.filter(cat => isCategoryVisibleToMerchant(cat, dealerMerchant));
        }

        catsToRender.forEach(cat => {
            let prods = state.products.filter(p => p.category === cat);
            
            // Grade Access Control (Guest = only Premium, Dealers = permitted grades)
            if (typeof isProductGradeAllowed === 'function') {
                prods = prods.filter(p => isProductGradeAllowed(dealerMerchant, p));
            } else {
                prods = prods.filter(p => (p.grade || 'Premium') === 'Premium');
            }

            if (activeSubCategoryFilter !== 'all') {
                prods = prods.filter(p => p.subcategory === activeSubCategoryFilter || p.subCategory === activeSubCategoryFilter);
            }

            if (activeGradeFilter !== 'all') {
                prods = prods.filter(p => (p.grade || 'Premium') === activeGradeFilter);
            }

            if (prods.length === 0) return;

            // Apply sorting
            if (dealerSortOption === 'featured') {
                prods.sort((a, b) => (a.displayOrder || 100) - (b.displayOrder || 100));
            } else if (dealerSortOption === 'name_asc') {
                prods.sort((a, b) => (a.model || '').localeCompare(b.model || ''));
            } else if (dealerSortOption === 'price_asc') {
                prods.sort((a, b) => (a.price || 0) - (b.price || 0));
            } else if (dealerSortOption === 'price_desc') {
                prods.sort((a, b) => (b.price || 0) - (a.price || 0));
            } else if (dealerSortOption === 'stock_desc') {
                prods.sort((a, b) => (b.stock || 0) - (a.stock || 0));
            }

            const sec = document.createElement('div');
            sec.className = 'dealer-catalog-section';
            sec.innerHTML = `
                <div class="dealer-cat-section-header">
                    <span class="dealer-cat-title"><i class="fa-solid fa-layer-group" style="color:#3b82f6;"></i> ${cat} ${activeSubCategoryFilter !== 'all' ? `— ${activeSubCategoryFilter}` : ''}</span>
                    <span class="dealer-cat-count">${prods.length} Items</span>
                </div>
            `;

            const grid = document.createElement('div');
            grid.className = 'dealer-catalog-grid';

            prods.forEach(p => {
                const isDual = (p.packagingType === 'dual' || (p.boxQty && p.boxQty > 1));
                const activeUnit = isDual ? ((window.dealerCardUnits && window.dealerCardUnits[p.id]) || 'box') : 'pcs';
                const pricing = dealerMerchant 
                    ? getMerchantPricing(dealerMerchant, p, activeUnit) 
                    : { 
                        price: (isDual && activeUnit === 'box') ? (p.boxPrice !== undefined ? p.boxPrice : p.price) : (p.price !== undefined ? p.price : (p.basePrice || 0)), 
                        billRate: (isDual && activeUnit === 'box') ? (p.boxBillRate !== undefined ? p.boxBillRate : p.billRate) : (p.billRate || 0) 
                    };

                const activeCartKey = isDual ? `${p.id}:${activeUnit}` : p.id;
                const activeQty = dealerCart[activeCartKey] || 0;

                const looseKey = isDual ? `${p.id}:pcs` : p.id;
                const boxKey = `${p.id}:box`;
                const looseQty = dealerCart[looseKey] || 0;
                const boxCount = dealerCart[boxKey] || 0;
                const isAnyInCart = (activeQty > 0) || (looseQty > 0) || (boxCount > 0);

                const imgList = (p.imagesBase64 && p.imagesBase64.length > 0) ? p.imagesBase64 : (p.imageBase64 ? [p.imageBase64] : []);
                
                let imgHtml = '';
                if (imgList.length > 0) {
                    const dotsHtml = imgList.length > 1 ? `
                        <div class="amazon-slider-dots" id="amz-dots-${p.id}">
                            ${imgList.map((_, i) => `<span class="amazon-slider-dot ${i === 0 ? 'active' : ''}" onclick="event.stopPropagation(); switchAmazonSlide('${p.id}', ${i})"></span>`).join('')}
                        </div>
                    ` : '';

                    const arrowsHtml = imgList.length > 1 ? `
                        <button class="amazon-slider-arrow prev" onclick="event.stopPropagation(); navAmazonSlide('${p.id}', -1)"><i class="fa-solid fa-chevron-left"></i></button>
                        <button class="amazon-slider-arrow next" onclick="event.stopPropagation(); navAmazonSlide('${p.id}', 1)"><i class="fa-solid fa-chevron-right"></i></button>
                    ` : '';

                    imgHtml = `
                        <div class="dealer-prod-image" style="position:relative; cursor:pointer;" onclick="openGallery('${p.id}')">
                            <img id="main-img-${p.id}" src="${imgList[0]}" alt="${p.model}">
                            ${arrowsHtml}
                            ${dotsHtml}
                        </div>
                    `;
                } else {
                    imgHtml = `<div class="dealer-prod-image" style="position:relative;">${getProductSVG(p.category)}</div>`;
                }

                const hotBadgeHtml = p.isHot ? `
                    <span style="position:absolute; top:8px; left:8px; background:linear-gradient(135deg, #f59e0b, #d97706); color:#fff; font-size:0.65rem; font-weight:800; padding:0.2rem 0.5rem; border-radius:4px; box-shadow:0 2px 6px rgba(217,119,6,0.4); text-transform:uppercase; letter-spacing:0.5px; z-index:2;">
                        <i class="fa-solid fa-fire"></i> Hot Seller
                    </span>
                ` : '';

                const subSpecText = (p.subcategory || p.subCategory) ? `${p.subcategory || p.subCategory} • ` : '';
                const finishSpecText = p.finishType ? ` • ${p.finishType}` : '';
                const allowedGrades = (typeof getMerchantAllowedGrades === 'function')
                    ? getMerchantAllowedGrades(dealerMerchant)
                    : ['Premium'];
                const hasMultiGrades = (allowedGrades.length > 1);

                const gradeBadgeHtml = (() => {
                    const g = p.grade || 'Premium';
                    if (!hasMultiGrades && g === 'Premium') return '';
                    if (g === 'Commercial') return `<span style="display:inline-block; font-size:0.68rem; font-weight:800; background:#fee2e2; color:#dc2626; border:1px solid #fca5a5; border-radius:4px; padding:1px 6px;">🔻 Commercial</span>`;
                    if (g === 'STD') return `<span style="display:inline-block; font-size:0.68rem; font-weight:800; background:#ffedd5; color:#c2410c; border:1px solid #fdba74; border-radius:4px; padding:1px 6px;">🔸 STD</span>`;
                    if (g === 'ROK') return `<span style="display:inline-block; font-size:0.68rem; font-weight:800; background:#f0fdf4; color:#16a34a; border:1px solid #bbf7d0; border-radius:4px; padding:1px 6px;">🔹 ROK</span>`;
                    return `<span style="display:inline-block; font-size:0.68rem; font-weight:800; background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; border-radius:4px; padding:1px 6px;">⭐ Premium</span>`;
                })();

                const materialSpecBadge = p.material ? `<span style="display:inline-block; font-size:0.68rem; font-weight:600; color:#475569; background:#f1f5f9; border:1px solid #cbd5e1; border-radius:4px; padding:1px 6px;" title="Material Specification"><i class="fa-solid fa-shapes" style="font-size:0.6rem; color:#94a3b8;"></i> ${p.material}</span>` : '';

                const specBadgesRow = (gradeBadgeHtml || materialSpecBadge) ? `
                    <div style="display:flex; align-items:center; flex-wrap:wrap; gap:4px; margin:0.25rem 0 0.4rem 0;">
                        ${gradeBadgeHtml}
                        ${materialSpecBadge}
                    </div>
                ` : '';

                const card = document.createElement('div');
                card.className = `dealer-prod-card ${isAnyInCart ? 'in-cart' : ''}`;
                card.id = `dcard-${p.id}`;
                card.style.position = 'relative';
                card.innerHTML = `
                    ${hotBadgeHtml}
                    ${imgHtml}
                    <div class="dealer-prod-name">${p.model}</div>
                    ${specBadgesRow}
                    <div class="dealer-prod-spec">${subSpecText}${p.colour}${finishSpecText}</div>
                    ${(isDual && (boxCount > 0 || looseQty > 0)) ? `
                        <div style="font-size:0.68rem; color:#1d4ed8; background:#eff6ff; border:1px solid #bfdbfe; border-radius:4px; padding:2px 6px; margin:3px 0; font-weight:700;">
                            Cart: ${[boxCount > 0 ? `📦 ${boxCount} Box (${boxCount * p.boxQty} pcs)` : '', looseQty > 0 ? `${looseQty} Pcs` : ''].filter(Boolean).join(' + ')}
                        </div>
                    ` : ''}
                    ${isDual ? `
                        <div style="display:flex; gap:4px; margin:0.35rem 0; background:#f1f5f9; padding:2px; border-radius:6px;">
                            <button type="button" onclick="setDealerCardUnit('${p.id}', 'box')" style="flex:1; border:none; padding:4px 4px; font-size:0.75rem; border-radius:4px; cursor:pointer; font-weight:700; ${activeUnit === 'box' ? 'background:#0e254f; color:#fff;' : 'background:transparent; color:#64748b;'}">📦 Box (${p.boxQty})</button>
                            <button type="button" onclick="setDealerCardUnit('${p.id}', 'pcs')" style="flex:1; border:none; padding:4px 4px; font-size:0.75rem; border-radius:4px; cursor:pointer; font-weight:700; ${activeUnit === 'pcs' ? 'background:#0e254f; color:#fff;' : 'background:transparent; color:#64748b;'}">Loose Pcs</button>
                        </div>
                    ` : ''}
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto; gap:0.25rem;">
                        <div>
                            <div class="dealer-prod-price">₹${pricing.price.toLocaleString('en-IN')}${activeUnit === 'box' ? '<span style="font-size:0.72rem; font-weight:normal; color:#64748b;">/pc</span>' : ''}</div>
                            ${activeUnit === 'box' ? `<div style="font-size:0.7rem; color:#64748b; font-weight:600;">₹${(pricing.price * p.boxQty).toLocaleString('en-IN')} / Box</div>` : ''}
                        </div>
                        ${(typeof isProductAsPerOrder === 'function' && isProductAsPerOrder(p))
                            ? `<div class="dealer-prod-stock as-per-order" title="Order based production"><i class="fa-solid fa-boxes-packing"></i> As Per Order</div>`
                            : `<div class="dealer-prod-stock"><i class="fa-solid fa-circle-check"></i> In Stock ${isDual ? `(${Math.floor((p.stock||0)/p.boxQty)} bxs)` : ''}</div>`
                        }
                    </div>
                    <div class="qty-adjuster-group">
                        <button type="button" class="qty-adj-btn" onclick="event.stopPropagation(); dealerQtyChange('${activeCartKey}', -1)">−</button>
                        <input type="number" class="qty-adj-val" id="dqty-${activeCartKey}" value="${activeQty}" onchange="dealerQtySet('${activeCartKey}', this.value)" onclick="event.stopPropagation()">
                        <button type="button" class="qty-adj-btn" onclick="event.stopPropagation(); dealerQtyChange('${activeCartKey}', +1)">+</button>
                    </div>
                    ${activeUnit === 'box' && activeQty > 0 ? `<div style="text-align:center; font-size:0.7rem; color:#2563eb; font-weight:700; margin-top:2px;">= ${activeQty * p.boxQty} total pcs</div>` : ''}
                `;
                grid.appendChild(card);
            });

            sec.appendChild(grid);
            container.appendChild(sec);
        });

        if (container.innerHTML === '') {
            container.innerHTML = `<div style="text-align:center; padding:3rem; color:#94a3b8; font-style:italic;"><i class="fa-solid fa-box-open" style="font-size:2.5rem; color:#cbd5e1; display:block; margin-bottom:0.75rem;"></i>No products found in this category / sub-category.</div>`;
        }
    }

    function dealerQtySet(cartKey, value) {
        const { prodId, unit, isOffer, offerId, cartKey: normalizedKey } = parseCartKey(cartKey);
        if (isOffer) {
            const offer = (state.offers || []).find(o => o.id === offerId);
            if (!offer) return;
            let newQty = parseInt(value, 10);
            if (isNaN(newQty) || newQty <= 0) {
                delete dealerCart[normalizedKey];
            } else {
                const minQty = offer.minQty || 1;
                if (newQty < minQty) {
                    alert(`âš ï¸ Minimum order quantity for "${offer.model}" is ${minQty} pcs.`);
                    newQty = minQty;
                }
                dealerCart[normalizedKey] = newQty;
            }
            localStorage.setItem("bms_dealer_cart", JSON.stringify(dealerCart));
            renderDealerCart();
            renderDealerOffers();
            return;
        }

        const prod = (state.products || []).find(p => p.id === prodId);
        if (!prod) return;
        let newQty = parseInt(value, 10);
        if (isNaN(newQty) || newQty < 0) newQty = 0;
        
        const isBox = (unit === 'box' && prod.boxQty && prod.boxQty > 1);
        const boxMultiplier = isBox ? prod.boxQty : 1;
        const totalPcs = newQty * boxMultiplier;

        const isOrderBased = (typeof isProductAsPerOrder === 'function' && isProductAsPerOrder(prod));
        if (!isOrderBased) {
            const availableStock = prod.stock || 0;
            if (totalPcs > availableStock) {
                const maxBoxes = isBox ? Math.floor(availableStock / prod.boxQty) : availableStock;
                if (availableStock <= 0) {
                    alert(`Sorry, "${prod.model}" is currently out of stock.`);
                } else if (isBox && maxBoxes <= 0) {
                    alert(`Only ${availableStock} pieces available in stock, which is less than 1 full box (${prod.boxQty} pcs). Please switch to 'Loose Pcs' to order loose units.`);
                } else {
                    alert(`Only ${availableStock} units available in stock (${isBox ? `${maxBoxes} boxes` : ''}).`);
                }
                newQty = isBox ? maxBoxes : availableStock;
            }
        }
        
        if (newQty === 0) delete dealerCart[normalizedKey];
        else dealerCart[normalizedKey] = newQty;

        localStorage.setItem("bms_dealer_cart", JSON.stringify(dealerCart));
        renderDealerCatalog();
        renderDealerCart();
    }

    function dealerQtyChange(cartKey, delta) {
        const { prodId, unit, isOffer, offerId, cartKey: normalizedKey } = parseCartKey(cartKey);
        if (isOffer) {
            const offer = (state.offers || []).find(o => o.id === offerId);
            if (!offer) return;
            const current = dealerCart[normalizedKey] || 0;
            const minQty = offer.minQty || 1;
            let newQty = current + delta;
            if (delta < 0 && current <= minQty) {
                if (confirm(`Remove "${offer.model}" (Special Offer) from your cart?`)) {
                    delete dealerCart[normalizedKey];
                    localStorage.setItem("bms_dealer_cart", JSON.stringify(dealerCart));
                    renderDealerCart();
                    renderDealerOffers();
                }
                return;
            }
            if (newQty < minQty) newQty = minQty;
            dealerQtySet(normalizedKey, newQty);
            return;
        }

        const prod = (state.products || []).find(p => p.id === prodId);
        if (!prod) return;

        const current = dealerCart[normalizedKey] || 0;
        const isBox = (unit === 'box' && prod.boxQty && prod.boxQty > 1);
        const isOrderBased = (typeof isProductAsPerOrder === 'function' && isProductAsPerOrder(prod));
        let maxQty = 999999;
        if (!isOrderBased) {
            const availableStock = prod.stock || 0;
            maxQty = isBox ? Math.floor(availableStock / prod.boxQty) : availableStock;
        }

        if (delta > 0 && current >= maxQty && !isOrderBased) {
            const availableStock = prod.stock || 0;
            if (availableStock <= 0) {
                alert(`Sorry, "${prod.model}" is currently out of stock.`);
            } else if (isBox && Math.floor(availableStock / prod.boxQty) <= 0) {
                alert(`Only ${availableStock} pieces available in stock, which is less than 1 box (${prod.boxQty} pcs). Please select 'Loose Pcs' to order loose units.`);
            } else {
                alert(`Maximum available quantity reached (${maxQty} ${isBox ? 'boxes' : 'pcs'}).`);
            }
            return;
        }

        const newQty = Math.max(0, Math.min(maxQty, current + delta));
        dealerQtySet(normalizedKey, newQty);
    }

    function renderDealerCart() {
        const container = document.getElementById('dealer-cart-items');
        if (!container) return;
        container.innerHTML = '';

        // If party has NOT logged in (!dealerMerchant), NEVER show internal billing/cash breakdown!
        // If logged in, respect the dealer's hideTotals preference.
        const isHideTotals = !dealerMerchant || !!dealerMerchant.hideTotals;

        const breakdownEl = document.getElementById('dealer-cart-breakdown');
        if (breakdownEl) {
            breakdownEl.style.display = isHideTotals ? 'none' : 'block';
        }
        
        const payWrapper = document.getElementById('dealer-cart-total-payment-wrapper');
        if (payWrapper) {
            payWrapper.style.display = 'block'; // Always show Total
        }

        const cartItems = Object.entries(dealerCart);
        const countBadge = document.getElementById('dealer-cart-count');
        if (countBadge) countBadge.textContent = cartItems.reduce((s, [_, q]) => s + q, 0);

        if (cartItems.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding:2rem; color:#94a3b8; font-style:italic;">No items added yet.</div>';
            document.getElementById('dealer-sum-basic').textContent = '₹0';
            document.getElementById('dealer-sum-gst').textContent = '₹0';
            document.getElementById('dealer-sum-bill').textContent = '₹0';
            document.getElementById('dealer-sum-cash').textContent = '₹0';
            document.getElementById('dealer-sum-payment').textContent = '₹0';
            
            const totalLabel = document.getElementById('dealer-cart-total-label');
            if (totalLabel) totalLabel.textContent = (!dealerMerchant || isHideTotals) ? 'Total Amount:' : 'Total Payment:';
            const cashRow = document.getElementById('dealer-cart-cash-row');
            if (cashRow) cashRow.style.display = (!dealerMerchant || isHideTotals) ? 'none' : 'flex';
            
            const weightEl = document.getElementById('dealer-cart-total-weight');
            if (weightEl) weightEl.textContent = '0.00';
            
            document.getElementById('dealer-submit-btn').disabled = true;
            return;
        }
        
        let totalCheque = 0;
        let totalCash = 0;
        let grandTotal = 0;
        let totalWeight = 0;

        const groupedCart = {};
        const offerCartItems = [];

        cartItems.forEach(([cartKey, qty]) => {
            const { prodId, unit, isOffer, offerId } = parseCartKey(cartKey);
            if (isOffer) {
                const offer = (state.offers || []).find(o => o.id === offerId);
                if (offer) {
                    offerCartItems.push({ offer, qty, unit, cartKey });
                }
                return;
            }
            const prod = state.products.find(p => p.id === prodId);
            if (!prod) return;
            const cat = prod.category || 'Uncategorized';
            if (!groupedCart[cat]) groupedCart[cat] = [];
            groupedCart[cat].push({ prod, qty, unit, cartKey });
        });

        // 1. Regular Product Categories (Standard Blue Category Header & Regular Rate)
        getOrderedCategories(groupedCart).forEach(cat => {
            let catTotal = 0;
            const catHeader = document.createElement('div');
            catHeader.style = "background:#0e254f; color:#fff; padding:0.45rem 0.75rem; font-weight:700; font-size:0.85rem; margin-top:0.75rem; border-radius:6px 6px 0 0; display:flex; justify-content:space-between; align-items:center;";
            container.appendChild(catHeader);

            const itemsContainer = document.createElement('div');
            itemsContainer.style = "border:1px solid #cbd5e1; border-top:none; border-radius:0 0 6px 6px; padding:0.55rem; margin-bottom:0.6rem; background:#fff;";

            groupedCart[cat].forEach(itemData => {
                const { prod, qty, unit, cartKey } = itemData;
                const isBox = (unit === 'box' && prod.boxQty && prod.boxQty > 1);
                const totalPcs = isBox ? (qty * prod.boxQty) : qty;
                const pricing = dealerMerchant 
                    ? getMerchantPricing(dealerMerchant, prod, unit) 
                    : { 
                        price: (isBox ? (prod.boxPrice !== undefined ? prod.boxPrice : prod.price) : (prod.price !== undefined ? prod.price : (prod.basePrice || 0))), 
                        billRate: (isBox ? (prod.boxBillRate !== undefined ? prod.boxBillRate : prod.billRate) : (prod.billRate || 0)) 
                    };
                
                const itemBill = totalPcs * pricing.billRate;
                const itemCash = totalPcs * (pricing.price - pricing.billRate);
                const itemTotal = totalPcs * pricing.price;
                const itemWeight = totalPcs * (prod.weight || 0);

                totalCheque += itemBill;
                totalCash += itemCash;
                catTotal += itemTotal;
                grandTotal += itemTotal;
                totalWeight += itemWeight;

                const row = document.createElement('div');
                row.className = 'dealer-cart-row';
                row.innerHTML = `
                    <div style="flex:1;">
                        <div class="dealer-cart-row-name">
                            ${prod.model}
                            <span style="display:inline-block; font-size:0.68rem; font-weight:700; color:#1d4ed8; background:#eff6ff; border:1px solid #bfdbfe; border-radius:3px; padding:1px 5px; margin-left:4px;">${prod.grade || 'Premium'}</span>
                            ${prod.material ? `<span style="display:inline-block; font-size:0.65rem; color:#475569; background:#f1f5f9; border:1px solid #cbd5e1; border-radius:3px; padding:1px 4px; margin-left:2px;">${prod.material}</span>` : ''}
                            ${isBox ? `<span style="display:inline-block; font-size:0.7rem; color:#1d4ed8; background:#eff6ff; border:1px solid #bfdbfe; border-radius:3px; padding:1px 6px; margin-left:4px; font-weight:700;">📦 ${qty} Box (${totalPcs} pcs)</span>` : ''}
                            ${(typeof isProductAsPerOrder === 'function' && isProductAsPerOrder(prod)) ? `<span style="display:inline-block; font-size:0.65rem; color:#2563eb; background:#eff6ff; border:1px solid #bfdbfe; border-radius:3px; padding:1px 4px; margin-left:4px; font-weight:700;">As Per Order</span>` : ''}
                        </div>
                        <div class="qty-adjuster-group" style="width: 100px; height: 26px; margin: 0.3rem 0;">
                            <button class="qty-adj-btn" style="font-size: 0.8rem;" onclick="dealerQtyChange('${cartKey}', -1)">-</button>
                            <input type="number" class="qty-adj-val" style="font-size: 0.75rem;" value="${qty}" onchange="dealerQtySet('${cartKey}', this.value)">
                            <button class="qty-adj-btn" style="font-size: 0.8rem;" onclick="dealerQtyChange('${cartKey}', +1)">+</button>
                        </div>
                        <div class="dealer-cart-row-sub">Rate: ₹${pricing.price.toLocaleString('en-IN')}/pc ${isBox ? `(₹${(pricing.price * prod.boxQty).toLocaleString('en-IN')}/box)` : ''}</div>
                    </div>
                    <div style="font-weight:700; text-align:right; color:#0e254f;">₹${itemTotal.toLocaleString('en-IN')}</div>
                `;
                itemsContainer.appendChild(row);
            });
            
            catHeader.innerHTML = `<span>${cat}</span><span>Total: ₹${catTotal.toLocaleString('en-IN')}</span>`;
            container.appendChild(itemsContainer);
        });

        // 2. Special Offers & Schemes Section (Vibrant Orange/Coral Color & Offer Rate)
        if (offerCartItems.length > 0) {
            let offerSectionTotal = 0;
            const offerHeader = document.createElement('div');
            offerHeader.style = "background: linear-gradient(135deg, #c2410c, #ea580c); color:#fff; padding:0.55rem 0.85rem; font-weight:800; font-size:0.9rem; margin-top:1rem; border-radius:6px 6px 0 0; display:flex; justify-content:space-between; align-items:center; box-shadow:0 3px 6px rgba(234,88,12,0.25);";
            container.appendChild(offerHeader);

            const offerContainer = document.createElement('div');
            offerContainer.style = "border:2px solid #fdba74; border-top:none; border-radius:0 0 6px 6px; padding:0.65rem; margin-bottom:0.75rem; background:#fffaf5;";

            offerCartItems.forEach(itemData => {
                const { offer, qty, cartKey } = itemData;
                const totalPcs = qty;
                const offPrice = parseFloat(offer.offerPrice) || 0;
                const offBillRate = (offer.billRate !== undefined && offer.billRate !== null && offer.billRate !== '') ? parseFloat(offer.billRate) : offPrice;
                const regPrice = parseFloat(offer.regularPrice) || 0;
                const itemTotal = totalPcs * offPrice;
                const itemBill = totalPcs * offBillRate;
                const itemCash = totalPcs * (offPrice - offBillRate);
                const itemWeight = totalPcs * 15;
                const savingsPerPc = regPrice > offPrice ? (regPrice - offPrice) : 0;
                const totalSavings = savingsPerPc * totalPcs;

                totalCheque += itemBill;
                totalCash += itemCash;
                offerSectionTotal += itemTotal;
                grandTotal += itemTotal;
                totalWeight += itemWeight;

                const row = document.createElement('div');
                row.className = 'dealer-cart-row';
                row.style = "background:#fff; border:1.5px solid #fed7aa; border-left:5px solid #ea580c; border-radius:6px; padding:0.6rem; margin-bottom:0.5rem; display:flex; justify-content:space-between; align-items:center; box-shadow:0 1px 3px rgba(234,88,12,0.08);";
                row.innerHTML = `
                    <div style="flex:1;">
                        <div class="dealer-cart-row-name" style="color:#9a3412; font-weight:800; font-size:0.92rem; display:flex; align-items:center; gap:0.4rem; flex-wrap:wrap;">
                            ${offer.model}
                            <span style="display:inline-flex; align-items:center; gap:3px; font-size:0.7rem; font-weight:800; color:#fff; background:#ea580c; border-radius:4px; padding:2px 7px;">
                                <i class="fa-solid fa-fire"></i> ${offer.badge || 'SPECIAL OFFER'}
                            </span>
                            ${offer.category ? `<span style="font-size:0.68rem; color:#64748b; background:#f1f5f9; border-radius:3px; padding:1px 5px;">${offer.category}</span>` : ''}
                        </div>
                        <div style="display:flex; align-items:center; gap:0.6rem; margin:0.35rem 0; flex-wrap:wrap;">
                            <div class="qty-adjuster-group" style="width: 105px; height: 26px;">
                                <button class="qty-adj-btn" style="font-size: 0.8rem;" onclick="dealerQtyChange('${cartKey}', -1)">-</button>
                                <input type="number" class="qty-adj-val" style="font-size: 0.75rem;" value="${qty}" onchange="dealerQtySet('${cartKey}', this.value)">
                                <button class="qty-adj-btn" style="font-size: 0.8rem;" onclick="dealerQtyChange('${cartKey}', +1)">+</button>
                            </div>
                            <button type="button" onclick="dealerQtySet('${cartKey}', 0)" title="Remove offer item" style="background:none; border:none; color:#ef4444; font-size:0.85rem; cursor:pointer; padding:2px 5px;">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                            <span style="font-size:0.75rem; color:#c2410c; font-weight:700;"><i class="fa-solid fa-boxes-stacked"></i> Min Qty: ${offer.minQty || 1} pcs</span>
                        </div>
                        <div class="dealer-cart-row-sub" style="display:flex; gap:0.55rem; flex-wrap:wrap; align-items:center;">
                            ${regPrice > offPrice ? `<span style="text-decoration:line-through; color:#94a3b8; font-size:0.75rem;">₹${regPrice.toLocaleString('en-IN')}/pc</span>` : ''}
                            <span style="color:#ea580c; font-weight:800; font-size:0.88rem;">Offer Rate: ₹${offPrice.toLocaleString('en-IN')}/pc</span>
                            ${totalSavings > 0 ? `<span style="color:#15803d; font-weight:700; font-size:0.72rem; background:#dcfce7; border:1px solid #bbf7d0; padding:1px 6px; border-radius:4px;">Save ₹${totalSavings.toLocaleString('en-IN')}</span>` : ''}
                        </div>
                    </div>
                    <div style="font-weight:800; text-align:right; color:#ea580c; font-size:1.05rem;">₹${itemTotal.toLocaleString('en-IN')}</div>
                `;
                offerContainer.appendChild(row);
            });

            offerHeader.innerHTML = `<span><i class="fa-solid fa-fire" style="color:#fef08a;"></i> SPECIAL OFFERS &amp; SCHEMES</span><span>Total: ₹${offerSectionTotal.toLocaleString('en-IN')}</span>`;
            container.appendChild(offerContainer);
        }

        const gstRate = (state.settings && state.settings.gstRate !== undefined) ? state.settings.gstRate : 18;
        const gst = totalCheque * (gstRate / 100);
        const totalBill = totalCheque + gst;
        const totalPayment = totalBill + totalCash;

        document.getElementById('dealer-sum-basic').textContent = `₹${totalCheque.toLocaleString('en-IN')}`;
        document.getElementById('dealer-sum-gst').textContent = `₹${gst.toLocaleString('en-IN')}`;
        document.getElementById('dealer-sum-bill').textContent = `₹${totalBill.toLocaleString('en-IN')}`;
        document.getElementById('dealer-sum-cash').textContent = `₹${totalCash.toLocaleString('en-IN')}`;
        document.getElementById('dealer-sum-payment').textContent = `₹${(isHideTotals ? grandTotal : totalPayment).toLocaleString('en-IN')}`;
        
        const totalLabel = document.getElementById('dealer-cart-total-label');
        if (totalLabel) {
            totalLabel.textContent = (!dealerMerchant || isHideTotals) ? 'Total Amount:' : 'Total Payment:';
        }
        const cashRow = document.getElementById('dealer-cart-cash-row');
        if (cashRow) {
            cashRow.style.display = (!dealerMerchant || isHideTotals || totalCash <= 0) ? 'none' : 'flex';
        }
        
        const weightEl = document.getElementById('dealer-cart-total-weight');
        if (weightEl) weightEl.textContent = totalWeight.toFixed(2);
        
        document.getElementById('dealer-submit-btn').disabled = false;
        
    }

    function handleCartSubmit() {
        if (!dealerMerchant) {
            closeModal('cart-modal');
            openModal('new-dealer-modal');
            return;
        }
        submitDealerOrder();
    }

    function submitDealerOrder() {
        const cartItems = Object.entries(dealerCart);
        if (cartItems.length === 0) { alert('Please add items to your cart first.'); return; }

        const remark = document.getElementById('dealer-remark').value;
        const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const isHideTotals = !!(dealerMerchant && dealerMerchant.hideTotals);

        let orderItems = [];
        let totalCheque = 0;
        let totalCash = 0;
        let totalWeight = 0;
        let totalItems = 0;

        cartItems.forEach(([cartKey, qty]) => {
            const { prodId, unit, isOffer, offerId } = parseCartKey(cartKey);
            if (isOffer) {
                const offer = (state.offers || []).find(o => o.id === offerId);
                if (!offer) return;
                const totalPcs = qty;
                const offerPrice = parseFloat(offer.offerPrice) || 0;
                const offerBillRate = (offer.billRate !== undefined && offer.billRate !== null && offer.billRate !== '') ? parseFloat(offer.billRate) : offerPrice;
                const billAmt = totalPcs * offerBillRate;
                const cashAmt = totalPcs * (offerPrice - offerBillRate);
                const itemWeight = 15;

                totalCheque += billAmt;
                totalCash += cashAmt;
                totalWeight += itemWeight * totalPcs;
                totalItems += totalPcs;

                orderItems.push({
                    productId: offer.productId || offer.id,
                    unit: 'pcs',
                    orderQty: qty,
                    boxQty: 1,
                    category: offer.category || 'Special Offers',
                    model: offer.model + ' [OFFER]',
                    grade: 'Premium',
                    material: '',
                    colour: 'Standard',
                    weight: itemWeight,
                    qty: totalPcs,
                    price: offerPrice,
                    billRate: offerBillRate,
                    isOffer: true,
                    offerId: offer.id,
                    badge: offer.badge || 'Special Offer'
                });
                return;
            }

            const prod = state.products.find(p => p.id === prodId);
            if (!prod) return;
            const isBox = (unit === 'box' && prod.boxQty && prod.boxQty > 1);
            const totalPcs = isBox ? (qty * prod.boxQty) : qty;
            const pricing = getMerchantPricing(dealerMerchant, prod, unit);

            const billAmt = totalPcs * pricing.billRate;
            const cashAmt = totalPcs * (pricing.price - pricing.billRate);
            const itemWeight = (prod.weight && prod.weight > 0) ? prod.weight : ((prod.model && prod.model.toLowerCase().includes('one piece')) ? 38 : 15);

            totalCheque += billAmt;
            totalCash += cashAmt;
            totalWeight += itemWeight * totalPcs;
            totalItems += totalPcs;

            orderItems.push({
                productId: prodId,
                unit: isBox ? 'box' : 'pcs',
                orderQty: qty,
                boxQty: isBox ? prod.boxQty : 1,
                category: prod.category || 'Uncategorized',
                model: prod.model,
                grade: prod.grade || 'Premium',
                material: prod.material || '',
                colour: prod.colour,
                weight: itemWeight,
                qty: totalPcs,
                price: pricing.price,
                billRate: pricing.billRate
            });
        });

        const gstRate = (state.settings && state.settings.gstRate !== undefined) ? state.settings.gstRate : 18;
        const gst = totalCheque * (gstRate / 100);
        const newOrder = {
            id: "ord-" + Date.now(),
            timestamp: Date.now(),
            merchantId: dealerMerchant.id,
            date: dateStr,
            performerNo: "DEALER-WEB",
            remark: remark || "Submitted via Dealer Portal",
            items: orderItems,
            totalWeight: totalWeight,
            billBasic: totalCheque,
            gst: gst,
            freight: 0,
            totalBill: totalCheque + gst,
            totalCash: totalCash,
            status: "Pending",
            timeline: [{ status: "Pending", timestamp: Date.now() }]
        };
        state.orders.push(newOrder);
        saveState();
        lastSubmittedOrder = newOrder;

        if (typeof syncToCloud === 'function') syncToCloud();

        document.querySelector('#dealer-receipt-modal h2').innerHTML = `<i class="fa-solid fa-circle-check" style="color:#16a34a;"></i> Order Placed Successfully`;
        const receiptBody = document.getElementById('receipt-modal-body');
        const grandTotal = totalCheque + totalCash;

        const groupedOrderItems = {};
        orderItems.forEach(item => {
            const cat = item.category || 'Uncategorized';
            if (!groupedOrderItems[cat]) groupedOrderItems[cat] = [];
            groupedOrderItems[cat].push(item);
        });

        let tableHtml = '';
        getOrderedCategories(groupedOrderItems).forEach(cat => {
            let catTotal = 0;
            const itemsHtml = groupedOrderItems[cat].map(item => {
                catTotal += (item.qty * item.price);
                const qtyText = item.unit === 'box' ? `<b>${item.orderQty} Box</b><br><small style="color:#1d4ed8;">(${item.qty} pcs)</small>` : `${item.qty}`;
                const rateText = item.unit === 'box' ? `₹${item.price.toLocaleString('en-IN')}<br><small style="color:#64748b;">/pc in box</small>` : `₹${item.price.toLocaleString('en-IN')}`;
                const specText = `<small style="color:#64748b;">${item.grade || 'Premium'}${item.material ? ' • ' + item.material : ''} | ${item.colour}</small>`;
                if (isHideTotals) {
                    return `
                        <tr style="border-bottom:1px dashed #e2e8f0;">
                            <td style="padding:0.3rem 0;"><b>${item.model}</b><br>${specText}</td>
                            <td>${qtyText}</td>
                            <td style="text-align:right;">${rateText}</td>
                        </tr>
                    `;
                }
                return `
                    <tr style="border-bottom:1px dashed #e2e8f0;">
                        <td style="padding:0.3rem 0;"><b>${item.model}</b><br>${specText}</td>
                        <td>${qtyText}</td>
                        <td>${rateText}</td>
                        ${(totalCash > 0) ? `<td style="color:#16a34a; font-size:0.85rem;">₹${(item.billRate || 0).toLocaleString('en-IN')}</td>` : ''}
                        <td style="text-align:right;">₹${(item.qty * item.price).toLocaleString('en-IN')}</td>
                    </tr>
                `;
            }).join('');

            const colSpan = isHideTotals ? '3' : (totalCash > 0 ? '4' : '3');
            tableHtml += `
                <tr style="background:#f1f5f9; border-top:1px solid #cbd5e1; border-bottom:1px solid #cbd5e1;">
                    <td colspan="${isHideTotals ? '3' : colSpan}" style="padding:0.4rem; font-weight:700; font-size:0.8rem; color:#0e254f;">${cat}</td>
                    ${!isHideTotals ? `<td style="padding:0.4rem; font-weight:700; font-size:0.8rem; color:#0e254f; text-align:right;">₹${catTotal.toLocaleString('en-IN')}</td>` : ''}
                </tr>
                ${itemsHtml}
            `;
        });

        let receiptSummaryHtml = '';
        if (isHideTotals) {
            receiptSummaryHtml = `
                <div style="border-top:1px solid #0e254f; padding-top:0.5rem; font-size:0.85rem;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;"><span>Total Items:</span><b>${totalItems} pcs</b></div>
                    ${totalWeight > 0 ? `<div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;"><span>Total Order Weight:</span><b>${totalWeight.toFixed(2)} kg</b></div>` : ''}
                </div>
            `;
        } else {
            receiptSummaryHtml = `
                <div style="border-top:1px solid #0e254f; padding-top:0.5rem; font-size:0.85rem;">
                    <div style="display:flex; justify-content:space-between;"><span>Bill Basic:</span><b>₹${totalCheque.toLocaleString('en-IN')}</b></div>
                    <div style="display:flex; justify-content:space-between;"><span>GST (${gstRate}%):</span><b>₹${gst.toLocaleString('en-IN')}</b></div>
                    <div style="display:flex; justify-content:space-between; font-weight:700;"><span>Total Bill Amount:</span><b>₹${(totalCheque + gst).toLocaleString('en-IN')}</b></div>
                    <div style="display:flex; justify-content:space-between; color:#64748b;"><span>Freight:</span><b>Added later</b></div>
                    ${totalCash > 0 ? `<div style="display:flex; justify-content:space-between; font-weight:700;">
                        <span>Total Cash Amount:</span><span>₹${totalCash.toLocaleString('en-IN')}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; font-size:1rem; font-weight:700; border-top:1px dashed #cbd5e1; margin-top:0.3rem; padding-top:0.3rem;">
                        <span>Total Payment:</span><span>₹${(totalCheque + gst + totalCash).toLocaleString('en-IN')}</span>
                    </div>` : `
                    <div style="display:flex; justify-content:space-between; font-size:1rem; font-weight:700; border-top:1px dashed #cbd5e1; margin-top:0.3rem; padding-top:0.3rem;">
                        <span>Total Payment:</span><span>₹${(totalCheque + gst).toLocaleString('en-IN')}</span>
                    </div>`}
                </div>
            `;
        }

        const tableHeaderCols = isHideTotals ? 
            '<th>Item</th><th>Qty</th><th style="text-align:right;">Rate</th>' : 
            `<th>Item</th><th>Qty</th><th>Rate</th>${(totalCash > 0) ? '<th>Bill Rate</th>' : ''}<th style="text-align:right;">Amt</th>`;

        receiptBody.innerHTML = `
            <div style="border-bottom:1px solid #cbd5e1; padding-bottom:0.5rem; margin-bottom:0.75rem;">
                <div><b>Party:</b> ${dealerMerchant.name}</div>
                <div><b>Date:</b> ${dateStr} | <b>Ref:</b> ${newOrder.id}</div>
            </div>
            <table style="width:100%; border-collapse:collapse; margin-bottom:0.75rem;">
                <thead>
                    <tr style="border-bottom:1px solid #0e254f; text-align:left;">
                        ${tableHeaderCols}
                    </tr>
                </thead>
                <tbody>
                    ${tableHtml}
                </tbody>
            </table>
            ${receiptSummaryHtml}
        `;

        let msg = `*NEW DEALER ORDER REQUEST*\n-----------------------------\n`;
        msg += `*From:* ${dealerMerchant.name}\n*Date:* ${dateStr}\n\n`;
        getOrderedCategories(groupedOrderItems).forEach(cat => {
            msg += `*${cat.toUpperCase()}*\n`;
            let catTotal = 0;
            groupedOrderItems[cat].forEach((item, i) => {
                catTotal += (item.qty * item.price);
                const qtyWa = item.unit === 'box' ? `📦 ${item.orderQty} Box (${item.qty} pcs)` : `${item.qty} pcs`;
                const rateWa = item.unit === 'box' ? `₹${item.price.toLocaleString('en-IN')}/pc` : `₹${item.price.toLocaleString('en-IN')}`;
                const matWa = item.material ? ` [${item.material}]` : '';
                if (isHideTotals) {
                    msg += `- ${item.model} (${item.grade || 'Premium'}${matWa}/${item.colour}) × ${qtyWa} @ ${rateWa}\n`;
                } else {
                    msg += `- ${item.model} (${item.grade || 'Premium'}${matWa}/${item.colour}) × ${qtyWa} = ₹${(item.qty * item.price).toLocaleString('en-IN')}\n`;
                }
            });
            if (!isHideTotals) {
                msg += `_Subtotal: ₹${catTotal.toLocaleString('en-IN')}_\n\n`;
            } else {
                msg += `\n`;
            }
        });
        msg += `-----------------------------\n`;
        if (isHideTotals) {
            msg += `*Total Items:* ${totalItems} pcs\n`;
            if (totalWeight > 0) msg += `*Total Weight:* ${totalWeight.toFixed(2)} kg\n`;
        } else {
            msg += `*Bill Basic:* ₹${totalCheque.toLocaleString('en-IN')}\n`;
            msg += `*GST (${gstRate}%):* ₹${gst.toLocaleString('en-IN')}\n`;
            msg += `*TOTAL BILL AMOUNT:* ₹${(totalCheque + gst).toLocaleString('en-IN')}\n`;
            if (totalCash > 0) {
                msg += `*TOTAL CASH AMOUNT:* ₹${totalCash.toLocaleString('en-IN')}\n`;
                msg += `*TOTAL PAYMENT:* ₹${(totalCheque + gst + totalCash).toLocaleString('en-IN')}\n`;
            } else {
                msg += `*TOTAL PAYMENT:* ₹${(totalCheque + gst).toLocaleString('en-IN')}\n`;
            }
        }

        const adminWA = (state.settings && state.settings.adminWA) ? state.settings.adminWA : "919876543210";
        document.getElementById('receipt-wa-btn').onclick = () => {
            window.open(`https://api.whatsapp.com/send?phone=${adminWA}&text=${encodeURIComponent(msg)}`, '_blank');
        };

        closeModal('cart-modal');
        openModal('dealer-receipt-modal');
        dealerCart = {};
        localStorage.removeItem("bms_dealer_cart");
        document.getElementById('dealer-remark').value = '';
        renderDealerCart();
        renderDealerCatalog();
    }

    function printDealerReceiptPDF() {
        if (!lastSubmittedOrder) return;
        printInvoice(lastSubmittedOrder.id);
    }

    function viewDealerReceipt(orderId) {
        const order = state.orders.find(o => o.id === orderId);
        if (!order) return;
        
        lastSubmittedOrder = order;
        const isHideTotals = !!(dealerMerchant && dealerMerchant.hideTotals);

        const receiptBody = document.getElementById('receipt-modal-body');
        const groupedOrderItems = {};
        let totalItems = 0;
        let totalWeight = 0;
        
        order.items.forEach(item => {
            const cat = item.category || 'Uncategorized';
            if (!groupedOrderItems[cat]) groupedOrderItems[cat] = [];
            groupedOrderItems[cat].push(item);
            totalItems += (item.qty || 0);
            const w = (item.weight && item.weight > 0) ? item.weight : ((state.products.find(p => p.id === item.productId || (p.model && item.model && p.model.toLowerCase() === item.model.toLowerCase())) || {}).weight || 15);
            totalWeight += w * (item.qty || 0);
        });

        const totalCheque = order.billBasic || 0;
        const totalCash = order.totalCash || 0;
        const grandTotal = totalCheque + totalCash;
        const gstRate = (state.settings && state.settings.gstRate !== undefined) ? state.settings.gstRate : 18;

        let tableHtml = '';
        getOrderedCategories(groupedOrderItems).forEach(cat => {
            let catTotal = 0;
            const itemsHtml = groupedOrderItems[cat].map(item => {
                catTotal += (item.qty * item.price);
                const qtyText = item.unit === 'box' ? `<b>${item.orderQty} Box</b><br><small style="color:#1d4ed8;">(${item.qty} pcs)</small>` : `${item.qty}`;
                const rateText = item.unit === 'box' ? `₹${item.price.toLocaleString('en-IN')}<br><small style="color:#64748b;">/pc in box</small>` : `₹${item.price.toLocaleString('en-IN')}`;
                if (isHideTotals) {
                    return `
                        <tr style="border-bottom:1px dashed #e2e8f0;">
                            <td style="padding:0.3rem 0;"><b>${item.model}</b><br><small>${item.grade}/${item.colour}</small></td>
                            <td>${qtyText}</td>
                            <td style="text-align:right;">${rateText}</td>
                        </tr>
                    `;
                }
                return `
                    <tr style="border-bottom:1px dashed #e2e8f0;">
                        <td style="padding:0.3rem 0;"><b>${item.model}</b><br><small>${item.grade}/${item.colour}</small></td>
                        <td>${qtyText}</td>
                        <td>${rateText}</td>
                        ${(totalCash > 0) ? `<td style="color:#16a34a; font-size:0.85rem;">₹${(item.billRate || 0).toLocaleString('en-IN')}</td>` : ''}
                        <td style="text-align:right;">₹${(item.qty * item.price).toLocaleString('en-IN')}</td>
                    </tr>
                `;
            }).join('');

            const colSpan = isHideTotals ? '3' : (totalCash > 0 ? '4' : '3');
            tableHtml += `
                <tr style="background:#f1f5f9; border-top:1px solid #cbd5e1; border-bottom:1px solid #cbd5e1;">
                    <td colspan="${isHideTotals ? '3' : colSpan}" style="padding:0.4rem; font-weight:700; font-size:0.8rem; color:#0e254f;">${cat}</td>
                    ${!isHideTotals ? `<td style="padding:0.4rem; font-weight:700; font-size:0.8rem; color:#0e254f; text-align:right;">₹${catTotal.toLocaleString('en-IN')}</td>` : ''}
                </tr>
                ${itemsHtml}
            `;
        });

        let receiptSummaryHtml = '';
        if (isHideTotals) {
            receiptSummaryHtml = `
                <div style="border-top:1px solid #0e254f; padding-top:0.5rem; font-size:0.85rem;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;"><span>Total Items:</span><b>${totalItems} pcs</b></div>
                    ${totalWeight > 0 ? `<div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;"><span>Total Order Weight:</span><b>${totalWeight.toFixed(2)} kg</b></div>` : ''}
                </div>
            `;
        } else {
            receiptSummaryHtml = `
                <div style="border-top:1px solid #0e254f; padding-top:0.5rem; font-size:0.85rem;">
                    <div style="display:flex; justify-content:space-between;"><span>Bill Basic:</span><b>₹${totalCheque.toLocaleString('en-IN')}</b></div>
                    <div style="display:flex; justify-content:space-between;"><span>GST (${gstRate}%):</span><b>₹${(order.gst || 0).toLocaleString('en-IN')}</b></div>
                    <div style="display:flex; justify-content:space-between; font-weight:700;"><span>Total Bill Amount:</span><b>₹${(order.totalBill || totalCheque).toLocaleString('en-IN')}</b></div>
                    <div style="display:flex; justify-content:space-between; color:#64748b;"><span>Freight:</span><b>${order.freight ? '₹' + order.freight.toLocaleString('en-IN') : 'None'}</b></div>
                    ${totalCash > 0 ? `<div style="display:flex; justify-content:space-between; font-weight:700;">
                        <span>Total Cash Amount:</span><span>₹${totalCash.toLocaleString('en-IN')}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; font-size:1rem; font-weight:700; border-top:1px dashed #cbd5e1; margin-top:0.3rem; padding-top:0.3rem;">
                        <span>Total Payment:</span><span>₹${((order.totalBill || totalCheque) + totalCash).toLocaleString('en-IN')}</span>
                    </div>` : `
                    <div style="display:flex; justify-content:space-between; font-size:1rem; font-weight:700; border-top:1px dashed #cbd5e1; margin-top:0.3rem; padding-top:0.3rem;">
                        <span>Total Payment:</span><span>₹${(order.totalBill || (totalCheque + (order.gst || 0))).toLocaleString('en-IN')}</span>
                    </div>`}
                </div>
            `;
        }

        const tableHeaderCols = isHideTotals ? 
            '<th>Item</th><th>Qty</th><th style="text-align:right;">Rate</th>' : 
            `<th>Item</th><th>Qty</th><th>Rate</th>${(totalCash > 0) ? '<th>Bill Rate</th>' : ''}<th style="text-align:right;">Amt</th>`;

        receiptBody.innerHTML = `
            <div style="border-bottom:1px solid #cbd5e1; padding-bottom:0.5rem; margin-bottom:0.75rem;">
                <div><b>Party:</b> ${dealerMerchant.name}</div>
                <div><b>Date:</b> ${order.date} | <b>Ref:</b> ${order.id}</div>
            </div>
            <div style="margin-bottom:0.75rem;">
                ${(order.transportName || order.lrNo) ? `<div style="font-size:0.82rem; color:#0e254f; margin-top:0.25rem;"><i class="fa-solid fa-truck-fast" style="color:#2563eb;"></i> <b>Transport:</b> ${order.transportName || '-'} | <b>LR No:</b> ${order.lrNo || '-'} ${order.vehicleNo ? `| <b>Veh:</b> ${order.vehicleNo}` : ''}</div>` : ''}
            </div>
            <table style="width:100%; border-collapse:collapse; margin-bottom:0.75rem;">
                <thead>
                    <tr style="border-bottom:1px solid #0e254f; text-align:left;">
                        ${tableHeaderCols}
                    </tr>
                </thead>
                <tbody>
                    ${tableHtml}
                </tbody>
            </table>
            ${receiptSummaryHtml}
        `;

        let msg = `*DEALER ORDER*\n-----------------------------\n`;
        msg += `*From:* ${dealerMerchant.name}\n*Date:* ${order.date}\n\n`;
        getOrderedCategories(groupedOrderItems).forEach(cat => {
            msg += `*${cat.toUpperCase()}*\n`;
            let catTotal = 0;
            groupedOrderItems[cat].forEach((item, i) => {
                catTotal += (item.qty * item.price);
                if (isHideTotals) {
                    msg += `- ${item.model} (${item.grade}/${item.colour}) × ${item.qty} @ ₹${item.price.toLocaleString('en-IN')}\n`;
                } else {
                    msg += `- ${item.model} (${item.grade}/${item.colour}) × ${item.qty} = ₹${(item.qty * item.price).toLocaleString('en-IN')}\n`;
                }
            });
            if (!isHideTotals) {
                msg += `_Subtotal: ₹${catTotal.toLocaleString('en-IN')}_\n\n`;
            } else {
                msg += `\n`;
            }
        });
        msg += `-----------------------------\n`;
        if (isHideTotals) {
            msg += `*Total Items:* ${totalItems} pcs\n`;
            if (totalWeight > 0) msg += `*Total Weight:* ${totalWeight.toFixed(2)} kg\n`;
        } else {
            msg += `*Bill Basic:* ₹${totalCheque.toLocaleString('en-IN')}\n`;
            msg += `*GST (${gstRate}%):* ₹${(order.gst || 0).toLocaleString('en-IN')}\n`;
            msg += `*TOTAL BILL AMOUNT:* ₹${(order.totalBill || totalCheque).toLocaleString('en-IN')}\n`;
            if (totalCash > 0) {
                msg += `*TOTAL CASH AMOUNT:* ₹${totalCash.toLocaleString('en-IN')}\n`;
                msg += `*TOTAL PAYMENT:* ₹${((order.totalBill || totalCheque) + totalCash).toLocaleString('en-IN')}\n`;
            } else {
                msg += `*TOTAL PAYMENT:* ₹${(order.totalBill || totalCheque).toLocaleString('en-IN')}\n`;
            }
        }
        const adminWA = (state.settings && state.settings.adminWA) ? state.settings.adminWA : "919876543210";
        document.getElementById('receipt-wa-btn').onclick = () => {
            window.open(`https://api.whatsapp.com/send?phone=${adminWA}&text=${encodeURIComponent(msg)}`, '_blank');
        };

        openModal('dealer-receipt-modal');
    }

    function getProductSVG(category) {
        const icons = {
            'Ceramic Sanitary Ware': `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><ellipse cx="32" cy="50" rx="20" ry="8" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/><path d="M12 50 Q10 30 20 22 Q26 18 32 18 Q38 18 44 22 Q54 30 52 50" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5"/><ellipse cx="32" cy="22" rx="12" ry="4" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/><rect x="26" y="10" width="12" height="12" rx="3" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/></svg>`,
            'Kitchen Sinks': `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="18" width="48" height="32" rx="4" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/><rect x="14" y="24" width="36" height="20" rx="3" fill="#f8fafc" stroke="#94a3b8" stroke-width="1"/><circle cx="32" cy="34" r="3" fill="#94a3b8"/><rect x="30" y="14" width="4" height="8" rx="2" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1"/></svg>`,
            'Vanity Cabinets & Mirrors': `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="30" width="48" height="26" rx="4" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/><rect x="8" y="10" width="48" height="18" rx="3" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5"/><rect x="14" y="36" width="16" height="14" rx="2" fill="#f8fafc" stroke="#94a3b8" stroke-width="1"/><rect x="34" y="36" width="16" height="14" rx="2" fill="#f8fafc" stroke="#94a3b8" stroke-width="1"/></svg>`,
            'Drain Covers & Accessories': `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="24" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/><circle cx="32" cy="32" r="18" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1"/><circle cx="32" cy="32" r="5" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1"/></svg>`,
            'Steel Sink': `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="18" width="48" height="32" rx="4" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/><rect x="14" y="24" width="36" height="20" rx="3" fill="#f8fafc" stroke="#94a3b8" stroke-width="1"/><circle cx="32" cy="34" r="3" fill="#94a3b8"/><rect x="30" y="14" width="4" height="8" rx="2" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1"/></svg>`,
            'Handmade Sink': `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M10 48 L10 22 Q10 16 16 16 L48 16 Q54 16 54 22 L54 48 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/><path d="M16 48 L16 26 Q16 22 20 22 L44 22 Q48 22 48 26 L48 48 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="1"/><circle cx="32" cy="35" r="2.5" fill="#94a3b8"/></svg>`,
            'Designer Table Top': `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><ellipse cx="32" cy="32" rx="22" ry="14" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/><ellipse cx="32" cy="32" rx="16" ry="10" fill="#f8fafc" stroke="#94a3b8" stroke-width="1"/><ellipse cx="32" cy="33" rx="4" ry="3" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1"/></svg>`,
            'Vanity Set': `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="30" width="48" height="26" rx="4" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/><rect x="8" y="10" width="48" height="18" rx="3" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5"/><rect x="14" y="36" width="16" height="14" rx="2" fill="#f8fafc" stroke="#94a3b8" stroke-width="1"/><rect x="34" y="36" width="16" height="14" rx="2" fill="#f8fafc" stroke="#94a3b8" stroke-width="1"/></svg>`,
            'Manhole Cover': `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="24" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/><circle cx="32" cy="32" r="18" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1"/><circle cx="32" cy="32" r="5" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1"/></svg>`,
            'Quartz Sink': `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="18" width="48" height="32" rx="6" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/><rect x="14" y="24" width="15" height="20" rx="3" fill="#f8fafc" stroke="#94a3b8" stroke-width="1"/><rect x="35" y="24" width="15" height="20" rx="3" fill="#f8fafc" stroke="#94a3b8" stroke-width="1"/></svg>`
        };
        return icons[category] || icons['Ceramic Sanitary Ware'];
    }

    document.addEventListener('DOMContentLoaded', dealerInit);
    document.addEventListener('DOMContentLoaded', () => {
        const pinInput = document.getElementById('dealer-pin-input');
        if (pinInput) {
            pinInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') dealerLoginViaPIN();
            });
        }
        const idInput = document.getElementById('dealer-login-id');
        if (idInput) {
            idInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    if (pinInput) pinInput.focus();
                }
            });
        }
    });

    function printInvoice(orderId) {
        const order = state.orders.find(o => o.id === orderId);
        const m = state.merchants.find(x => x.id === order.merchantId);
        if (!order || !m) return;
        const company = (state.settings && state.settings.companyName) ? state.settings.companyName : "Shree Ram Bathware";
        const gstRate = (state.settings && state.settings.gstRate !== undefined) ? state.settings.gstRate : 18;

        const printWin = window.open("", "_blank");
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
                </table>
                <table class="items-table">
                    <thead>
                        ${m.hideTotals ? `
                            <tr><th>#</th><th>Model Name</th><th>Grade</th><th>Colour</th><th class="num">Qty</th><th class="num">Rate</th></tr>
                        ` : (order.totalCash === 0) ? `
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
                                    if (m.hideTotals) {
                                        return `
                                            <tr>
                                                <td>${index++}</td>
                                                <td><b>${item.model}</b></td>
                                                <td>${item.grade}</td>
                                                <td>${item.colour}</td>
                                                <td class="num">${item.qty}</td>
                                                <td class="num">₹${item.price}</td>
                                            </tr>
                                        `;
                                    } else if (order.totalCash === 0) {
                                        return `
                                            <tr>
                                                <td>${index++}</td>
                                                <td><b>${item.model}</b></td>
                                                <td>${item.grade}</td>
                                                <td>${item.colour}</td>
                                                <td class="num">${item.qty}</td>
                                                <td class="num">₹${item.price}</td>
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
                                                <td class="num">${item.qty}</td>
                                                <td class="num">₹${item.price}</td>
                                                <td class="num">₹${item.billRate}</td>
                                                <td class="num">₹${(item.qty * item.billRate).toLocaleString('en-IN')}</td>
                                                <td class="num">₹${(item.qty * (item.price - item.billRate)).toLocaleString('en-IN')}</td>
                                            </tr>
                                        `;
                                    }
                                }).join("");
                                if (m.hideTotals) {
                                    html += `
                                        <tr style="background:#f1f5f9;"><td colspan="6"><b>${cat}</b></td></tr>
                                        ${rows}
                                    `;
                                } else if (order.totalCash === 0) {
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
                    ${!m.hideTotals ? `
                    <tfoot>
                        <tr class="totals-row" style="border-top: 2px solid #000;"><td colspan="${order.totalCash === 0 ? '7' : '7'}">BILL BASIC</td><td colspan="${order.totalCash === 0 ? '1' : '2'}" class="num" style="text-align: center;">₹${order.billBasic.toLocaleString('en-IN')}</td></tr>
                        <tr class="totals-row"><td colspan="${order.totalCash === 0 ? '7' : '7'}">GST ${gstRate}%</td><td colspan="${order.totalCash === 0 ? '1' : '2'}" class="num" style="text-align: center;">₹${order.gst.toLocaleString('en-IN')}</td></tr>
                        <tr class="totals-row" style="font-weight:700;"><td colspan="${order.totalCash === 0 ? '7' : '7'}">TOTAL BILL AMOUNT</td><td colspan="${order.totalCash === 0 ? '1' : '2'}" class="num" style="text-align: center;">₹${order.totalBill.toLocaleString('en-IN')}</td></tr>
                        <tr class="totals-row"><td colspan="${order.totalCash === 0 ? '7' : '7'}">FREIGHT</td><td colspan="${order.totalCash === 0 ? '1' : '2'}" class="num" style="text-align: center;">₹${order.freight.toLocaleString('en-IN')}</td></tr>
                        ${order.totalCash > 0 ? `<tr class="totals-row final-bill-row" style="font-size:inherit;"><td colspan="7">TOTAL CASH AMOUNT</td><td colspan="2" class="num" style="text-align: center;">₹${order.totalCash.toLocaleString('en-IN')}</td></tr>
                        <tr><td colspan="9" style="border-top:none; border-bottom:none; border-left:1px solid #000; border-right:1px solid #000; height:10px;"></td></tr>
                        <tr class="totals-row" style="background-color:#cbd5e1; font-weight:900; font-size:18px;"><td colspan="7">TOTAL PAYMENT</td><td colspan="2" class="num" style="text-align: center;">₹${(order.totalBill + order.totalCash).toLocaleString('en-IN')}</td></tr>` : ''}
                    </tfoot>` : ''}
                </table>
                ${order.remark ? `<p style="margin-top:15px; font-size:13px;"><b>Remark:</b> ${order.remark}</p>` : ''}
                <script>window.print();<\/script>
            </body>
            </html>
        `);
        printWin.document.close();
    }

    window.openLightbox = function(imgSrc, caption) {
        if (!imgSrc) return;
        const modal = document.getElementById("lightbox-modal");
        const gallery = document.getElementById("lightbox-gallery");
        const cap = document.getElementById("lightbox-caption");
        if (!modal || !gallery) return;

        cap.textContent = caption || '';
        gallery.innerHTML = `<div class="lightbox-gallery-item"><img src="${imgSrc}" alt="Product" onclick="this.classList.toggle('zoomed')"></div>`;
        gallery.scrollTop = 0;
        modal.classList.add("active");
    };

    window.openGallery = function(prodId) {
        const p = state.products.find(x => x.id === prodId);
        if (!p) return;

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

        cap.textContent = `${p.model} - ${p.grade} / ${p.colour}`;

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
    };

    window.closeLightbox = function(e) {
        if (e) e.stopPropagation();
        const modal = document.getElementById("lightbox-modal");
        if (modal) modal.classList.remove("active");
    };

window.viewTimeline = typeof viewTimeline !== 'undefined' ? viewTimeline : function(id) { if (typeof window.viewTimeline === 'function') window.viewTimeline(id); };

window.dealerQtyChange = dealerQtyChange;
window.dealerQtySet = dealerQtySet;
window.parseCartKey = parseCartKey;
window.setDealerCardUnit = setDealerCardUnit;

// ==========================================
// DEALER SPECIAL OFFERS LOGIC
// ==========================================
function renderDealerOffers() {
    const grid = document.getElementById('dealer-offers-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const activeOffers = (state.offers || []).filter(o => o.active);
    const countBadge = document.getElementById('offers-count-badge');
    if (countBadge) countBadge.textContent = `${activeOffers.length} Offers Active`;

    if (activeOffers.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; padding: 3rem 1rem; text-align: center; color: #64748b; background: #fff; border-radius: 8px; border: 1px dashed #cbd5e1;">
                <i class="fa-solid fa-tags" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 1rem;"></i>
                <h3 style="color: #0e254f; margin: 0 0 0.5rem 0;">No Special Offers Available Currently</h3>
                <p style="margin: 0; font-size: 0.9rem;">Please check back soon or browse our regular products catalog.</p>
            </div>
        `;
        return;
    }

    activeOffers.forEach(offer => {
        const prod = (state.products || []).find(p => p.id === offer.productId) || {};
        const imgList = (offer.image ? [offer.image] : [])
            .concat(prod.imagesBase64 && prod.imagesBase64.length > 0 ? prod.imagesBase64 : (prod.imageBase64 ? [prod.imageBase64] : []))
            .filter(Boolean);
        const imgSrc = imgList.length > 0 ? imgList[0] : (offer.image || prod.image || '');

        const regPrice = parseFloat(offer.regularPrice) || prod.price || 0;
        const offPrice = parseFloat(offer.offerPrice) || 0;
        const savings = regPrice > offPrice ? (regPrice - offPrice) : 0;
        const discountPct = regPrice > 0 ? Math.round(((regPrice - offPrice) / regPrice) * 100) : 0;
        const minQty = offer.minQty || 1;
        const cartKey = `offer:${offer.id}`;
        const offerCartQty = dealerCart[cartKey] || 0;
        const isInCart = offerCartQty > 0;

        const card = document.createElement('div');
        card.className = `dealer-prod-card ${isInCart ? 'in-cart' : ''}`;
        card.id = `dcard-${cartKey}`;
        card.style.position = 'relative';

        const imgHtml = (imgSrc && imgSrc !== 'logo.png')
            ? `<div class="dealer-prod-image" style="position:relative;"><img src="${imgSrc}" alt="${offer.model}" style="max-height:100%; max-width:100%; object-fit:contain;"></div>`
            : `<div class="dealer-prod-image" style="position:relative;">${getProductSVG(offer.category || prod.category || 'Ceramic Sanitary Ware')}</div>`;

        card.innerHTML = `
            <span style="position:absolute; top:8px; left:8px; background:linear-gradient(135deg, #ef4444, #dc2626); color:#fff; font-size:0.65rem; font-weight:800; padding:0.2rem 0.5rem; border-radius:4px; box-shadow:0 2px 6px rgba(220,38,38,0.3); text-transform:uppercase; letter-spacing:0.5px; z-index:2;">
                <i class="fa-solid fa-fire"></i> ${offer.badge || (discountPct > 0 ? `${discountPct}% OFF` : 'SPECIAL BULK OFFER')}
            </span>
            ${imgHtml}
            <div class="dealer-prod-name">${offer.model}</div>
            <div style="display:flex; align-items:center; flex-wrap:wrap; gap:4px; margin:0.25rem 0 0.4rem 0;">
                <span style="display:inline-block; font-size:0.68rem; font-weight:800; background:#fef2f2; color:#b91c1c; border:1px solid #fecaca; border-radius:4px; padding:1px 6px;">
                    <i class="fa-solid fa-boxes-stacked"></i> Min ${minQty} pcs
                </span>
                ${offer.category ? `<span style="display:inline-block; font-size:0.68rem; font-weight:600; color:#475569; background:#f1f5f9; border:1px solid #cbd5e1; border-radius:4px; padding:1px 6px;">${offer.category}</span>` : ''}
            </div>
            ${isInCart ? `
                <div style="font-size:0.68rem; color:#16a34a; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:4px; padding:2px 6px; margin:2px 0; font-weight:700;">
                    <i class="fa-solid fa-circle-check"></i> In Cart: ${offerCartQty} pcs
                </div>
            ` : ''}
            <div style="display:flex; justify-content:space-between; align-items:baseline; margin-top:auto; gap:0.25rem;">
                <div>
                    <div class="dealer-prod-price" style="color:#dc2626;">&#8377;${offPrice.toLocaleString('en-IN')}<span style="font-size:0.72rem; font-weight:normal; color:#64748b;">/pc</span></div>
                    ${regPrice > offPrice ? `<div style="font-size:0.7rem; color:#94a3b8; text-decoration:line-through;">&#8377;${regPrice.toLocaleString('en-IN')}</div>` : ''}
                </div>
                ${savings > 0 ? `<div style="font-size:0.65rem; color:#16a34a; font-weight:700; background:#dcfce7; padding:1px 5px; border-radius:4px;">Save &#8377;${savings.toLocaleString('en-IN')}</div>` : ''}
            </div>
            <div class="qty-adjuster-group" style="margin-top:0.35rem;">
                <button type="button" class="qty-adj-btn" onclick="event.stopPropagation(); dealerQtyChange('${cartKey}', -${minQty})">&minus;</button>
                <input type="number" class="qty-adj-val" id="dqty-${cartKey}" value="${offerCartQty || minQty}" min="${minQty}" step="${minQty}" onchange="dealerQtySet('${cartKey}', this.value)" onclick="event.stopPropagation()">
                <button type="button" class="qty-adj-btn" onclick="event.stopPropagation(); dealerQtyChange('${cartKey}', +${minQty})">+</button>
            </div>
            ${!isInCart ? `
                <button type="button" class="btn btn-primary" style="margin-top:0.35rem; width:100%; background:#dc2626; border-color:#dc2626; font-size:0.75rem; font-weight:700; padding:0.4rem; display:flex; align-items:center; justify-content:center; gap:0.35rem; border-radius:4px; cursor:pointer;" onclick="event.stopPropagation(); addOfferToCart('${offer.id}')">
                    <i class="fa-solid fa-cart-plus"></i> Add to Order
                </button>
            ` : `
                <button type="button" style="margin-top:0.35rem; width:100%; background:#16a34a; color:#fff; border:none; font-size:0.75rem; font-weight:700; padding:0.4rem; display:flex; align-items:center; justify-content:center; gap:0.35rem; border-radius:4px; cursor:pointer;" onclick="event.stopPropagation(); openModal('cart-modal')">
                    <i class="fa-solid fa-bag-shopping"></i> View in Cart
                </button>
            `}
        `;
        grid.appendChild(card);
    });
}
window.renderDealerOffers = renderDealerOffers;
function changeOfferQtyInput(offerId, delta) {
    const cartKey = `offer:${offerId}`;
    dealerQtyChange(cartKey, delta);
}
window.changeOfferQtyInput = changeOfferQtyInput;

function validateOfferQtyInput(offerId, minQty) {
    const cartKey = `offer:${offerId}`;
    const input = document.getElementById(`dqty-${cartKey}`) || document.getElementById(`offer-qty-${offerId}`);
    if (!input) return;
    dealerQtySet(cartKey, input.value);
}
window.validateOfferQtyInput = validateOfferQtyInput;

function addOfferToCart(offerId) {
    if (!dealerMerchant) {
        alert("Please log in with your dealer account to claim special offers.");
        openDealerLoginModal();
        return;
    }
    if (dealerMerchant.allowOffers === false) {
        alert("Special Offers are currently restricted for your account. Please contact admin.");
        return;
    }

    const o = (state.offers || []).find(x => x.id === offerId);
    if (!o) return;

    const cartKey = `offer:${o.id}`;
    const input = document.getElementById(`dqty-${cartKey}`) || document.getElementById(`offer-qty-${offerId}`);
    const qty = input ? (parseInt(input.value, 10) || o.minQty || 1) : (o.minQty || 1);

    if (qty < (o.minQty || 1)) {
        alert(`⚠️ Minimum Order Quantity for this offer is ${o.minQty} pcs.`);
        return;
    }

    const currentInCart = dealerCart[cartKey] || 0;
    dealerCart[cartKey] = currentInCart + qty;

    localStorage.setItem("bms_dealer_cart", JSON.stringify(dealerCart));
    renderDealerCart();
    renderDealerOffers();

    alert(`🎉 ${qty} pcs of "${o.model}" added to cart at Special Offer rate of ₹${o.offerPrice.toLocaleString('en-IN')}/pc!`);
}
window.addOfferToCart = addOfferToCart;
