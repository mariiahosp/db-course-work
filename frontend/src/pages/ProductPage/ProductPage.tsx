import { Link, useParams } from "react-router-dom";
import { useCatalogStore } from "../../store/useCatalogStore";
import "./ProductPage.scss";

export const ProductPage = () => {
  const { id } = useParams();
  const product = useCatalogStore((state) => state.products.find((item) => item.id === id));

  if (!product) {
    return (
      <section className="detail">
        <p className="detail__missing">Product not found.</p>
        <Link to="/products" className="detail__back">
          Back to products
        </Link>
      </section>
    );
  }

  return (
    <section className="detail">
      <Link to="/products" className="detail__back">
        Back to products
      </Link>
      <div className="detail__layout">
        {product.imageUrl ? (
          <img className="detail__image" src={product.imageUrl} alt={product.name} />
        ) : (
          <div className="detail__image detail__image--empty" />
        )}
        <div className="detail__info">
          <h1 className="detail__title">{product.name}</h1>
          <p className="detail__price">${product.price}</p>
          <p className="detail__description">{product.description}</p>
          <dl className="detail__facts">
            <div>
              <dt>SKU</dt>
              <dd>{product.sku}</dd>
            </div>
            <div>
              <dt>Category</dt>
              <dd>{product.category}</dd>
            </div>
            <div>
              <dt>Stock</dt>
              <dd>{product.stock}</dd>
            </div>
            <div>
              <dt>Active</dt>
              <dd>{product.isActive ? "Yes" : "No"}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
};
