import { useState } from "react";
import PencilIcon from "../../assets/pencilIcon.svg?react";
import { Input } from "../../components/Input/Input";
import { Modal } from "../../components/Modal/Modal";
import { Table } from "../../components/Table/Table";
import { categories as seedCategories } from "../../mocks/catalog";
import "../ProductsPage/ProductsPage.scss";

type Category = (typeof seedCategories)[number];

export const CategoriesPage = () => {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Category[]>(seedCategories);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [formError, setFormError] = useState("");

  const visibleCategories = items.filter((category) =>
    category.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const openCreate = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setFormError("");
    setIsFormOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditingId(category.id);
    setName(category.name);
    setSlug(category.slug);
    setFormError("");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setFormError("");
  };

  const saveCategory = () => {
    const nextName = name.trim();
    const nextSlug = slug.trim();
    if (!nextName || !nextSlug) {
      setFormError("Name and slug are required.");
      return;
    }

    setItems((current) =>
      editingId
        ? current.map((category) =>
            category.id === editingId ? { ...category, name: nextName, slug: nextSlug } : category,
          )
        : [{ id: `cat-${Date.now()}`, name: nextName, slug: nextSlug }, ...current],
    );
    closeForm();
  };

  return (
    <section className="catalog">
      <div className="catalog__head">
        <Input query={query} setQuery={setQuery} placeholder="Type category name" />
        <button type="button" className="catalog__add" onClick={openCreate}>
          Add Category
        </button>
      </div>

      {visibleCategories.length === 0 ? (
        <p className="catalog__empty">No Categories</p>
      ) : (
        <div className="table-wrapper">
          <Table headers={["Name", "Slug", ""]}>
            {visibleCategories.map((category) => (
              <tr key={category.id} className="products__table--body--tr">
                <td className="products__table--body--tr--td">{category.name}</td>
                <td className="products__table--body--tr--td">{category.slug}</td>
                <td className="products__table--body--tr--td">
                  <button type="button" className="edit-btn" aria-label={`Edit ${category.name}`} onClick={() => openEdit(category)}>
                    <PencilIcon className="edit-btn--svg" />
                  </button>
                </td>
              </tr>
            ))}
          </Table>
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
