class BookingSystem {
    constructor() {
        this.reservations = [];
        this.init();
    }
    
    init() {
        this.addEventListeners();
        this.loadExistingReservations();
    }
    
    addEventListeners() {
        console.log('🔧 Configurando event listeners del BookingSystem...');
        const bookingForm = document.getElementById('bookingForm');
        const serviceTypeSelect = document.getElementById('serviceType');
        
        if (!bookingForm) {
            console.error('❌ No se encontró bookingForm');
            return;
        }
        
        console.log('✅ bookingForm encontrado');
        
        // Formulario de reserva
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('📝 Formulario de booking enviado');
            this.handleBookingSubmission();
        });
        
        // Actualizar resumen cuando cambia el tipo de servicio
        if (serviceTypeSelect) {
            serviceTypeSelect.addEventListener('change', () => {
                this.updateServiceSummary();
            });
        }
        
        // Validación en tiempo real
        this.addRealTimeValidation();
    }
    
    addRealTimeValidation() {
        const requiredFields = ['fullName', 'idNumber', 'email', 'phone', 'serviceType'];
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', () => this.validateField(field));
                field.addEventListener('blur', () => this.validateField(field));
            }
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        
        // Remover clases de validación anteriores
        field.classList.remove('valid', 'invalid');
        
        let isValid = true;
        let errorMessage = '';
        
        switch (fieldName) {
            case 'fullName':
                isValid = value.length >= 2 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value);
                errorMessage = 'Nombre debe tener al menos 2 caracteres y solo letras';
                break;
                
            case 'idNumber':
                isValid = value.length >= 6 && /^[0-9]+$/.test(value);
                errorMessage = 'Número de identificación debe tener al menos 6 dígitos';
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(value);
                errorMessage = 'Email no válido';
                break;
                
            case 'phone':
                const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
                isValid = phoneRegex.test(value);
                errorMessage = 'Teléfono debe tener al menos 8 dígitos';
                break;
                
            case 'serviceType':
                isValid = value !== '';
                errorMessage = 'Debe seleccionar un tipo de servicio';
                break;
        }
        
        if (isValid) {
            field.classList.add('valid');
            this.removeErrorMessage(field);
        } else {
            field.classList.add('invalid');
            this.showErrorMessage(field, errorMessage);
        }
        
        return isValid;
    }
    
    showErrorMessage(field, message) {
        // Remover mensaje de error anterior
        this.removeErrorMessage(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#dc3545';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '5px';
        
        field.parentNode.appendChild(errorDiv);
    }
    
    removeErrorMessage(field) {
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    
    updateServiceSummary() {
        const serviceType = document.getElementById('serviceType').value;
        const summaryService = document.getElementById('summaryService');
        
        const serviceNames = {
            'importacion': 'Importación',
            'exportacion': 'Exportación',
            'certificacion': 'Certificación',
            'consulta': 'Consulta General',
            'turismo': 'Gestión Turística',
            'permiso-menor': 'Permiso de Menor'
        };
        
        if (serviceType && summaryService) {
            summaryService.textContent = serviceNames[serviceType] || serviceType;
        }
    }
    
    handleBookingSubmission() {
        console.log('🚀 Iniciando proceso de reserva...');
        
        if (!this.validateBookingForm()) {
            console.error('❌ Validación del formulario falló');
            return;
        }
        
        console.log('✅ Formulario validado');
        
        const formData = this.collectFormData();
        console.log('📋 Datos recolectados:', formData);
        
        if (!formData) {
            console.error('❌ No se pudieron recopilar los datos del formulario');
            alert('Error al recopilar los datos del formulario');
            return;
        }
        
        // Simular proceso de reserva
        this.processBooking(formData)
            .then(result => {
                if (result.success) {
                    this.showConfirmationModal(result.bookingData);
                    this.resetForm();
                    
                    // Marcar el horario como reservado en el calendario
                    if (window.calendar) {
                        window.calendar.bookSlot(formData.selectedDate, formData.selectedTime);
                    }
                } else {
                    this.showErrorModal(result.error);
                }
            })
            .catch(error => {
                console.error('Error en la reserva:', error);
                this.showErrorModal('Error interno del sistema. Por favor, intente nuevamente.');
            });
    }
    
    validateBookingForm() {
        // Verificar que se haya seleccionado fecha y hora
        if (!window.calendar || !window.calendar.getSelectedDate()) {
            alert('Por favor, seleccione una fecha del calendario');
            return false;
        }
        
        if (!window.calendar.getSelectedTime()) {
            alert('Por favor, seleccione un horario');
            return false;
        }
        
        // Validar campos del formulario
        const requiredFields = ['fullName', 'idNumber', 'email', 'phone', 'serviceType'];
        let allValid = true;
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!this.validateField(field)) {
                allValid = false;
            }
        });
        
        return allValid;
    }
    
    collectFormData() {
        console.log('📝 Recopilando datos del formulario...');
        
        // Verificar elementos del formulario
        const elements = {
            fullName: document.getElementById('fullName'),
            idNumber: document.getElementById('idNumber'),
            email: document.getElementById('email'),
            phone: document.getElementById('phone'),
            serviceType: document.getElementById('serviceType'),
            comments: document.getElementById('comments')
        };
        
        // Verificar que todos los elementos existen
        for (const [key, element] of Object.entries(elements)) {
            if (!element) {
                console.error(`❌ No se encontró el elemento: ${key}`);
                alert(`Error: No se encontró el campo ${key}`);
                return null;
            }
        }
        
        // Verificar calendario
        if (!window.calendar) {
            console.error('❌ Sistema de calendario no disponible');
            alert('Error: Sistema de calendario no disponible');
            return null;
        }
        
        const selectedDate = window.calendar.getSelectedDate();
        const selectedTime = window.calendar.getSelectedTime();
        
        if (!selectedDate || !selectedTime) {
            console.error('❌ Fecha u hora no seleccionada');
            alert('Por favor seleccione una fecha y hora para su cita');
            return null;
        }
        
        const formData = {
            fullName: elements.fullName.value.trim(),
            idNumber: elements.idNumber.value.trim(),
            email: elements.email.value.trim(),
            phone: elements.phone.value.trim(),
            serviceType: elements.serviceType.value,
            comments: elements.comments.value.trim(),
            selectedDate: selectedDate,
            selectedTime: selectedTime,
            bookingId: this.generateBookingId(),
            createdDate: new Date().toISOString(),
            status: 'pending'
        };
        
        console.log('✅ Datos recopilados exitosamente:', formData);
        return formData;
    }
    
    generateBookingId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `AD${timestamp}${random}`.slice(-10);
    }
    
    async processBooking(formData) {
        console.log('⏳ Procesando reserva...', formData);
        
        // Simular delay de procesamiento
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simular validación del servidor
        if (this.isSlotStillAvailable(formData.selectedDate, formData.selectedTime)) {
            // Guardar la reserva
            this.reservations.push(formData);
            console.log('💾 Reserva agregada a memoria:', this.reservations.length, 'total');
            
            this.saveReservationsToLocalStorage();
            console.log('✅ Reserva guardada en localStorage');
            
            // Disparar evento para actualizar otros componentes
            window.dispatchEvent(new CustomEvent('appointmentsUpdated', {
                detail: { 
                    type: 'created',
                    appointment: formData,
                    totalAppointments: this.reservations.length
                }
            }));
            console.log('📡 Evento appointmentsUpdated disparado');
            
            return {
                success: true,
                bookingData: formData
            };
        } else {
            console.warn('⚠️ Horario ya no disponible');
            return {
                success: false,
                error: 'El horario seleccionado ya no está disponible. Por favor, seleccione otro horario.'
            };
        }
    }
    
    isSlotStillAvailable(date, time) {
        // En un sistema real, esto verificaría con el servidor
        const dateKey = date.toDateString();
        const bookedSlots = window.calendar?.bookedSlots?.get(dateKey) || [];
        return !bookedSlots.includes(time);
    }
    
    showConfirmationModal(bookingData) {
        const modal = document.getElementById('confirmationModal');
        const confirmationDetails = document.getElementById('confirmationDetails');
        
        const serviceNames = {
            'importacion': 'Importación',
            'exportacion': 'Exportación',
            'certificacion': 'Certificación',
            'consulta': 'Consulta General',
            'turismo': 'Gestión Turística',
            'permiso-menor': 'Permiso de Menor'
        };
        
        const dateOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        confirmationDetails.innerHTML = `
            <p><strong>ID de Reserva:</strong> ${bookingData.bookingId}</p>
            <p><strong>Nombre:</strong> ${bookingData.fullName}</p>
            <p><strong>Fecha:</strong> ${bookingData.selectedDate.toLocaleDateString('es-ES', dateOptions)}</p>
            <p><strong>Hora:</strong> ${bookingData.selectedTime}</p>
            <p><strong>Servicio:</strong> ${serviceNames[bookingData.serviceType]}</p>
            <p><strong>Email:</strong> ${bookingData.email}</p>
        `;
        
        modal.style.display = 'block';
        
        // Cerrar modal al hacer clic fuera
        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
        
        // Cerrar modal con la X
        const closeBtn = modal.querySelector('.close');
        closeBtn.onclick = function() {
            modal.style.display = 'none';
        };
    }
    
    showErrorModal(errorMessage) {
        alert(`Error: ${errorMessage}`);
    }
    
    resetForm() {
        const form = document.getElementById('bookingForm');
        form.reset();
        
        // Limpiar selecciones del calendario
        const selectedDay = document.querySelector('.calendar-day.selected');
        if (selectedDay) {
            selectedDay.classList.remove('selected');
        }
        
        const selectedTime = document.querySelector('.time-slot.selected');
        if (selectedTime) {
            selectedTime.classList.remove('selected');
        }
        
        // Limpiar resumen
        document.getElementById('bookingSummary').style.display = 'none';
        document.getElementById('selectedDate').textContent = 'Seleccione una fecha del calendario';
        document.getElementById('timeSlots').innerHTML = '';
        
        // Limpiar validaciones
        const validatedFields = form.querySelectorAll('.valid, .invalid');
        validatedFields.forEach(field => {
            field.classList.remove('valid', 'invalid');
        });
        
        // Remover mensajes de error
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(message => message.remove());
        
        // Resetear calendario
        if (window.calendar) {
            window.calendar.selectedDate = null;
            window.calendar.selectedTime = null;
        }
    }
    
    saveReservationsToLocalStorage() {
        try {
            const reservationsData = this.reservations.map(reservation => ({
                ...reservation,
                selectedDate: typeof reservation.selectedDate === 'string' ? 
                    reservation.selectedDate : 
                    new Date(reservation.selectedDate).toISOString().split('T')[0]
            }));
            localStorage.setItem('aduanasReservations', JSON.stringify(reservationsData));
            console.log('✅ Reservas guardadas en localStorage:', reservationsData.length);
            
            // Disparar evento de actualización
            window.dispatchEvent(new CustomEvent('appointmentsUpdated', {
                detail: { 
                    type: 'updated',
                    totalAppointments: this.reservations.length
                }
            }));
        } catch (error) {
            console.warn('No se pudo guardar en localStorage:', error);
        }
    }
    
    loadExistingReservations() {
        try {
            const saved = localStorage.getItem('aduanasReservations');
            if (saved) {
                const reservationsData = JSON.parse(saved);
                this.reservations = reservationsData.map(reservation => ({
                    ...reservation,
                    selectedDate: typeof reservation.selectedDate === 'string' ? 
                        reservation.selectedDate : 
                        new Date(reservation.selectedDate).toISOString().split('T')[0]
                }));
                console.log('✅ Reservas cargadas desde localStorage:', this.reservations.length);
            } else {
                console.log('No hay reservas guardadas en localStorage');
            }
        } catch (error) {
            console.warn('No se pudieron cargar reservas guardadas:', error);
        }
    }
    
    getReservations() {
        return this.reservations;
    }
    
    getReservationById(bookingId) {
        return this.reservations.find(reservation => reservation.bookingId === bookingId);
    }
}

