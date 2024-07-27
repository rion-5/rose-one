<script lang="ts">
import { onMount } from 'svelte';
import * as d3 from 'd3';
import type { NumberValue } from 'd3';

interface TemperatureData {
  date: Date;
  max_temp_F: number;
  min_temp_F: number;
  avg_temp_F: number;
}

onMount(() => {
  // Load the data here
  d3.csv('./data/weekly_temperature.csv', (d: d3.DSVRowString<string>) => {
    // Manually convert the data to the appropriate types
    return {
      date: new Date(d.date as string),
      max_temp_F: +d.max_temp_F,
      min_temp_F: +d.min_temp_F,
      avg_temp_F: +d.avg_temp_F
    } as TemperatureData;
  }).then((data: TemperatureData[]) => {
    console.log('temperature data', data);
    drawLineChart(data);
  });

  // Create the line chart here
  const drawLineChart = (data: TemperatureData[]) => {
    /*******************************/
    /*    Declare the constants    */
    /*******************************/
    const margin = { top: 40, right: 170, bottom: 25, left: 40 };
    const width = 1000;
    const height = 500;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const aubergine = '#75485E';

    /*******************************/
    /*    Append the containers    */
    /*******************************/
    // Append the SVG container
    const svg = d3
      .select('#line-chart')
      .append('svg')
      .attr('viewBox', `0, 0, ${width}, ${height}`);

    // Append the group that will contain the inner chart
    const innerChart = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    /****************************/
    /*    Declare the scales    */
    /****************************/
    // X scale
    const firstDate = new Date(2021, 0, 1);
    const lastDate = d3.max(data, (d) => d.date) as Date;
    const xScale = d3.scaleTime().domain([firstDate, lastDate]).range([0, innerWidth]);

    // Y scale
    const maxTemp = d3.max(data, (d) => d.max_temp_F) as number;
    const yScale = d3.scaleLinear().domain([0, maxTemp]).range([innerHeight, 0]);

    /***************************/
    /*     Append the axes     */
    /***************************/

    // Bottom axis
    const bottomAxis = d3.axisBottom(xScale).tickFormat((date: Date | NumberValue) => {
      if (date instanceof Date) {
        return d3.timeFormat('%b')(date);
      }
      // Handle the case where date is not a Date, though this should not happen with time scales
      return '';
    });
    innerChart
      .append('g')
      .attr('class', 'axis-x')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(bottomAxis);

    d3.selectAll('.axis-x text')
      .attr('x', (d) => {
        const currentMonth = d as Date;
        const nextMonth = new Date(2021, currentMonth.getMonth() + 1, 1);
        return (xScale(nextMonth) - xScale(currentMonth)) / 2;
      })
      .attr('y', '10px');

    // Left axis
    const leftAxis = d3.axisLeft(yScale);
    innerChart.append('g').attr('class', 'axis-y').call(leftAxis);
    d3.selectAll('.axis-y text').attr('x', '-5px');

    // Set the font-family and font-size property of axis labels
    // This could also be handled from a CSS file
    d3.selectAll('.axis-x text, .axis-y text')
      .style('font-family', 'Roboto, sans-serif')
      .style('font-size', '14px');

    // Add label to the y-axis
    svg.append('text').text('Temperature (°F)').attr('y', 20);

    /************************************************/
    /*   Area chart of the temperature variability  */
    /************************************************/
    // Initialize the area generator
    const areaGenerator = d3
      .area<TemperatureData>()
      .x((d) => xScale(d.date))
      .y0((d) => yScale(d.min_temp_F))
      .y1((d) => yScale(d.max_temp_F))
      .curve(d3.curveCatmullRom);

    // Draw the area
    innerChart
      .append('path')
      .attr('d', areaGenerator(data))
      .attr('fill', aubergine)
      .attr('fill-opacity', 0.2);

    /*********************************************/
    /*   Line chart of the average temperature   */
    /*********************************************/
    // Draw the data points
    innerChart
      .selectAll('circle')
      .data(data)
      .join('circle')
      .attr('r', 4)
      .attr('cx', (d) => xScale(d.date))
      .attr('cy', (d) => yScale(d.avg_temp_F))
      .attr('fill', aubergine);

    // Initialize the line/curve generator
    const curveGenerator = d3
      .line<TemperatureData>()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.avg_temp_F))
      .curve(d3.curveCatmullRom);

    // Draw the line/curve
    innerChart
      .append('path')
      .attr('d', curveGenerator(data))
      .attr('fill', 'none')
      .attr('stroke', aubergine);

    /************************/
    /*      Add labels      */
    /************************/

    // Label for line chart
    innerChart
      .append('text')
      .text('Average temperature')
      .attr('x', xScale(lastDate) + 10)
      .attr('y', yScale(data[data.length - 1].avg_temp_F))
      .attr('dominant-baseline', 'middle')
      .attr('fill', aubergine);

    // Annotation for max temperature
    innerChart
      .append('text')
      .text('Maximum temperature')
      .attr('x', xScale(data[data.length - 4].date) + 13)
      .attr('y', yScale(data[data.length - 4].max_temp_F) - 20)
      .attr('fill', aubergine);
    innerChart
      .append('line')
      .attr('x1', xScale(data[data.length - 4].date))
      .attr('y1', yScale(data[data.length - 4].max_temp_F) - 3)
      .attr('x2', xScale(data[data.length - 4].date) + 10)
      .attr('y2', yScale(data[data.length - 4].max_temp_F) - 20)
      .attr('stroke', aubergine)
      .attr('stroke-width', 2);

    // Annotation for min temperature
    innerChart
      .append('text')
      .text('Minimum temperature')
      .attr('x', xScale(data[data.length - 3].date) + 13)
      .attr('y', yScale(data[data.length - 3].min_temp_F) + 20)
      .attr('dominant-baseline', 'hanging')
      .attr('fill', aubergine);
    innerChart
      .append('line')
      .attr('x1', xScale(data[data.length - 3].date))
      .attr('y1', yScale(data[data.length - 3].min_temp_F) + 3)
      .attr('x2', xScale(data[data.length - 3].date) + 10)
      .attr('y2', yScale(data[data.length - 3].min_temp_F) + 20)
      .attr('stroke', aubergine)
      .attr('stroke-width', 2);
  };
});
</script>

<div id="line-chart"></div>