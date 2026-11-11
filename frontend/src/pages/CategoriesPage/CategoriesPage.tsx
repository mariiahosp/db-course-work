import { useEffect, useState } from "react";
import PencilIcon from "../../assets/pencilIcon.svg?react";
import { CatalogCard } from "../../components/CatalogCard/CatalogCard";
import { Input } from "../../components/Input/Input";
import { Modal } from "../../components/Modal/Modal";
import { useAuthStore } from "../../store/useAuthStore";
import { useCatalogStore } from "../../store/useCatalogStore";
import { RoleEnum } from "../../types/user";
import "../ProductsPage/ProductsPage.scss";
import type { Category } from "../../types/category";

export const CategoriesPage = () => {
  const isAdmin = useAuthStore((state) => state.user?.role === RoleEnum.ADMIN);
  const items = useCatalogStore((state) => state.categories);
  const saveCategoryStore = useCatalogStore((state) => state.saveCategory);
  const fetchCategories = useCatalogStore((state) => state.fetchCategories);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [formError, setFormError] = useState("");

  const visibleCategories = items.filter((category) =>
    category.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const openCreate = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setImageUrl("");
    setFormError("");
    setIsFormOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditingId(category.id);
    setName(category.name);
    setSlug(category.slug);
    setImageUrl(category.imageUrl ?? "");
    setFormError("");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setFormError("");
  };

  const saveCategory = async () => {
    const nextName = name.trim();
    const nextSlug = slug.trim();
    if (!nextName || !nextSlug) {
      setFormError("Name and slug are required.");
      return;
    }

    try {
      await saveCategoryStore({
        id: editingId ?? undefined,
        name: nextName,
        slug: nextSlug,
        imageUrl: imageUrl.trim() || undefined,
      });
      closeForm();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Request failed");
    }
  };

  useEffect(() => {
    void fetchCategories(100, 0);
  }, [fetchCategories]);

  return (
    <section className="catalog">
      <div className="catalog__head">
        <Input query={query} setQuery={setQuery} placeholder="Type category name" />
        {isAdmin ? (
          <button type="button" className="catalog__add" onClick={openCreate}>
            Add Category
          </button>
        ) : null}
      </div>

      {visibleCategories.length === 0 ? (
        <p className="catalog__empty">No Categories</p>
      ) : (
        <div className="cards">
          {visibleCategories.map((category) => (
            <CatalogCard
              key={category.id}
              to={`/categories/${category.id}`}
              title={category.name}
              text={category.slug}
              imageUrl={category.imageUrl}
              action={
                isAdmin ? (
                  <button type="button" className="edit-btn" aria-label={`Edit ${category.name}`} onClick={() => openEdit(category)}>
                    <PencilIcon className="edit-btn--svg" />
                  </button>
                ) : undefined
              }
            />
          ))}
        </div>
      )}

      {isFormOpen ? (
        <Modal title={editingId ? "Edit category" : "New category"} onClose={closeForm}>
          <form
            className="modal__form"
            onSubmit={(event) => {
              event.preventDefault();
              saveCategory();
            }}
          >
            <label className="modal__field">
              Name
              <input className="modal__input" value={name} onChange={(event) => setName(event.target.value)} />
            </label>
            <label className="modal__field">
              Slug
              <input className="modal__input" value={slug} onChange={(event) => setSlug(event.target.value)} />
            </label>
            <label className="modal__field">
              Image URL
              <input className="modal__input" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} placeholder="https://" />
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
