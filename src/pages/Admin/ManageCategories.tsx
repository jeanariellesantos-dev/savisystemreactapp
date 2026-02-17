import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";
import CategoryTable from "../../components/categories/CategoryTable";
import CategoryModal from "../../components/categories/CategoryModal";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { CategoryService } from "../../services/adminService";
import { Category } from "../../types/category";
import Button from "../../components/ui/button/Button";

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
    // is_active: boolean;
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

  /* ================= SEARCH ================= */

  const filteredCategories = categories.filter((c) => {
    if (!search) return true;

    const text = `${c.name} ${c.slug ?? ""}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  if (loading)
    return <p className="p-6 text-gray-500 dark:text-gray-400">Loading categories...</p>;

  return (
    <>
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700"
          />

          <Button size="sm" variant="primary"
                      className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs hover:opacity-90 transition"
          onClick={() => {
            setSelected(null);
            setModalOpen(true);
            
          }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
             Create Category
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <CategoryTable
        categories={filteredCategories}
        onEdit={(cat) => {
          setSelected(cat);
          setModalOpen(true);
        }}
        onToggle={handleToggleStatus}
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
    </>
  );
}
