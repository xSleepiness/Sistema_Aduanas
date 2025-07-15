# 📋 Documentación Técnica - Sistema Integral de Aduanas

## 🏗️ Arquitectura Detallada

### Estructura de Archivos Completa

```
Sistema_Aduanas/
├── 📄 index.html                           # Portal principal
├── 📄 README.md                            # Documentación principal
├── 📄 DOCS.md                              # Esta documentación técnica
│
├── 📁 personal/                            # Módulo Personal
│   ├── 📄 index.html                       # Página principal
│   ├── 📄 admin-portal.html                # Portal administrativo
│   ├── 📄 citizen-portal.html              # Portal ciudadano
│   ├── 📄 document-qualification.html      # Calificación documentos
│   ├── 📄 test-admin.html                  # Pruebas admin
│   ├── 📄 test-button.html                 # Pruebas UI
│   ├── 📄 test-script.js                   # Scripts de prueba
│   ├── 📄 remove-duplicates.ps1            # Script PowerShell
│   ├── 📁 css/
│   │   ├── 📄 styles.css                   # Estilos principales
│   │   └── 📄 styles.css.backup            # Respaldo
│   ├── 📁 js/
│   │   ├── 📄 main.js                      # Funciones principales
│   │   ├── 📄 calendar.js                  # Calendario
│   │   ├── 📄 booking.js                   # Reservas
│   │   ├── 📄 documents.js                 # Documentos
│   │   ├── 📄 admin.js                     # Admin functions
│   │   ├── 📄 audit.js                     # Auditoría
│   │   ├── 📄 minors.js                    # Menores
│   │   ├── 📄 tourism.js                   # Turismo
│   │   └── 📄 vehicles.js                  # Vehículos
│   └── 📁 images/
│       ├── 🖼️ aduanas-chile-header.jpg     # Header imagen
│       ├── 🖼️ aduanas-chile-header.svg     # Header SVG
│       ├── 🖼️ aduanas-logo-temp.svg        # Logo temporal
│       └── 🖼️ aduanas-logo.png             # Logo PNG
│
├── 📁 sistema/                             # Módulo Sistema
│   ├── 📄 index.html                       # Dashboard principal
│   ├── 📄 rendimiento.html                 # Test rendimiento
│   ├── 📄 test-http.html                   # Test HTTPS
│   ├── 📄 test-sistema-aduanas.html        # Test API Aduanas
│   ├── 📄 test-gestion-usuarios.html       # Test usuarios
│   ├── 📄 test-documentos.html             # Test documentos
│   ├── 📄 generar-reporte.html             # Reportes
│   └── 📁 src/
│       ├── 📄 app.js                       # App principal
│       └── 📄 data.js                      # Datos
│
├── 📁 viajero/                             # Módulo Viajero
│   ├── 📄 main.html                        # Login principal
│   ├── 📄 Dashboard.html                   # Panel control
│   ├── 📄 Declaracion.html                 # Declaraciones
│   ├── 📄 Documentos.html                  # Documentos
│   ├── 📄 Pagos.html                       # Pagos
│   ├── 📄 Perfil.html                      # Perfil usuario
│   ├── 📄 Reserva.html                     # Reservas
│   ├── 📄 Tramites.html                    # Trámites
│   └── 🖼️ [imágenes sociales y logos]      # Assets
│
└── 📁 pdi-sag/                             # Módulo PDI-SAG
    └── 📄 index.html                       # Sistema completo
```

## 🎨 Guía de Estilos y Diseño

### Paleta de Colores CSS

```css
:root {
  /* Colores Principales */
  --primary-blue-start: #1e3c72;
  --primary-blue-end: #2a5298;
  --accent-gold: #ffd700;
  --accent-gold-light: #ffed4e;
  
  /* Fondos */
  --bg-gradient: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  --bg-card: rgba(255, 255, 255, 0.95);
  --bg-overlay: rgba(255, 255, 255, 0.05);
  
  /* Texto */
  --text-primary: #333;
  --text-secondary: #666;
  --text-blue: #1e3c72;
  
  /* Bordes */
  --border-gold: rgba(255, 215, 0, 0.3);
  --border-light: #e0e0e0;
  
  /* Sombras */
  --shadow-card: 0 10px 30px rgba(0, 0, 0, 0.2);
  --shadow-hover: 0 20px 40px rgba(0, 0, 0, 0.3);
  --shadow-button: 0 5px 15px rgba(30, 60, 114, 0.4);
}
```

### Componentes Reutilizables

