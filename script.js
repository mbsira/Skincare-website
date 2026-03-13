/* ──────────────────────────────────────────────
   CART STATE
────────────────────────────────────────────── */
let cartItems = [];

/* ── open / close ── */
function openCart() {
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('cartToggle').addEventListener('click', () => {
  document.getElementById('cartSidebar').classList.contains('open') ? closeCart() : openCart();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });

/* ── add item ── */
function addToCart(name, price, img) {
  const existing = cartItems.find(i => i.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cartItems.push({ id: Date.now(), name, price, img, qty: 1 });
  }
  renderCart();
  openCart();
  showToast(name + ' added to bag');
}

/* ── qty ── */
function changeQty(id, delta) {
  const item = cartItems.find(i => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  renderCart();
}

/* ── remove ── */
function removeItem(id) {
  cartItems = cartItems.filter(i => i.id !== id);
  renderCart();
}

/* ── render ── */
function renderCart() {
  const container = document.getElementById('cartItems');
  const empty     = document.getElementById('cartEmpty');
  const foot      = document.getElementById('cartFoot');
  const badge     = document.getElementById('cartBadge');
  const totalEl   = document.getElementById('cartTotal');

  const totalCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  /* badge */
  if (totalCount > 0) {
    badge.style.display = 'flex';
    badge.textContent = totalCount;
  } else {
    badge.style.display = 'none';
  }

  /* footer */
  foot.style.display = cartItems.length ? 'block' : 'none';
  totalEl.textContent = '$' + totalPrice.toFixed(2);

  /* reset checkout btn */
  const btn = document.getElementById('checkoutBtn');
  btn.disabled = false;
  btn.textContent = 'Proceed to Buy';

  /* remove old item nodes, keep empty state node */
  Array.from(container.children).forEach(child => {
    if (child.id !== 'cartEmpty') child.remove();
  });

  if (cartItems.length === 0) {
    empty.style.display = 'flex';
    return;
  }
  empty.style.display = 'none';

  cartItems.forEach(item => {
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <div class="cart-item__img">
        <img src="${item.img}" alt="${item.name}" />
      </div>
      <div class="cart-item__body">
        <div class="cart-item__name">${item.name}</div>
        <div class="cart-item__price">$${item.price.toFixed(2)}</div>
        <div class="cart-item__qty">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="cart-item__remove" onclick="removeItem(${item.id})" aria-label="Remove">×</button>
    `;
    container.appendChild(el);
  });
}

/* ── checkout ── */
function checkout() {
  const btn = document.getElementById('checkoutBtn');
  btn.textContent = '✓ Order placed — thank you!';
  btn.disabled = true;
  setTimeout(() => {
    cartItems = [];
    renderCart();
    closeCart();
  }, 2000);
}

/* ── toast ── */
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}

/* ── contact form ── */
function handleContact(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = '✓ Sent!';
  btn.disabled = true;
  e.target.reset();
  setTimeout(() => { btn.textContent = 'Send Message'; btn.disabled = false; }, 3000);
}

/* ── tab buttons (visual only) ── */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

/* init */
renderCart();