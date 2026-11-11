import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { CatalogCard } from "../../components/CatalogCard/CatalogCard";
import { useCatalogStore } from "../../store/useCatalogStore";
import "../ProductPage/ProductPage.scss";

export const CategoryPage = () => {
  const { id } = useParams();
  const category = useCatalogStore((state) => state.categories.find((item) => item.id === id));
  const catalogProducts = useCatalogStore((state) => state.products);
  const error = useCatalogStore((state) => state.error);
  const fetchCategory = useCatalogStore((state) => state.fetchCategory);
  const fetchProducts = useCatalogStore((state) => state.fetchProducts);
  const products = useMemo(
    () => catalogProducts.filter((item) => item.categoryId === id),
    [catalogProducts, id],
  );

  useEffect(() => {
    if (!id) return;
    void fetchCategory(id);
    void fetchProducts(100, 0);
  }, [id, fetchCategory, fetchProducts]);

  if (!category) {
    return (
      <section className="detail">
        <p className="detail__missing">{error ?? "Loading..."}</p>
        <Link to="/categories" className="detail__back">
          Back to categories
        </Link>
      </section>
    );
  }

  return (
    <section className="detail">
      <Link to="/categories" className="detail__back">
        Back to categories
      </Link>
      <div className="detail__layout">
        {category.imageUrl ? (
          <img className="detail__image" src={category.imageUrl} alt={category.name} />
        ) : (
          <div className="detail__image detail__image--empty" />
        )}
        <div className="detail__info">
          <h1 className="detail__title">{category.name}</h1>
          <p className="detail__description">{category.slug}</p>
        </div>
      </div>
      <h2 className="detail__subtitle">Products</h2>
      {products.length === 0 ? (
        <p className="detail__description">No products in this category.</p>
      ) : (
        <div className="cards">
          {products.map((product) => (
            <CatalogCard
              key={product.id}
              to={`/products/${product.id}`}
              title={product.name}
              text={product.description}
              imageUrl={product.imageUrl}
              meta={`$${product.price}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};
