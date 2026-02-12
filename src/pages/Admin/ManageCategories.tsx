import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";
import Button from "../../components/ui/button/Button";
import CategoryTable from "../../components/categories/CategoryTable";
import CategoryModal from "../../components/categories/CategoryModal";

import { CategoryService } from "../../services/categoryService";
import { Category } from "../../types/category";

export default function ManageCategories() {
  const { showToast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Category | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  /* ================= FETCH ================= */

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await CategoryService.getAll();
      setCategories(res);
    } catch {
      showToast("Failed to load categories", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  /* ================= SAVE ================= */

  const handleSave = async (data: {
    name: string;
    slug: string;
    is_active: boolean;
  }) => {
    try {
      if (selected) {
        await CategoryService.update(selected.id, data);
        showToast("Category updated", "success");
      } else {
        await CategoryService.create(data);
        showToast("Category created", "success");
      }

      setModalOpen(false);
      setSelected(null);
      loadCategories();
    } catch {
      showToast("Failed to save category", "error");
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (cat: Category) => {
    if (!confirm(`Delete category "${cat.name}"?`)) return;

    try {
      await CategoryService.delete(cat.id);
      showToast("Category deleted", "success");
      loadCategories();
    } catch {
      showToast("Delete failed", "error");
    }
  };

  /* ================= SEARCH ================= */

  const filtered = categories.filter((c) =>
    `${c.name} ${c.slug}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div className="p-6 text-gray-500 dark:text-gray-400">
        Loading categories...
      </div>
    );

  /* ================= UI ================= */

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Manage Categories
        </h3>

        <div className="flex items-center gap-3">
          <input
            placeholder="Search category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700"
          />

          <Button
            size="sm"
            variant="primary"
            onClick={() => {
              setSelected(null);
              setModalOpen(true);
            }}
          >
            Add Category
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <CategoryTable
        categories={filtered}
        onEdit={(cat) => {
          setSelected(cat);
          setModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      {/* MODAL */}
      {modalOpen && (
        <CategoryModal
          isOpen={modalOpen}
          category={selected}
          onClose={() => {
            setModalOpen(false);
            setSelected(null);
          }}
          onSubmit={handleSave}
        />
      )}
    </div>
  );
}
