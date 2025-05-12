import { useRuntimeConfig } from '#imports'
import type { CreateSalesInput, Sales, UpdateSalesInput } from '~/types/sales';

export function useSales() {
  const config = useRuntimeConfig()
  const sales = ref<Sales[]>([])
  const loading = ref(false)

  const load = async () => {
    loading.value = true
    const { data } = await useFetch(`${config.public.apiBase}/sales`)
    sales.value = (data.value || []) as Sales[]
    loading.value = false
  }

  const add = async (data: CreateSalesInput) => {
    const response = await fetch(`${config.public.apiBase}/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create sale');
    return await response.json();
  }

  const update = async (data: UpdateSalesInput) => {
    const response = await fetch(`${config.public.apiBase}/sales/${data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update sale');
    return await response.json();
  }

  const remove = async (id: number) => {
    const response = await fetch(`${config.public.apiBase}/sales/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete sale');
    return await response.json();
  }

  return { sales, load, add, update, remove, loading }
}
