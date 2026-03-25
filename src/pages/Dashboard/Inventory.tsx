import { useState, useEffect } from "react";
import { useToast } from "../../context/ToastContext";
import Button from "../../components/ui/button/Button";

import InventoryTable from "../../components/inventory/InventoryTable";
import InventoryModal from "../../components/inventory/InventoryModal";
import InvetoryMovementModal from "../../components/inventory/InvetoryMovementModal";
import { InventoryService } from "../../services/inventoryService";
import { DealershipService } from "../../services/dealershipService";
import { getRoleFlags } from "../../components/utils/authHelper";
import { Dealership } from "../../types/dealership";
import {ProductService } from "../../services/productService";

export default function InventoryPage() {
  const { showToast } = useToast();

  const [movements, setMovements] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [dealerships, setDealerships] = useState<Dealership[]>([]);
  const [unitsCache, setUnitsCache] = useState<Record<number, any[]>>({});
  const [units, setUnits] = useState<any[]>([]);
  
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  const { isInventory, isAccounting } = getRoleFlags();

  

  /* ================= FETCH ================= */

  const loadData = async () => {
    try {
      setLoading(true);

      const res = await InventoryService.getAll({
        page,
        search,
      });

      setDealerships(await DealershipService.getAll());

      setMovements(res.data);
      setMeta(res);
      preloadUnits(res.data);

    } catch {
      showToast("Failed to load inventory", "error");
    } finally {
      setLoading(false);
    }
  };

  const preloadUnits = async (products: any[]) => {
    const newCache: Record<number, any[]> = {};

    await Promise.all(
      products.map(async (p) => {
        try {
          const res = await ProductService.getUnits(p.id);
          newCache[p.id] = res;
        } catch {
          newCache[p.id] = [];
        }
      })
    );
    setUnitsCache(newCache);
  };


  useEffect(() => {
    loadData();
  }, [page, search]);

  /* ================= CREATE ================= */

  const handleCreate = async (payload: any) => {
    try {
      await InventoryService.create(payload);
      showToast("Inventory movement created", "success");
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to create", "error");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-4 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">

      {/* HEADER */}
      <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Inventory
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Create stock in, out, and adjustments
          </p>
        </div>

        <div className="flex items-center gap-3">

          {/* SEARCH */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="rounded-lg border border-gray-300 pl-9 pr-3 py-2 text-sm 
                         dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
            />
            <span className="absolute left-2 top-2.5 text-gray-400 text-xs">
              🔍
            </span>
          </div>

          {/* CREATE BUTTON */}
          {/* {(isInventory || isAccounting) && (
            <Button
              size="sm"
              variant="primary"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs hover:opacity-90 transition"
              onClick={() => setModalOpen(true)}
            >
              ➕ Movement
            </Button>
          )} */}
        </div>
      </div>

      {/* TABLE / STATES */}
      {loading ? (
        <div className="p-6 text-sm text-gray-500">Loading inventory...</div>
      ) : movements.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No inventory movements found
        </div>
      ) : (
        <InventoryTable movements={movements}
          onSelect={(p: any) => {
            setSelectedProduct(p);
            const cachedUnits = unitsCache[p.id] || [];
            setUnits(cachedUnits);
            setModalOpen(true);
          }}
        />
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
        <InventoryModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleCreate}
        />
      )}

      {modalOpen && (
        <InvetoryMovementModal
            isOpen={modalOpen}
            product={selectedProduct}
            dealerships={dealerships}
            units={units}
            onClose={() => setModalOpen(false)}
            onSubmit={handleCreate}
        />
        )}
    </div>
  );
}