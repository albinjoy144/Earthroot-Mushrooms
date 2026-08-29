/* ==========================================================================
   Earthroot Poultry - Interactive Logic, Scroll Animation Engine & WhatsApp
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- Poultry Products Dataset ---
  const initialPoultryProducts = [
    {
      id: 'country-eggs-10',
      name: 'Free-Range Country Eggs (Naadan Mutta)',
      category: 'eggs',
      badge: 'Farm Bestseller',
      image: 'assets/poultry_eggs.jpg',
      desc: 'Naturally pasture-raised country chicken eggs with vibrant amber-orange yolks. High in Omega-3 fatty acids, protein, and essential choline.',
      pills: ['Deep Orange Yolk', 'Omega-3 Rich', '100% Free-Range', 'Unwashed Natural Bloom'],
      price: 130,
      unit: 'per pack of 10 eggs',
      stock: 35,
      inStock: true
    },
    {
      id: 'country-chicken-meat',
      name: 'Pasture-Raised Country Chicken (Naadan Kozhi)',
      category: 'meat',
      badge: 'Antibiotic-Free',
      image: 'assets/country_chicken.jpg',
      desc: 'Free-roaming country chicken raised for 90-120 days on natural grains and herbs. Lean, firm, and richly aromatic texture ideal for authentic Kerala roasts and curries.',
      pills: ['0% Hormones', 'Naturally Slow-Grown', 'Custom Dressed Fresh', 'Firm Texture'],
      price: 460,
      unit: 'per 1 kg (Net Dressed Weight)',
      stock: 18,
      inStock: true,
      hasCutOptions: true,
      cutOptions: ['Curry Cut (Medium with bone)', 'Biryani Cut (Large pieces)', 'Skinless Curry Cut', 'Traditional Skin-On Turmeric Rub']
    },
    {
      id: 'kadaknath-eggs',
      name: 'Medicinal Kadaknath Black Chicken Eggs',
      category: 'eggs',
      badge: 'Rare Superfood',
      image: 'assets/kadaknath.jpg',
      desc: 'Revered in traditional Ayurveda for vital stamina and cognitive vigor. Exceptionally low in cholesterol, high in bio-available iron and amino acids.',
      pills: ['Ayurvedic Superfood', 'Low Cholesterol', 'High Iron', 'Heritage Indian Breed'],
      price: 240,
      unit: 'per pack of 6 eggs',
      stock: 15,
      inStock: true
    },
    {
      id: 'kadaknath-meat',
      name: 'Authentic Kadaknath Black Meat',
      category: 'meat',
      badge: 'High Protein',
      image: 'assets/kadaknath.jpg',
      desc: 'Pure-breed Kadaknath with distinct black meat and bone marrow. High protein content (>25%), ultra-low fat (<1%), and rich in anti-oxidant melanin.',
      pills: ['25%+ Protein', '<1% Fat Content', 'Rich in Melanin', 'Medicinal Broth Grade'],
      price: 850,
      unit: 'per 1 kg (Net Dressed)',
      stock: 8,
      inStock: true,
      hasCutOptions: true,
      cutOptions: ['Traditional Soup & Curry Cut', 'Skinless Medium Cut', 'Whole Dressed Bird']
    },
    {
      id: 'duck-eggs-6',
      name: 'Farm-Fresh Kuttanad Duck Eggs',
      category: 'eggs',
      badge: 'Rich & Creamy',
      image: 'assets/duck.jpg',
      desc: 'Large organic duck eggs with thick, velvety yolks. High in Vitamin B12, selenium, and healthy fats. A classic pairing for Kerala breakfast Appam.',
      pills: ['Thick Creamy Yolk', 'Rich in Vit B12', 'Free Foraged', 'Baker Favorite'],
      price: 95,
      unit: 'per pack of 6 eggs',
      stock: 22,
      inStock: true
    },
    {
      id: 'duck-meat',
      name: 'Farm Dressed Kuttanad Duck Meat',
      category: 'meat',
      badge: 'Kerala Special',
      image: 'assets/duck.jpg',
      desc: 'Pasture and pond-raised tender duck meat. Succulent and full of deep flavor, ready for authentic Kerala Duck Roast (Tharavu Roast) and pepper fry.',
      pills: ['Succulent Bite', 'Clean Dressed', 'Traditional Tharavu', 'Cold-Packed'],
      price: 520,
      unit: 'per 1 kg (Dressed)',
      stock: 12,
      inStock: true,
      hasCutOptions: true,
      cutOptions: ['Traditional Tharavu Roast Cut', 'Skin-On Clean Cut', 'Curry Cut']
    },
    {
      id: 'quail-eggs-20',
      name: 'Nutrient-Dense Quail Eggs (Kaada Mutta)',
      category: 'eggs',
      badge: 'Immunity Booster',
      image: 'assets/quail.jpg',
      desc: 'Delightful speckled mini superfood eggs containing 3x the Vitamin B1 and 2x the iron of regular eggs. Highly recommended for growing children.',
      pills: ['3x Vit B1 & B2', 'High Zinc & Iron', 'Children Favorite', '20 Eggs Pack'],
      price: 90,
      unit: 'per pack of 20 eggs',
      stock: 25,
      inStock: true
    },
    {
      id: 'quail-meat',
      name: 'Clean Dressed Quail Meat (Kaada)',
      category: 'meat',
      badge: 'Delicacy',
      image: 'assets/quail.jpg',
      desc: 'Tender whole dressed quails seasoned with natural herbs. High in protein, low in saturated fat, and quick cooking for crispy pan-fries and roasts.',
      pills: ['Pack of 4 Birds', 'Lean Delicacy', 'Quick Cooking', 'Gourmet Fry Grade'],
      price: 290,
      unit: 'per pack of 4 birds (approx 600g)',
      stock: 14,
      inStock: true
    },
    {
      id: 'family-egg-basket',
      name: 'Healthy Family Weekly Egg Basket',
      category: 'combos',
      badge: 'Best Value',
      image: 'assets/poultry_combo.jpg',
      desc: 'The ultimate weekly nutrition package for your family: 30 Free-Range Country Eggs + 10 Spotted Quail Eggs in protective pulp crate with fresh farm guarantee.',
      pills: ['30 Naadan + 10 Quail', 'Weekly Saver', 'Eco Pulp Carton', 'Free Recipe Card'],
      price: 410,
      unit: 'per complete combo basket',
      stock: 15,
      inStock: true
    },
    {
      id: 'sunday-feast-box',
      name: 'Sunday Feast Country Meat & Egg Box',
      category: 'combos',
      badge: 'Weekend Special',
      image: 'assets/poultry_combo.jpg',
      desc: 'Everything for a hearty Sunday feast: 1kg Whole Dressed Country Chicken (Curry Cut) + 12 Fresh Country Chicken Eggs + Natural spice aromatics.',
      pills: ['1kg Chicken + 12 Eggs', 'Freshly Dressed Sunday Morning', 'Cold Insulated Box'],
      price: 580,
      unit: 'per complete combo box',
      stock: 10,
      inStock: true,
      hasCutOptions: true,
      cutOptions: ['Curry Cut with bone', 'Skinless Curry Cut', 'Biryani Cut']
    },
    {
      id: 'wholesale-egg-crate',
      name: 'Wholesale Farm Crate (100 Country Eggs)',
      category: 'bulk',
      badge: 'Bulk & Commercial',
      image: 'assets/poultry_eggs.jpg',
      desc: 'Bulk commercial wooden crate of 100 farm-fresh country eggs for cafes, bakeries, gourmet restaurants, and organic retail stores across Kerala.',
      pills: ['100 Eggs Crate', 'Direct Farm Price', 'Candled Quality Check', 'Priority Delivery'],
      price: 1150,
      unit: 'per 100 eggs crate',
      stock: 6,
      inStock: true
    }
  ];

  let currentFilter = 'all';
  let revealObserver = null;

  // DOM Elements
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navOverlay = document.getElementById('navOverlay');
  const poultryGrid = document.getElementById('poultryGrid');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const cartDrawer = document.getElementById('poultryCartDrawer');
  const cartOverlay = document.getElementById('poultryCartDrawerOverlay');
  const cartIconBtn = document.getElementById('poultryCartIconBtn');
  const cartCloseBtn = document.getElementById('poultryCartCloseBtn');
  const cartBadge = document.getElementById('poultryCartBadge');
  const cartItemsList = document.getElementById('poultryCartItemsList');
  const cartTotalAmount = document.getElementById('poultryCartTotalAmount');
  const whatsappCheckoutBtn = document.getElementById('poultryWhatsappCheckoutBtn');
  const poultryOrderNotes = document.getElementById('poultryOrderNotes');
  const pincodeForm = document.getElementById('poultryPincodeForm');
  const pincodeInput = document.getElementById('poultryPincodeInput');
  const pincodeResult = document.getElementById('poultryPincodeResult');
  const faqItems = document.querySelectorAll('.faq-item');
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const mainHeader = document.getElementById('mainHeader');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const progressRingFill = document.getElementById('progressRingFill');
  const ringCircumference = 2 * Math.PI * 22; // ~138.23px

  // --- LocalStorage Inventory & Cart State ---
  function loadPoultryStock() {
    try {
      const saved = localStorage.getItem('earthroot_poultry_inventory');
      if (saved) {
        const stockMap = JSON.parse(saved);
        return initialPoultryProducts.map(p => {
          if (stockMap[p.id] !== undefined) {
            return {
              ...p,
              stock: Number(stockMap[p.id].stock ?? p.stock),
              inStock: Boolean(stockMap[p.id].inStock && Number(stockMap[p.id].stock) > 0)
            };
          }
          return p;
        });
      }
    } catch (err) {
      console.warn('Error reading poultry stock:', err);
    }
    return initialPoultryProducts;
  }

  let products = loadPoultryStock();

  function loadCartFromStorage() {
    try {
      const saved = localStorage.getItem('earthroot_poultry_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map(item => {
            const freshProduct = products.find(p => p.id === item.id);
            if (!freshProduct || !freshProduct.inStock || freshProduct.stock <= 0) {
              return null;
            }
            return {
              ...freshProduct,
              qty: Math.min(Number(item.qty) || 1, freshProduct.stock),
              selectedCut: item.selectedCut || ''
            };
          }).filter(Boolean);
        }
      }
    } catch (err) {
      console.warn('Error reading poultry cart from storage:', err);
    }
    return [];
  }

  function saveCartToStorage() {
    try {
      localStorage.setItem('earthroot_poultry_cart', JSON.stringify(cart));
    } catch (err) {
      console.warn('Error saving poultry cart to storage:', err);
    }
  }

  let cart = loadCartFromStorage();

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

  // --- Mobile Navigation ---
  function closeMobileNav() {
    if (navMenu) navMenu.classList.remove('active');
    if (navOverlay) navOverlay.classList.remove('active');
    if (mobileToggle) {
      const icon = mobileToggle.querySelector('i');
      if (icon) icon.className = 'fas fa-bars';
    }
  }

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      if (navOverlay) navOverlay.classList.toggle('active', isOpen);
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
      }
    });

    if (navOverlay) navOverlay.addEventListener('click', closeMobileNav);
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });
  }

  // --- Cart Drawer System ---
  function toggleCart(open = true) {
    if (!cartDrawer || !cartOverlay) return;
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

  function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartBadge) {
      cartBadge.textContent = totalCount;
      cartBadge.style.display = totalCount > 0 ? 'flex' : 'none';
    }

    if (!cartItemsList || !cartTotalAmount) return;

    if (cart.length === 0) {
      cartItemsList.innerHTML = `
        <div class="cart-empty-msg">
          <i class="fas fa-egg" style="font-size: 3rem; color: var(--border-color); margin-bottom: 1rem; display: block;"></i>
          <p>Your poultry & egg basket is currently empty.</p>
          <button class="btn btn-outline btn-sm" id="emptyCartExploreBtn" style="margin-top: 1rem;">
            Explore Fresh Harvest
          </button>
        </div>
      `;
      cartTotalAmount.textContent = '₹0';
      const exploreBtn = document.getElementById('emptyCartExploreBtn');
      if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
          toggleCart(false);
          const catalogSec = document.getElementById('poultry-catalog');
          if (catalogSec) catalogSec.scrollIntoView({ behavior: 'smooth' });
        });
      }
      return;
    }

    let total = 0;
    cartItemsList.innerHTML = cart.map((item, index) => {
      const itemTotal = item.price * item.qty;
      total += itemTotal;
      const cutNote = item.selectedCut ? `<div style="font-size: 0.75rem; color: var(--accent-terracotta); font-weight: 500; margin-top: 2px;"><i class="fas fa-cut"></i> ${item.selectedCut}</div>` : '';
      return `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">₹${item.price} <span style="font-size: 0.75rem; font-weight: normal; color: var(--text-muted);">${item.unit}</span></div>
            ${cutNote}
            <div class="cart-item-qty">
              <button class="qty-btn" data-action="dec" data-index="${index}" aria-label="Decrease quantity">-</button>
              <span style="font-weight: 600; font-size: 0.9rem; min-width: 20px; text-align: center;">${item.qty}</span>
              <button class="qty-btn" data-action="inc" data-index="${index}" aria-label="Increase quantity" ${item.qty >= item.stock ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>+</button>
              <button class="qty-btn" data-action="remove" data-index="${index}" style="margin-left: 0.75rem; color: #c53030; border-color: #feb2b2;" title="Remove Item" aria-label="Remove item"><i class="fas fa-trash-alt" style="font-size: 0.75rem;"></i></button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    cartTotalAmount.textContent = `₹${total}`;

    // Attach qty listener events
    cartItemsList.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetBtn = e.currentTarget;
        const index = parseInt(targetBtn.dataset.index, 10);
        const action = targetBtn.dataset.action;

        if (action === 'inc') {
          if (cart[index].qty < cart[index].stock) {
            cart[index].qty += 1;
          } else {
            showToast(`Maximum available farm harvest stock reached (${cart[index].stock})`);
          }
        } else if (action === 'dec') {
          if (cart[index].qty > 1) {
            cart[index].qty -= 1;
          } else {
            cart.splice(index, 1);
          }
        } else if (action === 'remove') {
          cart.splice(index, 1);
        }

        saveCartToStorage();
        updateCartUI();
      });
    });
  }

  function addToCart(productId, cutChoice = '') {
    const product = products.find(p => p.id === productId);
    if (!product || !product.inStock || product.stock <= 0) {
      showToast('Sorry, this farm product is currently freshly sold out!');
      return;
    }

    const existingIndex = cart.findIndex(item => item.id === productId && item.selectedCut === cutChoice);
    if (existingIndex > -1) {
      if (cart[existingIndex].qty < product.stock) {
        cart[existingIndex].qty += 1;
        showToast(`Increased quantity for ${product.name}!`);
      } else {
        showToast(`Maximum available farm harvest stock reached (${product.stock})`);
      }
    } else {
      cart.push({
        ...product,
        qty: 1,
        selectedCut: cutChoice
      });
      showToast(`Added ${product.name} to your harvest basket!`);
    }

    saveCartToStorage();
    updateCartUI();
    toggleCart(true);
  }

  // --- Render Product Catalog ---
  function renderCatalog(filter = 'all') {
    if (!poultryGrid) return;

    const filtered = filter === 'all' 
      ? products 
      : products.filter(p => p.category === filter);

    if (filtered.length === 0) {
      poultryGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <i class="fas fa-egg" style="font-size: 3rem; color: var(--border-color); margin-bottom: 1rem; display: block;"></i>
          <p style="font-size: 1.1rem; font-weight: 500;">No items found in this category.</p>
        </div>
      `;
      return;
    }

    poultryGrid.innerHTML = filtered.map((product, idx) => {
      const isAvailable = product.inStock && product.stock > 0;
      const delay = (idx % 3 + 1) * 100;
      
      const stockPillHtml = isAvailable 
        ? `<div class="stock-status-pill in-stock"><i class="fas fa-check-circle"></i> Daily Fresh Stock (${product.stock} available)</div>`
        : `<div class="stock-status-pill out-of-stock"><i class="fas fa-times-circle"></i> Harvest Freshly Sold Out</div>`;

      const outOfStockOverlayHtml = !isAvailable
        ? `<div class="out-of-stock-overlay"><i class="fas fa-clock"></i> Next Batch Tomorrow</div>`
        : '';

      const cutSelectorHtml = product.hasCutOptions && product.cutOptions
        ? `
          <div style="margin-top: 0.5rem; margin-bottom: 0.5rem;">
            <label for="cut-select-${product.id}" style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 3px;">Cutting & Prep Preference:</label>
            <select class="meat-cut-select" id="cut-select-${product.id}">
              ${product.cutOptions.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
            </select>
          </div>
        `
        : '';

      const pillsHtml = product.pills.map(pill => `<span class="nutri-pill">${pill}</span>`).join('');

      return `
        <div class="product-card ${!isAvailable ? 'out-of-stock' : ''}" data-reveal="fade-up" data-delay="${delay}">
          <div class="product-image-wrap">
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            <span class="product-badge">${product.badge}</span>
            ${outOfStockOverlayHtml}
          </div>
          <div class="product-body">
            ${stockPillHtml}
            <h3 class="product-title">${product.name}</h3>
            <p class="product-desc">${product.desc}</p>
            <div class="product-nutrition-pills">
              ${pillsHtml}
            </div>
            ${cutSelectorHtml}
            <div class="product-footer">
              <div class="price-tag">
                <span class="price-amount">₹${product.price}</span>
                <span class="price-unit">${product.unit}</span>
              </div>
              <button class="btn btn-primary btn-sm add-to-cart-btn ${!isAvailable ? 'btn-disabled' : ''}" 
                data-id="${product.id}" 
                ${!isAvailable ? 'disabled' : ''}
                aria-label="Add ${product.name} to order">
                <i class="fas fa-shopping-basket"></i> ${isAvailable ? 'Add to Order' : 'Sold Out'}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach add to cart buttons
    poultryGrid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        let cutChoice = '';
        const cutSelect = document.getElementById(`cut-select-${id}`);
        if (cutSelect) {
          cutChoice = cutSelect.value;
        }
        addToCart(id, cutChoice);
      });
    });

    observeRevealElements();
  }

  // --- Filter Tabs ---
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderCatalog(currentFilter);
    });
  });

  // --- WhatsApp Checkout Integration ---
  if (whatsappCheckoutBtn) {
    whatsappCheckoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('Your poultry basket is empty. Please add farm items first!');
        return;
      }

      let total = 0;
      let orderItemsText = '';

      cart.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        const cutInfo = item.selectedCut ? `\n   ↳ Cut / Prep: ${item.selectedCut}` : '';
        orderItemsText += `\n${index + 1}. *${item.name}*\n   Qty: ${item.qty} × ₹${item.price} (${item.unit}) = ₹${itemTotal}${cutInfo}`;
      });

      const userNotes = poultryOrderNotes ? poultryOrderNotes.value.trim() : '';
      const notesSection = userNotes ? `\n\n📝 *Special Instructions:* ${userNotes}` : '';

      const fullMessage = 
`🐔 *EARTHROOT POULTRY & FARM FRESH ORDER*
---------------------------------------
Hello Earthroot Farm Team, I would like to place an order for the following fresh poultry & egg produce:
${orderItemsText}
---------------------------------------
*Total Amount:* ₹${total}
${notesSection}

📍 *Delivery Area / PIN:* 
👤 *Name:* 
🏡 *Complete Address:* 

Please confirm availability and scheduled morning harvest delivery time. Thank you!`;

      const encodedUrl = `https://wa.me/919048622044?text=${encodeURIComponent(fullMessage)}`;
      window.open(encodedUrl, '_blank');
    });
  }

  // --- Pincode Checker ---
  const validLocalPins = ['673602', '673604', '673580', '673603', '673601', '673001', '673002', '673004', '673005', '673006', '673016'];

  if (pincodeForm && pincodeInput && pincodeResult) {
    pincodeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const pin = pincodeInput.value.trim();

      if (pin.length !== 6 || isNaN(pin)) {
        pincodeResult.className = 'pincode-result error';
        pincodeResult.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please enter a valid 6-digit Indian PIN code.';
        return;
      }

      if (validLocalPins.includes(pin)) {
        pincodeResult.className = 'pincode-result success';
        pincodeResult.innerHTML = `
          <i class="fas fa-check-circle"></i> <strong>PIN ${pin} Covered!</strong> Daily fresh farm-to-door delivery with refrigerated cold packs available for your location.
        `;
      } else if (pin.startsWith('673') || pin.startsWith('670') || pin.startsWith('676') || pin.startsWith('682') || pin.startsWith('680') || pin.startsWith('686')) {
        pincodeResult.className = 'pincode-result success';
        pincodeResult.innerHTML = `
          <i class="fas fa-truck"></i> <strong>Kerala Delivery Available for ${pin}!</strong> Express cold-pack delivery for eggs & dressed meat available across Kerala. Order via WhatsApp for dispatch schedule.
        `;
      } else {
        pincodeResult.className = 'pincode-result error';
        pincodeResult.innerHTML = `
          <i class="fas fa-info-circle"></i> Currently standard daily delivery is not available for PIN ${pin}. Contact us via WhatsApp for custom bulk cold-chain freight!
        `;
      }
    });
  }

  // --- FAQ Accordion ---
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (header) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(other => other.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // --- Floating Feather / Golden Particles ---
  function initParticles() {
    const container = document.getElementById('featherParticles');
    if (!container) return;
    
    for (let i = 0; i < 18; i++) {
      const particle = document.createElement('div');
      particle.className = 'feather-particle';
      const size = Math.random() * 8 + 6;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 90 + 10}%`;
      particle.style.animationDelay = `${Math.random() * 8}s`;
      particle.style.animationDuration = `${Math.random() * 8 + 10}s`;
      container.appendChild(particle);
    }
  }

  // --- Scroll Progress & Back to Top ---
  function updateScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) : 0;

    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${scrollPercent * 100}%`;
    }

    if (mainHeader) {
      if (scrollTop > 50) {
        mainHeader.classList.add('scrolled');
      } else {
        mainHeader.classList.remove('scrolled');
      }
    }

    if (scrollTopBtn && progressRingFill) {
      if (scrollTop > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
      const offset = ringCircumference - (scrollPercent * ringCircumference);
      progressRingFill.style.strokeDashoffset = Math.max(0, offset);
    }
  }

  window.addEventListener('scroll', updateScroll, { passive: true });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- Intersection Observer for Scroll Animations ---
  function observeRevealElements() {
    const revealElements = document.querySelectorAll('[data-reveal]:not(.revealed)');
    
    if ('IntersectionObserver' in window) {
      if (!revealObserver) {
        revealObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              revealObserver.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.12,
          rootMargin: '0px 0px -40px 0px'
        });
      }

      revealElements.forEach(el => revealObserver.observe(el));
    } else {
      revealElements.forEach(el => el.classList.add('revealed'));
    }
  }

  // Initializations
  initParticles();
  renderCatalog(currentFilter);
  updateCartUI();
  updateScroll();
  observeRevealElements();
});
