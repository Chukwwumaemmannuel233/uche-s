import seedProducts from "@/data/products.json";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: string;
  amount: number;
  tag: string;
  detail: string;
  finish: string;
  image: string;
  sku: string;
  description: string;      
  stock: number;
};

export const products: Product[] = seedProducts;

export const categories = [
  "Fridges",
  "Televisions",
  "Phones",
  "Laptops",
  "Sound systems",
  "Washers",
  "Kitchen tech",
  "Accessories",
];

export const services = [
  "Same-day Abuja delivery on selected items",
  "Installation for TVs, fridges, washers, and smart home devices",
  "Warranty support and repair pickup coordination",
  "Office and short-let appliance procurement",
];
