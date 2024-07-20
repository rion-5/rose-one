<script lang="ts">
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
  
    let svg: SVGSVGElement;
    const width = 800;
    const height = 600;
  
    const createSvg = () => {
      return d3.select(svg)
        .attr('width', width)
        .attr('height', height);
    };
  
    const drawMap = (svg: any) => {
      const projection = d3.geoMercator()
        .center([127.7669, 35.9078]) // 한국의 중심 좌표
        .scale(5000) // 확대 비율
        .translate([width / 2, height / 2]);
  
      const path = d3.geoPath().projection(projection);
  
      d3.json('./TL_SCCO_CTPRVN.json').then((geojson: any) => {
        svg.append('g')
          .selectAll('path')
          .data(geojson.features)
          .enter().append('path')
          .attr('class', 'region')
          .attr('d', path)
          .on('mouseover', function(this: SVGPathElement, event: MouseEvent, d: any) {
            d3.select(this).attr('fill', '#f00');
          })
          .on('mouseout', function(this: SVGPathElement, event: MouseEvent, d: any) {
            d3.select(this).attr('fill', '#ddd');
          });
      }).catch((error: any) => {
        console.error(error);
      });
    };
  
    onMount(() => {
      const svgElement = createSvg();
      drawMap(svgElement);
    });
  </script>
  
  <style>
    .region {
      fill: #ddd;
      stroke: #333;
    }
    .region:hover {
      fill: #aaa;
    }
  </style>
  
  <svg bind:this={svg}></svg>
  