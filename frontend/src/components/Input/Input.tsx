import "./Input.scss";

type Props = {
  query: string,
  setQuery: (value: string) => void,
  placeholder?: string,
}

export const Input: React.FC<Props> = ({ query, setQuery, placeholder = "Type Product Name" }) => {
  return (
    <input
      type="text"
      className="input"
      placeholder={placeholder}
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
};
