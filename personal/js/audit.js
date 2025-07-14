// Sistema de Auditoría y Registro de Accesos
class AuditSystem {
    constructor() {
        this.accessLogs = [];
        this.actionLogs = [];
        this.init();
    }
    
    init() {
        this.loadStoredLogs();
        this.registerPageAccess();
        console.log('🔍 Sistema de Auditoría inicializado');
    }
    
    // Cargar logs existentes del localStorage
    loadStoredLogs() {
        try {
            this.accessLogs = JSON.parse(localStorage.getItem('aduanasAccessLogs') || '[]');
            this.actionLogs = JSON.parse(localStorage.getItem('aduanasActionLogs') || '[]');
            console.log(`📊 Logs cargados: ${this.accessLogs.length} accesos, ${this.actionLogs.length} acciones`);
        } catch (error) {
            console.error('❌ Error al cargar logs:', error);
            this.accessLogs = [];
            this.actionLogs = [];
        }
    }
    
    // Registrar acceso a página/portal
    registerPageAccess(portal = 'unknown') {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Determinar el tipo de portal basado en la URL
        if (currentPage.includes('admin-portal')) {
            portal = 'Portal Administrativo';
        } else if (currentPage.includes('citizen-portal')) {
            portal = 'Portal Ciudadano';
        } else if (currentPage.includes('index')) {
            portal = 'Página Principal';
        }
        
        const accessRecord = {
            id: this.generateUniqueId(),
            timestamp: new Date().toISOString(),
            portal: portal,
            page: currentPage,
            userAgent: navigator.userAgent,
            ip: 'localhost', // En producción se obtendría del servidor
            sessionId: this.getOrCreateSessionId(),
            user: this.getCurrentUser()
        };
        
        this.accessLogs.push(accessRecord);
        this.saveAccessLogs();
        
        console.log('🔍 Acceso registrado:', accessRecord);
        return accessRecord;
    }
    
    // Registrar login de usuario
    registerLogin(userId, userName, department, role, success = true) {
        const loginRecord = {
            id: this.generateUniqueId(),
            timestamp: new Date().toISOString(),
            action: success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILED',
            userId: userId,
            userName: userName,
            department: department,
            role: role,
            ip: 'localhost',
            userAgent: navigator.userAgent,
            sessionId: this.getOrCreateSessionId()
        };
        
        this.actionLogs.push(loginRecord);
        this.saveActionLogs();
        
        // Registrar en el sistema de accesos también
        if (success) {
            this.registerPageAccess('Login Exitoso');
        }
        
        console.log(`🔐 Login ${success ? 'exitoso' : 'fallido'} registrado:`, loginRecord);
        return loginRecord;
    }
    
    // Registrar logout de usuario
    registerLogout(userId, userName) {
        const logoutRecord = {
            id: this.generateUniqueId(),
            timestamp: new Date().toISOString(),
            action: 'LOGOUT',
            userId: userId,
            userName: userName,
            sessionId: this.getOrCreateSessionId()
        };
        
        this.actionLogs.push(logoutRecord);
        this.saveActionLogs();
        
        console.log('🔐 Logout registrado:', logoutRecord);
        return logoutRecord;
    }
    
    // Registrar acción administrativa (CRUD)
    registerAdminAction(action, target, details, userId, userName) {
        const actionRecord = {
            id: this.generateUniqueId(),
            timestamp: new Date().toISOString(),
            action: action, // CREATE, READ, UPDATE, DELETE, APPROVE, REJECT
            target: target, // APPOINTMENT, VEHICLE, DOCUMENT, etc.
            details: details,
            userId: userId,
            userName: userName,
            sessionId: this.getOrCreateSessionId()
        };
        
        this.actionLogs.push(actionRecord);
        this.saveActionLogs();
        
        console.log('⚡ Acción administrativa registrada:', actionRecord);
        return actionRecord;
    }
    
    // Obtener estadísticas de accesos
    getAccessStats(days = 7) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        const recentAccesses = this.accessLogs.filter(log => 
            new Date(log.timestamp) >= cutoffDate
        );
        