#### Botón Primario
```css
.btn-primary {
  background: linear-gradient(135deg, var(--primary-blue-start) 0%, var(--primary-blue-end) 100%);
  color: white;
  padding: 15px 30px;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-primary:hover {
  background: linear-gradient(135deg, var(--primary-blue-end) 0%, var(--primary-blue-start) 100%);
  transform: translateY(-2px);
  box-shadow: var(--shadow-button);
}
```

#### Tarjeta con Glassmorphism
```css
.glass-card {
  background: var(--bg-card);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: var(--shadow-card);
  border: 2px solid var(--border-gold);
  padding: 2rem;
}
```

#### Input Moderno
```css
.modern-input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid var(--border-light);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
}

.modern-input:focus {
  outline: none;
  border-color: var(--text-blue);
  box-shadow: 0 0 0 3px rgba(30, 60, 114, 0.1);
}
```

## 🔧 APIs y Funciones JavaScript

### Módulo PDI-SAG - Funciones Principales

#### Gestión de Estado
```javascript
// Estado global de la aplicación
let appState = {
  loggedUser: null,
  usuario: { rut: "", nombre: "", apellido: "", ciudad: "", correo: "", origen: "", destino: "" },
  sag: {},
  pdi: {},
  userErrors: {},
  wrongFields: [],
  userFound: null,
  showUserPreview: false
};

// Inicialización de estado
function getInitialState(fields) {
  const state = {};
  fields.forEach(field => {
    state[field.name] = "";
  });
  return state;
}
```

#### Validación de Formularios
```javascript
function checkUserForm() {
  const userFields = ["rut", "nombre", "apellido", "ciudad", "correo", "origen", "destino"];
  let wrongFieldsArr = [];
  
  // Validar campos básicos
  userFields.forEach(f => {
    if (!usuario[f]) wrongFieldsArr.push(f);
  });
  
  // Validación específica por módulo
  if (loggedUser === "sag") {
    validateSAGForm(wrongFieldsArr);
  }
  
  if (loggedUser === "pdi") {
    validatePDIForm(wrongFieldsArr);
  }
  
  return wrongFieldsArr.length === 0;
}
```

#### Autocompletado Inteligente
```javascript
function handleRutChange(value) {
  usuario.rut = value;
  const user = users.find(u => u.rut === value);
  userFound = user || null;
  showUserPreview = false;
  render();
}

function handleUserSelect(user) {
  // Autorellenar todos los campos del usuario
  usuario = { ...user };
  
  // Configurar datos del vehículo
  const vehiculo = vehiculos.find(v => v.matricula === user.matricula);
  if (vehiculo) {
    setupVehicleData(vehiculo);
  }
  
  render();
}
```

### Módulo Personal - Calendario

#### Inicialización del Calendario
```javascript
class Calendar {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentDate = new Date();
    this.selectedDate = null;
    this.availableSlots = [];
  }
  
  render() {
    const calendarHTML = this.generateCalendarHTML();
    this.container.innerHTML = calendarHTML;
    this.attachEventListeners();
  }
  
  generateCalendarHTML() {
    // Lógica de generación del calendario
    return calendarHTML;
  }
}
```

#### Sistema de Reservas
```javascript
class BookingSystem {
  constructor() {
    this.bookings = JSON.parse(localStorage.getItem('bookings')) || [];
  }
  
  createBooking(bookingData) {
    const booking = {
      id: this.generateId(),
      ...bookingData,
      createdAt: new Date(),
      status: 'pending'
    };
    
    this.bookings.push(booking);
    this.saveToStorage();
    return booking;
  }
  
  saveToStorage() {
    localStorage.setItem('bookings', JSON.stringify(this.bookings));
  }
}
```

### Módulo Sistema - Monitoreo

#### Test de Conectividad
```javascript
async function testConnectivity() {
  const endpoints = [
    { name: 'API Principal', url: '/api/health' },
    { name: 'Base de Datos', url: '/api/db-status' },
    { name: 'Servicios Externos', url: '/api/external-status' }
  ];
  
  const results = await Promise.all(
    endpoints.map(async endpoint => {
      try {
        const response = await fetch(endpoint.url);
        return {
          ...endpoint,
          status: response.ok ? 'OK' : 'ERROR',
          responseTime: response.headers.get('x-response-time')
        };
      } catch (error) {
        return {
          ...endpoint,
          status: 'ERROR',
          error: error.message
        };
      }
    })
  );
  
  return results;
}
```

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
/* Base: 320px+ */
.container {
  padding: 1rem;
}

