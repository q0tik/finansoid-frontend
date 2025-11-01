<template>
    <div class="p-2">
        <a-card title="Transactions" :bordered="false" class="shadow-soft rounded-2xl">
            <a-table :columns="columns" :dataSource="rows" size="small" rowKey="id" />
        </a-card>
    </div>
</template>

<script setup>
import { ref } from "vue";
import dayjs from "dayjs";

const columns = [
    { title: "Type", dataIndex: "type" },
    { title: "Category", dataIndex: "category" },
    { title: "Account", dataIndex: "account" },
    { title: "Amount", dataIndex: "amount" },
    { title: "Datetime", dataIndex: "datetime" },
];

const rows = ref([
    {
        id: 1,
        type: "Expense",
        category: "Food",
        account: "TBC",
        amount: "-25.00 ₾",
        datetime: dayjs().format("YYYY-MM-DD HH:mm"),
    },
    {
        id: 2,
        type: "Income",
        category: "Salary",
        account: "BOG",
        amount: "+1200 ₾",
        datetime: dayjs().subtract(1, "day").format("YYYY-MM-DD HH:mm"),
    },
    {
        id: 3,
        type: "Transfer",
        category: "Internal",
        account: "Cash → BOG",
        amount: "300 ₾",
        datetime: dayjs().subtract(2, "hours").format("YYYY-MM-DD HH:mm"),
    },
]);
</script>