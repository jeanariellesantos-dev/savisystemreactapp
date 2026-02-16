import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";
import Button from "../../components/ui/button/Button";
import ProductTable from "../../components/products/ProductTable";
import ProductModal from "../../components/products/ProductModal";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { adminProductService } from "../../services/adminService";
import { CategoryService } from "../../services/categoryService";
import { UnitService } from "../../services/unitService";

import { Product } from "../../types/product";
import { Category } from "../../types/category";
import { Unit } from "../../types/unit";

export default function ManageProducts() {
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  /* ================= FETCH ================= */

  const loadData = async () => {
    try {
      setLoading(true);

      const [p, c, u] = await Promise.all([
        adminProductService.getAll(),
        CategoryService.getAll(),
        UnitService.getAll(),
      ]);

      setProducts(p);
      setCategories(c);
      setUnits(u);
    } catch {
      showToast("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ================= SAVE ================= */

  const handleSave = async (data: any) => {
    try {
      if (selected) {
        await adminProductService.update(selected.id, data);
        showToast("Product updated", "success");
      } else {
        await adminProductService.create(data);
        showToast("Product created", "success");
      }

      setModalOpen(false);
      setSelected(null);
      loadData();
    } catch {
      showToast("Failed to save product", "error");
    }
  };

  /* ================= TOGGLE ================= */

  const handleToggle = async (product: Product) => {
    try {
      await adminProductService.toggleStatus(product.id);
      showToast("Product status updated", "success");
      loadData();
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  /* ================= SEARCH ================= */

  const filtered = products.filter((p) =>
    `${p.product_name} ${p.category?.name ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 text-gray-500 dark:text-gray-400">
        Loading products...
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <>
    <PageMeta title="Manage Product" description="Admin product management" />
    <PageBreadcrumb pageTitle="Manage Products" />
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">

      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Manage Products
        </h3>

        <div className="flex items-center gap-3">
          <input
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm 
                       dark:bg-gray-800 dark:border-gray-700"
          />

          <Button
            size="sm"
            variant="primary"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs hover:opacity-90 transition"
            onClick={() => {
              setSelected(null);
              setModalOpen(true);
            }}
          >
            + Add Product
          </Button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <ProductTable
        products={filtered}
        onEdit={(product) => {
          setSelected(product);
          setModalOpen(true);
        }}
        onToggle={handleToggle}
      />

      {/* ================= MODAL ================= */}
      {modalOpen && (
        <ProductModal
          isOpen={modalOpen}
          product={selected}
          categories={categories}
          units={units}
          onClose={() => {
            setModalOpen(false);
            setSelected(null);
          }}
          onSubmit={handleSave}
        />
      )}
    </div>
    </>
  );
}
