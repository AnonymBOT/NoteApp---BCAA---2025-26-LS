function NoteFilters({ categories, filters, onFilterChange }) {
  function handleChange(event) {
    onFilterChange(event.target.name, event.target.value);
  }

  return (
    <div className="row mb-4">
      <div className="col-md-4">
        <select
          className="form-select"
          name="categoryId"
          value={filters.categoryId}
          onChange={handleChange}
        >
          <option value="">Všechny kategorie</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-4">
        <select
          className="form-select"
          name="priority"
          value={filters.priority}
          onChange={handleChange}
        >
          <option value="">Všechny priority</option>
          <option value="Vysoká">Vysoká</option>
          <option value="Střední">Střední</option>
          <option value="Nízká">Nízká</option>
        </select>
      </div>

      <div className="col-md-4">
        <select
          className="form-select"
          name="status"
          value={filters.status}
          onChange={handleChange}
        >
          <option value="">Všechny stavy</option>
          <option value="Aktivní">Aktivní</option>
          <option value="Hotovo">Hotovo</option>
        </select>
      </div>
    </div>
  );
}

export default NoteFilters;