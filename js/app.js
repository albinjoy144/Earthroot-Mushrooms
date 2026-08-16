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

  // 2. Catalog Product Data & Rendering / Filtering
  const products = [
    {
      id: 'oyster-fresh',
      name: 'Pearl & Grey Oyster Mushrooms',
      category: 'gourmet',
      badge: 'Farm Favorite',
      image: 'assets/oyster.jpg',
      desc: 'Tender, velvety texture with a mild earthy flavor. Rich in protein, fiber and antioxidants. Harvested daily in Kozhikode.',
      pills: ['Rich in B Vitamins', 'Low Calorie', '100% Organic'],
      price: 180,
      unit: 'per 250g pack'
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
      unit: 'per 250g pack'
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
      unit: 'per 250g pack'
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
      unit: 'per 200g pack'
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
      unit: 'per 5kg crate'
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
      unit: 'per complete kit'
    }
  ];

  const catalogGrid = document.getElementById('catalogGrid');
  const tabBtns = document.querySelectorAll('.tab-btn');

  function renderProducts(filter = 'all') {
    if (!catalogGrid) return;
    catalogGrid.innerHTML = '';

    const filtered = filter === 'all' 
      ? products 
      : products.filter(p => p.category === filter);

    filtered.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="product-image-wrap">
          <img src="${product.image}" alt="${product.name}" class="product-image">
          <span class="product-badge">${product.badge}</span>
        </div>
        <div class="product-body">
          <h3 class="product-title">${product.name}</h3>
          <p class="product-desc">${product.desc}</p>
          <div class="product-nutrition-pills">
            ${product.pills.map(pill => `<span class="nutri-pill">${pill}</span>`).join('')}
          </div>
          <div class="product-footer">
            <div class="price-tag">
              <span class="price-amount">₹${product.price}</span>
              <span class="price-unit">${product.unit}</span>
            </div>
            <button class="btn btn-primary btn-sm add-to-cart-btn" data-id="${product.id}">
              <i class="fas fa-cart-plus"></i> Add to Order
            </button>
          </div>
        </div>
      `;
      catalogGrid.appendChild(card);
    });

    // Attach Add to Cart listener
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

    const existing = cart.find(item => item.id === productId);
    if (existing) {
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
        if (item) {
          item.qty += 1;
          updateCartUI();
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
        z-index: 2000;
        font-weight: 600;
        font-size: 0.9rem;
        border: 1px solid #d4a342;
        transition: all 0.3s ease;
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
