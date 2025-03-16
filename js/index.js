// Refactored time calculation for the Solar Time application
class SolarTimeApp {
  constructor() {
    this.initializeApp();
  }

  initializeApp() {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('Solartime app initialized');
      this.initializeTimeDisplays();
      this.startTimeUpdates();
    });
  }

  initializeTimeDisplays() {
    this.solarTimeDisplay = document.getElementById('solar-time');
    this.longitudinalTimeDisplay = document.getElementById('longitudinal-time');
    this.localTimeDisplay = document.getElementById('local-time');
    this.utcTimeDisplay = document.getElementById('utc-time');
  }

  startTimeUpdates() {
    // Update immediately and then every second
    this.updateLocalAndUtcTime();
    this.getTimeAndLocation();
    
    setInterval(() => {
      this.updateLocalAndUtcTime();
      this.getTimeAndLocation();
    }, 1000);
  }

  updateLocalAndUtcTime() {
    const now = new Date();
    
    // Update Local Time
    this.localTimeDisplay.textContent = this.formatTime(now);
    
    // Update UTC Time
    this.utcTimeDisplay.textContent = this.formatUtcTime(now);
  }

  formatTime(date) {
    return date.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  formatUtcTime(date) {
    return date.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC' });
  }
  
  formatTimeDelta(hours) {
    // Convert hours to hours, minutes, seconds
    const sign = hours < 0 ? '-' : '+';
    const absHours = Math.abs(hours);
    
    const wholeHours = Math.floor(absHours);
    const minutesFraction = (absHours - wholeHours) * 60;
    const wholeMinutes = Math.floor(minutesFraction);
    const secondsFraction = (minutesFraction - wholeMinutes) * 60;
    const wholeSeconds = Math.floor(secondsFraction);
    
    // Format with leading zeros
    const formattedHours = String(wholeHours).padStart(2, '0');
    const formattedMinutes = String(wholeMinutes).padStart(2, '0');
    const formattedSeconds = String(wholeSeconds).padStart(2, '0');
    
    return `${sign}${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  isLeapYear(date) {
    const year = date.getUTCFullYear();
    if ((year & 3) !== 0) {
      return false;
    } else {
      return ((year % 100) !== 0 || (year % 400) === 0);
    }
  }

  getTimeAndLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const now = new Date();
        
        // Calculate longitudinal time offset (renamed from spaze)
        // Longitude divided by 15 gives the time zone offset in hours
        const longitudeOffset = -position.coords.longitude / 15;
        
        // Calculate day of year
        const start = new Date(now.getFullYear(), 0, 0);
        const delta = now.getTime() - start.getTime();
        const oneDay = 1000 * 60 * 60 * 24;
        const dayFraction = delta / oneDay;
        
        // Calculate the equation of time
        let gamma = 0;
        if (this.isLeapYear(now)) {
          gamma = 2 * Math.PI / 366 * (dayFraction - 0.5);
        } else {
          gamma = 2 * Math.PI / 365 * (dayFraction - 0.5);
        }
        
        const eqTime = 229.18 * (0.000075 + 0.001868 * Math.cos(gamma)
          - 0.032077 * Math.sin(gamma)
          - 0.014615 * Math.cos(2 * gamma)
          - 0.040849 * Math.sin(2 * gamma));

        console.log(eqTime, longitudeOffset);

          
        // Calculate solar time
        const utcTimestamp = now.getTime() + now.getTimezoneOffset()*60*1000;
        const solarTime = new Date(utcTimestamp - longitudeOffset * 60000 * 60 + eqTime * 60000);
        this.solarTimeDisplay.textContent = this.formatTime(solarTime);
        
        // Calculate and display longitudinal time as a time delta (offset from UTC)
        const formattedLongitudeOffset = this.formatTimeDelta(-longitudeOffset);
        this.longitudinalTimeDisplay.textContent = formattedLongitudeOffset;
        
        // Also calculate the actual time based on longitude for solar calculations
        const longitudinalTime = new Date(utcTimestamp - longitudeOffset * 60000 * 60);

      }, (error) => {
        console.error('Error getting geolocation:', error);
        this.solarTimeDisplay.textContent = 'Geolocation error';
        this.longitudinalTimeDisplay.textContent = 'Geolocation error';
      });
    } else {
      console.error('No support for geolocation');
      this.solarTimeDisplay.textContent = 'Geolocation not supported';
      this.longitudinalTimeDisplay.textContent = 'Geolocation not supported';
    }
  }
}

// Initialize the app
const app = new SolarTimeApp();