<script setup>
import { computed } from 'vue'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Doughnut } from 'vue-chartjs'
import {
  Wallet,
  TrendingDown,
  TrendingUp,
  ArrowLeftRight,
  Clock,
} from 'lucide-vue-next'
import { useProfileStore } from '@/stores/profileStore'
import { useHomeSummary } from '@/composables/useHomeSummary'
import { formatDate, formatTime } from '@/lib/format.js'
import { Separator } from '@/components/ui/separator'

ChartJS.register(ArcElement, Tooltip, Legend)

const PERIODS = ['last_day', 'last_week', 'last_month', 'last_year']
const CHART_COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6']

const store = useProfileStore()
const { period, summary, loading } = useHomeSummary()

const profileTitle = computed(
  () => store.profiles.find((p) => p.id === store.activeProfile)?.title || ''
)

function buildChartData(categories) {
  return {
    labels: categories.map((c) => c.category_title || '—'),
    datasets: [
      {
        data: categories.map((c) => c.share_pct),
        backgroundColor: categories.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]),
        borderWidth: 0,
      },
    ],
  }
}

const chartOptions = {
  responsive: true,
  cutout: '72%',
  plugins: { legend: { display: false }, tooltip: { enabled: true } },
}

function fmtAmount(tx) {
  if (!tx.from_amount) return `+${tx.to_amount} ${tx.currency_to_symbol}`
  if (!tx.to_amount) return `-${Math.abs(tx.from_amount)} ${tx.currency_from_symbol}`
  return `${Math.abs(tx.from_amount)} ${tx.currency_from_symbol} → ${tx.to_amount} ${tx.currency_to_symbol}`
}

function txType(tx) {
  if (!tx.from_amount) return 'income'
  if (!tx.to_amount) return 'expense'
  return 'transfer'
}

function amountsByCurrency(category) {
  return category.amounts_by_currency
    .map((a) => `${a.total_amount} ${a.currency_symbol}`)
    .join(' · ')
}
</script>

