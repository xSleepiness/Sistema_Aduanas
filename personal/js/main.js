// Funcionalidades principales del sitio
class AduanasSystem {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupSmoothScrolling();
        this.setupMobileMenu();
        this.setupFormAnimations();
        this.setupLoadingStates();
        this.observeElements();
    }
    
    // Desplazamiento suave para los enlaces de navegación
    setupSmoothScrolling() {
        const navLinks = document.querySelectorAll('.nav a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Menú móvil (para responsive)
    setupMobileMenu() {
        // Crear botón de menú hamburguesa si no existe
        const header = document.querySelector('.header .container');
        const nav = document.querySelector('.nav');
        
        if (!document.querySelector('.mobile-menu-toggle')) {
            const menuToggle = document.createElement('button');
            menuToggle.className = 'mobile-menu-toggle';
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            menuToggle.style.display = 'none';
            
            // Estilos del botón
            menuToggle.style.cssText = `
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 10px;
                display: none;
            `;
            
            header.appendChild(menuToggle);
            
            // Funcionalidad del menú
            menuToggle.addEventListener('click', () => {
                nav.classList.toggle('mobile-nav-open');
            });
        }
        
        // Responsive styles
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .mobile-menu-toggle {
                    display: block !important;
                }
                
                .nav {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    width: 100%;
                    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.3s ease;
                }
                
                .nav.mobile-nav-open {
                    max-height: 300px;
                }
                
                .nav ul {
                    flex-direction: column;
                    padding: 20px;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Animaciones para formularios
    setupFormAnimations() {
        const formGroups = document.querySelectorAll('.form-group');
        
        formGroups.forEach(group => {
            const input = group.querySelector('input, select, textarea');
            const label = group.querySelector('label');
            
            if (input && label) {
                // Efecto de enfoque
                input.addEventListener('focus', () => {
                    group.classList.add('focused');
                });
                
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        group.classList.remove('focused');
                    }
                });
                
                // Si ya tiene valor al cargar
                if (input.value) {
                    group.classList.add('focused');
                }
            }
        });
    }
    
    // Estados de carga para botones (mejorado para múltiples formularios)
    setupLoadingStates() {
        // Botón de reserva principal
        const submitButton = document.querySelector('.btn-book');
        if (submitButton) {
            const originalText = submitButton.textContent;
            
            document.getElementById('bookingForm')?.addEventListener('submit', () => {
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
                
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                }, 2000);
            });
        }
        
        // Formulario de turismo
        const tourismForm = document.getElementById('tourismForm');
        if (tourismForm) {
            tourismForm.addEventListener('submit', (e) => {
                const submitBtn = tourismForm.querySelector('button[type="submit"]');
                if (submitBtn) {
                    const originalText = submitBtn.textContent;
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
                    
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                    }, 1500);
                }
            });
        }
        
        // Formulario de menores
        const minorsForm = document.getElementById('minorsForm');
        if (minorsForm) {
            minorsForm.addEventListener('submit', (e) => {
                const submitBtn = minorsForm.querySelector('button[type="submit"]');
                if (submitBtn) {
                    const originalText = submitBtn.textContent;
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
                    
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                    }, 2000);
                }
            });
        }
        
        // Formulario de login
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                const submitBtn = loginForm.querySelector('button[type="submit"]');
                if (submitBtn) {
                    const originalText = submitBtn.textContent;
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
                    
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                    }, 1000);
                }
            });
        }
    }
    
    // Observador de intersección para animaciones
    observeElements() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observar elementos que se deben animar (incluyendo nuevas secciones)
        const animatedElements = document.querySelectorAll(
            '.service-card, .contact-item, .calendar-section, .time-slots-section, .booking-form-section, .tourism-card, .requirement-item, .tourism-form, .minors-form'
        );
        
        animatedElements.forEach(el => {
            observer.observe(el);
        });
        
        // Estilos CSS para las animaciones
        const animationStyles = document.createElement('style');
        animationStyles.textContent = `
            .service-card,
            .contact-item,
            .calendar-section,
            .time-slots-section,
            .booking-form-section,
            .tourism-card,
            .requirement-item,
            .tourism-form,
            .minors-form {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s ease;
            }
            
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            
            .form-group.focused label {
                color: #2a5298;
                transform: translateY(-2px);
            }
            
            .btn-book:disabled {
                opacity: 0.7;
                cursor: not-allowed;
            }
        `;
        document.head.appendChild(animationStyles);
    }
    
    // Utilidades
    static formatDate(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            ...options
        };
        return date.toLocaleDateString('es-ES', defaultOptions);
    }
    
    static formatTime(time) {
        return time.replace(':', ':');
    }
    
    static showNotification(message, type = 'info') {
        // Crear notificación temporal
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Estilos
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#2a5298'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Mostrar
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Ocultar después de 3 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Método para validar RUT/CI (personalizable según el país)
    static validateIdNumber(idNumber) {
        // Ejemplo básico - puede ser personalizado según el país
        const cleaned = idNumber.replace(/[^0-9]/g, '');
        return cleaned.length >= 6 && cleaned.length <= 12;
    }
    
    // Método para formatear teléfono
    static formatPhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 10) {
            return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        }
        return phone;
    }
    
    // Integración con calendario - métodos de utilidad
    static initializeCalendarIntegration() {
        // Verificar que el calendario esté disponible
        if (window.calendar) {
            // Configurar eventos personalizados para el calendario
            document.addEventListener('calendarDateSelected', (e) => {
                AduanasSystem.showNotification(`Fecha seleccionada: ${e.detail.date}`, 'info');
            });
            
            document.addEventListener('calendarTimeSelected', (e) => {
                AduanasSystem.showNotification(`Horario seleccionado: ${e.detail.time}`, 'success');
            });
        }
    }
    
    // Validación específica para formularios de aduanas
    static validateAduanasForm(formType, formData) {
        switch (formType) {
            case 'booking':
                return AduanasSystem.validateBookingForm(formData);
            case 'tourism':
                return AduanasSystem.validateTourismForm(formData);
            case 'minors':
                return AduanasSystem.validateMinorsForm(formData);
            default:
                return { isValid: false, errors: ['Tipo de formulario no reconocido'] };
        }
    }
    
    static validateBookingForm(formData) {
        const errors = [];
        
        if (!formData.selectedDate || !formData.selectedTime) {
            errors.push('Debe seleccionar fecha y horario');
        }
        
        if (!formData.fullName || formData.fullName.length < 2) {
            errors.push('Nombre completo es requerido');
        }
        
        if (!formData.email || !formData.email.includes('@')) {
            errors.push('Email válido es requerido');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
    
    static validateTourismForm(formData) {
        const errors = [];
        
        if (!formData.touristName || formData.touristName.length < 2) {
            errors.push('Nombre del turista es requerido');
        }
        
        if (!formData.passportNumber || formData.passportNumber.length < 6) {
            errors.push('Número de pasaporte válido es requerido');
        }
        
        if (!formData.arrivalDate || !formData.departureDate) {
            errors.push('Fechas de llegada y salida son requeridas');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
    
    static validateMinorsForm(formData) {
        const errors = [];
        
        if (!formData.minorName || formData.minorName.length < 2) {
            errors.push('Nombre del menor es requerido');
        }
        
        if (!formData.minorAge || formData.minorAge < 0 || formData.minorAge > 17) {
            errors.push('Edad del menor debe estar entre 0 y 17 años');
        }
        
        if (!formData.fatherName || !formData.motherName) {
            errors.push('Nombres de ambos padres son requeridos');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
    
    // Sistema de estadísticas globales
    static getSystemStatistics() {
        const stats = {
            totalReservations: 0,
            totalTourismRequests: 0,
            totalMinorPermits: 0,
            totalPendingRequests: 0
        };
        
        if (window.bookingSystem) {
            stats.totalReservations = window.bookingSystem.getReservations().length;
        }
        
        if (window.tourismManagement) {
            const tourism = window.tourismManagement.getTourismRequests();
            stats.totalTourismRequests = tourism.length;
            stats.totalPendingRequests += tourism.filter(r => r.status === 'pending').length;
        }
        
        if (window.minorsManagement) {
            const minors = window.minorsManagement.getMinorPermits();
            stats.totalMinorPermits = minors.length;
            stats.totalPendingRequests += minors.filter(p => p.status === 'pending').length;
        }
        
        return stats;
    }
}

// Funciones de utilidad global
window.AduanasSystem = AduanasSystem;

// Scrollspy para navegación
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav a[href^="#"]');
    
    let current = '';
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Funciones de navegación entre portales
function goToCitizenPortal() {
    window.location.href = 'citizen-portal.html';
}

function goToAdminPortal() {
    window.location.href = 'admin-portal.html';
}

// Función para volver al sitio principal
function goToMainSite() {
    window.location.href = 'index.html';
}

// Función mejorada para mostrar modal de login
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Función para manejar login exitoso desde index.html
function handleSuccessfulLogin(userData) {
    // Guardar sesión
    const sessionData = {
        user: userData,
        expiry: Date.now() + (8 * 60 * 60 * 1000) // 8 horas
    };
    localStorage.setItem('aduanasAdminSession', JSON.stringify(sessionData));
    
    // Redirigir al portal de funcionarios
    window.location.href = 'admin-portal.html';
}

// Función de logout que funciona desde cualquier página
function logout() {
    const confirmLogout = confirm('¿Está seguro que desea cerrar sesión?');
    if (confirmLogout) {
        localStorage.removeItem('aduanasAdminSession');
        window.location.href = 'index.html';
    }
}

// Función para cerrar modales generales
function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
}

// Mejorar la función de mostrar secciones administrativas
function showAdminSection(sectionId) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Mostrar la sección seleccionada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    
    // Actualizar navegación activa
    const menuItems = document.querySelectorAll('.admin-menu a');
    menuItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Marcar como activo el elemento clickeado
    const activeItem = document.querySelector(`[onclick="showAdminSection('${sectionId}')"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
    
    // Cargar datos específicos de la sección
    if (window.adminSystem && window.adminSystem.currentUser) {
        switch(sectionId) {
            case 'dashboard':
                window.adminSystem.loadDashboardData();
                break;
            case 'appointments':
                window.adminSystem.loadAppointments();
                break;
            case 'tourism':
                window.adminSystem.loadTourismRequests();
                break;
            case 'minors':
                window.adminSystem.loadMinorPermits();
                break;
        }
    }
}

// Función para generar reportes
function generateReport() {
    const reportType = document.getElementById('reportType')?.value;
    const reportDate = document.getElementById('reportDate')?.value;
    const resultsContainer = document.getElementById('reportResults');
    
    if (!reportType || !reportDate) {
        AduanasSystem.showNotification('Seleccione tipo de reporte y fecha', 'error');
        return;
    }
    
    // Simular generación de reporte
    if (resultsContainer) {
        resultsContainer.innerHTML = `
            <div class="report-content">
                <h3>Reporte ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} - ${reportDate}</h3>
                <div class="report-stats">
                    <div class="report-stat">
                        <h4>Total de Citas</h4>
                        <p class="stat-number">${Math.floor(Math.random() * 50) + 10}</p>
                    </div>
                    <div class="report-stat">
                        <h4>Solicitudes Turísticas</h4>
                        <p class="stat-number">${Math.floor(Math.random() * 20) + 5}</p>
                    </div>
                    <div class="report-stat">
                        <h4>Permisos de Menores</h4>
                        <p class="stat-number">${Math.floor(Math.random() * 15) + 3}</p>
                    </div>
                </div>
                <button class="btn-secondary" onclick="downloadReport()">
                    <i class="fas fa-download"></i> Descargar PDF
                </button>
            </div>
        `;
    }
    
    AduanasSystem.showNotification('Reporte generado exitosamente', 'success');
}

// Función para guardar configuración
function saveSettings() {
    const settings = {
        openTime: document.getElementById('openTime')?.value,
        closeTime: document.getElementById('closeTime')?.value,
        slotDuration: document.getElementById('slotDuration')?.value,
        emailNotifications: document.getElementById('emailNotifications')?.checked,
        systemAlerts: document.getElementById('systemAlerts')?.checked
    };
    
    localStorage.setItem('aduanasSettings', JSON.stringify(settings));
    AduanasSystem.showNotification('Configuración guardada exitosamente', 'success');
}

// Función para restaurar configuración por defecto
function resetSettings() {
    const confirmReset = confirm('¿Está seguro que desea restaurar la configuración por defecto?');
    if (confirmReset) {
        localStorage.removeItem('aduanasSettings');
        
        // Restaurar valores por defecto en el formulario
        const openTime = document.getElementById('openTime');
        const closeTime = document.getElementById('closeTime');
        const slotDuration = document.getElementById('slotDuration');
        const emailNotifications = document.getElementById('emailNotifications');
        const systemAlerts = document.getElementById('systemAlerts');
        
        if (openTime) openTime.value = '09:00';
        if (closeTime) closeTime.value = '16:30';
        if (slotDuration) slotDuration.value = '30';
        if (emailNotifications) emailNotifications.checked = true;
        if (systemAlerts) systemAlerts.checked = true;
        
        AduanasSystem.showNotification('Configuración restaurada a valores por defecto', 'info');
    }
}

// Función para descargar reporte (simulada)
function downloadReport() {
    AduanasSystem.showNotification('Descarga de reporte iniciada', 'info');
    // En una implementación real, aquí se generaría y descargaría el PDF
}

// Función para detectar en qué página estamos y ajustar el comportamiento
function initializePageSpecificFeatures() {
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'index.html':
        case '':
            // Página principal - inicializar selector de usuario
            break;
            
        case 'citizen-portal.html':
            // Portal ciudadano - inicializar funcionalidades específicas
            document.title = 'Portal Ciudadano - Sistema de Aduanas';
            break;
            
        case 'admin-portal.html':
            // Portal funcionarios - ya se maneja en el archivo específico
            document.title = 'Portal Funcionarios - Sistema de Aduanas';
            break;
    }
}

// Event listeners principales
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar sistema principal
    window.aduanasSystem = new AduanasSystem();
    
    // Inicializar características específicas de la página
    initializePageSpecificFeatures();
    
    // Inicializar integración del calendario solo si existe
    setTimeout(() => {
        if (document.getElementById('calendarGrid')) {
            AduanasSystem.initializeCalendarIntegration();
        }
    }, 500);
    
    // Scrollspy solo si estamos en una página con secciones
    const sections = document.querySelectorAll('section[id]');
    if (sections.length > 0) {
        window.addEventListener('scroll', updateActiveNavLink);
    }
    
    // Efecto parallax suave en hero solo si existe
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // Mostrar notificación de bienvenida solo en página principal
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'index.html' || currentPage === '') {
        setTimeout(() => {
            AduanasSystem.showNotification('¡Bienvenido al Sistema de Aduanas!', 'info');
        }, 1000);
    } else if (currentPage === 'citizen-portal.html') {
        setTimeout(() => {
            AduanasSystem.showNotification('Portal Ciudadano - Acceda a todos los servicios', 'info');
        }, 1000);
    }
    
    // Mostrar estadísticas después de cargar (solo si hay sistemas disponibles)
    setTimeout(() => {
        if (window.bookingSystem || window.tourismManagement || window.minorsManagement) {
            const stats = AduanasSystem.getSystemStatistics();
            console.log('Estadísticas del sistema:', stats);
        }
    }, 2000);
    
    // Configurar eventos de teclado globales
    document.addEventListener('keydown', function(e) {
        // Ctrl + H para mostrar ayuda rápida
        if (e.ctrlKey && e.key === 'h') {
            e.preventDefault();
            AduanasSystem.showNotification('Atajos: ESC (cerrar), F1 (ayuda), Ctrl+L (login funcionarios)', 'info');
        }
        
        // F1 para ayuda
        if (e.key === 'F1') {
            e.preventDefault();
            const helpText = currentPage === 'admin-portal.html' 
                ? 'Portal Funcionarios - Gestión administrativa del sistema'
                : 'Sistema de Aduanas - Ayuda\n\n' +
                  '• Reservas: Seleccione fecha y horario en el calendario\n' +
                  '• Turismo: Complete el formulario de asistencia turística\n' +
                  '• Menores: Solicite permiso para menores de edad\n' +
                  '• Funcionarios: Acceso con credenciales oficiales\n\n' +
                  'Para soporte: contacto@aduanas.gov';
            alert(helpText);
        }
        
        // Ctrl + L para login rápido (solo en páginas que no sean admin-portal)
        if (e.ctrlKey && e.key === 'l' && currentPage !== 'admin-portal.html' && window.showLoginModal) {
            e.preventDefault();
            window.showLoginModal();
        }
    });
});

// Funciones de accesibilidad
document.addEventListener('keydown', function(e) {
    // Escape para cerrar modales
    if (e.key === 'Escape') {
        const confirmationModal = document.getElementById('confirmationModal');
        const loginModal = document.getElementById('loginModal');
        
        if (confirmationModal && confirmationModal.style.display === 'block') {
            confirmationModal.style.display = 'none';
        }
        
        if (loginModal && loginModal.style.display === 'block') {
            loginModal.style.display = 'none';
        }
        
        // Cerrar panel administrativo con Escape
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel && adminPanel.style.display === 'flex') {
            if (window.adminSystem && window.adminSystem.currentUser) {
                const confirmLogout = confirm('¿Está seguro que desea cerrar sesión?');
                if (confirmLogout) {
                    window.adminSystem.logout();
                }
            }
        }
    }
    
    // Tab navegación mejorada
    if (e.key === 'Tab') {
        const focusableElements = document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        // Agregar indicadores visuales de enfoque
        focusableElements.forEach(el => {
            el.addEventListener('focus', () => {
                el.style.outline = '2px solid #ffd700';
                el.style.outlineOffset = '2px';
            });
            
            el.addEventListener('blur', () => {
                el.style.outline = '';
                el.style.outlineOffset = '';
            });
        });
    }
});

// Añadir estilos adicionales para navegación activa
const navStyles = document.createElement('style');
navStyles.textContent = `
    .nav a.active {
        color: #ffd700 !important;
        font-weight: bold;
    }
    
    .nav a {
        position: relative;
    }
    
    .nav a::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 0;
        height: 2px;
        background: #ffd700;
        transition: width 0.3s ease;
    }
    
    .nav a:hover::after,
    .nav a.active::after {
        width: 100%;
    }
`;
document.head.appendChild(navStyles);

// Funciones de debugging y testing
window.testVehicleSystem = function() {
    console.log('🧪 Iniciando prueba del sistema de vehículos...');
    
    // Verificar si VehicleManagement está disponible
    if (typeof VehicleManagement === 'undefined') {
        console.error('❌ VehicleManagement no está disponible');
        alert('Error: Sistema de vehículos no disponible. Asegúrese de estar en el portal correcto.');
        return;
    }
    
    // Crear instancia temporal si no existe
    if (!window.vehicleManagement) {
        console.log('⚠️ Creando instancia temporal de VehicleManagement...');
        window.vehicleManagement = new VehicleManagement();
    }
    
    // Crear vehículo de prueba
    const testVehicle = {
        vehicleId: 'VEH-TEST-' + Date.now(),
        plateNumber: 'TEST-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
        vehicleBrand: 'Toyota',
        vehicleModel: 'Corolla',
        vehicleYear: '2023',
        vehicleColor: 'Azul',
        vehicleType: 'automovil',
        ownerName: 'Usuario de Prueba',
        ownerRUT: '12345678-9',
        vehiclePurpose: 'personal',
        registrationDate: new Date().toISOString(),
        status: 'pending'
    };
    
    // Agregar vehículo
    window.vehicleManagement.vehicles.push(testVehicle);
    window.vehicleManagement.saveVehicles();
    
    console.log('✅ Vehículo de prueba creado:', testVehicle.plateNumber);
    alert(`✅ Vehículo de prueba creado: ${testVehicle.plateNumber}\nEstado: ${testVehicle.status}`);
    
    updateSystemStatus();
};

window.debugVehicles = function() {
    console.log('🔍 Información de debugging del sistema de vehículos:');
    
    if (window.vehicleManagement) {
        const vehicles = window.vehicleManagement.vehicles;
        console.log('📊 Total de vehículos:', vehicles.length);
        console.log('📋 Lista de vehículos:', vehicles);
        
        // Estadísticas por estado
        const stats = {
            pending: vehicles.filter(v => v.status === 'pending').length,
            approved: vehicles.filter(v => v.status === 'approved').length,
            rejected: vehicles.filter(v => v.status === 'rejected').length,
            registered: vehicles.filter(v => v.status === 'registered').length
        };
        
        console.log('📈 Estadísticas por estado:', stats);
        
        // Mostrar en alert
        const message = `🔍 DEBUG VEHÍCULOS:
        
Total: ${vehicles.length}
Pendientes: ${stats.pending}
Aprobados: ${stats.approved} 
Rechazados: ${stats.rejected}
Registrados: ${stats.registered}

Ver consola (F12) para detalles completos.`;
        
        alert(message);
    } else {
        console.log('❌ Sistema de vehículos no inicializado');
        alert('❌ Sistema de vehículos no inicializado');
    }
    
    updateSystemStatus();
};

window.showVehicleStats = function() {
    if (window.vehicleManagement) {
        const vehicles = window.vehicleManagement.vehicles;
        const stats = {
            total: vehicles.length,
            pending: vehicles.filter(v => v.status === 'pending').length,
            approved: vehicles.filter(v => v.status === 'approved').length,
            rejected: vehicles.filter(v => v.status === 'rejected').length
        };
        
        const message = `📊 ESTADÍSTICAS DEL SISTEMA:

🚗 Vehículos Registrados: ${stats.total}
⏳ Pendientes de Aprobación: ${stats.pending}
✅ Aprobados: ${stats.approved}
❌ Rechazados: ${stats.rejected}

${stats.total === 0 ? '\n💡 No hay vehículos registrados. Use "Probar Vehículos" para crear uno de prueba.' : ''}`;
        
        alert(message);
    } else {
        alert('❌ Sistema de vehículos no disponible');
    }
    
    updateSystemStatus();
};

window.clearTestData = function() {
    const confirmed = confirm('⚠️ ¿Está seguro de que desea eliminar todos los datos de prueba?\n\nEsto eliminará todos los vehículos que contengan "TEST" en su patente.');
    
    if (confirmed && window.vehicleManagement) {
        const originalCount = window.vehicleManagement.vehicles.length;
        window.vehicleManagement.vehicles = window.vehicleManagement.vehicles.filter(v => !v.plateNumber.includes('TEST'));
        const newCount = window.vehicleManagement.vehicles.length;
        const deleted = originalCount - newCount;
        
        window.vehicleManagement.saveVehicles();
        
        console.log(`🗑️ ${deleted} vehículos de prueba eliminados`);
        alert(`🗑️ ${deleted} vehículos de prueba eliminados\nVehículos restantes: ${newCount}`);
        
        updateSystemStatus();
    }
};

// Función para actualizar el estado del sistema en la interfaz
function updateSystemStatus() {
    const statusIndicator = document.getElementById('statusIndicator');
    const vehicleCount = document.getElementById('vehicleCount');
    const documentCount = document.getElementById('documentCount');
    const lastUpdate = document.getElementById('lastUpdate');
    
    if (statusIndicator) {
        // Verificar estado de los sistemas
        const vehicleSystemOK = typeof window.vehicleManagement !== 'undefined';
        const documentSystemOK = typeof window.documentManagement !== 'undefined';
        
        if (vehicleSystemOK && documentSystemOK) {
            statusIndicator.textContent = '✅ Todos los sistemas operativos';
            statusIndicator.style.color = '#28a745';
        } else if (vehicleSystemOK || documentSystemOK) {
            statusIndicator.textContent = '⚠️ Sistemas parcialmente disponibles';
            statusIndicator.style.color = '#ffc107';
        } else {
            statusIndicator.textContent = '❌ Sistemas no disponibles';
            statusIndicator.style.color = '#dc3545';
        }
    }
    
    if (vehicleCount && window.vehicleManagement) {
        vehicleCount.textContent = window.vehicleManagement.vehicles.length;
    }
    
    if (documentCount && window.documentManagement) {
        documentCount.textContent = window.documentManagement.documents.length;
    }
    
    if (lastUpdate) {
        lastUpdate.textContent = new Date().toLocaleTimeString('es-ES');
    }
}

// Actualizar estado cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(updateSystemStatus, 1000); // Esperar a que se inicialicen los sistemas
});

// Actualizar cada 30 segundos
setInterval(updateSystemStatus, 30000);
