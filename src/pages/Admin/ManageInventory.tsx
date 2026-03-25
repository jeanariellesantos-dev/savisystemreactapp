import { useState, useEffect } from "react";
import { useToast } from "../../context/ToastContext";
import { InventoryService, ProductService, DealershipService } from "../../services/adminService";
import { UnitService } from "../../services/unitService";


import ManageInventoryTable from "../../components/inventory/ManageInventoryTable";
import ManageInventoryModal from "../../components/inventory/ManageInventoryModal";
import { Dealership } from "../../types/dealership";

import Button from "../../components/ui/button/Button";

export default function ManageInventory() {
  const { showToast } = useToast();

  const [movements, setMovements] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [dealerships, setDealerships] = useState<Dealership[]>([]);
  const [meta, setMeta] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [unitsCache, setUnitsCache] = useState<Record<number, any[]>>({});
  const [units, setUnits] = useState<any[]>([]);
  

  const [filters, setFilters] = useState({
    search: "",
    dealership_id: "",
    type: "",
    start_date: "",
    end_date: "",
  });

  /* ================= FETCH ================= */
useEffect(() => {
  const loadStatic = async () => {
    const p = await ProductService.getAll();
    setProducts(p.data);
    preloadUnits(p.data);

    const d = await DealershipService.getAll();
    setDealerships(d.data);
  };

  loadStatic();
}, []);

const loadData = async () => {
  try {
    setLoading(true);

    const res = await InventoryService.getAll({
      page,
      dealership_id: filters.dealership_id,
      type: filters.type,
      start_date: filters.start_date,
      end_date: filters.end_date,
      search: debouncedSearch,
    });

    setMovements(res.data);
    setMeta(res);

  } catch {
    showToast("Failed to load movements", "error");
  } finally {
    setLoading(false);
  }
};

    const preloadUnits = async (products: any[]) => {
      const newCache: Record<number, any[]> = {};
  
      await Promise.all(
        products.map(async (p) => {
          try {
            const res = await UnitService.getByProductId(p.id);
            newCache[p.id] = res;
          } catch {
            newCache[p.id] = [];
          }
        })
      );
      console.log(newCache);
      setUnitsCache(newCache);
    };

    const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

    useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(filters.search);
    setPage(1); // reset page when typing
  }, 500);

  return () => clearTimeout(timer);
}, [filters.search]);

useEffect(() => {
  loadData();
}, [page, debouncedSearch, filters.dealership_id, filters.type, filters.start_date, filters.end_date]);

  /* ================= CREATE ================= */

  const handleCreate = async (payload: any) => {
    try {
      await InventoryService.create(payload);

      showToast("Movement recorded", "success");

      setModalOpen(false);
      loadData();

    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed", "error");
    }
  };

  const handleView = (item: any) => {
  setSelectedItem(item);
  setModalOpen(true); // reuse modal as "view"
};

const handleReverse = async (item: any) => {
  try {
    await InventoryService.reverse(item.id);
    showToast("Movement reversed", "success");
    loadData();
  } catch {
    showToast("Failed to reverse", "error");
  }
};

  /* ================= UI ================= */

  return (
    <div className="rounded-2xl border bg-white p-4 dark:bg-gray-900 dark:border-gray-800">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">

        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Inventory Movements
          </h3>
          <p className="text-xs text-gray-500">
            Track all stock movements
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => {
            setSelectedItem(null);
            setModalOpen(true);
          }}
        >
          + Add Movement
        </Button>

      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-4">

        <input
          type="text"
          placeholder="Search product..."
          value={filters.search}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value })
          }
          className="sm:col-span-3 border rounded-lg px-3 py-2 text-sm"
        />

        <select
          value={filters.dealership_id}
          onChange={(e) =>
            setFilters({ ...filters, dealership_id: e.target.value })
          }
          className="sm:col-span-2 border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All Dealerships</option>
          {dealerships.map((d) => (
            <option key={d.id} value={d.id}>
              {d.dealership_name}
            </option>
          ))}
        </select>

        <select
          value={filters.type}
          onChange={(e) =>
            setFilters({ ...filters, type: e.target.value })
          }
          className="sm:col-span-2 border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All Types</option>
          <option value="IN">IN</option>
          <option value="OUT">OUT</option>
          <option value="ADJUSTMENT">ADJUSTMENT</option>
        </select>

        <input
          type="date"
          value={filters.start_date}
          onChange={(e) =>
            setFilters({ ...filters, start_date: e.target.value })
          }
          className="sm:col-span-2 border rounded-lg px-3 py-2 text-sm"
        />

        <input
          type="date"
          value={filters.end_date}
          onChange={(e) =>
            setFilters({ ...filters, end_date: e.target.value })
          }
          className="sm:col-span-2 border rounded-lg px-3 py-2 text-sm"
        />

      </div>

      {/* TABLE */}
      {loading ? (
        <div className="p-6 text-sm text-gray-500">Loading...</div>
      ) : (
        <ManageInventoryTable data={movements}
          onView={handleView}
          onReverse={handleReverse} />
      )}

      {/* PAGINATION */}
    {meta && meta.last_page > 1 && (
    <div className="flex items-center justify-between mt-4">

        {/* PREVIOUS */}
        <button
        disabled={meta.current_page === 1}
        onClick={() => setPage((p) => p - 1)}
        className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50 
                    dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
        Previous
        </button>

        {/* PAGE INFO */}
        <div className="text-sm text-gray-600 dark:text-gray-300">
        Page{" "}
        <span className="font-semibold">{meta.current_page}</span> of{" "}
        <span className="font-semibold">{meta.last_page}</span>
        </div>

        {/* NEXT */}
        <button
        disabled={meta.current_page === meta.last_page}
        onClick={() => setPage((p) => p + 1)}
        className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50 
                    dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
        Next
        </button>

    </div>
    )}

      {/* MODAL */}
      {modalOpen && (
        <ManageInventoryModal
          isOpen={modalOpen}
          item={selectedItem}
          products={products}
          dealerships={dealerships}
          units={unitsCache}
          onClose={() => setModalOpen(false)}
          onSubmit={selectedItem ? null : handleCreate} // 🔥 FIX
        />
      )}

    </div>
  );
}