<template>
  <div class="h-full w-full bg-background overflow-y-auto custom-scrollbar pb-24">

    <!-- Header -->
    <div class="sticky top-0 z-10 bg-background/80 backdrop-blur-md px-4 pt-6 pb-3 flex items-center justify-between gap-3">
      <div class="flex items-center gap-2 min-w-0">
        <div class="p-2 bg-card border border-border rounded-xl shrink-0">
          <Wallet class="w-4 h-4 text-primary" />
        </div>
        <span class="text-sm font-bold truncate text-muted-foreground">{{ profileTitle }}</span>
      </div>

      <!-- Period selector -->
      <div class="flex gap-1 bg-card border border-border rounded-xl p-1 shrink-0">
        <button
          v-for="p in PERIODS"
          :key="p"
          @click="period = p"
          :class="[
            'px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors',
            period === p
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground',
          ]"
        >
          {{ $t(`home.period_${p}`) }}
        </button>
      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="px-4 pt-4 space-y-6 animate-pulse">
      <div class="flex gap-3 overflow-hidden">
        <div v-for="i in 3" :key="i" class="min-w-[150px] h-[130px] bg-card border border-border rounded-[24px]" />
      </div>
      <div class="h-[200px] bg-card border border-border rounded-[24px]" />
      <div class="h-[200px] bg-card border border-border rounded-[24px]" />
      <div class="h-[160px] bg-card border border-border rounded-[24px]" />
    </div>

    <!-- Content -->
    <template v-else-if="summary">

      <!-- Accounts -->
      <section class="px-4 pt-4">
        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1 mb-3 block">
          {{ $t('home.accounts') }}
        </span>
        <div class="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
          <div
            v-for="acc in summary.accounts"
            :key="acc.id"
            class="min-w-[150px] bg-card border border-border rounded-[24px] p-4 flex flex-col justify-between h-[130px] shrink-0"
          >
            <div class="flex items-start justify-between">
              <span class="text-xs font-bold text-muted-foreground leading-tight line-clamp-2">{{ acc.title }}</span>
              <span
                v-if="acc.is_owner"
                class="text-[8px] font-black uppercase tracking-wider text-primary bg-primary/10 rounded-md px-1.5 py-0.5 ml-1 shrink-0"
              >own</span>
            </div>
            <div>
              <p class="text-lg font-black tracking-tight leading-none">{{ acc.balance }}</p>
              <p class="text-[10px] font-bold text-muted-foreground mt-0.5">{{ acc.currency_symbol }} · {{ acc.currency_title }}</p>
            </div>
          </div>
        </div>
      </section>

      <Separator class="mx-4 mt-5 w-auto" />

      <!-- Expense categories -->
      <section class="px-4 pt-5">
        <div class="flex items-center gap-2 mb-4 px-1">
          <TrendingDown class="w-4 h-4 text-red-500" />
          <span class="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            {{ $t('home.expense_categories') }}
          </span>
        </div>

        <div v-if="summary.expense_categories.length === 0" class="text-center py-6 text-muted-foreground text-xs">
          {{ $t('home.no_data') }}
        </div>

        <div v-else class="flex gap-4 items-start">
          <!-- Donut -->
          <div class="w-[100px] h-[100px] shrink-0">
            <Doughnut :data="buildChartData(summary.expense_categories)" :options="chartOptions" />
          </div>
          <!-- Category list -->
          <div class="flex-1 space-y-2 min-w-0">
            <div
              v-for="(cat, i) in summary.expense_categories"
              :key="cat.category_id ?? i"
              class="flex items-center gap-2"
            >
              <span
                class="w-2 h-2 rounded-full shrink-0"
                :style="{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }"
              />
              <span class="text-xs font-semibold truncate flex-1">{{ cat.category_title || '—' }}</span>
              <span class="text-[10px] font-black text-muted-foreground shrink-0">{{ cat.share_pct.toFixed(1) }}%</span>
            </div>
          </div>
        </div>

        <!-- Amounts breakdown -->
        <div v-if="summary.expense_categories.length > 0" class="mt-3 space-y-1">
          <div
            v-for="(cat, i) in summary.expense_categories"
            :key="`amt-exp-${i}`"
            class="flex justify-between text-[10px] text-muted-foreground px-1"
          >
            <span class="truncate mr-2">{{ cat.category_title || '—' }}</span>
            <span class="shrink-0 font-mono">{{ amountsByCurrency(cat) }}</span>
          </div>
        </div>
      </section>

      <Separator class="mx-4 mt-5 w-auto" />

      <!-- Income categories -->
      <section class="px-4 pt-5">
        <div class="flex items-center gap-2 mb-4 px-1">
          <TrendingUp class="w-4 h-4 text-emerald-500" />
          <span class="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            {{ $t('home.income_categories') }}
          </span>
        </div>

        <div v-if="summary.income_categories.length === 0" class="text-center py-6 text-muted-foreground text-xs">
          {{ $t('home.no_data') }}
        </div>

        <div v-else class="flex gap-4 items-start">
          <div class="w-[100px] h-[100px] shrink-0">
            <Doughnut :data="buildChartData(summary.income_categories)" :options="chartOptions" />
          </div>
          <div class="flex-1 space-y-2 min-w-0">
            <div
              v-for="(cat, i) in summary.income_categories"
              :key="cat.category_id ?? i"
              class="flex items-center gap-2"
            >
              <span
                class="w-2 h-2 rounded-full shrink-0"
                :style="{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }"
              />
              <span class="text-xs font-semibold truncate flex-1">{{ cat.category_title || '—' }}</span>
              <span class="text-[10px] font-black text-muted-foreground shrink-0">{{ cat.share_pct.toFixed(1) }}%</span>
            </div>
          </div>
        </div>

        <div v-if="summary.income_categories.length > 0" class="mt-3 space-y-1">
          <div
            v-for="(cat, i) in summary.income_categories"
            :key="`amt-inc-${i}`"
            class="flex justify-between text-[10px] text-muted-foreground px-1"
          >
            <span class="truncate mr-2">{{ cat.category_title || '—' }}</span>
            <span class="shrink-0 font-mono">{{ amountsByCurrency(cat) }}</span>
          </div>
        </div>
      </section>

      <Separator class="mx-4 mt-5 w-auto" />

      <!-- Recent transactions -->
      <section class="px-4 pt-5 pb-2">
        <div class="flex items-center gap-2 mb-4 px-1">
          <Clock class="w-4 h-4 text-primary" />
          <span class="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            {{ $t('home.recent_transactions') }}
          </span>
        </div>

        <div v-if="summary.recent_transactions.length === 0" class="text-center py-6 text-muted-foreground text-xs">
          {{ $t('home.no_data') }}
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="tx in summary.recent_transactions"
            :key="tx.id"
            class="bg-card border border-border rounded-[18px] px-4 py-3 flex items-center justify-between gap-3"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div
                :class="[
                  'w-8 h-8 rounded-xl flex items-center justify-center shrink-0',
                  txType(tx) === 'income' ? 'bg-emerald-500/10' : txType(tx) === 'expense' ? 'bg-red-500/10' : 'bg-muted',
                ]"
              >
                <TrendingUp v-if="txType(tx) === 'income'" class="w-4 h-4 text-emerald-500" />
                <TrendingDown v-else-if="txType(tx) === 'expense'" class="w-4 h-4 text-red-500" />
                <ArrowLeftRight v-else class="w-4 h-4 text-muted-foreground" />
              </div>
              <div class="min-w-0">
                <p class="text-xs font-semibold truncate">
                  {{ tx.category?.title || $t('home.transfer') }}
                </p>
                <p class="text-[10px] text-muted-foreground">
                  {{ formatDate(tx.created_at) }} · {{ formatTime(tx.created_at) }}
                </p>
              </div>
            </div>
            <span
              :class="[
                'text-sm font-black shrink-0 font-mono',
                txType(tx) === 'income' ? 'text-emerald-500' : txType(tx) === 'expense' ? 'text-red-500' : 'text-foreground',
              ]"
            >
              {{ fmtAmount(tx) }}
            </span>
          </div>
        </div>
      </section>

    </template>

    <!-- No data / error state -->
    <div v-else class="flex flex-col items-center justify-center h-48 text-muted-foreground text-xs px-8 text-center">
      {{ $t('home.no_data') }}
    </div>

  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.custom-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
