<!-- src/routes/protected.svelte -->
<script lang="ts">
    import { auth } from '../../stores/auth';
    import { goto } from '$app/navigation';

    let isLoggedIn: boolean;

    $: auth.subscribe(state => {
        isLoggedIn = state.isLoggedIn;
        if (!isLoggedIn) {
            goto('/login');
        }
    });
</script>

{#if isLoggedIn}
    <div>
        <h1>Protected Page</h1>
        <p>This content is protected and only visible to logged in users.</p>
    </div>
{/if}
