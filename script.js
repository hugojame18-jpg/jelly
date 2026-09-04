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
      dot.setAttribute('aria-label', 'Aller \u00e0 la diapositive ' + (i + 1));
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
  var overlay = document.getElementById('drawer-overlay');
  var drawer  = document.getElementById('cart-drawer');
  var closeBtn = document.getElementById('drawer-close');

  function openDrawer() {
    if (!overlay || !drawer) return;
    var cartItem = document.getElementById('drawer-cart-item');
    var cartName = document.getElementById('drawer-item-name');
    if (cartItem && cartName) {
      try {
        var c = JSON.parse(localStorage.getItem('jc_cart') || '[]');
        if (c.length) {
          cartName.textContent = c[0].name + ' — ' + c[0].price;
          cartItem.hidden = false;
        } else {
          cartItem.hidden = true;
        }
      } catch (e) { cartItem.hidden = true; }
    }
    overlay.classList.add('open');
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

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

  /* --- Compteur du panier (partage entre les pages) ----------------------- */
  var counters = document.querySelectorAll('[data-cart-count]');
  if (counters.length) {
    var n = 0;
    try { n = (JSON.parse(localStorage.getItem('jc_cart') || '[]') || []).length; } catch (e) { n = 0; }
    counters.forEach(function (el) { el.textContent = n; });
  }
})();
