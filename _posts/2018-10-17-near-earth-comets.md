---
layout: post
title:  "Brief musings on near-Earth comets"
date:   2018-10-17
tags:
  - D3
  - visualization
  - astronomy
---

Here's a scatterplot of near-Earth comets (data source: [NASA](https://data.nasa.gov/Space-Science/Near-Earth-Comets-Orbital-Elements/b67r-rgxc)). We see that orbits with small eccentricity tend to lie close to the ecliptic, while more eccentric orbits seem to lie on random planes (see [diagram](http://farside.ph.utexas.edu/teaching/celestial/Celestialhtml/node34.html) for terminology). This could be because the more eccentric objects were captured, whereas the others formed with the Solar System. Another hint that this is the case: inclination is not only closer to zero, but also *note the absence of dots near 180 degrees*, so they're orbiting in the same direction as all the planets.


<div>
    <script src="https://d3js.org/d3.v4.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3-legend/2.25.6/d3-legend.min.js"></script>
    <link rel="stylesheet" href="/assets/css/comets.css">
    <svg width="700" height="500"></svg>
    <script src="/assets/scripts/comets.js"></script>
</div>

After I plotted this I noticed a bunch of points that seemed to lie on a straight line in this space (red dots). Checking the data showed that these are fragments of [Schwassmann-Wachmann 3](https://en.wikipedia.org/wiki/73P/Schwassmann%E2%80%93Wachmann), a comet that is disintegrating. It's interesting what a visualization can reveal: before plotting this I'd never heard of this comet. I suspect a simple model of disintegration will explain it. 

I'd like to come back to this someday.


