// Sistema de Gestión y Calificación de Documentos - CRUD Completo
class DocumentManagement {
    constructor() {
        this.documents = this.loadDocuments();
        this.currentPage = 1;
        this.documentsPerPage = 10;
        this.currentEditingDoc = null;
        this.init();
    }
    
    init() {
        this.addEventListeners();
        this.loadDocumentsList();
        this.setupFileUpload();
        this.generateSampleData();
        this.updateDocumentStats();
    }
    
    // Generar datos de ejemplo para demostración
    generateSampleData() {
        if (this.documents.length === 0) {
            const sampleDocs = [
                {
                    id: 'DOC-001',
                    type: 'importacion',
                    emitter: 'Comercial XYZ Ltda.',
                    purpose: 'Importación de equipos electrónicos',
                    urgency: 'alta',
                    status: 'pendiente',
                    value: 15000,
                    currency: 'USD',
                    createdAt: new Date('2025-07-10').toISOString(),
                    observations: 'Requiere revisión por valor alto'
                },
                {
                    id: 'DOC-002',
                    type: 'exportacion',
                    emitter: 'Frutas del Sur S.A.',
                    purpose: 'Exportación de productos frutícolas',
                    urgency: 'normal',
                    status: 'calificado',
                    value: 8500,
                    currency: 'USD',
                    createdAt: new Date('2025-07-11').toISOString(),
                    qualification: {
                        decision: 'aprobado',
                        score: 8.5,
                        comments: 'Documentación completa y correcta',
                        qualifiedBy: 'ADMIN',
                        qualifiedAt: new Date().toISOString()
                    }
                },
                {
                    id: 'DOC-003',
                    type: 'certificacion',
                    emitter: 'Minera Norte Chile',
                    purpose: 'Certificación de origen de minerales',
                    urgency: 'critica',
                    status: 'en-revision',
                    value: 50000,
                    currency: 'USD',
                    createdAt: new Date('2025-07-12').toISOString(),
                    observations: 'Requiere verificación urgente'
                }
            ];
            
            this.documents = sampleDocs;
            this.saveDocuments();
        }
    }
    
