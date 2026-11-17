// ==========================================================================
// RABBIT WORLD SMART BUSINESS ASSISTANT (OFFLINE AI ENGINE)
// 100% Free, Works Offline in Browser / USB, Multilingual (Gujarati & English)
// ==========================================================================

let isAIAssistantOpen = false;
let isAIVoiceMuted = false;
let aiCurrentLanguage = 'gu'; // 'gu' | 'en'
let aiSpeechRecognition = null;
let isAIListening = false;

// Initialize Assistant
function initRabbitAIAssistant() {
    setupAISpeechRecognition();
}

function toggleRabbitAIAssistant() {
    if (isAIAssistantOpen) {
        closeRabbitAIAssistant();
    } else {
        openRabbitAIAssistant();
    }
}
window.toggleRabbitAIAssistant = toggleRabbitAIAssistant;

function openRabbitAIAssistant() {
    const modal = document.getElementById('rabbit-ai-modal');
    if (!modal) return;
    modal.style.display = 'flex';
    isAIAssistantOpen = true;

    const input = document.getElementById('rabbit-ai-input');
    if (input) {
        setTimeout(() => input.focus(), 200);
    }
}
window.openRabbitAIAssistant = openRabbitAIAssistant;

function closeRabbitAIAssistant() {
    const modal = document.getElementById('rabbit-ai-modal');
    if (!modal) return;
    modal.style.display = 'none';
    isAIAssistantOpen = false;
    stopAIVoiceRecognition();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
}
window.closeRabbitAIAssistant = closeRabbitAIAssistant;

function clearRabbitAIChat() {
    const thread = document.getElementById('rabbit-ai-thread');
    if (!thread) return;

    if (window.speechSynthesis) window.speechSynthesis.cancel();

    thread.innerHTML = `
        <!-- Welcome Greeting -->
        <div style="display:flex; margin-bottom:12px; gap:8px; align-items:flex-start;">
            <div style="width:30px; height:30px; background:linear-gradient(135deg, #0e254f 0%, #1e3a8a 100%); color:#60a5fa; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:13px; flex-shrink:0; box-shadow:0 2px 6px rgba(0,0,0,0.15);">
                <i class="fa-solid fa-robot"></i>
            </div>
            <div style="background:#ffffff; color:#0e254f; border:1px solid #e2e8f0; padding:12px 14px; border-radius:4px 14px 14px 14px; max-width:88%; font-size:13px; line-height:1.45; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
                <div style="font-weight:800; color:#0e254f; margin-bottom:4px; font-size:13.5px;">
                    નમસ્તે! હું તમારો Rabbit Smart Business Assistant છું. 🤖
                </div>
                <div style="color:#475569; font-size:12.5px;">
                    ચેટ સાફ (Clear) થઈ ગઈ છે. હવે તમે નવો સવાલ પૂછી શકો છો. માઇક 🎙️ દબાવીને બોલી પણ શકો છો.<br>
                    દા.ત. <b>"આપણી પાસે કેટલી પાર્ટી છે?"</b> અથવા <b>"Mehta traders ni udhari?"</b>
                </div>
            </div>
        </div>
    `;

    const input = document.getElementById('rabbit-ai-input');
    if (input) {
        input.value = '';
        input.focus();
    }
}
window.clearRabbitAIChat = clearRabbitAIChat;

function toggleAIVoiceMute() {
    isAIVoiceMuted = !isAIVoiceMuted;
    const btn = document.getElementById('ai-voice-mute-btn');
    if (btn) {
        btn.innerHTML = isAIVoiceMuted 
            ? '<i class="fa-solid fa-volume-xmark" style="color:#ef4444;"></i>' 
            : '<i class="fa-solid fa-volume-high" style="color:#10b981;"></i>';
        btn.title = isAIVoiceMuted ? 'Voice Muted (Click to Unmute)' : 'Voice Active (Click to Mute)';
    }
    if (isAIVoiceMuted && window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
}
window.toggleAIVoiceMute = toggleAIVoiceMute;

function setAILanguage(lang) {
    aiCurrentLanguage = (lang === 'en') ? 'en' : 'gu';
    const guBtn = document.getElementById('ai-lang-gu');
    const enBtn = document.getElementById('ai-lang-en');
    const input = document.getElementById('rabbit-ai-input');

    if (guBtn && enBtn) {
        if (aiCurrentLanguage === 'gu') {
            guBtn.style.background = '#2563eb';
            guBtn.style.color = '#fff';
            enBtn.style.background = '#f1f5f9';
            enBtn.style.color = '#475569';
            if (input) input.placeholder = "ગુજરાતી અથવા English માં પૂછો (જેમ કે: આપણી પાસે કેટલી પાર્ટી છે, Mehta Traders ni udhari?)...";
        } else {
            enBtn.style.background = '#2563eb';
            enBtn.style.color = '#fff';
            guBtn.style.background = '#f1f5f9';
            guBtn.style.color = '#475569';
            if (input) input.placeholder = "Ask anything (e.g., Total parties, Parties in Rajkot, Pending orders?)...";
        }
    }

    if (aiSpeechRecognition) {
        aiSpeechRecognition.lang = (aiCurrentLanguage === 'gu') ? 'gu-IN' : 'en-IN';
    }
}
window.setAILanguage = setAILanguage;

// ==========================================
// SPEECH RECOGNITION (LISTENING VIA MIC)
// ==========================================
function setupAISpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
        aiSpeechRecognition = new SpeechRecognition();
        aiSpeechRecognition.continuous = false;
        aiSpeechRecognition.interimResults = false;
        aiSpeechRecognition.lang = (aiCurrentLanguage === 'gu') ? 'gu-IN' : 'en-IN';

        aiSpeechRecognition.onstart = function () {
            isAIListening = true;
            updateAIMicButtonUI();
        };

        aiSpeechRecognition.onresult = function (event) {
            const transcript = event.results[0][0].transcript;
            const input = document.getElementById('rabbit-ai-input');
            if (input) input.value = transcript;
            handleAISubmitQuery(transcript);
        };

        aiSpeechRecognition.onerror = function (event) {
            isAIListening = false;
            updateAIMicButtonUI();
            console.warn('Speech recognition notice:', event.error);
        };

        aiSpeechRecognition.onend = function () {
            isAIListening = false;
            updateAIMicButtonUI();
        };
    } catch (e) {
        console.warn('Speech recognition not available:', e);
    }
}

function toggleAIVoiceListening() {
    if (!aiSpeechRecognition) {
        setupAISpeechRecognition();
    }
    if (!aiSpeechRecognition) {
        alert("Speech Recognition is not supported by your current browser. You can type or use the quick query buttons below!");
        return;
    }

    if (isAIListening) {
        stopAIVoiceRecognition();
    } else {
        startAIVoiceRecognition();
    }
}
window.toggleAIVoiceListening = toggleAIVoiceListening;

function startAIVoiceRecognition() {
    if (!aiSpeechRecognition) return;
    try {
        aiSpeechRecognition.lang = (aiCurrentLanguage === 'gu') ? 'gu-IN' : 'en-IN';
        aiSpeechRecognition.start();
    } catch (err) {
        console.warn('Recognition start err:', err);
    }
}

function stopAIVoiceRecognition() {
    if (aiSpeechRecognition && isAIListening) {
        try { aiSpeechRecognition.stop(); } catch (e) {}
    }
    isAIListening = false;
    updateAIMicButtonUI();
}

