<script lang="ts">
    import LineChart from './LineChart.svelte';
    import ArcChart from './ArcChart.svelte';
</script>
<style>
    /* Responsive container of the svg element */
.responsive-svg-container {
  width: 100%;
  max-width: 800px;
}
.responsive-svg-container.small {
  margin: 0 auto;
  max-width: 300px;
}
</style>
<div class="container">
	<h1>New York City 2021 Weather</h1>
	<div class="row">
		<div class="col col-9">
			<h2>Weekly average temperature</h2>
			<div class="responsive-svg-container">
				<LineChart />
			</div>
		</div>
		<div class="col col-3">
			<h2>Days with precipitation</h2>
			<div class="responsive-svg-container small">
				<ArcChart />
			</div>
		</div>
	</div>

	<div class="source">
		Data source: <a
			href="https://www.wunderground.com/history/weekly/us/ny/new-york-city/KLGA/date/2021-1-29"
			>www.wunderground.com</a
		>
	</div>
</div>
