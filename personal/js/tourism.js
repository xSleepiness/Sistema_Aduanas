// Gestión de Turismo Avanzada
class TourismManagement {
    constructor() {
        this.tourismRequests = [];
        this.init();
    }
    
    init() {
        this.addEventListeners();
        this.loadExistingRequests();
    }
    
    addEventListeners() {
        const tourismForm = document.getElementById('tourismForm');
        
        if (tourismForm) {
            tourismForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleTourismRequest();
            });
            
            // Validación en tiempo real
            this.addRealTimeValidation();
        }
    }
    
    addRealTimeValidation() {
        const requiredFields = [
            'touristName', 'touristRut', 'nationality', 'passportNumber', 
            'email', 'phone', 'arrivalDate', 'departureDate', 'tourismType',
            'emergencyContact', 'emergencyPhone'
        ];
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', () => this.validateTourismField(field));
                field.addEventListener('blur', () => this.validateTourismField(field));
            }
        });
        
        // Validación de fechas
        this.setupDateValidation();
    }
    
    setupDateValidation() {
        const arrivalDate = document.getElementById('arrivalDate');
        const departureDate = document.getElementById('departureDate');
        
        if (arrivalDate && departureDate) {
            // Establecer fecha mínima como hoy
            const today = new Date().toISOString().split('T')[0];
            arrivalDate.min = today;
            
            arrivalDate.addEventListener('change', () => {
                if (arrivalDate.value) {
                    departureDate.min = arrivalDate.value;
                    if (departureDate.value && departureDate.value < arrivalDate.value) {
                        departureDate.value = '';
                        this.showFieldError(departureDate, 'La fecha de salida debe ser posterior a la llegada');
                    }
                }
            });
            
            departureDate.addEventListener('change', () => {
                if (departureDate.value && arrivalDate.value) {
                    if (departureDate.value < arrivalDate.value) {
                        this.showFieldError(departureDate, 'La fecha de salida debe ser posterior a la llegada');
                        return false;
                    } else {
                        this.removeFieldError(departureDate);
                    }
                }
            });
        }
    }
    
    validateTourismField(field) {
        const value = field.value.trim();
        const fieldName = field.name || field.id;
        
        field.classList.remove('valid', 'invalid');
        
        let isValid = true;
        let errorMessage = '';
        
        switch (fieldName) {
            case 'touristName':
                isValid = value.length >= 2 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value);
                errorMessage = 'Nombre debe tener al menos 2 caracteres y solo letras';
                break;
                
            case 'touristRut':
                isValid = this.validateChileanRut(value);
                errorMessage = 'RUT inválido. Formato: 12345678-9';
                break;
                
            case 'email':
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                errorMessage = 'Email inválido';
                break;
                
            case 'phone':
                isValid = /^[\+]?[0-9\s\-\(\)]{8,15}$/.test(value);
                errorMessage = 'Teléfono inválido (8-15 dígitos)';
                break;
                
            case 'passportNumber':
                isValid = value.length >= 6 && /^[A-Z0-9]+$/.test(value.toUpperCase());
                errorMessage = 'Número de pasaporte debe tener al menos 6 caracteres alfanuméricos';
                break;
                
            case 'nationality':
                isValid = value !== '';
                errorMessage = 'Debe seleccionar una nacionalidad';
                break;
                
            case 'arrivalDate':
                const arrivalDate = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                isValid = arrivalDate >= today;
                errorMessage = 'La fecha de llegada no puede ser anterior a hoy';
                break;
                
            case 'departureDate':
                const selectedDate = new Date(value);
                const arrivalDateField = document.getElementById('arrivalDate');
                if (arrivalDateField && arrivalDateField.value) {
                    const arrivalDateValue = new Date(arrivalDateField.value);
                    isValid = selectedDate > arrivalDateValue;
                    errorMessage = 'La fecha de salida debe ser posterior a la llegada';
                } else {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    isValid = selectedDate >= today;
                    errorMessage = 'La fecha no puede ser anterior a hoy';
                }
                break;
                
            case 'tourismType':
                isValid = value !== '';
                errorMessage = 'Debe seleccionar un tipo de asistencia';
                break;
                
            case 'emergencyContact':
                isValid = value.length >= 2;
                errorMessage = 'Contacto de emergencia requerido';
                break;
                
            case 'emergencyPhone':
                isValid = /^[\+]?[0-9\s\-\(\)]{8,15}$/.test(value);
                errorMessage = 'Teléfono de emergencia inválido';
                break;
        }
        
        if (isValid) {
            field.classList.add('valid');
            this.removeFieldError(field);
        } else {
            field.classList.add('invalid');
            this.showFieldError(field, errorMessage);
        }
        
        return isValid;
    }
    
    showFieldError(field, message) {
        this.removeFieldError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#dc3545';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '5px';
        
        field.parentNode.appendChild(errorDiv);
    }
    
    removeFieldError(field) {
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    
    handleTourismRequest() {
        if (!this.validateTourismForm()) {
            return;
        }
        
        const formData = this.collectTourismFormData();
        
        // Simular proceso de solicitud
        this.processTourismRequest(formData)
            .then(result => {
                if (result.success) {
                    this.showTourismConfirmation(result.requestData);
                    this.resetTourismForm();
                } else {
                    this.showTourismError(result.error);
                }
            })
            .catch(error => {
                console.error('Error en solicitud turística:', error);
                this.showTourismError('Error interno del sistema. Por favor, intente nuevamente.');
            });
    }
    
    validateTourismForm() {
        const requiredFields = ['touristName', 'nationality', 'passportNumber', 'arrivalDate', 'departureDate', 'tourismType'];
        let allValid = true;
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!this.validateTourismField(field)) {
                allValid = false;
            }
        });
        
        return allValid;
    }
    
    collectTourismFormData() {
        return {
            touristName: document.getElementById('touristName').value.trim(),
            touristRut: document.getElementById('touristRut') ? document.getElementById('touristRut').value.trim() : '',
            email: document.getElementById('email') ? document.getElementById('email').value.trim() : '',
            phone: document.getElementById('phone') ? document.getElementById('phone').value.trim() : '',
            nationality: document.getElementById('nationality').value,
            passportNumber: document.getElementById('passportNumber').value.trim().toUpperCase(),
            arrivalDate: new Date(document.getElementById('arrivalDate').value),
            departureDate: new Date(document.getElementById('departureDate').value),
            tourismType: document.getElementById('tourismType').value,
            emergencyContact: document.getElementById('emergencyContact') ? document.getElementById('emergencyContact').value.trim() : '',
            emergencyPhone: document.getElementById('emergencyPhone') ? document.getElementById('emergencyPhone').value.trim() : '',
            accommodation: document.getElementById('accommodation') ? document.getElementById('accommodation').value.trim() : '',
            purpose: document.getElementById('purpose') ? document.getElementById('purpose').value.trim() : '',
            comments: document.getElementById('tourismComments') ? document.getElementById('tourismComments').value.trim() : '',
            requestId: this.generateRequestId('TUR'),
            requestDate: new Date(),
            status: 'pending',
            lastUpdated: new Date(),
            submittedBy: 'citizen_portal'
        };
    }
    
    generateRequestId(prefix) {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `${prefix}${timestamp}${random}`.slice(-10);
    }
    
    async processTourismRequest(formData) {
        // Simular delay de procesamiento
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Guardar la solicitud
        this.tourismRequests.push(formData);
        this.saveTourismRequestsToLocalStorage();
        
        return {
            success: true,
            requestData: formData
        };
    }
    
    showTourismConfirmation(requestData) {
        const nationalityNames = {
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
        
        const typeNames = {
            'entrada': 'Asistencia de Entrada',
            'salida': 'Asistencia de Salida',
            'declaracion': 'Declaración de Bienes',
            'consulta': 'Consulta General'
        };
        
        const dateOptions = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        const message = `¡Solicitud turística enviada exitosamente!
        
ID de Solicitud: ${requestData.requestId}
Turista: ${requestData.touristName}
Nacionalidad: ${nationalityNames[requestData.nationality]}
Pasaporte: ${requestData.passportNumber}
Llegada: ${requestData.arrivalDate.toLocaleDateString('es-ES', dateOptions)}
Salida: ${requestData.departureDate.toLocaleDateString('es-ES', dateOptions)}
Tipo: ${typeNames[requestData.tourismType]}

Su solicitud será procesada en las próximas horas. Recibirá una notificación cuando esté lista.`;
        
        alert(message);
        
        // Mostrar notificación
        if (window.AduanasSystem) {
            window.AduanasSystem.showNotification('Solicitud turística enviada exitosamente', 'success');
        }
    }
    
    showTourismError(errorMessage) {
        alert(`Error: ${errorMessage}`);
        
        if (window.AduanasSystem) {
            window.AduanasSystem.showNotification(errorMessage, 'error');
        }
    }
    
    resetTourismForm() {
        const form = document.getElementById('tourismForm');
        if (form) {
            form.reset();
            
            // Limpiar validaciones
            const validatedFields = form.querySelectorAll('.valid, .invalid');
            validatedFields.forEach(field => {
                field.classList.remove('valid', 'invalid');
            });
            
            // Remover mensajes de error
            const errorMessages = form.querySelectorAll('.error-message');
            errorMessages.forEach(message => message.remove());
        }
    }
    
    saveTourismRequestsToLocalStorage() {
        try {
            const requestsData = this.tourismRequests.map(request => ({
                ...request,
                arrivalDate: request.arrivalDate.toISOString(),
                departureDate: request.departureDate.toISOString(),
                requestDate: request.requestDate.toISOString()
            }));
            localStorage.setItem('aduanasTourismRequests', JSON.stringify(requestsData));
        } catch (error) {
            console.warn('No se pudo guardar en localStorage:', error);
        }
    }
    
    loadExistingRequests() {
        try {
            const saved = localStorage.getItem('aduanasTourismRequests');
            if (saved) {
                const requestsData = JSON.parse(saved);
                this.tourismRequests = requestsData.map(request => ({
                    ...request,
                    arrivalDate: new Date(request.arrivalDate),
                    departureDate: new Date(request.departureDate),
                    requestDate: new Date(request.requestDate)
                }));
            }
        } catch (error) {
            console.warn('No se pudieron cargar solicitudes turísticas guardadas:', error);
        }
    }
    
    // Métodos para el panel administrativo
    getTourismRequests() {
        return this.tourismRequests;
    }
    
    // ============================================================================
    // FUNCIONES CRUD PARA GESTIÓN ADMINISTRATIVA
    // ============================================================================
    
    // Crear nueva solicitud turística (CREATE)
    createTourismRequest(data) {
        try {
            const newRequest = {
                ...data,
                requestId: this.generateRequestId('TUR'),
                requestDate: new Date(),
                status: 'pending',
                lastUpdated: new Date(),
                submittedBy: 'admin_portal'
            };
            
            this.tourismRequests.push(newRequest);
            this.saveTourismRequestsToLocalStorage();
            
            // Registrar en auditoría
            if (window.auditSystem) {
                window.auditSystem.registerAction('CREATE', 'tourism_request', {
                    requestId: newRequest.requestId,
                    touristName: newRequest.touristName
                });
            }
            
            console.log('✅ Solicitud turística creada:', newRequest.requestId);
            return { success: true, data: newRequest };
        } catch (error) {
            console.error('❌ Error creando solicitud turística:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Leer solicitud turística por ID (READ)
    getTourismRequestById(requestId) {
        return this.tourismRequests.find(request => request.requestId === requestId);
    }
    
    // Actualizar solicitud turística (UPDATE)
    updateTourismRequest(requestId, updateData) {
        try {
            const requestIndex = this.tourismRequests.findIndex(request => request.requestId === requestId);
            
            if (requestIndex === -1) {
                return { success: false, error: 'Solicitud no encontrada' };
            }
            
            const originalRequest = { ...this.tourismRequests[requestIndex] };
            
            // Actualizar datos
            this.tourismRequests[requestIndex] = {
                ...this.tourismRequests[requestIndex],
                ...updateData,
                lastUpdated: new Date()
            };
            
            this.saveTourismRequestsToLocalStorage();
            
            // Registrar en auditoría
            if (window.auditSystem) {
                window.auditSystem.registerAction('UPDATE', 'tourism_request', {
                    requestId: requestId,
                    changes: Object.keys(updateData),
                    originalStatus: originalRequest.status,
                    newStatus: updateData.status || originalRequest.status
                });
            }
            
            console.log('✅ Solicitud turística actualizada:', requestId);
            return { success: true, data: this.tourismRequests[requestId] };
        } catch (error) {
            console.error('❌ Error actualizando solicitud turística:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Eliminar solicitud turística (DELETE)
    deleteTourismRequest(requestId) {
        try {
            const requestIndex = this.tourismRequests.findIndex(request => request.requestId === requestId);
            
            if (requestIndex === -1) {
                return { success: false, error: 'Solicitud no encontrada' };
            }
            
            const deletedRequest = this.tourismRequests[requestIndex];
            
            // Mover a archivo de eliminados para auditoría
            const deletedRequests = JSON.parse(localStorage.getItem('aduanasDeletedTourismRequests') || '[]');
            deletedRequests.push({
                ...deletedRequest,
                deletedAt: new Date(),
                deletedBy: window.adminSystem?.currentUser?.name || 'Usuario Desconocido'
            });
            localStorage.setItem('aduanasDeletedTourismRequests', JSON.stringify(deletedRequests));
            
            // Eliminar de la lista activa
            this.tourismRequests.splice(requestIndex, 1);
            this.saveTourismRequestsToLocalStorage();
            
            // Registrar en auditoría
            if (window.auditSystem) {
                window.auditSystem.registerAction('DELETE', 'tourism_request', {
                    requestId: requestId,
                    touristName: deletedRequest.touristName,
                    status: deletedRequest.status
                });
            }
            
            console.log('✅ Solicitud turística eliminada:', requestId);
            return { success: true, data: deletedRequest };
        } catch (error) {
            console.error('❌ Error eliminando solicitud turística:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Aprobar solicitud turística
    approveTourismRequest(requestId, comments = '') {
        const result = this.updateTourismRequest(requestId, {
            status: 'approved',
            approvedAt: new Date(),
            approvedBy: window.adminSystem?.currentUser?.name || 'Administrador',
            approvalComments: comments
        });
        
        if (result.success && window.auditSystem) {
            window.auditSystem.registerAction('APPROVE', 'tourism_request', {
                requestId: requestId,
                comments: comments
            });
        }
        
        return result;
    }
    
    // Rechazar solicitud turística
    rejectTourismRequest(requestId, reason = '') {
        const result = this.updateTourismRequest(requestId, {
            status: 'rejected',
            rejectedAt: new Date(),
            rejectedBy: window.adminSystem?.currentUser?.name || 'Administrador',
            rejectionReason: reason
        });
        
        if (result.success && window.auditSystem) {
            window.auditSystem.registerAction('REJECT', 'tourism_request', {
                requestId: requestId,
                reason: reason
            });
        }
        
        return result;
    }
    
    // Obtener solicitudes filtradas
    getFilteredTourismRequests(filters = {}) {
        let filtered = [...this.tourismRequests];
        
        if (filters.status) {
            filtered = filtered.filter(request => request.status === filters.status);
        }
        
        if (filters.nationality) {
            filtered = filtered.filter(request => request.nationality === filters.nationality);
        }
        
        if (filters.dateFrom) {
            const fromDate = new Date(filters.dateFrom);
            filtered = filtered.filter(request => new Date(request.requestDate) >= fromDate);
        }
        
        if (filters.dateTo) {
            const toDate = new Date(filters.dateTo);
            toDate.setHours(23, 59, 59, 999);
            filtered = filtered.filter(request => new Date(request.requestDate) <= toDate);
        }
        
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filtered = filtered.filter(request => 
                request.touristName.toLowerCase().includes(searchTerm) ||
                request.passportNumber.toLowerCase().includes(searchTerm) ||
                (request.touristRut && request.touristRut.toLowerCase().includes(searchTerm))
            );
        }
        
        return filtered;
    }
    
    // Exportar datos para reportes
    exportTourismData(format = 'json') {
        const data = {
            exportDate: new Date().toISOString(),
            totalRequests: this.tourismRequests.length,
            requests: this.tourismRequests,
            statistics: this.getTourismStatistics()
        };
        
        if (format === 'csv') {
            return this.convertToCSV(this.tourismRequests);
        }
        
        return JSON.stringify(data, null, 2);
    }
    
    convertToCSV(data) {
        if (!data.length) return '';
        
        const headers = [
            'ID', 'Nombre', 'RUT', 'Email', 'Teléfono', 'Nacionalidad', 
            'Pasaporte', 'Llegada', 'Salida', 'Tipo', 'Estado', 'Fecha Solicitud'
        ];
        
        const csvContent = [
            headers.join(','),
            ...data.map(request => [
                request.requestId,
                `"${request.touristName}"`,
                request.touristRut || '',
                request.email || '',
                request.phone || '',
                request.nationality,
                request.passportNumber,
                request.arrivalDate.toISOString().split('T')[0],
                request.departureDate.toISOString().split('T')[0],
                request.tourismType,
                request.status,
                request.requestDate.toISOString().split('T')[0]
            ].join(','))
        ].join('\n');
        
        return csvContent;
    }

    validateChileanRut(rut) {
        // Validación básica de RUT chileno
        if (!rut || rut.length < 8) return false;
        
        // Limpiar RUT
        const cleanRut = rut.replace(/[^0-9kK]/g, '');
        if (cleanRut.length < 8) return false;
        
        // Extraer número y dígito verificador
        const rutNum = cleanRut.slice(0, -1);
        const dv = cleanRut.slice(-1).toUpperCase();
        
        // Validar que sean solo números
        if (!/^[0-9]+$/.test(rutNum)) return false;
        
        // Calcular dígito verificador
        let suma = 0;
        let multiplicador = 2;
        
        for (let i = rutNum.length - 1; i >= 0; i--) {
            suma += parseInt(rutNum.charAt(i)) * multiplicador;
            multiplicador = multiplicador < 7 ? multiplicador + 1 : 2;
        }
        
        const dvCalculado = 11 - (suma % 11);
        const dvEsperado = dvCalculado === 11 ? '0' : dvCalculado === 10 ? 'K' : dvCalculado.toString();
        
        return dv === dvEsperado;
    }
}

// Inicializar gestión de turismo cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    window.tourismManagement = new TourismManagement();
});
