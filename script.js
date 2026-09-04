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
  var overlay   = document.getElementById('drawer-overlay');
  var drawer    = document.getElementById('cart-drawer');
  var closeBtn  = document.getElementById('drawer-close');
  var removeBtn = document.getElementById('drawer-remove');

  /* Lien de paiement associe au palier de prix le plus proche */
  var PRICE_LINKS = [
    { max: 5,        url: 'https://t.trklinkx.com/click?pid=4784&offer_id=13086&sub3=2lujelly' },
    { max: 15,       url: 'https://t.trklinkx.com/click?pid=4784&offer_id=13179&sub3=lujelly' },
    { max: 35,       url: 'https://t.trklinkx.com/click?pid=4784&offer_id=13057&sub3=3LUJELLY' },
    { max: Infinity, url: 'https://t.trklinkx.com/click?pid=4784&offer_id=12355&sub3=5LUJELLY' }
  ];
  function linkForPrice(price) {
    for (var i = 0; i < PRICE_LINKS.length; i++) { if (price <= PRICE_LINKS[i].max) return PRICE_LINKS[i].url; }
    return PRICE_LINKS[PRICE_LINKS.length - 1].url;
  }
  window.jcLinkForPrice = linkForPrice;

  function readCart() {
    try { return JSON.parse(localStorage.getItem('jc_cart') || '[]'); } catch (e) { return []; }
  }

  function paintCount() {
    var n = readCart().length;
    document.querySelectorAll('[data-cart-count]').forEach(function (el) { el.textContent = n; });
  }

  function renderDrawer() {
    var cart     = readCart();
    var itemBox  = document.getElementById('drawer-cart-item');
    var emptyMsg = document.getElementById('drawer-empty');
    var totalBox = document.getElementById('drawer-total');
    var checkout = document.getElementById('drawer-checkout');
    if (!itemBox) return;

    if (cart.length) {
      var item = cart[0];
      var img = document.getElementById('drawer-item-img');
      if (img) { img.src = item.img || ''; img.alt = item.name || ''; }
      document.getElementById('drawer-item-name').textContent = item.name || '';
      document.getElementById('drawer-item-price').textContent = item.price || '';
      itemBox.hidden = false;
      if (emptyMsg) emptyMsg.hidden = true;
      if (totalBox) {
        totalBox.hidden = false;
        document.getElementById('drawer-total-amount').textContent = item.price || '';
      }
      if (checkout) {
        checkout.hidden = false;
        checkout.href = linkForPrice(item.priceValue || 0);
      }
    } else {
      itemBox.hidden = true;
      if (emptyMsg) emptyMsg.hidden = false;
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
  if (removeBtn) {
    removeBtn.addEventListener('click', function () {
      localStorage.setItem('jc_cart', '[]');
      renderDrawer();
      document.dispatchEvent(new CustomEvent('jc:cart-changed'));
    });
  }
  document.addEventListener('jc:open-cart', openDrawer);

  /* --- Compteur du panier (partage entre les pages) ----------------------- */
  paintCount();
})();
