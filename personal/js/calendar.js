class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.currentMonth = this.currentDate.getMonth();
        this.currentYear = this.currentDate.getFullYear();
        
        // Horarios disponibles por defecto (9:00 AM - 4:00 PM)
        this.availableHours = [
            '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
            '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
        ];
        
        // Días no disponibles (sábados y domingos)
        this.unavailableDays = [0, 6]; // 0 = Domingo, 6 = Sábado
        
        // Citas reservadas (simuladas)
        this.bookedSlots = new Map();
        
        this.init();
    }
    
    init() {
        this.generateCalendar();
        this.addEventListeners();
        this.simulateBookedSlots();
    }
    
    generateCalendar() {
        const calendarGrid = document.getElementById('calendarGrid');
        const currentMonthElement = document.getElementById('currentMonth');
        
        // Limpiar el calendario (mantener headers)
        const dayHeaders = calendarGrid.querySelectorAll('.day-header');
        calendarGrid.innerHTML = '';
        dayHeaders.forEach(header => calendarGrid.appendChild(header));
        
        // Actualizar el título del mes
        const monthNames = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        currentMonthElement.textContent = `${monthNames[this.currentMonth]} ${this.currentYear}`;
        
        // Obtener el primer día del mes y el número de días
        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const startDate = firstDay.getDay();
        const daysInMonth = lastDay.getDate();
        
        // Días del mes anterior
        const prevMonth = new Date(this.currentYear, this.currentMonth, 0);
        const daysInPrevMonth = prevMonth.getDate();
        
        for (let i = startDate - 1; i >= 0; i--) {
            const dayElement = this.createDayElement(
                daysInPrevMonth - i, 
                true, 
                new Date(this.currentYear, this.currentMonth - 1, daysInPrevMonth - i)
            );
            calendarGrid.appendChild(dayElement);
        }
        
        // Días del mes actual
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(this.currentYear, this.currentMonth, day);
            const dayElement = this.createDayElement(day, false, date);
            calendarGrid.appendChild(dayElement);
        }
        
        // Días del mes siguiente
        const totalCells = calendarGrid.children.length - 7; // -7 por los headers
        const remainingCells = 42 - totalCells; // 6 semanas * 7 días
        
        for (let day = 1; day <= remainingCells; day++) {
            const dayElement = this.createDayElement(
                day, 
                true, 
                new Date(this.currentYear, this.currentMonth + 1, day)
            );
            calendarGrid.appendChild(dayElement);
        }
    }
    
    createDayElement(day, isOtherMonth, date) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        if (isOtherMonth) {
            dayElement.classList.add('other-month');
        }
        
        // Marcar el día actual
        if (this.isToday(date)) {
            dayElement.classList.add('today');
        }
        
        // Marcar días no disponibles
        if (this.isUnavailable(date)) {
            dayElement.classList.add('unavailable');
            dayElement.style.cursor = 'not-allowed';
        } else if (!isOtherMonth) {
            dayElement.addEventListener('click', () => this.selectDate(date, dayElement));
        }
        
        return dayElement;
    }
    
    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }
    
    isUnavailable(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // No permitir fechas pasadas
        if (date < today) {
            return true;
        }
        
        // No permitir fines de semana
        if (this.unavailableDays.includes(date.getDay())) {
            return true;
        }
        
        return false;
    }
    
    selectDate(date, dayElement) {
        // Remover selección anterior
        const previousSelected = document.querySelector('.calendar-day.selected');
        if (previousSelected) {
            previousSelected.classList.remove('selected');
        }
        
        // Seleccionar nuevo día
        dayElement.classList.add('selected');
        this.setSelectedDate(date);
        
        // Actualizar la fecha seleccionada
        this.updateSelectedDate();
        
        // Cargar horarios disponibles
        this.loadAvailableTimeSlots();
    }
    
    updateSelectedDate() {
        const selectedDateElement = document.getElementById('selectedDate');
        if (this.selectedDate) {
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            selectedDateElement.textContent = this.selectedDate.toLocaleDateString('es-ES', options);
        } else {
            selectedDateElement.textContent = 'Seleccione una fecha del calendario';
        }
    }
    
    loadAvailableTimeSlots() {
        const timeSlotsContainer = document.getElementById('timeSlots');
        timeSlotsContainer.innerHTML = '';
        
        if (!this.selectedDate) return;
        
        const dateKey = this.selectedDate.toDateString();
        const bookedSlotsForDate = this.bookedSlots.get(dateKey) || [];
        
        this.availableHours.forEach(hour => {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.textContent = hour;
            
            if (bookedSlotsForDate.includes(hour)) {
                timeSlot.classList.add('unavailable');
                timeSlot.style.cursor = 'not-allowed';
            } else {
                timeSlot.addEventListener('click', () => this.selectTimeSlot(hour, timeSlot));
            }
            
            timeSlotsContainer.appendChild(timeSlot);
        });
    }
    
    selectTimeSlot(time, timeSlotElement) {
        // Remover selección anterior
        const previousSelected = document.querySelector('.time-slot.selected');
        if (previousSelected) {
            previousSelected.classList.remove('selected');
        }
        
        // Seleccionar nuevo horario
        timeSlotElement.classList.add('selected');
        this.setSelectedTime(time);
        
        // Actualizar resumen de reserva
        this.updateBookingSummary();
    }
    
    updateBookingSummary() {
        const summaryElement = document.getElementById('bookingSummary');
        const summaryDate = document.getElementById('summaryDate');
        const summaryTime = document.getElementById('summaryTime');
        
        if (this.selectedDate && this.selectedTime) {
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            summaryDate.textContent = this.selectedDate.toLocaleDateString('es-ES', options);
            summaryTime.textContent = this.selectedTime;
            summaryElement.style.display = 'block';
        } else {
            summaryElement.style.display = 'none';
        }
    }
    
    addEventListeners() {
        // Navegación del calendario
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.currentMonth--;
            if (this.currentMonth < 0) {
                this.currentMonth = 11;
                this.currentYear--;
            }
            this.generateCalendar();
        });
        
        document.getElementById('nextMonth').addEventListener('click', () => {
            this.currentMonth++;
            if (this.currentMonth > 11) {
                this.currentMonth = 0;
                this.currentYear++;
            }
            this.generateCalendar();
        });
    }
    
    simulateBookedSlots() {
        // Simular algunas citas ya reservadas
        const today = new Date();
        
        // Citas para hoy
        const todayKey = today.toDateString();
        this.bookedSlots.set(todayKey, ['09:00', '10:30', '14:00']);
        
        // Citas para mañana
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        if (!this.isUnavailable(tomorrow)) {
            const tomorrowKey = tomorrow.toDateString();
            this.bookedSlots.set(tomorrowKey, ['11:00', '15:30']);
        }
        
        // Citas para la próxima semana
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        if (!this.isUnavailable(nextWeek)) {
            const nextWeekKey = nextWeek.toDateString();
            this.bookedSlots.set(nextWeekKey, ['09:30', '10:00', '16:00']);
        }
    }
    
    // Métodos para obtener fecha y hora seleccionadas
    getSelectedDate() {
        return this.selectedDate;
    }
    
    getSelectedTime() {
        return this.selectedTime;
    }
    
    // Método para establecer fecha seleccionada
    setSelectedDate(date) {
        this.selectedDate = date;
        console.log('📅 Fecha seleccionada:', date);
    }
    
    // Método para establecer hora seleccionada
    setSelectedTime(time) {
        this.selectedTime = time;
        console.log('⏰ Hora seleccionada:', time);
    }
    
    bookSlot(date, time) {
        const dateKey = date.toDateString();
        const bookedSlots = this.bookedSlots.get(dateKey) || [];
        bookedSlots.push(time);
        this.bookedSlots.set(dateKey, bookedSlots);
        
        // Recargar horarios si es la fecha seleccionada
        if (this.selectedDate && this.selectedDate.toDateString() === dateKey) {
            this.loadAvailableTimeSlots();
        }
    }
}

// Inicializar el calendario cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    window.calendar = new Calendar();
});
