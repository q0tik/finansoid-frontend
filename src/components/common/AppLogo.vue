<template>
    <div class="text-white select-none">
        <span v-if="!collapsed">💸 Finansoid</span>
        <span v-else>💸</span>
    </div>
</template>

<script setup>
defineProps({
    collapsed: { type: Boolean, default: false }
});
</script>
