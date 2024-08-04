<script lang="ts">
	import { auth } from '../stores/auth';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let isLoggedIn: boolean;
	let isMenuOpen = false;

	// 로그인 상태 구독
	$: auth.subscribe(state => {
			isLoggedIn = state.isLoggedIn;
	});

	// 보호된 경로 목록
	const protectedRoutes = [
			'/map', '/bar', '/bar2', '/line-chart', 
			'/stock', '/stock-chart2', '/blog', '/about'
	];

	// 페이지 이동 시 로그인 상태 확인
	$: page.subscribe(($page) => {
			if (protectedRoutes.includes($page.url.pathname) && !isLoggedIn) {
					goto(`/login?redirect=${$page.url.pathname}`);
			}
	});

	function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }

	function menu_close() {
		isMenuOpen = false;
	}
	function handleLogout() {
			auth.set({ isLoggedIn: false });
			if(isMenuOpen){
				isMenuOpen = false;
			}
			goto('/login');
	}
</script>

<nav>
	<button class="menu-toggle" on:click={toggleMenu}>
		<span class="menu-icon"></span>
		<span class="menu-icon"></span>
		<span class="menu-icon"></span>
</button>
<div class:menu-open={isMenuOpen} class="menu">
	<a href="/" class="active" on:click={() => menu_close()}>Home</a>
	<a href="/map" on:click={() => menu_close()}>Map</a>
	<a href="/bar" on:click={() => menu_close()}>Bar</a>
	<a href="/bar2" on:click={() => menu_close()}>Bar2</a>
	<a href="/line-chart" on:click={() => menu_close()}>Line-chart</a>
	<a href="/stock" on:click={() => menu_close()}>Stock</a>
	<a href="/stock-chart2" on:click={() => menu_close()}>StockChart</a>
	<a href="/blog" on:click={() => menu_close()}>Blog</a>
	<a href="/about" on:click={() => menu_close()}>About</a>
	{#if isLoggedIn}
			<button type="button" on:click={handleLogout}>Logout</button>
	{:else}
			<a href="/login" on:click={() => menu_close()}>Login</a>
	{/if}
	</div>
</nav>

<slot></slot>

<style>
	nav {
			background-color: #333;
			padding: 10px 20px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
			position: relative;
	}

	.menu-toggle {
			display: none;
			background: none;
			border: none;
			cursor: pointer;
			padding: 0;
			margin: 0;
			position: relative;
			z-index: 1;
	}

	.menu-icon {
			display: block;
			width: 25px;
			height: 3px;
			background: white;
			margin: 5px 0;
			transition: background 0.3s;
	}

	.menu {
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 15px;
	}

	.menu a, .menu button {
			color: white;
			text-decoration: none;
			font-size: 16px;
			padding: 8px 15px;
			border-radius: 4px;
			transition:
					background-color 0.3s,
					color 0.3s;
	}

	.menu a:hover {
			background-color: #575757;
			color: #fff;
	}

	.menu a.active {
			background-color: #007bff;
			color: white;
	}

	.menu button {
			background-color: transparent;
			border: none;
			color: white;
			font-size: 16px;
			padding: 8px 15px;
			cursor: pointer;
			transition: background-color 0.3s;
	}

	.menu button:hover {
			background-color: #575757;
	}

	@media (max-width: 768px) {
			.menu-toggle {
					display: block;
			}

			.menu {
					display: none;
					flex-direction: column;
					width: 100%;
					background-color: #333;
					position: absolute;
					top: 60px;
					left: 0;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
					z-index: 0;
			}

			.menu.menu-open {
					display: flex;
			}

			.menu a, .menu button {
					margin: 10px 0;
					text-align: center;
			}
	}
</style>