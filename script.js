/* Carrousel heros + rails de produits */
(function () {
  'use strict';

  /* --- Carrousel heros ---------------------------------------------------- */
  document.querySelectorAll('[data-hero]').forEach(function (hero) {
    var track = hero.querySelector('[data-hero-track]');
    var slides = track.children;
    var dotsBox = hero.querySelector('[data-hero-dots]');
    var index = 0;
    var timer;

    var dots = Array.prototype.map.call(slides, function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Aller à la diapositive ' + (i + 1));
      dot.addEventListener('click', function () { go(i); });
      dotsBox.appendChild(dot);
      return dot;
    });

    function render() {
      track.style.transform = 'translateX(' + (-index * 100) + '%)';
      dots.forEach(function (dot, i) {
        dot.setAttribute('aria-current', i === index ? 'true' : 'false');
      });
    }

    function go(i) {
      index = (i + slides.length) % slides.length;
      render();
      restart();
    }

    function restart() {
      clearInterval(timer);
      timer = setInterval(function () { go(index + 1); }, 7000);
    }

    hero.querySelector('[data-hero-prev]').addEventListener('click', function () { go(index - 1); });
    hero.querySelector('[data-hero-next]').addEventListener('click', function () { go(index + 1); });

    render();
    restart();
  });

  /* --- Rails de produits -------------------------------------------------- */
  document.querySelectorAll('[data-rail]').forEach(function (rail) {
    var scroller = rail.querySelector('[data-rail-scroller]');

    function step() {
      var card = scroller.querySelector('.card');
      return card ? card.getBoundingClientRect().width + 20 : 240;
    }

    rail.querySelector('[data-rail-prev]').addEventListener('click', function () {
      scroller.scrollBy({ left: -step() * 2, behavior: 'smooth' });
    });
    rail.querySelector('[data-rail-next]').addEventListener('click', function () {
      scroller.scrollBy({ left: step() * 2, behavior: 'smooth' });
    });
  });

  /* --- Tiroir panier / paiement ------------------------------------------- */
  var overlay  = document.getElementById('drawer-overlay');
  var drawer   = document.getElementById('cart-drawer');
  var closeBtn = document.getElementById('drawer-close');

  /* Lien de paiement associe au total du panier (paliers croissants) */
  var PRICE_LINKS = [
    { max: 5,        url: 'https://t.trklinkx.com/click?pid=4784&offer_id=13086&sub3=2lujelly'  },  /* 2€ */
    { max: 15,       url: 'https://t.trklinkx.com/click?pid=4784&offer_id=13179&sub3=lujelly'    },  /* 10€ */
    { max: 35,       url: 'https://t.trklinkx.com/click?pid=4784&offer_id=13057&sub3=3LUJELLY'   },  /* 20€ */
    { max: 65,       url: 'https://t.trklinkx.com/click?pid=4784&offer_id=12355&sub3=Lujelly'    },  /* 49,99€ */
    { max: 90,       url: 'https://t.trklinkx.com/click?pid=4784&offer_id=12541&sub3=Lujelly'    },  /* 79,99€ */
    { max: Infinity, url: 'https://t.trklinkx.com/click?pid=4784&offer_id=12913&sub3=10Lujelly'  }   /* 99,99€ */
  ];
  function linkForTotal(total) {
    for (var i = 0; i < PRICE_LINKS.length; i++) { if (total <= PRICE_LINKS[i].max) return PRICE_LINKS[i].url; }
    return PRICE_LINKS[PRICE_LINKS.length - 1].url;
  }
  window.jcLinkForTotal = linkForTotal;

  function euro(n) { return n.toFixed(2).replace('.', ',') + '€'; }

  function readCart() {
    try { return JSON.parse(localStorage.getItem('jc_cart') || '[]'); } catch (e) { return []; }
  }
  function writeCart(cart) {
    try { localStorage.setItem('jc_cart', JSON.stringify(cart)); } catch (e) { /* stockage indisponible */ }
  }
  window.jcReadCart = readCart;
  window.jcWriteCart = writeCart;

  function cartTotal(cart) {
    return cart.reduce(function (sum, item) { return sum + (item.priceValue || 0) * (item.qty || 1); }, 0);
  }
  function cartCount(cart) {
    return cart.reduce(function (sum, item) { return sum + (item.qty || 1); }, 0);
  }

  function paintCount() {
    var n = cartCount(readCart());
    document.querySelectorAll('[data-cart-count]').forEach(function (el) { el.textContent = n; });
  }

  /* Ajoute un produit au panier (ou incremente sa quantite s'il y est deja) */
  function addToCart(product) {
    var cart = readCart();
    var existing = cart.filter(function (it) { return it.slug === product.slug; })[0];
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      cart.push({
        slug: product.slug,
        name: product.name,
        price: product.price,
        priceValue: product.priceValue,
        img: product.img,
        qty: 1
      });
    }
    writeCart(cart);
    document.dispatchEvent(new CustomEvent('jc:cart-changed'));
    return cart;
  }
  window.jcAddToCart = addToCart;

  function changeQty(slug, delta) {
    var cart = readCart();
    var idx = -1;
    cart.forEach(function (it, i) { if (it.slug === slug) idx = i; });
    if (idx === -1) return;
    cart[idx].qty = (cart[idx].qty || 1) + delta;
    if (cart[idx].qty <= 0) cart.splice(idx, 1);
    writeCart(cart);
    renderDrawer();
    document.dispatchEvent(new CustomEvent('jc:cart-changed'));
  }

  function removeItem(slug) {
    var cart = readCart().filter(function (it) { return it.slug !== slug; });
    writeCart(cart);
    renderDrawer();
    document.dispatchEvent(new CustomEvent('jc:cart-changed'));
  }

  function renderDrawer() {
    var cart     = readCart();
    var listEl   = document.getElementById('drawer-items');
    var emptyMsg = document.getElementById('drawer-empty');
    var totalBox = document.getElementById('drawer-total');
    var checkout = document.getElementById('drawer-checkout');
    if (!listEl) return;

    listEl.innerHTML = '';

    if (cart.length) {
      if (emptyMsg) emptyMsg.hidden = true;
      cart.forEach(function (item) {
        var row = document.createElement('div');
        row.className = 'drawer__item';
        row.innerHTML =
          '<img src="' + item.img + '" alt="' + item.name + '">' +
          '<div class="drawer__item-info">' +
            '<p class="drawer__item-name">' + item.name + '</p>' +
            '<p class="drawer__item-price">' + item.price + '</p>' +
            '<div class="drawer__qty">' +
              '<button type="button" class="drawer__qty-btn" data-dec aria-label="Retirer un exemplaire">−</button>' +
              '<span>' + (item.qty || 1) + '</span>' +
              '<button type="button" class="drawer__qty-btn" data-inc aria-label="Ajouter un exemplaire">+</button>' +
            '</div>' +
            '<button type="button" class="drawer__remove" data-remove>Supprimer</button>' +
          '</div>';
        row.querySelector('[data-inc]').addEventListener('click', function () { changeQty(item.slug, 1); });
        row.querySelector('[data-dec]').addEventListener('click', function () { changeQty(item.slug, -1); });
        row.querySelector('[data-remove]').addEventListener('click', function () { removeItem(item.slug); });
        listEl.appendChild(row);
      });
    } else {
      if (emptyMsg) emptyMsg.hidden = false;
    }

    var total = cartTotal(cart);
    if (cart.length) {
      if (totalBox) {
        totalBox.hidden = false;
        document.getElementById('drawer-total-amount').textContent = euro(total);
      }
      if (checkout) {
        checkout.hidden = false;
        checkout.href = linkForTotal(total);
      }
    } else {
      if (totalBox) totalBox.hidden = true;
      if (checkout) checkout.hidden = true;
    }
    paintCount();
  }
  window.jcRenderDrawer = renderDrawer;

  function openDrawer() {
    if (!overlay || !drawer) return;
    renderDrawer();
    overlay.classList.add('open');
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  window.jcOpenDrawer = openDrawer;

  function closeDrawer() {
    if (!overlay || !drawer) return;
    overlay.classList.remove('open');
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-open-cart]').forEach(function (el) {
    el.addEventListener('click', function (e) { e.preventDefault(); openDrawer(); });
  });
  if (overlay) overlay.addEventListener('click', closeDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(); });
  document.addEventListener('jc:open-cart', openDrawer);
  document.addEventListener('jc:cart-changed', paintCount);

  /* --- Compteur du panier (partage entre les pages) ----------------------- */
  paintCount();
})();
