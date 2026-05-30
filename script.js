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
    console.log("Çeviri motoru bekleniyor...");
    setTimeout(() => dilDegistir(dilKodu), 500);
  }
}

window.addEventListener("load", () => {
  const kaydedilenDil = localStorage.getItem("seciliDil");

  if (kaydedilenDil && kaydedilenDil !== "tr") {
    const motoruKontrolEt = setInterval(() => {
      const select = document.querySelector(".goog-te-combo");
      if (select) {
        dilDegistir(kaydedilenDil);
        clearInterval(motoruKontrolEt);
      }
    }, 500);

    setTimeout(() => clearInterval(motoruKontrolEt), 10000);
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

const aramaInput = document.getElementById("aramaInput");
const aramaKutusu = document.querySelector(".AramaKutusu");

const oneriListesi = document.createElement("div");
oneriListesi.className = "AramaOnerileri";
aramaKutusu.appendChild(oneriListesi);

aramaInput.addEventListener("input", function () {
  const kelime = this.value.toLowerCase();
  oneriListesi.innerHTML = "";

  if (kelime.length > 0) {
    const eşleşenler = sayfalar.filter((s) =>
      s.ad.toLowerCase().includes(kelime),
    );

    eşleşenler.forEach((s) => {
      const div = document.createElement("div");
      div.innerHTML = `<a href="${s.link}">${s.ad}</a>`;
      oneriListesi.appendChild(div);
    });
    oneriListesi.style.display = eşleşenler.length > 0 ? "block" : "none";
  } else {
    oneriListesi.style.display = "none";
  }
});

document.addEventListener("click", (e) => {
  if (!aramaKutusu.contains(e.target)) oneriListesi.style.display = "none";
});