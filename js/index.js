/*
 * Solartime javaScript module
 * ---------------------------------------
 * Accurate solar‑time, sunrise, sunset and day‑length calculations
 * using Julian Days, the high‑accuracy Equation of Time formula
 * and iterative refinement of solar declination at rise/set.
 */

class SolarTimeApp {
  /* ---- constants ---- */
  static DEG   = Math.PI / 180;
  static RAD   = 180 / Math.PI;
  static ZEN   = 90.833;   // standard sunrise/sunset zenith (°)
  static TOL   = 1e-4;     // 0.36 s convergence for rise/set iteration
  static MAXIT = 6;
  static JD2000 = SolarTimeApp.julianDay(2000, 1, 1);

  constructor () { this.initializeApp(); }

  /* ---------- DOM setup & ticking ---------- */
  initializeApp () {
    document.addEventListener('DOMContentLoaded', () => {
      this.cacheElements();
      this.refresh();
      setInterval(() => this.refresh(), 1000);
    });
  }

  cacheElements () {
    const id = s => document.getElementById(s);
    this.el = {
      solar:   id('solar-time'),
      longti:  id('longitudinal-time'),
      utc:     id('utc-time'),
      eot:     id('equation-time'),
      sunrise: id('sunrise-time'),
      sunset:  id('sunset-time'),
      length:  id('day-length'),
      change:  id('day-length-change')
    };
  }

  refresh () {
    const nowUTC = new Date();
    this.el.utc.textContent = nowUTC.toLocaleTimeString('en-GB', {hour12:false,timeZone:'UTC'});

    navigator.geolocation?.getCurrentPosition(
      ({coords}) => this.updateAll(nowUTC, coords),
      err => this.showError(err.message)
    );
  }

  showError (msg) {
    Object.values(this.el).forEach(e => e.textContent = msg);
  }

  /* ---------- basic helpers ---------- */
  static pad (n) { return String(n).padStart(2,'0'); }
  static hms (h) {
    // Always show '+' for >=0, '-' for <0
    const sign = h < 0 ? '-' : '+';    
    const a=Math.abs(h);
    const hh=Math.floor(a); const mm=Math.floor((a-hh)*60); const ss=Math.floor((a-hh-mm/60)*3600);
    return sign+`${this.pad(hh)}:${this.pad(mm)}:${this.pad(ss)}`;
  }

  /* ---------- Julian‑Day utilities ---------- */
  static julianDay (yr, mo, dy) {
    if (mo<=2) { yr--; mo+=12; }
    const A=Math.floor(yr/100); const B=2-A+Math.floor(A/4);
    return Math.floor(365.25*(yr+4716))+Math.floor(30.6001*(mo+1))+dy+B-1524.5;
  }

  static solarDeclination (JD) {
    const n = JD - this.JD2000;
    const g = (357.529 + 0.98560028*n) * this.DEG;           // mean anomaly
    const L = (280.459 + 0.98564736*n + 1.915*Math.sin(g) + 0.020*Math.sin(2*g)) * this.DEG;
    const eps = 23.439 * this.DEG;
    return Math.asin(Math.sin(eps)*Math.sin(L));
  }

  static equationOfTime (JD) {
    const D = 0.01720197*(JD-this.JD2000) + 6.24004077;
    return (-7.659*Math.sin(D) + 9.863*Math.sin(2*D + 3.5932))/60; // return hours
  }

  /* ---------- sunrise / sunset with iteration ---------- */
  static hourAngle (latRad, decRad, zen=this.ZEN) {
    const cosH = (Math.cos(zen*this.DEG)-Math.sin(latRad)*Math.sin(decRad)) / (Math.cos(latRad)*Math.cos(decRad));
    if (Math.abs(cosH)>1) return null; // polar day/night
    return Math.acos(Math.min(1,Math.max(-1,cosH)));
  }

  static sunriseSunset (JD0, latDeg) {
    const lat = latDeg*this.DEG;
    // ── first guess using midnight declination
    let dec = this.solarDeclination(JD0);
    let H   = this.hourAngle(lat, dec);
    if (H===null) return {polarDay:H<-1, polarNight:H>1};
    let tRise = 12 - (H*this.RAD)*4/60;  // hours from midnight
    let tSet  = 12 + (H*this.RAD)*4/60;

    for (let i=0;i<this.MAXIT;i++) {
      const decRise = this.solarDeclination(JD0 + tRise/24);
      const decSet  = this.solarDeclination(JD0 + tSet /24);
      const HR = this.hourAngle(lat, decRise);
      const HS = this.hourAngle(lat, decSet);
      if (HR===null||HS===null) break;
      const tRiseNew = 12 - (HR*this.RAD)*4/60;
      const tSetNew  = 12 + (HS*this.RAD)*4/60;
      if (Math.abs(tRiseNew-tRise)<this.TOL && Math.abs(tSetNew-tSet)<this.TOL) {
        tRise=tRiseNew; tSet=tSetNew; break;
      }
      tRise=tRiseNew; tSet=tSetNew;
    }
    console.log(tRise, tSet);
    return {sunrise:tRise, sunset:tSet}; // hours in true solar time
  }

