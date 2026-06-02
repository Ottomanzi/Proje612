// --- ÜRÜN VERİTABANI ---
const productsData = [
    { id: 1, title: "Apple iPhone 15 Pro Max 256 GB", category: "telefon", desc: "Titanyum tasarım, A17 Pro çip, 48 MP kamera sistemi ve süper hızlı 5G.", price: 76999, oldPrice: 82999, rating: 4.9, discount: "%7 İndirim", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=60" },
    { id: 2, title: "Asus ROG Strix G16 Gaming Laptop", category: "bilgisayar", desc: "Intel Core i7 13. Nesil, 16GB RAM, 512GB SSD, RTX 4060 Ekran Kartı.", price: 43499, oldPrice: 47999, rating: 4.8, discount: "%9 Fırsat", image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop&q=60" },
    { id: 3, title: "Samsung Galaxy Tab S9 Ultra", category: "tablet", desc: "14.6 inç Dynamic AMOLED 2X ekran, Snapdragon 8 Gen 2, S-Pen kalemi dahil.", price: 31200, oldPrice: 34500, rating: 4.7, discount: "%10 İndirim", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=60" },
    { id: 4, title: "Sony WH-1000XM5 Kulaklık", category: "ses", desc: "Sektör lideri gürültü engelleme, 30 saat pil ömrü, yüksek çözünürlüklü ses.", price: 12499, oldPrice: 14999, rating: 5.0, discount: "%16 Fırsat", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60" },
    { id: 5, title: "Apple MacBook Air M3", category: "bilgisayar", desc: "8GB RAM, 256GB SSD, 13.6 inç Liquid Retina Ekran, Uzay Grisi.", price: 45999, oldPrice: 49999, rating: 4.9, discount: "%8 İndirim", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60" },
    { id: 6, title: "Xiaomi Redmi Watch 4", category: "aksesuar", desc: "1.97 inç AMOLED ekran, GPS, Bluetooth çağrı desteği, 20 gün pil ömrü.", price: 3299, oldPrice: 3899, rating: 4.5, discount: "%15 İndirim", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60" },
    { id: 7, title: "Jardis TPA3116D2 Amfi", category: "aksesuar", desc: "2x100W çift kanal güçlü dijital ses yükseltici kartı, DIY projeleri için.", price: 850, oldPrice: 1100, rating: 4.6, discount: "%22 Fırsat", image: "https://images.unsplash.com/photo-1608248597481-496100c8c836?w=500&auto=format&fit=crop&q=60" },
    { id: 8, title: "Anker PowerCore 24K Powerbank", category: "aksesuar", desc: "24.000 mAh kapasite, 140W hızlı Type-C şarj, dijital ekranlı.", price: 2999, oldPrice: 3499, rating: 4.8, discount: "%14 İndirim", image: "https://images.unsplash.com/photo-1609592424209-32868ff97eb8?w=500&auto=format&fit=crop&q=60" }
];

// --- STATE VE SEÇİCİLER ---
let cart = []; let favorites = []; let currentCategory = "all"; let searchQuery = "";
const productsGrid = document.getElementById('productsGrid');

// --- LOADER KONTROL ---
window.addEventListener('load', () => {
    setTimeout(() => { document.getElementById('preloader').classList.add('fade-out'); }, 500);
    renderProducts();
});

// --- TOAST BİLDİRİM SİSTEMİ ---
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    let icon = type === 'success' ? '<i class="fa-solid fa-circle-check"></i>' : (type === 'danger' ? '<i class="fa-solid fa-triangle-exclamation"></i>' : '<i class="fa-solid fa-circle-info"></i>');
    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.animation = 'slideIn 0.3s ease reverse forwards'; setTimeout(() => toast.remove(), 300); }, 3000);
}

// --- ÜRÜNLERİ EKRANA BASMA (Filtre ve Sıralama Dahil) ---
function renderProducts() {
    let filtered = productsData.filter(p => (currentCategory === 'all' || p.category === currentCategory) && (p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.desc.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const sortVal = document.getElementById('sortSelect').value;
    if (sortVal === 'price-asc') filtered.sort((a,b) => a.price - b.price);
    else if (sortVal === 'price-desc') filtered.sort((a,b) => b.price - a.price);
    else if (sortVal === 'rating-desc') filtered.sort((a,b) => b.rating - a.rating);

    document.getElementById('productCountText').innerText = `${filtered.length} ürün bulundu`;
    productsGrid.innerHTML = '';
    
    if (filtered.length === 0) {
        document.getElementById('noProductsFound').style.display = 'block';
    } else {
        document.getElementById('noProductsFound').style.display = 'none';
        filtered.forEach(product => {
            const isFav = favorites.includes(product.id);
            let stars = ''; for(let i=0; i<5; i++) stars += i < Math.floor(product.rating) ? '<i class="fa-solid fa-star"></i>' : (product.rating%1!==0 && i===Math.floor(product.rating) ? '<i class="fa-solid fa-star-half-stroke"></i>' : '<i class="fa-regular fa-star"></i>');
            
            productsGrid.innerHTML += `
                <div class="product-card">
                    <span class="badge-discount">${product.discount}</span>
                    <button class="fav-add-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite(${product.id})"><i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i></button>
                    <div class="product-img-box" onclick="openProductModal(${product.id})"><img src="${product.image}"></div>
                    <div class="product-details">
                        <h3 class="product-title-text" onclick="openProductModal(${product.id})">${product.title}</h3>
                        <p class="product-desc-short">${product.desc}</p>
                        <div class="rating-row">${stars} <span>(${product.rating})</span></div>
                        <div class="price-row">
                            <div><span class="old-price">${product.oldPrice.toLocaleString('tr-TR')} TL</span><span class="current-price">${product.price.toLocaleString('tr-TR')} TL</span></div>
                            <button class="add-cart-btn" onclick="addToCart(${product.id})">Sepete Ekle</button>
                        </div>
                    </div>
                </div>`;
        });
    }
}

// --- ARAMA, FİLTRE VE KATEGORİ ---
document.getElementById('searchInput').addEventListener('input', (e) => { searchQuery = e.target.value; renderProducts(); });
document.getElementById('searchButton').addEventListener('click', () => { searchQuery = document.getElementById('searchInput').value; renderProducts(); });
document.getElementById('sortSelect').addEventListener('change', renderProducts);
document.getElementById('resetSearchBtn').addEventListener('click', () => { document.getElementById('searchInput').value = ''; searchQuery = ''; currentCategory='all'; renderProducts(); });

document.querySelectorAll('.nav-link, .footer-cat-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); currentCategory = link.getAttribute('data-category');
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const targetNav = document.querySelector(`.nav-links [data-category="${currentCategory}"]`);
        if(targetNav) targetNav.classList.add('active');
        renderProducts(); window.scrollTo({ top: productsGrid.offsetTop - 140, behavior: 'smooth' });
    });
});

// --- SEPET İŞLEMLERİ ---
function addToCart(id) {
    const product = productsData.find(p => p.id === id);
    const item = cart.find(i => i.product.id === id);
    item ? item.quantity++ : cart.push({ product, quantity: 1 });
    updateCartUI(); showToast(`${product.title} sepete eklendi.`);
}
function changeQty(id, delta) {
    const item = cart.find(i => i.product.id === id);
    if(item) { item.quantity += delta; if(item.quantity <= 0) cart = cart.filter(i => i.product.id !== id); updateCartUI(); }
}
function updateCartUI() {
    document.getElementById('cartBadge').innerText = cart.reduce((acc, curr) => acc + curr.quantity, 0);
    const container = document.getElementById('cartItemsContainer'); container.innerHTML = '';
    let total = 0;
    if(cart.length === 0) container.innerHTML = '<p style="text-align:center; color:var(--text-muted); margin-top:30px;">Sepetiniz boş.</p>';
    else {
        cart.forEach(item => {
            total += item.product.price * item.quantity;
            container.innerHTML += `
                <div class="sidebar-item">
                    <img src="${item.product.image}">
                    <div class="item-info"><h4>${item.product.title}</h4><span style="font-weight:700;">${(item.product.price * item.quantity).toLocaleString('tr-TR')} TL</span>
                        <div class="qty-controls"><button class="qty-btn" onclick="changeQty(${item.product.id}, -1)">-</button><span>${item.quantity}</span><button class="qty-btn" onclick="changeQty(${item.product.id}, 1)">+</button></div>
                    </div>
                    <button class="remove-item-btn" onclick="changeQty(${item.product.id}, -99)"><i class="fa-solid fa-trash-can"></i></button>
                </div>`;
        });
    }
    document.getElementById('cartTotal').innerText = `${total.toLocaleString('tr-TR')} TL`;
}

// --- FAVORİ İŞLEMLERİ ---
function toggleFavorite(id) {
    const idx = favorites.indexOf(id);
    if(idx > -1) { favorites.splice(idx, 1); showToast('Favorilerden çıkarıldı.', 'info'); }
    else { favorites.push(id); showToast('Favorilere eklendi.', 'success'); }
    document.getElementById('favBadge').innerText = favorites.length;
    updateFavUI(); renderProducts();
}
function updateFavUI() {
    const container = document.getElementById('favItemsContainer'); container.innerHTML = '';
    if(favorites.length === 0) container.innerHTML = '<p style="text-align:center; color:var(--text-muted); margin-top:30px;">Favoriniz yok.</p>';
    else favorites.forEach(id => {
        const p = productsData.find(x => x.id === id);
        container.innerHTML += `<div class="sidebar-item"><img src="${p.image}"><div class="item-info"><h4>${p.title}</h4><span style="font-weight:700;">${p.price.toLocaleString('tr-TR')} TL</span></div><button class="add-cart-btn" style="padding:6px" onclick="addToCart(${p.id})">Ekle</button><button class="remove-item-btn" onclick="toggleFavorite(${p.id})"><i class="fa-solid fa-xmark"></i></button></div>`;
    });
}

// --- MODAL VE PANELLER ---
const cSide = document.getElementById('cartSidebar'), fSide = document.getElementById('favSidebar'), overlay = document.getElementById('sidebarOverlay');
document.getElementById('cartToggleBtn').addEventListener('click', () => { cSide.classList.add('open'); overlay.classList.add('active'); });
document.getElementById('closeCart').addEventListener('click', () => { cSide.classList.remove('open'); overlay.classList.remove('active'); });
document.getElementById('favToggleBtn').addEventListener('click', () => { fSide.classList.add('open'); overlay.classList.add('active'); });
document.getElementById('closeFav').addEventListener('click', () => { fSide.classList.remove('open'); overlay.classList.remove('active'); });
overlay.addEventListener('click', () => { cSide.classList.remove('open'); fSide.classList.remove('open'); overlay.classList.remove('active'); });

function openProductModal(id) {
    const p = productsData.find(x => x.id === id);
    document.getElementById('modalBodyContent').innerHTML = `
        <div class="modal-detail-grid">
            <div class="modal-img-box"><img src="${p.image}"></div>
            <div>
                <h2 style="font-size:22px; margin-bottom:10px;">${p.title}</h2>
                <p style="color:var(--text-muted); margin-bottom:15px; line-height:1.6;">${p.desc}</p>
                <div style="font-size:24px; font-weight:800; margin-bottom:20px;">${p.price.toLocaleString('tr-TR')} TL</div>
                <button class="checkout-btn" onclick="addToCart(${p.id}); document.getElementById('productModal').classList.remove('active');">Sepete Ekle</button>
            </div>
        </div>`;
    document.getElementById('productModal').classList.add('active');
}
document.getElementById('closeModal').addEventListener('click', () => document.getElementById('productModal').classList.remove('active'));

// --- EKSTRA İŞLEMLER (GECE MODU, SSS, İLETİŞİM VB) ---
document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    document.getElementById('themeToggle').innerHTML = document.body.classList.contains('dark-theme') ? '<i class="fa-solid fa-sun"></i> Gündüz Modu' : '<i class="fa-solid fa-moon"></i> Gece Modu';
});
document.getElementById('sloganBtn').addEventListener('click', () => {
    const c = document.getElementById('sloganContent'); c.style.display = c.style.display === 'block' ? 'none' : 'block';
});
document.querySelectorAll('.faq-question').forEach(q => q.addEventListener('click', () => q.parentElement.classList.toggle('active')));
document.getElementById('formSubmitBtn').addEventListener('click', () => {
    if(document.getElementById('contactName').value && document.getElementById('contactEmail').value && document.getElementById('contactMessage').value) {
        showToast('Mesajınız başarıyla iletildi.'); document.getElementById('contactForm').reset();
    } else showToast('Tüm alanları doldurunuz.', 'danger');
});
document.getElementById('loginBtn').addEventListener('click', () => document.getElementById('loginModal').classList.add('active'));
document.getElementById('closeLoginModal').addEventListener('click', () => document.getElementById('loginModal').classList.remove('active'));
document.getElementById('loginSubmitBtn').addEventListener('click', () => { showToast('Giriş başarılı.'); document.getElementById('loginModal').classList.remove('active'); });

window.addEventListener('scroll', () => { document.getElementById('scrollTopBtn').classList[window.scrollY > 400 ? 'add' : 'remove']('show'); });
document.getElementById('scrollTopBtn').addEventListener('click', () => window.scrollTo({top: 0}));
document.getElementById('checkoutBtn').addEventListener('click', () => {
    if(cart.length > 0) { showToast('Sipariş alındı!'); cart=[]; updateCartUI(); cSide.classList.remove('open'); overlay.classList.remove('active'); }
    else showToast('Sepet boş.', 'danger');
});
