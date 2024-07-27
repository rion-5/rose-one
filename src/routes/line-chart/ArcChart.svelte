<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	type PrecipitationData = {
		date: Date;
		total_precip_in: number;
	};

	onMount(() => {
		d3.csv('./data/daily_precipitations.csv', (d: d3.DSVRowString<string>) => {
			// Manually convert the data to the appropriate types
			return {
				date: new Date(d.date as string),
				total_precip_in: +d.total_precip_in
			} as PrecipitationData;
		}).then((data: PrecipitationData[]) => {
			console.log('temperature data', data);
			drawArc(data);
		});
		function drawArc(data: PrecipitationData[]) {
			const pieChartWidth = 300;
			const pieChartHeight = 300;
			const svg = d3
				.select('#arc')
				.append('svg')
				.attr('viewBox', [0, 0, pieChartWidth, pieChartHeight]);

			const innerChart = svg
				.append('g')
				.attr('transform', `translate(${pieChartWidth / 2}, ${pieChartHeight / 2})`);

			const numberOfDays = data.length;
			const numberOfDaysWithPrecipitations = data.filter((d) => d.total_precip_in > 0).length;
			const percentageDaysWithPrecipitations = Math.round(
				(numberOfDaysWithPrecipitations / numberOfDays) * 100
			);

			const angleDaysWithPrecipitations_deg = (percentageDaysWithPrecipitations * 360) / 100;
			const angleDaysWithPrecipitations_rad = (angleDaysWithPrecipitations_deg * Math.PI) / 180;

			const arcGenerator = d3.arc().innerRadius(80).outerRadius(120).padAngle(0.02).cornerRadius(6);

			innerChart
				.append('path')
				.attr(
					'd',
					arcGenerator({
						innerRadius: 80,
						outerRadius: 120,
						startAngle: 0,
						endAngle: angleDaysWithPrecipitations_rad
					})
				)
				.attr('fill', '#6EB7C2');

			innerChart
				.append('path')
				.attr(
					'd',
					arcGenerator({
						innerRadius: 80,
						outerRadius: 120,
						startAngle: angleDaysWithPrecipitations_rad,
						endAngle: 2 * Math.PI
					})
				)
				.attr('fill', '#DCE2E2');

			const centroid = arcGenerator.centroid({
				innerRadius: 80,
				outerRadius: 120,
				startAngle: 0,
				endAngle: angleDaysWithPrecipitations_rad
			});

			innerChart
				.append('text')
				.text((d) => d3.format('.0%')(percentageDaysWithPrecipitations / 100))
				.attr('x', centroid[0])
				.attr('y', centroid[1])
				.attr('text-anchor', 'middle')
				.attr('dominant-baseline', 'middle')
				.attr('fill', 'white')
				.style('font-weight', 500);
		}
	});
</script>

<div id="arc"></div>
