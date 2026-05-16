# Hap ve Zaman tasarufu 
# artık daha gelişmiş 
# web_portfolio_template
# web projesi yönetimi dersi
# bu uygulama ile hasta kişiler ilaçlarını unutmadan karıştırmadan hatırlayacak ve aksatmayacak
# gmail kontrolü yapıldı ve kullanıcı girişi hazır
# localstorage ile veri tutuldu
# final ödev = Kullanıcı Deneyimi Özellikleri
# API veya Dinamik Veri Kullanımı
# Veritabanı İşlemleri
# Projeyi Profesyonelleştirme
# 💊 MediHatırlat - İlaç Takip ve Hatırlatma Uygulaması

**MediHatırlat**, kullanıcıların günlük ilaç kullanımlarını düzenli bir şekilde takip edebilmeleri, zamanı geldiğinde bildirim alabilmeleri ve sağlıklı yaşam takviyelerini inceleyip favorilerine ekleyebilmeleri için tasarlanmış modern, etkileşimli ve tamamen mobil uyumlu bir web projesidir.

Bu proje, Web Tasarımı / Programlama dersi **Final Proje Ödevi** gereksinimleri doğrultusunda geliştirilmiştir.

---

## 🚀 Projede Yer Alan Ödev Gereksinimleri ve Özellikler

Bu proje, final ödevinde istenen tüm kriterleri tam olarak karşılamaktadır:

### 1. Kullanıcı Deneyimi (Arama ve Filtreleme)
* **Arama Kutusu:** "Tavsiye Edilen Takviyeler" bölümünde, kullanıcıların JSON verileri içinde anlık (keyup event) arama yapmasını sağlayan bir arama çubuğu bulunmaktadır.
* **Kategori Filtreleme:** Ürünleri "Ağrı Kesici", "Bağışıklık", "Kemik Sağlığı" gibi kategorilere göre anında ayrıştıran dinamik filtreleme butonları eklenmiştir.

### 2. API veya Dinamik Veri Kullanımı
* **JSON'dan Veri Çekme:** Projedeki ürün/ilaç verileri statik HTML olarak değil; Fetch API kullanılarak `data.json` dosyasından asenkron olarak çekilmekte ve JavaScript DOM manipülasyonu ile ekranda şık kartlar (`<div class="feature-card">`) halinde listelenmektedir.

### 3. Veritabanı ve Veri İşlemleri (Tarayıcı Tabanlı)
* **Veri Ekleme:** Ana sayfadaki form aracılığıyla kullanıcılar yeni ilaç adı ve saati ekleyebilir.
* **Veri Listeleme & Silme:** Eklenen bu veriler tarayıcının `LocalStorage` hafızasına kaydedilir ve anlık olarak ekranda listelenir. İstenilen veri listeden silinebilir.
* **Favorilere Ekleme:** JSON'dan çekilen dinamik kartların üzerindeki "Favorilere Ekle" butonu ile ürünler LocalStorage'a kaydedilip özel bir listede gösterilir.

### 4. Profesyonelleştirme ve Ekstra Özellikler
* **Kırık Link Kontrolü:** Sitedeki tüm göreceli yollar (`../`) ve menü geçişleri sorunsuz çalışacak şekilde yapılandırılmıştır.
* **Karanlık Mod (Dark Mode):** Kullanıcı tercihine göre arayüz karanlık veya aydınlık temaya geçirilebilir. Seçim LocalStorage'da tutulur.
* **3D Etkileşimli Model:** Sayfaya `Three.js` kütüphanesi entegre edilerek, fare veya dokunmatik ekranla kontrol edilebilen 3D bir hap modeli eklenmiştir.
* **Form Doğrulama:** İletişim sayfasında boş alan ve e-posta formatı kontrolleri yapan özel bir doğrulama algoritması yazılmıştır.
* **Responsive Tasarım:** CSS Flexbox ve Grid sistemleri kullanılmış, mobilde açılır kapanır Hamburger Menü yapısı kurulmuştur.

---

## 🛠️ Kullanılan Teknolojiler

* **HTML5:** Semantik web yapısı
* **CSS3:** Özelleştirilmiş tasarım, animasyonlar, Flexbox/Grid ve Media Queries
* **Vanilla JavaScript (ES6+):** DOM manipülasyonu, Event Dinleyicileri, Fetch API
* **Three.js:** WebGL tabanlı 3D modelleme
* **FontAwesome:** Vektörel ikonlar
* **LocalStorage API:** Tarayıcı tarafında veri kalıcılığı

---

## 📂 Dosya Yapısı

```text
proje-klasoru/
│
├── index.html            # Ana sayfa ve uygulama merkezi
├── pages/
│   ├── about.html        # Hakkımızda sayfası
│   ├── contact.html      # İletişim detayları ve form
│   └── project.html      # Proje detayları ve 3D model tanıtımı
│
├── assests/
│   ├── css/
│   │   └── style.css     # Tüm sitenin stil dosyası
│   ├── img/              # Ürün ve arka plan görselleri
│   └── js/
│       ├── data.json     # Ürünlerin bulunduğu veritabanı dosyası
│       └── main.js       # Tüm projenin beyni (mantık, filtre, 3d, fetch)
│
└── README.md             # Proje açıklama dosyası