    addEventListeners() {
        const documentForm = document.getElementById('documentForm');
        if (documentForm) {
            documentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleDocumentSubmit();
            });
        }
        
        // Filtros y búsqueda
        const documentSearch = document.getElementById('adminDocumentSearch');
        if (documentSearch) {
            documentSearch.addEventListener('input', () => this.filterDocuments());
        }
        
        const statusFilter = document.getElementById('adminDocumentStatus');
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.filterDocuments());
        }
        
        const urgencyFilter = document.getElementById('adminDocumentUrgency');
        if (urgencyFilter) {
            urgencyFilter.addEventListener('change', () => this.filterDocuments());
        }
        
        const typeFilter = document.getElementById('adminDocumentType');
        if (typeFilter) {
            typeFilter.addEventListener('change', () => this.filterDocuments());
        }
    }
    
    setupFileUpload() {
        const fileInput = document.getElementById('documentFiles');
        const uploadArea = document.getElementById('fileUploadArea');
        const filesPreview = document.getElementById('filesPreview');
        
        if (!fileInput || !uploadArea) return;
        
        // Drag and drop functionality
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });
        
        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            this.handleFiles(files);
        });
        
        fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });
    }
    
    handleFiles(files) {
        const filesPreview = document.getElementById('filesPreview');
        if (!filesPreview) return;
        
        filesPreview.innerHTML = '';
        
        if (files.length === 0) return;
        
        Array.from(files).forEach((file, index) => {
            if (!this.validateFile(file)) return;
            
            const filePreview = this.createFilePreview(file, index);
            filesPreview.appendChild(filePreview);
        });
    }
    
    validateFile(file) {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = [
            'application/pdf',
            'image/jpeg',
            'image/jpg',
            'image/png',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        
        if (file.size > maxSize) {
            this.showError(`El archivo ${file.name} excede el tamaño máximo de 10MB`);
            return false;
        }
        
        if (!allowedTypes.includes(file.type)) {
            this.showError(`El tipo de archivo ${file.name} no está permitido`);
            return false;
        }
        
        return true;
    }
    
    createFilePreview(file, index) {
        const fileDiv = document.createElement('div');
        fileDiv.className = 'file-preview-item';
        fileDiv.innerHTML = `
            <div class="file-info">
                <i class="fas ${this.getFileIcon(file.type)}"></i>
                <div class="file-details">
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">${this.formatFileSize(file.size)}</span>
                </div>
            </div>
            <button type="button" class="remove-file" onclick="removeFile(${index})">
                <i class="fas fa-times"></i>
            </button>
        `;
        return fileDiv;
    }
    
    getFileIcon(fileType) {
        if (fileType === 'application/pdf') return 'fa-file-pdf';
        if (fileType.startsWith('image/')) return 'fa-file-image';
        if (fileType.includes('word')) return 'fa-file-word';
        return 'fa-file';
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    handleDocumentSubmit() {
        const formData = new FormData(document.getElementById('documentForm'));
        const documentData = {};
        
        for (let [key, value] of formData.entries()) {
            if (key !== 'documentFiles') {
                documentData[key] = value;
            }
        }
        
        // Obtener archivos
        const fileInput = document.getElementById('documentFiles');
        const files = Array.from(fileInput.files);
        
        if (files.length === 0) {
            this.showError('Debe seleccionar al menos un archivo');
            return;
        }
        
        // Generar ID único
        documentData.documentId = 'DOC-' + Date.now();
        documentData.submissionDate = new Date().toISOString();
        documentData.status = 'pendiente';
        documentData.files = files.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified
        }));
        
        // Calcular fecha estimada de calificación
        const urgencyDays = this.getUrgencyDays(documentData.urgencyLevel);
        const estimatedDate = new Date();
        estimatedDate.setDate(estimatedDate.getDate() + urgencyDays);
        documentData.estimatedDate = estimatedDate.toISOString();
        
        // Guardar documento
        this.documents.push(documentData);
        this.saveDocuments();
        
        // Disparar evento de creación
        window.dispatchEvent(new CustomEvent('documentsUpdated', {
            detail: { 
                type: 'created',
                document: documentData,
                totalDocuments: this.documents.length
            }
        }));
        
        // Mostrar confirmación
        this.showConfirmation('Documento enviado para calificación', documentData);
        
        // Limpiar formulario y actualizar lista
        document.getElementById('documentForm').reset();
        document.getElementById('filesPreview').innerHTML = '';
        this.loadDocumentsList();
    }
    
    getUrgencyDays(urgencyLevel) {
        const days = {
            'normal': 7,
            'media': 4,
            'alta': 2,
            'critica': 1
        };
        return days[urgencyLevel] || 7;
    }
    
    // ==================== MÉTODOS CRUD ====================
    
    // Crear nuevo documento
    createDocument(documentData) {
        const newDocument = {
            id: this.generateDocumentId(),
            ...documentData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.documents.push(newDocument);
        this.saveDocuments();
        this.updateDocumentStats();
        
        console.log('✅ Documento creado:', newDocument.id);
        return newDocument;
    }
    
    // Leer documento por ID
    getDocument(id) {
        return this.documents.find(doc => doc.id === id);
    }
    
    // Obtener todos los documentos con filtros
    getDocuments(filters = {}) {
        let filteredDocs = [...this.documents];
        
        if (filters.status) {
            filteredDocs = filteredDocs.filter(doc => doc.status === filters.status);
        }
        
        if (filters.urgency) {
            filteredDocs = filteredDocs.filter(doc => doc.urgency === filters.urgency);
        }
        
        if (filters.type) {
            filteredDocs = filteredDocs.filter(doc => doc.type === filters.type);
        }
        
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filteredDocs = filteredDocs.filter(doc => 
                doc.id.toLowerCase().includes(searchLower) ||
                doc.emitter.toLowerCase().includes(searchLower) ||
                doc.purpose.toLowerCase().includes(searchLower)
            );
        }
        
        return filteredDocs;
    }
    
    // Actualizar documento
    updateDocument(id, updateData) {
        const docIndex = this.documents.findIndex(doc => doc.id === id);
        if (docIndex === -1) {
            throw new Error('Documento no encontrado');
        }
        
        this.documents[docIndex] = {
            ...this.documents[docIndex],
            ...updateData,
            updatedAt: new Date().toISOString()
        };
        
        this.saveDocuments();
        this.updateDocumentStats();
        
        console.log('✅ Documento actualizado:', id);
        return this.documents[docIndex];
    }
    
    // Eliminar documento
    deleteDocument(id) {
        const docIndex = this.documents.findIndex(doc => doc.id === id);
        if (docIndex === -1) {
            throw new Error('Documento no encontrado');
        }
        
        const deletedDoc = this.documents.splice(docIndex, 1)[0];
        this.saveDocuments();
        this.updateDocumentStats();
        
        console.log('🗑️ Documento eliminado:', id);
        return deletedDoc;
    }
    
    // Calificar documento
    qualifyDocument(id, qualificationData) {
        const doc = this.getDocument(id);
        if (!doc) {
            throw new Error('Documento no encontrado');
        }
        
        const qualification = {
            ...qualificationData,
            qualifiedBy: this.getCurrentUser(),
            qualifiedAt: new Date().toISOString()
        };
        
        return this.updateDocument(id, {
            status: qualificationData.decision,
            qualification: qualification
        });
    }
    
    // ==================== MÉTODOS DE UTILIDAD ====================
    
    generateDocumentId() {
        const prefix = 'DOC';
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
        return `${prefix}-${timestamp}${random}`;
    }
    
    getCurrentUser() {
        try {
            const session = JSON.parse(localStorage.getItem('aduanasAdminSession') || '{}');
            return session.user?.id || 'SYSTEM';
        } catch {
            return 'SYSTEM';
        }
    }
    
    updateDocumentStats() {
        const stats = {
            total: this.documents.length,
            pending: this.documents.filter(d => d.status === 'pendiente').length,
            qualified: this.documents.filter(d => d.status === 'calificado' || d.status === 'aprobado').length,
            urgent: this.documents.filter(d => d.urgency === 'critica' || d.urgency === 'alta').length
        };
        
        // Actualizar UI
        const totalEl = document.getElementById('totalDocuments');
        const pendingEl = document.getElementById('pendingDocuments');
        const qualifiedEl = document.getElementById('qualifiedDocuments');
        const urgentEl = document.getElementById('urgentDocuments');
        
        if (totalEl) totalEl.textContent = stats.total;
        if (pendingEl) pendingEl.textContent = stats.pending;
        if (qualifiedEl) qualifiedEl.textContent = stats.qualified;
        if (urgentEl) urgentEl.textContent = stats.urgent;
    }
    
    // ==================== MÉTODOS DE INTERFAZ ====================
    
    loadDocumentsList() {
        const tbody = document.getElementById('adminDocumentsTableBody');
        if (!tbody) return;
        
        const filters = this.getActiveFilters();
        const filteredDocs = this.getDocuments(filters);
        
        // Paginación
        const startIndex = (this.currentPage - 1) * this.documentsPerPage;
        const endIndex = startIndex + this.documentsPerPage;
        const paginatedDocs = filteredDocs.slice(startIndex, endIndex);
        
        tbody.innerHTML = '';
        
        if (paginatedDocs.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="10" class="no-data">
                        <i class="fas fa-inbox"></i>
                        <p>No hay documentos que mostrar</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        paginatedDocs.forEach(doc => {
            const row = this.createDocumentRow(doc);
            tbody.appendChild(row);
        });
        
        this.updatePaginationInfo(filteredDocs.length);
    }
    
    createDocumentRow(doc) {
        const row = document.createElement('tr');
        
        const urgencyClass = {
            'critica': 'urgency-critical',
            'alta': 'urgency-high',
            'media': 'urgency-medium',
            'normal': 'urgency-normal'
        }[doc.urgency] || 'urgency-normal';
        
        const statusClass = {
            'pendiente': 'status-pending',
            'en-revision': 'status-review',
            'calificado': 'status-qualified',
            'aprobado': 'status-approved',
            'rechazado': 'status-rejected',
            'solicita-info': 'status-info',
            'suspendido': 'status-suspended'
        }[doc.status] || 'status-pending';
        
        row.innerHTML = `
            <td>
                <input type="checkbox" class="doc-checkbox" value="${doc.id}">
            </td>
            <td><strong>${doc.id}</strong></td>
            <td>${this.formatDocumentType(doc.type)}</td>
            <td>${doc.emitter}</td>
            <td class="purpose-cell" title="${doc.purpose}">
                ${doc.purpose.length > 50 ? doc.purpose.substring(0, 50) + '...' : doc.purpose}
            </td>
            <td><span class="urgency-badge ${urgencyClass}">${this.formatUrgency(doc.urgency)}</span></td>
            <td><span class="status-badge ${statusClass}">${this.formatStatus(doc.status)}</span></td>
            <td>${doc.qualification ? this.formatQualification(doc.qualification) : '-'}</td>
            <td>${this.formatDate(doc.createdAt)}</td>
            <td class="actions-cell">
                <button onclick="viewDocument('${doc.id}')" class="btn-icon" title="Ver Detalles">
                    <i class="fas fa-eye"></i>
                </button>
                <button onclick="editDocument('${doc.id}')" class="btn-icon" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="qualifyDocument('${doc.id}')" class="btn-icon" title="Calificar" 
                        ${doc.status === 'calificado' || doc.status === 'aprobado' ? 'disabled' : ''}>
                    <i class="fas fa-check"></i>
                </button>
                <button onclick="deleteDocument('${doc.id}')" class="btn-icon btn-danger" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        return row;
    }
    
    getActiveFilters() {
        const search = document.getElementById('adminDocumentSearch')?.value || '';
        const status = document.getElementById('adminDocumentStatus')?.value || '';
        const urgency = document.getElementById('adminDocumentUrgency')?.value || '';
        const type = document.getElementById('adminDocumentType')?.value || '';
        
        return { search, status, urgency, type };
    }
    
    filterDocuments() {
        this.currentPage = 1;
        this.loadDocumentsList();
    }
    
    // ==================== MÉTODOS DE FORMATEO ====================
    
    formatDocumentType(type) {
        const types = {
            'importacion': 'Importación',
            'exportacion': 'Exportación',
            'transito': 'Tránsito',
            'certificacion': 'Certificación',
            'permiso': 'Permiso Especial'
        };
        return types[type] || type;
    }
    
    formatUrgency(urgency) {
        const urgencies = {
            'critica': 'Crítica',
            'alta': 'Alta',
            'media': 'Media',
            'normal': 'Normal'
        };
        return urgencies[urgency] || urgency;
    }
    
    formatStatus(status) {
        const statuses = {
            'pendiente': 'Pendiente',
            'en-revision': 'En Revisión',
            'calificado': 'Calificado',
            'aprobado': 'Aprobado',
            'rechazado': 'Rechazado',
            'solicita-info': 'Solicita Info',
            'suspendido': 'Suspendido'
        };
        return statuses[status] || status;
    }
    
    formatQualification(qualification) {
        if (!qualification) return '-';
        
        let result = `<div class="qualification-info">`;
        if (qualification.score) {
            result += `<span class="score">${qualification.score}/10</span>`;
        }
        result += `<small>${qualification.qualifiedBy}</small>`;
        result += `</div>`;
        
        return result;
    }
    
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
    
    // ==================== PAGINACIÓN ====================
    
    updatePaginationInfo(totalItems) {
        const totalPages = Math.ceil(totalItems / this.documentsPerPage);
        
        const countEl = document.getElementById('documentsCount');
        const pageInfoEl = document.getElementById('documentsPageInfo');
        const prevBtn = document.getElementById('prevDocsBtn');
        const nextBtn = document.getElementById('nextDocsBtn');
        
        if (countEl) {
            countEl.textContent = `${totalItems} documento${totalItems !== 1 ? 's' : ''}`;
        }
        
        if (pageInfoEl) {
            pageInfoEl.textContent = `Página ${this.currentPage} de ${totalPages}`;
        }
        
        if (prevBtn) {
            prevBtn.disabled = this.currentPage <= 1;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentPage >= totalPages;
        }
    }
    
    // ==================== PERSISTENCIA ====================
    
    loadDocuments() {
        try {
            const saved = localStorage.getItem('aduanasDocuments');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error al cargar documentos:', error);
            return [];
        }
    }
    
    saveDocuments() {
        try {
            localStorage.setItem('aduanasDocuments', JSON.stringify(this.documents));
        } catch (error) {
            console.error('Error al guardar documentos:', error);
        }
    }
}

// Funciones globales
window.clearDocumentForm = function() {
    document.getElementById('documentForm').reset();
    document.getElementById('filesPreview').innerHTML = '';
};

window.removeFile = function(index) {
    const fileInput = document.getElementById('documentFiles');
    const dt = new DataTransfer();
    const files = Array.from(fileInput.files);
    
    files.forEach((file, i) => {
        if (i !== index) {
            dt.items.add(file);
        }
    });
    
    fileInput.files = dt.files;
    
    if (window.documentManagement) {
        window.documentManagement.handleFiles(dt.files);
    }
};

window.viewDocumentDetails = function(documentId) {
    if (window.documentManagement) {
        const document = window.documentManagement.getDocumentById(documentId);
        if (document) {
            const details = `
Detalles del documento:

ID: ${document.documentId}
Tipo: ${window.documentManagement.getDocumentTypeName(document.documentType)}
Emisor: ${document.documentIssuer}
Propósito: ${window.documentManagement.getPurposeName(document.calificationPurpose)}
Estado: ${window.documentManagement.getStatusText(document.status)}
Urgencia: ${window.documentManagement.getUrgencyName(document.urgencyLevel)}
Fecha de envío: ${new Date(document.submissionDate).toLocaleDateString('es-ES')}
Fecha estimada: ${new Date(document.estimatedDate).toLocaleDateString('es-ES')}
Archivos: ${document.files.length}
            `;
            alert(details);
        }
    }
};

window.downloadDocument = function(documentId) {
    alert(`Funcionalidad de descarga en desarrollo para documento: ${documentId}`);
};

window.cancelDocument = function(documentId) {
    if (confirm('¿Está seguro de que desea cancelar este documento?')) {
        if (window.documentManagement) {
            const success = window.documentManagement.deleteDocumentById(documentId);
            if (success) {
                alert('Documento cancelado exitosamente');
            } else {
                alert('Error al cancelar el documento');
            }
        }
    }
};

// ==================== FUNCIONES GLOBALES PARA LA INTERFAZ ====================

// Instancia global del sistema de documentos
let documentManagement = null;

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('adminDocumentsTableBody')) {
        documentManagement = new DocumentManagement();
        console.log('✅ Sistema de documentos inicializado');
    }
});

// ==================== FUNCIONES DE MODAL ====================

function openNewDocumentModal() {
    console.log('📝 Abriendo modal de nuevo documento');
    const modal = document.getElementById('documentModal');
    const title = document.getElementById('documentModalTitle');
    const form = document.getElementById('documentForm');
    
    if (modal && title && form) {
        title.textContent = 'Nuevo Documento';
        form.reset();
        document.getElementById('docId').value = '';
        modal.style.display = 'block';
        documentManagement.currentEditingDoc = null;
    }
}

function editDocument(id) {
    console.log('✏️ Editando documento:', id);
    const doc = documentManagement.getDocument(id);
    if (!doc) {
        alert('Documento no encontrado');
        return;
    }
    
    const modal = document.getElementById('documentModal');
    const title = document.getElementById('documentModalTitle');
    
    if (modal && title) {
        title.textContent = 'Editar Documento';
        
        // Llenar el formulario con los datos del documento
        document.getElementById('docType').value = doc.type;
        document.getElementById('docEmitter').value = doc.emitter;
        document.getElementById('docPurpose').value = doc.purpose;
        document.getElementById('docUrgency').value = doc.urgency;
        document.getElementById('docStatus').value = doc.status;
        document.getElementById('docValue').value = doc.value || '';
        document.getElementById('docCurrency').value = doc.currency || 'CLP';
        document.getElementById('docObservations').value = doc.observations || '';
        document.getElementById('docId').value = doc.id;
        
        documentManagement.currentEditingDoc = doc;
        modal.style.display = 'block';
    }
}

function viewDocument(id) {
    console.log('👁️ Viendo documento:', id);
    const doc = documentManagement.getDocument(id);
    if (!doc) {
        alert('Documento no encontrado');
        return;
    }
    
    const modal = document.getElementById('viewDocumentModal');
    const details = document.getElementById('documentDetails');
    
    if (modal && details) {
        details.innerHTML = generateDocumentDetailsHTML(doc);
        
        // Configurar botones según el estado
        const editBtn = document.getElementById('editDocBtn');
        const qualifyBtn = document.getElementById('qualifyDocBtn');
        
        if (editBtn) editBtn.onclick = () => { closeViewDocumentModal(); editDocument(id); };
        if (qualifyBtn) {
            qualifyBtn.onclick = () => { closeViewDocumentModal(); qualifyDocument(id); };
            qualifyBtn.style.display = (doc.status === 'calificado' || doc.status === 'aprobado') ? 'none' : 'inline-block';
        }
        
        modal.style.display = 'block';
    }
}

function qualifyDocument(id) {
    console.log('✅ Calificando documento:', id);
    const doc = documentManagement.getDocument(id);
    if (!doc) {
        alert('Documento no encontrado');
        return;
    }
    
    const modal = document.getElementById('qualifyModal');
    const info = document.getElementById('qualifyDocumentInfo');
    const form = document.getElementById('qualifyForm');
    
    if (modal && info && form) {
        info.innerHTML = generateDocumentInfoHTML(doc);
        form.reset();
        document.getElementById('qualifyDocId').value = doc.id;
        modal.style.display = 'block';
    }
}

function deleteDocument(id) {
    console.log('🗑️ Iniciando eliminación de documento:', id);
    const doc = documentManagement.getDocument(id);
    if (!doc) {
        alert('Documento no encontrado');
        return;
    }
    
    const modal = document.getElementById('deleteConfirmModal');
    const info = document.getElementById('deleteDocumentInfo');
    
    if (modal && info) {
        info.innerHTML = generateDocumentInfoHTML(doc);
        modal.style.display = 'block';
        
        // Configurar el botón de confirmación
        window.documentToDelete = id;
    }
}

// ==================== FUNCIONES DE GUARDADO Y ACCIONES ====================

function saveDocument() {
    console.log('💾 Guardando documento');
    const form = document.getElementById('documentForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const formData = new FormData(form);
    const documentData = {};
    
    for (let [key, value] of formData.entries()) {
        documentData[key] = value;
    }
    
    try {
        const docId = document.getElementById('docId').value;
        
        if (docId) {
            // Editar documento existente
            documentManagement.updateDocument(docId, documentData);
            AduanasSystem.showNotification('Documento actualizado correctamente', 'success');
        } else {
            // Crear nuevo documento
            documentManagement.createDocument(documentData);
            AduanasSystem.showNotification('Documento creado correctamente', 'success');
        }
        
        closeDocumentModal();
        documentManagement.loadDocumentsList();
        
    } catch (error) {
        console.error('Error al guardar documento:', error);
        AduanasSystem.showNotification('Error al guardar el documento', 'error');
    }
}

function submitQualification() {
    console.log('✅ Enviando calificación');
    const form = document.getElementById('qualifyForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const formData = new FormData(form);
    const qualificationData = {};
    
    for (let [key, value] of formData.entries()) {
        qualificationData[key] = value;
    }
    
    try {
        const docId = document.getElementById('qualifyDocId').value;
        documentManagement.qualifyDocument(docId, qualificationData);
        
        AduanasSystem.showNotification('Documento calificado correctamente', 'success');
        closeQualifyModal();
        documentManagement.loadDocumentsList();
        
    } catch (error) {
        console.error('Error al calificar documento:', error);
        AduanasSystem.showNotification('Error al calificar el documento', 'error');
    }
}

function confirmDeleteDocument() {
    console.log('🗑️ Confirmando eliminación');
    try {
        const id = window.documentToDelete;
        documentManagement.deleteDocument(id);
        
        AduanasSystem.showNotification('Documento eliminado correctamente', 'success');
        closeDeleteConfirmModal();
        documentManagement.loadDocumentsList();
        
    } catch (error) {
        console.error('Error al eliminar documento:', error);
        AduanasSystem.showNotification('Error al eliminar el documento', 'error');
    }
}

// ==================== FUNCIONES DE MODAL - CERRAR ====================

function closeDocumentModal() {
    const modal = document.getElementById('documentModal');
    if (modal) modal.style.display = 'none';
}

function closeQualifyModal() {
    const modal = document.getElementById('qualifyModal');
    if (modal) modal.style.display = 'none';
}

function closeViewDocumentModal() {
    const modal = document.getElementById('viewDocumentModal');
    if (modal) modal.style.display = 'none';
}

function closeDeleteConfirmModal() {
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) modal.style.display = 'none';
}

// ==================== FUNCIONES DE UTILIDAD ====================

function handleDecisionChange() {
    const decision = document.getElementById('qualifyDecision').value;
    const scoreGroup = document.getElementById('qualifyScoreGroup');
    const nextStepsGroup = document.getElementById('nextStepsGroup');
    
    if (decision === 'aprobado') {
        scoreGroup.style.display = 'block';
    } else {
        scoreGroup.style.display = 'none';
    }
    
    if (decision === 'solicita-info' || decision === 'rechazado') {
        nextStepsGroup.style.display = 'block';
    } else {
        nextStepsGroup.style.display = 'none';
    }
}

function generateDocumentDetailsHTML(doc) {
    return `
        <div class="document-header">
            <h4>${doc.id} - ${documentManagement.formatDocumentType(doc.type)}</h4>
            <span class="status-badge ${getStatusClass(doc.status)}">${documentManagement.formatStatus(doc.status)}</span>
        </div>
        
        <div class="document-grid">
            <div class="detail-group">
                <label>Emisor:</label>
                <span>${doc.emitter}</span>
            </div>
            <div class="detail-group">
                <label>Propósito:</label>
                <span>${doc.purpose}</span>
            </div>
            <div class="detail-group">
                <label>Urgencia:</label>
                <span class="urgency-badge ${getUrgencyClass(doc.urgency)}">${documentManagement.formatUrgency(doc.urgency)}</span>
            </div>
            <div class="detail-group">
                <label>Valor:</label>
                <span>${doc.value ? `${doc.value} ${doc.currency}` : 'No especificado'}</span>
            </div>
            <div class="detail-group">
                <label>Creado:</label>
                <span>${documentManagement.formatDate(doc.createdAt)}</span>
            </div>
            <div class="detail-group">
                <label>Última actualización:</label>
                <span>${doc.updatedAt ? documentManagement.formatDate(doc.updatedAt) : 'N/A'}</span>
            </div>
        </div>
        
        ${doc.observations ? `
        <div class="detail-group full-width">
            <label>Observaciones:</label>
            <p>${doc.observations}</p>
        </div>
        ` : ''}
        
        ${doc.qualification ? `
        <div class="qualification-details">
            <h5>Detalles de Calificación</h5>
            <div class="detail-group">
                <label>Decisión:</label>
                <span class="status-badge ${getStatusClass(doc.qualification.decision)}">${documentManagement.formatStatus(doc.qualification.decision)}</span>
            </div>
            ${doc.qualification.score ? `
            <div class="detail-group">
                <label>Puntuación:</label>
                <span class="score-display">${doc.qualification.score}/10</span>
            </div>
            ` : ''}
            <div class="detail-group">
                <label>Comentarios:</label>
                <p>${doc.qualification.comments}</p>
            </div>
            <div class="detail-group">
                <label>Calificado por:</label>
                <span>${doc.qualification.qualifiedBy}</span>
            </div>
            <div class="detail-group">
                <label>Fecha de calificación:</label>
                <span>${documentManagement.formatDate(doc.qualification.qualifiedAt)}</span>
            </div>
        </div>
        ` : ''}
    `;
}

function generateDocumentInfoHTML(doc) {
    return `
        <div class="document-summary">
            <strong>${doc.id}</strong> - ${documentManagement.formatDocumentType(doc.type)}<br>
            <small>Emisor: ${doc.emitter}</small><br>
            <small>Estado: ${documentManagement.formatStatus(doc.status)}</small>
        </div>
    `;
}

function getStatusClass(status) {
    const classes = {
        'pendiente': 'status-pending',
        'en-revision': 'status-review',
        'calificado': 'status-qualified',
        'aprobado': 'status-approved',
        'rechazado': 'status-rejected',
        'solicita-info': 'status-info',
        'suspendido': 'status-suspended'
    };
    return classes[status] || 'status-pending';
}

function getUrgencyClass(urgency) {
    const classes = {
        'critica': 'urgency-critical',
        'alta': 'urgency-high',
        'media': 'urgency-medium',
        'normal': 'urgency-normal'
    };
    return classes[urgency] || 'urgency-normal';
}

// ==================== FUNCIONES DE CONTROL ====================

function refreshDocumentsList() {
    console.log('🔄 Actualizando lista de documentos');
    if (documentManagement) {
        documentManagement.loadDocumentsList();
        AduanasSystem.showNotification('Lista actualizada', 'success');
    }
}

function previousDocumentsPage() {
    if (documentManagement && documentManagement.currentPage > 1) {
        documentManagement.currentPage--;
        documentManagement.loadDocumentsList();
    }
}

function nextDocumentsPage() {
    if (documentManagement) {
        const filters = documentManagement.getActiveFilters();
        const filteredDocs = documentManagement.getDocuments(filters);
        const totalPages = Math.ceil(filteredDocs.length / documentManagement.documentsPerPage);
        
        if (documentManagement.currentPage < totalPages) {
            documentManagement.currentPage++;
            documentManagement.loadDocumentsList();
        }
    }
}

function toggleSelectAllDocuments() {
    const selectAll = document.getElementById('selectAllDocuments');
    const checkboxes = document.querySelectorAll('.doc-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
    });
}

function bulkQualifyDocuments() {
    const selectedDocs = Array.from(document.querySelectorAll('.doc-checkbox:checked')).map(cb => cb.value);
    
    if (selectedDocs.length === 0) {
        AduanasSystem.showNotification('Seleccione al menos un documento', 'warning');
        return;
    }
    
    // Implementar calificación masiva
    console.log('📋 Calificación masiva para:', selectedDocs);
    AduanasSystem.showNotification('Función de calificación masiva en desarrollo', 'info');
}

function exportDocumentsReport() {
    console.log('📊 Exportando reporte de documentos');
    AduanasSystem.showNotification('Función de exportación en desarrollo', 'info');
}

function editDocumentFromView() {
    // Esta función se configura dinámicamente desde viewDocument()
}

function qualifyDocumentFromView() {
    // Esta función se configura dinámicamente desde viewDocument()
}
