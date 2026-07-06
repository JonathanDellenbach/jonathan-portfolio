// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Achievement photo slideshows
function initAchievementSlideshows() {
  const mediaEls = document.querySelectorAll('.achieve-media[data-images]');

  mediaEls.forEach(media => {
    let images = [];
    try {
      images = JSON.parse(media.getAttribute('data-images'));
    } catch (e) {
      images = [];
    }
    if (!images.length) return;

    media.classList.add('has-photos');
    media.innerHTML = '';
    const img = document.createElement('img');
    img.src = images[0];
    img.alt = '';
    media.appendChild(img);

    if (images.length > 1) {
      const count = document.createElement('span');
      count.className = 'achieve-count';
      count.textContent = `1 / ${images.length}`;
      media.appendChild(count);
    }

    media.addEventListener('click', () => openLightbox(images, 0));
  });
}

let lightboxState = { images: [], index: 0, overlay: null };

function openLightbox(images, startIndex) {
  lightboxState = { images, index: startIndex, overlay: null };

  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = `
    <button class="lightbox-close" aria-label="Close">&times;</button>
    ${images.length > 1 ? '<button class="lightbox-nav lightbox-prev" aria-label="Previous">&#8249;</button>' : ''}
    ${images.length > 1 ? '<button class="lightbox-nav lightbox-next" aria-label="Next">&#8250;</button>' : ''}
    <div class="lightbox-content">
      <img src="" alt="">
      ${images.length > 1 ? '<span class="lightbox-counter"></span>' : ''}
    </div>
  `;
  document.body.appendChild(overlay);
  lightboxState.overlay = overlay;

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeLightbox();
  });
  overlay.querySelector('.lightbox-close').addEventListener('click', closeLightbox);

  const prevBtn = overlay.querySelector('.lightbox-prev');
  const nextBtn = overlay.querySelector('.lightbox-next');
  if (prevBtn) prevBtn.addEventListener('click', () => stepLightbox(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => stepLightbox(1));

  document.addEventListener('keydown', handleLightboxKeydown);

  // Touch swipe support for mobile
  let touchStartX = null;
  overlay.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  overlay.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    const SWIPE_THRESHOLD = 40;
    if (Math.abs(deltaX) > SWIPE_THRESHOLD && images.length > 1) {
      stepLightbox(deltaX < 0 ? 1 : -1);
    }
    touchStartX = null;
  }, { passive: true });

  renderLightbox();
}

function renderLightbox() {
  const { images, index, overlay } = lightboxState;
  if (!overlay) return;
  overlay.querySelector('img').src = images[index];
  const counter = overlay.querySelector('.lightbox-counter');
  if (counter) counter.textContent = `${index + 1} / ${images.length}`;
}

function stepLightbox(direction) {
  const { images } = lightboxState;
  lightboxState.index = (lightboxState.index + direction + images.length) % images.length;
  renderLightbox();
}

function handleLightboxKeydown(e) {
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') stepLightbox(-1);
  if (e.key === 'ArrowRight') stepLightbox(1);
}

function closeLightbox() {
  if (lightboxState.overlay) {
    lightboxState.overlay.remove();
    lightboxState.overlay = null;
  }
  document.removeEventListener('keydown', handleLightboxKeydown);
}

initAchievementSlideshows();

// About page: stacked photo tab
function initPhotoStack() {
  const stack = document.querySelector('.photo-stack[data-images]');
  if (!stack) return;

  let images = [];
  try {
    images = JSON.parse(stack.getAttribute('data-images'));
  } catch (e) {
    images = [];
  }
  if (!images.length) return;

  const cards = stack.querySelectorAll('.stack-card');
  cards.forEach((card, i) => {
    if (i >= images.length) return;
    card.innerHTML = '';
    const img = document.createElement('img');
    img.src = images[i];
    img.alt = '';
    card.appendChild(img);
  });

  stack.addEventListener('click', () => openLightbox(images, 0));
}

initPhotoStack();

// Mobile sidebar toggle
const navToggle = document.querySelector('.mobile-toggle');
const sidebar = document.querySelector('.sidebar');
if (navToggle && sidebar) {
  navToggle.addEventListener('click', () => {
    const isOpen = sidebar.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });
  sidebar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      sidebar.classList.remove('open');
      navToggle.setAttribute('aria-expanded', false);
    });
  });
}