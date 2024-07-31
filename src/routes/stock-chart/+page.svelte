<script lang="ts">
	import StockChart from './StockChart.svelte';
	import { onMount } from 'svelte';

	type ChartData = {
		trading_date: Date;
		close: number;
	};

	let symbol = 'TSLA'; // 초기값 설정
	let startDate = '2024-01-01';
	let endDate = '2024-07-30';
	let chartData: ChartData[] = [];

	async function fetchData() {
		try {
			const response = await fetch(
				`http://localhost:8443/tradeDataForChart?symbol=${symbol}&start_date=${startDate}&end_date=${endDate}`
			);

			if (!response.ok) {
				throw new Error('Failed to fetch data');
			}

			const data: { name: string; series: { name: Date; value: number }[] }[] =
				await response.json();

			// 데이터 추출 및 변환
			chartData = data[0].series.map((d) => ({
				trading_date: new Date(d.name),
				close: Math.round(d.value * 1000) / 1000
			}));
		} catch (error) {
			console.error('Error fetching data:', error);
			// 에러 처리 (예: 사용자에게 알림 표시)
		}
	}

	// 최초 데이터 로드
	onMount(fetchData);
</script>

<div>
	<input bind:value={symbol} placeholder="Symbol" />
	<input type="date" bind:value={startDate} />
	<input type="date" bind:value={endDate} />
	<button on:click={fetchData}>조회</button>
</div>

<StockChart {symbol} {startDate} {endDate} {chartData} />
