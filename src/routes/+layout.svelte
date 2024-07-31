<script lang="ts">
    // import '../base.css';
    // import type { LayoutData } from './$types';
    
    // export let data: LayoutData;
</script>
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
      transition: background-color 0.3s, color 0.3s;
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
  </nav>
  <slot></slot>