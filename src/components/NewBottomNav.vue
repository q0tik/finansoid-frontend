<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { ChartLine, User, Settings, Plus, ArrowLeftRight } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

const items = [
    { name: 'Home',         icon: ChartLine,        route: '/' },
    { name: 'Transactions', icon: ArrowLeftRight,   route: '/transactions' },
    { name: 'Add',          icon: Plus,             route: '/add-transaction' },
    { name: 'Profile',      icon: User,             route: '/profile' },
    { name: 'Settings',     icon: Settings,         route: '/settings' },
]

const active_index = computed(() => {
    return items.findIndex(i => i.route === route.path)
})
</script>

<template>
    <div class="navigation">
        <ul>
            <li
                v-for="item in items"
                :key="item.route"
                class="list"
                :class="{ active: route.path === item.route }"
            >
                <RouterLink
                    :to="item.route"
                    class="flex flex-col items-center"
                >
                    <span class="icon">
                        <component
                            :is="item.icon"
                        />
                    </span>
                    <span class="text">{{ item.name }}</span>
                </RouterLink>
            </li>
            <div 
                class="indicator"
                :style="{
                    transform: `translateX(${70 * active_index}px)`
                }"
            >
            </div>
        </ul>
    </div>
</template>

<style scoped>
.navigation {
    bottom: 0;
    width: 100%;
    height: 70px;
    background: var(--bg-footer);
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
}

.navigation ul {
    display: flex;
    width: 350px;
}

.navigation ul li {
    position: relative;
    list-style: none;
    width: 70px;
    height: 70px;
    z-index: 1;
}

.navigation ul li a {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    text-align: center;
    font-weight: 500;
}

.navigation ul li a .icon {
    position: relative;
    display: block;
    line-height: 75px;
    font-size: 1.5em;
    text-align: center;
    transition: 0.5s;
}

.navigation ul li.active a .icon {
    transform: translateY(-32px);
}

.navigation ul li a .text {
    position: absolute;
    /* color: ; */
    font-weight: 400;
    font-size: 0.75em;
    letter-spacing: 0.05em;
    transition: 0.5s;
    opacity: 0;
    transform: translateY(20px);
}

.navigation ul li.active a .text {
    opacity: 1;
}

.indicator {
    position: absolute;
    width: 70px;
    height: 70px;
    background: #29fd53;
    border-radius: 50%;
    top: -50%;
    border-width: 6px;
    border-style: solid;
    border-color: var(--bg-pages);
    transition: 0.5s;
}

.indicator::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -22px;
    width: 20px;
    height: 20px;
    background: transparent;
    border-top-right-radius: 20px;
    box-shadow: 0px -10px 0 0 var(--bg-pages);
}

.indicator::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -22px;
    width: 20px;
    height: 20px;
    background: transparent;
    border-top-left-radius: 20px;
    box-shadow: 0px -10px 0 0 var(--bg-pages);
}
</style>
