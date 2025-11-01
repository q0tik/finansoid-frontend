<template>
    <div class="p-4">
        <h1 class="text-xl font-semibold mb-4">Settings</h1>

        <a-collapse accordion>
            <!-- General / App settings -->
            <a-collapse-panel key="1" header="Appearance & Theme">
                <ThemeSettings />
            </a-collapse-panel>

            <!-- Будущие блоки -->
            <a-collapse-panel key="2" header="Accounts & Currencies">
                <p>Настройки счетов, валют и курсов...</p>
            </a-collapse-panel>

            <a-collapse-panel key="3" header="Backup & Storage">
                <p>Экспорт, бэкап, Dropbox/Google Drive, etc.</p>
            </a-collapse-panel>
        </a-collapse>
    </div>
</template>

<script setup>
import ThemeSettings from "@/components/settings/ThemeSettings.vue";
</script>
