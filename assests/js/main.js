document.addEventListener('DOMContentLoaded', () => {
    
    // 1. HAMBURGER MENÜ
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    if (hamburger && navMenu) { 
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });
    }

    // 2. İLAÇ HATIRLATICI (LOCALSTORAGE DESTEKLİ)
    const medForm = document.getElementById('med-form');
    const medList = document.getElementById('med-list');
    
    // Kayıtlı ilaçları yükle
    let medications = JSON.parse(localStorage.getItem('medications')) || [];

    function renderMeds() {
        if (!medList) return;
        medList.innerHTML = medications.length === 0 
            ? '<li class="med-item empty-state">Henüz eklenmiş bir ilaç yok.</li>' 
            : '';

        medications.forEach((med, index) => {
            const li = document.createElement('li');
            li.className = 'med-item';
            li.innerHTML = `
                <span><strong>${med.name}</strong> - Saat: ${med.time}</span>
                <button class="delete-btn" onclick="deleteMed(${index})">Sil</button>
            `;
            medList.appendChild(li);
        });
    }

    window.deleteMed = (index) => {
        medications.splice(index, 1);
        localStorage.setItem('medications', JSON.stringify(medications));
        renderMeds();
    };

    if (medForm) {
        medForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newMed = {
                name: document.getElementById('med-name').value,
                time: document.getElementById('med-time').value,
                notified: false
            };
            medications.push(newMed);
            localStorage.setItem('medications', JSON.stringify(medications));
            renderMeds();
            medForm.reset();
        });
    }
    renderMeds();

    // Zaman Kontrolü
    setInterval(() => {
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        medications.forEach(med => {
            if (med.time === currentTime && !med.notified) {
                alert(`⏰ HATIRLATMA: ${med.name} vaktiniz geldi!`);
                med.notified = true;
                localStorage.setItem('medications', JSON.stringify(medications));
            }
            // Dakika geçince bildirimi bir sonraki döngü için sıfırla
            if (med.time !== currentTime) { med.notified = false; }
        });
    }, 1000);

    // 3. DARK MODE
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
            darkModeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }

        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            darkModeToggle.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        });
    }

    // 4. 3D MODEL SİSTEMİ
    const container = document.getElementById('canvas-container');
    if (container && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 5;

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 2);
        scene.add(new THREE.AmbientLight(0xffffff, 0.5), light);

        const pill = new THREE.Group();
        const geometry = new THREE.CapsuleGeometry(0.8, 1.5, 10, 20);
        const matTop = new THREE.MeshStandardMaterial({ color: 0x3498db });
        const matBottom = new THREE.MeshStandardMaterial({ color: 0xffffff });
        
        // Basit bir hap görünümü için iki parça
        const meshTop = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2), matTop);
        const meshMid = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1), matTop);
        const meshBot = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), matBottom);
        
        meshTop.position.y = 0.5;
        meshBot.position.y = -0.5;
        pill.add(meshTop, meshMid, meshBot);
        scene.add(pill);

        if (THREE.OrbitControls) {
            const controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableZoom = false;
        }

        function animate() {
            requestAnimationFrame(animate);
            pill.rotation.y += 0.01;
            pill.rotation.x += 0.005;
            renderer.render(scene, camera);
        }
        animate();
    }

    // 5. İLETİŞİM FORMU KONTROLÜ (27 NİSAN GÖREVİ)
    const form = document.getElementById('iletisimFormu');

    if(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); 

            const adSoyad = document.getElementById('adSoyad');
            const eposta = document.getElementById('eposta');
            const mesaj = document.getElementById('mesaj');
            const formMesaj = document.getElementById('formMesaj');

            const adHata = document.getElementById('adHata');
            const epostaHata = document.getElementById('epostaHata');
            const mesajHata = document.getElementById('mesajHata');

            let formGecerliMi = true;

            // Hataları sıfırla
            adHata.style.display = 'none';
            epostaHata.style.display = 'none';
            mesajHata.style.display = 'none';
            adSoyad.style.borderColor = '#ddd';
            eposta.style.borderColor = '#ddd';
            mesaj.style.borderColor = '#ddd';
            formMesaj.style.display = 'none';

            // Ad Soyad Kontrolü
            if (adSoyad.value.trim() === '') {
                adHata.style.display = 'block';
                adSoyad.style.borderColor = '#e74c3c';
                formGecerliMi = false;
            }

            // E-posta Kontrolü
            const epostaFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
            if (eposta.value.trim() === '') {
                epostaHata.textContent = 'Lütfen e-posta adresinizi boş bırakmayın.';
                epostaHata.style.display = 'block';
                eposta.style.borderColor = '#e74c3c';
                formGecerliMi = false;
            } else if (!epostaFormat.test(eposta.value.trim())) {
                epostaHata.textContent = 'Geçersiz format! Örn: ornek@mail.com';
                epostaHata.style.display = 'block';
                eposta.style.borderColor = '#e74c3c';
                formGecerliMi = false;
            }

            // Mesaj Kontrolü
            if (mesaj.value.trim() === '') {
                mesajHata.style.display = 'block';
                mesaj.style.borderColor = '#e74c3c';
                formGecerliMi = false;
            }

            // Başarılı Gönderim
            if (formGecerliMi) {
                formMesaj.textContent = 'İşlem Başarılı! Mesajınız bize ulaştı.';
                formMesaj.style.display = 'block';
                formMesaj.style.backgroundColor = '#d4edda';
                formMesaj.style.color = '#155724';
                formMesaj.style.border = '1px solid #c3e6cb';

                form.reset();

                setTimeout(() => {
                    formMesaj.style.display = 'none';
                }, 5000);
            }
        });
    }
});
