<template>
    <div class="md:max-w-xl mx-auto bg-white rounded-2xl shadow-soft p-4">
        <a-form layout="vertical" @submit.prevent="onSubmit">
            <!-- Тип операции -->
            <div class="flex bg-neutral-100 rounded-xl p-1 mb-3 shadow-inner">
                <button
                    v-for="option in types"
                    :key="option.value"
                    type="button"
                    @click="type = option.value"
                    class="flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200"
                    :class="[
                        type === option.value
                            ? option.activeClass
                            : 'text-neutral-600 hover:text-neutral-800'
                    ]"
                >
                    <span class="flex items-center justify-center gap-1">
                        <span class="text-base">{{ option.icon }}</span>
                        {{ option.label }}
                    </span>
                </button>
            </div>

            <!-- Сумма -->
            <a-form-item
                label="Amount"
                :validateStatus="amountStatus"
                :help="amountHelp"
            >
                <a-input-number
                    v-model:value="amount"
                    :min="0"
                    :precision="2"
                    class="!w-full !text-lg"
                    placeholder="0.00"
                    inputmode="decimal"
                />
            </a-form-item>

            <!-- Категория -->
            <a-form-item label="Category">
                <a-select v-model:value="category" placeholder="Choose category">
                    <a-select-opt-group label="Common">
                        <a-select-option value="Food">Food</a-select-option>
                        <a-select-option value="Transport">Transport</a-select-option>
                        <a-select-option value="Groceries">Groceries</a-select-option>
                    </a-select-opt-group>
                    <a-select-opt-group label="Other">
                        <a-select-option value="Other">Other</a-select-option>
                    </a-select-opt-group>
                </a-select>
            </a-form-item>

            <!-- Аккаунт -->
            <a-form-item label="Account">
                <a-select v-model:value="account" placeholder="Choose account">
                    <a-select-option value="TBC">TBC</a-select-option>
                    <a-select-option value="BOG">BOG</a-select-option>
                    <a-select-option value="Cash">Cash</a-select-option>
                </a-select>
            </a-form-item>

            <!-- Дата и время -->
            <a-form-item label="Date & Time">
                <a-date-picker
                    v-model:value="date"
                    show-time
                    format="YYYY-MM-DD HH:mm"
                    style="width: 100%"
                />
            </a-form-item>

            <!-- Заметка -->
            <a-form-item label="Note">
                <a-input v-model:value="note" placeholder="Optional comment" />
            </a-form-item>

            <!-- Кнопка отправки -->
            <div class="mt-4">
                <a-button type="primary" block @click="onSubmit">
                    Save Transaction
                </a-button>
            </div>
        </a-form>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import dayjs from "dayjs";
import { message } from "ant-design-vue";

const type = ref("Expense");
const amount = ref(0);
const category = ref();
const account = ref();
const date = ref(dayjs());
const note = ref("");

const types = [
    {
        value: "Expense",
        label: "Expense",
        icon: "🔴",
        activeClass: "bg-red-500 text-white shadow-sm shadow-red-300",
    },
    {
        value: "Income",
        label: "Income",
        icon: "🟢",
        activeClass: "bg-green-500 text-white shadow-sm shadow-green-300",
    },
    {
        value: "Transfer",
        label: "Transfer",
        icon: "🟠",
        activeClass: "bg-yellow-400 text-white shadow-sm shadow-yellow-200",
    },
];

const amountStatus = computed(() => (amount.value > 0 ? "" : "error"));
const amountHelp = computed(() =>
    amount.value > 0 ? "" : "Enter amount > 0"
);

function onSubmit() {
    if (amount.value <= 0 || !category.value || !account.value) {
        message.error("Fill required fields");
        return;
    }

    const signedAmount =
        type.value === "Expense"
            ? -Math.abs(amount.value)
            : Math.abs(amount.value);

    const payload = {
        type: type.value,
        amount: signedAmount,
        category: category.value,
        account: account.value,
        datetime: date.value.format("YYYY-MM-DD HH:mm"),
        note: note.value || null,
    };

    console.log("submit", payload);
    message.success("Transaction saved");
}
</script>

<style scoped>
button {
    -webkit-tap-highlight-color: transparent;
}
</style>
