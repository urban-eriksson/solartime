# Solartime

**Solartime** is a web application that displays key solar timing information for your location. Specifically, it provides:

- **Local Solar Time** – the actual time based on the Sun’s position in your sky (as a sundial would read).
- **Sunrise and Sunset Times** – the exact times when the Sun rises and sets each day.
- **Day Length** – how long the Sun stays above the horizon each day.
- **Day Length Change** – the difference in daylight duration from one day to the next.

## How Solar Time Is Calculated

Solar time, also known as apparent solar time, is calculated using the current UTC time with two key adjustments:

1. **Equation of Time**
2. **Longitudinal Offset**

### Equation of Time

The **Equation of Time (EOT)** is the difference between solar time (true sun position) and mean clock time. It occurs due to Earth's elliptical orbit and axial tilt, causing the Sun to run slightly ahead or behind mean time.

A simplified formula for EOT is:

```math
EOT \approx 9.87\sin(2B) - 7.53\cos(B) - 1.5\sin(B)
```

where $` B = \frac{360°}{365}(N - 81) `$, and $` N `$ is the day of the year (Jan 1 = 1).

[EOT on Wikipedia](https://en.wikipedia.org/wiki/Equation_of_time)

### Longitudinal Offset

The Earth rotates 360° every 24 hours, meaning it turns 15° per hour or 1° every 4 minutes. The longitudinal offset corrects for the difference in longitude between your location and your time zone’s central meridian:

```math
\text{Offset (minutes)} = 4 \times \text{Longitude difference (degrees)}
```

If you're east of your reference meridian, solar noon is earlier; if west, it's later.

<p align="center"> 
<img src="https://github.com/urban-eriksson/solartime/blob/main/images/timezones.png">
</p>
<p align="center"><b>Figure 2.</b> Longitudinal difference between e.g. Rio de Janeiro and Greenwich</p>



## How Sunrise and Sunset Are Calculated

Calculating sunrise and sunset involves:

1. **Declination of the Sun** – Sun’s angular distance north or south of the equator.
2. **Hour Angle Calculation** – determining how far the Earth must rotate from solar noon to sunrise/sunset.

The sunrise/sunset calculation uses the following formula:

```math
\cos \omega_0 = \frac{\sin a - \sin \phi \sin \delta}{\cos \phi \cos \delta}
```

- $`\phi`$ = observer’s latitude
- $`\delta`$ = solar declination
- $`a`$ = altitude of the Sun at sunrise/sunset (-0.833° to include atmospheric refraction and solar disk radius)

[Sunrise equation on Wikipedia](https://en.wikipedia.org/wiki/Sunrise_equation)

### Declination of the Sun

The solar declination ($`\delta`$) varies between +23.44° and -23.44° throughout the year due to Earth's axial tilt. An approximate formula is:

```math
\delta \approx -23.45° \cos\left(\frac{360°}{365}(N + 10)\right)
```

- $`N`$ = day of the year (Jan 1 = 1).

[Declination of the Sun on Wikipedia](https://en.wikipedia.org/wiki/Position_of_the_Sun#Declination_of_the_Sun_as_seen_from_Earth)

### Why 90.833° is Used for Sunrise/Sunset

Sunrise and sunset calculations typically use an angle of 90.833° from zenith (or -0.833° altitude) because of:

- **Atmospheric Refraction (~0.57°)** – bends sunlight around the horizon.
- **Solar Disk Radius (~0.27°)** – accounts for the Sun’s apparent size.

Thus, the effective solar altitude at sunrise/sunset is about -0.833°, ensuring accuracy in real-world conditions.

[Atmospheric Refraction on Wikipedia](https://en.wikipedia.org/wiki/Atmospheric_refraction)

## References
- [Equation of Time - Wikipedia](https://en.wikipedia.org/wiki/Equation_of_time)
- [Sunrise Equation - Wikipedia](https://en.wikipedia.org/wiki/Sunrise_equation)
- [Position of the Sun - Wikipedia](https://en.wikipedia.org/wiki/Position_of_the_Sun)
- [Atmospheric Refraction - Wikipedia](https://en.wikipedia.org/wiki/Atmospheric_refraction)

Enjoy exploring the dynamics of daylight and solar timing with **Solartime**!

