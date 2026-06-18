"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Edit3, Plus, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { AdminShell, adminStyles } from "@/components/admin-shell";
import type { Product } from "@/lib/store";

const emptyProduct: Product = {
  id: "",
  name: "",
  category: "",
  price: "",
  amount: 0,
  tag: "New arrival",
  detail: "",
  finish: "from-cyan-200 via-slate-100 to-zinc-300",
  image: "",
  sku: "",
  description: "",
  stock: 0,
};

const tags = ["New arrival", "Best seller", "Low stock", "Out of stock"];

function moneyFromAmount(amount: number) {
  return `NGN ${new Intl.NumberFormat("en-NG").format(amount)}`;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<Product>(emptyProduct);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  useEffect(() => {
    async function loadProducts() {
      const auth = await fetch("/api/admin/me");
      const authData = await auth.json();
      if (!authData.admin) {
        router.push("/admin");
        return;
      }

      fetch("/api/products")
        .then((response) => response.json())
        .then(setProducts)
        .catch(() => toast.error("Could not load products"))
        .finally(() => setLoading(false));
    }

    loadProducts();
  }, [router]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products;

    return products.filter((product) =>
      [product.name, product.category, product.sku, product.tag]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [products, search]);

  const openAddModal = () => {
    setForm(emptyProduct);
    setModalMode("add");
  };

  const openEditModal = (product: Product) => {
    setForm(product);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setForm(emptyProduct);
  };

  const updateForm = (
    field: keyof Product,
    value: string | number
  ) => {
    setForm((current) => {
      const next = { ...current, [field]: value };
      if (field === "amount") {
        next.price = moneyFromAmount(Number(value));
      }
      if (field === "sku" && modalMode === "add") {
        next.id = String(value);
      }
      return next;
    });
  };

  const saveProduct = async () => {
    if (!form.name || !form.category || !form.sku || !form.amount) {
      toast.error("Name, category, SKU, and amount are required");
      return;
    }

    const payload = {
      ...form,
      id: form.id || form.sku,
      price: form.price || moneyFromAmount(form.amount),
      description: form.description || form.detail,
    };

    setSaving(true);
    const request = fetch(
      modalMode === "edit" ? `/api/products/${form.id}` : "/api/products",
      {
        method: modalMode === "edit" ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    toast.promise(request, {
      loading: modalMode === "edit" ? "Updating product..." : "Adding product...",
      success: modalMode === "edit" ? "Product updated" : "Product added",
      error: "Could not save product",
    });

    try {
      const response = await request;
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setProducts((current) =>
        modalMode === "edit"
          ? current.map((product) => (product.id === data.id ? data : product))
          : [data, ...current]
      );
      closeModal();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save product");
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (file?: File) => {
    if (!file) return;
    const uploadBody = new FormData();
    uploadBody.append("file", file);
    setUploading(true);

    try {
      const response = await fetch("/api/uploads/cloudinary", {
        method: "POST",
        body: uploadBody,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      updateForm("image", data.url);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not upload image");
    } finally {
      setUploading(false);
    }
  };

  const deleteProduct = async () => {
    if (!deleteTarget) return;

    const request = fetch(`/api/products/${deleteTarget.id}`, {
      method: "DELETE",
    });

    toast.promise(request, {
      loading: "Deleting product...",
      success: "Product deleted",
      error: "Could not delete product",
    });

    try {
      const response = await request;
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      setProducts((current) =>
        current.filter((product) => product.id !== deleteTarget.id)
      );
      setDeleteTarget(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete product");
    }
  };

  return (
    <AdminShell active="/admin/products">
      <div className={adminStyles.topbar}>
        <div>
          <h1 className={adminStyles.title}>Products</h1>
          <p className={adminStyles.sub}>
            View and manage the live product catalogue.
          </p>
        </div>
        <button onClick={openAddModal} className={adminStyles.primary}>
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      <label className="relative max-w-md">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#536476]" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search products..."
          className={`${adminStyles.input} pl-11`}
        />
      </label>

      <div className={adminStyles.tableWrap}>
        <table className={adminStyles.table}>
          <thead>
            <tr>
              {["Product", "Category", "Price", "Stock", "Tag", "Actions"].map(
                (heading) => (
                  <th key={heading} className={adminStyles.th}>
                    {heading}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className={adminStyles.td} colSpan={6}>
                  Loading products...
                </td>
              </tr>
            ) : (
              filtered.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className={adminStyles.td}>
                    <p className="font-black">{product.name}</p>
                    <p className="mt-1 text-xs font-bold text-[#536476]">
                      SKU: {product.sku}
                    </p>
                  </td>
                  <td className={adminStyles.td}>{product.category}</td>
                  <td className={`${adminStyles.td} font-black text-[#1273c4]`}>
                    {product.price}
                  </td>
                  <td className={adminStyles.td}>{product.stock}</td>
                  <td className={adminStyles.td}>{product.tag}</td>
                  <td className={adminStyles.td}>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="inline-flex items-center gap-2 bg-blue-50 px-3 py-2 text-xs font-black text-blue-700 transition hover:bg-blue-100"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(product)}
                        className="inline-flex items-center gap-2 bg-red-50 px-3 py-2 text-xs font-black text-red-700 transition hover:bg-red-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalMode ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#07111e]/65 p-4">
          <section className="w-full max-w-2xl border border-[#d8e0ea] bg-white">
            <div className="flex items-center justify-between border-b border-[#d8e0ea] px-5 py-4">
              <h2 className="text-lg font-black text-[#111827]">
                {modalMode === "edit" ? "Edit Product" : "Add Product"}
              </h2>
              <button
                aria-label="Close modal"
                onClick={closeModal}
                className="p-2 text-[#536476] hover:text-[#111827]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid max-h-[70vh] gap-4 overflow-auto p-5 sm:grid-cols-2">
              <Field label="Product Name">
                <input
                  value={form.name}
                  onChange={(event) => updateForm("name", event.target.value)}
                  className={adminStyles.input}
                />
              </Field>
              <Field label="SKU">
                <input
                  value={form.sku}
                  onChange={(event) => updateForm("sku", event.target.value)}
                  className={adminStyles.input}
                  disabled={modalMode === "edit"}
                />
              </Field>
              <Field label="Category">
                <input
                  value={form.category}
                  onChange={(event) => updateForm("category", event.target.value)}
                  className={adminStyles.input}
                />
              </Field>
              <Field label="Amount (NGN)">
                <input
                  type="number"
                  min="0"
                  value={form.amount}
                  onChange={(event) =>
                    updateForm("amount", Number(event.target.value))
                  }
                  className={adminStyles.input}
                />
              </Field>
              <Field label="Stock">
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(event) =>
                    updateForm("stock", Number(event.target.value))
                  }
                  className={adminStyles.input}
                />
              </Field>
              <Field label="Tag">
                <select
                  value={form.tag}
                  onChange={(event) => updateForm("tag", event.target.value)}
                  className={adminStyles.input}
                >
                  {tags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Product Image">
                <div className="grid gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => uploadImage(event.target.files?.[0])}
                    className={`${adminStyles.input} file:mr-4 file:border-0 file:bg-[#1273c4] file:px-4 file:py-2 file:text-sm file:font-black file:text-white`}
                  />
                  <input
                    value={form.image}
                    onChange={(event) => updateForm("image", event.target.value)}
                    placeholder={uploading ? "Uploading..." : "Uploaded image URL"}
                    className={adminStyles.input}
                  />
                </div>
              </Field>
              <Field label="Short Detail">
                <input
                  value={form.detail}
                  onChange={(event) => updateForm("detail", event.target.value)}
                  className={adminStyles.input}
                />
              </Field>
              <label className="grid gap-2 sm:col-span-2">
                <span className="text-xs font-black uppercase tracking-[0.12em] text-[#536476]">
                  Description
                </span>
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateForm("description", event.target.value)
                  }
                  className={`${adminStyles.input} min-h-28`}
                />
              </label>
            </div>

            <div className="flex flex-wrap justify-end gap-3 border-t border-[#d8e0ea] px-5 py-4">
              <button onClick={closeModal} className={adminStyles.secondary}>
                Cancel
              </button>
              <button
                onClick={saveProduct}
                className={adminStyles.primary}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Product"}
              </button>
            </div>
          </section>
        </div>
      ) : null}

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#07111e]/65 p-4">
          <section className="w-full max-w-md border border-[#d8e0ea] bg-white">
            <div className="border-b border-[#d8e0ea] px-5 py-4">
              <h2 className="text-lg font-black text-[#111827]">Delete Product</h2>
            </div>
            <div className="p-5 text-sm leading-7 text-[#536476]">
              Delete <strong className="text-[#111827]">{deleteTarget.name}</strong> from
              the catalogue? This action cannot be undone.
            </div>
            <div className="flex justify-end gap-3 border-t border-[#d8e0ea] px-5 py-4">
              <button
                onClick={() => setDeleteTarget(null)}
                className={adminStyles.secondary}
              >
                Cancel
              </button>
              <button onClick={deleteProduct} className={adminStyles.danger}>
                Delete
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </AdminShell>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase tracking-[0.12em] text-[#536476]">
        {label}
      </span>
      {children}
    </label>
  );
}
