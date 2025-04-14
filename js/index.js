// /**
//  * Solar Time application - calculates and displays solar time, sunrise, sunset,
//  * and day length information based on user's location.
//  */
// class SolarTimeApp {
//   constructor() {
//     this.initializeApp();
//     // These variables are not currently used and can be removed
//   }

//   initializeApp() {
//     document.addEventListener('DOMContentLoaded', () => {
//       this.initializeTimeDisplays();
//       this.startTimeUpdates();
//     });
//   }

//   initializeTimeDisplays() {
//     this.solarTimeDisplay = document.getElementById('solar-time');
//     this.longitudinalTimeDisplay = document.getElementById('longitudinal-time');
//     this.utcTimeDisplay = document.getElementById('utc-time');
//     this.equationTimeDisplay = document.getElementById('equation-time');
//     this.sunriseDisplay = document.getElementById('sunrise-time');
//     this.sunsetDisplay = document.getElementById('sunset-time');
//     this.dayLengthDisplay = document.getElementById('day-length');
//     this.dayLengthChangeDisplay = document.getElementById('day-length-change');
//   }

//   startTimeUpdates() {
//     // Update immediately and then every second
//     this.updateUtcTime();
//     this.getTimeAndLocation();
    
//     setInterval(() => {
//       this.updateUtcTime();
//       this.getTimeAndLocation();
//     }, 1000);
//   }

//   updateUtcTime() {
//     const now = new Date();
    
//     // Update UTC Time
//     this.utcTimeDisplay.textContent = this.formatUtcTime(now);
//   }

//   formatTime(date) {
//     return date.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
//   }

//   formatUtcTime(date) {
//     return date.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC' });
//   }
  
//   // Helper function to convert hours to hours, minutes, seconds components
//   hoursToComponents(hours) {
//     const absHours = Math.abs(hours);
    
//     const wholeHours = Math.floor(absHours);
//     const minutesFraction = (absHours - wholeHours) * 60;
//     const wholeMinutes = Math.floor(minutesFraction);
//     const secondsFraction = (minutesFraction - wholeMinutes) * 60;
//     const wholeSeconds = Math.floor(secondsFraction);
    
//     return {
//       hours: wholeHours,
//       minutes: wholeMinutes,
//       seconds: wholeSeconds
//     };
//   }
  
//   // Format with leading zeros - helper function
//   formatTimeComponents(hours, minutes, seconds) {
//     return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
//   }
  
//   formatTimeDelta(hours) {
//     // Convert hours to hours, minutes, seconds with sign (+ or -)
//     const sign = hours < 0 ? '-' : '+';
//     const { hours: h, minutes: m, seconds: s } = this.hoursToComponents(hours);
    
//     return `${sign}${this.formatTimeComponents(h, m, s)}`;
//   }
  
//   formatDuration(hours) {
//     // Convert hours to hours, minutes, seconds without sign
//     const { hours: h, minutes: m, seconds: s } = this.hoursToComponents(hours);
    
//     return this.formatTimeComponents(h, m, s);
//   }
  
//   // Format day length change with sign (+ or -) in hh:mm:ss format
//   formatDayLengthChange(minutes) {
//     // Convert minutes to hours with sign
//     const hours = minutes / 60;
//     return this.formatTimeDelta(hours);
//   }

//   // Set error message on all displays
//   setErrorOnDisplays(message) {
//     this.solarTimeDisplay.textContent = message;
//     this.longitudinalTimeDisplay.textContent = message;
//     this.equationTimeDisplay.textContent = message;
//     this.sunriseDisplay.textContent = message;
//     this.sunsetDisplay.textContent = message;
//     this.dayLengthDisplay.textContent = message;
//     this.dayLengthChangeDisplay.textContent = message;
//   }


//   /**
//    * Converts degrees to radians.
//    * @param {number} degrees Angle in degrees.
//    * @returns {number} Angle in radians.
//    */
//   degreesToRadians(degrees) {
//     return degrees * (Math.PI / 180);
//   }

//   /**
//    * Calculates the fraction of the tropical year elapsed since the reference epoch (V2K Equinox).
//    *
//    * @param {number} targetTimestamp The target timestamp in milliseconds UTC.
//    * @returns {number} The fraction of the current tropical year elapsed (0 to < 1).
//    */
//   getFractionOfYear(targetTimestamp) {
//     if (typeof targetTimestamp !== 'number') {
//         console.error("Invalid targetTimestamp. Must be milliseconds UTC.");
//         return NaN;
//     }

//   /**
//    * Constants
//    */
//   // Mean Tropical Year length in days (more precise)
//   const TROPICAL_YEAR_DAYS = 365.24219;
//   // Tropical Year length in milliseconds
//   const TROPICAL_YEAR_MS = TROPICAL_YEAR_DAYS * 24 * 60 * 60 * 1000;

//   // Reference Epoch: Vernal Equinox March 20, 2000, 07:35 UTC
//   // Use Date.UTC to avoid timezone issues
//   const VERNAL_EQUINOX_2000_MS = Date.UTC(2000, 2, 20, 7, 35, 0); // Month is 0-indexed (2 = March)

//     const elapsedMs = targetTimestamp - VERNAL_EQUINOX_2000_MS;
//     const elapsedTropicalYears = elapsedMs / TROPICAL_YEAR_MS;

//     // The fraction of the *current* year is the fractional part of the total elapsed years
//     // Use modulo 1 essentially: elapsedTropicalYears - Math.floor(elapsedTropicalYears)
//     // Or handle negative elapsed times correctly:
//     let fraction = elapsedTropicalYears % 1;
//     if (fraction < 0) {
//         fraction += 1; // Ensure fraction is always positive [0, 1)
//     }
//     return fraction;
//   }

//   /**
//    * Calculates the approximate solar declination using a timestamp.
//    * The angle is based on the fraction of the tropical year elapsed since the V2K vernal equinox.
//    * δ ≈ ε * sin( 2π * fractionOfYear )
//    *
//    * @param {number|Date} timeInput Timestamp in milliseconds UTC or a Date object.
//    * @returns {number} Approximate solar declination in degrees.
//    */
//   calculateDeclinationFromTime(timeInput) {
//     let targetTimestamp;
//     if (timeInput instanceof Date) {
//       targetTimestamp = timeInput.getTime();
//     } else if (typeof timeInput === 'number') {
//       targetTimestamp = timeInput;
//     } else {
//       console.error("Invalid input for calculateDeclinationFromTime. Provide Date object or timestamp (ms UTC).");
//       return NaN;
//     }