        const stats = {
            totalAccesses: recentAccesses.length,
            uniqueUsers: new Set(recentAccesses.map(log => log.user?.userId).filter(Boolean)).size,
            portalStats: {},
            hourlyStats: {},
            userStats: {}
        };
        
        // Estadísticas por portal
        recentAccesses.forEach(log => {
            const portal = log.portal || 'Unknown';
            stats.portalStats[portal] = (stats.portalStats[portal] || 0) + 1;
            
            // Estadísticas por hora
            const hour = new Date(log.timestamp).getHours();
            stats.hourlyStats[hour] = (stats.hourlyStats[hour] || 0) + 1;
            
            // Estadísticas por usuario
            const userId = log.user?.userId || 'Anónimo';
            if (!stats.userStats[userId]) {
                stats.userStats[userId] = {
                    userId: userId,
                    userName: log.user?.userName || 'Usuario Anónimo',
                    accesses: 0,
                    lastAccess: log.timestamp
                };
            }
            stats.userStats[userId].accesses++;
            if (new Date(log.timestamp) > new Date(stats.userStats[userId].lastAccess)) {
                stats.userStats[userId].lastAccess = log.timestamp;
            }
        });
        
        return stats;
    }
    
    // Obtener logs de acceso recientes
    getRecentAccesses(limit = 50) {
        return this.accessLogs
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit);
    }
    
    // Obtener logs de acciones recientes
    getRecentActions(limit = 50) {
        return this.actionLogs
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit);
    }
    
    // Exportar logs de auditoría
    exportAuditLogs(format = 'json') {
        const auditData = {
            exportedAt: new Date().toISOString(),
            exportedBy: this.getCurrentUser(),
            accessLogs: this.accessLogs,
            actionLogs: this.actionLogs,
            stats: this.getAccessStats(30) // Estadísticas de 30 días
        };
        
        if (format === 'csv') {
            return this.convertToCSV(auditData);
        }
        
        return JSON.stringify(auditData, null, 2);
    }
    
    // Convertir a CSV (para exportación)
    convertToCSV(data) {
        let csv = 'LOGS DE ACCESO\n';
        csv += 'Timestamp,Portal,Usuario,IP,Página\n';
        
        data.accessLogs.forEach(log => {
            csv += `${log.timestamp},${log.portal},${log.user?.userName || 'Anónimo'},${log.ip},${log.page}\n`;
        });
        
        csv += '\nLOGS DE ACCIONES\n';
        csv += 'Timestamp,Acción,Objetivo,Usuario,Detalles\n';
        
        data.actionLogs.forEach(log => {
            csv += `${log.timestamp},${log.action},${log.target || ''},${log.userName || 'Unknown'},${JSON.stringify(log.details || {})}\n`;
        });
        
        return csv;
    }
    
    // Utilidades privadas
    generateUniqueId() {
        return 'audit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    getOrCreateSessionId() {
        let sessionId = sessionStorage.getItem('auditSessionId');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('auditSessionId', sessionId);
        }
        return sessionId;
    }
    
    getCurrentUser() {
        // Intentar obtener usuario de diferentes fuentes
        if (window.adminSystem?.currentUser) {
            return {
                userId: window.adminSystem.currentUser.id,
                userName: window.adminSystem.currentUser.name,
                role: window.adminSystem.currentUser.role,
                department: window.adminSystem.currentUser.department
            };
        }
        
        // Revisar sessionStorage para sesión activa
        const sessionData = JSON.parse(sessionStorage.getItem('adminSession') || '{}');
        if (sessionData.user) {
            return {
                userId: sessionData.user.id,
                userName: sessionData.user.name,
                role: sessionData.user.role,
                department: sessionData.user.department
            };
        }
        
        return null; // Usuario anónimo
    }
    
    saveAccessLogs() {
        try {
            localStorage.setItem('aduanasAccessLogs', JSON.stringify(this.accessLogs));
        } catch (error) {
            console.error('❌ Error al guardar logs de acceso:', error);
        }
    }
    
    saveActionLogs() {
        try {
            localStorage.setItem('aduanasActionLogs', JSON.stringify(this.actionLogs));
        } catch (error) {
            console.error('❌ Error al guardar logs de acciones:', error);
        }
    }
    
    // Limpiar logs antiguos (opcional, para mantener performance)
    cleanOldLogs(daysToKeep = 90) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
        
        const originalAccessCount = this.accessLogs.length;
        const originalActionCount = this.actionLogs.length;
        
        this.accessLogs = this.accessLogs.filter(log => 
            new Date(log.timestamp) >= cutoffDate
        );
        
        this.actionLogs = this.actionLogs.filter(log => 
            new Date(log.timestamp) >= cutoffDate
        );
        
        this.saveAccessLogs();
        this.saveActionLogs();
        
        console.log(`🧹 Logs limpiados: ${originalAccessCount - this.accessLogs.length} accesos, ${originalActionCount - this.actionLogs.length} acciones eliminadas`);
    }
}

