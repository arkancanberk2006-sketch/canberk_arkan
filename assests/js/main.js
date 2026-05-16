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
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 5;

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 2);
        scene.add(new THREE.AmbientLight(0xffffff, 0.5), light);

        const pill = new THREE.Group();
        const matTop = new THREE.MeshStandardMaterial({ color: 0x3498db });
        const matBottom = new THREE.MeshStandardMaterial({ color: 0xffffff });
        
        const meshTop = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2), matTop);
        const meshMid = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1), matTop);
        const meshBot = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), matBottom);
        
        meshTop.position.y = 0.5;
        meshBot.position.y = -0.5;
        pill.add(meshTop, meshMid, meshBot);
        scene.add(pill);

        let controls;
        if (THREE.OrbitControls) {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableZoom = false;
            controls.target.set(0, 0, 0);
            controls.update();
        }

        function onWindowResize() {
            const width = container.clientWidth;
            const height = container.clientHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        }

        window.addEventListener('resize', onWindowResize);

        function animate() {
            requestAnimationFrame(animate);
            pill.rotation.y += 0.01;
            pill.rotation.x += 0.005;
            
            if (controls) controls.update();
            renderer.render(scene, camera);
        }
        animate();
    }

    // 5. İLETİŞİM FORMU KONTROLÜ
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

            adHata.style.display = 'none';
            epostaHata.style.display = 'none';
            mesajHata.style.display = 'none';
            adSoyad.style.borderColor = '#ddd';
            eposta.style.borderColor = '#ddd';
            mesaj.style.borderColor = '#ddd';
            formMesaj.style.display = 'none';

            if (adSoyad.value.trim() === '') {
                adHata.style.display = 'block';
                adSoyad.style.borderColor = '#e74c3c';
                formGecerliMi = false;
            }

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

            if (mesaj.value.trim() === '') {
                mesajHata.style.display = 'block';
                mesaj.style.borderColor = '#e74c3c';
                formGecerliMi = false;
            }

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

    // 6. JSON VERİ ÇEKME, ARAMA, FİLTRELEME VE FAVORİLER
    const productContainer = document.getElementById('product-container');
    const favoriteList = document.getElementById('favorite-list');

    if (productContainer && favoriteList) {
        let favorites = JSON.parse(localStorage.getItem('favoriteMeds')) || [];

        function renderFavorites() {
            favoriteList.innerHTML = favorites.length === 0 
                ? '<li class="med-item empty-state">Henüz favori eklenmedi.</li>' 
                : '';
            
            favorites.forEach((fav, index) => {
                const li = document.createElement('li');
                li.className = 'med-item';
                li.innerHTML = `
                    <span><strong>${fav.isim}</strong> - ${fav.kategori} (${fav.fiyat} TL)</span>
                    <button class="delete-btn" onclick="removeFavorite(${index})">Kaldır</button>
                `;
                favoriteList.appendChild(li);
            });
        }

        window.removeFavorite = (index) => {
            favorites.splice(index, 1);
            localStorage.setItem('favoriteMeds', JSON.stringify(favorites));
            renderFavorites();
        };

        // Yol hatasını engelleyen dinamik prefix
        const prefix = window.location.pathname.includes('/pages/') ? '../' : '';

        fetch(prefix + 'assests/js/data.json')
            .then(response => {
                if (!response.ok) throw new Error('Veri çekilemedi!');
                return response.json();
            })
            .then(data => {
                let allProducts = data;
                
                // Kartları Ekrana Basan Fonksiyon
                function displayProducts(productsToDisplay) {
                    productContainer.innerHTML = '';
                    
                    if (productsToDisplay.length === 0) {
                        productContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #7f8c8d;">Aradığınız kriterde ürün bulunamadı.</p>';
                        return;
                    }

                    productsToDisplay.forEach(product => {
                        const card = document.createElement('div');
                        card.className = 'feature-card product-card';
                        card.innerHTML = `
                            <img src="${prefix + (product.resim || 'https://via.placeholder.com/150')}" alt="${product.isim}" style="width:100%; height:150px; object-fit:cover; border-radius:8px; margin-bottom:10px;">
                            <h3>${product.isim}</h3>
                            <p class="product-category" style="color:#7f8c8d; font-size:0.9rem;">${product.kategori}</p>
                            <p style="font-size:1.2rem; color:#2c3e50;"><strong>${product.fiyat} TL</strong></p>
                            <button class="btn-primary btn-fav" style="margin-top: 15px; padding: 10px; width: 100%; border:none; cursor:pointer;">
                                <i class="fa-solid fa-heart"></i> Favorilere Ekle
                            </button>
                        `;
                        
                        const favBtn = card.querySelector('.btn-fav');
                        favBtn.addEventListener('click', () => {
                            const isExist = favorites.some(fav => fav.id === product.id);
                            if (!isExist) {
                                favorites.push(product);
                                localStorage.setItem('favoriteMeds', JSON.stringify(favorites));
                                renderFavorites();
                                alert(`${product.isim} favorilere eklendi!`);
                            } else {
                                alert('Bu ürün zaten favorilerinizde!');
                            }
                        });
    
                        productContainer.appendChild(card);
                    });
                }

                // Sayfa ilk açıldığında tüm veriyi göster
                displayProducts(allProducts);

                // --- ARAMA ÖZELLİĞİ ---
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.addEventListener('keyup', (e) => {
                        const searchTerm = e.target.value.toLowerCase();
                        const filteredProducts = allProducts.filter(product => 
                            product.isim.toLowerCase().includes(searchTerm) || 
                            product.kategori.toLowerCase().includes(searchTerm)
                        );
                        displayProducts(filteredProducts);
                    });
                }

                // --- KATEGORİ FİLTRELEME ---
                const filterBtns = document.querySelectorAll('.filter-btn');
                filterBtns.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        filterBtns.forEach(b => {
                            b.classList.remove('active');
                            b.style.background = 'transparent';
                            b.style.color = '#3498db';
                        });
                        e.target.classList.add('active');
                        e.target.style.background = '#3498db';
                        e.target.style.color = 'white';

                        const filterValue = e.target.getAttribute('data-filter');
                        if (filterValue === 'all') {
                            displayProducts(allProducts);
                        } else {
                            const filteredProducts = allProducts.filter(product => product.kategori === filterValue);
                            displayProducts(filteredProducts);
                        }
                    });
                });

            })
            .catch(error => {
                console.error('Fetch Hatası:', error);
                productContainer.innerHTML = `<p style="color:red; text-align:center; grid-column: 1 / -1;">Veriler yüklenemedi. Lütfen projeyi bir sunucu üzerinden (Live Server vb.) çalıştırın.</p>`;
            });

        renderFavorites();
    }

    // 7. GÜNÜN İPUCU SİSTEMİ
    const tips = [
        "İlaçlarınızı her gün aynı saatte alarak etkinliğini artırabilirsiniz.",
        "Bol su içmek, vücudunuzun ilaçları daha iyi işlemesine yardımcı olur.",
        "İlaçlarınızı doğrudan güneş ışığı almayan, serin ve kuru bir yerde saklayın.",
        "Doktorunuza danışmadan ilaç dozunuzu asla değiştirmeyin.",
        "Günde en az 7-8 saat uyumak bağışıklık sisteminizi güçlendirir.",
        "Düzenli yürüyüş yapmak kalp sağlığınızı korumanıza yardımcı olur.",
        "Meyve ve sebze ağırlıklı beslenmek doğal vitamin kaynağıdır."
    ];

    const tipElement = document.getElementById('daily-tip');
    if (tipElement) {
        const randomIndex = Math.floor(Math.random() * tips.length);
        tipElement.textContent = tips[randomIndex];
    }
    
});
