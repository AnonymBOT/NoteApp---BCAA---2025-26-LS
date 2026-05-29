import { useEffect, useState } from "react";

import CategoryItem from "../components/categories/CategoryItem";
import CategoryModal from "../components/categories/CategoryModal";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  async function loadCategories() {
    const data = await getCategories();
    setCategories(data);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function handleOpenCreateModal() {
    setSelectedCategory(null);
    setIsModalOpen(true);
  }

  function handleOpenEditModal(category) {
    setSelectedCategory(category);
    setIsModalOpen(true);
  }

  async function handleSaveCategory(category) {
    if (selectedCategory) {
      await updateCategory(selectedCategory.id, category);
    } else {
      await createCategory(category);
    }

    await loadCategories();
    setIsModalOpen(false);
    setSelectedCategory(null);
  }

  async function handleDeleteCategory(id) {
    await deleteCategory(id);
    await loadCategories();
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Správa kategorií</h1>

        <button className="btn btn-success" onClick={handleOpenCreateModal}>
          + Nová kategorie
        </button>
      </div>

      <ul className="list-group">
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteCategory}
          />
        ))}
      </ul>

      {isModalOpen && (
        <CategoryModal
          selectedCategory={selectedCategory}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCategory(null);
          }}
          onSave={handleSaveCategory}
        />
      )}
    </div>
  );
}

export default Categories;