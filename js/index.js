/**
 * Solar Time application - calculates and displays solar time, sunrise, sunset,
 * and day length information based on user's location.
 */
class SolarTimeApp {
  constructor() {
    this.initializeApp();
    // These variables are not currently used and can be removed
  }

  initializeApp() {
    document.addEventListener('DOMContentLoaded', () => {
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

  // isLeapYear(date) {
  //   const year = date.getUTCFullYear();
  //   if ((year & 3) !== 0) {
  //     return false;
  //   } else {
  //     return ((year % 100) !== 0 || (year % 400) === 0);
  //   }
  // }

  // /**
  //  * Calculate solar parameters based on day of year
  //  * @param {Date} date - Date object for calculation
  //  * @returns {Object} Object containing gamma, equation of time, and declination
  //  */
  // calculateSolarParameters(date) {
  //   const dayFraction = this.calculateDayFraction(date);
    
  //   // Calculate the value of gamma (year angle)
  //   let gamma = 0;
  //   if (this.isLeapYear(date)) {
  //     gamma = 2 * Math.PI / 366 * (dayFraction - 0.5);
  //   } else {
  //     gamma = 2 * Math.PI / 365 * (dayFraction - 0.5);
  //   }
    
  //   // Calculate the equation of time (in hours)
  //   const eqTime = 229.18 * (0.000075 + 0.001868 * Math.cos(gamma)
  //     - 0.032077 * Math.sin(gamma)
  //     - 0.014615 * Math.cos(2 * gamma)
  //     - 0.040849 * Math.sin(2 * gamma)) / 60;
      
  //   // Calculate declination of the sun (in radians)
  //   const declination = 0.006918 - 0.399912 * Math.cos(gamma) + 0.070257 * Math.sin(gamma)
  //     - 0.006758 * Math.cos(2 * gamma) + 0.000907 * Math.sin(2 * gamma)
  //     - 0.002697 * Math.cos(3 * gamma) + 0.00148 * Math.sin(3 * gamma);
      
  //   return { gamma, eqTime, declination };
  // }
  
  // // Calculate day of year fraction
  // calculateDayFraction(date) {
  //   const start = new Date(date.getFullYear(), 0, 0);
  //   const delta = date.getTime() - start.getTime();
  //   const oneDay = 1000 * 60 * 60 * 24;
  //   return delta / oneDay;
  // }
  


  // /**
  //  * Calculate gamma using the fixed astronomical J2000 reference epoch
  //  * @param {Date} date - current UTC date and time
  //  * @returns {number} gamma - year angle in radians
  //  */
  // calculateGammaAccurately(date) {
  //   // Fixed Reference Epoch: Vernal Equinox J2000 (March 20, 2000, 07:35 UTC)
  //   const referenceEquinox = new Date(Date.UTC(2000, 2, 20, 7, 35, 0));
  //   const msPerDay = 86400000;
  //   const tropicalYear = 365.2422;

  //   const daysSinceEquinox = (date - referenceEquinox) / msPerDay;
  //   const gammaEquinox = 2 * Math.PI * ((daysSinceEquinox % tropicalYear) / tropicalYear);

  //   // Shift gamma from equinox back to Jan 1 (~79.75 days earlier)
  //   const daysFromJan1ToEquinox = 79.75;
  //   const gammaOffset = (2 * Math.PI * daysFromJan1ToEquinox) / tropicalYear;

  //   const gammaCorrected = gammaEquinox + gammaOffset;

  //   return gammaCorrected;
  // }

  // /**
  //  * Calculate solar parameters (EoT, declination) based on gamma
  //  * @param {Date} date - current UTC date and time
  //  * @returns {Object} Object containing gamma, eqTime (hours), and declination (radians)
  //  */
  // calculateSolarParameters(date) {
  //   const gamma = this.calculateGammaAccurately(date);

  //   // Equation of Time in minutes
  //   const eqTimeMinutes = 229.18 * (
  //     0.000075 +
  //     0.001868 * Math.cos(gamma) -
  //     0.032077 * Math.sin(gamma) -
  //     0.014615 * Math.cos(2 * gamma) -
  //     0.040849 * Math.sin(2 * gamma)
  //   );

  //   const eqTime = eqTimeMinutes / 60; // convert to hours

  //   // Solar declination (radians)
  //   const declination = 0.006918 -
  //     0.399912 * Math.cos(gamma) +
  //     0.070257 * Math.sin(gamma) -
  //     0.006758 * Math.cos(2 * gamma) +
  //     0.000907 * Math.sin(2 * gamma) -
  //     0.002697 * Math.cos(3 * gamma) +
  //     0.00148 * Math.sin(3 * gamma);

  //   return { gamma, eqTime, declination };
  // }


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


  /**
   * Converts degrees to radians.
   * @param {number} degrees Angle in degrees.
   * @returns {number} Angle in radians.
   */
  degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Calculates the fraction of the tropical year elapsed since the reference epoch (V2K Equinox).
   *
   * @param {number} targetTimestamp The target timestamp in milliseconds UTC.
   * @returns {number} The fraction of the current tropical year elapsed (0 to < 1).
   */
  getFractionOfYear(targetTimestamp) {
    if (typeof targetTimestamp !== 'number') {
        console.error("Invalid targetTimestamp. Must be milliseconds UTC.");
        return NaN;
    }

  /**
   * Constants
   */
  // Mean Tropical Year length in days (more precise)
  const TROPICAL_YEAR_DAYS = 365.24219;
  // Tropical Year length in milliseconds
  const TROPICAL_YEAR_MS = TROPICAL_YEAR_DAYS * 24 * 60 * 60 * 1000;

  // Reference Epoch: Vernal Equinox March 20, 2000, 07:35 UTC
  // Use Date.UTC to avoid timezone issues
  const VERNAL_EQUINOX_2000_MS = Date.UTC(2000, 2, 20, 7, 35, 0); // Month is 0-indexed (2 = March)

    const elapsedMs = targetTimestamp - VERNAL_EQUINOX_2000_MS;
    const elapsedTropicalYears = elapsedMs / TROPICAL_YEAR_MS;

    // The fraction of the *current* year is the fractional part of the total elapsed years
    // Use modulo 1 essentially: elapsedTropicalYears - Math.floor(elapsedTropicalYears)
    // Or handle negative elapsed times correctly:
    let fraction = elapsedTropicalYears % 1;
    if (fraction < 0) {
        fraction += 1; // Ensure fraction is always positive [0, 1)
    }
    return fraction;
  }

  /**
   * Calculates the approximate solar declination using a timestamp.
   * The angle is based on the fraction of the tropical year elapsed since the V2K vernal equinox.
   * δ ≈ ε * sin( 2π * fractionOfYear )
   *
   * @param {number|Date} timeInput Timestamp in milliseconds UTC or a Date object.
   * @returns {number} Approximate solar declination in degrees.
   */
  calculateDeclinationFromTime(timeInput) {
    let targetTimestamp;
    if (timeInput instanceof Date) {
      targetTimestamp = timeInput.getTime();
    } else if (typeof timeInput === 'number') {
      targetTimestamp = timeInput;
    } else {
      console.error("Invalid input for calculateDeclinationFromTime. Provide Date object or timestamp (ms UTC).");
      return NaN;
    }

    const fractionOfYear = this.getFractionOfYear(targetTimestamp);
    if (isNaN(fractionOfYear)) return NaN;

    // The angle (in radians) is directly 2*PI times the fraction of the year
    // since the reference point was the vernal equinox (where the angle is 0).
    const angleRad = 2 * Math.PI * fractionOfYear;

    // Earth's Obliquity (approximate, in degrees)
    const EARTH_OBLIQUITY_DEG = 23.439; // Slightly more standard value often used

    const declinationDeg = EARTH_OBLIQUITY_DEG * Math.sin(angleRad);

    return declinationDeg;
  }

  /**
   * Calculates the approximate Equation of Time (EoT) using a timestamp.
   * Uses the same fractionOfYear calculation and the standard approximation formula:
   * EoT (minutes) ≈ 9.87 * sin(2 * Angle) - 7.53 * cos(Angle) - 1.5 * sin(Angle)
   * where Angle = 2π * fractionOfYear
   *
   * @param {number|Date} timeInput Timestamp in milliseconds UTC or a Date object.
   * @returns {number} Approximate Equation of Time in minutes.
   */
  calculateEoTFromTime(timeInput) {
      let targetTimestamp;
      if (timeInput instanceof Date) {
        targetTimestamp = timeInput.getTime();
      } else if (typeof timeInput === 'number') {
        targetTimestamp = timeInput;
      } else {
        console.error("Invalid input for calculateEoTFromTime. Provide Date object or timestamp (ms UTC).");
        return NaN;
      }

    const fractionOfYear = this.getFractionOfYear(targetTimestamp);
    if (isNaN(fractionOfYear)) return NaN;

    // Base angle in radians (same as used for declination)
    const B_rad = 2 * Math.PI * fractionOfYear;

    // Calculate the terms of the EoT formula
    const term1 = 9.87 * Math.sin(2 * B_rad); // Note the 2*B_rad
    const term2 = -7.53 * Math.cos(B_rad);
    const term3 = -1.5 * Math.sin(B_rad);

    const eotMinutes = term1 + term2 + term3;

    return eotMinutes;
  }  

  /**
   * Calculate solar parameters (EoT, declination) based on gamma
   * @param {Date} date - current UTC date and time
   * @returns {Object} Object containing gamma, eqTime (hours), and declination (radians)
   */
  calculateSolarParameters(date) {

    // Equation of Time in minutes
    const eqTimeMinutes = this.calculateEoTFromTime(date);

    const eqTime = eqTimeMinutes / 60; // convert to hours

    // Solar declination (radians)
    const declination = this.calculateDeclinationFromTime(date) / 180 * Math.PI;

    const gamma = null;

    console.log(eqTime, declination);

    return { gamma, eqTime, declination };
  }


  /**
   * Get user's location and calculate all solar time values
   */
  getTimeAndLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const now = new Date();
        
        // Calculate day of year
        // const dayFraction = this.calculateDayFraction(now);

        // Calculate yesterday for day length change comparison
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);

        const {solarTime, longitudeOffset, eqTime} = this.calculateSolarTime(longitude, now);
          
        this.solarTimeDisplay.textContent = this.formatTime(solarTime);
        this.longitudinalTimeDisplay.textContent = this.formatTimeDelta(longitudeOffset);
        this.equationTimeDisplay.textContent = this.formatTimeDelta(eqTime);    
        
        // Calculate sunrise and sunset using noon declination
        const dayInfo = this.calculateDayInfo(latitude, longitude,  eqTime, now);
        const yesterdayInfo = this.calculateDayInfo(latitude, longitude, eqTime, yesterday);

        // Polar night - sun never rises
        if (dayInfo.polarNight) {
          this.sunriseDisplay.textContent = "Sun never rises today";
          this.sunsetDisplay.textContent = "Sun never rises today";
          this.dayLengthDisplay.textContent = "00:00:00";
          this.dayLengthChangeDisplay.textContent = "N/A";  
        } else if (dayInfo.polarDay) {
          // Polar day - sun never sets
          this.sunriseDisplay.textContent = "Sun never sets today";
          this.sunsetDisplay.textContent = "Sun never sets today";
          this.dayLengthDisplay.textContent = "24:00:00";
          this.dayLengthChangeDisplay.textContent = "N/A";
        } else {
          this.sunriseDisplay.textContent = this.formatTime(dayInfo.sunrise);
          this.sunsetDisplay.textContent = this.formatTime(dayInfo.sunset);
          this.dayLengthDisplay.textContent = this.formatDuration(dayInfo.dayLength);
          const dayLengthChange = (dayInfo.dayLength - yesterdayInfo.dayLength) * 60; // in minutes
          this.dayLengthChangeDisplay.textContent = this.formatDayLengthChange(dayLengthChange);
        }
        
      }, (error) => {
        console.error('Error getting geolocation:', error);
        this.setErrorOnDisplays('Geolocation error');
      });
    } else {
      console.error('No support for geolocation');
      this.setErrorOnDisplays('Geolocation not supported');
    }
  }

  /**
   * Calculate solar time based on longitude and current time
   * @param {number} longitude - Longitude in degrees
   * @param {Date} now - Current date/time
   * @returns {Object} Object containing solar time, longitude offset, and equation of time
   */
  calculateSolarTime(longitude, now) {
    // Calculate longitudinal time offset
    // Longitude divided by 15 gives the time zone offset in hours
    const longitudeOffset = longitude / 15;

    // Get equation of time from solar parameters
    const { eqTime } = this.calculateSolarParameters(now);

    // Calculate solar time
    const msPerHour = 3600000;
    const utcTimestamp = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
    const solarTime = new Date(utcTimestamp + (longitudeOffset + eqTime) * msPerHour);

    return { solarTime, longitudeOffset, eqTime};
  }

  /**
   * Calculate sunrise, sunset, and day length information
   * @param {number} latitude - Latitude in degrees
   * @param {number} longitude - Longitude in degrees
   * @param {number} eqTime - Equation of time in hours
   * @param {Date} date - Date for calculation
   * @returns {Object} Object containing sunrise, sunset, day length, and polar day/night flags
   */
  calculateDayInfo(latitude, longitude, eqTime, date) {
    // Convert to milliseconds for Date calculations
    const msPerHour = 60 * 60 * 1000;
    const minutesPerHour = 60;

    const longitudeOffset = longitude / 15;
    const latRad = latitude * Math.PI / 180; // Convert latitude to radians
    
    // Sunrise/sunset occurs when zenith angle is 90.833 degrees (accounting for refraction and solar disc diameter)
    const zenith = 90.833 * Math.PI / 180;

    const solarNoon = new Date(date);
    solarNoon.setHours(12, 0, 0, 0);

    const localNoon = new Date(solarNoon.getTime() - (solarNoon.getTimezoneOffset() / minutesPerHour + longitudeOffset + eqTime) * msPerHour);    

    // Calculate solar declination at solar noon
    const {declination} = this.calculateSolarParameters(solarNoon);
    
    // Sunrise/sunset hour angle
    const cosHourAngle = (Math.cos(zenith) - Math.sin(latRad) * Math.sin(declination)) / 
                         (Math.cos(latRad) * Math.cos(declination));
    
    // Handle edge cases: polar day/night
    if (cosHourAngle > 1) {
      return { sunrise: null, sunset: null, dayLength: null, polarDay: false, polarNight: true};
    }
    
    if (cosHourAngle < -1) {
      return { sunrise: null, sunset: null, dayLength: null, polarDay: true, polarNight: false};
    }
    
    // Calculate the hour angle in radians
    const hourAngle = Math.acos(cosHourAngle);
    
    // Convert hour angle to hours
    const hourAngleHours = hourAngle * 180 / Math.PI / 15;

    const approxSunrise = new Date(localNoon.getTime() - hourAngleHours * msPerHour);
    const approxSunset = new Date(localNoon.getTime() + hourAngleHours * msPerHour);

    // Second pass: refine declination and EoT at approximate sunrise and sunset times
    const {declination: sunriseDeclination} = this.calculateSolarParameters(approxSunrise);
    const {declination: sunsetDeclination} = this.calculateSolarParameters(approxSunset);

    // Refined sunrise calculation
    const hourAngleSunrise = Math.acos(
      (Math.cos(zenith) - Math.sin(latRad) * Math.sin(sunriseDeclination)) /
      (Math.cos(latRad) * Math.cos(sunriseDeclination))
    );
    const hourAngleHoursSunrise = hourAngleSunrise * 180 / Math.PI / 15;

    // Refined sunset calculation
    const hourAngleSunset = Math.acos(
      (Math.cos(zenith) - Math.sin(latRad) * Math.sin(sunsetDeclination)) /
      (Math.cos(latRad) * Math.cos(sunsetDeclination))
    );
    const hourAngleHoursSunset = hourAngleSunset * 180 / Math.PI / 15;

    const refinedSunrise = new Date(localNoon.getTime() - hourAngleHoursSunrise * msPerHour);
    const refinedSunset = new Date(localNoon.getTime() + hourAngleHoursSunset * msPerHour);

    // Calculate day length in hours
    const dayLength = hourAngleHoursSunrise + hourAngleHoursSunset;

    return { sunrise: refinedSunrise, sunset: refinedSunset, dayLength: dayLength, polarDay: false, polarNight: false};

  }

}

// Initialize the app
const app = new SolarTimeApp();