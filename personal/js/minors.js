// Gestión de Permisos de Menores
class MinorsManagement {
    constructor() {
        this.minorPermits = [];
        this.init();
    }
    
    init() {
        this.addEventListeners();
        this.loadExistingPermits();
    }
    
    addEventListeners() {
        const minorsForm = document.getElementById('minorsForm');
        
        if (minorsForm) {
            minorsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleMinorPermitRequest();
            });
            
            // Validación en tiempo real
            this.addRealTimeValidation();
        }
    }
    
    addRealTimeValidation() {
        const requiredFields = [
            'minorName', 'minorAge', 'minorDocument', 'fatherName', 'motherName',
            'fatherDocument', 'motherDocument', 'accompaniedBy', 'travelPurpose',
            'travelDate', 'returnDate', 'destination', 'contactPhone', 'emergencyContact'
        ];
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', () => this.validateMinorField(field));
                field.addEventListener('blur', () => this.validateMinorField(field));
            }
        });
        
        // Validación especial para fechas
        this.setupMinorDateValidation();
        
        // Validación especial para edad
        this.setupAgeValidation();
    }
    
    setupMinorDateValidation() {
        const travelDate = document.getElementById('travelDate');
        const returnDate = document.getElementById('returnDate');
        
        if (travelDate && returnDate) {
            // Establecer fecha mínima como hoy
            const today = new Date().toISOString().split('T')[0];
            travelDate.min = today;
            
            travelDate.addEventListener('change', () => {
                if (travelDate.value) {
                    returnDate.min = travelDate.value;
                    if (returnDate.value && returnDate.value < travelDate.value) {
                        returnDate.value = '';
                        this.showFieldError(returnDate, 'La fecha de regreso debe ser posterior al viaje');
                    }
                }
            });
            
            returnDate.addEventListener('change', () => {
                if (returnDate.value && travelDate.value) {
                    if (returnDate.value < travelDate.value) {
                        this.showFieldError(returnDate, 'La fecha de regreso debe ser posterior al viaje');
                        return false;
                    } else {
                        this.removeFieldError(returnDate);
                    }
                }
            });
        }
    }
    
    setupAgeValidation() {
        const ageField = document.getElementById('minorAge');
        const accompaniedByField = document.getElementById('accompaniedBy');
        
        if (ageField && accompaniedByField) {
            ageField.addEventListener('change', () => {
                const age = parseInt(ageField.value);
                
                // Actualizar opciones de acompañante según la edad
                if (age < 12) {
                    // Menores de 12 deben ir acompañados
                    const soloOption = accompaniedByField.querySelector('option[value="solo"]');
                    if (soloOption) {
                        soloOption.disabled = true;
                        soloOption.textContent = 'No disponible para menores de 12 años';
                    }
                    
                    if (accompaniedByField.value === 'solo') {
                        accompaniedByField.value = '';
                    }
                } else {
                    // Mayores de 12 pueden viajar solos
                    const soloOption = accompaniedByField.querySelector('option[value="solo"]');
                    if (soloOption) {
                        soloOption.disabled = false;
                        soloOption.textContent = 'Viaja solo (mayor de 12 años)';
                    }
                }
            });
        }
    }
    
    validateMinorField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        
        field.classList.remove('valid', 'invalid');
        
        let isValid = true;
        let errorMessage = '';
        
        switch (fieldName) {
            case 'minorName':
            case 'fatherName':
            case 'motherName':
                isValid = value.length >= 2 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value);
                errorMessage = 'Nombre debe tener al menos 2 caracteres y solo letras';
                break;
                
            case 'minorAge':
                const age = parseInt(value);
                isValid = age >= 0 && age <= 17;
                errorMessage = 'La edad debe estar entre 0 y 17 años';
                break;
                
            case 'minorDocument':
            case 'fatherDocument':
            case 'motherDocument':
                isValid = value.length >= 6 && /^[0-9]+$/.test(value);
                errorMessage = 'Documento debe tener al menos 6 dígitos';
                break;
                
            case 'contactPhone':
                const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
                isValid = phoneRegex.test(value);
                errorMessage = 'Teléfono debe tener al menos 8 dígitos';
                break;
                
            case 'emergencyContact':
                isValid = value.length >= 10;
                errorMessage = 'Debe incluir nombre y teléfono de contacto';
                break;
                
            case 'destination':
                isValid = value.length >= 3;
                errorMessage = 'Destino debe tener al menos 3 caracteres';
                break;
                
            case 'accompaniedBy':
            case 'travelPurpose':
                isValid = value !== '';
                errorMessage = 'Debe seleccionar una opción';
                break;
                
            case 'travelDate':
            case 'returnDate':
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                isValid = selectedDate >= today;
                errorMessage = 'La fecha no puede ser anterior a hoy';
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
    
    handleMinorPermitRequest() {
        if (!this.validateMinorForm()) {
            return;
        }
        
        const formData = this.collectMinorFormData();
        
        // Validar documentación requerida
        if (!this.validateRequiredDocuments(formData)) {
            return;
        }
        
        // Simular proceso de solicitud
        this.processMinorPermitRequest(formData)
            .then(result => {
                if (result.success) {
                    this.showMinorPermitConfirmation(result.permitData);
                    this.resetMinorForm();
                } else {
                    this.showMinorPermitError(result.error);
                }
            })
            .catch(error => {
                console.error('Error en solicitud de permiso de menor:', error);
                this.showMinorPermitError('Error interno del sistema. Por favor, intente nuevamente.');
            });
    }
    
    validateMinorForm() {
        const requiredFields = [
            'minorName', 'minorAge', 'minorDocument', 'fatherName', 'motherName',
            'fatherDocument', 'motherDocument', 'accompaniedBy', 'travelPurpose',
            'travelDate', 'returnDate', 'destination', 'contactPhone', 'emergencyContact'
        ];
        
        let allValid = true;
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!this.validateMinorField(field)) {
                allValid = false;
            }
        });
        
        // Validar checkboxes requeridos
        const documentsComplete = document.getElementById('documentsComplete');
        const parentsConsent = document.getElementById('parentsConsent');
        
        if (!documentsComplete.checked) {
            alert('Debe confirmar que todos los documentos están completos');
            allValid = false;
        }
        
        if (!parentsConsent.checked) {
            alert('Debe confirmar el consentimiento de ambos padres');
            allValid = false;
        }
        
        return allValid;
    }
    
    validateRequiredDocuments(formData) {
        const age = parseInt(formData.minorAge);
        const accompaniedBy = formData.accompaniedBy;
        
        // Validaciones específicas según edad y acompañante
        if (age < 12 && accompaniedBy === 'solo') {
            alert('Menores de 12 años no pueden viajar solos');
            return false;
        }
        
        if (accompaniedBy === 'familiar' || accompaniedBy === 'institucion') {
            // En estos casos se requiere documentación adicional
            const additionalInfo = formData.comments;
            if (!additionalInfo || additionalInfo.length < 20) {
                alert('Para viajes con familiares o instituciones se requiere información adicional detallada');
                return false;
            }
        }
        
        return true;
    }
    
    collectMinorFormData() {
        return {
            minorName: document.getElementById('minorName').value.trim(),
            minorAge: document.getElementById('minorAge').value,
            minorDocument: document.getElementById('minorDocument').value.trim(),
            fatherName: document.getElementById('fatherName').value.trim(),
            motherName: document.getElementById('motherName').value.trim(),
            fatherDocument: document.getElementById('fatherDocument').value.trim(),
            motherDocument: document.getElementById('motherDocument').value.trim(),
            accompaniedBy: document.getElementById('accompaniedBy').value,
            travelPurpose: document.getElementById('travelPurpose').value,
            travelDate: new Date(document.getElementById('travelDate').value),
            returnDate: new Date(document.getElementById('returnDate').value),
            destination: document.getElementById('destination').value.trim(),
            contactPhone: document.getElementById('contactPhone').value.trim(),
            emergencyContact: document.getElementById('emergencyContact').value.trim(),
            comments: document.getElementById('minorComments').value.trim(),
            documentsComplete: document.getElementById('documentsComplete').checked,
            parentsConsent: document.getElementById('parentsConsent').checked,
            permitId: this.generatePermitId('MEN'),
            requestDate: new Date(),
            status: 'pending'
        };
    }
    
    generatePermitId(prefix) {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `${prefix}${timestamp}${random}`.slice(-10);
    }
    
    async processMinorPermitRequest(formData) {
        // Simular delay de procesamiento
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Guardar la solicitud
        this.minorPermits.push(formData);
        this.saveMinorPermitsToLocalStorage();
        
        return {
            success: true,
            permitData: formData
        };
    }
    
    showMinorPermitConfirmation(permitData) {
        const accompaniedByNames = {
            'padre': 'Padre',
            'madre': 'Madre',
            'ambos': 'Ambos padres',
            'tutor': 'Tutor legal',
            'familiar': 'Familiar autorizado',
            'institucion': 'Representante institucional',
            'solo': 'Viaja solo'
        };
        
        const purposeNames = {
            'turismo': 'Turismo/Vacaciones',
            'educativo': 'Viaje educativo',
            'medico': 'Tratamiento médico',
            'familiar': 'Visita familiar',
            'deportivo': 'Evento deportivo',
            'cultural': 'Evento cultural',
            'otro': 'Otro'
        };
        
        const dateOptions = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        const message = `¡Solicitud de permiso de menor enviada exitosamente!
        
ID de Permiso: ${permitData.permitId}
Menor: ${permitData.minorName}, ${permitData.minorAge} años
Documento: ${permitData.minorDocument}
Acompañado por: ${accompaniedByNames[permitData.accompaniedBy]}
Destino: ${permitData.destination}
Viaje: ${permitData.travelDate.toLocaleDateString('es-ES', dateOptions)}
Regreso: ${permitData.returnDate.toLocaleDateString('es-ES', dateOptions)}
Propósito: ${purposeNames[permitData.travelPurpose]}

Su solicitud será revisada por nuestro equipo especializado. Recibirá una respuesta en las próximas 24-48 horas.

IMPORTANTE: Mantenga este ID de permiso para futuras consultas.`;
        
        alert(message);
        
        // Mostrar notificación
        if (window.AduanasSystem) {
            window.AduanasSystem.showNotification('Solicitud de permiso de menor enviada exitosamente', 'success');
        }
    }
    
    showMinorPermitError(errorMessage) {
        alert(`Error: ${errorMessage}`);
        
        if (window.AduanasSystem) {
            window.AduanasSystem.showNotification(errorMessage, 'error');
        }
    }
    
    resetMinorForm() {
        const form = document.getElementById('minorsForm');
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
            
            // Resetear opciones de acompañante
            const soloOption = form.querySelector('option[value="solo"]');
            if (soloOption) {
                soloOption.disabled = false;
                soloOption.textContent = 'Viaja solo (mayor de 12 años)';
            }
        }
    }
    
    saveMinorPermitsToLocalStorage() {
        try {
            const permitsData = this.minorPermits.map(permit => ({
                ...permit,
                travelDate: permit.travelDate.toISOString(),
                returnDate: permit.returnDate.toISOString(),
                requestDate: permit.requestDate.toISOString()
            }));
            localStorage.setItem('aduanasMinorPermits', JSON.stringify(permitsData));
        } catch (error) {
            console.warn('No se pudo guardar en localStorage:', error);
        }
    }
    
    loadExistingPermits() {
        try {
            const saved = localStorage.getItem('aduanasMinorPermits');
            if (saved) {
                const permitsData = JSON.parse(saved);
                this.minorPermits = permitsData.map(permit => ({
                    ...permit,
                    travelDate: new Date(permit.travelDate),
                    returnDate: new Date(permit.returnDate),
                    requestDate: new Date(permit.requestDate)
                }));
            }
        } catch (error) {
            console.warn('No se pudieron cargar permisos de menores guardados:', error);
        }
    }
    
    // Métodos para el panel administrativo
    getMinorPermits() {
        return this.minorPermits;
    }
    
    getMinorPermitById(permitId) {
        return this.minorPermits.find(permit => permit.permitId === permitId);
    }
    
    updateMinorPermitStatus(permitId, newStatus) {
        const permit = this.getMinorPermitById(permitId);
        if (permit) {
            permit.status = newStatus;
            permit.lastUpdated = new Date();
            this.saveMinorPermitsToLocalStorage();
            return true;
        }
        return false;
    }
    
    getMinorPermitStatistics() {
        const total = this.minorPermits.length;
        const pending = this.minorPermits.filter(p => p.status === 'pending').length;
        const approved = this.minorPermits.filter(p => p.status === 'approved').length;
        const rejected = this.minorPermits.filter(p => p.status === 'rejected').length;
        
        // Estadísticas por edad
        const byAge = {};
        this.minorPermits.forEach(permit => {
            const ageGroup = permit.minorAge < 6 ? '0-5' : 
                           permit.minorAge < 12 ? '6-11' : '12-17';
            byAge[ageGroup] = (byAge[ageGroup] || 0) + 1;
        });
        
        // Estadísticas por propósito
        const byPurpose = {};
        this.minorPermits.forEach(permit => {
            byPurpose[permit.travelPurpose] = (byPurpose[permit.travelPurpose] || 0) + 1;
        });
        
        return {
            total,
            pending,
            approved,
            rejected,
            byAge,
            byPurpose
        };
    }
    
    getTodayPermits() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        return this.minorPermits.filter(permit => {
            const requestDate = new Date(permit.requestDate);
            return requestDate >= today && requestDate < tomorrow;
        });
    }
}

// Inicializar gestión de menores cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    window.minorsManagement = new MinorsManagement();
});
