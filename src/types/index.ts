export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: string;
  summary: string;
  stocked: boolean;
  created_at: string;
  updated_at: string;
  image: string;
  made_by: string;
  color: string;
  checked: boolean;
};

export type Products = Product[];
