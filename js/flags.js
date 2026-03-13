const flagData = [
    { name: "Türkiye", code: "tr" }, { name: "İran", code: "ir" }, { name: "Irak", code: "iq" },
    { name: "Suriye", code: "sy" }, { name: "Lübnan", code: "lb" }, { name: "İsrail", code: "il" },
    { name: "Filistin", code: "ps" }, { name: "Ürdün", code: "jo" }, { name: "Mısır", code: "eg" },
    { name: "Suudi Arabistan", code: "sa" }, { name: "Birleşik Arap Emirlikleri", code: "ae" },
    { name: "Katar", code: "qa" }, { name: "Kuveyt", code: "kw" }, { name: "Umman", code: "om" },
    { name: "Bahreyn", code: "bh" }, { name: "Yemen", code: "ye" }, { name: "Amerika", code: "us" },
    { name: "Rusya", code: "ru" }
];

let currentFlags = [];
let currentIndex = 0;
let flagTimerInterval;
let flagStartTime;

function startFlagGame() {
    // Bayrakları karıştır (Shuffle)
    currentFlags = [...flagData].sort(() => Math.random() - 0.5);
    currentIndex = 0;
    
    // Kronometreyi başlat
    flagStartTime = Date.now();
    updateFlagTimer();
    clearInterval(flagTimerInterval);
    flagTimerInterval = setInterval(updateFlagTimer, 1000);
    
    showNextFlag();
}

function updateFlagTimer() {
    const diff = Math.floor((Date.now() - flagStartTime) / 1000);
    const m = Math.floor(diff / 60).toString().padStart(2, '0');
    const s = (diff % 60).toString().padStart(2, '0');
    const timerElem = document.getElementById('flagTimer');
    if(timerElem) timerElem.innerText = `${m}:${s}`;
}

function showNextFlag() {
    if (currentIndex >= currentFlags.length) {
        finishFlagGame();
        return;
    }
    const country = currentFlags[currentIndex];
    const imgElem = document.getElementById('currentFlagImg');
    const inputElem = document.getElementById('flagInput');
    const progressElem = document.getElementById('flagProgress');

    if(imgElem) imgElem.src = `https://flagcdn.com/w640/${country.code}.png`;
    if(inputElem) {
        inputElem.value = "";
        inputElem.style.borderColor = "#333";
        inputElem.focus();
    }
    if(progressElem) progressElem.innerText = `KALAN ÜLKE: ${currentFlags.length - currentIndex}/${currentFlags.length}`;
}

function checkFlagAnswer() {
    const input = document.getElementById('flagInput');
    if(!input) return;
    
    // Kullanıcının yazdığını Türkçe karakterlere duyarlı şekilde küçült
    const userGuess = input.value.trim().toLocaleLowerCase('tr-TR');
    
    // Doğru cevabı da Türkçe karakterlere duyarlı şekilde küçült
    const correctAnswer = currentFlags[currentIndex].name.toLocaleLowerCase('tr-TR');

    console.log("Tahmin:", userGuess, "Doğru Cevap:", correctAnswer); // Kontrol için

    if (userGuess === correctAnswer) {
        currentIndex++;
        showNextFlag();
    } else {
        // Yanlış bilirse giriş yerini kırmızı yap
        input.style.borderColor = "#e74c3c";
        input.style.boxShadow = "0 0 10px rgba(231, 76, 60, 0.5)";
        setTimeout(() => { 
            input.style.borderColor = "#333"; 
            input.style.boxShadow = "none";
        }, 500);
    }
}

function finishFlagGame() {
    clearInterval(flagTimerInterval);
    const finalTime = document.getElementById('flagTimer').innerText;
    alert(`Tebrikler Orta Doğu Profesörü! 🎉\nTüm bayrakları ${finalTime} sürede hatasız bildin.`);
    
    // Menüye geri dön
    document.getElementById('actualFlagGame').classList.add('hidden');
    document.getElementById('quizMenu').classList.remove('hidden');
}

// Buton ve Klavye Dinleyicileri
document.addEventListener('click', function(e) {
    if (e.target.id === 'btnSubmitFlag') checkFlagAnswer();
    
    if (e.target.id === 'btnSkipFlag') {
        // Geç butonuna basınca ülkeyi sona at
        const skipped = currentFlags.splice(currentIndex, 1)[0];
        currentFlags.push(skipped);
        showNextFlag();
    }
    
    if (e.target.closest('#btnCloseFlagGame')) {
        clearInterval(flagTimerInterval);
        document.getElementById('actualFlagGame').classList.add('hidden');
        document.getElementById('quizMenu').classList.remove('hidden');
    }
});

document.getElementById('flagInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkFlagAnswer();
});
