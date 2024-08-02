<script lang="ts">
	import { auth } from '../stores/auth';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let isLoggedIn: boolean;

	// 로그인 상태 구독
	$: auth.subscribe(state => {
			isLoggedIn = state.isLoggedIn;
	});

	// 보호된 경로 목록
	const protectedRoutes = [
			'/map', '/bar', '/bar2', '/line-chart', 
			'/stock', '/stock-chart2', '/blog', '/about', '/protected'
	];

	// 페이지 이동 시 로그인 상태 확인
	$: page.subscribe(($page) => {
			if (protectedRoutes.includes($page.url.pathname) && !isLoggedIn) {
					goto(`/login?redirect=${$page.url.pathname}`);
			}
	});

	function handleLogout() {
			auth.set({ isLoggedIn: false });
			goto('/login');
	}
</script>

<nav>
	<a href="/" class="active">Home</a>
	<a href="/map">Map</a>
	<a href="/bar">Bar</a>
	<a href="/bar2">Bar2</a>
	<a href="/line-chart">Line-chart</a>
	<a href="/stock">Stock</a>
	<a href="/stock-chart2">StockChart</a>
	<a href="/blog">Blog</a>
	<a href="/about">About</a>
	{#if isLoggedIn}
			<button type="button" on:click={handleLogout}>Logout</button>
	{:else}
			<a href="/login">Login</a>
	{/if}
</nav>

<slot></slot>




<style>
	nav {
		background-color: #333;
		padding: 10px 20px;
		display: flex;
		justify-content: space-around;
		align-items: center;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	nav a {
		color: white;
		text-decoration: none;
		font-size: 16px;
		padding: 8px 15px;
		border-radius: 4px;
		transition:
			background-color 0.3s,
			color 0.3s;
	}

	nav a:hover {
		background-color: #575757;
		color: #fff;
	}

	nav a.active {
		background-color: #007bff;
		color: white;
	}

	@media (max-width: 768px) {
		nav {
			flex-direction: column;
		}

		nav a {
			margin: 5px 0;
		}
	}
</style>
