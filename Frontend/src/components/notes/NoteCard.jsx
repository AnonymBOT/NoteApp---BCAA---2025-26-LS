function NoteCard({ note, categories, onDelete, onEdit }) {
  const category = categories.find(
    (category) => category.id === note.categoryId
  );

  return (
    <div className="card shadow-sm h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <h5 className="card-title">{note.title}</h5>

          <div>
            <button
              className="btn btn-outline-primary btn-sm me-2"
              onClick={() => onEdit(note)}
            >
              Upravit
            </button>

            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => onDelete(note.id)}
            >
              Smazat
            </button>
          </div>
        </div>

        <span
          className="badge mb-3"
          style={{
            backgroundColor: category?.color || "#6c757d",
          }}
        >
          {category?.name || "Bez kategorie"}
        </span>

        <p className="card-text">{note.description}</p>

        <hr />

        <small className="text-muted d-block">
          📅 Termín: {note.date}
        </small>

        <small className="text-muted d-block">
          Priorita: {note.priority}
        </small>

        <small className="text-muted d-block">
          Stav: {note.status}
        </small>
      </div>
    </div>
  );
}

export default NoteCard;