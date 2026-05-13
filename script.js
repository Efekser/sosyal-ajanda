//-------------slider kodları
let sira = 0;
const resimler = document.querySelectorAll(".Resim");
const sayac = document.getElementById("sayac");
function guncelle() {
  resimler.forEach((img, index) =>
    img.classList.toggle("aktif", index === sira),
  );
  sayac.innerText = sira + 1 + " / " + resimler.length;
}
function degistir(adet) {
  sira = (sira + adet + resimler.length) % resimler.length;
  guncelle();
}

//----------dil kodları----------------
function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    {
      pageLanguage: "tr",
      includedLanguages: "en,ru,it,fr,de,tr",
      autoDisplay: false,
    },
    "google_translate_element",
  );
}

function dilDegistir(dilKodu) {
  localStorage.setItem("seciliDil", dilKodu);

  const select = document.querySelector(".goog-te-combo");
  if (select) {
    select.value = dilKodu;
    select.dispatchEvent(new Event("change"));
    document.documentElement.lang = dilKodu;
  } else {
    const mevcutURL = window.location.href;
    window.location.href = `https://translate.google.com/translate?sl=tr&tl=${dilKodu}&u=${encodeURIComponent(mevcutURL)}`;
  }
}

window.addEventListener("load", () => {
  const kaydedilenDil = localStorage.getItem("seciliDil");

  if (kaydedilenDil && kaydedilenDil !== "tr") {
    setTimeout(() => {
      const select = document.querySelector(".goog-te-combo");
      if (select) {
        select.value = kaydedilenDil;
        select.dispatchEvent(new Event("change"));
        document.documentElement.lang = kaydedilenDil;
      } else {
        if (!window.location.href.includes("translate.google.com")) {
          dilDegistir(kaydedilenDil);
        }
      }
    }, 1500);
  }
});

let dilZaman;
const kapsayici = document.querySelector(".DilMenuKapsayici");
const liste = document.querySelector(".DilListesi");

if (kapsayici && liste) {
  kapsayici.onmouseenter = () => {
    clearTimeout(dilZaman);
    liste.style.display = "block";
  };
  kapsayici.onmouseleave = () => {
    dilZaman = setTimeout(() => {
      liste.style.display = "none";
    }, 500);
  };
}

//-----------------Arama Butonu-------------
const sayfalar = [
    { ad: "Anasayfa", link: "index.html" },
    { ad: "Yardımcı Kurumlar", link: "kurumlar.html" },
    { ad: "Hakkımızda", link: "hakkimizda.html" },
    { ad: "İletişim", link: "iletisim.html" },
    { ad: "Başarı Hikayeleri", link: "hikayeler.html" },
    { ad: "Yasal Haklar", link: "haklar.html" },
];

const aramaInput = document.getElementById('aramaInput');
const aramaKutusu = document.querySelector('.AramaKutusu');

const oneriListesi = document.createElement('div');
oneriListesi.className = 'AramaOnerileri';
aramaKutusu.appendChild(oneriListesi);

aramaInput.addEventListener('input', function() {
    const kelime = this.value.toLowerCase();
    oneriListesi.innerHTML = '';
    
    if (kelime.length > 0) {
        const eşleşenler = sayfalar.filter(s => s.ad.toLowerCase().includes(kelime));
        
        eşleşenler.forEach(s => {
            const div = document.createElement('div');
            div.innerHTML = `<a href="${s.link}">${s.ad}</a>`;
            oneriListesi.appendChild(div);
        });
        oneriListesi.style.display = eşleşenler.length > 0 ? 'block' : 'none';
    } else {
        oneriListesi.style.display = 'none';
    }
});

document.addEventListener('click', (e) => {
    if (!aramaKutusu.contains(e.target)) oneriListesi.style.display = 'none';
});

  //-----------------AI--------------------------
const CHAT_CONFIG = {
    apiKey: "AIzaSyASHB5BbCST_pA-0FmNepDqa9nBCPLomf4",
    model: "gemini-1.5-flash-latest"
};

/* CHAT PENCERESİ KONTROLLERİ */
const chatToggle = document.getElementById('ai-chat-toggle');
const chatWindow = document.getElementById('ai-chat-window');
const chatClose = document.getElementById('ai-chat-close');
const sendBtn = document.getElementById('ai-send-btn');
const userInput = document.getElementById('ai-user-input');

if (chatToggle) {
    chatToggle.onclick = () => {
        chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
    };
}

if (chatClose) {
    chatClose.onclick = () => {
        chatWindow.style.display = 'none';
    };
}

/* MESAJ GÖNDERME FONKSİYONU */
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    appendMessage(message, 'user');
    userInput.value = '';

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${CHAT_CONFIG.model}:generateContent?key=${CHAT_CONFIG.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Sen Sosyal Ajanda portalının uzman asistanısın. 
                        SADECE Türkiye'deki sosyal hizmetler, yasal haklar, engelli/yaşlı/kadın hakları konularında bilgi ver. 
                        Cevapların kısa, nazik ve bilgilendirici olsun. 
                        Eğer konu sosyal hizmetler dışındaysa nazikçe reddet. Kullanıcı sorusu: ${message}`
                    }]
                }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            console.error("API Hatası:", data.error.message);
            appendMessage("Üzgünüm, şu an cevap veremiyorum. Lütfen sonra tekrar deneyin.", 'bot');
            return;
        }

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const aiText = data.candidates[0].content.parts[0].text;
            appendMessage(aiText, 'bot');
        } else {
            appendMessage("Bunu şu an yanıtlayamıyorum, lütfen farklı bir soru sorun.", 'bot');
        }

    } catch (error) {
        console.error("Bağlantı Hatası:", error);
        appendMessage("Sunucuyla bağlantı kurulamadı. İnternetini kontrol eder misin?", 'bot');
    }
}

/* MESAJLARI EKRANA EKLEME */
function appendMessage(text, side) {
    const chatBox = document.getElementById('ai-chat-messages');
    if (!chatBox) return;

    const div = document.createElement('div');
    div.className = `ai-message ${side}`;
    div.innerText = text;
    chatBox.appendChild(div);
    
    // Otomatik olarak en aşağı kaydır
    chatBox.scrollTop = chatBox.scrollHeight;
}

/* TETİKLEYİCİLER */
if (sendBtn) sendBtn.onclick = sendMessage;

if (userInput) {
    userInput.onkeypress = (e) => { 
        if (e.key === 'Enter') sendMessage(); 
    };
}