// Función global para cerrar el modal
window.closeModal = function() {
    const modal = document.getElementById('confirmationModal');
    modal.style.display = 'none';
};

// Inicializar el sistema de reservas cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    window.bookingSystem = new BookingSystem();
});

// Funciones globales para el panel administrativo
window.viewAppointment = function(bookingId) {
    if (window.bookingSystem) {
        const appointment = window.bookingSystem.getReservationById(bookingId);
        if (appointment) {
            const details = `
Detalles de la Cita:

ID: ${appointment.bookingId}
Nombre: ${appointment.fullName}
Documento: ${appointment.idNumber}
Email: ${appointment.email}
Teléfono: ${appointment.phone}
Servicio: ${appointment.serviceType}
Fecha: ${appointment.selectedDate}
Hora: ${appointment.selectedTime}
Comentarios: ${appointment.comments || 'Ninguno'}
Estado: Pendiente
`;
            alert(details);
        }
    }
};

window.approveAppointment = function(bookingId) {
    if (confirm('¿Aprobar esta cita?')) {
        if (window.bookingSystem) {
            const appointment = window.bookingSystem.getReservationById(bookingId);
            if (appointment) {
                appointment.status = 'approved';
                appointment.approvedDate = new Date().toISOString();
                window.bookingSystem.saveReservationsToLocalStorage();
                alert(`Cita aprobada para ${appointment.fullName}`);
                
                // Actualizar la vista
                if (window.adminSystem) {
                    window.adminSystem.loadAppointments();
                }
            }
        }
    }
};

