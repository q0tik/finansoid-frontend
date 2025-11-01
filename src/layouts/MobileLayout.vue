<template>
    <div class="min-h-screen bg-background pb-16 pt-14">
        <MobileHeader />
        <router-view class="p-4" />
        <MobileTabBar />
    </div>
</template>

<script setup>
import MobileHeader from "@/components/layout/MobileHeader.vue";
import MobileTabBar from "@/components/layout/MobileTabBar.vue";
</script>