function updateAIMicButtonUI() {
    const micBtn = document.getElementById('ai-mic-btn');
    if (!micBtn) return;
    if (isAIListening) {
        micBtn.style.background = '#ef4444';
        micBtn.style.color = '#fff';
        micBtn.innerHTML = '<i class="fa-solid fa-microphone fa-bounce"></i>';
        micBtn.title = "Listening... Speak now";
    } else {
        micBtn.style.background = '#f1f5f9';
        micBtn.style.color = '#0e254f';
        micBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
        micBtn.title = "Click to Speak (Voice Query)";
    }
}

// ==========================================
// SPEECH SYNTHESIS (SPEAKING BACK ANSWERS)
// ==========================================
function speakAIResponse(textToSpeak) {
    if (isAIVoiceMuted || !window.speechSynthesis || !textToSpeak) return;

    try {
        window.speechSynthesis.cancel(); // Stop any previous speech
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        // Try selecting Indian English or Gujarati/Hindi voice if present
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
            let selectedVoice = null;
            if (aiCurrentLanguage === 'gu' || /[\u0A80-\u0AFF]/.test(textToSpeak)) {
                selectedVoice = voices.find(v => v.lang.includes('gu') || v.lang.includes('hi') || v.name.toLowerCase().includes('india'));
            } else {
                selectedVoice = voices.find(v => v.lang === 'en-IN' || v.lang.includes('en-GB') || v.lang.includes('en'));
            }
            if (selectedVoice) utterance.voice = selectedVoice;
        }

        window.speechSynthesis.speak(utterance);
    } catch (e) {
        console.warn('Speech synthesis err:', e);
    }
}

// ==========================================
// CHAT UI & MESSAGING ENGINE
// ==========================================
function handleAISubmitQuery(explicitQuery) {
    const input = document.getElementById('rabbit-ai-input');
    const query = (explicitQuery || (input ? input.value : '')).trim();
    if (!query) return;

    if (input) input.value = '';

    // Render User Message Bubble
    appendAIMessageBubble('user', query);

    // Process Query through Local NLP Business Engine
    setTimeout(() => {
        const result = processLocalBusinessQuery(query);
        appendAIMessageBubble('assistant', result.html);
        if (result.voiceText) {
            speakAIResponse(result.voiceText);
        }
    }, 150);
}
window.handleAISubmitQuery = handleAISubmitQuery;

function handleAIQuickPrompt(promptText) {
    handleAISubmitQuery(promptText);
}
window.handleAIQuickPrompt = handleAIQuickPrompt;

