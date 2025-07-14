// Sistema de Gestión de Vehículos
class VehicleManagement {
    constructor() {
        this.vehicles = this.loadVehicles();
        this.init();
    }
    
    init() {
        this.addEventListeners();
        this.loadVehiclesList();
        this.startStorageMonitoring();
    }
    
    // Monitorear cambios en localStorage para sincronización
    startStorageMonitoring() {
        // Verificar cambios cada 2 segundos
        setInterval(() => {
            const currentData = localStorage.getItem('aduanasVehicles');
            const currentVehicles = currentData ? JSON.parse(currentData) : [];
            
            // Solo actualizar si hay diferencias
            if (JSON.stringify(this.vehicles) !== JSON.stringify(currentVehicles)) {
                console.log('🔄 Detectados cambios en localStorage, actualizando...');
                this.vehicles = currentVehicles;
                this.loadVehiclesList();
            }
        }, 2000);
    }
    
    addEventListeners() {
        const vehicleForm = document.getElementById('vehicleForm');
        if (vehicleForm) {
            vehicleForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleVehicleSubmit();
            });
        }
        
        // Filtros y búsqueda
        const vehicleSearch = document.getElementById('vehicleSearch');
        if (vehicleSearch) {
            vehicleSearch.addEventListener('input', () => this.filterVehicles());
        }
        
        const typeFilter = document.getElementById('typeFilter');
        if (typeFilter) {
            typeFilter.addEventListener('change', () => this.filterVehicles());
        }
        
        // Formatear patente mientras se escribe
        const plateNumber = document.getElementById('plateNumber');
        if (plateNumber) {
            plateNumber.addEventListener('input', this.formatPlateNumber);
        }
    }
    
    formatPlateNumber(e) {
        let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (value.length > 3) {
            value = value.slice(0, 3) + '-' + value.slice(3, 7);
        }
        e.target.value = value;
    }
    
    handleVehicleSubmit() {
        const formData = new FormData(document.getElementById('vehicleForm'));
        const vehicleData = {};
        
        for (let [key, value] of formData.entries()) {
            vehicleData[key] = value;
        }
        
        // Verificar si es edición o registro nuevo
        const editVehicleId = vehicleData.editVehicleId;
        const isEditing = !!editVehicleId;
        
        // Validar formato de patente
        const platePattern = /^[A-Z]{3}-[0-9]{4}$/;
        if (!platePattern.test(vehicleData.plateNumber)) {
            this.showError('El formato de la patente debe ser ABC-1234');
            return;
        }
        
        if (isEditing) {
            // MODO EDICIÓN
            const vehicleIndex = this.vehicles.findIndex(v => v.vehicleId === editVehicleId);
            if (vehicleIndex !== -1) {
                // Mantener datos originales importantes
                const originalVehicle = this.vehicles[vehicleIndex];
                vehicleData.vehicleId = originalVehicle.vehicleId;
                vehicleData.registrationDate = originalVehicle.registrationDate;
                vehicleData.status = originalVehicle.status;
                vehicleData.lastModified = new Date().toISOString();
                
                // Actualizar vehículo
                this.vehicles[vehicleIndex] = vehicleData;
                this.saveVehicles();
                
                // Mostrar confirmación
                this.showConfirmation('Vehículo actualizado exitosamente', vehicleData);
                
                // Resetear formulario
                this.resetEditMode();
            } else {
                this.showError('Error: Vehículo no encontrado para editar');
            }
        } else {
            // MODO REGISTRO NUEVO
            // Verificar si la patente ya existe
            if (this.vehicles.some(v => v.plateNumber === vehicleData.plateNumber)) {
                this.showError('Ya existe un vehículo registrado con esta patente');
                return;
            }
            
            // Generar ID único
            vehicleData.vehicleId = 'VEH-' + Date.now();
            vehicleData.registrationDate = new Date().toISOString();
            vehicleData.status = 'pending'; // Cambiar a 'pending' para que aparezca en el panel admin
            
            // Guardar vehículo
            this.vehicles.push(vehicleData);
            this.saveVehicles(); // Esto ya actualiza la lista automáticamente
            
            // Mostrar confirmación
            this.showConfirmation('Vehículo registrado exitosamente', vehicleData);
        }
        
        // Limpiar formulario 
        document.getElementById('vehicleForm').reset();
        this.resetEditMode();
        
        // Forzar actualización inmediata
        setTimeout(() => {
            this.loadVehiclesList();
            console.log('✅ Lista actualizada después del registro/edición');
        }, 100);
    }
    
    resetEditMode() {
        // Rehabilitar campo de patente
        const plateNumber = document.getElementById('plateNumber');
        if (plateNumber) {
            plateNumber.disabled = false;
        }
        
        // Restaurar texto del botón
        const submitBtn = document.querySelector('#vehicleForm button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'Registrar Vehículo';
            submitBtn.style.background = '';
        }
        
        // Ocultar botón de cancelar edición
        const cancelBtn = document.getElementById('cancelEditBtn');
        if (cancelBtn) {
            cancelBtn.style.display = 'none';
        }
        
        // Remover campo de edición
        const editIdInput = document.getElementById('editVehicleId');
        if (editIdInput) {
            editIdInput.remove();
        }
    }
    
    cancelEdit() {
        this.resetEditMode();
        document.getElementById('vehicleForm').reset();
        alert('Edición cancelada');
    }
    
    loadVehicles() {
        try {
            const stored = localStorage.getItem('aduanasVehicles');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error al cargar vehículos:', error);
            return [];
        }
    }
    
    saveVehicles() {
        try {
            localStorage.setItem('aduanasVehicles', JSON.stringify(this.vehicles));
            console.log('Vehículos guardados en localStorage');
            
            // Actualizar la lista automáticamente después de guardar
            this.loadVehiclesList();
            
            // Disparar evento personalizado para notificar cambios
            window.dispatchEvent(new CustomEvent('vehiclesUpdated', {
                detail: { vehicles: this.vehicles }
            }));
            
        } catch (error) {
            console.error('Error al guardar vehículos:', error);
        }
    }
    
    loadVehiclesList() {
        const grid = document.getElementById('vehiclesGrid');
        if (!grid) return;
        
        if (this.vehicles.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-car"></i>
                    <h4>No hay vehículos registrados</h4>
                    <p>Registre su primer vehículo usando el formulario anterior</p>
                </div>
            `;
            return;
        }
        
        const vehiclesHTML = this.vehicles.map(vehicle => this.createVehicleCard(vehicle)).join('');
        grid.innerHTML = vehiclesHTML;
    }
    
    createVehicleCard(vehicle) {
        const registrationDate = new Date(vehicle.registrationDate).toLocaleDateString('es-ES');
        const statusClass = this.getStatusClass(vehicle.status);
        const statusText = this.getStatusText(vehicle.status);
        
        return `
            <div class="vehicle-card" data-vehicle-id="${vehicle.vehicleId}">
                <div class="vehicle-header">
                    <div class="vehicle-plate">${vehicle.plateNumber}</div>
                    <div class="vehicle-status ${statusClass}">${statusText}</div>
                </div>
                <div class="vehicle-info">
                    <h4>${vehicle.vehicleBrand} ${vehicle.vehicleModel}</h4>
                    <p class="vehicle-details">
                        <i class="fas fa-calendar"></i> ${vehicle.vehicleYear} |
                        <i class="fas fa-palette"></i> ${vehicle.vehicleColor} |
                        <i class="fas fa-car"></i> ${this.getVehicleTypeName(vehicle.vehicleType)}
                    </p>
                    <p class="vehicle-owner">
                        <i class="fas fa-user"></i> ${vehicle.ownerName}
                    </p>
                    <p class="vehicle-purpose">
                        <i class="fas fa-flag"></i> ${this.getPurposeName(vehicle.vehiclePurpose)}
                    </p>
                    <p class="registration-date">
                        <i class="fas fa-clock"></i> Registrado: ${registrationDate}
                    </p>
                </div>
                <div class="vehicle-actions">
                    <button class="btn-action btn-view" onclick="viewVehicleDetails('${vehicle.vehicleId}')">
                        <i class="fas fa-eye"></i> Ver Detalles
                    </button>
                    <button class="btn-action btn-edit" onclick="editVehicle('${vehicle.vehicleId}')">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-action btn-delete" onclick="deleteVehicle('${vehicle.vehicleId}')">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `;
    }
    
    filterVehicles() {
        const searchTerm = document.getElementById('vehicleSearch').value.toLowerCase();
        const typeFilter = document.getElementById('typeFilter').value;
        
        const filteredVehicles = this.vehicles.filter(vehicle => {
            const matchesSearch = !searchTerm || 
                vehicle.plateNumber.toLowerCase().includes(searchTerm) ||
                vehicle.vehicleBrand.toLowerCase().includes(searchTerm) ||
                vehicle.vehicleModel.toLowerCase().includes(searchTerm) ||
                vehicle.ownerName.toLowerCase().includes(searchTerm);
                
            const matchesType = !typeFilter || vehicle.vehicleType === typeFilter;
            
            return matchesSearch && matchesType;
        });
        
        const grid = document.getElementById('vehiclesGrid');
        if (filteredVehicles.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h4>No se encontraron vehículos</h4>
                    <p>Intente con otros términos de búsqueda</p>
                </div>
            `;
        } else {
            const vehiclesHTML = filteredVehicles.map(vehicle => this.createVehicleCard(vehicle)).join('');
            grid.innerHTML = vehiclesHTML;
        }
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
    
    getPurposeName(purpose) {
        const purposes = {
            'importacion': 'Importación',
            'exportacion': 'Exportación',
            'transito': 'Tránsito Internacional',
            'temporal': 'Admisión Temporal',
            'comercial': 'Uso Comercial',
            'personal': 'Uso Personal'
        };
        return purposes[purpose] || purpose;
    }
    
    getStatusClass(status) {
        const classes = {
            'pending': 'status-warning',
            'approved': 'status-success',
            'rejected': 'status-danger',
            'registered': 'status-info' // Mantener para compatibilidad
        };
        return classes[status] || 'status-info';
    }
    
    getStatusText(status) {
        const texts = {
            'pending': 'Pendiente Aprobación',
            'approved': 'Aprobado',
            'rejected': 'Rechazado',
            'registered': 'Registrado' // Mantener para compatibilidad
        };
        return texts[status] || status;
    }
    
    showError(message) {
        if (window.AduanasSystem) {
            window.AduanasSystem.showNotification(message, 'error');
        } else {
            alert(message);
        }
    }
    
    showConfirmation(message, vehicleData) {
        if (window.AduanasSystem) {
            window.AduanasSystem.showNotification(
                `${message}. Patente: ${vehicleData.plateNumber}`, 
                'success'
            );
        } else {
            alert(`${message}. Patente: ${vehicleData.plateNumber}`);
        }
    }
    
    // Métodos públicos para funciones globales
    getVehicles() {
        return this.vehicles;
    }
    
    getVehicleById(vehicleId) {
        return this.vehicles.find(v => v.vehicleId === vehicleId);
    }
    
    // Método para crear nuevo vehículo
    createVehicle(vehicleData, auditInfo = null) {
        try {
            // Validar datos requeridos
            if (!vehicleData.plateNumber || !vehicleData.ownerName || !vehicleData.vehicleBrand || !vehicleData.vehicleModel) {
                return { success: false, error: 'Faltan campos requeridos' };
            }
            
            // Verificar que la patente no exista
            const existingVehicle = this.vehicles.find(v => v.plateNumber.toUpperCase() === vehicleData.plateNumber.toUpperCase());
            if (existingVehicle) {
                return { success: false, error: 'Ya existe un vehículo con esta patente' };
            }
            
            // Generar ID único
            const vehicleId = 'VEH-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            
            // Crear objeto vehículo
            const newVehicle = {
                vehicleId: vehicleId,
                plateNumber: vehicleData.plateNumber.toUpperCase(),
                vehicleBrand: vehicleData.vehicleBrand,
                vehicleModel: vehicleData.vehicleModel,
                vehicleYear: vehicleData.vehicleYear || null,
                vehicleColor: vehicleData.vehicleColor || null,
                vehicleType: vehicleData.vehicleType,
                ownerName: vehicleData.ownerName,
                ownerRut: vehicleData.ownerRut || null,
                ownerEmail: vehicleData.ownerEmail || null,
                ownerPhone: vehicleData.ownerPhone || null,
                ownerAddress: vehicleData.ownerAddress || null,
                vehiclePurpose: vehicleData.vehiclePurpose,
                registrationDate: new Date().toISOString(),
                status: vehicleData.status || 'pending',
                comments: vehicleData.comments || null,
                lastModified: auditInfo || null
            };
            
            // Agregar a la lista
            this.vehicles.push(newVehicle);
            this.saveVehicles();
            
            console.log('✅ Vehículo creado:', newVehicle);
            return { success: true, vehicleId: vehicleId, vehicle: newVehicle };
            
        } catch (error) {
            console.error('❌ Error al crear vehículo:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Método para actualizar vehículo
    updateVehicle(vehicleId, updateData, auditInfo = null) {
        try {
            const vehicleIndex = this.vehicles.findIndex(v => v.vehicleId === vehicleId);
            if (vehicleIndex === -1) {
                return { success: false, error: 'Vehículo no encontrado' };
            }
            
            // Verificar patente única (excluyendo el vehículo actual)
            if (updateData.plateNumber) {
                const existingVehicle = this.vehicles.find(v => 
                    v.plateNumber.toUpperCase() === updateData.plateNumber.toUpperCase() && 
                    v.vehicleId !== vehicleId
                );
                if (existingVehicle) {
                    return { success: false, error: 'Ya existe otro vehículo con esta patente' };
                }
            }
            
            // Actualizar campos
            const updatedVehicle = {
                ...this.vehicles[vehicleIndex],
                ...updateData,
                plateNumber: updateData.plateNumber ? updateData.plateNumber.toUpperCase() : this.vehicles[vehicleIndex].plateNumber,
                lastModified: auditInfo
            };
            
            this.vehicles[vehicleIndex] = updatedVehicle;
            this.saveVehicles();
            
            console.log('✅ Vehículo actualizado:', updatedVehicle);
            return { success: true, vehicle: updatedVehicle };
            
        } catch (error) {
            console.error('❌ Error al actualizar vehículo:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Método para aprobar vehículo
    approveVehicle(vehicleId, comments = null, auditInfo = null) {
        try {
            const vehicleIndex = this.vehicles.findIndex(v => v.vehicleId === vehicleId);
            if (vehicleIndex === -1) {
                return { success: false, error: 'Vehículo no encontrado' };
            }
            
            this.vehicles[vehicleIndex].status = 'approved';
            if (comments) {
                this.vehicles[vehicleIndex].approvalComments = comments;
                this.vehicles[vehicleIndex].comments = comments;
            }
            this.vehicles[vehicleIndex].approvedAt = new Date().toISOString();
            this.vehicles[vehicleIndex].lastModified = auditInfo;
            
            this.saveVehicles();
            
            console.log('✅ Vehículo aprobado:', this.vehicles[vehicleIndex]);
            return { success: true, vehicle: this.vehicles[vehicleIndex] };
            
        } catch (error) {
            console.error('❌ Error al aprobar vehículo:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Método para rechazar vehículo
    rejectVehicle(vehicleId, reason, auditInfo = null) {
        try {
            const vehicleIndex = this.vehicles.findIndex(v => v.vehicleId === vehicleId);
            if (vehicleIndex === -1) {
                return { success: false, error: 'Vehículo no encontrado' };
            }
            
            this.vehicles[vehicleIndex].status = 'rejected';
            this.vehicles[vehicleIndex].rejectionReason = reason;
            this.vehicles[vehicleIndex].rejectedAt = new Date().toISOString();
            this.vehicles[vehicleIndex].lastModified = auditInfo;
            
            this.saveVehicles();
            
            console.log('✅ Vehículo rechazado:', this.vehicles[vehicleIndex]);
            return { success: true, vehicle: this.vehicles[vehicleIndex] };
            
        } catch (error) {
            console.error('❌ Error al rechazar vehículo:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Método para eliminar vehículo
    deleteVehicle(vehicleId, auditInfo = null) {
        try {
            const vehicleIndex = this.vehicles.findIndex(v => v.vehicleId === vehicleId);
            if (vehicleIndex === -1) {
                return { success: false, error: 'Vehículo no encontrado' };
            }
            
            const deletedVehicle = this.vehicles[vehicleIndex];
            
            // Guardar en historial de eliminados para auditoría
            const deletedVehicles = JSON.parse(localStorage.getItem('aduanasDeletedVehicles') || '[]');
            deletedVehicles.push({
                ...deletedVehicle,
                deletedAt: new Date().toISOString(),
                deletedBy: auditInfo
            });
            localStorage.setItem('aduanasDeletedVehicles', JSON.stringify(deletedVehicles));
            
            // Eliminar de la lista activa
            this.vehicles.splice(vehicleIndex, 1);
            this.saveVehicles();
            
            console.log('✅ Vehículo eliminado:', deletedVehicle);
            return { success: true, vehicle: deletedVehicle };
            
        } catch (error) {
            console.error('❌ Error al eliminar vehículo:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Método para obtener estadísticas
    getVehicleStats() {
        const stats = {
            total: this.vehicles.length,
            pending: this.vehicles.filter(v => v.status === 'pending').length,
            approved: this.vehicles.filter(v => v.status === 'approved').length,
            rejected: this.vehicles.filter(v => v.status === 'rejected').length,
            registered: this.vehicles.filter(v => v.status === 'registered').length,
            byType: {},
            byPurpose: {}
        };
        
        // Estadísticas por tipo
        this.vehicles.forEach(v => {
            stats.byType[v.vehicleType] = (stats.byType[v.vehicleType] || 0) + 1;
            stats.byPurpose[v.vehiclePurpose] = (stats.byPurpose[v.vehiclePurpose] || 0) + 1;
        });
        
        return stats;
    }
}

// Funciones globales para interacción con las tarjetas
window.clearVehicleForm = function() {
    document.getElementById('vehicleForm').reset();
};

window.viewVehicleDetails = function(vehicleId) {
    if (window.vehicleManagement) {
        const vehicle = window.vehicleManagement.getVehicleById(vehicleId);
        if (vehicle) {
            alert(`Detalles del vehículo:\n\nPatente: ${vehicle.plateNumber}\nMarca: ${vehicle.vehicleBrand}\nModelo: ${vehicle.vehicleModel}\nAño: ${vehicle.vehicleYear}\nPropietario: ${vehicle.ownerName}\nPropósito: ${window.vehicleManagement.getPurposeName(vehicle.vehiclePurpose)}`);
        }
    }
};

window.editVehicle = function(vehicleId) {
    if (window.vehicleManagement) {
        const vehicle = window.vehicleManagement.getVehicleById(vehicleId);
        if (vehicle) {
            // Llenar el formulario con los datos del vehículo
            document.getElementById('plateNumber').value = vehicle.plateNumber;
            document.getElementById('vehicleBrand').value = vehicle.vehicleBrand;
            document.getElementById('vehicleModel').value = vehicle.vehicleModel;
            document.getElementById('vehicleYear').value = vehicle.vehicleYear;
            document.getElementById('vehicleColor').value = vehicle.vehicleColor;
            document.getElementById('vehicleType').value = vehicle.vehicleType;
            document.getElementById('ownerName').value = vehicle.ownerName;
            document.getElementById('ownerRUT').value = vehicle.ownerRUT;
            document.getElementById('vehiclePurpose').value = vehicle.vehiclePurpose;
            
            // Deshabilitar el campo de patente (no se puede editar)
            document.getElementById('plateNumber').disabled = true;
            
            // Cambiar el texto del botón de envío
            const submitBtn = document.querySelector('#vehicleForm button[type="submit"]');
            if (submitBtn) {
                submitBtn.textContent = 'Actualizar Vehículo';
                submitBtn.style.background = '#ffc107';
            }
            
            // Mostrar botón de cancelar edición
            const cancelBtn = document.getElementById('cancelEditBtn');
            if (cancelBtn) {
                cancelBtn.style.display = 'inline-block';
            }
            
            // Agregar campo oculto para identificar que es edición
            let editIdInput = document.getElementById('editVehicleId');
            if (!editIdInput) {
                editIdInput = document.createElement('input');
                editIdInput.type = 'hidden';
                editIdInput.id = 'editVehicleId';
                editIdInput.name = 'editVehicleId';
                document.getElementById('vehicleForm').appendChild(editIdInput);
            }
            editIdInput.value = vehicleId;
            
            // Scroll al formulario
            document.getElementById('vehicleForm').scrollIntoView({ behavior: 'smooth' });
            
            // Mostrar mensaje de edición
            alert(`Editando vehículo ${vehicle.plateNumber}. Modifique los campos necesarios y haga clic en "Actualizar Vehículo".`);
        } else {
            alert('Vehículo no encontrado');
        }
    }
};

window.deleteVehicle = function(vehicleId) {
    if (window.vehicleManagement) {
        const vehicle = window.vehicleManagement.getVehicleById(vehicleId);
        if (vehicle) {
            const confirmMessage = `¿Está seguro de que desea eliminar el vehículo?\n\nPatente: ${vehicle.plateNumber}\nMarca: ${vehicle.vehicleBrand} ${vehicle.vehicleModel}\nPropietario: ${vehicle.ownerName}\n\nEsta acción no se puede deshacer.`;
            
            if (confirm(confirmMessage)) {
                const vehicleIndex = window.vehicleManagement.vehicles.findIndex(v => v.vehicleId === vehicleId);
                if (vehicleIndex !== -1) {
                    window.vehicleManagement.vehicles.splice(vehicleIndex, 1);
                    window.vehicleManagement.saveVehicles();
                    alert(`Vehículo ${vehicle.plateNumber} eliminado exitosamente`);
                } else {
                    alert('Error: No se pudo encontrar el vehículo para eliminar');
                }
            }
        } else {
            alert('Vehículo no encontrado');
        }
    }
};

// Función global para cancelar edición
window.cancelEdit = function() {
    if (window.vehicleManagement) {
        window.vehicleManagement.resetEditMode();
        document.getElementById('vehicleForm').reset();
        alert('Edición cancelada');
    }
};

// FUNCIÓN DE PRUEBA - Solo para testing
window.testVehicleRegistration = function() {
    console.log('🧪 Iniciando prueba de registro de vehículo...');
    
    if (!window.vehicleManagement) {
        console.log('❌ VehicleManagement no está inicializado');
        return false;
    }
    
    // Generar datos únicos para cada prueba
    const timestamp = Date.now();
    const plateNumber = `TST-${String(timestamp).slice(-4)}`;
    
    // Datos de prueba con información única
    const testVehicle = {
        plateNumber: plateNumber,
        vehicleBrand: 'Toyota',
        vehicleModel: 'Corolla',
        vehicleYear: '2020',
        vehicleColor: 'Blanco',
        vehicleType: 'automovil',
        ownerName: `Juan Pérez ${timestamp}`,
        ownerRut: '12345678-9',
        ownerEmail: 'juan.perez@email.com',
        ownerPhone: '+56912345678',
        vehiclePurpose: 'importacion',
        registrationDate: new Date().toISOString(),
        status: 'registered',
        vehicleId: 'VEH-TEST-' + timestamp
    };
    
    // Agregar el vehículo de prueba
    window.vehicleManagement.vehicles.push(testVehicle);
    window.vehicleManagement.saveVehicles(); // Esto activará la actualización automática
    
    console.log('✅ Vehículo de prueba registrado exitosamente');
    console.log('📊 Total de vehículos:', window.vehicleManagement.getVehicles().length);
    console.log('🚗 Vehículo registrado:', testVehicle);
    
    return true;
};

// Función para limpiar datos de prueba
window.clearTestData = function() {
    if (window.vehicleManagement) {
        window.vehicleManagement.vehicles = [];
        window.vehicleManagement.saveVehicles();
        console.log('🗑️ Datos de prueba eliminados');
        
        if (document.getElementById('vehiclesGrid')) {
            window.vehicleManagement.loadVehiclesList();
        }
    }
};

// Agregar listener para actualización automática entre portales
window.addEventListener('vehiclesUpdated', function(event) {
    console.log('🔄 Evento vehiclesUpdated recibido, actualizando interfaces...');
    
    // Actualizar panel administrativo si está disponible
    if (window.adminSystem && typeof window.adminSystem.loadVehiclesAdmin === 'function') {
        window.adminSystem.loadVehiclesAdmin();
        console.log('✅ Panel administrativo actualizado');
    }
    
    // Actualizar estadísticas si estamos en admin
    if (window.adminSystem && event.detail.vehicles) {
        const vehicles = event.detail.vehicles;
        window.adminSystem.updateStatElement('totalVehicles', vehicles.length);
        window.adminSystem.updateStatElement('pendingVehicles', vehicles.filter(v => v.status === 'pending').length);
        window.adminSystem.updateStatElement('registeredVehicles', vehicles.filter(v => v.status === 'registered').length);
    }
});

// Función global para forzar actualización manual
window.forceVehicleRefresh = function() {
    console.log('🔄 Forzando actualización manual de vehículos...');
    if (window.vehicleManagement) {
        window.vehicleManagement.refreshVehiclesList();
        console.log('✅ Lista de vehículos actualizada');
    }
    if (window.adminSystem) {
        window.adminSystem.loadVehiclesAdmin();
        console.log('✅ Panel administrativo actualizado');
    }
};

// Función de debugging para probar el registro y visualización
window.testVehicleSystem = function() {
    console.log('🧪 Probando sistema de vehículos...');
    
    if (!window.vehicleManagement) {
        console.error('❌ VehicleManagement no está inicializado');
        return;
    }
    
    // Crear vehículo de prueba
    const testVehicle = {
        vehicleId: 'VEH-TEST-' + Date.now(),
        plateNumber: 'ABC-1234',
        vehicleBrand: 'Toyota',
        vehicleModel: 'Corolla',
        vehicleYear: '2020',
        vehicleColor: 'Blanco',
        vehicleType: 'automovil',
        ownerName: 'Usuario de Prueba',
        ownerRUT: '12345678-9',
        vehiclePurpose: 'personal',
        registrationDate: new Date().toISOString(),
        status: 'pending'
    };
    
    // Agregar vehículo de prueba
    window.vehicleManagement.vehicles.push(testVehicle);
    window.vehicleManagement.saveVehicles();
    
    console.log('✅ Vehículo de prueba agregado:', testVehicle);
    console.log('📊 Total vehículos:', window.vehicleManagement.vehicles.length);
    
    // Actualizar vistas
    setTimeout(() => {
        if (window.vehicleManagement.loadVehiclesList) {
            window.vehicleManagement.loadVehiclesList();
        }
        if (window.adminSystem && window.adminSystem.loadVehiclesAdmin) {
            window.adminSystem.loadVehiclesAdmin();
        }
    }, 100);
};

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('Iniciando VehicleManagement...');
    
    // Inicializar en portal ciudadano (cuando existe el formulario)
    if (document.getElementById('vehicleForm')) {
        console.log('Inicializando VehicleManagement - Portal Ciudadano');
        window.vehicleManagement = new VehicleManagement();
    }
    // Inicializar en panel admin (cuando existe la tabla admin)
    else if (document.getElementById('adminVehiclesTableBody')) {
        console.log('Inicializando VehicleManagement - Panel Admin');
        window.vehicleManagement = new VehicleManagement();
    }
    // Inicializar en cualquier página que tenga elementos relacionados con vehículos
    else if (document.querySelector('.vehicles-list') || document.querySelector('[data-section="vehicles"]')) {
        console.log('Inicializando VehicleManagement - Otros elementos');
        window.vehicleManagement = new VehicleManagement();
    }
    else {
        console.log('No se encontraron elementos de vehículos para inicializar');
    }
    
    // Verificar inicialización
    if (window.vehicleManagement) {
        console.log('VehicleManagement inicializado correctamente');
        console.log('Vehículos cargados:', window.vehicleManagement.getVehicles().length);
    }
});
