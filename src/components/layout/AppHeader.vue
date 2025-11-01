<template>
    <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
            <a-input-search
                v-model:value="q"
                placeholder="Search transactions..."
                style="width: 280px"
                @search="onSearch"
            />
            <a-select v-model:value="period" style="width: 160px">
                <a-select-option value="month">This month</a-select-option>
                <a-select-option value="7d">Last 7 days</a-select-option>
                <a-select-option value="30d">Last 30 days</a-select-option>
            </a-select>
        </div>

        <div class="flex items-center gap-2">
            <router-link to="/quick-expense">
                <a-button type="primary">+ Expense</a-button>
            </router-link>
            <a-avatar>U</a-avatar>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { message } from "ant-design-vue";

const q = ref("");
const period = ref("month");

function onSearch() {
    message.info(`Search: ${q.value}`);
}
</script>
