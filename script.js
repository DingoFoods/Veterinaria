document.addEventListener('DOMContentLoaded', () => {
    // --- BASES DE DATOS (PRODUCTOS Y SERVICIOS) ---
    const products = [
        { id: 1, name: 'Alimento Seco para Perro Adulto', price: 55000, image: 'images/producto-1.jpg', featured: true },
        { id: 2, name: 'Juguete Hueso de Goma Resistente', price: 25000, image: 'images/producto-2.jpg', featured: true },
        { id: 3, name: 'Shampoo Hipoalergénico', price: 42000, image: 'images/producto-3.jpg', featured: true },
        { id: 4, name: 'Collar Antipulgas y Garrapatas', price: 85000, image: 'images/producto-4.jpg', featured: true },
        { id: 5, name: 'Alimento Húmedo para Gato (Lata)', price: 7000, image: 'images/producto-5.jpg', featured: false },
        { id: 6, name: 'Arena Sanitaria para Gatos (5kg)', price: 35000, image: 'images/producto-6.jpg', featured: false },
        { id: 7, name: 'Cama Acolchada para Mascota (Mediana)', price: 120000, image: 'images/producto-7.jpg', featured: false },
        { id: 8, name: 'Snacks Dentales para Perro (Bolsa)', price: 32000, image: 'images/producto-8.jpg', featured: false }
    ];
    const services = [
        { id: 101, name: 'Consulta Veterinaria General', price: 60000, description: 'Revisión completa.' },
        { id: 102, name: 'Día de Spa y Grooming', price: 95000, description: 'Baño, corte, y más.' },
        { id: 103, name: 'Plan de Vacunación Anual', price: 150000, description: 'Vacunas esenciales.' }
    ];

    // --- LÓGICA DEL CARRITO ---
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    function saveCart() { localStorage.setItem('cart', JSON.stringify(cart)); }
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        saveCart();
        updateCartIcon();
        alert(`${product.name} ha sido agregado al carrito.`);
    }
    function updateCartIcon() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        }
    }

    // --- RENDERIZADO DE PÁGINAS ---
    function renderProducts(containerId, productList) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = productList.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">$${product.price.toLocaleString('es-CO')}</p>
                    <button class="btn-add-to-cart" data-id="${product.id}">Agregar al Carrito</button>
                </div>
            </div>`).join('');
    }
    function renderServices() {
        const container = document.getElementById('service-grid');
        if (!container) return;
        container.innerHTML = services.map(service => `
            <div class="service-card">
                <h3>${service.name}</h3>
                <p class="price">$${service.price.toLocaleString('es-CO')}</p>
                <p>${service.description}</p>
                <button class="btn-primary" data-service-id="${service.id}">Agendar Cita</button>
            </div>`).join('');
    }
    
    // --- FUNCIÓN DEL CARRITO (COMPLETA Y CORREGIDA) ---
    function renderCartPage() {
        const itemsContainer = document.getElementById('cart-items');
        const summaryContainer = document.getElementById('cart-summary');
        if (!itemsContainer || !summaryContainer) return;

        if (cart.length === 0) {
            itemsContainer.innerHTML = '<p>Tu carrito está vacío. <a href="productos.html">¡Mira nuestros productos!</a></p>';
            summaryContainer.style.display = 'none';
            return;
        }

        summaryContainer.style.display = 'block';
        let subtotal = 0;

        itemsContainer.innerHTML = cart.map(item => {
            subtotal += item.price * item.quantity;
            return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>Precio: $${item.price.toLocaleString('es-CO')}</p>
                    <p>Cantidad: ${item.quantity}</p>
                </div>
                <p>Total: $${(item.price * item.quantity).toLocaleString('es-CO')}</p>
                <button class="btn-remove" data-id="${item.id}">&times;</button>
            </div>`;
        }).join('');

        summaryContainer.innerHTML = `
            <h3>Resumen de Compra</h3>
            <p>Subtotal: <strong>$${subtotal.toLocaleString('es-CO')}</strong></p>
            <p>Envío: <strong>$8.000</strong></p><hr>
            <h4>Total a Pagar: <strong>$${(subtotal + 8000).toLocaleString('es-CO')}</strong></h4>
            <a href="checkout.html" class="btn-primary" style="display:block; text-align:center; text-decoration: none;">Proceder al Pago</a>`;
    }

    // --- FUNCIÓN DEL CHECKOUT (COMPLETA Y CORREGIDA) ---
    function renderCheckoutSummary() {
        const summaryItems = document.getElementById('summary-items');
        const summaryTotal = document.getElementById('summary-total');
        if (!summaryItems || !summaryTotal) return;

        let subtotal = 0;
        summaryItems.innerHTML = cart.map(item => {
            subtotal += item.price * item.quantity;
            return `<div class="summary-item">
                        <span class="summary-item-name">${item.name} (x${item.quantity})</span>
                        <strong>$${(item.price * item.quantity).toLocaleString('es-CO')}</strong>
                    </div>`;
        }).join('');

        const total = subtotal + 8000;
        summaryTotal.innerHTML = `
            <div class="summary-item"><span>Subtotal</span><strong>$${subtotal.toLocaleString('es-CO')}</strong></div>
            <div class="summary-item"><span>Envío</span><strong>$8.000</strong></div><hr>
            <div class="summary-item total-label"><span>Total</span><strong class="total-price">$${total.toLocaleString('es-CO')}</strong></div>`;
    }

    // --- LÓGICA DE FORMULARIOS ---
    const modal = document.getElementById('formModal');
    function openModal(title, formHTML) {
        if(modal) {
            modal.querySelector('#modalTitle').textContent = title;
            modal.querySelector('#formBody').innerHTML = formHTML;
            modal.style.display = 'block';
        }
    }
    function closeModal() { if(modal) modal.style.display = 'none'; }
    if(modal) {
        modal.querySelector('#modalForm').addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Cita agendada (simulación). ¡Nos pondremos en contacto contigo!');
            closeModal();
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (document.getElementById('email').value === 'cliente@vetshop.com' && document.getElementById('password').value === '12345') {
                alert('¡Inicio de sesión exitoso!');
                window.location.href = 'index.html';
            } else {
                alert('Credenciales incorrectas.');
            }
        });
    }
    
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('¡Gracias por tu compra! Tu pedido ha sido procesado con éxito.');
            cart = [];
            saveCart();
            setTimeout(() => { window.location.href = 'index.html'; }, 2000);
        });
    }

    // --- EVENTOS GLOBALES ---
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-add-to-cart')) addToCart(parseInt(e.target.dataset.id));
        if (e.target.classList.contains('btn-remove')) {
             cart = cart.filter(item => item.id !== parseInt(e.target.dataset.id));
             saveCart(); renderCartPage(); updateCartIcon();
        }
        if (e.target.dataset.serviceId) {
            const service = services.find(s => s.id === parseInt(e.target.dataset.serviceId));
            openModal(`Agendar: ${service.name}`, `<div class="form-group"><label>Nombre de tu Mascota</label><input type="text" required></div><div class="form-group"><label>Fecha Deseada</label><input type="date" required></div><p>Nos comunicaremos para confirmar el horario.</p>`);
        }
        if (e.target.classList.contains('close-button') || e.target.classList.contains('modal')) closeModal();
    });

    // --- INICIALIZACIÓN ---
    updateCartIcon();
    if (document.getElementById('featured-product-grid')) renderProducts('featured-product-grid', products.filter(p => p.featured));
    if (document.getElementById('all-product-grid')) renderProducts('all-product-grid', products);
    if (document.getElementById('cart-items')) renderCartPage();
    if (document.getElementById('service-grid')) renderServices();
    if (document.getElementById('summary-items')) renderCheckoutSummary();
});