  /* ---------- main update ---------- */
  updateAll (nowUTC, {latitude, longitude}) {
    // --- EOT & solar‑time --------------------------------
    const JD_now = SolarTimeApp.julianDay(nowUTC.getUTCFullYear(), nowUTC.getUTCMonth()+1, nowUTC.getUTCDate()) +
                   (nowUTC.getUTCHours()+nowUTC.getUTCMinutes()/60+nowUTC.getUTCSeconds()/3600)/24;

    const eotHours = SolarTimeApp.equationOfTime(JD_now);         // hours
    const longOffset = longitude/15;                              // hours
    const solarTimeDate = new Date(nowUTC.getTime() + (longOffset + eotHours)*3600*1000);

    this.el.solar.textContent  = solarTimeDate.toLocaleTimeString('en-GB',{hour12:false,timeZone:'UTC'});
    this.el.longti.textContent = SolarTimeApp.hms(longOffset);
    this.el.eot.textContent    = SolarTimeApp.hms(eotHours);

    // --- sunrise / sunset --------------------------------
    const JD_midnight = Math.floor(JD_now); // 0h UTC of current day
    const {sunrise, sunset, polarDay, polarNight} = SolarTimeApp.sunriseSunset(JD_midnight, latitude);

    if (polarNight) {
      this.el.sunrise.textContent = this.el.sunset.textContent = 'Sun never rises';
      this.el.length.textContent = '00:00:00';
      this.el.change.textContent = 'N/A';
      return;
    }
    if (polarDay) {
      this.el.sunrise.textContent = this.el.sunset.textContent = 'Sun never sets';
      this.el.length.textContent = '24:00:00';
      this.el.change.textContent = 'N/A';
      return;
    }

    // Build base Date at 00:00 UTC of today
    const baseDate = Date.UTC(
      nowUTC.getUTCFullYear(),
      nowUTC.getUTCMonth(),
      nowUTC.getUTCDate(),
      0, 0, 0
    );

    // Helper to convert fractional hours → [h, m, s]
    function unpackHMS(decimalHours) {
      const h = Math.floor(decimalHours);
      const m = Math.floor((decimalHours - h) * 60);
      const s = Math.floor(((decimalHours - h) * 60 - m) * 60);
      return [h, m, s];
    }

    // 1) compute UTC event hours
    const riseUtcH = sunrise - eotHours - longOffset;
    const setUtcH  = sunset  - eotHours - longOffset;    

    // 2) unpack to h, m, s
    const [rH, rM, rS] = unpackHMS(riseUtcH);
    const [sH, sM, sS] = unpackHMS(setUtcH);
    
    // 3) build UTC date at your local Y/M/D
    const Y  = nowUTC.getFullYear();
    const Mo = nowUTC.getMonth();    // 0–11
    const D  = nowUTC.getDate();     // 1–31    

    const sunriseUtc = new Date(Date.UTC(Y, Mo, D, rH, rM, rS));
    const sunsetUtc  = new Date(Date.UTC(Y, Mo, D, sH, sM, sS));
    
    // 4) show in local clock time
    this.el.sunrise.textContent =
      sunriseUtc.toLocaleTimeString([], { hour12:false });
    this.el.sunset.textContent  =
      sunsetUtc .toLocaleTimeString([], { hour12:false });    

    const dayLenHours = sunset - sunrise;
    this.el.length.textContent = SolarTimeApp.hms(dayLenHours);

    // --- day‑length change vs. yesterday ------------------
    const JD_yesterday = JD_midnight - 1;
    const {sunrise:srY, sunset:ssY, polarDay:pdY, polarNight:pnY} = SolarTimeApp.sunriseSunset(JD_yesterday, latitude);
    if (pdY||pnY) { this.el.change.textContent = 'N/A'; return; }
    const diffMin = (dayLenHours - (ssY - srY))*60;
    this.el.change.textContent = SolarTimeApp.hms(diffMin/60);
  }
}

// kick‑off
new SolarTimeApp();