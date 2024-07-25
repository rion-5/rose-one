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
			.append('svg') // #1 Append an SVG container.
			.attr('viewBox', '0 0 700 550')
			.attr('preserveAspectRatio', 'XminYmin meet')
			.attr('width', '100%')
			.attr('height', '100%')
			.classed('svg-content-responsive', true);

		d3.csv('./data.csv').then((data: d3.DSVRowArray<string>) => {
			// #2 Load the dataset.
			const formattedData: Data[] = data.map((d) => ({
				// #3 Format the data.
				technology: d.technology as string,
				count: +d.count!
			}));

			const maxCount = d3.max(formattedData, (d) => d.count) || 0; // Get max count value

			console.log(formattedData); // #4 Measure the dataset.
			console.log(d3.max(formattedData, (d) => d.count));
			console.log(d3.min(formattedData, (d) => d.count));
			console.log(d3.extent(formattedData, (d) => d.count));
			formattedData.sort((a, b) => b.count - a.count); // #5 Sort the data in descending order.

			createViz(formattedData, maxCount);
		});

		const createViz = (data: Data[], maxCount: number) => {
			// #6 Pass the data to another function.
			const xScale = d3
				.scaleBand<string>()
				.domain(data.map((d) => d.technology))
				.range([0, 600])
				.paddingInner(0.2);

			const yScale = d3.scaleLinear().domain([0, maxCount]).range([450, 50]);

			const barAndLabel = svg
				.selectAll('rect')
				.data(data)
				.join('rect')
				.attr('transform', (d) => `translate(${xScale(d.technology)}, ${yScale(d.count)})`);

			barAndLabel
				.attr('width', xScale.bandwidth())
				.attr('height', (d) => 450 - yScale(d.count))
				.attr('x', 30)
				.attr('y', 0)
				.attr('fill', 'green');
			
		};
		// #7 Function where we’ll build the bar chart
	});
</script>

<div class="responsive-svg-container"></div>
