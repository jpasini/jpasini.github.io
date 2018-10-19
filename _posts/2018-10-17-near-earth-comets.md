---
layout: post
title:  "Near-Earth Comets"
date:   2018-10-16 22:36:15 -0400
categories: d3 visualization astronomy
---

Here's a scatterplot of Near-Earth Comets (data source: [NASA](https://data.nasa.gov/Space-Science/Near-Earth-Comets-Orbital-Elements/b67r-rgxc)). We see that orbits with small eccentricity tend to lie close to the ecliptic, while more eccentric orbits seem to lie on random planes (see [diagram](http://farside.ph.utexas.edu/teaching/celestial/Celestialhtml/node34.html) for terminology). This could be because the more eccentric objects were captured, whereas the others formed with the Solar System. Another hint that this is the case is that inclination is not only closer to zero, but *also only under 90 degrees*, meaning that they're orbiting in the same direction as Earth and most planets.


<div>
    <script src="https://d3js.org/d3.v4.min.js"></script>
    <!--<script src="https://cdnjs.cloudflare.com/ajax/libs/d3-legend/2.24.0/d3-legend.min.js"></script>-->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3-legend/2.25.6/d3-legend.min.js"></script>
    <style>
      .tick {
        font-size: 2em;
      }
      .axis line {
        stroke: #ddd;
      }
      .axis text {
        fill: #666;
      }
      .axis-label {
        fill: #666;
        font-size: 2em;
      }
      .comet {
        opacity: 0.3;
      }
      .comet:hover {
        opacity: 1;
        fill: #ffa251;
      }
      .schwassmann {
        opacity: 0.7;
      }
      .long {
        opacity: 0.4;
      }
      .plotTitle {
        font-size: 1.5em;
        fill: #666;
      }
      .color-legend, .r-legend {
        font-size: 1em;
        fill: #666;
      }
    </style>
    <svg width="700" height="500"></svg>
    <script>
      const xValue = d => d.e;
      const yValue = d => d['i (deg)'];
      const rValue = d => d['P (yr)'];
      const colorValue = d => d.type;
      
      const xLabel = 'Eccentricity';
      const yLabel = 'Inclination to ecliptic (degrees)';
      const rLabel = 'Period (yrs)';
      
      const period_limit = 15;
      
      const margin = { left: 80, right: 110, top: 40, bottom: 110 };

      const svg = d3.select('svg');
      const width = svg.attr('width');
      const height = svg.attr('height');
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;
      const g = svg.append('g')
          .attr('transform', `translate(${margin.left},${margin.top})`);

			g.append("text")
        	.attr("x", (innerWidth / 2))             
        	.attr("y", -20)
        	.attr("text-anchor", "middle")
      		.attr('class', 'plotTitle')
        	.text("Near-Earth Comets");
      
      const xAxisG = g.append('g')
          .attr('transform', `translate(0, ${innerHeight})`)
      		.attr('class', 'axis');
      const yAxisG = g.append('g')
      		.attr('class', 'axis');
      const colorLegendG = g.append('g')
          .attr('transform', `translate(${innerWidth*.4}, ${innerHeight+50})`);
      const radiusLegendG = g.append('g')
      		.attr('transform', `translate(${innerWidth+20}, 20)`);
      
      xAxisG.append('text')
          .attr('class', 'axis-label')
          .attr('x', innerWidth *.2)
          .attr('y', 60)
          .text(xLabel);
      
      yAxisG.append('text')
          .attr('class', 'axis-label')
          .attr('x', -innerHeight / 2)
          .attr('y', -60)
          .attr('transform', `rotate(-90)`)
          .style('text-anchor', 'middle')
          .text(yLabel);
      
      const xScale = d3.scaleLinear();
      const yScale = d3.scaleLinear();
      const rScale = d3.scaleSqrt();
      const colorScale = d3.scaleOrdinal()
      	.domain(['Schwassmann-Wachmann 3 fragment', 'Period > 15 yrs', 'Other'])
      	.range(['#e31a1c','#1f78b4','#333']);

      const xAxis = d3.axisBottom()
        .scale(xScale)
        .tickPadding(10)
        .tickSize(-innerHeight)
      	.tickValues([0.5, 0.6, 0.7, 0.8, 0.9, 1])
      	.tickFormat(d3.format(',.1f'));

      const yAxis = d3.axisLeft()
        .scale(yScale)
        .tickPadding(8)
        .tickSize(-innerWidth)
      	.tickValues([0, 30, 60, 90, 120, 150, 180]);

      const colorLegend = d3.legendColor()
        .scale(colorScale)
        .shape('circle');

      const radiusLegend = d3.legendSize()
        .scale(rScale)
      	.cells([5,10,50,100])
      	.shapePadding(25)
        .shape('circle')
      	.labelFormat('0')
      	.title(rLabel);

      const row = d => {
        d.e = +d.e;
        d['i (deg)'] = +d['i (deg)'];
        d['Q (AU)'] = +d['Q (AU)'];
        d['q (AU)'] = +d['q (AU)'];
        d['P (yr)'] = +d['P (yr)'];
        d['w (deg)'] = +d['w (deg)'];
        d['TP (TDB)'] = +d['TP (TDB)'];
        d['Epoch (TDB)'] = +d['Epoch (TDB)'];
        d['Node (deg)'] = +d['Node (deg)'];
        d.class = d.Object.startsWith('73P/Schwassmann') ? 'comet schwassmann' :  d['P (yr)'] > period_limit ?  'comet long' :  'comet';
        d.type = d.Object.startsWith('73P/Schwassmann') ? 'Schwassmann-Wachmann 3 fragment' :  d['P (yr)'] > period_limit ?  'Period > ' + period_limit + ' yrs' :  'Other';
        return d;
      };

      d3.csv('/assets/data/comets.csv', row, data => {
        
        xScale
          .domain([0.5, 1]) // d3.extent(data, xValue))
          .range([0, innerWidth])
          .nice();

        yScale
          .domain([0, 180]) //d3.extent(data, yValue))
          .range([innerHeight, 0]);

        rScale
        	.domain([0, d3.max(data, rValue)])
        	.range([0, 35]);

        g.selectAll('circle').data(data)
          .enter().append('circle')
        		.attr('class', d => d.class)
            .attr('cx', d => xScale(xValue(d)))
            .attr('cy', d => yScale(yValue(d)))
            .attr('r', d => rScale(rValue(d)))
            .attr('fill', d => colorScale(colorValue(d)))
        	.append('title')
        		.text(d => d.Object + '\n'
                  + 'period: ' + d['P (yr)'] + ' years');
        
        xAxisG.call(xAxis);
        yAxisG.call(yAxis);
        colorLegendG.call(colorLegend)
        		.attr('class', 'color-legend');

        radiusLegendG.call(radiusLegend)
        		.attr('class','r-legend');
      });
    </script>
</div>

After I plotted this I noticed a bunch of points that seemed to lie on a straight line in this space (red dots). Checking the data showed that these are fragments of [Schwassmann-Wachmann 3](https://en.wikipedia.org/wiki/73P/Schwassmann%E2%80%93Wachmann), a comet that is disintegrating. It's interesting what a visualization can reveal. Before plotting this I'd never heard of this comet. I suspect a simple model of disintegration will explain this. I'd like to come back to this someday.


