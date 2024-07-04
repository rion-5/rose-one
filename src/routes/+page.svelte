<script lang="ts">
	type trading_data = {
		trading_date: string;
		close: number;
	};

	export let data: {
		data: trading_data[];
	};
	let symbol: string = '';
	// const handleSubmit = (event:any) =>{
	// 	event.preventDefault();	
	// 	console.log(symbol);
	// };
	function handleSubmit(event:any){
		event.preventDefault();
		console.log(symbol);
	}
</script>

<main>
	<h1>TSLA stock data</h1>
	<ul>
		{#each data.data as item}
			<li>{item.trading_date} : {item.close}</li>
		{/each}
	</ul>
</main>
<form on:submit={handleSubmit}>
	<input type="text" id="symbol" bind:value={symbol}/>
	<button type="submit">Send</button>
</form>

