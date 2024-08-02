// src/stores/auth.ts
import { writable } from 'svelte/store';

export interface AuthState {
    isLoggedIn: boolean;
    token?: string;
}

const initialAuthState: AuthState = {
    isLoggedIn: false,
};

export const auth = writable<AuthState>(initialAuthState);
