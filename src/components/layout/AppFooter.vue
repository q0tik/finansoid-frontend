<template>
    <div class="text-center text-neutral-500">
        © {{ year }} Finansoid · v0.1.0
    </div>
</template>

<script setup>
const year = new Date().getFullYear();
</script>
