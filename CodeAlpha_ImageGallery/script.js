document.addEventListener('DOMContentLoaded', () => {
  const cards = Array.from(document.querySelectorAll('#gallery .card'));
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.querySelector('.lb-image');
  const lbCaption = document.querySelector('.lb-caption');
  const btnClose = document.querySelector('.lb-close');
  const btnPrev = document.querySelector('.lb-prev');
  const btnNext = document.querySelector('.lb-next');
  const btnZoom = document.querySelector('.lb-zoom');
  const btnDownload = document.querySelector('.lb-download');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const filterBtns = Array.from(document.querySelectorAll('.filter-btn'));

  let currentIndex = -1;
  let currentVisible = [];

  function getVisibleImages() {
    return Array.from(document.querySelectorAll('#gallery .card'))
      .filter(c => c.style.display !== 'none')
      .map(c => c.querySelector('img'));
  }

  function openLightboxByImg(img) {
    const visible = getVisibleImages();
    const idx = visible.indexOf(img);
    if (idx === -1) return;
    openLightbox(idx, visible);
  }

  function openLightbox(index, visibleList) {
    const list = visibleList || getVisibleImages();
    const img = list[index];
    if (!img) return;
    currentVisible = list;
    currentIndex = index;
    lbImage.src = img.src;
    lbImage.style.width = 'auto';
    lbImage.style.height = 'auto';
    lbImage.alt = img.alt || '';
    const caption = img.closest('.card')?.querySelector('.caption')?.textContent || '';
    lbCaption.textContent = caption;
    lightbox.classList.remove('hidden');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.add('hidden');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    currentIndex = -1;
    currentVisible = [];
  }

  function showPrev() {
    if (!currentVisible.length) currentVisible = getVisibleImages();
    currentIndex = (currentIndex - 1 + currentVisible.length) % currentVisible.length;
    const img = currentVisible[currentIndex];
    lbImage.src = img.src;
    lbImage.style.width = 'auto';
    lbImage.style.height = 'auto';
    lbCaption.textContent = img.closest('.card')?.querySelector('.caption')?.textContent || '';
  }

  function showNext() {
    if (!currentVisible.length) currentVisible = getVisibleImages();
    currentIndex = (currentIndex + 1) % currentVisible.length;
    const img = currentVisible[currentIndex];
    lbImage.src = img.src;
    lbImage.style.width = 'auto';
    lbImage.style.height = 'auto';
    lbCaption.textContent = img.closest('.card')?.querySelector('.caption')?.textContent || '';
  }

  
  document.querySelectorAll('#gallery .card img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => openLightboxByImg(img));
    img.addEventListener('keydown', e => { if (e.key === 'Enter') openLightboxByImg(img); });
  });

  btnClose.addEventListener('click', closeLightbox);
  btnPrev.addEventListener('click', showPrev);
  btnNext.addEventListener('click', showNext);
  
  if(btnZoom){
    btnZoom.addEventListener('click', () => {
      if(lbImage.classList.contains('zoomed')) lbImage.classList.remove('zoomed');
      else lbImage.classList.add('zoomed');
    });
    
    lbImage.addEventListener('dblclick', () => btnZoom.click());
  }

  
  if(btnDownload){
    btnDownload.addEventListener('click', () => {
      const url = lbImage.src;
      if(!url) return;
      const a = document.createElement('a');
      a.href = url;
      a.download = url.split('/').pop().split('?')[0];
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  }

  
  if(navToggle && navLinks){
    navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  }

  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) card.style.display = '';
        else card.style.display = 'none';
      });
    });
  });
});
