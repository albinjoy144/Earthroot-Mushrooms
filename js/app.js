/* ==========================================================================
   Earthroot Mushrooms - Interactive Logic & WhatsApp Integration
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('active')) {
          icon.className = 'fas fa-times';
        } else {
          icon.className = 'fas fa-bars';
        }
      }
    });

    // Close menu when clicking links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        if (mobileToggle.querySelector('i')) {
          mobileToggle.querySelector('i').className = 'fas fa-bars';
        }
      });
    });
  }

  // 2. Catalog Product Data & Stock Management
  const initialProducts = [
    {
      id: 'oyster-fresh',
      name: 'Pearl & Grey Oyster Mushrooms',
      category: 'gourmet',
      badge: 'Farm Favorite',
      image: 'assets/oyster.jpg',
      desc: 'Tender, velvety texture with a mild earthy flavor. Rich in protein, fiber and antioxidants. Harvested daily in Kozhikode.',
      pills: ['Rich in B Vitamins', 'Low Calorie', '100% Organic'],
      price: 180,
      unit: 'per 250g pack',
      stock: 20,
      inStock: true
    },
    {
      id: 'milky-fresh',
      name: 'Kerala Milky Mushrooms',
      category: 'gourmet',
      badge: 'High Protein',
      image: 'assets/milky.jpg',
      desc: 'Thick, fleshy gourmet mushrooms with exceptional shelf-life and succulent bite. Ideal for coconut curries & spicy roasts.',
      pills: ['High Fibre', 'Immunity Boost', 'Fresh Harvest'],
      price: 220,
      unit: 'per 250g pack',
      stock: 15,
      inStock: true
    },
    {
      id: 'button-white',
      name: 'Fresh White Button Mushrooms',
      category: 'gourmet',
      badge: 'Classic Choice',
      image: 'assets/button.jpg',
      desc: 'Plump, firm white buttons cultivated under controlled climate conditions. Perfect for daily stir-fries, soups, and pizza toppings.',
      pills: ['Selenium Rich', 'Versatile Cooking', 'Zero Pesticides'],
      price: 150,
      unit: 'per 250g pack',
      stock: 25,
      inStock: true
    },
    {
      id: 'lions-mane',
      name: "Organic Lion's Mane",
      category: 'medicinal',
      badge: 'Brain & Nootropic',
      image: 'assets/lions_mane.jpg',
      desc: 'Premium culinary superfood known for cognitive clarity, memory support, and seafood-like delicate flavor.',
      pills: ['Brain Health', 'Focus & Energy', 'Superfood'],
      price: 450,
      unit: 'per 200g pack',
      stock: 10,
      inStock: true
    },
    {
      id: 'oyster-bulk',
      name: 'Wholesale Oyster Bulk Crate',
      category: 'bulk',
      badge: 'Restaurant Grade',
      image: 'assets/oyster.jpg',
      desc: 'Daily harvested commercial quantity for hotels, caterers, and supermarkets across Kerala.',
      pills: ['5kg Bulk Pack', 'Direct Wholesale', 'Cold Chain Delivery'],
      price: 2800,
      unit: 'per 5kg crate',
      stock: 5,
      inStock: true
    },
    {
      id: 'grow-kit',
      name: 'Mycelium DIY Mushroom Grow Kit',
      category: 'kits',
      badge: 'Fun & Educational',
      image: 'assets/hero.jpg',
      desc: 'Grow your own fresh oyster mushrooms at home on your kitchen counter! Guaranteed fruiting within 10-14 days.',
      pills: ['Beginner Friendly', 'Includes Sprayer', 'Guaranteed Crop'],
      price: 599,
      unit: 'per complete kit',
      stock: 12,
      inStock: true
    }
  ];

  // Load or initialize stock from localStorage
  function loadProductsWithStock() {
    try {
      const saved = localStorage.getItem('earthroot_inventory_stock');
      if (saved) {
        const stockMap = JSON.parse(saved);
        return initialProducts.map(p => {
          if (stockMap[p.id] !== undefined) {
            return {
              ...p,
              stock: Number(stockMap[p.id].stock ?? 0),
              inStock: Boolean(stockMap[p.id].inStock && Number(stockMap[p.id].stock) > 0)
            };
          }
          return p;
        });
      }
    } catch (err) {
      console.warn('Error reading stock from storage:', err);
    }
    return initialProducts;
  }

  let products = loadProductsWithStock();

  function saveStockToStorage() {
    const stockMap = {};
    products.forEach(p => {
      stockMap[p.id] = {
        stock: p.stock,
        inStock: p.inStock && p.stock > 0
      };
    });
    localStorage.setItem('earthroot_inventory_stock', JSON.stringify(stockMap));
  }

  const catalogGrid = document.getElementById('catalogGrid');
  const tabBtns = document.querySelectorAll('.tab-btn');
  let currentFilter = 'all';

  function renderProducts(filter = currentFilter) {
    currentFilter = filter;
    if (!catalogGrid) return;
    catalogGrid.innerHTML = '';

    const filtered = filter === 'all' 
      ? products 
      : products.filter(p => p.category === filter);

    filtered.forEach(product => {
      const isAvailable = product.inStock && product.stock > 0;
      const card = document.createElement('div');
      card.className = `product-card ${!isAvailable ? 'out-of-stock' : ''}`;
      card.innerHTML = `
        <div class="product-image-wrap">
          <img src="${product.image}" alt="${product.name}" class="product-image">
          <span class="product-badge">${product.badge}</span>
          ${!isAvailable ? '<span class="out-of-stock-overlay"><i class="fas fa-ban"></i> Out of Stock</span>' : ''}
        </div>
        <div class="product-body">
          <h3 class="product-title">${product.name}</h3>
          <p class="product-desc">${product.desc}</p>
          <div class="product-nutrition-pills">
            ${product.pills.map(pill => `<span class="nutri-pill">${pill}</span>`).join('')}
          </div>
          
          <div class="stock-status-pill ${isAvailable ? 'in-stock' : 'out-of-stock'}">
            <i class="fas ${isAvailable ? 'fa-check-circle' : 'fa-times-circle'}"></i>
            ${isAvailable ? `In Stock (${product.stock} available)` : 'Harvest Sold Out'}
          </div>

          <div class="product-footer">
            <div class="price-tag">
              <span class="price-amount">₹${product.price}</span>
              <span class="price-unit">${product.unit}</span>
            </div>
            ${isAvailable ? `
              <button class="btn btn-primary btn-sm add-to-cart-btn" data-id="${product.id}">
                <i class="fas fa-cart-plus"></i> Add to Order
              </button>
            ` : `
              <button class="btn btn-disabled btn-sm" disabled data-id="${product.id}">
                <i class="fas fa-times-circle"></i> Out of Stock
              </button>
            `}
          </div>
        </div>
      `;
      catalogGrid.appendChild(card);
    });

    // Attach Add to Cart listener for active buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        addToCart(id);
      });
    });
  }

  // Filter tab click handlers
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      renderProducts(filter);
    });
  });

  renderProducts('all');

  // 3. Cart & Order Drawer Management
  let cart = [];

  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartDrawerOverlay');
  const cartIconBtn = document.getElementById('cartIconBtn');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartBadge = document.getElementById('cartBadge');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartTotalAmount = document.getElementById('cartTotalAmount');
  const whatsappCheckoutBtn = document.getElementById('whatsappCheckoutBtn');

  function toggleCart(open = true) {
    if (open) {
      cartDrawer.classList.add('active');
      cartOverlay.classList.add('active');
    } else {
      cartDrawer.classList.remove('active');
      cartOverlay.classList.remove('active');
    }
  }

  if (cartIconBtn) cartIconBtn.addEventListener('click', () => toggleCart(true));
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', () => toggleCart(false));
  if (cartOverlay) cartOverlay.addEventListener('click', () => toggleCart(false));

  function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (!product.inStock || product.stock <= 0) {
      showToast(`Sorry, ${product.name} is currently out of stock!`);
      return;
    }

    const existing = cart.find(item => item.id === productId);
    if (existing) {
      if (existing.qty >= product.stock) {
        showToast(`Only ${product.stock} pack(s) available in stock for ${product.name}!`);
        return;
      }
      existing.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }

    updateCartUI();
    toggleCart(true);
    showToast(`Added ${product.name} to your harvest order!`);
  }

  function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartBadge) cartBadge.textContent = totalItems;

    if (!cartItemsList) return;

    if (cart.length === 0) {
      cartItemsList.innerHTML = `<div class="cart-empty-msg"><i class="fas fa-shopping-basket fa-2x mb-2" style="color:#ca6536"></i><p>Your basket is currently empty.<br>Explore our fresh varieties above!</p></div>`;
      if (cartTotalAmount) cartTotalAmount.textContent = '₹0';
      return;
    }

    cartItemsList.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
      const itemTotal = item.price * item.qty;
      total += itemTotal;

      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">₹${item.price} x ${item.qty} = ₹${itemTotal}</div>
          <div class="cart-item-qty">
            <button class="qty-btn qty-minus" data-id="${item.id}">-</button>
            <span>${item.qty}</span>
            <button class="qty-btn qty-plus" data-id="${item.id}">+</button>
          </div>
        </div>
      `;
      cartItemsList.appendChild(div);
    });

    if (cartTotalAmount) cartTotalAmount.textContent = `₹${total}`;

    // Attach qty listeners
    document.querySelectorAll('.qty-minus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const item = cart.find(i => i.id === id);
        if (item) {
          if (item.qty > 1) {
            item.qty -= 1;
          } else {
            cart = cart.filter(i => i.id !== id);
          }
          updateCartUI();
        }
      });
    });

    document.querySelectorAll('.qty-plus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const item = cart.find(i => i.id === id);
        const product = products.find(p => p.id === id);
        if (item && product) {
          if (item.qty < product.stock) {
            item.qty += 1;
            updateCartUI();
          } else {
            showToast(`Maximum harvest stock reached (${product.stock} packs available).`);
          }
        }
      });
    });
  }

  // 4. WhatsApp Direct Order Formatter
  if (whatsappCheckoutBtn) {
    whatsappCheckoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Please add at least one item to your order before checkout.');
        return;
      }

      let message = `🌱 *NEW ORDER - EARTHROOT MUSHROOMS* 🌱\n\n`;
      let total = 0;

      cart.forEach((item, index) => {
        const linePrice = item.price * item.qty;
        total += linePrice;
        message += `${index + 1}. *${item.name}*\n   Qty: ${item.qty} pack(s) | ₹${linePrice}\n`;
      });

      message += `\n💵 *Total Estimated Value:* ₹${total}\n`;
      message += `\n📍 *Delivery Request:* Fresh Harvest Delivery Kerala\n`;
      message += `\nPlease confirm item availability and dispatch time. Thank you!`;

      const encodedUrl = `https://wa.me/919048622044?text=${encodeURIComponent(message)}`;
      window.open(encodedUrl, '_blank');
    });
  }

  // 5. Pincode Eligibility Checker
  const pincodeForm = document.getElementById('pincodeForm');
  const pincodeInput = document.getElementById('pincodeInput');
  const pincodeResult = document.getElementById('pincodeResult');

  if (pincodeForm && pincodeInput && pincodeResult) {
    pincodeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = pincodeInput.value.trim();
      
      // Only 67360x pincodes are eligible for delivery
      if (/^67360\d$/.test(code)) {
        pincodeResult.className = 'pincode-result success';
        pincodeResult.innerHTML = `<i class="fas fa-check-circle"></i> Great news! Delivery is <strong>Available</strong> for Pincode <strong>${code}</strong> (Pullurampara & Thiruvambady area).`;
      } else if (/^\d{6}$/.test(code)) {
        pincodeResult.className = 'pincode-result error';
        pincodeResult.innerHTML = `<i class="fas fa-times-circle"></i> Sorry, delivery is <strong>Not Available</strong> for Pincode <strong>${code}</strong>. Delivery is currently only available for 67360x PIN code areas.`;
      } else {
        pincodeResult.className = 'pincode-result error';
        pincodeResult.innerHTML = `<i class="fas fa-exclamation-circle"></i> Please enter a valid 6-digit PIN code (e.g. 673603).`;
      }
    });
  }

  // 6. FAQ Accordion Interactive Toggle
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 7. Admin Stock Inventory Manager
  const adminOpenBtn = document.getElementById('adminOpenBtn');
  const footerAdminLink = document.getElementById('footerAdminLink');
  const adminModalOverlay = document.getElementById('adminModalOverlay');
  const adminModalCloseBtn = document.getElementById('adminModalCloseBtn');
  const adminLoginForm = document.getElementById('adminLoginForm');
  const adminPinInput = document.getElementById('adminPinInput');
  const adminLoginBox = document.getElementById('adminLoginBox');
  const adminDashboardBox = document.getElementById('adminDashboardBox');
  const adminStockList = document.getElementById('adminStockList');
  const adminRestockAllBtn = document.getElementById('adminRestockAllBtn');
  const adminSaveAllBtn = document.getElementById('adminSaveAllBtn');
  const adminLogoutBtn = document.getElementById('adminLogoutBtn');

  let isAdminAuthenticated = sessionStorage.getItem('earthroot_admin_auth') === 'true';

  function openAdminModal() {
    if (!adminModalOverlay) return;
    adminModalOverlay.classList.add('active');
    if (isAdminAuthenticated) {
      showAdminDashboard();
    } else {
      showAdminLogin();
    }
  }

  function closeAdminModal() {
    if (adminModalOverlay) adminModalOverlay.classList.remove('active');
  }

  function showAdminLogin() {
    if (adminLoginBox) adminLoginBox.style.display = 'block';
    if (adminDashboardBox) adminDashboardBox.style.display = 'none';
    if (adminPinInput) {
      adminPinInput.value = '';
      setTimeout(() => adminPinInput.focus(), 100);
    }
  }

  function showAdminDashboard() {
    if (adminLoginBox) adminLoginBox.style.display = 'none';
    if (adminDashboardBox) adminDashboardBox.style.display = 'block';
    renderAdminStockList();
  }

  if (adminOpenBtn) adminOpenBtn.addEventListener('click', openAdminModal);
  if (footerAdminLink) footerAdminLink.addEventListener('click', openAdminModal);
  if (adminModalCloseBtn) adminModalCloseBtn.addEventListener('click', closeAdminModal);
  if (adminModalOverlay) {
    adminModalOverlay.addEventListener('click', (e) => {
      if (e.target === adminModalOverlay) closeAdminModal();
    });
  }

  // Admin PIN Auth (Passcode: admin123 or 673603)
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const pin = adminPinInput.value.trim();
      if (pin === 'admin123' || pin === '673603' || pin === 'admin') {
        isAdminAuthenticated = true;
        sessionStorage.setItem('earthroot_admin_auth', 'true');
        showAdminDashboard();
        showToast('Admin access unlocked successfully!');
      } else {
        alert('Incorrect Passcode. Try default passcode: admin123');
      }
    });
  }

  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener('click', () => {
      isAdminAuthenticated = false;
      sessionStorage.removeItem('earthroot_admin_auth');
      showAdminLogin();
      showToast('Logged out from Admin Portal.');
    });
  }

  function renderAdminStockList() {
    if (!adminStockList) return;
    adminStockList.innerHTML = '';

    products.forEach(product => {
      const isAvailable = product.inStock && product.stock > 0;
      const row = document.createElement('div');
      row.className = 'admin-stock-card';
      row.innerHTML = `
        <div class="admin-item-info">
          <img src="${product.image}" alt="${product.name}" class="admin-item-img">
          <div>
            <div class="admin-item-title">${product.name}</div>
            <div class="admin-item-sub">Price: ₹${product.price} | Category: ${product.category}</div>
          </div>
        </div>

        <div class="admin-item-controls">
          <div class="admin-stock-input-wrap">
            <label for="stock_${product.id}">Stock:</label>
            <input type="number" id="stock_${product.id}" class="admin-stock-input" min="0" max="999" value="${product.stock}">
          </div>

          <button class="admin-toggle-btn ${isAvailable ? 'in-stock' : 'out-of-stock'}" data-id="${product.id}" id="toggle_${product.id}">
            <i class="fas ${isAvailable ? 'fa-check' : 'fa-ban'}"></i>
            <span>${isAvailable ? 'In Stock' : 'Out of Stock'}</span>
          </button>

          <button class="admin-save-item-btn" data-id="${product.id}">
            <i class="fas fa-save"></i> Save
          </button>
        </div>
      `;
      adminStockList.appendChild(row);
    });

    // Toggle button listener
    document.querySelectorAll('.admin-toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const product = products.find(p => p.id === id);
        if (product) {
          const input = document.getElementById(`stock_${id}`);
          if (product.inStock && product.stock > 0) {
            // Turn Out of Stock
            product.inStock = false;
            product.stock = 0;
            if (input) input.value = 0;
          } else {
            // Turn In Stock
            product.inStock = true;
            if (product.stock <= 0) product.stock = 15;
            if (input) input.value = product.stock;
          }
          saveStockToStorage();
          renderProducts(currentFilter);
          renderAdminStockList();
          showToast(`Updated ${product.name} status`);
        }
      });
    });

    // Single item update listener
    document.querySelectorAll('.admin-save-item-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const input = document.getElementById(`stock_${id}`);
        const product = products.find(p => p.id === id);
        if (product && input) {
          const newStock = Math.max(0, parseInt(input.value, 10) || 0);
          product.stock = newStock;
          product.inStock = newStock > 0;
          saveStockToStorage();
          renderProducts(currentFilter);
          renderAdminStockList();
          showToast(`Saved ${product.name} stock: ${newStock} packs`);
        }
      });
    });
  }

  // Quick Restock All +10
  if (adminRestockAllBtn) {
    adminRestockAllBtn.addEventListener('click', () => {
      products.forEach(p => {
        p.stock = (p.stock || 0) + 10;
        p.inStock = true;
      });
      saveStockToStorage();
      renderProducts(currentFilter);
      renderAdminStockList();
      showToast('Added +10 fresh stock to all varieties!');
    });
  }

  // Save All Stock
  if (adminSaveAllBtn) {
    adminSaveAllBtn.addEventListener('click', () => {
      products.forEach(product => {
        const input = document.getElementById(`stock_${product.id}`);
        if (input) {
          const val = Math.max(0, parseInt(input.value, 10) || 0);
          product.stock = val;
          product.inStock = val > 0;
        }
      });
      saveStockToStorage();
      renderProducts(currentFilter);
      renderAdminStockList();
      showToast('All stock levels saved & updated live on website!');
    });
  }

  // Simple Notification Toast
  function showToast(text) {
    let toast = document.getElementById('toastNotification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toastNotification';
      toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        background: #0f271d;
        color: #f7e8c4;
        padding: 0.8rem 1.8rem;
        border-radius: 9999px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 3000;
        font-weight: 600;
        font-size: 0.9rem;
        border: 1px solid #d4a342;
        transition: all 0.3s ease;
        pointer-events: none;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.style.opacity = '1';
    
    setTimeout(() => {
      toast.style.opacity = '0';
    }, 2800);
  }
});

