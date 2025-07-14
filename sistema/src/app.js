const ctx = document.getElementById('serviceStatusChart').getContext('2d');

// Mock data for Aduana service statuses
const serviceData = [
    { service: 'Importaciones', status: 'Operativo' },
    { service: 'Exportaciones', status: 'Mantenimiento' },
    { service: 'Trámites', status: 'Operativo' },
    { service: 'Aduana Electrónica', status: 'Operativo' },
    { service: 'Consulta de Devoluciones', status: 'No Operativo' },
];

// Prepare data for the chart
const labels = serviceData.map(data => data.service);
const statuses = serviceData.map(data => {
    switch (data.status) {
        case 'Operativo':
            return 1;
        case 'Mantenimiento':
            return 0.5;
        case 'No Operativo':
            return 0;
        default:
            return 0;
    }
});

// Create the chart
const serviceStatusChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [{
            label: 'Estado de Servicios',
            data: statuses,
            backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 99, 132, 0.6)',
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return value === 1 ? 'Operativo' : value === 0.5 ? 'Mantenimiento' : 'No Operativo';
                    }
                }
            }
        }
    }
});