import { useState } from "react";

function CategoryModal({ selectedCategory, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: selectedCategory?.name || "",
    color: selectedCategory?.color || "#0d6efd",
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
                {selectedCategory ? "Upravit kategorii" : "Nová kategorie"}
              </h5>

              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Název kategorie</label>
                <input
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Barva</label>
                <input
                  type="color"
                  className="form-control form-control-color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                />
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

export default CategoryModal;