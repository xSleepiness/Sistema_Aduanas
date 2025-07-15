# 🏛️ Sistema Integral de Aduanas - Chile

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/xSleepiness/Sistema_Aduanas)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-active-success.svg)]()

Un sistema web integral para la gestión de trámites aduaneros del Servicio Nacional de Aduanas de Chile, que incluye múltiples módulos especializados para diferentes tipos de usuarios y servicios.

## 🎯 Descripción General

El Sistema Integral de Aduanas es una plataforma web moderna que centraliza todos los servicios aduaneros de Chile en una sola interfaz. Proporciona acceso seguro y eficiente a diferentes módulos especializados según el tipo de usuario y servicio requerido.

## 🏗️ Arquitectura del Sistema

```
Sistema_Aduanas/
├── index.html                  # Portal principal de acceso
├── personal/                   # Módulo de Personal y Ciudadanos
├── sistema/                    # Módulo de Monitoreo y Sistemas
├── viajero/                    # Módulo para Viajeros
├── pdi-sag/                    # Módulo PDI-SAG Control Aduanero
└── README.md                   # Este archivo
```

## 🚀 Módulos del Sistema

### 1. 🏠 **Portal Principal** (`/index.html`)
- **Propósito**: Punto de entrada unificado al sistema
- **Características**:
  - Interfaz moderna con gradientes corporativos
  - Navegación intuitiva a los 4 módulos
  - Diseño responsive y accesible
  - Efectos visuales y animaciones suaves

### 2. 👥 **Módulo Personal** (`/personal/`)
- **Propósito**: Gestión de citas y servicios para ciudadanos y administradores
- **Usuarios**: Ciudadanos, Personal administrativo
- **Características**:
  - Sistema de reservas de horarios
  - Calendario interactivo
  - Portal ciudadano y portal administrativo
  - Gestión de trámites generales
  - Validación en tiempo real

**Archivos principales**:
```
personal/
├── index.html              # Página principal del módulo
├── citizen-portal.html     # Portal para ciudadanos
├── admin-portal.html       # Portal administrativo
├── document-qualification.html # Calificación de documentos
├── css/styles.css          # Estilos unificados
└── js/                     # Scripts funcionales
    ├── main.js
    ├── calendar.js
    ├── booking.js
    └── [otros scripts]
```

### 3. 📊 **Módulo Sistema** (`/sistema/`)
- **Propósito**: Monitoreo y gestión técnica del sistema
- **Usuarios**: Administradores de sistema, Personal técnico
- **Características**:
  - Monitoreo en tiempo real de servicios
  - Reportes de rendimiento
  - Tests de conectividad y APIs
  - Generación de reportes de errores
  - Dashboard de estados de servicios

**Archivos principales**:
```
sistema/
├── index.html                    # Dashboard principal
├── rendimiento.html              # Test de rendimiento
├── test-http.html               # Pruebas HTTPS
├── test-sistema-aduanas.html    # Test APIs Aduanas
├── test-gestion-usuarios.html   # Test gestión usuarios
├── test-documentos.html         # Test documentos
├── generar-reporte.html         # Generador de reportes
└── src/
    ├── app.js
    └── data.js
```

### 4. ✈️ **Módulo Viajero** (`/viajero/`)
- **Propósito**: Servicios específicos para viajeros y turistas
- **Usuarios**: Viajeros, Turistas, Personas en tránsito
- **Características**:
  - Dashboard personalizado
  - Declaraciones aduaneras
  - Gestión de documentos de viaje
  - Historial de trámites
  - Pagos en línea

**Archivos principales**:
```
viajero/
├── main.html               # Login principal
├── Dashboard.html          # Panel de control
├── Declaracion.html        # Declaraciones aduaneras
├── Documentos.html         # Gestión de documentos
├── Pagos.html             # Sistema de pagos
├── Perfil.html            # Perfil de usuario
├── Reserva.html           # Reservas de servicios
└── Tramites.html          # Gestión de trámites
```

### 5. 🔍 **Módulo PDI-SAG** (`/pdi-sag/`)
- **Propósito**: Sistema de control aduanero para PDI y SAG
- **Usuarios**: Personal PDI, Personal SAG, Inspectores
- **Características**:
  - Formularios especializados de control
  - Validación de documentos
  - Sistema de declaraciones SAG
  - Control migratorio PDI
  - Gestión de infracciones y multas

**Funcionalidades específicas**:
- **Control SAG**: Declaraciones de productos agrícolas, mascotas, alimentos
- **Control PDI**: Autorizaciones de menores, control migratorio
- **Usuarios de prueba**: `sag/sag123`, `pdi/pdi123`
- **Autocompletado inteligente** con datos preconfigurados

## 🎨 Diseño y UX

### Paleta de Colores Unificada
- **Azul Corporativo**: `#1e3c72` → `#2a5298` (gradiente)
- **Dorado/Acentos**: `#ffd700`
- **Fondos**: `rgba(255, 255, 255, 0.95)` con `backdrop-filter: blur(10px)`
- **Texto**: `#333` (principal), `#666` (secundario)

