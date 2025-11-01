<template>
    <a-menu theme="dark" mode="inline" :selectedKeys="[activeKey]">
        <a-menu-item key="dashboard">
            <router-link to="/">Dashboard</router-link>
        </a-menu-item>

        <a-menu-item key="quick-expense">
            <router-link to="/quick-expense">➕ Quick Expense</router-link>
        </a-menu-item>

        <a-menu-item key="transactions">
            <router-link to="/transactions">📃 Transactions</router-link>
        </a-menu-item>

        <a-menu-item key="transfers">
            <router-link to="/transfers">🔁 Transfers</router-link>
        </a-menu-item>

        <a-menu-item key="accounts">
            <router-link to="/accounts">💳 Accounts</router-link>
        </a-menu-item>

        <a-menu-item key="categories">
            <router-link to="/categories">🏷️ Categories</router-link>
        </a-menu-item>

        <a-menu-item key="settings">
            <router-link to="/settings">⚙️ Settings</router-link>
        </a-menu-item>
    </a-menu>
</template>

<script setup>
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();
const activeKey = computed(() => route.name?.toString() || "dashboard");
</script>
