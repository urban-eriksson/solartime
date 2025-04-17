# Solartime

**Solartime** is a web application that displays key solar timing information based on your current location. Specifically, it provides:

- **Local Solar Time** – the actual time based on the Sun’s position in your sky (as a sundial would read).
- **Sunrise and Sunset Times** – the exact local clock times when the Sun rises and sets each day.
- **Day Length** – how long the Sun stays above the horizon each day.
- **Day Length Change** – the difference in daylight duration from one day to the next.

---

## How Solar Time Is Calculated

Solar time (apparent solar time) is computed from the current UTC time by applying two corrections:

1. **Equation of Time (EOT)**
2. **Longitudinal Offset**

The combined formula is:

```math
\text{Solar Time} = \text{UTC} + \Delta t_{EOT} + \Delta t_{longitude}
```

### Equation of Time

Solartime calculates the **Equation of Time** from the Julian Day (JD) using:

```math
D = 0.01720197\,(JD - JD_{2000}) + 6.24004077
```  

where \(JD_{2000}\) is the Julian Day of 2000‑01‑01 (UTC).

Then the EOT in **hours** is:

```math
\Delta t_{EOT} = \frac{-7.659\,\sin(D) \;+\; 9.863\,\sin\bigl(2D + 3.5932\bigr)}{60}
```

- The numerator is in **minutes**, so division by 60 converts to hours.  
- Positive $`\Delta t_{EOT}`$ means solar time runs ahead of mean time; negative means it lags.

[EOT on Wikipedia](https://en.wikipedia.org/wiki/Equation_of_time)

### Longitudinal Offset

The **longitudinal offset** corrects for your position east or west of the prime meridian (UTC reference). Earth rotates 360° in 24 h (15°/h), so:

```math
\Delta t_{longitude} = \frac{\text{Longitude}_{local}}{15}\quad[\text{hours}]
```

Longitudes east are positive (solar time ahead of UTC); west are negative.

---

## How Sunrise and Sunset Are Calculated

Solartime finds sunrise and sunset by solving for the Sun’s **hour angle** when its center reaches an altitude of \(-0.833°\) (accounts for refraction and solar radius) via:

```math
\cos\omega_0 = \frac{\sin(a) - \sin(\phi)\sin(\delta)}{\cos(\phi)\cos(\delta)}
```

- $`\phi`$ = observer’s latitude
- $`\delta`$ = solar declination (see below)
- $`a = -0.833°`$

### Solar Declination

Solar declination $`\delta`$ is computed from $`JD`$ as follows:

1. Compute days since J2000:  
   $`n = JD - JD_{2000}`$
2. Mean anomaly in radians:  
   $`g = \bigl(357.529 + 0.98560028\,n\bigr)\,\times\frac{\pi}{180}`$
3. Ecliptic longitude in radians:  
   $`L = \bigl(280.459 + 0.98564736\,n + 1.915\sin g + 0.020\sin(2g)\bigr)\,\times\frac{\pi}{180}`$
4. Obliquity:  
   $`\varepsilon = 23.439°\times\frac{\pi}{180}`$
5. Declination:  
   $`\delta = \arcsin\bigl(\sin\varepsilon\,\sin L\bigr)`$

This yields $`\delta`$ in radians for accurate hour‑angle solution.

[Declination of the Sun on Wikipedia](https://en.wikipedia.org/wiki/Position_of_the_Sun#Declination_of_the_Sun_as_seen_from_Earth)


### Iterative Refinement

To achieve sub-second accuracy, Solartime:

1. **Initial guess** uses $`\delta`$ at midnight UTC to solve $`\omega_0`$ and get approximate rise/set times.  
2. **Loop**: at each approximate time $`t`$, recompute $`JD`$ as $`JD + t/24`$, recalc $`\delta`$, resolve $`\omega_0`$, update $`t`$.  
3. Repeat until changes in \(t\) are below a tolerance (~0.0001 h ≈ 0.36 s) or after 6 iterations.

This method accounts for the declination’s daily change and yields precise sunrise and sunset times.

[Sunrise equation on Wikipedia](https://en.wikipedia.org/wiki/Sunrise_equation)

### Why 90.833° is Used

The standard angle of **90.833°** from the zenith (i.e. \(-0.833°\) altitude) corrects for:

- **Atmospheric Refraction** (~0.57°)  
- **Solar Disk Radius** (~0.27°)

Ensures calculated times match observed events at sea level.

[Atmospheric Refraction on Wikipedia](https://en.wikipedia.org/wiki/Atmospheric_refraction)

---

## References

- [Equation of Time](https://en.wikipedia.org/wiki/Equation_of_time)
- [Sunrise Equation](https://en.wikipedia.org/wiki/Sunrise_equation)
- [Position of the Sun](https://en.wikipedia.org/wiki/Position_of_the_Sun)
- [Atmospheric Refraction](https://en.wikipedia.org/wiki/Atmospheric_refraction)

Enjoy exploring daylight dynamics with **Solartime**!

