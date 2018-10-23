const xValue = d => d.e;
const yValue = d => d['i (deg)'];
const rValue = d => d['P (yr)'];
const colorValue = d => d.type;

const xLabel = 'Eccentricity';
const yLabel = 'Inclination to ecliptic (degrees)';
const rLabel = 'Period (yrs)';

const period_limit = 15;

const margin = { left: 100, right: 110, top: 20, bottom: 110 };

const visualization = d3.select('#visualization');
const visualizationDiv = visualization.node();
const svg = visualization.select('svg');

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

function dataLoaded(data) {
  function redraw(){

    // Extract the width and height that was computed by CSS.
    const width = visualizationDiv.clientWidth;
    const aspectRatio = 16/9;
    const height = visualizationDiv.clientWidth/aspectRatio;
    const centerX = width/2;
    const centerY = height/2;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Use the extracted size to set the size of an SVG element.
    svg
      .attr("width", width)
      .attr("height", height);
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

    let g = svg.selectAll('.visgroup').data([null]);
    g = g
      .enter().append('g')
        .attr('class', 'visgroup')
      .merge(g)
        .attr('transform', `translate(${margin.left},${margin.top})`);

    let xAxisG = g.selectAll('.xaxisgroup').data([null]);
    xAxisG = xAxisG
      .enter().append('g')
        .attr('class', 'xaxisgroup axis')
      .merge(xAxisG)
        .attr('transform', `translate(0, ${innerHeight})`);

    let yAxisG = g.selectAll('.yaxisgroup').data([null]);
    yAxisG = yAxisG
      .enter().append('g')
        .attr('class', 'yaxisgroup axis')
      .merge(yAxisG);

    let colorLegendG = g.selectAll('.color-legend').data([null]);
    colorLegendG = colorLegendG
      .enter().append('g')
        .attr('class', 'color-legend')
      .merge(colorLegendG)
        .attr('transform', `translate(${innerWidth*.4}, ${innerHeight+50})`);

    let radiusLegendG = g.selectAll('.r-legend').data([null]);
    radiusLegendG = radiusLegendG
      .enter().append('g')
        .attr('class', 'r-legend')
      .merge(radiusLegendG)
        .attr('transform', `translate(${innerWidth+20}, 20)`);

    let xAxisLabel = xAxisG.selectAll('.axis-label').data([xLabel]);
    xAxisLabel = xAxisLabel
      .enter().append('text')
        .attr('class', 'axis-label')
        .text(d => d)
      .merge(xAxisLabel)
        .attr('x', innerWidth *.2)
        .attr('y', 60);

    let yAxisLabel = yAxisG.selectAll('.axis-label').data([yLabel]);
    yAxisLabel = yAxisLabel
      .enter().append('text')
        .attr('class', 'axis-label')
        .text(d => d)
      .merge(yAxisLabel)
        .attr('x', -innerHeight / 2)
        .attr('y', -60)
        .attr('transform', `rotate(-90)`)
        .style('text-anchor', 'middle');


    let dataG = g.selectAll('.datagroup').data([null]);
    dataG = dataG
      .enter().append('g')
        .attr('class', 'datagroup')
      .merge(dataG);

    let circles = dataG.selectAll('circle').data(data);
    let circlesEnter = circles
      .enter().append('circle')
        .attr('class', d => d.class);
    circles = circlesEnter
      .merge(circles)
        .attr('cx', d => xScale(xValue(d)))
        .attr('cy', d => yScale(yValue(d)))
        .attr('r', d => rScale(rValue(d)))
        .attr('fill', d => colorScale(colorValue(d)));
    // add the tooltip
    circlesEnter
      .append('title')
        .text(d => d.Object + '\n'
              + 'period: ' + d['P (yr)'] + ' years');

    
    xAxisG.call(xAxis);
    yAxisG.call(yAxis);
    colorLegendG.call(colorLegend);

    radiusLegendG.call(radiusLegend);
  }
  // Draw for the first time to initialize.
  redraw();

  // Redraw based on the new size whenever the browser window is resized.
  window.addEventListener("resize", redraw);
}

d3.csv('/assets/data/comets.csv', row, dataLoaded);
