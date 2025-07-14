<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Sistema de Aduanas - Instrucciones para GitHub Copilot

Este es un proyecto de sitio web para un sistema de aduanas con funcionalidad de reserva de horarios y calendario interactivo.

## Contexto del Proyecto

- **Tipo**: Sitio web estático con JavaScript
- **Propósito**: Sistema de gestión de citas para trámites aduaneros
- **Tecnologías**: HTML5, CSS3, JavaScript ES6+, Font Awesome
- **Características principales**:
  - Calendario interactivo para selección de fechas
  - Sistema de reserva de horarios
  - Formularios de contacto y reserva
  - Diseño responsive y accesible
  - Validación en tiempo real

## Estructura del Proyecto

```
aduanas-sistema/
├── index.html              # Página principal
├── css/
│   └── styles.css          # Estilos principales
├── js/
│   ├── calendar.js         # Lógica del calendario
│   ├── booking.js          # Sistema de reservas
│   └── main.js            # Funcionalidades principales
├── images/                 # Recursos gráficos
├── .github/
│   └── copilot-instructions.md
└── .vscode/
    └── tasks.json
```

## Pautas de Desarrollo

### Estilo y Diseño
- Usar esquema de colores oficial: azul (#1e3c72, #2a5298) y dorado (#ffd700)
- Mantener diseño profesional y gubernamental
- Priorizar accesibilidad (WCAG 2.1)
- Diseño mobile-first y responsive

### JavaScript
- Usar clases ES6+ para organización del código
- Implementar validación robusta de formularios
- Manejar estados de error apropiadamente
- Utilizar localStorage para persistencia básica
- Asegurar compatibilidad con navegadores modernos

### Funcionalidades Específicas

#### Calendario
- Solo días laborables disponibles (lunes-viernes)
- No permitir fechas pasadas
- Horarios disponibles: 9:00 AM - 4:30 PM
- Intervalos de 30 minutos
- Gestionar citas ya reservadas

#### Sistema de Reservas
- Validación en tiempo real de campos
- Confirmación visual de reserva
- Generación de ID único de reserva
- Integración con calendario para actualizar disponibilidad

#### Tipos de Servicios
- Importación
- Exportación 
- Certificación
- Consulta General

### Consideraciones de UX
- Feedback inmediato en todas las interacciones
- Estados de carga para operaciones asíncronas
- Mensajes de error claros y constructivos
- Navegación intuitiva y fluida
- Confirmaciones apropiadas para acciones importantes

### Estándares de Código
- Comentarios en español para funciones principales
- Nombres de variables y funciones descriptivos
- Manejo de errores consistente
- Código modular y reutilizable

## Datos de Ejemplo

Para simulaciones y pruebas, usar:
- Horarios típicos de oficina gubernamental
- Números de identificación de ejemplo
- Direcciones y contactos ficticios pero realistas
- Servicios aduaneros comunes

## Notas Adicionales

- El sistema está diseñado para ser expandible
- Preparado para integración futura con backend
- Considera futuras características como notificaciones email
- Mantiene datos en localStorage como solución temporal
