/* ===================================================
   KİM BİR MİLYON VARİL İSTER? - OYUN MOTORU
   =================================================== */

// 1. Ödül Merdiveni (Aşağıdan yukarıya 1'den 12'ye)
const oilPrizeLadder = [
    { level: 1, val: "1.000", isMilestone: false },
    { level: 2, val: "2.000", isMilestone: true },   // 1. BARAJ
    { level: 3, val: "3.000", isMilestone: false },
    { level: 4, val: "5.000", isMilestone: false },
    { level: 5, val: "7.500", isMilestone: false },
    { level: 6, val: "10.000", isMilestone: false },
    { level: 7, val: "30.000", isMilestone: true },  // 2. BARAJ
    { level: 8, val: "50.000", isMilestone: false },
    { level: 9, val: "100.000", isMilestone: false },
    { level: 10, val: "200.000", isMilestone: false },
    { level: 11, val: "400.000", isMilestone: false },
    { level: 12, val: "1.000.000", isMilestone: true } // FİNAL
];

// 2. Çekirdek Soru Havuzu (Test İçin - Sonra büyüteceğiz)
const oilQuestionPool = {
    easy: [
        { q: "Hangi Orta Doğu ülkesinin bayrağında 'Sedir Ağacı' bulunur?", options: ["Suriye", "Ürdün", "Lübnan", "Filistin"], answer: "Lübnan" },
        { q: "Dünyanın en yüksek binası olan Burç Halife hangi şehirdedir?", options: ["Riyad", "Doha", "Abu Dabi", "Dubai"], answer: "Dubai" }
    ],
    medium: [
        { q: "1916'da Osmanlı'nın Orta Doğu topraklarını paylaşan gizli antlaşma hangisidir?", options: ["Sevr", "Balfour", "Sykes-Picot", "Lozan"], answer: "Sykes-Picot" },
        { q: "OPEC'in merkezi hangi Avrupa şehrindedir?", options: ["Cenevre", "Viyana", "Paris", "Brüksel"], answer: "Viyana" },
        { q: "Mısır ile İsrail arasında 1978'de imzalanan barış antlaşmasının adı nedir?", options: ["Camp David", "Oslo", "Madrid", "İbrahim"], answer: "Camp David" },
        { q: "Dünyanın en büyük sıvılaştırılmış doğal gaz (LNG) ihracatçılarından olan yarımada ülkesi?", options: ["Umman", "Bahreyn", "Katar", "Kuveyt"], answer: "Katar" },
        { q: "Kızıldeniz'i Akdeniz'e bağlayan stratejik su yolunun adı nedir?", options: ["Hürmüz Boğazı", "Süveyş Kanalı", "Cebelitarık", "Babulmendep"], answer: "Süveyş Kanalı" }
    ],
    hard: [
        { q: "1973 Petrol Krizi, hangi savaşın ardından Arap ülkelerinin ambargosuyla başlamıştır?", options: ["Altı Gün Savaşı", "Süveyş Krizi", "Birinci Körfez Savaşı", "Yom Kippur Savaşı"], answer: "Yom Kippur Savaşı" },
        { q: "Tarihte ticari amaçlı ilk petrol kuyusu nerede açılmıştır?", options: ["Teksas", "Suudi Arabistan", "Bakü", "İran"], answer: "Bakü" },
        { q: "Hürmüz Boğazı hangi iki su kütlesini birbirine bağlar?", options: ["Basra Körfezi - Umman Denizi", "Kızıldeniz - Akdeniz", "Aden Körfezi - Kızıldeniz", "Karadeniz - Hazar Denizi"], answer: "Basra Körfezi - Umman Denizi" },
        { q: "Suudi Arabistan'ın devlete ait devasa petrol ve doğalgaz şirketinin adı nedir?", options: ["Bapco", "Aramco", "KPC", "Sonatrach"], answer: "Aramco" },
        { q: "İran-Irak Savaşı hangi yıllar arasında gerçekleşmiştir?", options: ["1980-1988", "1990-1991", "1973-1979", "2003-2011"], answer: "1980-1988" }
    ]
};

// 3. Oyun Değişkenleri
let currentQuestionIndex = 0; // 0'dan 11'e kadar (12 soru)
let guaranteedPrize = "0";
let activeQuestions = []; // O anki oyun için rastgele seçilen 12 soru
let isAnswerLocked = false; // Tıklama spamini önlemek için

// 4. Oyunu Başlat
function startOilGame() {
    currentQuestionIndex = 0;
    guaranteedPrize = "0";
    isAnswerLocked = false;
    document.getElementById('oilCurrentPrize').innerText = "0 Varil";
    
    // Rastgele 12 soru seç (2 Kolay, 5 Orta, 5 Zor)
    activeQuestions = [
        ...shuffleArray([...oilQuestionPool.easy]).slice(0, 2),
        ...shuffleArray([...oilQuestionPool.medium]).slice(0, 5),
        ...shuffleArray([...oilQuestionPool.hard]).slice(0, 5)
    ];

    renderLadder();
    loadQuestion();
}

