document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. HAMBURGER MENÜ İŞLEMLERİ
    // ==========================================
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    if (hamburger && navMenu) { 
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        document.querySelectorAll(".nav-link").forEach(link => 
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navMenu.classList.remove("active");
            })
        );
    }

    // ==========================================
    // 2. İLAÇ HATIRLATICI İŞLEMLERİ
    // ==========================================
    const medForm = document.getElementById('med-form');
    const medList = document.getElementById('med-list');
    const medNameInput = document.getElementById('med-name');
    const medTimeInput = document.getElementById('med-time');

    let medications = [];

    if (medForm) { 
        medForm.addEventListener('submit', function(e) {
            e.preventDefault(); 

            const medName = medNameInput.value;
            const medTime = medTimeInput.value;

            const newMed = {
                name: medName,
                time: medTime,
                notified: false 
            };
            medications.push(newMed);

            const li = document.createElement('li');
            li.innerHTML = `
                <span><strong>${medName}</strong> - Saat: ${medTime}</span>
                <button class="delete-btn">Sil</button>
            `;

            li.querySelector('.delete-btn').addEventListener('click', function() {
                li.remove(); 
                medications = medications.filter(med => med !== newMed);
            });

            medList.appendChild(li);

            medNameInput.value = '';
            medTimeInput.value = '';
        });
    }

    // --- ZAMAN KONTROL SİSTEMİ ---
    setInterval(() => {
        const now = new Date();
        const currentHours = now.getHours().toString().padStart(2, '0');
        const currentMinutes = now.getMinutes().toString().padStart(2, '0');
        const currentTime = `${currentHours}:${currentMinutes}`;

        medications.forEach(med => {
            if (med.time === currentTime && !med.notified) {
                alert(`⏰ HATIRLATMA: ${med.name} ilacınızı içme vaktiniz geldi!`);
                med.notified = true; 
            }
        });
    }, 1000); 

    // ==========================================
    // 3. KARANLIK MOD (DARK MODE) İŞLEMLERİ
    // ==========================================
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;

    // 1. Kullanıcının önceki tercihini LocalStorage'dan al
    const currentTheme = localStorage.getItem('theme');
    
    // Eğer önceden karanlık modu seçmişse, sayfaya uygula ve ikonu Güneş yap
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        if (darkModeToggle) {
            darkModeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }
    }

    // 2. Butona Tıklama Olayı
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            // Body etiketine dark-mode sınıfını ekle veya çıkar (toggle)
            body.classList.toggle('dark-mode');
            
            // Eğer sınıf eklendiyse (Karanlık Mod aktifse)
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark'); // Hafızaya kaydet
                darkModeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>'; // İkonu Güneş'e çevir
            } 
            // Eğer sınıf çıkarıldıysa (Aydınlık Mod aktifse)
            else {
                localStorage.setItem('theme', 'light'); // Hafızaya kaydet
                darkModeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>'; // İkonu Ay'a çevir
            }
        });
    }
// ==========================================
    // 4. ETKİLEŞİMLİ 3D HAP MODELİ İŞLEMLERİ
    // ==========================================
    const container = document.getElementById('canvas-container');

    // Eğer sayfada 'canvas-container' varsa (Yani project.html sayfasındaysak) bu kodları çalıştır
    if (container && typeof THREE !== 'undefined') {
        
        // 1. Sahne (Scene), Kamera (Camera) ve İşleyici (Renderer) Kurulumu
        const scene = new THREE.Scene();
        
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
        camera.position.z = 10;

        // 2. Işıklandırma
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); 
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); 
        directionalLight.position.set(5, 10, 7);
        scene.add(directionalLight);

        // 3. Hap (Kapsül) Modelini Oluşturma
        const pillGroup = new THREE.Group();

        // Mavi Üst Kısım
        const blueMaterial = new THREE.MeshStandardMaterial({ color: 0x3498db, roughness: 0.3, metalness: 0.1 }); 
        const topCylinder = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1.5, 32), blueMaterial);
        topCylinder.position.y = 0.75;
        const topSphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), blueMaterial);
        topSphere.position.y = 1.5; 

        // Beyaz Alt Kısım
        const whiteMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.1 });
        const bottomCylinder = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1.5, 32), whiteMaterial);
        bottomCylinder.position.y = -0.75;
        const bottomSphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), whiteMaterial);
        bottomSphere.position.y = -1.5; 

        pillGroup.add(topCylinder, topSphere, bottomCylinder, bottomSphere);
        
        pillGroup.rotation.z = Math.PI / 4; 
        pillGroup.rotation.x = Math.PI / 6;
        scene.add(pillGroup);

        // 4. Fare ile Döndürme Kontrolleri
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; 
        controls.dampingFactor = 0.05;
        controls.enableZoom = false; 
        controls.autoRotate = true; 
        controls.autoRotateSpeed = 2.0;

        // 5. Animasyon Döngüsü
        function animate() {
            requestAnimationFrame(animate);
            controls.update(); 
            renderer.render(scene, camera);
        }
        animate();

        // 6. Ekran Boyutu Değiştiğinde Kamerayı Güncelle
        window.addEventListener('resize', () => {
            if(container.clientWidth > 0) {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            }
        });
    }
});
