import { useState } from "react";
import ChevronDownIcon from "../../assets/Arrow-down.svg?react";
import ChevronUpIcon from "../../assets/Arrow-up.svg?react";
import PencilIcon from "../../assets/pencilIcon.svg?react";
import { Dropdown } from "../../components/DropDown/DropDown";
import { Input } from "../../components/Input/Input";
import { Table } from "../../components/Table/Table";
import { products } from "../../mocks/catalog";
import "./ProductsPage.scss";

type PriceSort = "lowToHigh" | "highToLow" | "none";

export const ProductsPage = () => {
  const [query, setQuery] = useState("");
  const [priceSort, setPriceSort] = useState<PriceSort>("none");

  const visibleProducts = [...products]
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

  return (
    <section className="catalog">
      <div className="catalog__head">
        <Input query={query} setQuery={setQuery} />
        <button type="button" className="catalog__add">
          Add Product
        </button>
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
        <div className="table-wrapper">
          <Table headers={["Name", "SKU", "Category", "Price", "Stock", "Active", ""]}>
            {visibleProducts.map((product) => (
              <tr key={product.id} className="products__table--body--tr">
                <td className="products__table--body--tr--td">{product.name}</td>
                <td className="products__table--body--tr--td">{product.sku}</td>
                <td className="products__table--body--tr--td">{product.category}</td>
                <td className="products__table--body--tr--td">${product.price}</td>
                <td className="products__table--body--tr--td">{product.stock}</td>
                <td className="products__table--body--tr--td">{product.isActive ? "Yes" : "No"}</td>
                <td className="products__table--body--tr--td">
                  <button type="button" className="edit-btn" aria-label={`Edit ${product.name}`}>
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
