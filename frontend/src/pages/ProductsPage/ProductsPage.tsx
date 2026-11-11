import { useEffect, useState } from "react";
import ChevronDownIcon from "../../assets/Arrow-down.svg?react";
import ChevronUpIcon from "../../assets/Arrow-up.svg?react";
import PencilIcon from "../../assets/pencilIcon.svg?react";
import { Dropdown } from "../../components/DropDown/DropDown";
import { Input } from "../../components/Input/Input";
import { CatalogCard } from "../../components/CatalogCard/CatalogCard";
import { Modal } from "../../components/Modal/Modal";
import { useAuthStore } from "../../store/useAuthStore";
import { useCatalogStore } from "../../store/useCatalogStore";
import { RoleEnum } from "../../types/user";
import "./ProductsPage.scss";
import type { Product } from "../../types/product";

type PriceSort = "lowToHigh" | "highToLow" | "none";

type ProductDraft = {
  name: string;
  sku: string;
  description: string;
  categoryId: string;
  price: string;
  stock: string;
  imageUrl: string;
  isActive: boolean;
};

const emptyDraft = (categoryId: string): ProductDraft => ({
  name: "",
  sku: "",
  description: "",
  categoryId,
  price: "",
  stock: "",
  imageUrl: "",
  isActive: true,
});

export const ProductsPage = () => {
  const isAdmin = useAuthStore((state) => state.user?.role === RoleEnum.ADMIN);
  const items = useCatalogStore((state) => state.products);
  const categories = useCatalogStore((state) => state.categories);
  const saveProductStore = useCatalogStore((state) => state.saveProduct);
  const fetchCategories = useCatalogStore((state) => state.fetchCategories);
  const fetchProducts = useCatalogStore((state) => state.fetchProducts);
  const [query, setQuery] = useState("");
  const [priceSort, setPriceSort] = useState<PriceSort>("none");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingVersion, setEditingVersion] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [draft, setDraft] = useState<ProductDraft>(emptyDraft(categories[0]?.id ?? ""));
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
    setEditingVersion(null);
    setDraft(emptyDraft(categories[0]?.id ?? ""));
    setFormError("");
    setIsFormOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingId(product.id);
    setEditingVersion(product.version);
    setDraft({
      name: product.name,
      sku: product.sku,
      description: product.description,
      categoryId: product.categoryId,
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

  const saveProduct = async () => {
    const price = Number(draft.price);
    const stock = Number(draft.stock);
    if (!draft.name.trim() || !draft.sku.trim() || !draft.description.trim() || !draft.categoryId) {
      setFormError("Name, SKU, description and category are required.");
      return;
    }
    if (!Number.isFinite(price) || price <= 0 || !Number.isInteger(stock) || stock < 0) {
      setFormError("Price must be greater than 0 and stock must be a whole number.");
      return;
    }

    try {
      await saveProductStore({
        id: editingId ?? undefined,
        categoryId: draft.categoryId,
        sku: draft.sku.trim(),
        name: draft.name.trim(),
        description: draft.description.trim(),
        price,
        stock,
        isActive: draft.isActive,
        imageUrl: draft.imageUrl.trim() || undefined,
        version: editingVersion ?? undefined,
      });
      closeForm();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Request failed");
    }
  };

  useEffect(() => {
    void fetchCategories(100, 0);
    void fetchProducts(100, 0);
  }, [fetchCategories, fetchProducts]);

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
              <select className="modal__select" value={draft.categoryId} onChange={(event) => setDraft({ ...draft, categoryId: event.target.value })}>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
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
