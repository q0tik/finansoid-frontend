<template>
    <nav
    class="fixed bottom-0 left-0 right-0 z-40 h-[64px] flex justify-around items-center border-t"
    :style="{
        backgroundColor: 'var(--bg-footer)',
        color: 'var(--text-primary)',
        borderColor: 'var(--border-color)'
    }"
>
        <!-- Левая часть -->
        <div class="flex justify-around w-2/5">
            <RouterLink
                v-for="item in leftNavItems"
                :key="item.to"
                :to="item.to"
                class="flex flex-col items-center justify-center px-2 py-1 transition-colors"
                :class="isActive(item.to)
                    ? 'text-blue-600 font-medium'
                    : 'text-neutral-500 hover:text-neutral-800'"
            >
                <component :is="item.icon" class="w-6 h-6 mb-1" />
                <span class="text-[11px] leading-none">{{ item.label }}</span>
            </RouterLink>
        </div>

        <!-- Центральная кнопка -->
        <div class="flex items-center justify-center w-1/5 relative h-full">
            <RouterLink
                :to="centerNavItem.to"
                class="absolute -top-6 w-16 h-16
                       rounded-full flex items-center justify-center
                       bg-blue-600 text-white
                       ring-4 ring-blue-500/40
                       shadow-lg shadow-blue-400/30
                       transition-transform active:scale-95"
            >
                <component :is="centerNavItem.icon" class="w-7 h-7" />
            </RouterLink>
        </div>

        <!-- Правая часть -->
        <div class="flex justify-around w-2/5">
            <RouterLink
                v-for="item in rightNavItems"
                :key="item.to"
                :to="item.to"
                class="flex flex-col items-center justify-center px-2 py-1 transition-colors"
                :class="isActive(item.to)
                    ? 'text-blue-600 font-medium'
                    : 'text-neutral-500 hover:text-neutral-800'"
            >
                <component :is="item.icon" class="w-6 h-6 mb-1" />
                <span class="text-[11px] leading-none">{{ item.label }}</span>
            </RouterLink>
        </div>
    </nav>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ChartArea, List, Plus, Wallet, Settings } from "lucide-vue-next";

const route = useRoute();

const allNavItems = [
    { to: "/", label: "Home", icon: ChartArea },
    { to: "/transactions", label: "List", icon: List },
    { to: "/quick-expense", label: "Add", icon: Plus },
    { to: "/accounts", label: "Accounts", icon: Wallet },
    { to: "/settings", label: "Settings", icon: Settings },
];

const leftNavItems = allNavItems.slice(0, 2);
const centerNavItem = allNavItems[2];
const rightNavItems = allNavItems.slice(3, 5);

function isActive(path) {
    return route.path === path;
}
</script>
