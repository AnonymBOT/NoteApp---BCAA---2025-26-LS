function CategoryItem({ category, onEdit, onDelete }) {
  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center gap-2">
        <span
          style={{
            width: "14px",
            height: "14px",
            backgroundColor: category.color,
            borderRadius: "50%",
            display: "inline-block",
          }}
        ></span>

        <span>{category.name}</span>
      </div>

      <div>
        <button
          className="btn btn-outline-primary btn-sm me-2"
          onClick={() => onEdit(category)}
        >
          Upravit
        </button>

        <button
          className="btn btn-outline-danger btn-sm"
          onClick={() => onDelete(category.id)}
        >
          Smazat
        </button>
      </div>
    </li>
  );
}

export default CategoryItem;