<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	type Data = {
		technology: string;
		count: number;
	};

	onMount(() => {
		const svg = d3
			.select('.responsive-svg-container')
			.append('svg')
			.attr('viewBox', '0 0 700 550')
			// .attr('preserveAspectRatio', 'xMinYMin meet')
			.attr('width', '100%')
			.attr('height', '100%')
			.classed('svg-content-responsive', true);

		d3.csv('./data.csv').then((data: d3.DSVRowArray<string>) => {
			const formattedData: Data[] = data.map((d) => ({
				technology: d.technology as string,
				count: +d.count!
			}));

			const maxCount = d3.max(formattedData, d => d.count) || 0; // Get max count value


			console.log(formattedData);
			formattedData.sort((a, b) => b.count - a.count);
			createViz(formattedData, maxCount);
		});

		const createViz = (data: Data[], maxCount:number) => {
			const xScale = d3
				.scaleBand<string>()
				.domain(data.map((d) => d.technology))
				.range([0, 600])
				.paddingInner(0.2);

			const yScale = d3.scaleLinear().domain([0, maxCount]).range([450, 50]);

			const barAndLabel = svg
				.selectAll<SVGGElement, Data>('g')
				.data(data)
				.join('g')
				.attr('transform', (d) => `translate(${xScale(d.technology)}, ${yScale(d.count)})`);

			barAndLabel
				.append<SVGRectElement>('rect')
				.attr('width', xScale.bandwidth())
				.attr('height', (d) => 450 - yScale(d.count))
				.attr('x', 30)
				.attr('y', 0)
				.attr('fill', (d) => (d.technology === 'D3.js' ? 'yellowgreen' : 'skyblue'));

			svg
				.append('g')
				.attr('transform', `translate(34, 438)`)
				.selectAll<SVGTextElement, Data>('text')
				.data(data)
				.join('text')
				.text((d) => d.technology)
				.attr('x', (d) => xScale(d.technology)! + xScale.bandwidth() / 2)
				.attr('y', 20)
				.attr('text-anchor', 'end')
				.attr(
					'transform',
					(d) => `rotate(-45, ${xScale(d.technology)! + xScale.bandwidth() / 2}, 20)`
				)
				.style('font-family', 'sans-serif')
				.style('font-size', '11px');

			barAndLabel
				.append<SVGTextElement>('text')
				.text((d) => d.count.toString())
				.attr('x', xScale.bandwidth() / 2 + 30)
				.attr('y', -4)
				.attr('text-anchor', 'middle')
				.style('font-family', 'sans-serif')
				.style('font-size', '9px');

			svg
				.append<SVGLineElement>('line')
				.attr('x1', 30)
				.attr('y1', 450)
				.attr('x2', 630)
				.attr('y2', 450)
				.attr('stroke', 'black');
		};
	});
</script>

<div class="responsive-svg-container"></div>

<style>
	.responsive-svg-container {
		width: 100%;
		height: 100%;
		/* display: flex; */
		justify-content: center;
		align-items: center;
		position: relative;
		padding-bottom: 75%; /* Maintains aspect ratio */
	}

	/* .responsive-svg-container svg {
    position: absolute;
    top: 0;
    left: 0;
  } */
</style>
