# Invitación de boda · Paula & Borja

Proyecto estático (HTML/CSS/JS) minimalista y responsive. Incluye cuenta atrás, galería, mapa embebido y formulario de asistencia con integración a Google Sheets mediante Apps Script.

## Estructura del proyecto
```
BPB/
├─ index.html
├─ styles/
│  └─ main.css
├─ scripts/
│  └─ main.js
├─ assets/
│  ├─ portada.jpg
│  ├─ galeria-1.jpg
│  ├─ galeria-2.jpg
│  ├─ galeria-3.jpg
│  └─ galeria-4.jpg
└─ README.md
```

## Personalización rápida
- Colores: en `styles/main.css` edita las variables `--primary`, `--accent`, `--bg`, `--text`.
- Tipografías: en `index.html` cambia los `<link>` de Google Fonts y la familia en `body` y `.display`.
- Imágenes: coloca tus fotos en `assets/` y actualiza las rutas en `index.html`.
- Fecha/hora del evento: en `scripts/main.js` ajusta `weddingDate`.

## Google Sheets (Apps Script)
Recomendado por simplicidad, gratis y sin servidor.

1) Crea la hoja
- Abre Google Sheets y crea un documento llamado, por ejemplo, "RSVP Paula & Borja".
- En la primera fila pon cabeceras: `timestamp, nombre, asistencia, alergenos, bus, cancion, mensaje`.

2) Crea el script web
- En la hoja, ve a Extensiones → Apps Script.
- Reemplaza el contenido con este script y guarda:
```javascript
const SHEET_NAME = 'Hoja 1'; // cambia si tu hoja se llama distinto

function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  const data = JSON.parse(e.postData.contents);
  const row = [
    new Date(),
    data.nombre || '',
    data.asistencia || '',
    data.alergenos || '',
    data.bus || '',
    data.cancion || '',
    data.mensaje || ''
  ];
  sheet.appendRow(row);
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```
- Despliega: Implementar → Implementar como aplicación web.
  - Descripción: RSVP
  - Ejecutar como: Tú
  - Quién tiene acceso: Cualquiera con el enlace
  - Haz clic en Implementar y copia la URL del servicio.

3) Conecta desde la web
- En `scripts/main.js` pega la URL en `googleAppsScriptEndpoint`.
- Nota: El modo `no-cors` puede devolver `status 0`, por eso el código ya lo trata como OK si no hay error de red.

## Alternativa: Firebase (opcional)
- Crea un proyecto en Firebase → Firestore Database.
- Habilita reglas de seguridad según tus necesidades (p.ej., sólo escritura).
- Usa el SDK web de Firebase en `index.html` y desde `main.js` añade documentos en una colección `rsvps`.

## Despliegue
- GitHub Pages:
  1. Crea un repositorio y sube estos archivos.
  2. En Settings → Pages, selecciona rama `main`, carpeta `/root` y guarda.
  3. Espera a la publicación y comparte la URL.
- Netlify:
  1. En `app.netlify.com`, botón "Add new site" → "Deploy manually".
  2. Arrastra la carpeta del proyecto. O conecta el repo y selecciona "Static site".
  3. No requiere build; directorio de publicación: raíz.
- Vercel:
  1. Instala Vercel CLI (`npm i -g vercel`) o usa el dashboard.
  2. Ejecuta `vercel` en la carpeta del proyecto y acepta los valores por defecto.
  3. La primera subida crea un proyecto estático con preview y prod.

## Accesibilidad y usabilidad
- Controles con `label`/`legend` asociados y mensajes de error visibles.
- Contraste suficiente en botones y texto (ajusta `--primary`/`--text` si es necesario).
- Navegación por anclas, cabecera sticky y zonas de toque amplias.
- Atributos `alt` en todas las imágenes; `aria-live` en estados del formulario.

## Desarrollo local
- Abre `index.html` en tu navegador.
- Para pruebas con Apps Script, el endpoint debe estar publicado. Alternativamente, simula el envío dejando la variable vacía.