//     const fractionOfYear = this.getFractionOfYear(targetTimestamp);
//     if (isNaN(fractionOfYear)) return NaN;

//     // The angle (in radians) is directly 2*PI times the fraction of the year
//     // since the reference point was the vernal equinox (where the angle is 0).
//     const angleRad = 2 * Math.PI * fractionOfYear;

//     // Earth's Obliquity (approximate, in degrees)
//     const EARTH_OBLIQUITY_DEG = 23.439; // Slightly more standard value often used

//     const declinationDeg = EARTH_OBLIQUITY_DEG * Math.sin(angleRad);

//     return declinationDeg;
//   }

//   /**
//    * Calculates the approximate Equation of Time (EoT) using a timestamp.
//    * Uses the same fractionOfYear calculation and the standard approximation formula:
//    * EoT (minutes) ≈ 9.87 * sin(2 * Angle) - 7.53 * cos(Angle) - 1.5 * sin(Angle)
//    * where Angle = 2π * fractionOfYear
//    *
//    * @param {number|Date} timeInput Timestamp in milliseconds UTC or a Date object.
//    * @returns {number} Approximate Equation of Time in minutes.
//    */
//   calculateEoTFromTime(timeInput) {
//       let targetTimestamp;
//       if (timeInput instanceof Date) {
//         targetTimestamp = timeInput.getTime();
//       } else if (typeof timeInput === 'number') {
//         targetTimestamp = timeInput;
//       } else {
//         console.error("Invalid input for calculateEoTFromTime. Provide Date object or timestamp (ms UTC).");
//         return NaN;
//       }

//     const fractionOfYear = this.getFractionOfYear(targetTimestamp);
//     if (isNaN(fractionOfYear)) return NaN;

//     // Base angle in radians (same as used for declination)
//     const B_rad = 2 * Math.PI * fractionOfYear;

//     // Calculate the terms of the EoT formula
//     const term1 = 9.87 * Math.sin(2 * B_rad); // Note the 2*B_rad
//     const term2 = -7.53 * Math.cos(B_rad);
//     const term3 = -1.5 * Math.sin(B_rad);

//     const eotMinutes = term1 + term2 + term3;

//     return eotMinutes;
//   }  

//   /**
//    * Calculate solar parameters (EoT, declination) based on gamma
//    * @param {Date} date - current UTC date and time
//    * @returns {Object} Object containing gamma, eqTime (hours), and declination (radians)
//    */
//   calculateSolarParameters(date) {

//     // Equation of Time in minutes
//     const eqTimeMinutes = this.calculateEoTFromTime(date);

//     const eqTime = eqTimeMinutes / 60; // convert to hours

//     // Solar declination (radians)
//     const declination = this.calculateDeclinationFromTime(date) / 180 * Math.PI;

//     const gamma = null;

//     console.log(eqTime, declination);

//     return { gamma, eqTime, declination };
//   }


//   /**
//    * Get user's location and calculate all solar time values
//    */
//   getTimeAndLocation() {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition((position) => {
//         const latitude = position.coords.latitude;
//         const longitude = position.coords.longitude;

//         const now = new Date();
        
//         // Calculate day of year
//         // const dayFraction = this.calculateDayFraction(now);

//         // Calculate yesterday for day length change comparison
//         const yesterday = new Date(now);
//         yesterday.setDate(yesterday.getDate() - 1);

//         const {solarTime, longitudeOffset, eqTime} = this.calculateSolarTime(longitude, now);
          
//         this.solarTimeDisplay.textContent = this.formatTime(solarTime);
//         this.longitudinalTimeDisplay.textContent = this.formatTimeDelta(longitudeOffset);
//         this.equationTimeDisplay.textContent = this.formatTimeDelta(eqTime);    
        
//         // Calculate sunrise and sunset using noon declination
//         const dayInfo = this.calculateDayInfo(latitude, longitude,  eqTime, now);
//         const yesterdayInfo = this.calculateDayInfo(latitude, longitude, eqTime, yesterday);

//         // Polar night - sun never rises
//         if (dayInfo.polarNight) {
//           this.sunriseDisplay.textContent = "Sun never rises today";
//           this.sunsetDisplay.textContent = "Sun never rises today";
//           this.dayLengthDisplay.textContent = "00:00:00";
//           this.dayLengthChangeDisplay.textContent = "N/A";  
//         } else if (dayInfo.polarDay) {
//           // Polar day - sun never sets
//           this.sunriseDisplay.textContent = "Sun never sets today";
//           this.sunsetDisplay.textContent = "Sun never sets today";
//           this.dayLengthDisplay.textContent = "24:00:00";
//           this.dayLengthChangeDisplay.textContent = "N/A";
//         } else {
//           this.sunriseDisplay.textContent = this.formatTime(dayInfo.sunrise);
//           this.sunsetDisplay.textContent = this.formatTime(dayInfo.sunset);
//           this.dayLengthDisplay.textContent = this.formatDuration(dayInfo.dayLength);
//           const dayLengthChange = (dayInfo.dayLength - yesterdayInfo.dayLength) * 60; // in minutes
//           this.dayLengthChangeDisplay.textContent = this.formatDayLengthChange(dayLengthChange);
//         }
        
//       }, (error) => {
//         console.error('Error getting geolocation:', error);
//         this.setErrorOnDisplays('Geolocation error');
//       });
//     } else {
//       console.error('No support for geolocation');
//       this.setErrorOnDisplays('Geolocation not supported');
//     }
//   }

//   /**
//    * Calculate solar time based on longitude and current time
//    * @param {number} longitude - Longitude in degrees
//    * @param {Date} now - Current date/time
//    * @returns {Object} Object containing solar time, longitude offset, and equation of time
//    */
//   calculateSolarTime(longitude, now) {
//     // Calculate longitudinal time offset
//     // Longitude divided by 15 gives the time zone offset in hours
//     const longitudeOffset = longitude / 15;

//     // Get equation of time from solar parameters
//     const { eqTime } = this.calculateSolarParameters(now);

//     // Calculate solar time
//     const msPerHour = 3600000;
//     const utcTimestamp = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
//     const solarTime = new Date(utcTimestamp + (longitudeOffset + eqTime) * msPerHour);