### Características de Diseño
- **Glassmorphism**: Efectos de transparencia y blur
- **Responsive Design**: Adaptable a todos los dispositivos
- **Animaciones Suaves**: Transiciones y efectos hover
- **Accesibilidad**: Diseño inclusivo y navegable
- **Consistencia Visual**: Mismo look & feel en todos los módulos

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con Flexbox/Grid
- **JavaScript ES6+**: Funcionalidades interactivas
- **Font Awesome 6.0**: Iconografía profesional

### Herramientas de Desarrollo
- **VS Code**: Editor principal
- **TailwindCSS**: Framework CSS (módulo sistema)
- **Chart.js**: Gráficos y visualizaciones
- **Local Storage**: Persistencia de datos

### Librerías Específicas
- **Google Fonts**: Tipografías (Pacifico, Roboto)
- **Backdrop Filters**: Efectos visuales modernos
- **CSS Custom Properties**: Variables CSS

## 🚀 Instalación y Configuración

### Requisitos Previos
- Navegador web moderno (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)
- Servidor web local (opcional, para desarrollo)

### Instalación Local
```bash
# Clonar el repositorio
git clone https://github.com/xSleepiness/Sistema_Aduanas.git

# Navegar al directorio
cd Sistema_Aduanas

# Abrir en navegador
# Opción 1: Abrir index.html directamente
open index.html

# Opción 2: Usar servidor local (recomendado)
python -m http.server 8000
# o
npx serve .
```

### Estructura de URLs
```
http://localhost:8000/                    # Portal principal
http://localhost:8000/personal/          # Módulo Personal
http://localhost:8000/sistema/           # Módulo Sistema
http://localhost:8000/viajero/main.html  # Módulo Viajero
http://localhost:8000/pdi-sag/           # Módulo PDI-SAG
```

## 👤 Usuarios de Prueba

### Módulo PDI-SAG
| Usuario | Contraseña | Tipo | Acceso |
|---------|-----------|------|--------|
| `sag` | `sag123` | SAG | Declaraciones agrícolas |
| `pdi` | `pdi123` | PDI | Control migratorio |

### Datos Preconfigurados
| RUT | Nombre | Matrícula | Estado |
|-----|--------|-----------|--------|
| `12345678-9` | Orlando Perez | `AA1111` | Sin infracciones |
| `98765432-1` | Juan Malo | `BB2222` | Con multas/antecedentes |

## 📱 Funcionalidades por Módulo

### Personal
- ✅ Reserva de citas
- ✅ Calendario interactivo
- ✅ Portal ciudadano/administrativo
- ✅ Gestión de documentos
- ✅ Validaciones en tiempo real

### Sistema
- ✅ Monitoreo de servicios
- ✅ Tests de rendimiento
- ✅ Reportes automáticos
- ✅ Dashboard en tiempo real
- ✅ Análisis de conectividad

### Viajero
- ✅ Login seguro
- ✅ Dashboard personalizado
- ✅ Declaraciones aduaneras
- ✅ Gestión de pagos
- ✅ Historial de trámites

### PDI-SAG
- ✅ Formularios especializados
- ✅ Autocompletado inteligente
- ✅ Validación de datos
- ✅ Control de infracciones
- ✅ Declaraciones SAG/PDI

## 🔧 Configuración de Desarrollo

### VS Code (Recomendado)
```json
// .vscode/settings.json
{
  "liveServer.settings.port": 5501,
  "html.format.indentInnerHtml": true,
  "css.validate": true,
  "javascript.validate.enable": true
}
```

### Tareas Automatizadas
```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Live Server",
      "type": "shell",
      "command": "npx serve .",
      "group": "build"
    }
  ]
}
```

## 📊 Métricas del Proyecto

- **Líneas de Código**: ~3,500+ líneas
- **Archivos HTML**: 15+ páginas
- **Módulos**: 4 sistemas integrados
- **Tiempo de Carga**: < 2 segundos
- **Compatibilidad**: 95%+ navegadores modernos

## 🤝 Contribución

### Guías para Contribuir
1. **Fork** el repositorio
2. **Crea** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre** un Pull Request

### Estándares de Código
- **Indentación**: 4 espacios
- **Nombres**: camelCase para JS, kebab-case para CSS
- **Comentarios**: JSDoc para funciones complejas
- **Validación**: HTML5 válido, CSS3 compatible

## 🐛 Reporte de Bugs

Para reportar bugs, utiliza el [sistema de issues](https://github.com/xSleepiness/Sistema_Aduanas/issues) con:

1. **Descripción clara** del problema
2. **Pasos para reproducir** el bug
3. **Comportamiento esperado**
4. **Screenshots** (si aplica)
5. **Información del navegador**

##  Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**xSleepiness**
- GitHub: [@xSleepiness](https://github.com/xSleepiness)
- Proyecto: [Sistema_Aduanas](https://github.com/xSleepiness/Sistema_Aduanas)

## 🙏 Agradecimientos

- **Servicio Nacional de Aduanas de Chile** por la inspiración del diseño
- **Font Awesome** por los iconos
- **Google Fonts** por las tipografías
- **VS Code** por el excelente entorno de desarrollo

---

**⭐ Si este proyecto te fue útil, no olvides darle una estrella en GitHub!**

> **Nota**: Este es un proyecto educativo/demo que simula un sistema aduanero. No debe utilizarse para trámites oficiales reales.
