// Refactored time calculation for the Solar Time application
class SolarTimeApp {
  constructor() {
    this.initializeApp();
    this.yesterday = null;
    this.todayDayLength = null;
    this.yesterdayDayLength = null;
    this.currentDay = null; // Track the current day to detect day changes
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
    this.utcTimeDisplay = document.getElementById('utc-time');
    this.equationTimeDisplay = document.getElementById('equation-time');
    this.sunriseDisplay = document.getElementById('sunrise-time');
    this.sunsetDisplay = document.getElementById('sunset-time');
    this.dayLengthDisplay = document.getElementById('day-length');
    this.dayLengthChangeDisplay = document.getElementById('day-length-change');
  }

  startTimeUpdates() {
    // Update immediately and then every second
    this.updateUtcTime();
    this.getTimeAndLocation();
    
    setInterval(() => {
      this.updateUtcTime();
      this.getTimeAndLocation();
    }, 1000);
  }

  updateUtcTime() {
    const now = new Date();
    
    // Update UTC Time
    this.utcTimeDisplay.textContent = this.formatUtcTime(now);
  }

  formatTime(date) {
    return date.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  formatUtcTime(date) {
    return date.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC' });
  }
  
  // Helper function to convert hours to hours, minutes, seconds components
  hoursToComponents(hours) {
    const absHours = Math.abs(hours);
    
    const wholeHours = Math.floor(absHours);
    const minutesFraction = (absHours - wholeHours) * 60;
    const wholeMinutes = Math.floor(minutesFraction);
    const secondsFraction = (minutesFraction - wholeMinutes) * 60;
    const wholeSeconds = Math.floor(secondsFraction);
    
    return {
      hours: wholeHours,
      minutes: wholeMinutes,
      seconds: wholeSeconds
    };
  }
  
  // Format with leading zeros - helper function
  formatTimeComponents(hours, minutes, seconds) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  
  formatTimeDelta(hours) {
    // Convert hours to hours, minutes, seconds with sign (+ or -)
    const sign = hours < 0 ? '-' : '+';
    const { hours: h, minutes: m, seconds: s } = this.hoursToComponents(hours);
    
    return `${sign}${this.formatTimeComponents(h, m, s)}`;
  }
  
  formatDuration(hours) {
    // Convert hours to hours, minutes, seconds without sign
    const { hours: h, minutes: m, seconds: s } = this.hoursToComponents(hours);
    
    return this.formatTimeComponents(h, m, s);
  }
  
  // Format day length change with sign (+ or -) in hh:mm:ss format
  formatDayLengthChange(minutes) {
    // Convert minutes to hours with sign
    const hours = minutes / 60;
    return this.formatTimeDelta(hours);
  }

  isLeapYear(date) {
    const year = date.getUTCFullYear();
    if ((year & 3) !== 0) {
      return false;
    } else {
      return ((year % 100) !== 0 || (year % 400) === 0);
    }
  }

  // Calculate solar parameters based on day of year
  calculateSolarParameters(date, dayFraction, useNoon = false) {
    // Create a noon date if requested (for more accurate day length calculations)
    let calculationDate = date;
    let calculationDayFraction = dayFraction;
    
    if (useNoon) {
      // Create a date object for noon on the specified day
      calculationDate = new Date(date);
      calculationDate.setHours(12, 0, 0, 0);
      
      // Recalculate day fraction for noon
      calculationDayFraction = this.calculateDayFraction(calculationDate);
    }
    
    // Calculate the value of gamma (year angle)
    let gamma = 0;
    if (this.isLeapYear(calculationDate)) {
      gamma = 2 * Math.PI / 366 * (calculationDayFraction - 0.5);
    } else {
      gamma = 2 * Math.PI / 365 * (calculationDayFraction - 0.5);
    }
    
    // Calculate the equation of time (in minutes)
    const eqTime = 229.18 * (0.000075 + 0.001868 * Math.cos(gamma)
      - 0.032077 * Math.sin(gamma)
      - 0.014615 * Math.cos(2 * gamma)
      - 0.040849 * Math.sin(2 * gamma));
      
    // Calculate declination of the sun (in radians)
    const decl = 0.006918 - 0.399912 * Math.cos(gamma) + 0.070257 * Math.sin(gamma)
      - 0.006758 * Math.cos(2 * gamma) + 0.000907 * Math.sin(2 * gamma)
      - 0.002697 * Math.cos(3 * gamma) + 0.00148 * Math.sin(3 * gamma);
      
    return { gamma, eqTime, decl };
  }
  
  // Calculate day of year fraction
  calculateDayFraction(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const delta = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return delta / oneDay;
  }
  
  // Set error message on all displays
  setErrorOnDisplays(message) {
    this.solarTimeDisplay.textContent = message;
    this.longitudinalTimeDisplay.textContent = message;
    this.equationTimeDisplay.textContent = message;
    this.sunriseDisplay.textContent = message;
    this.sunsetDisplay.textContent = message;
    this.dayLengthDisplay.textContent = message;
    this.dayLengthChangeDisplay.textContent = message;
  }
  
  getTimeAndLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const now = new Date();
        const today = now.getDate();
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        
        // Check if the day has changed or if it's our first run
        const dayChanged = (this.currentDay !== null && this.currentDay !== today);
        if (this.currentDay === null || dayChanged) {
          this.currentDay = today;
          
          // If day changed, yesterday's data needs to be recalculated
          if (dayChanged) {
            this.yesterdayDayLength = null;
          }
        }
        
        // Calculate longitudinal time offset
        // Longitude divided by 15 gives the time zone offset in hours
        const longitudeOffset = -longitude / 15;
        
        // Calculate day of year
        const dayFraction = this.calculateDayFraction(now);
        
        // Calculate solar parameters for current time (for solar time & EOT display)
        const { eqTime, decl: currentDecl } = this.calculateSolarParameters(now, dayFraction);
        
        // Get noon parameters for day length calculations (more accurate)
        const { decl: noonDecl } = this.calculateSolarParameters(now, dayFraction, true);
          
        // Display equation of time formatted as hh:mm:ss with sign
        const eqTimeHours = eqTime / 60; // Convert minutes to hours
        this.equationTimeDisplay.textContent = this.formatTimeDelta(eqTimeHours);
          
        // Calculate solar time
        const msPerHour = 60 * 60 * 1000;
        const utcTimestamp = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
        const solarTime = new Date(utcTimestamp - longitudeOffset * msPerHour + eqTime * 60 * 1000);
        this.solarTimeDisplay.textContent = this.formatTime(solarTime);
        
        // Calculate and display longitudinal time as a time delta (offset from UTC)
        const formattedLongitudeOffset = this.formatTimeDelta(-longitudeOffset);
        this.longitudinalTimeDisplay.textContent = formattedLongitudeOffset;
        
        // Calculate sunrise and sunset using noon declination
        this.calculateSunriseSunset(latitude, longitude, noonDecl, eqTime, now);
        
        // Calculate yesterday's data for day length comparison
        this.calculateYesterdayDayLength(latitude, longitude, now);
        
      }, (error) => {
        console.error('Error getting geolocation:', error);
        this.setErrorOnDisplays('Geolocation error');
      });
    } else {
      console.error('No support for geolocation');
      this.setErrorOnDisplays('Geolocation not supported');
    }
  }
  
  // Calculate sunrise and sunset times
  calculateSunriseSunset(latitude, longitude, declination, eqTime, date) {
    const latRad = latitude * Math.PI / 180; // Convert latitude to radians
    
    // Sunrise/sunset occurs when zenith angle is 90.833 degrees (accounting for refraction and solar disc diameter)
    const zenith = 90.833 * Math.PI / 180;
    
    // Sunrise/sunset hour angle
    const cosHourAngle = (Math.cos(zenith) - Math.sin(latRad) * Math.sin(declination)) / 
                         (Math.cos(latRad) * Math.cos(declination));
    
    // Handle edge cases: polar day/night
    if (cosHourAngle > 1) {
      // Polar night - sun never rises
      this.sunriseDisplay.textContent = "Sun never rises today";
      this.sunsetDisplay.textContent = "Sun never rises today";
      this.dayLengthDisplay.textContent = "00:00:00";
      this.dayLengthChangeDisplay.textContent = "N/A";
      return;
    }
    
    if (cosHourAngle < -1) {
      // Polar day - sun never sets
      this.sunriseDisplay.textContent = "Sun never sets today";
      this.sunsetDisplay.textContent = "Sun never sets today";
      this.dayLengthDisplay.textContent = "24:00:00";
      this.dayLengthChangeDisplay.textContent = "N/A";
      return;
    }
    
    // Calculate the hour angle in radians
    const hourAngle = Math.acos(cosHourAngle);
    
    // Convert hour angle to hours
    const hourAngleHours = hourAngle * 180 / Math.PI / 15;
    
    // Calculate day length in hours
    const dayLength = 2 * hourAngleHours;
    this.todayDayLength = dayLength;
    
    // Convert to milliseconds for Date calculations
    const msPerHour = 60 * 60 * 1000;
    
    // Calculate sunrise and sunset times
    const solarSunriseHour = 12 - hourAngleHours;
    const solarSunsetHour = 12 + hourAngleHours;
    
    // Convert to UTC timestamps, adjusting for longitude and equation of time
    const longitudeAdjustMs = longitude / 15 * msPerHour;
    const eqTimeMs = eqTime * 60 * 1000;
    
    // Create Date objects for sunrise and sunset
    const sunriseLocal = new Date(solarSunriseHour * msPerHour - longitudeAdjustMs - eqTimeMs);
    const sunsetLocal = new Date(solarSunsetHour * msPerHour - longitudeAdjustMs - eqTimeMs);
    
    // Display sunrise and sunset in local time
    this.sunriseDisplay.textContent = this.formatTime(sunriseLocal);
    this.sunsetDisplay.textContent = this.formatTime(sunsetLocal);
    
    // Display day length
    this.dayLengthDisplay.textContent = this.formatDuration(dayLength);
    
    // Compare with yesterday's day length and show the change
    if (this.yesterdayDayLength !== null) {
      const dayLengthChange = (this.todayDayLength - this.yesterdayDayLength) * 60; // in minutes
      this.dayLengthChangeDisplay.textContent = this.formatDayLengthChange(dayLengthChange);
    } else {
      this.dayLengthChangeDisplay.textContent = "Calculating...";
    }
  }
  
  // Calculate yesterday's day length for comparison
  calculateYesterdayDayLength(latitude, longitude, today) {
    // If we've already calculated yesterday's day length, don't do it again
    if (this.yesterdayDayLength !== null) {
      return;
    }
    
    // Create yesterday's date
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Use noon time for more accurate day length calculation
    // Calculate solar parameters for yesterday at noon
    const { decl } = this.calculateSolarParameters(yesterday, null, true);
    
    // Calculate hour angle cosine for sunrise/sunset
    const latRad = latitude * Math.PI / 180;
    const zenith = 90.833 * Math.PI / 180;
    const cosHourAngle = (Math.cos(zenith) - Math.sin(latRad) * Math.sin(decl)) / 
                         (Math.cos(latRad) * Math.cos(decl));
    
    // Check if sun never rises/sets at this location yesterday
    if (cosHourAngle > 1 || cosHourAngle < -1) {
      this.yesterdayDayLength = cosHourAngle > 1 ? 0 : 24;
      return;
    }
    
    // Calculate the hour angle for yesterday
    const hourAngle = Math.acos(cosHourAngle);
    const hourAngleHours = hourAngle * 180 / Math.PI / 15;
    
    // Store yesterday's day length
    this.yesterdayDayLength = 2 * hourAngleHours;
  }
}

// Initialize the app
const app = new SolarTimeApp();