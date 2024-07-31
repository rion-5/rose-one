<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import * as d3 from 'd3';

	type ChartData = {
		trading_date: Date;
		high: number;
		low: number;
		close: number;
	};
	export let symbol = 'TSLA';
	export let startDate = '2024-01-01';
	export let endDate = '2024-07-30';
	export let chartData: ChartData[] = [];

	onMount(async () => {
		const response = await fetch(
			`http://localhost:8443/stockData?symbol=${symbol}&start_date=${startDate}&end_date=${endDate}`
		);
		if (!response.ok) {
			throw new Error('Failed to fetch data');
		}

		const data: { trading_date: Date; high: number; low: number; close: number }[] =
			await response.json();

		// 데이터 추출 및 변환
		chartData = data.map((d) => ({
			trading_date: new Date(d.trading_date),
			high: d.high,
			low: d.low,
			close: d.close
		}));
		if (chartData.length > 0) {
			drawLineChart(chartData);
		}
	});

	afterUpdate(() => {
		if (chartData.length > 0) {
			drawLineChart(chartData);
		}
	});

	// 라인 차트를 그리는 함수
	const drawLineChart = (data: ChartData[]) => {
		d3.select('#line-chart').selectAll('*').remove(); // 기존 차트를 제거

		const margin = { top: 40, right: 30, bottom: 25, left: 40 };
		const width = 800;
		const height = 400;
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;
		const color = '#1f77b4';

		const svg = d3
			.select('#line-chart')
			.append('svg')
			.attr('viewBox', `0, 0, ${width}, ${height}`)
			.attr('width', '100%')
			.attr('height', '100%');

		const innerChart = svg
			.append('g')
			.attr('transform', `translate(${margin.left}, ${margin.top})`);

		// xScale 정의
		const xScale = d3
			.scaleTime()
			.domain(d3.extent(data, (d) => d.trading_date) as [Date, Date])
			.range([0, innerWidth]);

		// yScale 정의
		const yScale = d3
			.scaleLinear()
			.domain(d3.extent(data, (d) => d.close) as [number, number])
			.range([innerHeight, 0]);

		// x축 생성
		const bottomAxis = d3.axisBottom(xScale).tickFormat((d) => d3.timeFormat('%m/%d')(d as Date));

		innerChart
			.append('g')
			.attr('class', 'axis-x')
			.attr('transform', `translate(0, ${innerHeight})`)
			.call(bottomAxis);

		// y축 생성
		innerChart.append('g').call(d3.axisLeft(yScale));

		// 라인 생성
		const line = d3
			.line<ChartData>()
			.x((d) => xScale(d.trading_date))
			.y((d) => yScale(d.close));



			// Initialize the line/curve generator
			const curveGenerator = d3
				.line<ChartData>()
				.x((d) => xScale(d.trading_date))
				.y((d) => yScale(d.close))
				.curve(d3.curveCatmullRom);

							// Draw the line/curve
			innerChart
				.append('path')
				.attr('d', curveGenerator(data))
				.attr('fill', 'none')
				.attr('stroke', color);

		// innerChart
		// 	.append('path')
		// 	.datum(data)
		// 	.attr('fill', 'none')
		// 	.attr('stroke', color)
		// 	.attr('stroke-width', 2)
		// 	.attr('d', line);

		innerChart
			.selectAll('circle')
			.data(data)
			.join('circle')
			.attr('r', 2)
			.attr('cx', (d) => xScale(d.trading_date))
			.attr('cy', (d) => yScale(d.close))
			.attr('fill', color);

				/************************************************/
			/*   Area chart of the temperature variability  */
			/************************************************/
			// Initialize the area generator
			const areaGenerator = d3
				.area<ChartData>()
				.x((d) => xScale(d.trading_date))
				.y0((d) => yScale(d.low))
				.y1((d) => yScale(d.high))
				.curve(d3.curveCatmullRom);

			// Draw the area
			innerChart
				.append('path')
				.attr('d', areaGenerator(data))
				.attr('fill', color)
				.attr('fill-opacity', 0.2);

	};
</script>

<div id="line-chart" style="width: 100%; height: 400px;"></div>
<!-- {#each data.tradeData as item}
	<li>
		Date: {item.trading_date} - Close: {item.close}
	</li>
{/each} -->
