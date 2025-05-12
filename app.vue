<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Sales Management</h1>

    <!-- Create Sale Form -->
    <div class="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 class="text-xl font-semibold mb-4">Add New Sale</h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm/6 font-medium text-gray-900"
            >Product Name</label
          >
          <div
            class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600"
          >
            <input
              v-model="newSale.productName"
              type="text"
              required
              class="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm/6 font-medium text-gray-900">
            Quantity
          </label>
          <div
            class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600"
          >
            <input
              v-model.number="newSale.quantity"
              type="number"
              required
              min="1"
              class="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm/6 font-medium text-gray-900">
            Price
          </label>
          <div
            class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600"
          >
            <input
              v-model.number="newSale.price"
              type="number"
              required
              min="0"
              step="0.01"
              class="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
            />
          </div>
        </div>

        <button
          type="submit"
          class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Add Sale
        </button>
      </form>
    </div>

    <!-- Sales List -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold">Sales List</h2>
      </div>

      <div v-if="loading" class="p-4 text-center">Loading...</div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Product
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Quantity
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Price
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Total
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="sale in sales" :key="sale.id">
              <td class="px-6 py-4 whitespace-nowrap">
                {{ sale.productName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ sale.quantity }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                ${{ sale.price.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                ${{ sale.totalAmount.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button
                  @click="handleDelete(sale.id)"
                  class="text-red-600 hover:text-red-900 cursor-pointer"
                  :disabled="loading"
                  :class="loading ? 'opacity-50 cursor-not-allowed' : ''"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSales } from "~/composables/useSales";
import { ref } from "vue";
import type { CreateSalesInput } from "~/types/sales";
const { sales, load, add, remove, update, loading } = useSales();
const config = useRuntimeConfig();

onMounted(() => {
  load();

  // SSE Realtime Updates
  const source = new EventSource(`${config.public.apiBase}/subscribe`);
  source.onmessage = () => {
    console.log("[SSE] Sales changed. Reloading...");
    load();
  };
});

const newSale = ref<CreateSalesInput>({
  productName: "",
  quantity: 1,
  price: 0,
});

const handleSubmit = async () => {
  try {
    await add(newSale.value);
    newSale.value = {
      productName: "",
      quantity: 1,
      price: 0,
    };
  } catch (e) {
    console.error("Failed to create sale:", e);
  }
};

const handleDelete = async (id: number) => {
  if (confirm("Are you sure you want to delete this sale?")) {
    try {
      await remove(id);
    } catch (e) {
      console.error("Failed to delete sale:", e);
    }
  }
};
</script>
