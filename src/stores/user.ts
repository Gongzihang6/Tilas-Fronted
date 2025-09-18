// stores/user.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
    const token = ref(localStorage.getItem('token') || '');

    const setToken = (newToken: string) => {
        token.value = newToken;
        localStorage.setItem('token', newToken);
    };

    const removeToken = () => {
        token.value = '';
        localStorage.removeItem('token');
    };

    return { token, setToken, removeToken };
}, { persist: true }); // 可以使用pinia-plugin-persistedstate插件简化持久化