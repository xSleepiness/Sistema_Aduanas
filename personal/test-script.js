/* 
Script de prueba para el Sistema de Aduanas
Copie y pegue este código en la consola del navegador para probar el sistema
*/

console.log('🚀 Iniciando pruebas del sistema de vehículos...');

// Verificar que los sistemas estén inicializados
if (typeof window.vehicleManagement === 'undefined') {
    console.error('❌ VehicleManagement no está inicializado');
} else {
    console.log('✅ VehicleManagement inicializado correctamente');
}

if (typeof window.adminSystem === 'undefined') {
    console.warn('⚠️ AdminSystem no está inicializado (normal en portal ciudadano)');
} else {
    console.log('✅ AdminSystem inicializado correctamente');
}

// Función para crear vehículo de prueba
function crearVehiculoPrueba() {
    const vehiculoTest = {
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
    
    if (window.vehicleManagement) {
        window.vehicleManagement.vehicles.push(vehiculoTest);
        window.vehicleManagement.saveVehicles();
        console.log('✅ Vehículo de prueba creado:', vehiculoTest.plateNumber);
        return vehiculoTest;
    }
    return null;
}

// Función para mostrar estadísticas
function mostrarEstadisticas() {
    if (window.vehicleManagement) {
        const vehiculos = window.vehicleManagement.vehicles;
        console.log('📊 ESTADÍSTICAS DE VEHÍCULOS:');
        console.log('Total:', vehiculos.length);
        console.log('Pendientes:', vehiculos.filter(v => v.status === 'pending').length);
        console.log('Aprobados:', vehiculos.filter(v => v.status === 'approved').length);
        console.log('Rechazados:', vehiculos.filter(v => v.status === 'rejected').length);
        console.log('Vehículos:', vehiculos);
    }
}

// Función para limpiar datos de prueba
function limpiarDatosPrueba() {
    if (window.vehicleManagement) {
        const vehiculosOriginales = window.vehicleManagement.vehicles.filter(v => !v.plateNumber.includes('TEST'));
        window.vehicleManagement.vehicles = vehiculosOriginales;
        window.vehicleManagement.saveVehicles();
        console.log('🧹 Datos de prueba eliminados');
    }
}

// Ejecutar pruebas básicas
console.log('\n🧪 EJECUTANDO PRUEBAS:');
mostrarEstadisticas();

// Crear vehículo de prueba
const vehiculoPrueba = crearVehiculoPrueba();
if (vehiculoPrueba) {
    console.log('\n📋 Vehículo de prueba creado:');
    console.log('- Patente:', vehiculoPrueba.plateNumber);
    console.log('- Estado:', vehiculoPrueba.status);
    console.log('- ID:', vehiculoPrueba.vehicleId);
}

// Mostrar estadísticas actualizadas
console.log('\n📊 Estadísticas después de la prueba:');
mostrarEstadisticas();

// Instrucciones
console.log('\n📋 COMANDOS DISPONIBLES:');
console.log('- crearVehiculoPrueba() - Crear un vehículo de prueba');
console.log('- mostrarEstadisticas() - Mostrar estadísticas actuales');
console.log('- limpiarDatosPrueba() - Eliminar vehículos de prueba');
console.log('- testVehicleSystem() - Función de prueba completa');
console.log('- forceVehicleRefresh() - Forzar actualización de listas');

// Hacer funciones disponibles globalmente
window.crearVehiculoPrueba = crearVehiculoPrueba;
window.mostrarEstadisticas = mostrarEstadisticas;
window.limpiarDatosPrueba = limpiarDatosPrueba;

console.log('\n✅ Pruebas completadas. Use los comandos anteriores para interactuar con el sistema.');
