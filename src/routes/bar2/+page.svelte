<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	type Data = {
		technology: string;
		count: number;
	};

	onMount(() => {
		const svg_container = d3.select('.responsive-svg-container')
			.append('svg') // #1 Append an SVG container.
			.attr('viewBox', '0 0 700 550')
			.attr('width', 700).attr('height', 550);  // viewport

		d3.csv('./data.csv').then((data: d3.DSVRowArray<string>) => {
			// #2 Load the dataset.
			const formattedData: Data[] = data.map(d => ({
				// #3 Format the data.
				technology: d.technology,
				count: +d.count     //convert to string
			}));

			const maxCount = d3.max(formattedData, d => d.count) || 0; // Get max count value
			formattedData.sort((a, b) => b.count - a.count); // #5 Sort the data in descending order.
			createViz(formattedData, maxCount);
		});

		function createViz(data: Data[], maxCount: number){  // #7 Function where we’ll build the bar chart
			// #6 Pass the data to another function.
			const xScale = d3.scaleBand()
				.domain(data.map(d => d.technology))
				.range([0, 600])
				.paddingInner(0.2);

			const yScale = d3.scaleLinear()
				.domain([0, maxCount])
				.range([450, 50]);

			const barAndLabel = svg_container
				.selectAll('g')
				.data(data)
				.join('g')
				.attr('transform', d => `translate(${xScale(d.technology)}, ${yScale(d.count)})`);

			barAndLabel
				.append('rect')
				.attr('width', xScale.bandwidth())
				.attr('height', d => 450 - yScale(d.count))
				.attr('x', 30)
				.attr('y', 0)
				.attr('fill', d => d.technology === 'D3.js' ? "olive" : "burlywood");

			svg_container.append('g')
				.attr('transform', `translate(34,438)`)
				.selectAll('text')
				.data(data)
				.join('text')
				.text(d => d.technology)
				.attr('x', d => xScale(d.technology)! + xScale.bandwidth() / 2)
				.attr('y', 20)
				.attr('text-anchor','end')
				.attr(
					'transform',
					d => `rotate(-45, ${xScale(d.technology)! + xScale.bandwidth() /2}, 20)`
				)
				.style('font-family', 'sans-serif')
				.style('font-size', '11px');
			
			barAndLabel.append('text')
				.text(d => d.count)
				.attr('x', xScale.bandwidth() /2 +30)
				.attr('y', -4)
				.attr('text-anchor','middle')
				.style('font-family', 'san-serif')
				.style('font-size', '9px');
			
			svg_container.append('line')
				.attr('x1', 30)
				.attr('y1', 450)
				.attr('x2', 630)
				.attr('y2', 450)
				.attr('stroke','black');
				
		}
		
	});
</script>

<div class="responsive-svg-container"></div>
