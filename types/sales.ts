export interface Sales {
  id: number;
  productName: string;
  quantity: number;
  price: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSalesInput {
  productName: string;
  quantity: number;
  price: number;
}

export interface UpdateSalesInput extends Partial<CreateSalesInput> {
  id: number;
}

export interface SalesUpdate {
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  data: Sales | { id: number };
} 