//     return { solarTime, longitudeOffset, eqTime};
//   }

//   /**
//    * Calculate sunrise, sunset, and day length information
//    * @param {number} latitude - Latitude in degrees
//    * @param {number} longitude - Longitude in degrees
//    * @param {number} eqTime - Equation of time in hours
//    * @param {Date} date - Date for calculation
//    * @returns {Object} Object containing sunrise, sunset, day length, and polar day/night flags
//    */
//   calculateDayInfo(latitude, longitude, eqTime, date) {
//     // Convert to milliseconds for Date calculations
//     const msPerHour = 60 * 60 * 1000;
//     const minutesPerHour = 60;

//     const longitudeOffset = longitude / 15;
//     const latRad = latitude * Math.PI / 180; // Convert latitude to radians
    
//     // Sunrise/sunset occurs when zenith angle is 90.833 degrees (accounting for refraction and solar disc diameter)
//     const zenith = 90.833 * Math.PI / 180;

//     const solarNoon = new Date(date);
//     solarNoon.setHours(12, 0, 0, 0);

//     const localNoon = new Date(solarNoon.getTime() - (solarNoon.getTimezoneOffset() / minutesPerHour + longitudeOffset + eqTime) * msPerHour);    

//     // Calculate solar declination at solar noon
//     const {declination} = this.calculateSolarParameters(solarNoon);
    
//     // Sunrise/sunset hour angle
//     const cosHourAngle = (Math.cos(zenith) - Math.sin(latRad) * Math.sin(declination)) / 
//                          (Math.cos(latRad) * Math.cos(declination));
    
//     // Handle edge cases: polar day/night
//     if (cosHourAngle > 1) {
//       return { sunrise: null, sunset: null, dayLength: null, polarDay: false, polarNight: true};
//     }
    
//     if (cosHourAngle < -1) {
//       return { sunrise: null, sunset: null, dayLength: null, polarDay: true, polarNight: false};
//     }
    
//     // Calculate the hour angle in radians
//     const hourAngle = Math.acos(cosHourAngle);
    
//     // Convert hour angle to hours
//     const hourAngleHours = hourAngle * 180 / Math.PI / 15;

//     const approxSunrise = new Date(localNoon.getTime() - hourAngleHours * msPerHour);
//     const approxSunset = new Date(localNoon.getTime() + hourAngleHours * msPerHour);

//     // Second pass: refine declination and EoT at approximate sunrise and sunset times
//     const {declination: sunriseDeclination} = this.calculateSolarParameters(approxSunrise);
//     const {declination: sunsetDeclination} = this.calculateSolarParameters(approxSunset);

//     // Refined sunrise calculation
//     const hourAngleSunrise = Math.acos(
//       (Math.cos(zenith) - Math.sin(latRad) * Math.sin(sunriseDeclination)) /
//       (Math.cos(latRad) * Math.cos(sunriseDeclination))
//     );
//     const hourAngleHoursSunrise = hourAngleSunrise * 180 / Math.PI / 15;

//     // Refined sunset calculation
//     const hourAngleSunset = Math.acos(
//       (Math.cos(zenith) - Math.sin(latRad) * Math.sin(sunsetDeclination)) /
//       (Math.cos(latRad) * Math.cos(sunsetDeclination))
//     );
//     const hourAngleHoursSunset = hourAngleSunset * 180 / Math.PI / 15;

//     const refinedSunrise = new Date(localNoon.getTime() - hourAngleHoursSunrise * msPerHour);
//     const refinedSunset = new Date(localNoon.getTime() + hourAngleHoursSunset * msPerHour);

//     // Calculate day length in hours
//     const dayLength = hourAngleHoursSunrise + hourAngleHoursSunset;

//     return { sunrise: refinedSunrise, sunset: refinedSunset, dayLength: dayLength, polarDay: false, polarNight: false};

//   }

// }

// // Initialize the app
// const app = new SolarTimeApp();


/**
 * Solar Time Application
 * 
 * Calculates and displays solar time, sunrise, sunset, and day length information
 * based on the user's geolocation.
 */
class SolarTimeApp {
  /**
   * Initializes the Solar Time Application
   */
  constructor() {
    this.initializeApp();
  }

  /**
   * Sets up event listeners when the DOM is fully loaded
   */
  initializeApp() {
    document.addEventListener('DOMContentLoaded', () => {
      this.initializeTimeDisplays();
      this.startTimeUpdates();
    });
  }

  /**
   * Initializes DOM element references for all time displays
   */
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

  /**
   * Starts the time update processes
   * Updates immediately and then every second thereafter
   */
  startTimeUpdates() {
    this.updateUtcTime();
    this.getTimeAndLocation();
    
    setInterval(() => {
      this.updateUtcTime();
      this.getTimeAndLocation();
    }, 1000);
  }

  /**
   * Updates the UTC time display
   */
  updateUtcTime() {
    const now = new Date();
    this.utcTimeDisplay.textContent = this.formatUtcTime(now);
  }

