<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	type TradeData = {
		trading_date: Date;
		close: number;
	};

	export let data: {
		tradeData: TradeData[];
	};

	onMount(() => {
		if (data.tradeData && data.tradeData.length > 0) {
			// 데이터의 날짜를 Date 객체로 변환
			const parsedData = data.tradeData.map(d => ({
				...d,
				trading_date: new Date(d.trading_date)
			}));

			// 라인 차트를 그리는 함수
			const drawLineChart = (data: TradeData[]) => {
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

				// X scale
				const xDomain = d3.extent(data, d => d.trading_date) as [Date | undefined, Date | undefined];
				const xScale = d3
					.scaleTime()
					.domain(xDomain[0] && xDomain[1] ? [xDomain[0], xDomain[1]] as [Date, Date] : [new Date(), new Date()])
					.range([0, innerWidth]);

				// Y scale
				const yMax = d3.max(data, d => d.close);
				const yScale = d3
					.scaleLinear()
					.domain([0, yMax !== undefined ? yMax : 0])
					.range([innerHeight, 0]);

				// const bottomAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%b'));
				// innerChart
				// 	.append('g')
				// 	.attr('class', 'axis-x')
				// 	.attr('transform', `translate(0, ${innerHeight})`)
				// 	.call(bottomAxis);

				const leftAxis = d3.axisLeft(yScale);
				innerChart.append('g').attr('class', 'axis-y').call(leftAxis);

				const lineGenerator = d3
					.line<TradeData>()
					.x(d => xScale(d.trading_date))
					.y(d => yScale(d.close))
					.curve(d3.curveCatmullRom);

				innerChart
					.append('path')
					.datum(data)
					.attr('d', lineGenerator)
					.attr('fill', 'none')
					.attr('stroke', color)
					.attr('stroke-width', 2);

				innerChart
					.append('text')
					.text('Stock Price')
					.attr('x', xScale(data[data.length - 1].trading_date) + 10)
					.attr('y', yScale(data[data.length - 1].close))
					.attr('dominant-baseline', 'middle')
					.attr('fill', color);
			};

			drawLineChart(parsedData);
		}
	});
</script>

<div id="line-chart" style="width: 100%; height: 400px;"></div>
