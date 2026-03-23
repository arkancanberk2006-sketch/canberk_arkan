document.addEventListener('DOMContentLoaded', () => {
    const medForm = document.getElementById('med-form');
    const medList = document.getElementById('med-list');
    const medNameInput = document.getElementById('med-name');
    const medTimeInput = document.getElementById('med-time');

    // İlaçları arka planda takip edebilmek için bir liste (dizi) oluşturuyoruz
    let medications = [];

    // Form gönderildiğinde çalışacak fonksiyon
    medForm.addEventListener('submit', function(e) {
        e.preventDefault(); 

        const medName = medNameInput.value;
        const medTime = medTimeInput.value;

        // İlacı takip listemize ekliyoruz (notified: false diyerek henüz uyarı vermediğimizi belirtiyoruz)
        const newMed = {
            name: medName,
            time: medTime,
            notified: false 
        };
        medications.push(newMed);

        // Ekrana (HTML'e) liste elemanını ekleme
        const li = document.createElement('li');
        li.innerHTML = `
            <span><strong>${medName}</strong> - Saat: ${medTime}</span>
            <button class="delete-btn">Sil</button>
        `;

        // Silme butonuna tıklama olayı
        li.querySelector('.delete-btn').addEventListener('click', function() {
            li.remove(); // Ekrandan sil
            // Arka plandaki takip listesinden de sil
            medications = medications.filter(med => med !== newMed);
        });

        medList.appendChild(li);

        // Formu temizle
        medNameInput.value = '';
        medTimeInput.value = '';
    });

    // --- YENİ: ZAMAN KONTROL SİSTEMİ ---
    
    // setInterval ile içerideki kodun her 1 saniyede bir (1000 milisaniye) çalışmasını sağlıyoruz
    setInterval(() => {
        // Şu anki bilgisayar saatini al
        const now = new Date();
        
        // Saati ve dakikayı alıp (Örn: 09:05) formattına getiriyoruz ki formdaki saatle eşleşsin
        const currentHours = now.getHours().toString().padStart(2, '0');
        const currentMinutes = now.getMinutes().toString().padStart(2, '0');
        const currentTime = `${currentHours}:${currentMinutes}`;

        // Takip listemizdeki tüm ilaçları tek tek kontrol et
        medications.forEach(med => {
            // Eğer şimdiki saat, ilacın saatine eşitse VE henüz uyarı vermediysek
            if (med.time === currentTime && !med.notified) {
                
                // Ekrana uyarı mesajı çıkar
                alert(`⏰ HATIRLATMA: ${med.name} ilacınızı içme vaktiniz geldi!`);
                
                // Uyarıyı verdiğimizi işaretliyoruz ki aynı dakika içinde 60 defa uyarı vermesin
                med.notified = true; 
            }
        });
    }, 1000); // 1000 ms = 1 saniye
});
