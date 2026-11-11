import { useState } from "react";
import ChevronDownIcon from "../../assets/Arrow-down.svg?react";
import ChevronUpIcon from "../../assets/Arrow-up.svg?react";
import PencilIcon from "../../assets/pencilIcon.svg?react";
import { Dropdown } from "../../components/DropDown/DropDown";
import { Input } from "../../components/Input/Input";
import { CatalogCard } from "../../components/CatalogCard/CatalogCard";
import { Modal } from "../../components/Modal/Modal";
import { type CatalogProduct } from "../../mocks/catalog";
import { useAuthStore } from "../../store/useAuthStore";
import { useCatalogStore } from "../../store/useCatalogStore";
import { RoleEnum } from "../../types/user";
import "./ProductsPage.scss";

type PriceSort = "lowToHigh" | "highToLow" | "none";

type ProductDraft = {
  name: string;
  sku: string;
  description: string;
  category: string;
  price: string;
  stock: string;
  imageUrl: string;
  isActive: boolean;
};

const emptyDraft = (category: string): ProductDraft => ({
  name: "",
  sku: "",
  description: "",
  category,
  price: "",
  stock: "",
  imageUrl: "",
  isActive: true,
});

export const ProductsPage = () => {
  const isAdmin = useAuthStore((state) => state.user?.role === RoleEnum.ADMIN);
  const items = useCatalogStore((state) => state.products);
  const categories = useCatalogStore((state) => state.categories);
  const upsertProduct = useCatalogStore((state) => state.upsertProduct);
  const [query, setQuery] = useState("");
  const [priceSort, setPriceSort] = useState<PriceSort>("none");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [draft, setDraft] = useState<ProductDraft>(emptyDraft(categories[0]?.name ?? ""));
  const [formError, setFormError] = useState("");

  const visibleProducts = [...items]
    .filter((product) => product.name.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((left, right) => {
      if (priceSort === "lowToHigh") {
        return left.price - right.price;
      }
      if (priceSort === "highToLow") {
        return right.price - left.price;
      }
      return 0;
    });

  const openCreate = () => {
    setEditingId(null);
    setDraft(emptyDraft(categories[0]?.name ?? ""));
    setFormError("");
    setIsFormOpen(true);
  };

  const openEdit = (product: CatalogProduct) => {
    setEditingId(product.id);
    setDraft({
      name: product.name,
      sku: product.sku,
      description: product.description,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      imageUrl: product.imageUrl ?? "",
      isActive: product.isActive,
    });
    setFormError("");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setFormError("");
  };

  const saveProduct = () => {
    const price = Number(draft.price);
    const stock = Number(draft.stock);
    if (!draft.name.trim() || !draft.sku.trim() || !draft.description.trim() || !draft.category) {
      setFormError("Name, SKU, description and category are required.");
      return;
    }
    if (!Number.isFinite(price) || price <= 0 || !Number.isInteger(stock) || stock < 0) {
      setFormError("Price must be greater than 0 and stock must be a whole number.");
      return;
    }

    const imageUrl = draft.imageUrl.trim();
    const next: CatalogProduct = {
      id: editingId ?? `prod-${Date.now()}`,
      name: draft.name.trim(),
      sku: draft.sku.trim(),
      description: draft.description.trim(),
      category: draft.category,
      price,
      stock,
      imageUrl: imageUrl || null,
      isActive: draft.isActive,
    };

    upsertProduct(next);
    closeForm();
  };

  return (
    <section className="catalog">
      <div className="catalog__head">
        <Input query={query} setQuery={setQuery} />
        {isAdmin ? (
          <button type="button" className="catalog__add" onClick={openCreate}>
            Add Product
          </button>
        ) : null}
        <Dropdown
          label="Price From"
          onSelect={(value) => setPriceSort(value as PriceSort)}
          items={[
            { label: "Low to High", value: "lowToHigh", icon: <ChevronUpIcon className="dropdown__arrow" /> },
            { label: "High to Low", value: "highToLow", icon: <ChevronDownIcon className="dropdown__arrow" /> },
          ]}
        />
      </div>

      {visibleProducts.length === 0 ? (
        <p className="catalog__empty">No Products</p>
      ) : (
        <div className="cards">
          {visibleProducts.map((product) => (
            <CatalogCard
              key={product.id}
              to={`/products/${product.id}`}
              title={product.name}
              text={product.description}
              imageUrl={product.imageUrl}
              meta={`$${product.price}`}
              action={
                isAdmin ? (
                  <button type="button" className="edit-btn" aria-label={`Edit ${product.name}`} onClick={() => openEdit(product)}>
                    <PencilIcon className="edit-btn--svg" />
                  </button>
                ) : undefined
              }
            />
          ))}
        </div>
      )}

      {isFormOpen ? (
        <Modal title={editingId ? "Edit product" : "New product"} onClose={closeForm}>
          <form
            className="modal__form"
            onSubmit={(event) => {
              event.preventDefault();
              saveProduct();
            }}
          >
            <label className="modal__field">
              Name
              <input className="modal__input" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
            </label>
            <label className="modal__field">
              SKU
              <input className="modal__input" value={draft.sku} onChange={(event) => setDraft({ ...draft, sku: event.target.value })} />
            </label>
            <label className="modal__field">
              Category
              <select className="modal__select" value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="modal__field">
              Description
              <textarea className="modal__textarea" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
            </label>
            <label className="modal__field">
              Image URL
              <input className="modal__input" value={draft.imageUrl} onChange={(event) => setDraft({ ...draft, imageUrl: event.target.value })} placeholder="https://" />
            </label>
            <label className="modal__field">
              Price
              <input className="modal__input" type="number" min="0.01" step="0.01" value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} />
            </label>
            <label className="modal__field">
              Stock
              <input className="modal__input" type="number" min="0" step="1" value={draft.stock} onChange={(event) => setDraft({ ...draft, stock: event.target.value })} />
            </label>
            <label className="modal__check">
              <input type="checkbox" checked={draft.isActive} onChange={(event) => setDraft({ ...draft, isActive: event.target.checked })} />
              Active
            </label>
            {formError ? <p className="modal__error">{formError}</p> : null}
            <div className="modal__actions">
              <button type="button" className="modal__cancel" onClick={closeForm}>
                Cancel
              </button>
              <button type="submit" className="modal__save">
                Save
              </button>
            </div>
          </form>
        </Modal>
      ) : null}
    </section>
  );
};
