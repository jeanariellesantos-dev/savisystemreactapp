import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";
import CategoryTable from "../../components/categories/CategoryTable";
import CategoryModal from "../../components/categories/CategoryModal";
import { CategoryService } from "../../services/adminService";
import { Category } from "../../types/category";
import Button from "../../components/ui/button/Button";

export default function ManageCategories() {
  const { showToast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [meta, setMeta] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    search: "",
  });

  const [selected, setSelected] = useState<Category | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  /* ================= FETCH ================= */

  const loadCategories = async () => {
    try {
      setLoading(true);

      const res = await CategoryService.getAll({
        page,
        per_page: 10,
        ...filters,
      });

      setCategories(res.data); // ✅ paginated data
      setMeta(res);            // ✅ pagination meta

    } catch {
      showToast("Failed to load categories", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [page, filters]);

  /* ================= SAVE ================= */

  const handleSave = async (data: {
    name: string;
    slug: string;
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

  /* ================= TOGGLE ================= */

  const handleToggleStatus = async (cat: Category) => {
    try {
      await CategoryService.toggleStatus(cat.id);
      showToast("Category status updated", "success");
      loadCategories();
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">

      {/* HEADER */}
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Manage Categories
        </h3>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search category..."
            value={filters.search}
            onChange={(e) => {
              setPage(1); // ✅ reset page
              setFilters({ search: e.target.value });
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
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
            + Create Category
          </Button>
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <p className="p-6 text-gray-500 dark:text-gray-400">
          Loading categories...
        </p>
      ) : (
        <CategoryTable
          categories={categories} // ✅ NO FILTER
          onEdit={(cat) => {
            setSelected(cat);
            setModalOpen(true);
          }}
          onToggle={handleToggleStatus}
        />
      )}

      {/* PAGINATION */}
      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between mt-4">

          <button
            disabled={meta.current_page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50"
          >
            Previous
          </button>

          <div className="text-sm text-gray-600 dark:text-gray-300">
            Page <b>{meta.current_page}</b> of <b>{meta.last_page}</b>
          </div>

          <button
            disabled={meta.current_page === meta.last_page}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50"
          >
            Next
          </button>

        </div>
      )}

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