// 5. Merdiveni Çiz
function renderLadder() {
    const ladderUl = document.getElementById('oilLadderList');
    ladderUl.innerHTML = '';
    
    // Array'i ters çevirip basıyoruz ki 1M en üstte görünsün
    [...oilPrizeLadder].reverse().forEach((item) => {
        const li = document.createElement('li');
        li.className = `ladder-step ${item.isMilestone ? 'milestone' : ''}`;
        
        // Aktif Soru veya Geçilmiş Soru stilleri
        if (item.level === currentQuestionIndex + 1) li.classList.add('active');
        else if (item.level <= currentQuestionIndex) li.classList.add('passed');

        li.innerHTML = `<span class="step-num">${item.level}</span> <span class="step-val">${item.val} 🛢️</span>`;
        ladderUl.appendChild(li);
    });
}

// 6. Soruyu Ekrana Yükle
function loadQuestion() {
    if (currentQuestionIndex >= 12) return; // Oyun bitti

    isAnswerLocked = false;
    const qData = activeQuestions[currentQuestionIndex];
    document.getElementById('oilQuestionText').innerText = qData.q;

    // Şıkları karıştır
    const shuffledOptions = shuffleArray([...qData.options]);
    const letters = ["A", "B", "C", "D"];

    for (let i = 0; i < 4; i++) {
        const btn = document.getElementById(`opt-${i}`);
        btn.innerHTML = `<span class="opt-letter">${letters[i]}:</span> <span class="opt-text">${shuffledOptions[i]}</span>`;
        
        // Sınıfları ve satır içi stilleri tamamen sıfırla
        btn.className = "oil-option"; 
        
        // --- YENİ EKLENEN: Eski sorudan kalan renkleri temizle ---
        btn.style.background = "";
        btn.style.borderColor = "";
        btn.style.color = "";
        btn.style.visibility = "visible"; // İleride %50 jokeri için gerekecek
        // --------------------------------------------------------

        btn.disabled = false;
        
        // Tıklama olayı
        btn.onclick = () => checkOilAnswer(btn, shuffledOptions[i], qData.answer);
    }
}

// 7. Cevabı Kontrol Et
function checkOilAnswer(btn, selectedOption, correctAnswer) {
    if (isAnswerLocked) return;
    isAnswerLocked = true; // Kilitliyoruz, art arda basılamasın

    // Seçilen şıkkı sarı yap (Son kararınız mı hissi)
    btn.style.background = "#e67e22"; 
    btn.style.borderColor = "#e67e22";
    btn.style.color = "#fff";

    setTimeout(() => {
        if (selectedOption === correctAnswer) {
            // DOĞRU CEVAP
            btn.className = "oil-option correct";
            const wonPrize = oilPrizeLadder[currentQuestionIndex];
            
            // Baraj kontrolü
            if (wonPrize.isMilestone) guaranteedPrize = wonPrize.val;
            
            document.getElementById('oilCurrentPrize').innerText = wonPrize.val + " Varil";

            setTimeout(() => {
                currentQuestionIndex++;
                if (currentQuestionIndex < 12) {
                    renderLadder();
                    loadQuestion();
                } else {
                    oilGameOver(`Tebrikler! Orta Doğu'nun Yeni Petrol Baronu Sensin!\nTam 1.000.000 Varil Kazandın!`, true);
                }
            }, 1500);

        } else {
            // YANLIŞ CEVAP
            btn.className = "oil-option wrong";
            
            // Doğru cevabı bul ve yeşil yap
            for (let i = 0; i < 4; i++) {
                const optBtn = document.getElementById(`opt-${i}`);
                if (optBtn.innerText.includes(correctAnswer)) {
                    optBtn.className = "oil-option correct";
                }
            }

            setTimeout(() => {
                oilGameOver(`Yanlış Cevap!\nSondaj patladı. Garanti baraj ödülün ile dönüyorsun: ${guaranteedPrize} Varil.`, false);
            }, 2000);
        }
    }, 1500); // 1.5 saniye gerilim süresi
}

// Çekilme Butonu
document.getElementById('btnWithdraw')?.addEventListener('click', () => {
    if (currentQuestionIndex === 0) {
        oilGameOver("Henüz hiç petrol kazanamadın. Çekildin.", false);
    } else {
        const currentWon = oilPrizeLadder[currentQuestionIndex - 1].val;
        oilGameOver(`Çekilme kararı aldın.\nKasana giren net petrol: ${currentWon} Varil.`, true);
    }
});

// Oyun Bitiş Ekranı
function oilGameOver(message, isWin) {
    alert(message); // Şimdilik basit alert, sonra bunu çok şık bir Modal'a çevireceğiz
    // Oyunu kapat ana menüye dön
    document.getElementById('actualOilGame').classList.add('hidden');
    document.getElementById('quizMenu').classList.remove('hidden');
}

// Yardımcı Fonksiyon: Array Karıştırıcı
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
