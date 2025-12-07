// Configuración
const weddingDate = new Date('2026-04-11T12:00:00'); // Ajusta hora local del evento
const googleAppsScriptEndpoint = 'https://script.google.com/macros/s/AKfycbxnvn6pMAScEtIj9nbBH15QdiL1Zu175nxFXcXaVFMwrWJ0ngJcPlWyp2aJzdO9G0xb/exec';

// Utilidad: seleccionar
const $ = (sel) => document.querySelector(sel);

// Cuenta atrás
function updateCountdown() {
  const now = new Date();
  const diffMs = weddingDate - now;
  if (diffMs <= 0) {
    ['#days', '#hours', '#minutes', '#seconds'].forEach((id) => { $(id).textContent = '0'; });
    return;
  }
  const seconds = Math.floor(diffMs / 1000);
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  $('#days').textContent = String(days);
  $('#hours').textContent = String(hours).padStart(2, '0');
  $('#minutes').textContent = String(minutes).padStart(2, '0');
  $('#seconds').textContent = String(secs).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Validación y envío de formulario
const form = document.getElementById('rsvp-form');
const statusEl = document.getElementById('form-status');

function showError(id, show) {
  const el = document.getElementById(`error-${id}`);
  if (!el) return;
  el.hidden = !show;
}

function getFormData(formEl) {
  const fd = new FormData(formEl);
  return {
    nombre: (fd.get('nombre') || '').toString().trim(),
    asistencia: (fd.get('asistencia') || '').toString(),
    alergenos: (fd.get('alergenos') || '').toString().trim(),
    bus: (fd.get('bus') || '').toString(),
    cancion: (fd.get('cancion') || '').toString().trim(),
    mensaje: (fd.get('mensaje') || '').toString().trim(),
    timestamp: new Date().toISOString(),
  };
}

function validate(data) {
  let valid = true;
  showError('nombre', !data.nombre);
  if (!data.nombre) valid = false;

  showError('asistencia', !data.asistencia);
  if (!data.asistencia) valid = false;

  showError('alergenos', !data.alergenos);
  if (!data.alergenos) valid = false;

  showError('bus', !data.bus);
  if (!data.bus) valid = false;

  showError('cancion', !data.cancion);
  if (!data.cancion) valid = false;

  return valid;
}

async function submitData(data) {
  if (!googleAppsScriptEndpoint) {
    // Modo demostración: simular envío
    await new Promise((r) => setTimeout(r, 600));
    return { ok: true };
  }
  const res = await fetch(googleAppsScriptEndpoint, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return { ok: res && (res.ok || res.status === 0) };
}

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusEl.textContent = '';
  const data = getFormData(form);
  if (!validate(data)) {
    statusEl.textContent = 'Por favor, revisa los campos marcados.';
    return;
  }
  const btn = form.querySelector('button[type="submit"]');
  const oldLabel = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Enviando…';
  try {
    const res = await submitData(data);
    if (res.ok) {
      statusEl.textContent = '¡Gracias! Hemos registrado tu respuesta.';
      form.reset();
    } else {
      statusEl.textContent = 'No se pudo enviar. Inténtalo de nuevo más tarde.';
    }
  } catch (err) {
    statusEl.textContent = 'Error inesperado. Inténtalo más tarde.';
  } finally {
    btn.disabled = false;
    btn.textContent = oldLabel;
  }
});

// Lightbox functionality
(function initLightbox() {
  const lightbox = $('#lightbox');
  const lightboxImage = $('#lightbox-image');
  const lightboxTitle = $('#lightbox-title');
  const lightboxClose = $('.lightbox-close');
  const galleryImages = document.querySelectorAll('.gallery-image');

  if (!lightbox || !lightboxImage) return;

  function openLightbox(img) {
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    lightboxTitle.textContent = img.alt;
    lightbox.hidden = false;
  }

  function closeLightbox() {
    lightbox.hidden = true;
  }

  // Open lightbox on image click
  galleryImages.forEach((img) => {
    img.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openLightbox(img);
    });
  });

  // Close lightbox on close button click
  if (lightboxClose) {
    lightboxClose.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeLightbox();
    });
  }

  // Close lightbox on background click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Close lightbox on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.hidden) {
      closeLightbox();
    }
  });
})();


