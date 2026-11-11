import { Link } from "react-router-dom";
import "./CatalogCard.scss";

type CatalogCardProps = {
  to: string;
  title: string;
  text: string;
  imageUrl: string | null;
  meta?: string;
  action?: React.ReactNode;
};

export const CatalogCard = ({ to, title, text, imageUrl, meta, action }: CatalogCardProps) => {
  return (
    <article className="card">
      <Link to={to} className="card__link">
        {imageUrl ? (
          <img className="card__image" src={imageUrl} alt={title} />
        ) : (
          <div className="card__image card__image--empty" />
        )}
        <div className="card__body">
          <h2 className="card__title">{title}</h2>
          <p className="card__text">{text}</p>
          {meta ? <p className="card__meta">{meta}</p> : null}
        </div>
      </Link>
      {action ? <div className="card__action">{action}</div> : null}
    </article>
  );
};