// Función para crear citas de prueba
window.createTestAppointments = function() {
    if (!window.bookingSystem) {
        alert('Sistema de reservas no disponible');
        return;
    }
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const testAppointments = [
        {
            bookingId: 'BOOK-TEST-001',
            fullName: 'Juan Pérez',
            idNumber: '12345678-9',
            email: 'juan.perez@email.com',
            phone: '+56912345678',
            serviceType: 'importacion',
            selectedDate: today.toISOString().split('T')[0],
            selectedTime: '09:00',
            comments: 'Cita de prueba',
            createdDate: new Date().toISOString(),
            status: 'pending'
        },
        {
            bookingId: 'BOOK-TEST-002',
            fullName: 'María González',
            idNumber: '98765432-1',
            email: 'maria.gonzalez@email.com',
            phone: '+56987654321',
            serviceType: 'exportacion',
            selectedDate: today.toISOString().split('T')[0],
            selectedTime: '10:00',
            comments: 'Urgente',
            createdDate: new Date().toISOString(),
            status: 'pending'
        },
        {
            bookingId: 'BOOK-TEST-003',
            fullName: 'Carlos López',
            idNumber: '11223344-5',
            email: 'carlos.lopez@email.com',
            phone: '+56911223344',
            serviceType: 'certificacion',
            selectedDate: tomorrow.toISOString().split('T')[0],
            selectedTime: '14:00',
            comments: 'Primera vez',
            createdDate: new Date().toISOString(),
            status: 'pending'
        }
    ];
    
    // Limpiar citas de prueba existentes
    window.bookingSystem.reservations = window.bookingSystem.reservations.filter(r => !r.bookingId.includes('TEST'));
    
    // Agregar nuevas citas de prueba
    window.bookingSystem.reservations.push(...testAppointments);
    window.bookingSystem.saveReservationsToLocalStorage();
    
    alert(`Se crearon ${testAppointments.length} citas de prueba`);
    
    // Actualizar vista
    if (window.adminSystem) {
        window.adminSystem.loadAppointments();
        window.adminSystem.loadDashboard();
    }
};

// Función para forzar actualización de citas
window.refreshAppointments = function() {
    console.log('🔄 Recargando citas...');
    
    if (!window.bookingSystem) {
        console.log('⚠️ Reinicializando BookingSystem...');
        window.bookingSystem = new BookingSystem();
    }
    
    if (window.adminSystem) {
        window.adminSystem.loadAppointments();
        window.adminSystem.loadDashboard();
        console.log('✅ Citas actualizadas');
    }
};
