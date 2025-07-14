// Sistema Administrativo para Funcionarios
class AdminSystem {
    constructor() {
        this.currentUser = null;
        this.employees = this.loadEmployees();
        this.init();
    }
    
    init() {
        this.addEventListeners();
        this.checkExistingSession();
    }
    
    addEventListeners() {
        const loginForm = document.getElementById('loginForm');
        
        if (loginForm) {
            console.log('Agregando event listener al formulario de login');
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Formulario de login enviado');
                this.handleLogin();
            });
        } else {
            console.log('No se encontró el formulario de login');
        }
    }
    
    loadEmployees() {
        // Datos de empleados simulados - en producción esto vendría de una base de datos
        return [
            {
                id: 'FUN001',
                password: 'admin123',
                name: 'María González',
                department: 'control-migratorio',
                role: 'supervisor',
                email: 'maria.gonzalez@aduanas.gov'
            },
            {
                id: 'FUN002',
                password: 'insp456',
                name: 'Carlos Rodríguez',
                department: 'inspeccion-equipaje',
                role: 'inspector',
                email: 'carlos.rodriguez@aduanas.gov'
            },
            {
                id: 'FUN003',
                password: 'doc789',
                name: 'Ana Martínez',
                department: 'documentacion',
                role: 'oficial',
                email: 'ana.martinez@aduanas.gov'
            },
            {
                id: 'ADMIN',
                password: 'admin2025',
                name: 'Administrador Sistema',
                department: 'administracion',
                role: 'admin',
                email: 'admin@aduanas.gov'
            }
        ];
    }
    
    checkExistingSession() {
        try {
            const savedSession = localStorage.getItem('aduanasAdminSession');
            if (savedSession) {
                const sessionData = JSON.parse(savedSession);
                if (sessionData.expiry > Date.now()) {
                    this.currentUser = sessionData.user;
                    this.showAdminPanel();
                } else {
                    localStorage.removeItem('aduanasAdminSession');
                }
            }
        } catch (error) {
            console.warn('Error al verificar sesión existente:', error);
        }
    }
    
    handleLogin() {
        const employeeId = document.getElementById('employeeId').value.trim();
        const password = document.getElementById('password').value;
        const department = document.getElementById('department').value;
        
        if (!employeeId || !password || !department) {
            this.showLoginError('Todos los campos son requeridos');
            return;
        }
        
        // Verificar credenciales
        const employee = this.employees.find(emp => 
            emp.id === employeeId && 
            emp.password === password && 
            emp.department === department
        );
        
        if (employee) {
            this.currentUser = {
                id: employee.id,
                name: employee.name,
                department: employee.department,
                role: employee.role,
                email: employee.email
            };
            
            // Registrar login exitoso en auditoría
            if (window.auditSystem) {
                window.auditSystem.registerLogin(
                    employee.id,
                    employee.name,
                    employee.department,
                    employee.role,
                    true // éxito
                );
            }
            
            // Guardar sesión
            const sessionData = {
                user: this.currentUser,
                expiry: Date.now() + (8 * 60 * 60 * 1000) // 8 horas
            };
            localStorage.setItem('aduanasAdminSession', JSON.stringify(sessionData));
            
            // Cerrar modal de login
            const loginModal = document.getElementById('loginModal');
            if (loginModal) {
                loginModal.style.display = 'none';
            }
            
            // Limpiar mensajes de error
            this.clearLoginError();
            
            // Verificar si estamos en la página principal o en el portal administrativo
            const currentPage = window.location.pathname.split('/').pop();
            if (currentPage === 'index.html' || currentPage === '' || !currentPage) {
                // Redirigir al portal administrativo
                window.location.href = 'admin-portal.html';
            } else if (currentPage === 'admin-portal.html') {
                // Ya estamos en el portal, mostrar el panel
                this.showAdminPanel();
            }
            
            // Mostrar notificación de éxito
            console.log(`Login exitoso: ${this.currentUser.name}`);
        } else {
            // Registrar login fallido en auditoría
            if (window.auditSystem) {
                window.auditSystem.registerLogin(
                    employeeId,
                    'Usuario Desconocido',
                    department,
                    'unknown',
                    false // fallo
                );
            }
            
            this.showLoginError('Credenciales incorrectas. Verifique su ID, contraseña y departamento.');
        }
    }
    
    showLoginError(message) {
        let errorDiv = document.getElementById('loginError');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'loginError';
            errorDiv.className = 'login-error';
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.appendChild(errorDiv);
            }
        }
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
    
    clearLoginError() {
        const errorDiv = document.getElementById('loginError');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }
    
    saveSession() {
        try {
            const sessionData = {
                user: this.currentUser,
                expiry: Date.now() + (8 * 60 * 60 * 1000) // 8 horas
            };
            localStorage.setItem('aduanasAdminSession', JSON.stringify(sessionData));
        } catch (error) {
            console.warn('No se pudo guardar la sesión:', error);
        }
    }
    
    showAdminPanel() {
        const adminPanel = document.getElementById('adminPanel');
        const loggedUserName = document.getElementById('loggedUserName');
        const loggedUserDept = document.getElementById('loggedUserDept');
        
        if (adminPanel && this.currentUser) {
            adminPanel.style.display = 'flex';
            
            if (loggedUserName) {
                loggedUserName.textContent = this.currentUser.name;
            }
            
            if (loggedUserDept) {
                const deptNames = {
                    'control-migratorio': 'Control Migratorio',
                    'inspeccion-equipaje': 'Inspección de Equipaje',
                    'documentacion': 'Documentación',
                    'supervision': 'Supervisión',
                    'administracion': 'Administración'
                };
                loggedUserDept.textContent = deptNames[this.currentUser.department] || this.currentUser.department;
            }
            
            // Cargar dashboard inicial
            this.loadDashboard();
            
            // Configurar listeners para actualizaciones automáticas
            this.setupAutoUpdateListeners();
            
            // Ocultar el contenido principal
            document.body.style.overflow = 'hidden';
        }
    }
    
    closeLoginModal() {
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
            loginModal.style.display = 'none';
        }
    }
    
    logout() {
        // Registrar logout en auditoría antes de cerrar sesión
        if (window.auditSystem && this.currentUser) {
            window.auditSystem.registerLogout(
                this.currentUser.id,
                this.currentUser.name
            );
        }
        
        this.currentUser = null;
        localStorage.removeItem('aduanasAdminSession');
        
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel) {
            adminPanel.style.display = 'none';
        }
        
        // Restaurar scroll del body
        document.body.style.overflow = 'auto';
        
        // Resetear formulario de login
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.reset();
        }
        
        if (window.AduanasSystem) {
            window.AduanasSystem.showNotification('Sesión cerrada exitosamente', 'info');
        }
    }
    
    loadDashboard() {
        // Actualizar estadísticas
        this.updateDashboardStats();
        
        // Cargar actividad reciente
        this.loadRecentActivity();
    }
    
    // Método para cargar datos del dashboard
    loadDashboardData() {
        if (this.currentUser) {
            this.updateDashboardStats();
            this.loadRecentActivity();
        }
    }
    
    updateDashboardStats() {
        // Obtener datos de todos los sistemas
        const appointments = window.bookingSystem ? window.bookingSystem.getReservations() : [];
        const tourismRequests = window.tourismManagement ? window.tourismManagement.getTourismRequests() : [];
        const minorPermits = window.minorsManagement ? window.minorsManagement.getMinorPermits() : [];
        const vehicles = window.vehicleManagement ? window.vehicleManagement.getVehicles() : [];
        const documents = window.documentManagement ? window.documentManagement.getDocuments() : [];
        
        // Filtrar por fecha de hoy
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const todayAppointments = appointments.filter(apt => {
            const aptDate = new Date(apt.selectedDate);
            return aptDate >= today && aptDate < tomorrow;
        });
        
        const todayTourism = tourismRequests.filter(req => {
            const reqDate = new Date(req.requestDate);
            return reqDate >= today && reqDate < tomorrow;
        });
        
        const todayMinors = minorPermits.filter(permit => {
            const reqDate = new Date(permit.requestDate);
            return reqDate >= today && reqDate < tomorrow;
        });
        
        const todayVehicles = vehicles.filter(vehicle => {
            const regDate = new Date(vehicle.registrationDate);
            return regDate >= today && regDate < tomorrow;
        });
        
        const todayDocuments = documents.filter(document => {
            const subDate = new Date(document.submissionDate);
            return subDate >= today && subDate < tomorrow;
        });
        
        const pendingRequests = [
            ...tourismRequests.filter(r => r.status === 'pending'),
            ...minorPermits.filter(p => p.status === 'pending'),
            ...vehicles.filter(v => v.status === 'pending' || v.status === 'registered'),
            ...documents.filter(d => d.status === 'pendiente')
        ];
        
        // Actualizar elementos en el DOM
        this.updateStatElement('todayAppointments', todayAppointments.length);
        this.updateStatElement('touristRequests', todayTourism.length + todayVehicles.length);
        this.updateStatElement('minorPermits', todayMinors.length + todayDocuments.length);
        this.updateStatElement('pendingRequests', pendingRequests.length);
    }
    
    updateStatElement(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
        }
    }
    
    loadRecentActivity() {
        const activityList = document.getElementById('recentActivity');
        if (!activityList) return;
        
        const activities = [];
        
        // Agregar actividades recientes
        if (window.bookingSystem) {
            const recentReservations = window.bookingSystem.getReservations()
                .slice(-5)
                .map(res => ({
                    type: 'reservation',
                    icon: 'fas fa-calendar-check',
                    text: `Nueva cita: ${res.fullName} - ${res.serviceType}`,
                    time: res.selectedDate
                }));
            activities.push(...recentReservations);
        }
        
        if (window.tourismManagement) {
            const recentTourism = window.tourismManagement.getTourismRequests()
                .slice(-3)
                .map(req => ({
                    type: 'tourism',
                    icon: 'fas fa-plane',
                    text: `Solicitud turística: ${req.touristName} - ${req.nationality}`,
                    time: req.requestDate
                }));
            activities.push(...recentTourism);
        }
        
        if (window.minorsManagement) {
            const recentMinors = window.minorsManagement.getMinorPermits()
                .slice(-3)
                .map(permit => ({
                    type: 'minor',
                    icon: 'fas fa-child',
                    text: `Permiso de menor: ${permit.minorName}, ${permit.minorAge} años`,
                    time: permit.requestDate
                }));
            activities.push(...recentMinors);
        }
        
        // Ordenar por fecha (más recientes primero)
        activities.sort((a, b) => new Date(b.time) - new Date(a.time));
        
        // Mostrar solo las últimas 10 actividades
        const recentActivities = activities.slice(0, 10);
        
        activityList.innerHTML = '';
        
        if (recentActivities.length === 0) {
            activityList.innerHTML = '<p style="text-align: center; color: #6c757d;">No hay actividad reciente</p>';
            return;
        }
        
        recentActivities.forEach(activity => {
            const activityElement = document.createElement('div');
            activityElement.className = 'activity-item';
            activityElement.innerHTML = `
                <i class="${activity.icon}"></i>
                <div>
                    <p>${activity.text}</p>
                    <small>${this.formatActivityTime(activity.time)}</small>
                </div>
            `;
            activityList.appendChild(activityElement);
        });
    }
    
    formatActivityTime(time) {
        const date = new Date(time);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffMins < 1) return 'Hace un momento';
        if (diffMins < 60) return `Hace ${diffMins} minutos`;
        if (diffHours < 24) return `Hace ${diffHours} horas`;
        if (diffDays < 7) return `Hace ${diffDays} días`;
        
        return date.toLocaleDateString('es-ES');
    }
    
    showAdminSection(sectionId) {
        // Ocultar todas las secciones
        const sections = document.querySelectorAll('.admin-section');
        sections.forEach(section => {
            section.style.display = 'none';
        });
        
        // Remover clase activa de todos los enlaces
        const menuLinks = document.querySelectorAll('.admin-menu a');
        menuLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Mostrar la sección seleccionada
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = 'block';
        }
        
        // Activar el enlace correspondiente
        const activeLink = document.querySelector(`.admin-menu a[onclick*="${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        // Cargar contenido específico de la sección
        switch (sectionId) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'appointments':
                this.loadAppointments();
                break;
            case 'tourism':
                this.loadTourismRequests();
                break;
            case 'minors':
                this.loadMinorPermits();
                break;
            case 'reports':
                this.loadReports();
                break;
            case 'vehicles':
                this.loadVehiclesAdmin();
                break;
            case 'documents':
                this.loadDocumentsAdmin();
                break;
            case 'audit':
                this.loadAuditSection();
                break;
        }
    }
    
    loadAppointments() {
        console.log('🔄 Cargando citas...');
        const tableBody = document.getElementById('appointmentsTableBody');
        if (!tableBody) {
            console.error('❌ No se encontró appointmentsTableBody');
            return;
        }
        
        // Verificar e inicializar BookingSystem si es necesario
        if (!window.bookingSystem) {
            console.log('⚠️ BookingSystem no disponible, inicializando...');
            if (typeof BookingSystem !== 'undefined') {
                window.bookingSystem = new BookingSystem();
                console.log('✅ BookingSystem inicializado');
            } else {
                console.error('❌ Clase BookingSystem no disponible');
                tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">Sistema de citas no disponible</td></tr>';
                return;
            }
        }
        
        const appointments = window.bookingSystem.getReservations();
        console.log('📋 Total de citas encontradas:', appointments.length);
        console.log('📋 Citas:', appointments);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const todayAppointments = appointments.filter(apt => {
            const aptDate = new Date(apt.selectedDate);
            const isToday = aptDate >= today && aptDate < tomorrow;
            console.log(`📅 Cita ${apt.bookingId}: ${apt.selectedDate} -> Es hoy: ${isToday}`);
            return isToday;
        });
        
        console.log('📅 Citas de hoy:', todayAppointments.length);
        
        tableBody.innerHTML = '';
        
        if (todayAppointments.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No hay citas para hoy</td></tr>';
            return;
        }
        
        todayAppointments.forEach(appointment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${appointment.selectedTime}</td>
                <td>${appointment.fullName}</td>
                <td>${appointment.idNumber}</td>
                <td>${this.getServiceTypeName(appointment.serviceType)}</td>
                <td><span class="status-${appointment.status || 'pending'}">${this.getStatusName(appointment.status || 'pending')}</span></td>
                <td style="font-size: 11px;">
                    ${appointment.lastModified ? 
                        `<strong>${appointment.lastModified.userName}</strong><br>
                         <span style="color: #666;">${appointment.lastModified.action} - ${new Date(appointment.lastModified.timestamp).toLocaleString('es-ES')}</span>` : 
                        '<span style="color: #999;">Sin modificaciones</span>'
                    }
                </td>
                <td>
                    <div class="action-buttons" style="display: flex; gap: 5px; flex-wrap: wrap;">
                        <button class="btn-action btn-view" onclick="viewAppointment('${appointment.bookingId}')" style="font-size: 11px; padding: 4px 8px;">Ver</button>
                        <button class="btn-action btn-edit" onclick="editAppointment('${appointment.bookingId}')" style="font-size: 11px; padding: 4px 8px; background: #17a2b8;">Editar</button>
                        <button class="btn-action btn-approve" onclick="approveAppointment('${appointment.bookingId}')" style="font-size: 11px; padding: 4px 8px;">Aprobar</button>
                        <button class="btn-action btn-reject" onclick="rejectAppointment('${appointment.bookingId}')" style="font-size: 11px; padding: 4px 8px;">Rechazar</button>
                        <button class="btn-action btn-delete" onclick="deleteAppointment('${appointment.bookingId}')" style="font-size: 11px; padding: 4px 8px; background: #dc3545;">Eliminar</button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
    
    loadTourismRequests() {
        const tableBody = document.getElementById('tourismTableBody');
        if (!tableBody || !window.tourismManagement) return;
        
        const requests = window.tourismManagement.getTourismRequests();
        
        tableBody.innerHTML = '';
        
        if (requests.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No hay solicitudes turísticas</td></tr>';
            return;
        }
        
        requests.forEach(request => {
            const row = document.createElement('tr');
            const arrivalDate = new Date(request.arrivalDate).toLocaleDateString('es-ES');
            const departureDate = new Date(request.departureDate).toLocaleDateString('es-ES');
            const requestDate = new Date(request.requestDate).toLocaleDateString('es-ES');
            
            row.innerHTML = `
                <td>${requestDate}</td>
                <td>
                    <strong>${request.touristName}</strong><br>
                    <small style="color: #6c757d;">
                        ${request.touristRut ? 'RUT: ' + request.touristRut + '<br>' : ''}
                        ${request.email ? 'Email: ' + request.email + '<br>' : ''}
                        ${request.phone ? 'Tel: ' + request.phone : ''}
                    </small>
                </td>
                <td>
                    ${this.getNationalityName(request.nationality)}<br>
                    <small style="color: #6c757d;">Pass: ${request.passportNumber}</small>
                </td>
                <td>
                    <strong>${arrivalDate}</strong><br>
                    <small style="color: #6c757d;">hasta ${departureDate}</small>
                </td>
                <td>${this.getTourismTypeName(request.tourismType)}</td>
                <td><span class="status-${request.status}">${this.getStatusName(request.status)}</span></td>
                <td style="font-family: monospace; font-size: 11px;">${request.requestId}</td>
                <td>
                    <div class="action-buttons" style="display: flex; gap: 5px; flex-wrap: wrap;">
                        ${request.status === 'pending' ? `
                            <button class="btn-action btn-approve" onclick="approveTourismRequest('${request.requestId}')" title="Aprobar">
                                <i class="fas fa-check"></i>
                            </button>
                            <button class="btn-action btn-reject" onclick="rejectTourismRequest('${request.requestId}')" title="Rechazar">
                                <i class="fas fa-times"></i>
                            </button>
                        ` : ''}
                        <button class="btn-action btn-edit" onclick="editTourismRequest('${request.requestId}')" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action btn-view" onclick="viewTourismRequest('${request.requestId}')" title="Ver Detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-action btn-delete" onclick="deleteTourismRequest('${request.requestId}')" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
    
    loadMinorPermits() {
        const tableBody = document.getElementById('minorsTableBody');
        if (!tableBody || !window.minorsManagement) return;
        
        const permits = window.minorsManagement.getMinorPermits();
        
        tableBody.innerHTML = '';
        
        if (permits.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No hay permisos de menores</td></tr>';
            return;
        }
        
        permits.forEach(permit => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(permit.requestDate).toLocaleDateString('es-ES')}</td>
                <td>${permit.minorName}</td>
                <td>${permit.minorAge} años</td>
                <td>${this.getAccompaniedByName(permit.accompaniedBy)}</td>
                <td>${permit.destination}</td>
                <td><span class="status-${permit.status}">${this.getStatusName(permit.status)}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action btn-view" onclick="viewMinorPermit('${permit.permitId}')">Ver</button>
                        <button class="btn-action btn-approve" onclick="approveMinorPermit('${permit.permitId}')">Aprobar</button>
                        <button class="btn-action btn-reject" onclick="rejectMinorPermit('${permit.permitId}')">Rechazar</button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
    
    loadReports() {
        // Configurar fecha por defecto
        const reportDate = document.getElementById('reportDate');
        if (reportDate) {
            reportDate.value = new Date().toISOString().split('T')[0];
        }
    }
    
    generateReport() {
        const reportType = document.getElementById('reportType').value;
        const reportDate = document.getElementById('reportDate').value;
        const reportResults = document.getElementById('reportResults');
        
        if (!reportDate) {
            alert('Seleccione una fecha para el reporte');
            return;
        }
        
        // Simular generación de reporte
        const reportData = this.getReportData(reportType, new Date(reportDate));
        
        reportResults.innerHTML = `
            <div class="report-content">
                <h3>Reporte ${this.getReportTypeName(reportType)} - ${new Date(reportDate).toLocaleDateString('es-ES')}</h3>
                
                <div class="report-stats">
                    <div class="stat-item">
                        <h4>Total de Citas</h4>
                        <p>${reportData.appointments}</p>
                    </div>
                    <div class="stat-item">
                        <h4>Solicitudes Turísticas</h4>
                        <p>${reportData.tourism}</p>
                    </div>
                    <div class="stat-item">
                        <h4>Permisos de Menores</h4>
                        <p>${reportData.minors}</p>
                    </div>
                    <div class="stat-item">
                        <h4>Total Procesado</h4>
                        <p>${reportData.total}</p>
                    </div>
                </div>
                
                <button class="btn-primary" onclick="printReport()" style="margin-top: 20px;">
                    <i class="fas fa-print"></i> Imprimir Reporte
                </button>
            </div>
        `;
    }
    
    getReportData(type, date) {
        // Simular datos del reporte
        return {
            appointments: Math.floor(Math.random() * 20) + 5,
            tourism: Math.floor(Math.random() * 15) + 3,
            minors: Math.floor(Math.random() * 10) + 2,
            total: 0
        };
    }
    
    saveSettings() {
        const openTime = document.getElementById('openTime').value;
        const closeTime = document.getElementById('closeTime').value;
        const slotDuration = document.getElementById('slotDuration').value;
        
        // Guardar configuraciones
        const settings = {
            openTime,
            closeTime,
            slotDuration,
            updatedBy: this.currentUser.id,
            updatedAt: new Date()
        };
        
        localStorage.setItem('aduanasSettings', JSON.stringify(settings));
        
        if (window.AduanasSystem) {
            window.AduanasSystem.showNotification('Configuración guardada exitosamente', 'success');
        }
    }
    
    // Métodos auxiliares para formateo
    getServiceTypeName(type) {
        const names = {
            'importacion': 'Importación',
            'exportacion': 'Exportación',
            'certificacion': 'Certificación',
            'consulta': 'Consulta General',
            'turismo': 'Gestión Turística',
            'permiso-menor': 'Permiso de Menor'
        };
        return names[type] || type;
    }
    
    getNationalityName(nationality) {
        const names = {
            'argentina': 'Argentina',
            'brasil': 'Brasil',
            'colombia': 'Colombia',
            'chile': 'Chile',
            'peru': 'Perú',
            'mexico': 'México',
            'usa': 'Estados Unidos',
            'espana': 'España',
            'francia': 'Francia',
            'otro': 'Otro'
        };
        return names[nationality] || nationality;
    }
    
    getTourismTypeName(type) {
        const names = {
            'entrada': 'Entrada',
            'salida': 'Salida',
            'declaracion': 'Declaración',
            'consulta': 'Consulta'
        };
        return names[type] || type;
    }
    
    getAccompaniedByName(accompaniedBy) {
        const names = {
            'padre': 'Padre',
            'madre': 'Madre',
            'ambos': 'Ambos padres',
            'tutor': 'Tutor',
            'familiar': 'Familiar',
            'institucion': 'Institución',
            'solo': 'Solo'
        };
        return names[accompaniedBy] || accompaniedBy;
    }
    
    getStatusName(status) {
        const names = {
            'pending': 'Pendiente',
            'approved': 'Aprobado',
            'rejected': 'Rechazado'
        };
        return names[status] || status;
    }
    
    getReportTypeName(type) {
        const names = {
            'daily': 'Diario',
            'weekly': 'Semanal',
            'monthly': 'Mensual'
        };
        return names[type] || type;
    }
    
    loadVehiclesAdmin() {
        console.log('Cargando vehículos admin...');
        const tableBody = document.getElementById('adminVehiclesTableBody');
        if (!tableBody) {
            console.log('No se encontró adminVehiclesTableBody');
            return;
        }
        
        if (!window.vehicleManagement) {
            console.log('window.vehicleManagement no está inicializado, intentando inicializar...');
            // Intentar inicializar si no existe
            if (typeof VehicleManagement !== 'undefined') {
                window.vehicleManagement = new VehicleManagement();
                console.log('VehicleManagement inicializado manualmente');
            } else {
                console.log('VehicleManagement no está disponible');
                tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center;">Error: Sistema de vehículos no disponible</td></tr>';
                return;
            }
        }
        
        const vehicles = window.vehicleManagement.getVehicles();
        console.log('Vehículos encontrados:', vehicles.length, vehicles);
        
        // Actualizar estadísticas
        this.updateStatElement('totalVehicles', vehicles.length);
        this.updateStatElement('pendingVehicles', vehicles.filter(v => v.status === 'pending').length);
        this.updateStatElement('approvedVehicles', vehicles.filter(v => v.status === 'approved').length);
        
        tableBody.innerHTML = '';
        
        if (vehicles.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No hay vehículos registrados</td></tr>';
            return;
        }
        
        vehicles.forEach(vehicle => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${vehicle.plateNumber}</td>
                <td>${vehicle.vehicleBrand} ${vehicle.vehicleModel}</td>
                <td>${vehicle.ownerName}</td>
                <td>${this.getVehicleTypeName(vehicle.vehicleType)}</td>
                <td>${this.getVehiclePurposeName(vehicle.vehiclePurpose)}</td>
                <td><span class="status-${vehicle.status}">${this.getStatusName(vehicle.status)}</span></td>
                <td>${new Date(vehicle.registrationDate).toLocaleDateString('es-ES')}</td>
                <td style="font-size: 11px;">
                    ${vehicle.lastModified ? 
                        `<strong>${vehicle.lastModified.userName}</strong><br>
                         <span style="color: #666;">${vehicle.lastModified.action} - ${new Date(vehicle.lastModified.timestamp).toLocaleString('es-ES')}</span>` : 
                        '<span style="color: #999;">Sin modificaciones</span>'
                    }
                </td>
                <td>
                    <div class="action-buttons" style="display: flex; gap: 5px; flex-wrap: wrap;">
                        <button class="btn-action btn-view" onclick="viewVehicleAdmin('${vehicle.vehicleId}')" style="font-size: 11px; padding: 4px 8px;">Ver</button>
                        <button class="btn-action btn-edit" onclick="editVehicleAdmin('${vehicle.vehicleId}')" style="font-size: 11px; padding: 4px 8px; background: #17a2b8;">Editar</button>
                        <button class="btn-action btn-approve" onclick="approveVehicleAdmin('${vehicle.vehicleId}')" style="font-size: 11px; padding: 4px 8px;">Aprobar</button>
                        <button class="btn-action btn-reject" onclick="rejectVehicleAdmin('${vehicle.vehicleId}')" style="font-size: 11px; padding: 4px 8px;">Rechazar</button>
                        <button class="btn-action btn-delete" onclick="deleteVehicleAdmin('${vehicle.vehicleId}')" style="font-size: 11px; padding: 4px 8px; background: #dc3545;">Eliminar</button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
    
    loadDocumentsAdmin() {
        console.log('📄 Cargando administración de documentos');
        
        // Inicializar el sistema de documentos si no existe
        if (!window.documentManagement) {
            console.log('🔧 Inicializando sistema de documentos...');
            window.documentManagement = new DocumentManagement();
        }
        
        // Cargar la lista de documentos usando el nuevo sistema
        if (window.documentManagement) {
            window.documentManagement.loadDocumentsList();
            window.documentManagement.updateDocumentStats();
        }
        
        console.log('✅ Administración de documentos cargada');
    }
    
    getVehicleTypeName(type) {
        const types = {
            'automovil': 'Automóvil',
            'motocicleta': 'Motocicleta',
            'camion': 'Camión',
            'camioneta': 'Camioneta',
            'autobus': 'Autobús',
            'trailer': 'Tráiler',
            'otro': 'Otro'
        };
        return types[type] || type;
    }
    
    getVehiclePurposeName(purpose) {
        const purposes = {
            'importacion': 'Importación',
            'exportacion': 'Exportación',
            'transito': 'Tránsito',
            'temporal': 'Temporal',
            'comercial': 'Comercial',
            'personal': 'Personal'
        };
        return purposes[purpose] || purpose;
    }
    
    getDocumentTypeName(type) {
        const types = {
            'factura': 'Factura',
            'conocimiento': 'Conocimiento',
            'certificado': 'Certificado',
            'lista': 'Lista Empaque',
            'seguro': 'Seguro',
            'sanitario': 'Sanitario',
            'fitosanitario': 'Fitosanitario',
            'calidad': 'Calidad',
            'licencia': 'Licencia',
            'otro': 'Otro'
        };
        return types[type] || type;
    }
    
    getDocumentPurposeName(purpose) {
        const purposes = {
            'importacion': 'Importación',
            'exportacion': 'Exportación',
            'validacion': 'Validación',
            'traduccion': 'Traducción',
            'apostille': 'Apostilla',
            'conformidad': 'Conformidad',
            'otro': 'Otro'
        };
        return purposes[purpose] || purpose;
    }
    
    getUrgencyName(urgency) {
        const urgencies = {
            'normal': 'Normal',
            'media': 'Media',
            'alta': 'Alta',
            'critica': 'Crítica'
        };
        return urgencies[urgency] || urgency;
    }
    
    getDocumentStatusName(status) {
        const statuses = {
            'pendiente': 'Pendiente',
            'en-revision': 'En Revisión',
            'calificado': 'Calificado',
            'rechazado': 'Rechazado',
            'solicita-info': 'Solicita Info'
        };
        return statuses[status] || status;
    }
    
    // Nueva función para cargar la sección de auditoría
    loadAuditSection() {
        console.log('🔍 Cargando sección de auditoría...');
        
        // Verificar que el sistema de auditoría esté disponible
        if (!window.auditSystem) {
            console.error('❌ Sistema de auditoría no disponible');
            return;
        }
        
        this.updateAuditStats();
        this.loadAuditTables();
        this.populateAuditFilters();
        
        // Configurar tab activo por defecto
        this.switchAuditTab('accesses');
    }
    
    updateAuditStats() {
        console.log('📊 Actualizando estadísticas de auditoría...');
        
        if (!window.auditSystem) return;
        
        const stats = window.auditSystem.getAccessStats(7);
        const recentActions = window.auditSystem.getRecentActions(100);
        
        // Actualizar estadísticas básicas
        const totalAccessesEl = document.getElementById('totalAccesses');
        if (totalAccessesEl) totalAccessesEl.textContent = stats.totalAccesses;
        
        const uniqueUsersEl = document.getElementById('uniqueUsers');
        if (uniqueUsersEl) uniqueUsersEl.textContent = stats.uniqueUsers;
        
        // Calcular accesos de admin
        const adminAccesses = Object.values(stats.userStats).filter(user => 
            user.userId.includes('ADMIN') || user.userId.includes('FUN')
        ).reduce((sum, user) => sum + user.accesses, 0);
        
        const adminAccessesEl = document.getElementById('adminAccesses');
        if (adminAccessesEl) adminAccessesEl.textContent = adminAccesses;
        
        // Calcular intentos fallidos
        const failedLogins = recentActions.filter(action => 
            action.action === 'LOGIN_FAILED'
        ).length;
        
        const failedLoginsEl = document.getElementById('failedLogins');
        if (failedLoginsEl) failedLoginsEl.textContent = failedLogins;
    }
    
    loadAuditTables() {
        this.loadAccessLogsTable();
        this.loadActionLogsTable();
        this.loadAuditStats();
    }
    
    loadAccessLogsTable() {
        const tableBody = document.getElementById('accessLogsTable');
        if (!tableBody || !window.auditSystem) return;
        
        const accesses = window.auditSystem.getRecentAccesses(100);
        
        tableBody.innerHTML = '';
        
        if (accesses.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay registros de acceso</td></tr>';
            return;
        }
        
        accesses.forEach(access => {
            const row = document.createElement('tr');
            const date = new Date(access.timestamp);
            const userInfo = access.user || { userName: 'Anónimo', userId: 'N/A' };
            
            row.innerHTML = `
                <td>${date.toLocaleString('es-ES')}</td>
                <td>${userInfo.userName}</td>
                <td>${access.portal}</td>
                <td>${access.ip}</td>
                <td style="font-size: 11px; max-width: 200px; overflow: hidden; text-overflow: ellipsis;">${this.getBrowserName(access.userAgent)}</td>
                <td style="font-family: monospace; font-size: 10px;">${access.sessionId.slice(-8)}</td>
            `;
            tableBody.appendChild(row);
        });
    }
    
    loadActionLogsTable() {
        const tableBody = document.getElementById('actionLogsTable');
        if (!tableBody || !window.auditSystem) return;
        
        const actions = window.auditSystem.getRecentActions(100);
        
        tableBody.innerHTML = '';
        
        if (actions.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay registros de acciones</td></tr>';
            return;
        }
        
        actions.forEach(action => {
            const row = document.createElement('tr');
            const date = new Date(action.timestamp);
            
            row.innerHTML = `
                <td>${date.toLocaleString('es-ES')}</td>
                <td>${action.userName || 'N/A'}</td>
                <td><span class="action-${action.action.toLowerCase()}">${this.getActionDisplayName(action.action)}</span></td>
                <td>${action.target || 'N/A'}</td>
                <td style="font-size: 11px; max-width: 150px; overflow: hidden; text-overflow: ellipsis;">${this.formatActionDetails(action.details)}</td>
                <td style="font-family: monospace; font-size: 10px;">${action.sessionId ? action.sessionId.slice(-8) : 'N/A'}</td>
            `;
            tableBody.appendChild(row);
        });
    }
    
    loadAuditStats() {
        if (!window.auditSystem) return;
        
        const stats = window.auditSystem.getAccessStats(7);
        
        // Estadísticas por hora
        const hourlyStatsEl = document.getElementById('hourlyStatsText');
        if (hourlyStatsEl) {
            let hourlyText = '';
            Object.entries(stats.hourlyStats)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .forEach(([hour, count]) => {
                    const barWidth = Math.max(1, (count / Math.max(...Object.values(stats.hourlyStats))) * 100);
                    hourlyText += `${hour}:00 - ${count} accesos ${'█'.repeat(Math.floor(barWidth / 10))}\n`;
                });
            hourlyStatsEl.textContent = hourlyText || 'No hay datos';
        }
        
        // Estadísticas por portal
        const portalStatsEl = document.getElementById('portalStatsText');
        if (portalStatsEl) {
            let portalText = '';
            Object.entries(stats.portalStats).forEach(([portal, count]) => {
                portalText += `${portal}: ${count} accesos\n`;
            });
            portalStatsEl.textContent = portalText || 'No hay datos';
        }
        
        // Usuarios más activos
        const userStatsEl = document.getElementById('userStatsText');
        if (userStatsEl) {
            let userText = '';
            Object.values(stats.userStats)
                .sort((a, b) => b.accesses - a.accesses)
                .slice(0, 10)
                .forEach(user => {
                    userText += `${user.userName}: ${user.accesses} accesos\n`;
                });
            userStatsEl.textContent = userText || 'No hay datos';
        }
        
        // Actividad reciente
        const recentActivityEl = document.getElementById('recentActivityText');
        if (recentActivityEl) {
            const recentActions = window.auditSystem.getRecentActions(10);
            let activityText = '';
            recentActions.forEach(action => {
                const date = new Date(action.timestamp);
                activityText += `${date.toLocaleTimeString('es-ES')} - ${action.userName || 'N/A'}: ${action.action}\n`;
            });
            recentActivityEl.textContent = activityText || 'No hay actividad reciente';
        }
    }
    
    populateAuditFilters() {
        // Poblar filtro de usuarios
        const userFilter = document.getElementById('auditUserFilter');
        if (userFilter && window.auditSystem) {
            const actions = window.auditSystem.getRecentActions(1000);
            const uniqueUsers = [...new Set(actions.map(a => a.userName).filter(Boolean))];
            
            userFilter.innerHTML = '<option value="">Todos los usuarios</option>';
            uniqueUsers.forEach(userName => {
                const option = document.createElement('option');
                option.value = userName;
                option.textContent = userName;
                userFilter.appendChild(option);
            });
        }
        
        // Configurar fechas por defecto
        const dateFrom = document.getElementById('auditDateFrom');
        const dateTo = document.getElementById('auditDateTo');
        const today = new Date();
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        if (dateFrom) dateFrom.value = weekAgo.toISOString().split('T')[0];
        if (dateTo) dateTo.value = today.toISOString().split('T')[0];
    }
    
    switchAuditTab(tabName) {
        // Remover clase activa de todos los botones
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.audit-tab-content').forEach(content => content.classList.remove('active'));
        
        // Activar tab seleccionado
        const tabButton = document.querySelector(`[onclick="switchAuditTab('${tabName}')"]`);
        const tabContent = document.getElementById(`auditTab${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);
        
        if (tabButton) tabButton.classList.add('active');
        if (tabContent) tabContent.classList.add('active');
        
        // Cargar contenido específico del tab
        switch (tabName) {
            case 'accesses':
                this.loadAccessLogsTable();
                break;
            case 'actions':
                this.loadActionLogsTable();
                break;
            case 'stats':
                this.loadAuditStats();
                break;
        }
    }
    
    // Funciones auxiliares para auditoría
    getBrowserName(userAgent) {
        if (!userAgent) return 'Desconocido';
        
        if (userAgent.includes('Chrome')) return 'Chrome';
        if (userAgent.includes('Firefox')) return 'Firefox';
        if (userAgent.includes('Safari')) return 'Safari';
        if (userAgent.includes('Edge')) return 'Edge';
        if (userAgent.includes('Opera')) return 'Opera';
        
        return 'Otro';
    }
    
    getActionDisplayName(action) {
        const names = {
            'LOGIN_SUCCESS': 'Login Exitoso',
            'LOGIN_FAILED': 'Login Fallido',
            'LOGOUT': 'Logout',
            'CREATE': 'Crear',
            'UPDATE': 'Actualizar',
            'DELETE': 'Eliminar',
            'APPROVE': 'Aprobar',
            'REJECT': 'Rechazar',
            'approved': 'Aprobado',
            'rejected': 'Rechazado',
            'edited': 'Editado',
            'deleted': 'Eliminado'
        };
        return names[action] || action;
    }
    
    formatActionDetails(details) {
        if (!details) return '';
        if (typeof details === 'string') return details;
        if (typeof details === 'object') {
            return Object.entries(details)
                .map(([key, value]) => `${key}: ${value}`)
                .join(', ');
        }
        return JSON.stringify(details);
    }
}

// Funciones globales para el sistema administrativo
window.showLoginModal = function() {
    console.log('Mostrando modal de login');
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.style.display = 'block';
        // Limpiar formulario
        const form = document.getElementById('loginForm');
        if (form) {
            form.reset();
        }
        // Limpiar errores previos
        const errorDiv = document.getElementById('loginError');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    } else {
        console.error('No se encontró el modal de login');
    }
};

window.closeLoginModal = function() {
    console.log('Cerrando modal de login');
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.style.display = 'none';
        // Limpiar formulario
        const form = document.getElementById('loginForm');
        if (form) {
            form.reset();
        }
        // Limpiar errores
        const errorDiv = document.getElementById('loginError');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }
};

window.logout = function() {
    if (window.adminSystem) {
        window.adminSystem.logout();
    }
};

window.showAdminSection = function(sectionId) {
    if (window.adminSystem) {
        window.adminSystem.showAdminSection(sectionId);
    }
};

window.generateReport = function() {
    if (window.adminSystem) {
        window.adminSystem.generateReport();
    }
};

window.saveSettings = function() {
    if (window.adminSystem) {
        window.adminSystem.saveSettings();
    }
};

window.printReport = function() {
    window.print();
};

window.exportAuditReport = function() {
    const auditData = {
        generatedBy: window.adminSystem?.currentUser?.name || 'Usuario Desconocido',
        generatedAt: new Date().toISOString(),
        deletedVehicles: JSON.parse(localStorage.getItem('aduanasDeletedVehicles') || '[]'),
        deletedAppointments: JSON.parse(localStorage.getItem('aduanasDeletedAppointments') || '[]'),
        modifiedVehicles: window.vehicleManagement ? window.vehicleManagement.vehicles.filter(v => v.lastModified) : [],
        modifiedAppointments: window.bookingSystem ? window.bookingSystem.reservations.filter(a => a.lastModified) : []
    };
    
    const jsonString = JSON.stringify(auditData, null, 2);
    console.log('📊 Reporte de Auditoría Exportado:', jsonString);
    alert('Reporte de auditoría generado. Ver consola para detalles completos.');
};

// ============================================================================
// FUNCIONES GLOBALES PARA GESTIÓN DE TURISMO
// ============================================================================

// Función global para aprobar solicitud turística
window.approveTourismRequest = function(requestId) {
    console.log('✅ Aprobando solicitud turística:', requestId);
    
    if (!window.tourismManagement) {
        alert('❌ Sistema de turismo no disponible');
        return;
    }
    
    const comments = prompt('Comentarios de aprobación (opcional):');
    if (comments === null) return; // Usuario canceló
    
    const result = window.tourismManagement.approveTourismRequest(requestId, comments);
    
    if (result.success) {
        showAdminNotification('Solicitud aprobada exitosamente', 'success');
        
        // Recargar la sección de turismo si está disponible
        if (window.adminSystem) {
            window.adminSystem.loadTourismSection();
        }
    } else {
        showAdminNotification('Error al aprobar solicitud: ' + result.error, 'error');
    }
};

// Función global para rechazar solicitud turística
window.rejectTourismRequest = function(requestId) {
    console.log('❌ Rechazando solicitud turística:', requestId);
    
    if (!window.tourismManagement) {
        alert('❌ Sistema de turismo no disponible');
        return;
    }
    
    const reason = prompt('Motivo del rechazo (requerido):');
    if (!reason || reason.trim() === '') {
        alert('⚠️ Debe proporcionar un motivo para el rechazo');
        return;
    }
    
    const result = window.tourismManagement.rejectTourismRequest(requestId, reason.trim());
    
    if (result.success) {
        showAdminNotification('Solicitud rechazada exitosamente', 'warning');
        
        // Recargar la sección de turismo si está disponible
        if (window.adminSystem) {
            window.adminSystem.loadTourismSection();
        }
    } else {
        showAdminNotification('Error al rechazar solicitud: ' + result.error, 'error');
    }
};

// Función global para editar solicitud turística
window.editTourismRequest = function(requestId) {
    console.log('✏️ Editando solicitud turística:', requestId);
    
    if (!window.tourismManagement) {
        alert('❌ Sistema de turismo no disponible');
        return;
    }
    
    const request = window.tourismManagement.getTourismRequestById(requestId);
    if (!request) {
        alert('❌ Solicitud no encontrada');
        return;
    }
    
    // Crear modal de edición
    const modalHTML = `
        <div class="modal" id="editTourismModal" style="display: block;">
            <div class="modal-content" style="max-width: 600px; max-height: 80vh; overflow-y: auto;">
                <span class="close" onclick="closeEditTourismModal()">&times;</span>
                <div class="modal-header">
                    <i class="fas fa-edit"></i>
                    <h3>Editar Solicitud Turística</h3>
                </div>
                <div class="modal-body">
                    <form id="editTourismForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Nombre Completo *</label>
                                <input type="text" id="editTouristName" value="${request.touristName}" required>
                            </div>
                            <div class="form-group">
                                <label>RUT</label>
                                <input type="text" id="editTouristRut" value="${request.touristRut || ''}" placeholder="12345678-9">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" id="editEmail" value="${request.email || ''}">
                            </div>
                            <div class="form-group">
                                <label>Teléfono</label>
                                <input type="tel" id="editPhone" value="${request.phone || ''}">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Nacionalidad *</label>
                                <select id="editNationality" required>
                                    <option value="">Seleccionar...</option>
                                    <option value="argentina" ${request.nationality === 'argentina' ? 'selected' : ''}>Argentina</option>
                                    <option value="brasil" ${request.nationality === 'brasil' ? 'selected' : ''}>Brasil</option>
                                    <option value="colombia" ${request.nationality === 'colombia' ? 'selected' : ''}>Colombia</option>
                                    <option value="chile" ${request.nationality === 'chile' ? 'selected' : ''}>Chile</option>
                                    <option value="peru" ${request.nationality === 'peru' ? 'selected' : ''}>Perú</option>
                                    <option value="mexico" ${request.nationality === 'mexico' ? 'selected' : ''}>México</option>
                                    <option value="usa" ${request.nationality === 'usa' ? 'selected' : ''}>Estados Unidos</option>
                                    <option value="espana" ${request.nationality === 'espana' ? 'selected' : ''}>España</option>
                                    <option value="francia" ${request.nationality === 'francia' ? 'selected' : ''}>Francia</option>
                                    <option value="otro" ${request.nationality === 'otro' ? 'selected' : ''}>Otro</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Número de Pasaporte *</label>
                                <input type="text" id="editPassportNumber" value="${request.passportNumber}" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Fecha de Llegada *</label>
                                <input type="date" id="editArrivalDate" value="${request.arrivalDate.toISOString().split('T')[0]}" required>
                            </div>
                            <div class="form-group">
                                <label>Fecha de Salida *</label>
                                <input type="date" id="editDepartureDate" value="${request.departureDate.toISOString().split('T')[0]}" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Tipo de Asistencia *</label>
                            <select id="editTourismType" required>
                                <option value="">Seleccionar...</option>
                                <option value="entrada" ${request.tourismType === 'entrada' ? 'selected' : ''}>Asistencia de Entrada</option>
                                <option value="salida" ${request.tourismType === 'salida' ? 'selected' : ''}>Asistencia de Salida</option>
                                <option value="declaracion" ${request.tourismType === 'declaracion' ? 'selected' : ''}>Declaración de Bienes</option>
                                <option value="consulta" ${request.tourismType === 'consulta' ? 'selected' : ''}>Consulta General</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Estado</label>
                            <select id="editStatus">
                                <option value="pending" ${request.status === 'pending' ? 'selected' : ''}>Pendiente</option>
                                <option value="approved" ${request.status === 'approved' ? 'selected' : ''}>Aprobado</option>
                                <option value="rejected" ${request.status === 'rejected' ? 'selected' : ''}>Rechazado</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Comentarios</label>
                            <textarea id="editComments" rows="3">${request.comments || ''}</textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="closeEditTourismModal()">Cancelar</button>
                    <button class="btn-primary" onclick="saveTourismEdit('${requestId}')">Guardar Cambios</button>
                </div>
            </div>
        </div>
    `;
    
    // Agregar modal al DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
};

// Función para cerrar modal de edición
window.closeEditTourismModal = function() {
    const modal = document.getElementById('editTourismModal');
    if (modal) {
        modal.remove();
    }
};

// Función para guardar cambios de edición
window.saveTourismEdit = function(requestId) {
    const updateData = {
        touristName: document.getElementById('editTouristName').value.trim(),
        touristRut: document.getElementById('editTouristRut').value.trim(),
        email: document.getElementById('editEmail').value.trim(),
        phone: document.getElementById('editPhone').value.trim(),
        nationality: document.getElementById('editNationality').value,
        passportNumber: document.getElementById('editPassportNumber').value.trim(),
        arrivalDate: new Date(document.getElementById('editArrivalDate').value),
        departureDate: new Date(document.getElementById('editDepartureDate').value),
        tourismType: document.getElementById('editTourismType').value,
        status: document.getElementById('editStatus').value,
        comments: document.getElementById('editComments').value.trim()
    };
    
    // Validaciones básicas
    if (!updateData.touristName || !updateData.nationality || !updateData.passportNumber) {
        alert('❌ Por favor complete los campos requeridos');
        return;
    }
    
    if (updateData.departureDate <= updateData.arrivalDate) {
        alert('❌ La fecha de salida debe ser posterior a la de llegada');
        return;
    }
    
    const result = window.tourismManagement.updateTourismRequest(requestId, updateData);
    
    if (result.success) {
        alert('✅ Solicitud actualizada exitosamente');
        closeEditTourismModal();
        
        // Recargar la sección de turismo
        if (window.adminSystem) {
            window.adminSystem.loadTourismSection();
        }
    } else {
        alert('❌ Error al actualizar solicitud: ' + result.error);
    }
};

// Función global para eliminar solicitud turística
window.deleteTourismRequest = function(requestId) {
    console.log('🗑️ Eliminando solicitud turística:', requestId);
    
    if (!window.tourismManagement) {
        alert('❌ Sistema de turismo no disponible');
        return;
    }
    
    const request = window.tourismManagement.getTourismRequestById(requestId);
    if (!request) {
        alert('❌ Solicitud no encontrada');
        return;
    }
    
    if (confirm(`¿Está seguro de que desea eliminar la solicitud de ${request.touristName}?\n\nEsta acción no se puede deshacer.`)) {
        const result = window.tourismManagement.deleteTourismRequest(requestId);
        
        if (result.success) {
            alert('✅ Solicitud eliminada exitosamente');
            
            // Recargar la sección de turismo
            if (window.adminSystem) {
                window.adminSystem.loadTourismSection();
            }
            
            // Mostrar notificación
            if (window.AduanasSystem) {
                window.AduanasSystem.showNotification('Solicitud turística eliminada', 'success');
            }
        } else {
            alert('❌ Error al eliminar solicitud: ' + result.error);
        }
    }
};

// Función para crear nueva solicitud desde admin
window.createNewTourismRequest = function() {
    console.log('➕ Creando nueva solicitud turística...');
    
    // Verificar que estamos en el contexto correcto
    if (!window.tourismManagement) {
        console.error('❌ Sistema de turismo no disponible');
        if (window.AduanasSystem) {
            window.AduanasSystem.showNotification('Sistema de turismo no disponible', 'error');
        }
        return;
    }
    
    // Verificar sesión activa
    const session = JSON.parse(localStorage.getItem('aduanasAdminSession') || '{}');
    if (!session.user) {
        console.error('❌ Sesión no válida');
        alert('⚠️ Su sesión ha expirado. Por favor, inicie sesión nuevamente.');
        return;
    }
    
    // Crear el modal dentro del admin portal
    const modalHTML = `
        <div class="modal" id="newTourismModal" style="display: block; z-index: 10000;">
            <div class="modal-content" style="max-width: 700px; max-height: 85vh; overflow-y: auto; margin: 2% auto;">
                <div class="modal-header" style="background: #28a745; color: white; padding: 15px; margin: -20px -20px 20px -20px; border-radius: 8px 8px 0 0;">
                    <span class="close" onclick="closeNewTourismModal()" style="color: white; font-size: 24px; font-weight: bold; float: right; cursor: pointer;">&times;</span>
                    <h3 style="margin: 0; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-plus"></i> Nueva Solicitud Turística
                    </h3>
                </div>
                <div class="modal-body" style="padding: 0 20px;">
                    <form id="newTourismForm">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                            <div class="form-group">
                                <label style="font-weight: bold; margin-bottom: 5px; display: block;">Nombre Completo *</label>
                                <input type="text" id="newTouristName" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            </div>
                            <div class="form-group">
                                <label style="font-weight: bold; margin-bottom: 5px; display: block;">RUT</label>
                                <input type="text" id="newTouristRut" placeholder="12345678-9" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                            <div class="form-group">
                                <label style="font-weight: bold; margin-bottom: 5px; display: block;">Email</label>
                                <input type="email" id="newEmail" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            </div>
                            <div class="form-group">
                                <label style="font-weight: bold; margin-bottom: 5px; display: block;">Teléfono</label>
                                <input type="tel" id="newPhone" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                            <div class="form-group">
                                <label style="font-weight: bold; margin-bottom: 5px; display: block;">Nacionalidad *</label>
                                <select id="newNationality" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                    <option value="">Seleccionar...</option>
                                    <option value="argentina">Argentina</option>
                                    <option value="brasil">Brasil</option>
                                    <option value="colombia">Colombia</option>
                                    <option value="chile">Chile</option>
                                    <option value="peru">Perú</option>
                                    <option value="mexico">México</option>
                                    <option value="usa">Estados Unidos</option>
                                    <option value="espana">España</option>
                                    <option value="francia">Francia</option>
                                    <option value="otro">Otro</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label style="font-weight: bold; margin-bottom: 5px; display: block;">Número de Pasaporte *</label>
                                <input type="text" id="newPassportNumber" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                            <div class="form-group">
                                <label style="font-weight: bold; margin-bottom: 5px; display: block;">Fecha de Llegada *</label>
                                <input type="date" id="newArrivalDate" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            </div>
                            <div class="form-group">
                                <label style="font-weight: bold; margin-bottom: 5px; display: block;">Fecha de Salida *</label>
                                <input type="date" id="newDepartureDate" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            </div>
                        </div>
                        <div class="form-group" style="margin-bottom: 15px;">
                            <label style="font-weight: bold; margin-bottom: 5px; display: block;">Tipo de Asistencia *</label>
                            <select id="newTourismType" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                <option value="">Seleccionar...</option>
                                <option value="entrada">Asistencia de Entrada</option>
                                <option value="salida">Asistencia de Salida</option>
                                <option value="declaracion">Declaración de Bienes</option>
                                <option value="consulta">Consulta General</option>
                            </select>
                        </div>
                        <div class="form-group" style="margin-bottom: 20px;">
                            <label style="font-weight: bold; margin-bottom: 5px; display: block;">Comentarios</label>
                            <textarea id="newComments" rows="3" placeholder="Información adicional..." style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; resize: vertical;"></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer" style="padding: 15px 20px; border-top: 1px solid #eee; margin: 20px -20px -20px -20px; text-align: right; background: #f8f9fa;">
                    <button class="btn-secondary" onclick="closeNewTourismModal()" style="margin-right: 10px; padding: 8px 16px; border: 1px solid #6c757d; background: #6c757d; color: white; border-radius: 4px; cursor: pointer;">
                        Cancelar
                    </button>
                    <button class="btn-primary" onclick="saveNewTourismRequest()" style="padding: 8px 16px; border: none; background: #28a745; color: white; border-radius: 4px; cursor: pointer;">
                        <i class="fas fa-save"></i> Crear Solicitud
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Buscar un contenedor apropiado (preferiblemente dentro del admin portal)
    const adminPanel = document.getElementById('adminPanel') || document.body;
    adminPanel.insertAdjacentHTML('beforeend', modalHTML);
    
    // Establecer fecha mínima como hoy
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('newArrivalDate').min = today;
    document.getElementById('newDepartureDate').min = today;
    
    // Agregar event listener para cerrar con escape
    const newModalEscapeHandler = function(event) {
        if (event.key === 'Escape') {
            closeNewTourismModal();
        }
    };
    document.addEventListener('keydown', newModalEscapeHandler);
    
    // Guardar referencia del handler para poder eliminarlo después
    const modal = document.getElementById('newTourismModal');
    if (modal) {
        modal.escapeHandler = newModalEscapeHandler;
    }
    
    // Enfocar el primer campo
    setTimeout(() => {
        const firstField = document.getElementById('newTouristName');
        if (firstField) {
            firstField.focus();
        }
    }, 100);
};

window.closeNewTourismModal = function() {
    console.log('🔒 Cerrando modal de nueva solicitud...');
    
    const modal = document.getElementById('newTourismModal');
    if (modal) {
        // Remover el event listener de escape si existe
        if (modal.escapeHandler) {
            document.removeEventListener('keydown', modal.escapeHandler);
        }
        
        // Animación de salida suave
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            modal.remove();
        }, 200);
    }
    
    // Asegurar que no queden overlays
    const existingModals = document.querySelectorAll('#newTourismModal');
    existingModals.forEach(m => m.remove());
};

window.saveNewTourismRequest = function() {
    console.log('💾 Guardando nueva solicitud turística...');
    
    // Verificar sesión antes de proceder
    const session = JSON.parse(localStorage.getItem('aduanasAdminSession') || '{}');
    if (!session.user) {
        alert('⚠️ Su sesión ha expirado. Por favor, recargue la página e inicie sesión nuevamente.');
        closeNewTourismModal();
        return;
    }
    
    // Verificar sistema de turismo
    if (!window.tourismManagement) {
        alert('❌ Sistema de turismo no disponible. Contacte al administrador.');
        closeNewTourismModal();
        return;
    }
    
    try {
        const newData = {
            touristName: document.getElementById('newTouristName')?.value?.trim() || '',
            touristRut: document.getElementById('newTouristRut')?.value?.trim() || '',
            email: document.getElementById('newEmail')?.value?.trim() || '',
            phone: document.getElementById('newPhone')?.value?.trim() || '',
            nationality: document.getElementById('newNationality')?.value || '',
            passportNumber: document.getElementById('newPassportNumber')?.value?.trim() || '',
            arrivalDate: document.getElementById('newArrivalDate')?.value ? new Date(document.getElementById('newArrivalDate').value) : null,
            departureDate: document.getElementById('newDepartureDate')?.value ? new Date(document.getElementById('newDepartureDate').value) : null,
            tourismType: document.getElementById('newTourismType')?.value || '',
            comments: document.getElementById('newComments')?.value?.trim() || ''
        };
        
        // Validaciones
        if (!newData.touristName) {
            alert('❌ El nombre completo es requerido');
            document.getElementById('newTouristName')?.focus();
            return;
        }
        
        if (!newData.nationality) {
            alert('❌ La nacionalidad es requerida');
            document.getElementById('newNationality')?.focus();
            return;
        }
        
        if (!newData.passportNumber) {
            alert('❌ El número de pasaporte es requerido');
            document.getElementById('newPassportNumber')?.focus();
            return;
        }
        
        if (!newData.tourismType) {
            alert('❌ El tipo de asistencia es requerido');
            document.getElementById('newTourismType')?.focus();
            return;
        }
        
        if (!newData.arrivalDate || !newData.departureDate) {
            alert('❌ Las fechas de llegada y salida son requeridas');
            return;
        }
        
        if (newData.departureDate <= newData.arrivalDate) {
            alert('❌ La fecha de salida debe ser posterior a la de llegada');
            document.getElementById('newDepartureDate')?.focus();
            return;
        }
        
        // Validar que las fechas no sean en el pasado
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (newData.arrivalDate < today) {
            alert('❌ La fecha de llegada no puede ser anterior a hoy');
            document.getElementById('newArrivalDate')?.focus();
            return;
        }
        
        // Mostrar indicador de carga
        const saveButton = document.querySelector('#newTourismModal .btn-primary');
        if (saveButton) {
            saveButton.disabled = true;
            saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        }
        
        // Crear la solicitud
        const result = window.tourismManagement.createTourismRequest(newData);
        
        if (result.success) {
            // Mostrar mensaje de éxito con nueva función
            showAdminNotification('Solicitud turística creada exitosamente', 'success');
            
            // Cerrar modal
            closeNewTourismModal();
            
            // Recargar la sección de turismo para mostrar la nueva solicitud
            setTimeout(() => {
                if (window.adminSystem && typeof window.adminSystem.loadTourismSection === 'function') {
                    window.adminSystem.loadTourismSection();
                } else {
                    // Fallback: recargar la página si no se puede recargar la sección
                    console.log('🔄 Recargando datos de turismo...');
                    if (window.adminSystem && typeof window.adminSystem.loadTourismRequests === 'function') {
                        window.adminSystem.loadTourismRequests();
                    }
                }
            }, 500);
            
        } else {
            // Mostrar error
            showAdminNotification('Error al crear solicitud: ' + (result.error || 'Error desconocido'), 'error');
            
            // Restaurar botón
            if (saveButton) {
                saveButton.disabled = false;
                saveButton.innerHTML = '<i class="fas fa-save"></i> Crear Solicitud';
            }
        }
        
    } catch (error) {
        console.error('❌ Error inesperado al crear solicitud:', error);
        alert('❌ Error inesperado al crear la solicitud. Por favor, intente nuevamente.');
        
        // Restaurar botón
        const saveButton = document.querySelector('#newTourismModal .btn-primary');
        if (saveButton) {
            saveButton.disabled = false;
            saveButton.innerHTML = '<i class="fas fa-save"></i> Crear Solicitud';
        }
    }
};

// Función para ver detalles de solicitud turística
window.viewTourismRequest = function(requestId) {
    console.log('👁️ Viendo detalles de solicitud turística:', requestId);
    
    if (!window.tourismManagement) {
        alert('❌ Sistema de turismo no disponible');
        return;
    }
    
    const request = window.tourismManagement.getTourismRequestById(requestId);
    if (!request) {
        alert('❌ Solicitud no encontrada');
        return;
    }
    
    const nationalityNames = {
        'argentina': 'Argentina', 'brasil': 'Brasil', 'colombia': 'Colombia',
        'chile': 'Chile', 'peru': 'Perú', 'mexico': 'México',
        'usa': 'Estados Unidos', 'espana': 'España', 'francia': 'Francia', 'otro': 'Otro'
    };
    
    const typeNames = {
        'entrada': 'Asistencia de Entrada', 'salida': 'Asistencia de Salida',
        'declaracion': 'Declaración de Bienes', 'consulta': 'Consulta General'
    };
    
    const statusNames = {
        'pending': 'Pendiente', 'approved': 'Aprobado', 'rejected': 'Rechazado'
    };
    
    const modalHTML = `
        <div class="modal" id="viewTourismModal" style="display: block;">
            <div class="modal-content" style="max-width: 700px;">
                <span class="close" onclick="closeViewTourismModal()">&times;</span>
                <div class="modal-header">
                    <i class="fas fa-eye"></i>
                    <h3>Detalles de Solicitud Turística</h3>
                </div>
                <div class="modal-body">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div class="detail-section">
                            <h4><i class="fas fa-user"></i> Información Personal</h4>
                            <div class="detail-item">
                                <strong>Nombre:</strong> ${request.touristName}
                            </div>
                            ${request.touristRut ? `
                                <div class="detail-item">
                                    <strong>RUT:</strong> ${request.touristRut}
                                </div>
                            ` : ''}
                            ${request.email ? `
                                <div class="detail-item">
                                    <strong>Correo Electrónico:</strong> ${request.email}
                                </div>
                            ` : ''}
                            ${request.phone ? `
                                <div class="detail-item">
                                    <strong>Teléfono:</strong> ${request.phone}
                                </div>
                            ` : ''}
                            <div class="detail-item">
                                <strong>Nacionalidad:</strong> ${nationalityNames[request.nationality] || request.nationality}
                            </div>
                            <div class="detail-item">
                                <strong>Número de Pasaporte:</strong> ${request.passportNumber}
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4><i class="fas fa-calendar"></i> Información del Viaje</h4>
                            <div class="detail-item">
                                <strong>Fecha de Llegada:</strong> ${request.arrivalDate.toLocaleDateString('es-ES')}
                            </div>
                            <div class="detail-item">
                                <strong>Fecha de Salida:</strong> ${request.departureDate.toLocaleDateString('es-ES')}
                            </div>
                            <div class="detail-item">
                                <strong>Duración:</strong> ${Math.ceil((request.departureDate - request.arrivalDate) / (1000 * 60 * 60 * 24))} días
                            </div>
                            <div class="detail-item">
                                <strong>Tipo de Asistencia:</strong> ${typeNames[request.tourismType] || request.tourismType}
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h4><i class="fas fa-info-circle"></i> Estado y Procesamiento</h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
                            <div class="detail-item">
                                <strong>ID de Solicitud:</strong><br>
                                <code style="background: #f8f9fa; padding: 2px 6px; border-radius: 3px; font-size: 12px;">${request.requestId}</code>
                            </div>
                            <div class="detail-item">
                                <strong>Estado:</strong><br>
                                <span class="status-${request.status}" style="padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                                    ${statusNames[request.status] || request.status}
                                </span>
                            </div>
                            <div class="detail-item">
                                <strong>Fecha de Solicitud:</strong><br>
                                ${request.requestDate.toLocaleString('es-ES')}
                            </div>
                        </div>
                        
                        ${request.status === 'approved' && request.approvedAt ? `
                            <div style="margin-top: 15px; padding: 10px; background: #d4edda; border-left: 4px solid #28a745; border-radius: 4px;">
                                <strong>✅ Aprobado por:</strong> ${request.approvedBy || 'N/A'}<br>
                                <strong>Fecha:</strong> ${new Date(request.approvedAt).toLocaleString('es-ES')}<br>
                                ${request.approvalComments ? `<strong>Comentarios:</strong> ${request.approvalComments}` : ''}
                            </div>
                        ` : ''}
                        
                        ${request.status === 'rejected' && request.rejectedAt ? `
                            <div style="margin-top: 15px; padding: 10px; background: #f8d7da; border-left: 4px solid #dc3545; border-radius: 4px;">
                                <strong>❌ Rechazado por:</strong> ${request.rejectedBy || 'N/A'}<br>
                                <strong>Fecha:</strong> ${new Date(request.rejectedAt).toLocaleString('es-ES')}<br>
                                <strong>Motivo:</strong> ${request.rejectionReason || 'No especificado'}
                            </div>
                        ` : ''}
                    </div>
                    
                    ${request.emergencyContact || request.emergencyPhone ? `
                        <div class="detail-section">
                            <h4><i class="fas fa-phone"></i> Contacto de Emergencia</h4>
                            ${request.emergencyContact ? `
                                <div class="detail-item">
                                    <strong>Contacto:</strong> ${request.emergencyContact}
                                </div>
                            ` : ''}
                            ${request.emergencyPhone ? `
                                <div class="detail-item">
                                    <strong>Teléfono:</strong> ${request.emergencyPhone}
                                </div>
                            ` : ''}
                        </div>
                    ` : ''}
                    
                    ${request.comments ? `
                        <div class="detail-section">
                            <h4><i class="fas fa-comment"></i> Comentarios Adicionales</h4>
                            <div style="background: #f8f9fa; padding: 10px; border-radius: 4px; font-style: italic;">
                                "${request.comments}"
                            </div>
                        </div>
                    ` : ''}
                </div>
                <div class="modal-footer">
                    ${request.status === 'pending' ? `
                        <button class="btn-success" onclick="approveTourismRequest('${request.requestId}'); closeViewTourismModal();">
                            <i class="fas fa-check"></i> Aprobar
                        </button>
                        <button class="btn-danger" onclick="rejectTourismRequest('${request.requestId}'); closeViewTourismModal();">
                            <i class="fas fa-times"></i> Rechazar
                        </button>
                    ` : ''}
                    <button class="btn-primary" onclick="editTourismRequest('${request.requestId}'); closeViewTourismModal();">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-secondary" onclick="closeViewTourismModal()">Cerrar</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
};

window.closeViewTourismModal = function() {
    const modal = document.getElementById('viewTourismModal');
    if (modal) {
        modal.remove();
    }
};

// ============================================================================
// FUNCIONES GLOBALES PARA GESTIÓN DE VEHÍCULOS - CRUD COMPLETO
// ============================================================================

// Función global para ver detalles de vehículo
window.viewVehicleAdmin = function(vehicleId) {
    console.log('👁️ Viendo detalles de vehículo:', vehicleId);
    
    if (!window.vehicleManagement) {
        showAdminNotification('Sistema de vehículos no disponible', 'error');
        return;
    }
    
    const vehicle = window.vehicleManagement.getVehicleById(vehicleId);
    if (!vehicle) {
        showAdminNotification('Vehículo no encontrado', 'error');
        return;
    }
    
    const typeNames = {
        'automovil': 'Automóvil',
        'camioneta': 'Camioneta',
        'camion': 'Camión',
        'motocicleta': 'Motocicleta',
        'bus': 'Bus',
        'remolque': 'Remolque'
    };
    
    const purposeNames = {
        'personal': 'Uso Personal',
        'comercial': 'Uso Comercial',
        'turismo': 'Turismo',
        'carga': 'Transporte de Carga',
        'pasajeros': 'Transporte de Pasajeros'
    };
    
    const statusNames = {
        'pending': 'Pendiente',
        'approved': 'Aprobado',
        'rejected': 'Rechazado',
        'registered': 'Registrado'
    };
    
    const modalHTML = `
        <div class="modal" id="viewVehicleModal" style="display: block; z-index: 10000;">
            <div class="modal-content" style="max-width: 800px; max-height: 85vh; overflow-y: auto;">
                <div class="modal-header" style="background: #17a2b8; color: white; padding: 15px; margin: -20px -20px 20px -20px; border-radius: 8px 8px 0 0;">
                    <span class="close" onclick="closeViewVehicleModal()" style="color: white; font-size: 24px; font-weight: bold; float: right; cursor: pointer;">&times;</span>
                    <h3 style="margin: 0; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-car"></i> Detalles del Vehículo
                    </h3>
                </div>
                <div class="modal-body" style="padding: 0 20px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div class="detail-section">
                            <h4><i class="fas fa-id-card"></i> Información del Vehículo</h4>
                            <div class="detail-item" style="margin-bottom: 10px;">
                                <strong>Patente:</strong> ${vehicle.plateNumber}
                            </div>
                            <div class="detail-item" style="margin-bottom: 10px;">
                                <strong>Marca:</strong> ${vehicle.vehicleBrand}
                            </div>
                            <div class="detail-item" style="margin-bottom: 10px;">
                                <strong>Modelo:</strong> ${vehicle.vehicleModel}
                            </div>
                            <div class="detail-item" style="margin-bottom: 10px;">
                                <strong>Año:</strong> ${vehicle.vehicleYear || 'No especificado'}
                            </div>
                            <div class="detail-item" style="margin-bottom: 10px;">
                                <strong>Color:</strong> ${vehicle.vehicleColor || 'No especificado'}
                            </div>
                            <div class="detail-item" style="margin-bottom: 10px;">
                                <strong>Tipo:</strong> ${typeNames[vehicle.vehicleType] || vehicle.vehicleType}
                            </div>
                            <div class="detail-item" style="margin-bottom: 10px;">
                                <strong>Propósito:</strong> ${purposeNames[vehicle.vehiclePurpose] || vehicle.vehiclePurpose}
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4><i class="fas fa-user"></i> Información del Propietario</h4>
                            <div class="detail-item" style="margin-bottom: 10px;">
                                <strong>Nombre:</strong> ${vehicle.ownerName}
                            </div>
                            <div class="detail-item" style="margin-bottom: 10px;">
                                <strong>RUT:</strong> ${vehicle.ownerRut || 'No especificado'}
                            </div>
                            <div class="detail-item" style="margin-bottom: 10px;">
                                <strong>Email:</strong> ${vehicle.ownerEmail || 'No especificado'}
                            </div>
                            <div class="detail-item" style="margin-bottom: 10px;">
                                <strong>Teléfono:</strong> ${vehicle.ownerPhone || 'No especificado'}
                            </div>
                            <div class="detail-item" style="margin-bottom: 10px;">
                                <strong>Dirección:</strong> ${vehicle.ownerAddress || 'No especificado'}
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h4><i class="fas fa-info-circle"></i> Estado y Procesamiento</h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
                            <div class="detail-item">
                                <strong>ID de Registro:</strong><br>
                                <code style="background: #f8f9fa; padding: 2px 6px; border-radius: 3px; font-size: 12px;">${vehicle.vehicleId}</code>
                            </div>
                            <div class="detail-item">
                                <strong>Estado:</strong><br>
                                <span class="status-${vehicle.status}" style="padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                                    ${statusNames[vehicle.status] || vehicle.status}
                                </span>
                            </div>
                            <div class="detail-item">
                                <strong>Fecha de Registro:</strong><br>
                                ${new Date(vehicle.registrationDate).toLocaleString('es-ES')}
                            </div>
                        </div>
                        
                        ${vehicle.lastModified ? `
                            <div style="margin-top: 15px; padding: 10px; background: #e3f2fd; border-left: 4px solid #2196f3; border-radius: 4px;">
                                <strong>📝 Última Modificación:</strong><br>
                                <strong>Por:</strong> ${vehicle.lastModified.userName}<br>
                                <strong>Acción:</strong> ${vehicle.lastModified.action}<br>
                                <strong>Fecha:</strong> ${new Date(vehicle.lastModified.timestamp).toLocaleString('es-ES')}<br>
                                ${vehicle.lastModified.reason ? `<strong>Motivo:</strong> ${vehicle.lastModified.reason}` : ''}
                            </div>
                        ` : ''}
                    </div>
                    
                    ${vehicle.comments ? `
                        <div class="detail-section">
                            <h4><i class="fas fa-comment"></i> Comentarios</h4>
                            <div style="background: #f8f9fa; padding: 10px; border-radius: 4px; font-style: italic;">
                                "${vehicle.comments}"
                            </div>
                        </div>
                    ` : ''}
                </div>
                <div class="modal-footer" style="padding: 15px 20px; border-top: 1px solid #eee; margin: 20px -20px -20px -20px; text-align: right; background: #f8f9fa;">
                    ${vehicle.status === 'pending' ? `
                        <button class="btn-success" onclick="approveVehicleAdmin('${vehicle.vehicleId}'); closeViewVehicleModal();" style="margin-right: 10px; padding: 8px 16px; border: none; background: #28a745; color: white; border-radius: 4px; cursor: pointer;">
                            <i class="fas fa-check"></i> Aprobar
                        </button>
                        <button class="btn-danger" onclick="rejectVehicleAdmin('${vehicle.vehicleId}'); closeViewVehicleModal();" style="margin-right: 10px; padding: 8px 16px; border: none; background: #dc3545; color: white; border-radius: 4px; cursor: pointer;">
                            <i class="fas fa-times"></i> Rechazar
                        </button>
                    ` : ''}
                    <button class="btn-primary" onclick="editVehicleAdmin('${vehicle.vehicleId}'); closeViewVehicleModal();" style="margin-right: 10px; padding: 8px 16px; border: none; background: #007bff; color: white; border-radius: 4px; cursor: pointer;">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-secondary" onclick="closeViewVehicleModal()" style="padding: 8px 16px; border: 1px solid #6c757d; background: #6c757d; color: white; border-radius: 4px; cursor: pointer;">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
};

window.closeViewVehicleModal = function() {
    const modal = document.getElementById('viewVehicleModal');
    if (modal) {
        modal.remove();
    }
};

// Función global para editar vehículo
window.editVehicleAdmin = function(vehicleId) {
    console.log('✏️ Editando vehículo:', vehicleId);
    
    if (!window.vehicleManagement) {
        showAdminNotification('Sistema de vehículos no disponible', 'error');
        return;
    }
    
    const vehicle = window.vehicleManagement.getVehicleById(vehicleId);
    if (!vehicle) {
        showAdminNotification('Vehículo no encontrado', 'error');
        return;
    }
    
    const modalHTML = `
        <div class="modal" id="editVehicleModal" style="display: block; z-index: 10000;">
            <div class="modal-content" style="max-width: 800px; max-height: 85vh; overflow-y: auto;">
                <div class="modal-header" style="background: #ffc107; color: #212529; padding: 15px; margin: -20px -20px 20px -20px; border-radius: 8px 8px 0 0;">
                    <span class="close" onclick="closeEditVehicleModal()" style="color: #212529; font-size: 24px; font-weight: bold; float: right; cursor: pointer;">&times;</span>
                    <h3 style="margin: 0; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-edit"></i> Editar Vehículo
                    </h3>
                </div>
                <div class="modal-body" style="padding: 0 20px;">
                    <form id="editVehicleForm">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                            <div class="form-group">
                                <label style="font-weight: bold; margin-bottom: 5px; display: block;">Patente *</label>
                                <input type="text" id="editPlateNumber" value="${vehicle.plateNumber}" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" maxlength="8">
                            </div>
                            <div class="form-group">
                                <label style="font-weight: bold; margin-bottom: 5px; display: block;">Propietario *</label>
                                <input type="text" id="editOwnerName" value="${vehicle.ownerName}" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                            <div class="form-group">
                                <label style="font-weight: bold; margin-bottom: 5px; display: block;">RUT</label>
                                <input type="text" id="editOwnerRut" value="${vehicle.ownerRut || ''}" placeholder="12345678-9" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            </div>
                            <div class="form-group">
                                <label style="font-weight: bold; margin-bottom: 5px; display: block;">Email</label>
                                <input type="email" id="editOwnerEmail" value="${vehicle.ownerEmail || ''}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                            <div class="form-group">
                                <label style="font-weight: bold; margin-bottom: 5px; display: block;">Teléfono</label>
                                <input type="tel" id="editOwnerPhone" value="${vehicle.ownerPhone || ''}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            </div>
                            <div class="form-group">
                                <label style="font-weight: bold; margin-bottom: 5px; display: block;">Marca *</label>
                                <input type="text" id="editVehicleBrand" value="${vehicle.vehicleBrand}" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                            <div class="form-group">
                                <label style="font-weight: bold; margin-bottom: 5px; display: block;">Modelo *</label>
                                <input type="text" id="editVehicleModel" value="${vehicle.vehicleModel}" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            </div>
                            <div class="form-group">
                                <label style="font-weight: bold; margin-bottom: 5px; display: block;">Año</label>
                                <input type="number" id="editVehicleYear" value="${vehicle.vehicleYear || ''}" min="1900" max="2030" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                            <div class="form-group">
                                <label style="font-weight: bold; margin-bottom: 5px; display: block;">Color</label>
                                <input type="text" id="editVehicleColor" value="${vehicle.vehicleColor || ''}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            </div>
                            <div class="form-group">
                                <label style="font-weight: bold; margin-bottom: 5px; display: block;">Tipo de Vehículo *</label>
                                <select id="editVehicleType" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                    <option value="">Seleccionar...</option>
                                    <option value="automovil" ${vehicle.vehicleType === 'automovil' ? 'selected' : ''}>Automóvil</option>
                                    <option value="camioneta" ${vehicle.vehicleType === 'camioneta' ? 'selected' : ''}>Camioneta</option>
                                    <option value="camion" ${vehicle.vehicleType === 'camion' ? 'selected' : ''}>Camión</option>
                                    <option value="motocicleta" ${vehicle.vehicleType === 'motocicleta' ? 'selected' : ''}>Motocicleta</option>
                                    <option value="bus" ${vehicle.vehicleType === 'bus' ? 'selected' : ''}>Bus</option>
                                    <option value="remolque" ${vehicle.vehicleType === 'remolque' ? 'selected' : ''}>Remolque</option>
                                </select>
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                            <div class="form-group">
                                <label style="font-weight: bold; margin-bottom: 5px; display: block;">Propósito *</label>
                                <select id="editVehiclePurpose" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                    <option value="">Seleccionar...</option>
                                    <option value="personal" ${vehicle.vehiclePurpose === 'personal' ? 'selected' : ''}>Uso Personal</option>
                                    <option value="comercial" ${vehicle.vehiclePurpose === 'comercial' ? 'selected' : ''}>Uso Comercial</option>
                                    <option value="turismo" ${vehicle.vehiclePurpose === 'turismo' ? 'selected' : ''}>Turismo</option>
                                    <option value="carga" ${vehicle.vehiclePurpose === 'carga' ? 'selected' : ''}>Transporte de Carga</option>
                                    <option value="pasajeros" ${vehicle.vehiclePurpose === 'pasajeros' ? 'selected' : ''}>Transporte de Pasajeros</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label style="font-weight: bold; margin-bottom: 5px; display: block;">Estado</label>
                                <select id="editStatus" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                    <option value="pending" ${vehicle.status === 'pending' ? 'selected' : ''}>Pendiente</option>
                                    <option value="approved" ${vehicle.status === 'approved' ? 'selected' : ''}>Aprobado</option>
                                    <option value="rejected" ${vehicle.status === 'rejected' ? 'selected' : ''}>Rechazado</option>
                                    <option value="registered" ${vehicle.status === 'registered' ? 'selected' : ''}>Registrado</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group" style="margin-bottom: 15px;">
                            <label style="font-weight: bold; margin-bottom: 5px; display: block;">Dirección</label>
                            <textarea id="editOwnerAddress" rows="2" placeholder="Dirección del propietario..." style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; resize: vertical;">${vehicle.ownerAddress || ''}</textarea>
                        </div>
                        <div class="form-group" style="margin-bottom: 20px;">
                            <label style="font-weight: bold; margin-bottom: 5px; display: block;">Comentarios</label>
                            <textarea id="editComments" rows="3" placeholder="Comentarios adicionales..." style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; resize: vertical;">${vehicle.comments || ''}</textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer" style="padding: 15px 20px; border-top: 1px solid #eee; margin: 20px -20px -20px -20px; text-align: right; background: #f8f9fa;">
                    <button class="btn-secondary" onclick="closeEditVehicleModal()" style="margin-right: 10px; padding: 8px 16px; border: 1px solid #6c757d; background: #6c757d; color: white; border-radius: 4px; cursor: pointer;">
                        Cancelar
                    </button>
                    <button class="btn-primary" onclick="saveVehicleEdit('${vehicleId}')" style="padding: 8px 16px; border: none; background: #ffc107; color: #212529; border-radius: 4px; cursor: pointer;">
                        <i class="fas fa-save"></i> Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
};

window.closeEditVehicleModal = function() {
    const modal = document.getElementById('editVehicleModal');
    if (modal) {
        modal.remove();
    }
};

window.saveVehicleEdit = function(vehicleId) {
    console.log('💾 Guardando cambios del vehículo:', vehicleId);
    
    try {
        const updateData = {
            plateNumber: document.getElementById('editPlateNumber').value.trim().toUpperCase(),
            ownerName: document.getElementById('editOwnerName').value.trim(),
            ownerRut: document.getElementById('editOwnerRut').value.trim(),
            ownerEmail: document.getElementById('editOwnerEmail').value.trim(),
            ownerPhone: document.getElementById('editOwnerPhone').value.trim(),
            ownerAddress: document.getElementById('editOwnerAddress').value.trim(),
            vehicleBrand: document.getElementById('editVehicleBrand').value.trim(),
            vehicleModel: document.getElementById('editVehicleModel').value.trim(),
            vehicleYear: document.getElementById('editVehicleYear').value ? parseInt(document.getElementById('editVehicleYear').value) : null,
            vehicleColor: document.getElementById('editVehicleColor').value.trim(),
            vehicleType: document.getElementById('editVehicleType').value,
            vehiclePurpose: document.getElementById('editVehiclePurpose').value,
            status: document.getElementById('editStatus').value,
            comments: document.getElementById('editComments').value.trim()
        };
        
        // Validaciones básicas
        if (!updateData.plateNumber || !updateData.ownerName || !updateData.vehicleBrand || !updateData.vehicleModel || !updateData.vehicleType || !updateData.vehiclePurpose) {
            showAdminNotification('Por favor complete todos los campos requeridos', 'error');
            return;
        }
        
        // Obtener sesión para auditoría
        const session = JSON.parse(localStorage.getItem('aduanasAdminSession') || '{}');
        const userName = session.user?.name || 'Usuario Desconocido';
        
        // Actualizar vehículo
        const result = window.vehicleManagement.updateVehicle(vehicleId, updateData, {
            userName: userName,
            action: 'Editado',
            timestamp: new Date().toISOString()
        });
        
        if (result.success) {
            showAdminNotification('Vehículo actualizado exitosamente', 'success');
            closeEditVehicleModal();
            
            // Recargar la lista de vehículos
            if (window.adminSystem && typeof window.adminSystem.loadVehiclesAdmin === 'function') {
                window.adminSystem.loadVehiclesAdmin();
            }
            
            // Registrar en auditoría
            if (window.auditSystem) {
                window.auditSystem.registerAction('edited', 'vehicle', vehicleId, { 
                    vehiclePlate: updateData.plateNumber, 
                    changes: updateData 
                });
            }
        } else {
            showAdminNotification('Error al actualizar vehículo: ' + result.error, 'error');
        }
        
    } catch (error) {
        console.error('❌ Error inesperado al actualizar vehículo:', error);
        showAdminNotification('Error inesperado al actualizar el vehículo', 'error');
    }
};

// Función global para aprobar vehículo
window.approveVehicleAdmin = function(vehicleId) {
    console.log('✅ Aprobando vehículo:', vehicleId);
    
    if (!window.vehicleManagement) {
        showAdminNotification('Sistema de vehículos no disponible', 'error');
        return;
    }
    
    const comments = prompt('Comentarios de aprobación (opcional):');
    if (comments === null) return; // Usuario canceló
    
    // Obtener sesión para auditoría
    const session = JSON.parse(localStorage.getItem('aduanasAdminSession') || '{}');
    const userName = session.user?.name || 'Usuario Desconocido';
    
    const result = window.vehicleManagement.approveVehicle(vehicleId, comments, {
        userName: userName,
        action: 'Aprobado',
        timestamp: new Date().toISOString(),
        reason: comments
    });
    
    if (result.success) {
        showAdminNotification('Vehículo aprobado exitosamente', 'success');
        
        // Recargar la lista
        if (window.adminSystem && typeof window.adminSystem.loadVehiclesAdmin === 'function') {
            window.adminSystem.loadVehiclesAdmin();
        }
        
        // Registrar en auditoría
        if (window.auditSystem) {
            window.auditSystem.registerAction('approved', 'vehicle', vehicleId, { 
                comments: comments 
            });
        }
    } else {
        showAdminNotification('Error al aprobar vehículo: ' + result.error, 'error');
    }
};

// Función global para rechazar vehículo
window.rejectVehicleAdmin = function(vehicleId) {
    console.log('❌ Rechazando vehículo:', vehicleId);
    
    if (!window.vehicleManagement) {
        showAdminNotification('Sistema de vehículos no disponible', 'error');
        return;
    }
    
    const reason = prompt('Motivo del rechazo (requerido):');
    if (!reason || reason.trim() === '') {
        showAdminNotification('Debe proporcionar un motivo para el rechazo', 'warning');
        return;
    }
    
    // Obtener sesión para auditoría
    const session = JSON.parse(localStorage.getItem('aduanasAdminSession') || '{}');
    const userName = session.user?.name || 'Usuario Desconocido';
    
    const result = window.vehicleManagement.rejectVehicle(vehicleId, reason.trim(), {
        userName: userName,
        action: 'Rechazado',
        timestamp: new Date().toISOString(),
        reason: reason.trim()
    });
    
    if (result.success) {
        showAdminNotification('Vehículo rechazado exitosamente', 'warning');
        
        // Recargar la lista
        if (window.adminSystem && typeof window.adminSystem.loadVehiclesAdmin === 'function') {
            window.adminSystem.loadVehiclesAdmin();
        }
        
        // Registrar en auditoría
        if (window.auditSystem) {
            window.auditSystem.registerAction('rejected', 'vehicle', vehicleId, { 
                reason: reason 
            });
        }
    } else {
        showAdminNotification('Error al rechazar vehículo: ' + result.error, 'error');
    }
};

// Función global para eliminar vehículo
window.deleteVehicleAdmin = function(vehicleId) {
    console.log('🗑️ Eliminando vehículo:', vehicleId);
    
    if (!window.vehicleManagement) {
        showAdminNotification('Sistema de vehículos no disponible', 'error');
        return;
    }
    
    const vehicle = window.vehicleManagement.getVehicleById(vehicleId);
    if (!vehicle) {
        showAdminNotification('Vehículo no encontrado', 'error');
        return;
    }
    
    if (confirm(`¿Está seguro de que desea eliminar el vehículo ${vehicle.plateNumber} de ${vehicle.ownerName}?\n\nEsta acción no se puede deshacer.`)) {
        // Obtener sesión para auditoría
        const session = JSON.parse(localStorage.getItem('aduanasAdminSession') || '{}');
        const userName = session.user?.name || 'Usuario Desconocido';
        
        const result = window.vehicleManagement.deleteVehicle(vehicleId, {
            userName: userName,
            action: 'Eliminado',
            timestamp: new Date().toISOString()
        });
        
        if (result.success) {
            showAdminNotification('Vehículo eliminado exitosamente', 'success');
            
            // Recargar la lista
            if (window.adminSystem && typeof window.adminSystem.loadVehiclesAdmin === 'function') {
                window.adminSystem.loadVehiclesAdmin();
            }
            
            // Registrar en auditoría
            if (window.auditSystem) {
                window.auditSystem.registerAction('deleted', 'vehicle', vehicleId, { 
                    vehiclePlate: vehicle.plateNumber,
                    ownerName: vehicle.ownerName
                });
            }
        } else {
            showAdminNotification('Error al eliminar vehículo: ' + result.error, 'error');
        }
    }
};

// Función global para crear nuevo vehículo
window.createNewVehicleAdmin = function() {
    console.log('➕ Creando nuevo vehículo...');
    
    if (!window.vehicleManagement) {
        showAdminNotification('Sistema de vehículos no disponible', 'error');
        return;
    }
    
    // Verificar sesión activa
    const session = JSON.parse(localStorage.getItem('aduanasAdminSession') || '{}');
    if (!session.user) {
        showAdminNotification('Su sesión ha expirado. Por favor, inicie sesión nuevamente.', 'error');
        return;
    }
    
    const modalHTML = `
        <div class="modal" id="newVehicleModal" style="display: block; z-index: 10000;">
            <div class="modal-content" style="max-width: 800px; max-height: 85vh; overflow-y: auto;">
                <div class="modal-header" style="background: #28a745; color: white; padding: 15px; margin: -20px -20px 20px -20px; border-radius: 8px 8px 0 0;">
                    <span class="close" onclick="closeNewVehicleModal()" style="color: white; font-size: 24px; font-weight: bold; float: right; cursor: pointer;">&times;</span>
                    <h3 style="margin: 0; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-plus"></i> Nuevo Vehículo
                    </h3>
                </div>
                <div class="modal-body" style="padding: 0 20px;">
                    <form id="newVehicleForm">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                            <div class="form-group">
                                <label style="font-weight: bold; margin-bottom: 5px; display: block;">Patente *</label>
                                <input type="text" id="newPlateNumber" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" maxlength="8" placeholder="ABC1234">
                            </div>
                            <div class="form-group">
                                <label style="font-weight: bold; margin-bottom: 5px; display: block;">Propietario *</label>
                                <input type="text" id="newOwnerName" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                            <div class="form-group">
                                <label style="font-weight: bold; margin-bottom: 5px; display: block;">RUT</label>
                                <input type="text" id="newOwnerRut" placeholder="12345678-9" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            </div>
                            <div class="form-group">
                                <label style="font-weight: bold; margin-bottom: 5px; display: block;">Email</label>
                                <input type="email" id="newOwnerEmail" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                            <div class="form-group">
                                <label style="font-weight: bold; margin-bottom: 5px; display: block;">Teléfono</label>
                                <input type="tel" id="newOwnerPhone" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            </div>
                            <div class="form-group">
                                <label style="font-weight: bold; margin-bottom: 5px; display: block;">Marca *</label>
                                <input type="text" id="newVehicleBrand" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                            <div class="form-group">
                                <label style="font-weight: bold; margin-bottom: 5px; display: block;">Modelo *</label>
                                <input type="text" id="newVehicleModel" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            </div>
                            <div class="form-group">
                                <label style="font-weight: bold; margin-bottom: 5px; display: block;">Año</label>
                                <input type="number" id="newVehicleYear" min="1900" max="2030" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                            <div class="form-group">
                                <label style="font-weight: bold; margin-bottom: 5px; display: block;">Color</label>
                                <input type="text" id="newVehicleColor" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            </div>
                            <div class="form-group">
                                <label style="font-weight: bold; margin-bottom: 5px; display: block;">Tipo de Vehículo *</label>
                                <select id="newVehicleType" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                    <option value="">Seleccionar...</option>
                                    <option value="automovil">Automóvil</option>
                                    <option value="camioneta">Camioneta</option>
                                    <option value="camion">Camión</option>
                                    <option value="motocicleta">Motocicleta</option>
                                    <option value="bus">Bus</option>
                                    <option value="remolque">Remolque</option>
                                </select>
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                            <div class="form-group">
                                <label style="font-weight: bold; margin-bottom: 5px; display: block;">Propósito *</label>
                                <select id="newVehiclePurpose" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                    <option value="">Seleccionar...</option>
                                    <option value="personal">Uso Personal</option>
                                    <option value="comercial">Uso Comercial</option>
                                    <option value="turismo">Turismo</option>
                                    <option value="carga">Transporte de Carga</option>
                                    <option value="pasajeros">Transporte de Pasajeros</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label style="font-weight: bold; margin-bottom: 5px; display: block;">Estado</label>
                                <select id="newStatus" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                    <option value="pending">Pendiente</option>
                                    <option value="approved">Aprobado</option>
                                    <option value="registered">Registrado</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group" style="margin-bottom: 15px;">
                            <label style="font-weight: bold; margin-bottom: 5px; display: block;">Dirección</label>
                            <textarea id="newOwnerAddress" rows="2" placeholder="Dirección del propietario..." style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; resize: vertical;"></textarea>
                        </div>
                        <div class="form-group" style="margin-bottom: 20px;">
                            <label style="font-weight: bold; margin-bottom: 5px; display: block;">Comentarios</label>
                            <textarea id="newComments" rows="3" placeholder="Comentarios adicionales..." style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; resize: vertical;"></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer" style="padding: 15px 20px; border-top: 1px solid #eee; margin: 20px -20px -20px -20px; text-align: right; background: #f8f9fa;">
                    <button class="btn-secondary" onclick="closeNewVehicleModal()" style="margin-right: 10px; padding: 8px 16px; border: 1px solid #6c757d; background: #6c757d; color: white; border-radius: 4px; cursor: pointer;">
                        Cancelar
                    </button>
                    <button class="btn-primary" onclick="saveNewVehicle()" style="padding: 8px 16px; border: none; background: #28a745; color: white; border-radius: 4px; cursor: pointer;">
                        <i class="fas fa-save"></i> Crear Vehículo
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Enfocar el primer campo
    setTimeout(() => {
        const firstField = document.getElementById('newPlateNumber');
        if (firstField) {
            firstField.focus();
        }
    }, 100);
};

window.closeNewVehicleModal = function() {
    const modal = document.getElementById('newVehicleModal');
    if (modal) {
        modal.remove();
    }
};

window.saveNewVehicle = function() {
    console.log('💾 Guardando nuevo vehículo...');
    
    try {
        const newData = {
            plateNumber: document.getElementById('newPlateNumber').value.trim().toUpperCase(),
            ownerName: document.getElementById('newOwnerName').value.trim(),
            ownerRut: document.getElementById('newOwnerRut').value.trim(),
            ownerEmail: document.getElementById('newOwnerEmail').value.trim(),
            ownerPhone: document.getElementById('newOwnerPhone').value.trim(),
            ownerAddress: document.getElementById('newOwnerAddress').value.trim(),
            vehicleBrand: document.getElementById('newVehicleBrand').value.trim(),
            vehicleModel: document.getElementById('newVehicleModel').value.trim(),
            vehicleYear: document.getElementById('newVehicleYear').value ? parseInt(document.getElementById('newVehicleYear').value) : null,
            vehicleColor: document.getElementById('newVehicleColor').value.trim(),
            vehicleType: document.getElementById('newVehicleType').value,
            vehiclePurpose: document.getElementById('newVehiclePurpose').value,
            status: document.getElementById('newStatus').value,
            comments: document.getElementById('newComments').value.trim()
        };
        
        // Validaciones básicas
        if (!newData.plateNumber || !newData.ownerName || !newData.vehicleBrand || !newData.vehicleModel || !newData.vehicleType || !newData.vehiclePurpose) {
            showAdminNotification('Por favor complete todos los campos requeridos', 'error');
            return;
        }
        
        // Obtener sesión para auditoría
        const session = JSON.parse(localStorage.getItem('aduanasAdminSession') || '{}');
        const userName = session.user?.name || 'Usuario Desconocido';
        
        // Crear vehículo
        const result = window.vehicleManagement.createVehicle(newData, {
            userName: userName,
            action: 'Creado',
            timestamp: new Date().toISOString()
        });
        
        if (result.success) {
            showAdminNotification('Vehículo creado exitosamente', 'success');
            closeNewVehicleModal();
            
            // Recargar la lista de vehículos
            if (window.adminSystem && typeof window.adminSystem.loadVehiclesAdmin === 'function') {
                window.adminSystem.loadVehiclesAdmin();
            }
            
            // Registrar en auditoría
            if (window.auditSystem) {
                window.auditSystem.registerAction('created', 'vehicle', result.vehicleId, { 
                    vehiclePlate: newData.plateNumber,
                    ownerName: newData.ownerName
                });
            }
        } else {
            showAdminNotification('Error al crear vehículo: ' + result.error, 'error');
        }
        
    } catch (error) {
        console.error('❌ Error inesperado al crear vehículo:', error);
        showAdminNotification('Error inesperado al crear el vehículo', 'error');
    }
};

// ============================================================================
// FUNCIONES AUXILIARES PARA GESTIÓN DE VEHÍCULOS
// ============================================================================

// Función para actualizar datos de vehículos
window.refreshVehicleData = function() {
    console.log('🔄 Actualizando datos de vehículos...');
    
    if (window.adminSystem && typeof window.adminSystem.loadVehiclesAdmin === 'function') {
        window.adminSystem.loadVehiclesAdmin();
    }
    
    showAdminNotification('Datos de vehículos actualizados', 'success');
};

// Función para exportar datos de vehículos
window.exportVehicleData = function() {
    console.log('📊 Exportando datos de vehículos...');
    
    if (!window.vehicleManagement) {
        showAdminNotification('Sistema de vehículos no disponible', 'error');
        return;
    }
    
    const format = prompt('¿En qué formato desea exportar?\n\n1. JSON (escriba "json")\n2. CSV (escriba "csv")\n\nFormato:', 'json');
    
    if (!format) return;
    
    const vehicles = window.vehicleManagement.getVehicles();
    let exportData;
    
    if (format.toLowerCase() === 'csv') {
        // Generar CSV
        const headers = ['Patente', 'Propietario', 'RUT', 'Email', 'Teléfono', 'Marca', 'Modelo', 'Año', 'Color', 'Tipo', 'Propósito', 'Estado', 'Fecha de Registro'];
        const csvContent = [
            headers.join(','),
            ...vehicles.map(v => [
                v.plateNumber,
                v.ownerName,
                v.ownerRut || '',
                v.ownerEmail || '',
                v.ownerPhone || '',
                v.vehicleBrand,
                v.vehicleModel,
                v.vehicleYear || '',
                v.vehicleColor || '',
                v.vehicleType,
                v.vehiclePurpose,
                v.status,
                new Date(v.registrationDate).toLocaleDateString('es-ES')
            ].join(','))
        ].join('\n');
        exportData = csvContent;
    } else {
        // Generar JSON
        exportData = JSON.stringify(vehicles, null, 2);
    }
    
    console.log('📋 Datos de vehículos exportados:', exportData);
    
    // Simular descarga
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const fileName = `vehiculos_export_${timestamp}.${format.toLowerCase()}`;
    
    showAdminNotification(`Datos exportados exitosamente como ${fileName}. Ver consola (F12) para el contenido.`, 'success');
};
