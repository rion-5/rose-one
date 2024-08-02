<!-- src/routes/login.svelte -->
<script lang="ts">
    import { auth } from '../../stores/auth';
    import { login } from '../../lib/api/login';
    import type { LoginParam } from '../../lib/types/LoginParam';
    import { goto } from '$app/navigation';

    let loginId = '';
    let password = '';
    let isFamilyLogin = false;
    let error: string | null = null;

    async function handleLogin() {
        const params: LoginParam = { loginId, password, isFamilyLogin };
        try {
            const result = await login(params);
            auth.set({ isLoggedIn: true, token: result.data.accessToken });
            error = null;
            goto('/protected');
        } catch (err) {
            if (err instanceof Error) {
                error = err.message;
            } else {
                error = 'An unknown error occurred';
            }
        }
    }
</script>

<div>
    <input type="text" bind:value={loginId} placeholder="Login ID" />
    <input type="password" bind:value={password} placeholder="Password" />
    <label>
        <input type="checkbox" bind:checked={isFamilyLogin} />
        Family Login
    </label>
    <button on:click={handleLogin}>Login</button>

    {#if error}
        <p style="color: red;">{error}</p>
    {/if}
</div>
