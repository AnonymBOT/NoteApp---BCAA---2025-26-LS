import { useState } from "react";

function NoteModal({ categories, onClose, onSave, selectedNote }) {
  const [formData, setFormData] = useState({
    title: selectedNote?.title || "",
    description: selectedNote?.description || "",
    date: selectedNote?.date || "",
    priority: selectedNote?.priority || "Střední",
    status: selectedNote?.status || "Aktivní",
    categoryId: selectedNote?.categoryId || categories[0]?.id || "",
  });

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave(formData);
  }

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">
                {selectedNote ? "Upravit poznámku" : "Nová poznámka"}
              </h5>

              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Název</label>
                <input
                  className="form-control"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Popis</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label">Termín</label>
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Priorita</label>
                <select
                  className="form-select"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option>Nízká</option>
                  <option>Střední</option>
                  <option>Vysoká</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Stav</label>
                <select
                  className="form-select"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option>Aktivní</option>
                  <option>Hotovo</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Kategorie</label>
                <select
                  className="form-select"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Zavřít
              </button>

              <button type="submit" className="btn btn-success">
                Uložit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NoteModal;