// Funciones globales para el panel de administración
window.showAuditDashboard = function() {
    if (!window.auditSystem) {
        alert('Sistema de auditoría no disponible');
        return;
    }
    
    const stats = window.auditSystem.getAccessStats(7);
    const recentAccesses = window.auditSystem.getRecentAccesses(10);
    const recentActions = window.auditSystem.getRecentActions(10);
    
    let report = '📊 DASHBOARD DE AUDITORÍA (Últimos 7 días)\n';
    report += '='.repeat(50) + '\n\n';
    
    report += `👥 Total de accesos: ${stats.totalAccesses}\n`;
    report += `🔑 Usuarios únicos: ${stats.uniqueUsers}\n\n`;
    
    report += '📍 ACCESOS POR PORTAL:\n';
    Object.entries(stats.portalStats).forEach(([portal, count]) => {
        report += `  • ${portal}: ${count} accesos\n`;
    });
    
    report += '\n⏰ ACCESOS POR HORA:\n';
    Object.entries(stats.hourlyStats)
        .sort(([a], [b]) => parseInt(a) - parseInt(b))
        .forEach(([hour, count]) => {
            report += `  • ${hour}:00 - ${count} accesos\n`;
        });
    
    report += '\n👤 ÚLTIMOS ACCESOS:\n';
    recentAccesses.slice(0, 5).forEach((access, index) => {
        const date = new Date(access.timestamp).toLocaleString('es-ES');
        const user = access.user?.userName || 'Anónimo';
        report += `  ${index + 1}. ${user} - ${access.portal} - ${date}\n`;
    });
    
    report += '\n⚡ ÚLTIMAS ACCIONES:\n';
    recentActions.slice(0, 5).forEach((action, index) => {
        const date = new Date(action.timestamp).toLocaleString('es-ES');
        report += `  ${index + 1}. ${action.userName || 'Unknown'} - ${action.action} - ${date}\n`;
    });
    
    console.log(report);
    alert(report);
};

window.exportFullAuditReport = function() {
    if (!window.auditSystem) {
        alert('Sistema de auditoría no disponible');
        return;
    }
    
    const jsonReport = window.auditSystem.exportAuditLogs('json');
    const csvReport = window.auditSystem.exportAuditLogs('csv');
    
    console.log('📊 REPORTE COMPLETO DE AUDITORÍA (JSON):', jsonReport);
    console.log('📊 REPORTE COMPLETO DE AUDITORÍA (CSV):', csvReport);
    
    // Simular descarga (en producción se descargaría el archivo)
    alert('Reporte de auditoría completo generado. Ver consola para detalles.');
};

// Inicializar sistema de auditoría cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    if (!window.auditSystem) {
        window.auditSystem = new AuditSystem();
        console.log('🔍 Sistema de Auditoría Global inicializado');
    }
});

// También inicializar inmediatamente si el DOM ya está cargado
if (document.readyState === 'loading') {
    // El DOM aún se está cargando
} else {
    // El DOM ya está listo
    if (!window.auditSystem) {
        window.auditSystem = new AuditSystem();
        console.log('🔍 Sistema de Auditoría Global inicializado inmediatamente');
    }
}
