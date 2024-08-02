// src/api/login.ts
import type { LoginParam } from '../types/LoginParam';
import type { PyxisLoginData } from '../types/PyxisLoginData';

export async function login(params: LoginParam): Promise<PyxisLoginData> {
    const response = await fetch('https://lib.hanyang.ac.kr/pyxis-api/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data: PyxisLoginData = await response.json();
    return data;
}
