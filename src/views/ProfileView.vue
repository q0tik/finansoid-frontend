<script setup lang="ts">
import { 
  UserCircle, 
  Wallet, 
  Tags, 
  Coins 
} from 'lucide-vue-next'
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion'

import AccountsTable from '@/components/account/AccountsTable.vue'
import ProfilesTable from '@/components/profile/ProfilesTable.vue'
import CategoriesTable from '@/components/category/CategoriesTable.vue'
import CurrenciesTable from '@/components/currency/CurrenciesTable.vue'
import ProfileHeader from '@/components/profile/ProfileHeader.vue'
</script>

<template>
  <div class="min-h-full bg-background pb-28 pt-4 transition-colors duration-300">
    
    <div class="px-4 space-y-4">
      <ProfileHeader />

      <Accordion type="single" collapsible class="w-full space-y-3">
        
        <AccordionItem value="profiles" class="border rounded-xl bg-card px-4 border-border/50 shadow-sm overflow-hidden">
          <AccordionTrigger class="hover:no-underline py-4">
            <div class="flex items-center gap-3 text-card-foreground">
              <div class="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <UserCircle class="w-5 h-5" />
              </div>
              <span class="font-semibold tracking-tight">Profiles</span>
            </div>
          </AccordionTrigger>
          <AccordionContent class="border-t border-border/20 pt-4">
            <ProfilesTable />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="accounts" class="border rounded-xl bg-card px-4 border-border/50 shadow-sm overflow-hidden">
          <AccordionTrigger class="hover:no-underline py-4">
            <div class="flex items-center gap-3 text-card-foreground">
              <div class="p-2 rounded-lg bg-green-500/10 text-green-500">
                <Wallet class="w-5 h-5" />
              </div>
              <span class="font-semibold tracking-tight">Accounts</span>
            </div>
          </AccordionTrigger>
          <AccordionContent class="border-t border-border/20 pt-4">
            <AccountsTable />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="categories" class="border rounded-xl bg-card px-4 border-border/50 shadow-sm overflow-hidden">
          <AccordionTrigger class="hover:no-underline py-4">
            <div class="flex items-center gap-3 text-card-foreground">
              <div class="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                <Tags class="w-5 h-5" />
              </div>
              <span class="font-semibold tracking-tight">Categories</span>
            </div>
          </AccordionTrigger>
          <AccordionContent class="border-t border-border/20 pt-4">
            <CategoriesTable />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="currencies" class="border rounded-xl bg-card px-4 border-border/50 shadow-sm overflow-hidden">
          <AccordionTrigger class="hover:no-underline py-4">
            <div class="flex items-center gap-3 text-card-foreground">
              <div class="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
                <Coins class="w-5 h-5" />
              </div>
              <span class="font-semibold tracking-tight">Currencies</span>
            </div>
          </AccordionTrigger>
          <AccordionContent class="border-t border-border/20 pt-4">
            <CurrenciesTable />
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  </div>
</template>

<style scoped>
/* Плавное появление таблиц при открытии */
.accordion-content-enter-active {
  transition: all 0.3s ease-out;
}
</style>