function appendAIMessageBubble(sender, contentHtml) {
    const thread = document.getElementById('rabbit-ai-thread');
    if (!thread) return;

    const msgDiv = document.createElement('div');
    msgDiv.style.display = 'flex';
    msgDiv.style.marginBottom = '12px';
    msgDiv.style.flexDirection = (sender === 'user') ? 'row-reverse' : 'row';
    msgDiv.style.gap = '8px';
    msgDiv.style.alignItems = 'flex-start';

    if (sender === 'user') {
        msgDiv.innerHTML = `
            <div style="width:30px; height:30px; background:#2563eb; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; flex-shrink:0;">
                <i class="fa-solid fa-user"></i>
            </div>
            <div style="background:#2563eb; color:#ffffff; padding:8px 14px; border-radius:14px 4px 14px 14px; max-width:80%; font-size:13px; font-weight:600; line-height:1.4; box-shadow:0 2px 6px rgba(37,99,235,0.25);">
                ${escapeHtml(contentHtml)}
            </div>
        `;
    } else {
        msgDiv.innerHTML = `
            <div style="width:30px; height:30px; background:linear-gradient(135deg, #0e254f 0%, #1e3a8a 100%); color:#60a5fa; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:13px; flex-shrink:0; box-shadow:0 2px 6px rgba(0,0,0,0.15);">
                <i class="fa-solid fa-robot"></i>
            </div>
            <div style="background:#ffffff; color:#0e254f; border:1px solid #e2e8f0; padding:10px 14px; border-radius:4px 14px 14px 14px; max-width:88%; font-size:13px; line-height:1.45; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
                ${contentHtml}
            </div>
        `;
    }

    thread.appendChild(msgDiv);
    thread.scrollTop = thread.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==========================================
// OFFLINE NATURAL LANGUAGE BUSINESS ENGINE (EXPANDED INTELLIGENCE)
// ==========================================
function processLocalBusinessQuery(rawQuery) {
    const q = rawQuery.toLowerCase().trim();
    const isGu = (aiCurrentLanguage === 'gu') || /[\u0A80-\u0AFF]/.test(rawQuery) || 
                 q.includes('udhari') || q.includes('baki') || q.includes('ketla') || 
                 q.includes('ketali') || q.includes('kone') || q.includes('chalu') || 
                 q.includes('che') || q.includes('su') || q.includes('kya') || q.includes('party');

    const merchants = (state && state.merchants) ? state.merchants : [];
    const orders = (state && state.orders) ? state.orders : [];
    const ledger = (state && state.ledger) ? state.ledger : [];
    const products = (state && state.products) ? state.products : [];

    // Helper: Calculate net balance for a merchant
    function getMerchantBalance(merchId) {
        let bal = 0;
        ledger.forEach(entry => {
            if (entry.merchantId === merchId || String(entry.merchantId) === String(merchId)) {
                bal += (parseFloat(entry.debit) || 0) - (parseFloat(entry.credit) || 0);
            }
        });
        return Math.round(bal);
    }

    // Known Gujarat Cities Dictionary (Aliases in English & Gujarati)
    const GUJ_CITIES = {
        'rajkot': ['rajkot', 'રાજકોટ'],
        'ahmedabad': ['ahmedabad', 'amdavad', 'અમદાવાદ'],
        'surat': ['surat', 'સુરત'],
        'vadodara': ['vadodara', 'baroda', 'વડોદરા', 'બરોડા'],
        'morbi': ['morbi', 'મોરબી'],
        'jamnagar': ['jamnagar', 'જામનગર'],
        'bhavnagar': ['bhavnagar', 'ભાવનગર'],
        'junagadh': ['junagadh', 'જૂનાગઢ'],
        'gandhinagar': ['gandhinagar', 'ગાંધીનગર'],
        'bhuj': ['bhuj', 'kutch', 'ભુજ', 'કચ્છ'],
        'mehsana': ['mehsana', 'મહેસાણા'],
        'anand': ['anand', 'આણંદ'],
        'navsari': ['navsari', 'નવસારી'],
        'vapi': ['vapi', 'વાપી'],
        'valsad': ['valsad', 'વલસાડ'],
        'bharuch': ['bharuch', 'ભરૂચ'],
        'godhra': ['godhra', 'ગોધરા'],
        'porbandar': ['porbandar', 'પોરબંદર'],
        'palanpur': ['palanpur', 'પાલનપુર'],
        'surendranagar': ['surendranagar', 'સુરેન્દ્રનગર'],
        'himatnagar': ['himatnagar', 'હિંમતનગર'],
        'amreli': ['amreli', 'અમરેલી'],
        'veraval': ['veraval', 'somnath', 'વેરાવળ', 'સોમનાથ'],
        'botad': ['botad', 'બોટાદ']
    };

    // Auto-learn any other cities currently registered in merchants
    merchants.forEach(m => {
        if (m.city) {
            const cLower = m.city.toLowerCase().trim();
            if (!GUJ_CITIES[cLower]) {
                GUJ_CITIES[cLower] = [cLower];
            }
        }
    });

    // Detect if any city is mentioned in query
    let detectedCityKey = null;
    let detectedCityDisplayName = null;
    for (let key in GUJ_CITIES) {
        const variants = GUJ_CITIES[key];
        if (variants.some(v => q.includes(v))) {
            detectedCityKey = key;
            const matchMerch = merchants.find(m => m.city && m.city.toLowerCase().trim() === key);
            detectedCityDisplayName = matchMerch ? matchMerch.city : (key.charAt(0).toUpperCase() + key.slice(1));
            break;
        }
    }

    // Helper: Find matching merchant in query
    let targetMerchant = null;
    for (let m of merchants) {
        const nameClean = (m.name || '').toLowerCase();
        const uidClean = (m.uid || '').toLowerCase();
        const ownerClean = (m.ownerName || '').toLowerCase();

        const nameTokens = nameClean.split(' ').filter(t => t.length > 2 && t !== 'bath' && t !== 'ceramics' && t !== 'gallery' && t !== 'traders');
        const match = (nameTokens.length > 0 && nameTokens.some(token => q.includes(token))) || 
                      (uidClean && q.includes(uidClean)) || 
                      (q.includes(nameClean)) ||
                      (ownerClean && ownerClean.length > 3 && q.includes(ownerClean));

        if (match) {
            targetMerchant = m;
            break;
        }
    }

    // ==========================================
    // -1. CLEAR CHAT INTENT (VOICE / TEXT)
    // ==========================================
    if (q.includes('clear chat') || q === 'clear' || q === 'clean' || q.includes('delete chat') || 
        q.includes('ચેટ સાફ') || q.includes('ક્લિયર કરો') || q.includes('સાફ કરો') || q.includes('chat clear') || q.includes('ચેટ ડીલીટ')) {
        setTimeout(() => {
            clearRabbitAIChat();
        }, 400);
        const voiceText = isGu ? "ચેટ ક્લિયર કરી દીધી છે." : "Chat has been cleared.";
        const html = `
            <div style="font-size:12.5px; color:#16a34a; font-weight:700;">
                <i class="fa-solid fa-check"></i> ${isGu ? 'ચેટ ક્લિયર થઈ ગઈ છે.' : 'Chat cleared successfully.'}
            </div>
        `;
        return { html, voiceText };
    }

    // ==========================================
    // 0. GREETINGS & POLITE INQUIRIES
    // ==========================================
    if (q.includes('kem cho') || q.includes('kemcho') || q.includes('hello') || q.includes('hi ') || q === 'hi' || q.includes('hey') || 
        q.includes('namaste') || q.includes('namaskar') || q.includes('ram ram') || q.includes('જય શ્રી કૃષ્ણ') || 
        q.includes('કેમ છો') || q.includes('નમસ્તે') || q.includes('who are you') || q.includes('tu kon') || q.includes('તમે કોણ')) {
        const voiceText = isGu
            ? "નમસ્તે સાહેબ! હું તમારો Rabbit Smart Business Assistant છું. હું આપની પાર્ટીઓની યાદી, બાકી ઉધારી, લાઈવ ઓર્ડર્સ, સ્ટોક અને નકશાની તમામ માહિતી તરત આપી શકું છું. બોલો, હું શું મદદ કરું?"
            : "Hello! I am your Rabbit Smart Business Assistant. I can help you check dealer counts, pending dues, live orders, stock, and territory map. How can I assist you today?";

        const html = `
            <div style="font-weight:800; font-size:14px; color:#0e254f; margin-bottom:4px;">
                <i class="fa-solid fa-handshake" style="color:#2563eb;"></i> ${isGu ? 'નમસ્તે! મજામાં છો?' : 'Hello & Welcome!'}
            </div>
            <div style="font-size:12.5px; color:#334155; line-height:1.45; margin-bottom:8px;">
                ${isGu 
                    ? 'હું તમારો <b>Rabbit Smart Business Assistant</b> છું. તમે મને નીચેનામાંથી કોઈપણ સવાલ પૂછી શકો છો:<br>• <b>પાર્ટીઓ:</b> <i>"આપણી પાસે કેટલી પાર્ટી છે?"</i> અથવા <i>"રાજકોટમાં કેટલી પાર્ટી ચાલુ છે?"</i><br>• <b>ઉધારી હિસાબ:</b> <i>"Mehta Traders ni udhari?"</i> અથવા <i>"કુલ બાકી ઉધારી કેટલી?"</i><br>• <b>ઓર્ડર્સ:</b> <i>"કેટલા ઓર્ડર પેન્ડિંગ છે?"</i> અથવા <i>"આજના ઓર્ડર"</i><br>• <b>સંપર્ક:</b> <i>"Mehta traders no number?"</i>'
                    : 'I am your <b>Rabbit Smart Business Assistant</b>. You can ask me anything about:<br>• <b>Dealers Count:</b> <i>"How many parties do we have?"</i> or <i>"Parties in Rajkot?"</i><br>• <b>Dues &amp; Ledger:</b> <i>"Mehta Traders balance?"</i> or <i>"Total outstanding dues"</i><br>• <b>Orders:</b> <i>"How many pending orders?"</i> or <i>"Today\'s orders"</i><br>• <b>Contact Details:</b> <i>"Mehta Traders phone number"</i>'}
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:4px;">
                <button type="button" onclick="handleAIQuickPrompt('આપણી પાસે કેટલી પાર્ટી છે?')" style="font-size:11px; font-weight:700; background:#f1f5f9; color:#0e254f; border:1px solid #cbd5e1; padding:3px 7px; border-radius:12px; cursor:pointer;">👥 કેટલી પાર્ટી છે?</button>
                <button type="button" onclick="handleAIQuickPrompt('રાજકોટ માં કેટલી પાર્ટી ચાલુ છે?')" style="font-size:11px; font-weight:700; background:#f1f5f9; color:#0e254f; border:1px solid #cbd5e1; padding:3px 7px; border-radius:12px; cursor:pointer;">📍 રાજકોટ પાર્ટીઓ</button>
                <button type="button" onclick="handleAIQuickPrompt('કુલ બાકી ઉધારી કેટલી?')" style="font-size:11px; font-weight:700; background:#f1f5f9; color:#0e254f; border:1px solid #cbd5e1; padding:3px 7px; border-radius:12px; cursor:pointer;">💰 કુલ ઉધારી</button>
            </div>
        `;
        return { html, voiceText };
    }

    // ==========================================
    // 1. CITY-SPECIFIC PARTY INQUIRY (e.g. "Rajkot ma ketali party chalu che")
    // ==========================================
    if (detectedCityKey) {
        const cityMerchants = merchants.filter(m => m.city && m.city.toLowerCase().trim() === detectedCityKey);
        const cityCount = cityMerchants.length;

        const isAskingParty = q.includes('party') || q.includes('parties') || q.includes('dealer') || 
                              q.includes('dealers') || q.includes('ketla') || q.includes('ketali') || 
                              q.includes('how many') || q.includes('list') || q.includes('chalu') || 
                              q.includes('પાર્ટી') || q.includes('ડીલર') || q.includes('કેટલા') || 
                              q.includes('કેટલી') || q.includes('ચાલુ') || q.includes('દુકાન') || 
                              q.includes('વેપારી');

        if (isAskingParty || !targetMerchant) {
            let namesList = cityMerchants.map(m => m.name).join(', ');

            const voiceText = isGu
                ? (cityCount > 0 
                    ? `${detectedCityDisplayName} માં આપણી પાસે કુલ ${cityCount} પાર્ટી નોંધાયેલી છે. ${namesList}.`
                    : `${detectedCityDisplayName} માં હાલ આપણી કોઈ પાર્ટી રજિસ્ટર્ડ નથી.`)
                : (cityCount > 0 
                    ? `In ${detectedCityDisplayName}, we have ${cityCount} registered dealer(s): ${namesList}.`
                    : `Currently there are no registered dealers in ${detectedCityDisplayName}.`);

            const html = `
                <div style="font-weight:800; font-size:14px; color:#0e254f; margin-bottom:4px; display:flex; align-items:center; justify-content:space-between;">
                    <span><i class="fa-solid fa-city" style="color:#2563eb;"></i> ${detectedCityDisplayName} Dealers (${isGu ? 'પાર્ટીઓ' : 'Parties'})</span>
                    <span style="font-size:11px; background:#eff6ff; color:#1d4ed8; font-weight:800; padding:2px 8px; border-radius:12px; border:1px solid #bfdbfe;">${cityCount} Active</span>
                </div>
                <div style="font-size:12px; color:#475569; margin-bottom:8px;">
                    ${isGu 
                        ? `<b>${detectedCityDisplayName}</b> માં કુલ <b>${cityCount}</b> અધિકૃત ડીલર રજિસ્ટર્ડ છે:`
                        : `Total <b>${cityCount}</b> authorized dealer(s) registered in <b>${detectedCityDisplayName}</b>:`}
                </div>
                ${cityCount > 0 ? `
                    <div style="display:flex; flex-direction:column; gap:6px; margin-bottom:8px;">
                        ${cityMerchants.map((m, idx) => {
                            const b = getMerchantBalance(m.id);
                            const phone = m.callingPhone || m.phone || '';
                            return `
                                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:8px; font-size:12px;">
                                    <div style="display:flex; justify-content:space-between; align-items:center;">
                                        <b>${idx + 1}. ${m.name}</b>
                                        <span style="font-size:10px; background:#e0f2fe; color:#0369a1; padding:1px 5px; border-radius:4px;">UID: ${m.uid || m.id}</span>
                                    </div>
                                    <div style="color:#64748b; font-size:11px; margin-top:2px;">
                                        Owner: <b>${m.ownerName || 'N/A'}</b> · Ph: <b>${phone || 'N/A'}</b>
                                    </div>
                                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
                                        <span style="font-size:11px; color:${b > 0 ? '#dc2626' : '#16a34a'}; font-weight:700;">
                                            ${b > 0 ? `Dues: ₹${b.toLocaleString('en-IN')}` : 'No Dues (₹0)'}
                                        </span>
                                        <div style="display:flex; gap:4px;">
                                            ${phone ? `
                                                <a href="tel:${phone}" style="background:#2563eb; color:#fff; text-decoration:none; padding:2px 6px; border-radius:4px; font-size:10px; font-weight:700;">
                                                    <i class="fa-solid fa-phone"></i> Call
                                                </a>
                                                <a href="https://wa.me/${phone.replace(/\\D/g,'')}" target="_blank" style="background:#25d366; color:#fff; text-decoration:none; padding:2px 6px; border-radius:4px; font-size:10px; font-weight:700;">
                                                    <i class="fa-brands fa-whatsapp"></i> Chat
                                                </a>
                                            ` : ''}
                                            <button type="button" onclick="closeRabbitAIAssistant(); jumpToMerchantLedger('${m.id}')" style="background:#0e254f; color:#fff; border:none; padding:2px 6px; border-radius:4px; font-size:10px; font-weight:700; cursor:pointer;">
                                                Ledger
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                ` : `
                    <div style="background:#fef2f2; border:1px solid #fecaca; border-radius:6px; padding:10px; font-size:12px; color:#991b1b; margin-bottom:8px;">
                        ${isGu ? 'આ શહેરમાં હાલ કોઈ પાર્ટી રજિસ્ટર્ડ નથી.' : 'No dealers registered under this city.'}
                    </div>
                `}
                <button type="button" class="btn" onclick="closeRabbitAIAssistant(); jumpToTab('merchants-tab');" style="background:#0e254f; color:#fff; font-size:11px; font-weight:700; padding:4px 8px; border-radius:4px; cursor:pointer;">
                    <i class="fa-solid fa-users"></i> Open All Merchants Tab
                </button>
            `;
            return { html, voiceText };
        }
    }

    // ==========================================
    // 2. TOTAL PARTIES COUNT & CITY BREAKDOWN (e.g. "aapdi pase atare ketali party che")
    // ==========================================
    const isAskingTotalParties = (
        (q.includes('party') || q.includes('parties') || q.includes('dealer') || q.includes('dealers') || 
         q.includes('merchant') || q.includes('merchants') || q.includes('પાર્ટી') || q.includes('ડીલર') || 
         q.includes('વેપારી') || q.includes('દુકાન') || q.includes('ગ્રાહક')) &&
        (q.includes('ketla') || q.includes('ketali') || q.includes('how many') || q.includes('count') || 
         q.includes('total') || q.includes('all') || q.includes('list') || q.includes('કુલ') || 
         q.includes('કેટલી') || q.includes('કેટલા') || q.includes('બધી') || q.includes('સંખ્યા') ||
         q.includes('atare') || q.includes('pase') || q.includes('chalu') || q.includes('active') ||
         q.includes('બધા') || q.includes('નેટવર્ક'))
    );

    if (isAskingTotalParties && !targetMerchant) {
        const totalCount = merchants.length;

        // Group by cities
        const cityCounts = {};
        merchants.forEach(m => {
            const c = m.city || 'Other';
            cityCounts[c] = (cityCounts[c] || 0) + 1;
        });

        const citySummaryList = Object.entries(cityCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([c, count]) => `${c}: ${count}`);

        const voiceText = isGu
            ? `આપણી પાસે સિસ્ટમમાં હાલ કુલ ${totalCount} અધિકૃત પાર્ટીઓ (ડીલર્સ) રજિસ્ટર્ડ છે. જેમાં ${citySummaryList.join(', ')} પાર્ટીઓ સામેલ છે.`
            : `We currently have ${totalCount} authorized dealers registered across Gujarat, including ${citySummaryList.join(', ')}.`;

        const html = `
            <div style="font-weight:800; font-size:14px; color:#0e254f; margin-bottom:6px; display:flex; align-items:center; justify-content:space-between;">
                <span><i class="fa-solid fa-users-gear" style="color:#2563eb;"></i> ${isGu ? 'કુલ રજિસ્ટર્ડ પાર્ટીઓ (Total Dealers)' : 'Registered Dealers Overview'}</span>
                <span style="font-size:12px; background:#10b981; color:#fff; font-weight:800; padding:2px 8px; border-radius:12px;">${totalCount} Parties</span>
            </div>
            <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:10px; margin-bottom:8px;">
                <div style="font-size:11px; color:#166534; font-weight:700; text-transform:uppercase;">Total Authorized Network</div>
                <div style="font-size:22px; font-weight:900; color:#15803d; margin-top:2px;">${totalCount} Dealers</div>
                <div style="font-size:11.5px; color:#334155; margin-top:4px;">
                    100% Verified Partners across Gujarat territory
                </div>
            </div>
            <div style="font-size:11.5px; font-weight:700; color:#334155; margin-bottom:4px;">
                ${isGu ? 'શહેર પ્રમાણે પાર્ટીઓની સંખ્યા (ક્લિક કરો):' : 'City-wise Dealer Distribution (Click to view):'}
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:4px; margin-bottom:10px;">
                ${Object.entries(cityCounts).map(([c, cnt]) => `
                    <button type="button" onclick="handleAIQuickPrompt('${c} ma ketali party chalu che')" style="background:#ffffff; border:1px solid #cbd5e1; border-radius:14px; padding:3px 9px; font-size:11px; font-weight:700; color:#0e254f; cursor:pointer;">
                        📍 ${c}: <b style="color:#2563eb;">${cnt}</b>
                    </button>
                `).join('')}
            </div>
            <div style="display:flex; gap:6px;">
                <button type="button" class="btn" onclick="closeRabbitAIAssistant(); jumpToTab('merchants-tab');" style="background:#0e254f; color:#fff; font-size:11px; font-weight:700; padding:5px 9px; border-radius:4px; cursor:pointer;">
                    <i class="fa-solid fa-users"></i> View Merchants &amp; Rates
                </button>
                <button type="button" class="btn" onclick="closeRabbitAIAssistant(); jumpToTab('dealer-map-tab');" style="background:#2563eb; color:#fff; font-size:11px; font-weight:700; padding:5px 9px; border-radius:4px; cursor:pointer;">
                    <i class="fa-solid fa-map-location-dot"></i> View on Map
                </button>
            </div>
        `;
        return { html, voiceText };
    }

    // ==========================================
    // 3. SPECIFIC MERCHANT QUERIES (Balance, Info, Phone, Address)
    // ==========================================
    if (targetMerchant) {
        const bal = getMerchantBalance(targetMerchant.id);
        const merchOrders = orders.filter(o => o.merchantId === targetMerchant.id || o.merchantName === targetMerchant.name);
        const pendingCount = merchOrders.filter(o => o.status !== 'Delivered' && o.status !== 'Dispatched').length;
        const phone = targetMerchant.callingPhone || targetMerchant.phone || '';

        // Check if asking about phone/number/address/details
        if (q.includes('number') || q.includes('phone') || q.includes('mobile') || q.includes('contact') || 
            q.includes('address') || q.includes('kya che') || q.includes('owner') || q.includes('નંબર') || 
            q.includes('ફોન') || q.includes('મોબાઇલ') || q.includes('સરનામું') || q.includes('વિગત') || q.includes('details')) {
            const voiceText = isGu
                ? `${targetMerchant.name} ના માલિક ${targetMerchant.ownerName || 'શ્રીમાન'} છે. તેમનો ફોન નંબર ${phone || 'ઉપલબ્ધ નથી'} છે, અને સરનામું ${targetMerchant.address || targetMerchant.city || ''} છે.`
                : `${targetMerchant.name} is owned by ${targetMerchant.ownerName || 'N/A'}. Contact phone is ${phone || 'N/A'}, located at ${targetMerchant.address || targetMerchant.city || ''}.`;

            const html = `
                <div style="font-weight:800; font-size:14px; color:#0e254f; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                    <i class="fa-solid fa-id-card" style="color:#2563eb;"></i> ${targetMerchant.name}
                    <span style="font-size:10px; background:#eff6ff; color:#1d4ed8; padding:2px 6px; border-radius:4px;">UID: ${targetMerchant.uid || targetMerchant.id}</span>
                </div>
                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px; margin-bottom:8px; font-size:12px;">
                    <div style="margin-bottom:3px;">👤 Owner: <b>${targetMerchant.ownerName || 'N/A'}</b></div>
                    <div style="margin-bottom:3px;">📞 Phone: <b>${phone || 'N/A'}</b></div>
                    <div style="margin-bottom:3px;">📍 Address: <b>${targetMerchant.address || targetMerchant.city || 'Gujarat'}</b></div>
                    <div style="margin-bottom:3px;">🏢 GST: <b>${targetMerchant.gst || 'Not Provided'}</b></div>
                    <div style="margin-bottom:3px;">🔑 Portal PIN: <b>${targetMerchant.pin || '123456'}</b></div>
                </div>
                <div style="display:flex; gap:6px; flex-wrap:wrap;">
                    ${phone ? `
                        <a href="tel:${phone}" style="background:#2563eb; color:#fff; text-decoration:none; padding:4px 8px; border-radius:4px; font-size:11px; font-weight:700;">
                            <i class="fa-solid fa-phone"></i> Call Now
                        </a>
                        <a href="https://wa.me/${phone.replace(/\\D/g,'')}" target="_blank" style="background:#25d366; color:#fff; text-decoration:none; padding:4px 8px; border-radius:4px; font-size:11px; font-weight:700;">
                            <i class="fa-brands fa-whatsapp"></i> WhatsApp
                        </a>
                    ` : ''}
                    <button type="button" class="btn" onclick="closeRabbitAIAssistant(); jumpToMerchantLedger('${targetMerchant.id}')" style="background:#0e254f; color:#fff; font-size:11px; font-weight:700; padding:4px 8px; border-radius:4px; cursor:pointer;">
                        <i class="fa-solid fa-book-bookmark"></i> View Ledger
                    </button>
                </div>
            `;
            return { html, voiceText };
        }

        // Default for specific merchant: Outstanding Dues & Ledger Balance
        const voiceText = isGu
            ? `${targetMerchant.name} નું કુલ બાકી લેણું ₹${Math.abs(bal).toLocaleString('en-IN')} છે. તેમના ${pendingCount} ઓર્ડર પેન્ડિંગ છે.`
            : `${targetMerchant.name} has an outstanding balance of ₹${Math.abs(bal).toLocaleString('en-IN')}, with ${pendingCount} pending orders.`;

        const html = `
            <div style="font-weight:800; font-size:14px; color:#0e254f; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                <i class="fa-solid fa-store" style="color:#2563eb;"></i> ${targetMerchant.name}
                <span style="font-size:10px; background:#eff6ff; color:#1d4ed8; padding:2px 6px; border-radius:4px;">UID: ${targetMerchant.uid || targetMerchant.id}</span>
            </div>
            <div style="font-size:11.5px; color:#64748b; margin-bottom:8px;">
                <i class="fa-solid fa-location-dot"></i> ${targetMerchant.address || targetMerchant.city || 'Gujarat'} · Ph: ${phone || 'N/A'}
            </div>
            <div style="background:#fef2f2; border:1px solid #fecaca; border-radius:8px; padding:10px; margin-bottom:8px;">
                <div style="font-size:11px; color:#991b1b; font-weight:700; text-transform:uppercase;">${isGu ? 'કુલ બાકી ઉધારી (Outstanding Dues)' : 'Outstanding Dues'}</div>
                <div style="font-size:18px; font-weight:900; color:#dc2626; margin-top:2px;">₹${bal.toLocaleString('en-IN')}</div>
                <div style="font-size:11px; color:#475569; margin-top:3px;">
                    Credit Terms: <b>${targetMerchant.creditDays || 30} Days</b> · Pending Orders: <b>${pendingCount}</b>
                </div>
            </div>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
                <button type="button" class="btn" onclick="closeRabbitAIAssistant(); jumpToMerchantLedger('${targetMerchant.id}')" style="background:#0e254f; color:#fff; font-size:11px; font-weight:700; padding:4px 8px; border-radius:4px; cursor:pointer;">
                    <i class="fa-solid fa-book-bookmark"></i> View Ledger
                </button>
                ${phone ? `
                    <button type="button" class="btn" onclick="window.open('https://wa.me/${phone.replace(/\\D/g,'')}?text=' + encodeURIComponent('Hello ${targetMerchant.name}, this is a gentle reminder regarding your outstanding balance of ₹${bal.toLocaleString('en-IN')}. Please arrange payment at your earliest convenience.'), '_blank')" style="background:#25d366; color:#fff; font-size:11px; font-weight:700; padding:4px 8px; border-radius:4px; cursor:pointer;">
                        <i class="fa-brands fa-whatsapp"></i> WhatsApp Reminder
                    </button>
                ` : ''}
            </div>
        `;
        return { html, voiceText };
    }

    // ==========================================
    // 4. PAYMENTS RECEIVED / COLLECTIONS / JAMA
    // ==========================================
    if (q.includes('jama') || q.includes('collection') || q.includes('credit') || q.includes('rupiya aavya') || 
        q.includes('payment aavyu') || q.includes('જમા') || q.includes('કલેક્શન') || q.includes('રૂપિયા આવ્યા')) {
        let totalCredit = 0;
        let creditEntries = 0;
        ledger.forEach(entry => {
            const cr = parseFloat(entry.credit) || 0;
            if (cr > 0) {
                totalCredit += cr;
                creditEntries++;
            }
        });

        const voiceText = isGu
            ? `લેજરમાં અત્યાર સુધી કુલ ₹${Math.round(totalCredit).toLocaleString('en-IN')} નું પેમેન્ટ જમા થયેલું છે.`
            : `Total payments collected and credited to ledger are ₹${Math.round(totalCredit).toLocaleString('en-IN')}.`;

        const html = `
            <div style="font-weight:800; font-size:14px; color:#0e254f; margin-bottom:6px;">
                <i class="fa-solid fa-money-bill-trend-up" style="color:#10b981;"></i> ${isGu ? 'કુલ જમા પેમેન્ટ (Collections Received)' : 'Payment Collections'}
            </div>
            <div style="background:#ecfdf5; border:1px solid #a7f3d0; border-radius:8px; padding:10px; margin-bottom:8px;">
                <div style="font-size:11px; color:#065f46; font-weight:700; text-transform:uppercase;">Total Payments Credited</div>
                <div style="font-size:20px; font-weight:900; color:#059669; margin-top:2px;">₹${Math.round(totalCredit).toLocaleString('en-IN')}</div>
                <div style="font-size:11px; color:#475569; margin-top:3px;">Across ${creditEntries} payment transactions</div>
            </div>
            <button type="button" class="btn" onclick="closeRabbitAIAssistant(); jumpToTab('ledger-tab');" style="background:#0e254f; color:#fff; font-size:11px; font-weight:700; padding:4px 8px; border-radius:4px; cursor:pointer;">
                <i class="fa-solid fa-book-bookmark"></i> Open Ledger
            </button>
        `;
        return { html, voiceText };
    }

    // ==========================================
    // 5. OVERALL MARKET DUES / HIGHEST BALANCES
    // ==========================================
    if (q.includes('udhari') || q.includes('baki') || q.includes('dues') || q.includes('outstanding') || 
        q.includes('balance') || q.includes('ઉધારી') || q.includes('લેણું') || q.includes('બાકી') || q.includes('હિસાબ')) {
        let totalMarketDue = 0;
        const merchantBalances = merchants.map(m => {
            const b = getMerchantBalance(m.id);
            if (b > 0) totalMarketDue += b;
            return { merchant: m, balance: b };
        }).filter(x => x.balance > 0).sort((a, b) => b.balance - a.balance);

        const top3 = merchantBalances.slice(0, 3);
        const topNames = top3.map(x => `${x.merchant.name} (₹${x.balance.toLocaleString('en-IN')})`).join(', ');

        const voiceText = isGu
            ? `બજારમાં કુલ ₹${Math.round(totalMarketDue).toLocaleString('en-IN')} ની ઉધારી બાકી છે. જેમાં સૌથી વધુ ઉધારી ${topNames || 'કોઈની નથી'}.`
            : `Total market outstanding dues are ₹${Math.round(totalMarketDue).toLocaleString('en-IN')}. Highest pending parties are ${topNames || 'None'}.`;

        const html = `
            <div style="font-weight:800; font-size:13.5px; color:#0e254f; margin-bottom:4px;">
                <i class="fa-solid fa-file-invoice-dollar" style="color:#dc2626;"></i> ${isGu ? 'કુલ માર્કેટ ઉધારી (Total Outstanding Dues)' : 'Market Outstanding Dues'}
            </div>
            <div style="background:#fef2f2; border:1px solid #fecaca; border-radius:8px; padding:10px; margin-bottom:8px;">
                <div style="font-size:20px; font-weight:900; color:#dc2626;">₹${Math.round(totalMarketDue).toLocaleString('en-IN')}</div>
                <div style="font-size:11px; color:#475569; margin-top:2px;">Across ${merchantBalances.length} active dealers</div>
            </div>
            ${top3.length > 0 ? `
                <div style="font-size:11.5px; font-weight:700; color:#334155; margin-bottom:4px;">
                    ${isGu ? 'સૌથી વધુ બાકી ઉધારી ધરાવતી પાર્ટીઓ:' : 'Top Outstanding Parties:'}
                </div>
                <div style="display:flex; flex-direction:column; gap:4px; margin-bottom:8px;">
                    ${top3.map((x, idx) => `
                        <div style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; border:1px solid #e2e8f0; border-radius:4px; padding:5px 8px; font-size:11.5px;">
                            <span><b>${idx + 1}.</b> ${x.merchant.name}</span>
                            <b style="color:#dc2626;">₹${x.balance.toLocaleString('en-IN')}</b>
                        </div>
                    `).join('')}
                </div>
            ` : `
                <div style="font-size:12px; color:#16a34a; font-weight:700; margin-bottom:8px;">
                    ✓ Great news! All party accounts are settled.
                </div>
            `}
            <button type="button" class="btn" onclick="closeRabbitAIAssistant(); jumpToTab('ledger-tab');" style="background:#0e254f; color:#fff; font-size:11px; font-weight:700; padding:4px 8px; border-radius:4px; cursor:pointer;">
                <i class="fa-solid fa-book-bookmark"></i> Open Full Ledger Tab
            </button>
        `;
        return { html, voiceText };
    }

    // ==========================================
    // 6. ORDERS SUMMARY & PENDING DISPATCH & TODAY
    // ==========================================
    if (q.includes('order') || q.includes('orders') || q.includes('pending') || q.includes('dispatch') || 
        q.includes('ઓર્ડર') || q.includes('પેન્ડિંગ') || q.includes('ડિસ્પેચ')) {
        
        // Today's orders check
        if (q.includes('aaj') || q.includes('today') || q.includes('આજ')) {
            const todayStr = new Date().toISOString().split('T')[0];
            const todayOrders = orders.filter(o => o.date && o.date.startsWith(todayStr));
            let todayVal = 0;
            todayOrders.forEach(o => todayVal += (parseFloat(o.total) || 0));

            const voiceText = isGu
                ? `આજે કુલ ${todayOrders.length} નવા ઓર્ડર મળ્યા છે, જેનું મૂલ્ય ₹${Math.round(todayVal).toLocaleString('en-IN')} છે.`
                : `Today we recorded ${todayOrders.length} order(s), totaling ₹${Math.round(todayVal).toLocaleString('en-IN')}.`;

            const html = `
                <div style="font-weight:800; font-size:14px; color:#0e254f; margin-bottom:6px;">
                    <i class="fa-solid fa-calendar-day" style="color:#2563eb;"></i> ${isGu ? 'આજના ઓર્ડર્સ (Today’s Orders)' : 'Today’s Orders'}
                </div>
                <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:10px; margin-bottom:8px;">
                    <div style="font-size:20px; font-weight:900; color:#1d4ed8;">${todayOrders.length} Orders Today</div>
                    <div style="font-size:11.5px; color:#475569; margin-top:2px;">Total Value: <b>₹${Math.round(todayVal).toLocaleString('en-IN')}</b></div>
                </div>
                <button type="button" class="btn" onclick="closeRabbitAIAssistant(); jumpToTab('orders-tab');" style="background:#0e254f; color:#fff; font-size:11px; font-weight:700; padding:4px 8px; border-radius:4px; cursor:pointer;">
                    <i class="fa-solid fa-truck-ramp-box"></i> View Orders
                </button>
            `;
            return { html, voiceText };
        }

        const pendingOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Dispatched');
        const inProdOrders = orders.filter(o => o.status === 'In Production');
        const dispatchedOrders = orders.filter(o => o.status === 'Dispatched');

        let pendingValue = 0;
        pendingOrders.forEach(o => { pendingValue += (parseFloat(o.total) || 0); });

        const voiceText = isGu
            ? `કુલ ${orders.length} ઓર્ડર્સમાંથી ${pendingOrders.length} ઓર્ડર ડિસ્પેચ થવાના બાકી છે, જેની અંદાજિત રકમ ₹${Math.round(pendingValue).toLocaleString('en-IN')} છે.`
            : `Out of ${orders.length} total orders, ${pendingOrders.length} orders are pending dispatch, totaling ₹${Math.round(pendingValue).toLocaleString('en-IN')}.`;

        const html = `
            <div style="font-weight:800; font-size:13.5px; color:#0e254f; margin-bottom:6px;">
                <i class="fa-solid fa-truck-ramp-box" style="color:#2563eb;"></i> ${isGu ? 'ઓર્ડર્સ અને ડિસ્પેચ સમરી' : 'Orders & Dispatch Summary'}
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-bottom:8px;">
                <div style="background:#fef3c7; border:1px solid #fde68a; border-radius:6px; padding:8px; text-align:center;">
                    <div style="font-size:10.5px; color:#92400e; font-weight:700; text-transform:uppercase;">Pending Dispatch</div>
                    <div style="font-size:18px; font-weight:900; color:#b45309;">${pendingOrders.length}</div>
                    <div style="font-size:10px; color:#78350f;">₹${Math.round(pendingValue).toLocaleString('en-IN')}</div>
                </div>
                <div style="background:#ecfdf5; border:1px solid #a7f3d0; border-radius:6px; padding:8px; text-align:center;">
                    <div style="font-size:10.5px; color:#065f46; font-weight:700; text-transform:uppercase;">Dispatched</div>
                    <div style="font-size:18px; font-weight:900; color:#059669;">${dispatchedOrders.length}</div>
                    <div style="font-size:10px; color:#065f46;">Delivered / En Route</div>
                </div>
            </div>
            <div style="font-size:11.5px; color:#475569; margin-bottom:8px;">
                Total Orders Recorded: <b>${orders.length}</b> · In Production: <b>${inProdOrders.length}</b>
            </div>
            <button type="button" class="btn" onclick="closeRabbitAIAssistant(); jumpToTab('orders-tab');" style="background:#0e254f; color:#fff; font-size:11px; font-weight:700; padding:4px 8px; border-radius:4px; cursor:pointer;">
                <i class="fa-solid fa-list-check"></i> Manage Orders &amp; Dispatch
            </button>
        `;
        return { html, voiceText };
    }

    // ==========================================
    // 7. TOP PERFORMING DEALERS
    // ==========================================
    if (q.includes('top party') || q.includes('top dealer') || q.includes('best dealer') || 
        q.includes('performance') || q.includes('સૌથી વધુ') || q.includes('ટોપ')) {
        const dealerSales = {};
        orders.forEach(o => {
            const mId = o.merchantId || o.merchantName || 'Unknown';
            if (!dealerSales[mId]) dealerSales[mId] = { name: o.merchantName || mId, total: 0, count: 0 };
            dealerSales[mId].total += (parseFloat(o.total) || 0);
            dealerSales[mId].count += 1;
        });

        const sortedDealers = Object.values(dealerSales).sort((a, b) => b.total - a.total).slice(0, 5);

        const voiceText = isGu
            ? (sortedDealers.length > 0 
                ? `સૌથી વધુ બિઝનેસ આપતી મુખ્ય પાર્ટી ${sortedDealers[0].name} છે, જેમણે કુલ ₹${Math.round(sortedDealers[0].total).toLocaleString('en-IN')} નો માલ ખરીદ્યો છે.`
                : "ઓર્ડર્સ ડેટા મુજબ હાલ પરફોર્મન્સ કેલ્ક્યુલેટ કરવા માટે પૂરતા ઓર્ડર્સ નથી.")
            : (sortedDealers.length > 0 
                ? `Top performing dealer is ${sortedDealers[0].name} with total purchases of ₹${Math.round(sortedDealers[0].total).toLocaleString('en-IN')}.`
                : "Not enough order history to calculate top dealers.");

        const html = `
            <div style="font-weight:800; font-size:13.5px; color:#0e254f; margin-bottom:6px;">
                <i class="fa-solid fa-trophy" style="color:#eab308;"></i> ${isGu ? 'ટોપ પર્ફોમિંગ ડીલર્સ' : 'Top Performing Dealers'}
            </div>
            ${sortedDealers.length > 0 ? `
                <div style="display:flex; flex-direction:column; gap:4px; margin-bottom:8px;">
                    ${sortedDealers.map((d, idx) => `
                        <div style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; border:1px solid #e2e8f0; border-radius:4px; padding:6px 8px; font-size:12px;">
                            <span><b>#${idx + 1}</b> ${d.name} <small style="color:#64748b;">(${d.count} orders)</small></span>
                            <b style="color:#16a34a;">₹${Math.round(d.total).toLocaleString('en-IN')}</b>
                        </div>
                    `).join('')}
                </div>
            ` : `
                <div style="font-size:12px; color:#64748b; margin-bottom:8px;">No orders found yet to rank dealers.</div>
            `}
            <button type="button" class="btn" onclick="closeRabbitAIAssistant(); jumpToTab('party-performance-tab');" style="background:#0e254f; color:#fff; font-size:11px; font-weight:700; padding:4px 8px; border-radius:4px; cursor:pointer;">
                <i class="fa-solid fa-chart-line"></i> Open Party Performance Tab
            </button>
        `;
        return { html, voiceText };
    }

    // ==========================================
    // 8. PRODUCTS & STOCK QUERY
    // ==========================================
    if (q.includes('product') || q.includes('products') || q.includes('stock') || q.includes('item') || 
        q.includes('items') || q.includes('પ્રોડક્ટ') || q.includes('સ્ટોક') || q.includes('માલ') || 
        q.includes('મોડેલ') || q.includes('closet') || q.includes('basin') || q.includes('sink')) {
        const totalProds = products.length;
        const voiceText = isGu
            ? `કેટલોગમાં કુલ ${totalProds} પ્રોડક્ટ્સ લિસ્ટેડ છે. જેમાં સેનિટરી વેર, આર્ટ બેસિન અને કિચન સિંક ઉપલબ્ધ છે.`
            : `There are ${totalProds} total products listed across Sanitary Ware, Art Basins, and Kitchen Sinks.`;

        const html = `
            <div style="font-weight:800; font-size:13.5px; color:#0e254f; margin-bottom:6px;">
                <i class="fa-solid fa-boxes-stacked" style="color:#10b981;"></i> Products &amp; Catalog Status
            </div>
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:8px; margin-bottom:8px; font-size:12px; color:#334155;">
                <div>Total Active Products: <b>${totalProds} Models</b></div>
                <div style="margin-top:3px; color:#64748b; font-size:11px;">Categories: Vitreous China Closets, Art Basins, Table Top, Kitchen Sinks</div>
            </div>
            <button type="button" class="btn" onclick="closeRabbitAIAssistant(); jumpToTab('stock-tab');" style="background:#0e254f; color:#fff; font-size:11px; font-weight:700; padding:4px 8px; border-radius:4px; cursor:pointer;">
                <i class="fa-solid fa-warehouse"></i> Open Stock &amp; Inventory Tab
            </button>
        `;
        return { html, voiceText };
    }

    // ==========================================
    // 9. DEALER TERRITORY & MAP QUERY
    // ==========================================
    if (q.includes('map') || q.includes('territory') || q.includes('area') || q.includes('નકશો') || 
        q.includes('મેપ') || q.includes('એરિયા') || q.includes('gps') || q.includes('location')) {
        const count = merchants.length;
        const voiceText = isGu
            ? `નકશા પર કુલ ${count} ડીલરોના લોકેશન અને સંરક્ષિત એરિયા કુંડાળાં સેટ કરેલા છે.`
            : `A total of ${count} authorized dealers are mapped with protected territory buffer circles.`;

        const html = `
            <div style="font-weight:800; font-size:13.5px; color:#0e254f; margin-bottom:6px;">
                <i class="fa-solid fa-map-location-dot" style="color:#10b981;"></i> Dealer Territory Map Status
            </div>
            <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:6px; padding:8px; margin-bottom:8px; font-size:12px; color:#166534;">
                <b>${count} Authorized Dealers</b> actively mapped across Gujarat.
            </div>
            <button type="button" class="btn" onclick="closeRabbitAIAssistant(); jumpToTab('dealer-map-tab');" style="background:#0e254f; color:#fff; font-size:11px; font-weight:700; padding:4px 8px; border-radius:4px; cursor:pointer;">
                <i class="fa-solid fa-map"></i> Open Territory Map
            </button>
        `;
        return { html, voiceText };
    }

    // ==========================================
    // 10. INTELLIGENT CONTEXTUAL FALLBACK
    // ==========================================
    const voiceText = isGu
        ? "હું પાર્ટીઓની ગણતરી, શહેર મુજબ લિસ્ટ, બાકી ઉધારી, ઓર્ડર કે સ્ટોક વિશે માહિતી આપી શકું છું. નીચેનામાંથી પસંદ કરો."
        : "I can assist you with total dealers count, city lists, pending dues, orders status, or inventory. You can select an option below.";

    const html = `
        <div style="font-size:12.5px; color:#334155; line-height:1.45;">
            ${isGu 
                ? 'હું તમારા સવાલને વધુ સારી રીતે સમજી શકું તે માટે નીચેના ઉદાહરણો જુઓ:<br>• <b>કુલ પાર્ટી:</b> <i>"આપણી પાસે કેટલી પાર્ટી છે?"</i><br>• <b>શહેર મુજબ:</b> <i>"રાજકોટ માં કેટલી પાર્ટી ચાલુ છે?"</i><br>• <b>પાર્ટી ઉધારી:</b> <i>"Mehta traders ni udhari?"</i><br>• <b>ઓર્ડર્સ:</b> <i>"કેટલા ઓર્ડર પેન્ડિંગ છે?"</i>' 
                : 'Here are questions you can ask me:<br>• <b>Total Dealers:</b> <i>"How many parties do we have?"</i><br>• <b>City Dealers:</b> <i>"Parties in Rajkot?"</i><br>• <b>Dealer Dues:</b> <i>"Mehta Traders balance?"</i><br>• <b>Orders:</b> <i>"How many pending orders?"</i>'}
        </div>
        <div style="margin-top:8px; display:flex; flex-wrap:wrap; gap:4px;">
            <button type="button" onclick="handleAIQuickPrompt('આપણી પાસે કેટલી પાર્ટી છે?')" style="font-size:11px; font-weight:700; background:#f1f5f9; color:#0e254f; border:1px solid #cbd5e1; padding:3px 7px; border-radius:12px; cursor:pointer;">
                👥 કેટલી પાર્ટી છે?
            </button>
            <button type="button" onclick="handleAIQuickPrompt('રાજકોટ માં કેટલી પાર્ટી ચાલુ છે?')" style="font-size:11px; font-weight:700; background:#f1f5f9; color:#0e254f; border:1px solid #cbd5e1; padding:3px 7px; border-radius:12px; cursor:pointer;">
                📍 રાજકોટ પાર્ટીઓ
            </button>
            <button type="button" onclick="handleAIQuickPrompt('કુલ બાકી ઉધારી કેટલી?')" style="font-size:11px; font-weight:700; background:#f1f5f9; color:#0e254f; border:1px solid #cbd5e1; padding:3px 7px; border-radius:12px; cursor:pointer;">
                💰 કુલ ઉધારી
            </button>
            <button type="button" onclick="handleAIQuickPrompt('કેટલા ઓર્ડર પેન્ડિંગ છે?')" style="font-size:11px; font-weight:700; background:#f1f5f9; color:#0e254f; border:1px solid #cbd5e1; padding:3px 7px; border-radius:12px; cursor:pointer;">
                📦 પેન્ડિંગ ઓર્ડર
            </button>
        </div>
    `;
    return { html, voiceText };
}

// Helper to jump to tab directly from assistant card
function jumpToTab(tabId) {
    const btn = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
    if (btn) btn.click();
}
window.jumpToTab = jumpToTab;

function jumpToMerchantLedger(merchId) {
    jumpToTab('ledger-tab');
    setTimeout(() => {
        const select = document.getElementById('ledger-merchant-select');
        if (select) {
            select.value = merchId;
            select.dispatchEvent(new Event('change'));
        }
    }, 250);
}
window.jumpToMerchantLedger = jumpToMerchantLedger;

window.initRabbitAIAssistant = initRabbitAIAssistant;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRabbitAIAssistant);
} else {
    initRabbitAIAssistant();
}
