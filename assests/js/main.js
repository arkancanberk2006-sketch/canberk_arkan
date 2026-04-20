document.addEventListener('DOMContentLoaded', () => {
    
    // 1. HAMBURGER MENÜ
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

    // 2. İLAÇ HATIRLATICI
    const medForm = document.getElementById('med-form');
    const medList = document.getElementById('med-list');
    const medNameInput = document.getElementById('med-name');
    const medTimeInput = document.getElementById('med-time');

    // Başlangıçta localStorage'dan verileri çek (Boşsa boş dizi yap)
    let medications = JSON.parse(localStorage.getItem('medications')) || [];

    // Listeyi ekrana basan fonksiyon
    function renderMedications() {
        if(!medList) return;
        medList.innerHTML = medications.length === 0 ? '<li class="med-item empty-state">Henüz eklenmiş bir ilaç yok.</li>' : '';
        
        medications.forEach((med, index) => {
            const li = document.createElement('li');
            li.className = "med-item";
            li.innerHTML = `
                <span><strong>${med.name}</strong> - Saat: ${med.time}</span>
                <button class="delete-btn" data-index="${index}">Sil</button>
            `;
            medList.appendChild(li);
        });
    }
    renderMedications();

    if (medForm) { 
        medForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            const newMed = {
                name: medNameInput.value,
                time: medTimeInput.value,
                notified: false 
            };
            medications.push(newMed);
            localStorage.setItem('medications', JSON.stringify(medications)); // Kaydet
            renderMedications();
            medForm.reset();
        });
    }

    // Silme işlemi için "Event Delegation"
    if(medList) {
        medList.addEventListener('click', (e) => {
            if(e.target.classList.contains('delete-btn')) {
                const index = e.target.getAttribute('data-index');
                medications.splice(index, 1);
                localStorage.setItem('medications', JSON.stringify(medications));
                renderMedications();
            }
        });
    }

    // 3. ZAMAN KONTROLÜ
    setInterval(() => {
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        medications.forEach(med => {
            if (med.time === currentTime && !med.notified) {
                alert(`⏰ HATIRLATMA: ${med.name} ilacınızı içme vaktiniz geldi!`);
                med.notified = true; 
                localStorage.setItem('medications', JSON.stringify(medications));
            }
        });
    }, 1000); 

    // 4. KARANLIK MOD
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

    // 5. 3D MODEL (Sadece project.html'de çalışır)
    if (container && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        // clientHeight 0 gelirse diye 400px fallback koyduk
        const height = container.clientHeight || 400; 
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(container.clientWidth, height);
        container.appendChild(renderer.domElement);

        const camera = new THREE.PerspectiveCamera(45, container.clientWidth / height, 0.1, 100);
        camera.position.z = 8;

        // Işıklar
        scene.add(new THREE.AmbientLight(0xffffff, 1));
        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(5, 5, 5);
        scene.add(dirLight);

        // Hap Grubu
        const pillGroup = new THREE.Group();
        const blueMat = new THREE.MeshStandardMaterial({ color: 0x3498db, roughness: 0.3 });
        const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });

        // Senin sphere/cylinder metodun yerine tek parça Capsule daha kolaydır ama mevcut yapını bozmadım:
        const top = new THREE.Mesh(new THREE.CapsuleGeometry(1, 1.5, 20, 20), blueMat);
        pillGroup.add(top); // Sadeleştirmek için CapsuleGeometry r130+ için daha iyidir

        pillGroup.rotation.z = Math.PI / 4;
        scene.add(pillGroup);

        // OrbitControls Kontrolü (Hata önleyici)
        let controls;
        if (typeof THREE.OrbitControls !== 'undefined') {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
        } else {
            // Eğer modül kullanıyorsan import ettiğin ismi kullanmalısın
            try {
                // Bu kısım Import Map kullanıyorsan çalışır
                // controls = new OrbitControls(camera, renderer.domElement); 
            } catch(e) { console.log("OrbitControls yüklenemedi."); }
        }

        function animate() {
            requestAnimationFrame(animate);
            pillGroup.rotation.y += 0.01;
            if(controls) controls.update();
            renderer.render(scene, camera);
        }
        animate();
    }
});
