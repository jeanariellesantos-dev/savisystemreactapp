import { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";

export default function ProductModal({
  isOpen,
  onClose,
  product,
  categories,
  units,
  onSubmit,
}: any) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(0);
  const [selectedUnits, setSelectedUnits] = useState<number[]>([]);

  useEffect(() => {
    if (product) {
      setName(product.product_name);
      setCategory(product.category_id);
      setSelectedUnits(product.units?.map((u:any)=>u.id) || []);
    } else {
      setName("");
      setCategory(categories[0]?.id || 0);
      setSelectedUnits([]);
    }
  }, [product]);

  const toggleUnit = (id:number)=>{
    setSelectedUnits(prev =>
      prev.includes(id)
        ? prev.filter(u=>u!==id)
        : [...prev,id]
    );
  };

  const submit = () => {
    onSubmit({
      product_name: name,
      category_id: category,
      units: selectedUnits.map(id=>({
        unit_id:id,
        is_default:false
      }))
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg mb-4">
        {product ? "Edit Product" : "Create Product"}
      </h2>

      <input
        value={name}
        onChange={e=>setName(e.target.value)}
        className="input mb-3"
        placeholder="Product name"
      />

      <select
        value={category}
        onChange={e=>setCategory(Number(e.target.value))}
        className="input mb-3"
      >
        {categories.map((c:any)=>(
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      {/* Units */}
      <div className="mb-4">
        <p className="text-sm mb-2">Units</p>
        <div className="grid grid-cols-2 gap-2">
          {units.map((u:any)=>(
            <label key={u.id} className="flex gap-2">
              <input
                type="checkbox"
                checked={selectedUnits.includes(u.id)}
                onChange={()=>toggleUnit(u.id)}
              />
              {u.name}
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onClose}>
          Cancel
        </Button>

        <Button size="sm" onClick={submit}>
          Save
        </Button>
      </div>
    </Modal>
  );
}
