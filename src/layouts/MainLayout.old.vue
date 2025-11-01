<template>
    <a-layout class="min-h-screen bg-neutral-50 pb-14 md:pb-0">
        <!-- DESKTOP SIDEBAR -->
        <a-layout-sider
            v-if="!isMobile"
            :collapsed="collapsed"
            collapsible
            @collapse="v => collapsed = v"
            width="240"
        >
            <div class="h-14 flex items-center justify-center text-white font-semibold tracking-wide">
                <AppLogo :collapsed="collapsed" />
            </div>
            <AppSidebar />
        </a-layout-sider>

        <a-layout>
            <!-- HEADER -->
            <a-layout-header class="bg-white shadow-sm px-3 md:px-4">
                <div class="flex items-center justify-between h-14">
                    <div class="flex items-center gap-2">
                        <!-- burger on mobile -->
                        <a-button
                            v-if="isMobile"
                            type="text"
                            @click="drawerOpen = true"
                            class="!px-2"
                        >
                            ☰
                        </a-button>
                        <div class="font-semibold md:hidden">💸 Finansoid</div>
                        <div class="hidden md:block">
                            <AppHeader />
                        </div>
                    </div>

                    <!-- справа компактные кнопки на мобильном -->
                    <div class="flex items-center gap-2">
                        <router-link to="/quick-expense">
                            <a-button type="primary" size="small" class="md:hidden">+ Add</a-button>
                        </router-link>
                        <a-avatar class="hidden md:inline-flex">U</a-avatar>
                    </div>
                </div>
            </a-layout-header>

            <!-- CONTENT -->
            <a-layout-content class="p-3 md:p-6">
                <div class="mx-auto w-full md:max-w-6xl">
                    <router-view />
                </div>
            </a-layout-content>

            <a-layout-footer class="bg-white hidden md:block">
                <AppFooter />
            </a-layout-footer>
        </a-layout>
    </a-layout>

    <!-- MOBILE DRAWER SIDEBAR -->
    <a-drawer
        v-model:open="drawerOpen"
        placement="left"
        :width="260"
        :closable="true"
        :maskClosable="true"
        class="md:hidden"
    >
        <div class="h-12 flex items-center font-semibold px-2">💸 Finansoid</div>
        <AppSidebar />
    </a-drawer>

    <!-- MOBILE TAB BAR -->
    <MobileTabBar v-if="isMobile" />
</template>

<script setup>
import { ref } from "vue";
import { useIsMobile } from "@/composables/useIsMobile";
import AppHeader from "@/components/layout/AppHeader.vue";
import AppSidebar from "@/components/layout/AppSidebar.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
import AppLogo from "@/components/common/AppLogo.vue";
import MobileTabBar from "@/components/layout/MobileTabBar.vue";

const collapsed = ref(false);
const drawerOpen = ref(false);
const { isMobile } = useIsMobile();
</script>
