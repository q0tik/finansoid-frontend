import { createRouter, createWebHistory } from "vue-router";

import Dashboard from "@/pages/Dashboard.vue";
import AddTransaction from "@/pages/AddTransaction.vue";
import Transactions from "@/pages/Transactions.vue";
import Transfers from "@/pages/Transfers.vue";
import Accounts from "@/pages/Accounts.vue";
import Categories from "@/pages/Categories.vue";
import Settings from "@/pages/Settings.vue";

const routes = [
    { path: "/", name: "dashboard", component: Dashboard },
    { path: "/quick-expense", name: "quick-expense", component: AddTransaction },
    { path: "/transactions", name: "transactions", component: Transactions },
    { path: "/transfers", name: "transfers", component: Transfers },
    { path: "/accounts", name: "accounts", component: Accounts },
    { path: "/categories", name: "categories", component: Categories },
    { path: "/settings", name: "settings", component: Settings }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
