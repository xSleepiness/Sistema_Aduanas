# Sistema de Aduanas - Reserva de Horarios

Un sistema web moderno para la gestión de citas y trámites aduaneros, con calendario interactivo y sistema de reservas en línea.

## 🚀 Características

### ✅ Funcionalidades Principales
- **Calendario Interactivo**: Selección visual de fechas disponibles
- **Sistema de Reservas**: Gestión completa de citas con horarios disponibles
- **Múltiples Servicios**: Importación, Exportación, Certificación y Consultas
- **Validación en Tiempo Real**: Formularios con validación instantánea
- **Diseño Responsive**: Optimizado para dispositivos móviles y desktop
- **Interfaz Moderna**: Diseño profesional con animaciones suaves

### 🎯 Servicios Disponibles
- **Importaciones**: Gestión completa de procesos de importación
- **Exportaciones**: Tramitación de documentos de exportación
- **Certificaciones**: Obtención de certificados aduaneros
- **Consultas**: Información sobre trámites y regulaciones

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Estilos modernos con Flexbox y Grid
- **JavaScript ES6+**: Funcionalidades interactivas
- **Font Awesome**: Iconografía profesional
- **Local Storage**: Persistencia de datos local

## 📁 Estructura del Proyecto

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

## 🚀 Instalación y Uso

### Requisitos Previos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional para desarrollo)

### Instalación
1. Clona o descarga el repositorio
2. Abre `index.html` en tu navegador web
3. ¡El sistema está listo para usar!

### Para Desarrollo
```bash
# Si usas Live Server en VS Code
# 1. Instala la extensión Live Server
# 2. Haz clic derecho en index.html
# 3. Selecciona "Open with Live Server"

# O usa un servidor HTTP simple con Python
python -m http.server 8000
# Luego visita http://localhost:8000
```

## 📋 Cómo Usar el Sistema

### 1. Reservar una Cita

1. **Seleccionar Fecha**: Usa el calendario para elegir un día disponible
   - Solo días laborables están disponibles (lunes-viernes)
   - No se pueden seleccionar fechas pasadas

2. **Elegir Horario**: Selecciona un horario disponible
   - Horarios: 9:00 AM - 4:30 PM
   - Intervalos de 30 minutos

3. **Completar Formulario**: Llena todos los campos requeridos
   - Nombre completo
   - Número de identificación
   - Email
   - Teléfono
   - Tipo de servicio

4. **Confirmar Reserva**: Revisa el resumen y confirma la cita

### 2. Funcionalidades del Calendario

- **Navegación**: Usa las flechas para cambiar de mes
- **Días Disponibles**: En blanco y clickeables
- **Día Actual**: Resaltado en dorado
- **Días No Disponibles**: En gris (fines de semana y fechas pasadas)
- **Día Seleccionado**: Resaltado en azul

### 3. Tipos de Servicios

- **Importación**: Para trámites de importación de mercancías
- **Exportación**: Para documentación de exportación
- **Certificación**: Para obtener certificados aduaneros
- **Consulta General**: Para información y consultas

## ⚙️ Configuración

### Horarios de Atención
Los horarios se pueden modificar en `js/calendar.js`:

```javascript
this.availableHours = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
];
```

### Días No Disponibles
Para cambiar los días no laborables, modifica en `js/calendar.js`:

```javascript
this.unavailableDays = [0, 6]; // 0 = Domingo, 6 = Sábado
```

## 🎨 Personalización

### Colores del Tema
Los colores principales se definen en `css/styles.css`:

```css
:root {
    --primary-blue: #1e3c72;
    --secondary-blue: #2a5298;
    --accent-gold: #ffd700;
    --text-dark: #333;
    --background-light: #f8f9fa;
}
```

### Información de Contacto
Actualiza la información en la sección de contacto del `index.html`:

```html
<div class="contact-item">
    <i class="fas fa-map-marker-alt"></i>
    <div>
        <h3>Dirección</h3>
        <p>Tu dirección aquí</p>
    </div>
</div>
```

## 🔧 Desarrollo y Extensiones

### Agregar Nuevos Servicios
1. Actualiza el select en el HTML
2. Añade el nuevo servicio en `js/booking.js` en el objeto `serviceNames`
3. Agrega una nueva tarjeta de servicio en la sección correspondiente

### Integración con Backend
El sistema está preparado para integración con un backend:

- Las reservas se almacenan en `localStorage` temporalmente
- La clase `BookingSystem` tiene métodos preparados para APIs REST
- Los datos se estructuran de forma compatible con bases de datos

### API Endpoints Sugeridos
```
POST /api/bookings          # Crear nueva reserva
GET  /api/bookings/:id      # Obtener reserva por ID
GET  /api/available-slots   # Obtener horarios disponibles
PUT  /api/bookings/:id      # Actualizar reserva
DELETE /api/bookings/:id    # Cancelar reserva
```

## 🐛 Solución de Problemas

### Problemas Comunes

**El calendario no carga:**
- Verifica que `calendar.js` esté cargado correctamente
- Revisa la consola del navegador para errores

**Los horarios no aparecen:**
- Asegúrate de haber seleccionado una fecha válida
- Verifica que no sea fin de semana

**El formulario no se envía:**
- Revisa que todos los campos requeridos estén completos
- Verifica la validación en tiempo real

### Debugging
Activa el modo debug en la consola:

```javascript
// Ver todas las reservas
console.log(window.bookingSystem.getReservations());

// Ver estado del calendario
console.log(window.calendar.selectedDate);
console.log(window.calendar.selectedTime);
```

## 📱 Compatibilidad

### Navegadores Soportados
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

### Dispositivos
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🤝 Contribuciones

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu característica (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crea un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o consultas:

- **Email**: contacto@aduanas.gov
- **Teléfono**: +1 (555) 123-4567
- **Horario**: Lunes - Viernes, 8:00 AM - 5:00 PM

---

## 🚀 Próximas Funcionalidades

- [ ] Notificaciones por email
- [ ] Integración con API de backend
- [ ] Sistema de usuarios registrados
- [ ] Recordatorios de cita por SMS
- [ ] Dashboard administrativo
- [ ] Reportes y estadísticas
- [ ] Integración con calendario de Google
- [ ] Múltiples idiomas

---

**Versión**: 1.0.0  
**Última actualización**: Julio 2025
