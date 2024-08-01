<script lang="ts">
	import StockChart from './StockChart.svelte';
	import { onMount } from 'svelte';

	type ChartData = {
		trading_date: Date;
		high: number;
		low: number;
		close: number;
	};

	let symbol = 'TSLA'; // 초기값 설정
	let startDate = '2024-01-01';
	let endDate = '2024-07-30';
	let chartData: ChartData[] = [];

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

	async function fetchData() {
		try {
			const response = await fetch(
				`${apiBaseUrl}/stockData?symbol=${symbol}&start_date=${startDate}&end_date=${endDate}`
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
		} catch (error) {
			console.error('Error fetching data:', error);
			// 에러 처리 (예: 사용자에게 알림 표시)
		}
	}

	function handleKeyPress(event: { key: string; }) {
    if (event.key === 'Enter') {
      fetchData();
    }
  }

	// 최초 데이터 로드
	onMount(fetchData);
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
    max-width: 800px;
    margin: 0 auto;
  }

  .search-bar {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin-bottom: 20px;
  }

  .search-bar input {
    flex: 1;
    min-width: 150px;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 16px;
  }

  .search-bar button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .search-bar button:hover {
    background-color: #0056b3;
  }

  .chart-container {
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
    background-color: #f9f9f9;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
</style>

<div class="container">
  <div class="search-bar">
    <input bind:value={symbol} placeholder="Symbol" on:keypress={handleKeyPress}/>
    <input type="date" bind:value={startDate} on:keypress={handleKeyPress}/>
    <input type="date" bind:value={endDate} on:keypress={handleKeyPress}/>
    <button on:click={fetchData}>조회</button>
  </div>

  <div class="chart-container">
    <StockChart {symbol} {startDate} {endDate} {chartData} />
  </div>
</div>