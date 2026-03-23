
document.addEventListener('DOMContentLoaded', () => {
    const medForm = document.getElementById('med-form');
    const medList = document.getElementById('med-list');
    const medNameInput = document.getElementById('med-name');
    const medTimeInput = document.getElementById('med-time');

    // Form gönderildiğinde çalışacak fonksiyon
    medForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Sayfanın yenilenmesini engeller

        const medName = medNameInput.value;
        const medTime = medTimeInput.value;

        // Yeni liste elemanı oluştur
        const li = document.createElement('li');
        li.innerHTML = `
            <span><strong>${medName}</strong> - Saat: ${medTime}</span>
            <button class="delete-btn">Sil</button>
        `;

        // Silme butonuna tıklama olayı ekle
        li.querySelector('.delete-btn').addEventListener('click', function() {
            li.remove();
        });

        // Listeye ekle
        medList.appendChild(li);

        // Formu temizle
        medNameInput.value = '';
        medTimeInput.value = '';
    });
});
