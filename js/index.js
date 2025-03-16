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
    return date.toLocaleTimeString();
  }

  formatUtcTime(date) {
    return date.toUTCString().split(' ')[4];
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
          
        // Calculate solar time
        const utcTime = now.getTime();
        const solarTime = new Date(utcTime - longitudeOffset * 60000 * 60 + eqTime * 60000);
        this.solarTimeDisplay.textContent = this.formatTime(solarTime);
        
        // Calculate and display longitudinal time (previously spaze)
        const longitudinalTime = new Date(utcTime - longitudeOffset * 60000 * 60);
        this.longitudinalTimeDisplay.textContent = this.formatTime(longitudinalTime);
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