/* Tablet: 768px+ */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
    max-width: 750px;
  }
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
  }
  
  .modules-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Large Desktop: 1440px+ */
@media (min-width: 1440px) {
  .modules-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### Grid System
```css
.grid {
  display: grid;
  gap: 2rem;
}

.grid-1 { grid-template-columns: 1fr; }
.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-4 { grid-template-columns: repeat(4, 1fr); }

.grid-auto { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
```

## 🔐 Seguridad y Validación

### Validación de Entrada
```javascript
// Validación de RUT chileno
function validateRUT(rut) {
  const rutRegex = /^[0-9]+[-|‐]{1}[0-9kK]{1}$/;
  return rutRegex.test(rut);
}

// Sanitización de inputs
function sanitizeInput(input) {
  return input
    .replace(/[<>]/g, '') // Remover tags HTML básicos
    .trim()
    .substring(0, 255); // Limitar longitud
}

// Validación de email
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

### Protección XSS
```javascript
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
```

## 🚀 Optimización y Rendimiento

### Lazy Loading
```javascript
// Lazy loading de imágenes
function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}
```

### Debounce para Inputs
```javascript
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Uso en búsqueda
const searchInput = document.getElementById('search');
const debouncedSearch = debounce(performSearch, 300);
searchInput.addEventListener('input', debouncedSearch);
```

### Cache de LocalStorage
```javascript
class LocalCache {
  constructor(prefix = 'aduanas_') {
    this.prefix = prefix;
  }
  
  set(key, value, ttl = 3600000) { // 1 hora por defecto
    const item = {
      value,
      timestamp: Date.now(),
      ttl
    };
    localStorage.setItem(this.prefix + key, JSON.stringify(item));
  }
  
  get(key) {
    const item = localStorage.getItem(this.prefix + key);
    if (!item) return null;
    
    const parsed = JSON.parse(item);
    if (Date.now() - parsed.timestamp > parsed.ttl) {
      this.remove(key);
      return null;
    }
    
    return parsed.value;
  }
  
  remove(key) {
    localStorage.removeItem(this.prefix + key);
  }
}
```

## 🧪 Testing y Debugging

### Console Logging
```javascript
// Sistema de logging configurável
const Logger = {
  level: 'info', // 'error', 'warn', 'info', 'debug'
  
  error: (message, data) => {
    if (['error'].includes(Logger.level)) {
      console.error(`[ERROR] ${message}`, data);
    }
  },
  
  warn: (message, data) => {
    if (['error', 'warn'].includes(Logger.level)) {
      console.warn(`[WARN] ${message}`, data);
    }
  },
  
  info: (message, data) => {
    if (['error', 'warn', 'info'].includes(Logger.level)) {
      console.info(`[INFO] ${message}`, data);
    }
  },
  
  debug: (message, data) => {
    if (['error', 'warn', 'info', 'debug'].includes(Logger.level)) {
      console.log(`[DEBUG] ${message}`, data);
    }
  }
};
```

### Error Handling
```javascript
// Manejo global de errores
window.addEventListener('error', (event) => {
  Logger.error('Global Error:', {
    message: event.error.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: event.error.stack
  });
});

// Manejo de promesas rechazadas
window.addEventListener('unhandledrejection', (event) => {
  Logger.error('Unhandled Promise Rejection:', event.reason);
});
```

## 📊 Analytics y Métricas

### Performance Monitoring
```javascript
// Medición de Performance
function measurePerformance(name, fn) {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  Logger.info(`Performance [${name}]: ${(end - start).toFixed(2)}ms`);
  return result;
}

// Web Vitals
function trackWebVitals() {
  // Largest Contentful Paint
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      Logger.info('LCP:', entry.startTime);
    }
  }).observe({entryTypes: ['largest-contentful-paint']});
  
  // First Input Delay
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      Logger.info('FID:', entry.processingStart - entry.startTime);
    }
  }).observe({entryTypes: ['first-input']});
}
```

## 🔧 Configuración de Desarrollo

### ESLint Configuration
```json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": ["eslint:recommended"],
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "rules": {
    "indent": ["error", 2],
    "quotes": ["error", "single"],
    "semi": ["error", "always"]
  }
}
```

### Prettier Configuration
```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "quoteProps": "as-needed",
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "always"
}
```

---

Esta documentación técnica proporciona una guía completa para desarrolladores que trabajen con el Sistema Integral de Aduanas, incluyendo patrones de código, mejores prácticas y herramientas de desarrollo.