  /**
   * Formats time in local timezone as HH:MM:SS
   * @param {Date} date - Date object to format
   * @returns {string} Formatted time string
   */
  formatTime(date) {
    return date.toLocaleTimeString([], { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  }

  /**
   * Formats time in UTC timezone as HH:MM:SS
   * @param {Date} date - Date object to format
   * @returns {string} Formatted UTC time string
   */
  formatUtcTime(date) {
    return date.toLocaleTimeString([], { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit', 
      timeZone: 'UTC' 
    });
  }
  
  /**
   * Converts decimal hours to hours, minutes, seconds components
   * @param {number} hours - Decimal hours to convert
   * @returns {Object} Object with hours, minutes, seconds components
   */
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
  
  /**
   * Formats time components with leading zeros
   * @param {number} hours - Hours component
   * @param {number} minutes - Minutes component
   * @param {number} seconds - Seconds component
   * @returns {string} Formatted time string (HH:MM:SS)
   */
  formatTimeComponents(hours, minutes, seconds) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  
  /**
   * Formats time delta with sign (+ or -) in HH:MM:SS format
   * @param {number} hours - Hours to format
   * @returns {string} Formatted time delta string
   */
  formatTimeDelta(hours) {
    const sign = hours < 0 ? '-' : '+';
    const { hours: h, minutes: m, seconds: s } = this.hoursToComponents(hours);
    
    return `${sign}${this.formatTimeComponents(h, m, s)}`;
  }
  
  /**
   * Formats duration in HH:MM:SS format without sign
   * @param {number} hours - Hours to format
   * @returns {string} Formatted duration string
   */
  formatDuration(hours) {
    const { hours: h, minutes: m, seconds: s } = this.hoursToComponents(hours);
    return this.formatTimeComponents(h, m, s);
  }
  
  /**
   * Formats day length change with sign (+ or -) in HH:MM:SS format
   * @param {number} minutes - Minutes of change
   * @returns {string} Formatted day length change
   */
  formatDayLengthChange(minutes) {
    const hours = minutes / 60;
    return this.formatTimeDelta(hours);
  }

  /**
   * Sets error message on all displays
   * @param {string} message - Error message to display
   */
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
   * Converts degrees to radians
   * @param {number} degrees - Angle in degrees
   * @returns {number} Angle in radians
   */
  degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Calculates the fraction of the tropical year elapsed since the reference epoch (V2K Equinox)
   * @param {number} targetTimestamp - Target timestamp in milliseconds UTC
   * @returns {number} Fraction of the current tropical year elapsed (0 to < 1)
   */
  getFractionOfYear(targetTimestamp) {
    if (typeof targetTimestamp !== 'number') {
      console.error("Invalid targetTimestamp. Must be milliseconds UTC.");
      return NaN;
    }

    // Constants
    const TROPICAL_YEAR_DAYS = 365.24219; // Mean Tropical Year length in days
    const TROPICAL_YEAR_MS = TROPICAL_YEAR_DAYS * 24 * 60 * 60 * 1000; // Tropical Year in milliseconds
    // Reference Epoch: Vernal Equinox March 20, 2000, 07:35 UTC
    const VERNAL_EQUINOX_2000_MS = Date.UTC(2000, 2, 20, 7, 35, 0); // Month is 0-indexed (2 = March)

    const elapsedMs = targetTimestamp - VERNAL_EQUINOX_2000_MS;
    const elapsedTropicalYears = elapsedMs / TROPICAL_YEAR_MS;

    // The fraction of the current year
    let fraction = elapsedTropicalYears % 1;
    if (fraction < 0) {
      fraction += 1; // Ensure fraction is always positive [0, 1)
    }
    return fraction;
  }

  /**
   * Calculates the approximate solar declination using a timestamp
   * The angle is based on the fraction of the tropical year elapsed since the V2K vernal equinox
   * δ ≈ ε * sin(2π * fractionOfYear)
   * 
   * @param {number|Date} timeInput - Timestamp in milliseconds UTC or a Date object
   * @returns {number} Approximate solar declination in degrees
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
    const angleRad = 2 * Math.PI * fractionOfYear;

    // Earth's Obliquity (approximate, in degrees)
    const EARTH_OBLIQUITY_DEG = 23.439;

    const declinationDeg = EARTH_OBLIQUITY_DEG * Math.sin(angleRad);

    return declinationDeg;
  }

  /**
   * Calculates the approximate Equation of Time (EoT) using a timestamp
   * Uses the standard approximation formula:
   * EoT (minutes) ≈ 9.87 * sin(2 * Angle) - 7.53 * cos(Angle) - 1.5 * sin(Angle)
   * where Angle = 2π * fractionOfYear
   * 
   * @param {number|Date} timeInput - Timestamp in milliseconds UTC or a Date object
   * @returns {number} Approximate Equation of Time in minutes
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
    const angleRad = 2 * Math.PI * fractionOfYear;

    // Calculate the terms of the EoT formula
    const term1 = 9.87 * Math.sin(2 * angleRad);
    const term2 = -7.53 * Math.cos(angleRad);
    const term3 = -1.5 * Math.sin(angleRad);

    const eotMinutes = term1 + term2 + term3;

    return eotMinutes;
  }  

  /**
   * Calculate solar parameters (equation of time, declination) for a given date
   * @param {Date} date - Current UTC date and time
   * @returns {Object} Object containing equation of time (hours) and declination (radians)
   */
  calculateSolarParameters(date) {
    // Equation of Time in minutes
    const eqTimeMinutes = this.calculateEoTFromTime(date);
    const eqTime = eqTimeMinutes / 60; // convert to hours

    // Solar declination (convert from degrees to radians)
    const declination = this.degreesToRadians(this.calculateDeclinationFromTime(date));

    return { eqTime, declination };
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
        
        // Calculate yesterday for day length change comparison
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);

        const { solarTime, longitudeOffset, eqTime } = this.calculateSolarTime(longitude, now);
          
        // this.solarTimeDisplay.textContent = this.formatTime(solarTime);
        // Display solar time without timezone adjustments
        this.solarTimeDisplay.textContent = solarTime.toLocaleTimeString([], { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit',
          timeZone: 'UTC' 
        });

        this.longitudinalTimeDisplay.textContent = this.formatTimeDelta(longitudeOffset);
        this.equationTimeDisplay.textContent = this.formatTimeDelta(eqTime);    
        
        // Calculate sunrise and sunset
        const dayInfo = this.calculateDayInfo(latitude, longitude, eqTime, now);
        const yesterdayInfo = this.calculateDayInfo(latitude, longitude, eqTime, yesterday);

        if (dayInfo.polarNight) {
          // Polar night - sun never rises
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
    // Longitude divided by 15 gives the time zone offset in hours
    const longitudeOffset = longitude / 15;

    // Get equation of time from solar parameters
    const { eqTime } = this.calculateSolarParameters(now);

    // Calculate solar time
    const msPerHour = 3600000;
    const utcTimestamp = now.getTime();
    const solarTime = new Date(utcTimestamp + (longitudeOffset + eqTime) * msPerHour);

    return { solarTime, longitudeOffset, eqTime };
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
    // Constants
    const msPerHour = 60 * 60 * 1000;
    const minutesPerHour = 60;
    const longitudeOffset = longitude / 15;
    const latRad = this.degreesToRadians(latitude);
    
    // Sunrise/sunset occurs when zenith angle is 90.833 degrees (accounting for refraction and solar disc diameter)
    const zenith = this.degreesToRadians(90.833);

    // Solar noon is at 12:00 local standard time
    const solarNoon = new Date(date);
    solarNoon.setHours(12, 0, 0, 0);

    const localNoon = new Date(solarNoon.getTime() - (solarNoon.getTimezoneOffset() / minutesPerHour + longitudeOffset + eqTime) * msPerHour);    

    // Calculate solar declination at solar noon
    const { declination } = this.calculateSolarParameters(localNoon);
    
    // Sunrise/sunset hour angle
    const cosHourAngle = (Math.cos(zenith) - Math.sin(latRad) * Math.sin(declination)) / 
                         (Math.cos(latRad) * Math.cos(declination));
    
    // Handle edge cases: polar day/night
    if (cosHourAngle > 1) {
      // Polar night - sun never rises
      return { 
        sunrise: null, 
        sunset: null, 
        dayLength: 0, 
        polarDay: false, 
        polarNight: true
      };
    }
    
    if (cosHourAngle < -1) {
      // Polar day - sun never sets
      return { 
        sunrise: null, 
        sunset: null, 
        dayLength: 24, 
        polarDay: true, 
        polarNight: false
      };
    }
    
    // Calculate the hour angle in radians
    const hourAngle = Math.acos(cosHourAngle);
    
    // Convert hour angle to hours
    const hourAngleHours = hourAngle * 12 / Math.PI; // Simplified from (hourAngle * 180 / Math.PI) / 15

    // Calculate approximate sunrise and sunset
    const approxSunrise = new Date(localNoon.getTime() - hourAngleHours * msPerHour);
    const approxSunset = new Date(localNoon.getTime() + hourAngleHours * msPerHour);

    // Second pass: refine declination at approximate sunrise and sunset times
    const { declination: sunriseDeclination } = this.calculateSolarParameters(approxSunrise);
    const { declination: sunsetDeclination } = this.calculateSolarParameters(approxSunset);

    // Refined sunrise calculation
    const hourAngleSunrise = Math.acos(
      (Math.cos(zenith) - Math.sin(latRad) * Math.sin(sunriseDeclination)) /
      (Math.cos(latRad) * Math.cos(sunriseDeclination))
    );
    const hourAngleHoursSunrise = hourAngleSunrise * 12 / Math.PI;

    // Refined sunset calculation
    const hourAngleSunset = Math.acos(
      (Math.cos(zenith) - Math.sin(latRad) * Math.sin(sunsetDeclination)) /
      (Math.cos(latRad) * Math.cos(sunsetDeclination))
    );
    const hourAngleHoursSunset = hourAngleSunset * 12 / Math.PI;

    // Calculate final sunrise and sunset times
    const refinedSunrise = new Date(localNoon.getTime() - hourAngleHoursSunrise * msPerHour);
    const refinedSunset = new Date(localNoon.getTime() + hourAngleHoursSunset * msPerHour);

    // Calculate day length in hours
    const dayLength = hourAngleHoursSunrise + hourAngleHoursSunset;

    return { 
      sunrise: refinedSunrise, 
      sunset: refinedSunset, 
      dayLength: dayLength, 
      polarDay: false, 
      polarNight: false
    };
  }
}

// Initialize the app
const app = new SolarTimeApp();


// /**
//  * Solar Time Application
//  *
//  * Calculates and displays solar time, sunrise, sunset, and day length information
//  * based on the user's geolocation.
//  */
// class SolarTimeApp {
//   /**
//    * Initializes the Solar Time Application
//    */
//   constructor() {
//     this.initializeApp();
//   }

//   /**
//    * Sets up event listeners when the DOM is fully loaded
//    */
//   initializeApp() {
//     document.addEventListener('DOMContentLoaded', () => {
//       this.initializeTimeDisplays();
//       this.startTimeUpdates();
//     });
//   }

//   /**
//    * Initializes DOM element references for all time displays
//    */
//   initializeTimeDisplays() {
//     this.solarTimeDisplay = document.getElementById('solar-time');
//     this.longitudinalTimeDisplay = document.getElementById('longitudinal-time');
//     this.utcTimeDisplay = document.getElementById('utc-time');
//     this.equationTimeDisplay = document.getElementById('equation-time');
//     this.sunriseDisplay = document.getElementById('sunrise-time');
//     this.sunsetDisplay = document.getElementById('sunset-time');
//     this.dayLengthDisplay = document.getElementById('day-length');
//     this.dayLengthChangeDisplay = document.getElementById('day-length-change');
//   }

//   /**
//    * Starts the time update processes
//    * Updates immediately and then every second thereafter
//    */
//   startTimeUpdates() {
//     this.updateUtcTime();
//     this.getTimeAndLocation(); // Initial call

//     setInterval(() => {
//       this.updateUtcTime();
//       // Only recalculate location-dependent values less frequently if desired,
//       // but for a clock, every second is fine.
//       this.getTimeAndLocation();
//     }, 1000);
//   }

//   /**
//    * Updates the UTC time display
//    */
//   updateUtcTime() {
//     const now = new Date();
//     this.utcTimeDisplay.textContent = this.formatUtcTime(now);
//   }

//   /**
//    * Formats time in local timezone as HH:MM:SS
//    * Kept for potential future use, but not for solar time display.
//    * @param {Date} date - Date object to format
//    * @returns {string} Formatted time string
//    */
//   formatLocalTime(date) {
//     return date.toLocaleTimeString([], {
//       hour12: false,
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit'
//     });
//   }

//   /**
//    * Formats time in UTC timezone as HH:MM:SS
//    * @param {Date} date - Date object to format
//    * @returns {string} Formatted UTC time string
//    */
//   formatUtcTime(date) {
//     return date.toLocaleTimeString([], {
//       hour12: false,
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//       timeZone: 'UTC'
//     });
//   }

//   /**
//    * Converts decimal hours to hours, minutes, seconds components
//    * @param {number} hours - Decimal hours to convert
//    * @returns {Object} Object with hours, minutes, seconds components
//    */
//   hoursToComponents(hours) {
//     const totalSeconds = Math.round(Math.abs(hours) * 3600); // Use rounding for seconds
//     const wholeSeconds = totalSeconds % 60;
//     const totalMinutes = Math.floor(totalSeconds / 60);
//     const wholeMinutes = totalMinutes % 60;
//     const wholeHours = Math.floor(totalMinutes / 60);

//     // Handle potential rounding leading to 60 seconds/minutes
//     // Although unlikely with Math.round on totalSeconds, it's safer.
//     // This is less critical now we format HH:MM:SS directly, but good practice.

//     return {
//       hours: wholeHours,
//       minutes: wholeMinutes,
//       seconds: wholeSeconds
//     };
//   }

//   /**
//    * Formats time components with leading zeros
//    * @param {number} hours - Hours component
//    * @param {number} minutes - Minutes component
//    * @param {number} seconds - Seconds component
//    * @returns {string} Formatted time string (HH:MM:SS)
//    */
//   formatTimeComponents(hours, minutes, seconds) {
//     return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
//   }

//   /**
//    * Formats a time value (like Solar Time) from decimal hours.
//    * @param {number} decimalHours - Time in hours (0 to <24)
//    * @returns {string} Formatted time string (HH:MM:SS)
//    */
//   formatTimeFromDecimalHours(decimalHours) {
//     // Ensure the value is within [0, 24)
//     let normalizedHours = decimalHours % 24;
//     if (normalizedHours < 0) {
//       normalizedHours += 24;
//     }
//     const { hours: h, minutes: m, seconds: s } = this.hoursToComponents(normalizedHours);
//     return this.formatTimeComponents(h, m, s);
//   }


//   /**
//    * Formats time delta with sign (+ or -) in HH:MM:SS format
//    * @param {number} hours - Hours to format
//    * @returns {string} Formatted time delta string
//    */
//   formatTimeDelta(hours) {
//     const sign = hours < 0 ? '-' : '+';
//     // Use absolute value for components calculation
//     const { hours: h, minutes: m, seconds: s } = this.hoursToComponents(Math.abs(hours));
//     return `${sign}${this.formatTimeComponents(h, m, s)}`;
//   }

//   /**
//    * Formats duration in HH:MM:SS format without sign
//    * @param {number} hours - Hours to format
//    * @returns {string} Formatted duration string
//    */
//   formatDuration(hours) {
//     // Ensure non-negative duration
//     const nonNegativeHours = Math.max(0, hours);
//     const { hours: h, minutes: m, seconds: s } = this.hoursToComponents(nonNegativeHours);
//     // Handle edge case for exactly 24 hours (polar day)
//     if (Math.abs(hours - 24) < 1e-9) { // Allow for small floating point errors
//         return "24:00:00";
//     }
//     return this.formatTimeComponents(h, m, s);
//   }

//   /**
//    * Formats day length change with sign (+ or -) in MM:SS or HH:MM:SS format
//    * @param {number} minutes - Minutes of change
//    * @returns {string} Formatted day length change
//    */
//   formatDayLengthChange(minutes) {
//     const sign = minutes < 0 ? '-' : '+';
//     const absMinutes = Math.abs(minutes);
//     const totalSeconds = Math.round(absMinutes * 60);
//     const secs = totalSeconds % 60;
//     const totalMins = Math.floor(totalSeconds / 60);
//     const mins = totalMins % 60;
//     const hrs = Math.floor(totalMins / 60);

//     if (hrs > 0) {
//        return `${sign}${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
//     } else {
//        return `${sign}${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
//     }
//   }

//   /** Sets error message on all displays */
//   setErrorOnDisplays(message) {
//     const displays = [
//       this.solarTimeDisplay, this.longitudinalTimeDisplay, this.utcTimeDisplay,
//       this.equationTimeDisplay, this.sunriseDisplay, this.sunsetDisplay,
//       this.dayLengthDisplay, this.dayLengthChangeDisplay
//     ];
//     displays.forEach(display => {
//       if (display) display.textContent = message; // Check if display exists
//     });
//     // Ensure UTC display still tries to update or shows error related to UTC
//     if (this.utcTimeDisplay) {
//          try {
//             this.updateUtcTime(); // Try updating UTC even if others fail
//          } catch (e) {
//             this.utcTimeDisplay.textContent = "UTC Error";
//          }
//     } else {
//         console.error("UTC display element not found");
//     }
//   }

//   /** Converts degrees to radians */
//   degreesToRadians(degrees) {
//     return degrees * (Math.PI / 180);
//   }

//   /** Calculates the fraction of the tropical year elapsed */
//   getFractionOfYear(targetTimestamp) {
//     // ... (implementation remains the same)
//     if (typeof targetTimestamp !== 'number') {
//       console.error("Invalid targetTimestamp. Must be milliseconds UTC.");
//       return NaN;
//     }
//     const TROPICAL_YEAR_DAYS = 365.24219;
//     const TROPICAL_YEAR_MS = TROPICAL_YEAR_DAYS * 24 * 60 * 60 * 1000;
//     const VERNAL_EQUINOX_2000_MS = Date.UTC(2000, 2, 20, 7, 35, 0);
//     const elapsedMs = targetTimestamp - VERNAL_EQUINOX_2000_MS;
//     const elapsedTropicalYears = elapsedMs / TROPICAL_YEAR_MS;
//     let fraction = elapsedTropicalYears % 1;
//     if (fraction < 0) {
//       fraction += 1;
//     }
//     return fraction;
//   }

//   /** Calculates approximate solar declination from time */
//   calculateDeclinationFromTime(timeInput) {
//     // ... (implementation remains the same)
//     let targetTimestamp;
//     if (timeInput instanceof Date) {
//       targetTimestamp = timeInput.getTime();
//     } else if (typeof timeInput === 'number') {
//       targetTimestamp = timeInput;
//     } else {
//       console.error("Invalid input for calculateDeclinationFromTime.");
//       return NaN;
//     }
//     const fractionOfYear = this.getFractionOfYear(targetTimestamp);
//     if (isNaN(fractionOfYear)) return NaN;
//     const angleRad = 2 * Math.PI * fractionOfYear;
//     const EARTH_OBLIQUITY_DEG = 23.439;
//     const declinationDeg = EARTH_OBLIQUITY_DEG * Math.sin(angleRad);
//     return declinationDeg;
//   }

//   /** Calculates approximate Equation of Time (EoT) from time */
//   calculateEoTFromTime(timeInput) {
//      // ... (implementation remains the same)
//     let targetTimestamp;
//     if (timeInput instanceof Date) {
//       targetTimestamp = timeInput.getTime();
//     } else if (typeof timeInput === 'number') {
//       targetTimestamp = timeInput;
//     } else {
//       console.error("Invalid input for calculateEoTFromTime.");
//       return NaN;
//     }
//     const fractionOfYear = this.getFractionOfYear(targetTimestamp);
//     if (isNaN(fractionOfYear)) return NaN;
//     const angleRad = 2 * Math.PI * fractionOfYear;
//     const term1 = 9.87 * Math.sin(2 * angleRad);
//     const term2 = -7.53 * Math.cos(angleRad);
//     const term3 = -1.5 * Math.sin(angleRad);
//     const eotMinutes = term1 + term2 + term3;
//     return eotMinutes; // Return in minutes
//   }

//   /** Calculate solar parameters (equation of time, declination) for a given date */
//   calculateSolarParameters(date) {
//     const eqTimeMinutes = this.calculateEoTFromTime(date);
//     const eqTimeHours = eqTimeMinutes / 60; // EqT in hours

//     const declinationDegrees = this.calculateDeclinationFromTime(date);
//     const declinationRadians = this.degreesToRadians(declinationDegrees); // Declination in radians

//     return { eqTimeHours, declinationRadians, eqTimeMinutes }; // Return both forms of EqT and declination in radians
//   }

//   /** Get user's location and calculate all solar time values */
//   getTimeAndLocation() {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition((position) => {
//         const latitude = position.coords.latitude;
//         const longitude = position.coords.longitude;
//         const now = new Date(); // Current local time
//         const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Approx yesterday UTC

//         // Calculate current solar parameters
//         const { eqTimeHours, eqTimeMinutes } = this.calculateSolarParameters(now);

//         // Calculate Apparent Solar Time (AST)
//         const { apparentSolarTimeHours, longitudeOffsetHours } = this.calculateApparentSolarTime(longitude, eqTimeHours, now);

//         // Display Solar Time directly formatted from decimal hours
//         this.solarTimeDisplay.textContent = this.formatTimeFromDecimalHours(apparentSolarTimeHours);
//         this.longitudinalTimeDisplay.textContent = this.formatTimeDelta(longitudeOffsetHours); // Offset from UTC to LMT
//         this.equationTimeDisplay.textContent = this.formatTimeDelta(eqTimeHours); // Offset from LMT to AST


//         // --- Sunrise, Sunset, Day Length ---
//         // Use UTC noon for calculations to avoid DST issues in midpoint calc
//         const todayUtcNoon = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 12, 0, 0));
//         const yesterdayUtcNoon = new Date(todayUtcNoon.getTime() - 24 * 60 * 60 * 1000);

//         const dayInfo = this.calculateDayInfo(latitude, longitude, todayUtcNoon);
//         const yesterdayInfo = this.calculateDayInfo(latitude, longitude, yesterdayUtcNoon);

//         if (dayInfo.polarNight) {
//           this.sunriseDisplay.textContent = "Polar Night";
//           this.sunsetDisplay.textContent = "Polar Night";
//           this.dayLengthDisplay.textContent = "00:00:00";
//            // Day length change is tricky near polar regions, could be zero or N/A
//           this.dayLengthChangeDisplay.textContent = this.calculateDayLengthChange(dayInfo, yesterdayInfo);
//         } else if (dayInfo.polarDay) {
//           this.sunriseDisplay.textContent = "Polar Day";
//           this.sunsetDisplay.textContent = "Polar Day";
//           this.dayLengthDisplay.textContent = "24:00:00";
//           this.dayLengthChangeDisplay.textContent = this.calculateDayLengthChange(dayInfo, yesterdayInfo);
//         } else {
//           // OPTION 1 (Recommended based on request): Format Sunrise/Sunset as AST
//           // this.sunriseDisplay.textContent = this.formatTimeFromDecimalHours(dayInfo.sunriseAST);
//           // this.sunsetDisplay.textContent = this.formatTimeFromDecimalHours(dayInfo.sunsetAST);

//           // OPTION 2 (Alternative): Format Sunrise/Sunset as Local Time
//           this.sunriseDisplay.textContent = this.formatLocalTime(dayInfo.sunriseDate);
//           this.sunsetDisplay.textContent = this.formatLocalTime(dayInfo.sunsetDate);

//           this.dayLengthDisplay.textContent = this.formatDuration(dayInfo.dayLengthHours);
//           this.dayLengthChangeDisplay.textContent = this.calculateDayLengthChange(dayInfo, yesterdayInfo);
//         }

//       }, (error) => {
//         console.error('Error getting geolocation:', error);
//         this.setErrorOnDisplays('Geolocation error');
//       });
//     } else {
//       console.error('No support for geolocation');
//       this.setErrorOnDisplays('Geolocation not supported');
//     }
//   }

//   /**
//    * Calculates the Apparent Solar Time (AST) in decimal hours.
//    * AST = UTC + Longitude Offset + Equation of Time
//    * @param {number} longitude - Longitude in degrees.
//    * @param {number} eqTimeHours - Equation of Time in hours for the current moment.
//    * @param {Date} now - The current Date object.
//    * @returns {Object} Containing apparentSolarTimeHours and longitudeOffsetHours.
//    */
//   calculateApparentSolarTime(longitude, eqTimeHours, now) {
//       // Calculate UTC time in decimal hours
//       const utcHours = now.getUTCHours() +
//                      now.getUTCMinutes() / 60 +
//                      now.getUTCSeconds() / 3600 +
//                      now.getUTCMilliseconds() / 3600000;

//       // Longitude offset in hours (East positive)
//       const longitudeOffsetHours = longitude / 15.0;

//       // Calculate Apparent Solar Time
//       let apparentSolarTimeHours = utcHours + longitudeOffsetHours + eqTimeHours;

//       // Normalize to 0-24 range
//       apparentSolarTimeHours = apparentSolarTimeHours % 24;
//       if (apparentSolarTimeHours < 0) {
//           apparentSolarTimeHours += 24;
//       }

//       return { apparentSolarTimeHours, longitudeOffsetHours };
//   }


//    /**
//    * Calculates the change in day length between two DayInfo objects.
//    * @param {object} todayInfo - Result from calculateDayInfo for today.
//    * @param {object} yesterdayInfo - Result from calculateDayInfo for yesterday.
//    * @returns {string} Formatted string representing the change.
//    */
//   calculateDayLengthChange(todayInfo, yesterdayInfo) {
//       // Handle cases where one day is polar and the other isn't carefully
//       if (todayInfo.polarDay && yesterdayInfo.polarDay) return "+00:00";
//       if (todayInfo.polarNight && yesterdayInfo.polarNight) return "+00:00";
      
//       // If transitioning, the concept of 'change' might be less meaningful or infinite
//       // A simple difference might be misleading. Let's return N/A in mixed cases for now.
//       if (todayInfo.polarDay || todayInfo.polarNight || yesterdayInfo.polarDay || yesterdayInfo.polarNight) {
//           // Could calculate difference from 0 or 24 if needed, but N/A is safer
//           return "N/A"; 
//       }

//       const dayLengthChangeMinutes = (todayInfo.dayLengthHours - yesterdayInfo.dayLengthHours) * 60;
//       return this.formatDayLengthChange(dayLengthChangeMinutes);
//   }


//   /**
//    * Calculate sunrise, sunset, day length, and related times for a specific date (UTC noon used as base).
//    * @param {number} latitude - Latitude in degrees.
//    * @param {number} longitude - Longitude in degrees.
//    * @param {Date} utcNoonDate - Date object representing UTC noon for the desired day.
//    * @returns {Object} Object containing sunrise/sunset info (Date objects and AST), day length, etc.
//    */
//   calculateDayInfo(latitude, longitude, utcNoonDate) {
//     const msPerHour = 3600000;
//     const longitudeOffsetHours = longitude / 15.0;
//     const latRad = this.degreesToRadians(latitude);
//     const zenith = this.degreesToRadians(90.833); // Standard zenith for sunrise/sunset

//     // Calculate EqT and Declination near noon for the first pass
//     // Using UTC noon avoids local time/DST issues for the *date* determination
//     const noonParams = this.calculateSolarParameters(utcNoonDate);
//     const noonEqTimeHours = noonParams.eqTimeHours;
//     const noonDeclinationRad = noonParams.declinationRadians;

//     // Calculate Local Mean Time (LMT) Noon timestamp
//     // LMT Noon occurs when Mean Sun crosses the meridian.
//     // UTC Noon + Longitude Offset = LMT Noon (in UTC)
//     const lmtNoonTimestamp = utcNoonDate.getTime() + longitudeOffsetHours * msPerHour;

//     // Apparent Solar Time (AST) Noon occurs when the true sun crosses the meridian.
//     // AST Noon = LMT Noon + EqT = (UTC Noon + Longitude Offset) + EqT
//     // We calculate this relative to UTC noon
//     const astNoonTimestamp = lmtNoonTimestamp + noonEqTimeHours * msPerHour;
//     const astNoonDate = new Date(astNoonTimestamp);

//     // Hour angle calculation (first pass using noon declination)
//     const cosHourAngle = (Math.cos(zenith) - Math.sin(latRad) * Math.sin(noonDeclinationRad)) /
//                          (Math.cos(latRad) * Math.cos(noonDeclinationRad));

//     // Handle polar day/night
//     if (cosHourAngle > 1) {
//         return { polarNight: true, polarDay: false, dayLengthHours: 0 };
//     }
//     if (cosHourAngle < -1) {
//         return { polarDay: true, polarNight: false, dayLengthHours: 24 };
//     }

//     const hourAngleRad = Math.acos(cosHourAngle);
//     const hourAngleHours = hourAngleRad * 12 / Math.PI; // Half day length in hours

//     // --- Refinement Pass (Optional but good practice) ---
//     // Calculate approximate event times to get better EqT/Declination
//     const approxSunriseTimestamp = astNoonTimestamp - hourAngleHours * msPerHour;
//     const approxSunsetTimestamp = astNoonTimestamp + hourAngleHours * msPerHour;

//     const sunriseParams = this.calculateSolarParameters(new Date(approxSunriseTimestamp));
//     const sunsetParams = this.calculateSolarParameters(new Date(approxSunsetTimestamp));

//     // Recalculate hour angles with refined declinations
//     const cosHASunrise = (Math.cos(zenith) - Math.sin(latRad) * Math.sin(sunriseParams.declinationRadians)) /
//                          (Math.cos(latRad) * Math.cos(sunriseParams.declinationRadians));
//     const cosHASunset = (Math.cos(zenith) - Math.sin(latRad) * Math.sin(sunsetParams.declinationRadians)) /
//                         (Math.cos(latRad) * Math.cos(sunsetParams.declinationRadians));

//     // Clamp values just in case float errors push them slightly out of [-1, 1]
//     const hourAngleSunriseRad = Math.acos(Math.max(-1, Math.min(1, cosHASunrise)));
//     const hourAngleSunsetRad = Math.acos(Math.max(-1, Math.min(1, cosHASunset)));

//     const hourAngleHoursSunrise = hourAngleSunriseRad * 12 / Math.PI;
//     const hourAngleHoursSunset = hourAngleSunsetRad * 12 / Math.PI;

//     // Calculate final event timestamps relative to AST Noon, adjusted by the EqT *at that time*
//     // AST Noon is our reference point (12:00:00 AST)
//     const finalSunriseTimestamp = astNoonTimestamp - hourAngleHoursSunrise * msPerHour;
//     const finalSunsetTimestamp = astNoonTimestamp + hourAngleHoursSunset * msPerHour;

//     // Calculate Day Length
//     // Day Length is the difference between sunset and sunrise AST times
//     // Or sum of the two hour angles (morning + afternoon)
//     const dayLengthHours = hourAngleHoursSunrise + hourAngleHoursSunset; // Total duration sun is above horizon

//     // --- Calculate AST for Sunrise/Sunset ---
//     // Apparent Solar Time is 12 - hourAngleHoursSunrise for sunrise
//     // Apparent Solar Time is 12 + hourAngleHoursSunset for sunset
//     const sunriseAST = 12.0 - hourAngleHoursSunrise;
//     const sunsetAST = 12.0 + hourAngleHoursSunset;


//     return {
//       sunriseDate: new Date(finalSunriseTimestamp), // UTC timestamp of sunrise
//       sunsetDate: new Date(finalSunsetTimestamp),   // UTC timestamp of sunset
//       sunriseAST: sunriseAST, // Sunrise time in decimal hours AST (e.g., 5.75 = 05:45:00 AST)
//       sunsetAST: sunsetAST,   // Sunset time in decimal hours AST (e.g., 18.25 = 18:15:00 AST)
//       dayLengthHours: dayLengthHours,
//       polarDay: false,
//       polarNight: false
//     };
//   }
// }

// // Initialize the app
// const app = new SolarTimeApp();