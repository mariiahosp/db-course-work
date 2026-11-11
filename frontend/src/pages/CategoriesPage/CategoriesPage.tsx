import { useState } from "react";
import PencilIcon from "../../assets/pencilIcon.svg?react";
import { Input } from "../../components/Input/Input";
import { Table } from "../../components/Table/Table";
import { categories } from "../../mocks/catalog";
import "../ProductsPage/ProductsPage.scss";

export const CategoriesPage = () => {
  const [query, setQuery] = useState("");
  const visibleCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <section className="catalog">
      <div className="catalog__head">
        <Input query={query} setQuery={setQuery} placeholder="Type category name" />
        <button type="button" className="catalog__add">
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
                  <button type="button" className="edit-btn" aria-label={`Edit ${category.name}`}>
                    <PencilIcon className="edit-btn--svg" />
                  </button>
                </td>
              </tr>
            ))}
          </Table>
        </div>
      )}
    </section>
  );
};
