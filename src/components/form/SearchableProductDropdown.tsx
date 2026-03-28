import { useEffect, useRef, useState } from "react";
import Input from "./input/InputField";

type Product = {
  id: number;
  product_name: string;
  category_id?: number;
  category_name?: string;
};

type Props = {
  products: Product[];
  value: number | null;
  onChange: (product: Product | null) => void;
};

export default function SearchableProductDropdown({
  products,
  value,
  onChange,
}: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // ✅ selected product
  const selected = products.find((p) => p.id === value) || null;

  // ✅ filter products
  const filtered = products.filter((p) =>
    `${p.product_name} ${p.category_name ?? ""}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  // ✅ show selected label when not typing
  useEffect(() => {
    if (selected && !open) {
      setQuery(selected.product_name);
    }
  }, [selected, open]);

  // ✅ close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <Input
        value={query}
        placeholder="Search product..."
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
      />

      {open && (
        <div className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-lg border bg-white shadow-lg dark:bg-gray-800">
          {filtered.length === 0 && (
            <div className="p-2 text-sm text-gray-500">
              No results found
            </div>
          )}

          {filtered.map((product) => (
            <div
              key={product.id}
              onClick={() => {
                onChange(product);
                setQuery(product.product_name);
                setOpen(false);
              }}
              className="cursor-pointer px-3 py-2 text-sm hover:bg-blue-50 dark:hover:bg-gray-700"
            >
              <div className="font-medium">{product.product_name}</div>

              {product.category_name && (
                <div className="text-xs text-gray-500">
                  {product.category_name}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}