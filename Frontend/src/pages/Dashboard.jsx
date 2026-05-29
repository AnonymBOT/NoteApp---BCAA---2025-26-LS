import { useEffect, useState } from "react";

import NoteCard from "../components/notes/NoteCard";
import NoteFilters from "../components/notes/NoteFilters";
import NoteModal from "../components/notes/NoteModal";

import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../services/noteService";

import { getCategories } from "../services/categoryService";

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const [filters, setFilters] = useState({
    categoryId: "",
    priority: "",
    status: "",
  });

  async function loadData() {
    const notesData = await getNotes();
    const categoriesData = await getCategories();

    setNotes(notesData);
    setCategories(categoriesData);
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleFilterChange(name, value) {
    setFilters({
      ...filters,
      [name]: value,
    });
  }

  const filteredNotes = notes.filter((note) => {
    const categoryMatch =
      filters.categoryId === "" || note.categoryId === filters.categoryId;

    const priorityMatch =
      filters.priority === "" || note.priority === filters.priority;

    const statusMatch =
      filters.status === "" || note.status === filters.status;

    return categoryMatch && priorityMatch && statusMatch;
  });

  function handleOpenCreateModal() {
    setSelectedNote(null);
    setIsModalOpen(true);
  }

  function handleOpenEditModal(note) {
    setSelectedNote(note);
    setIsModalOpen(true);
  }

  async function handleSaveNote(note) {
    if (selectedNote) {
      await updateNote(selectedNote.id, note);
    } else {
      await createNote(note);
    }

    await loadData();
    setIsModalOpen(false);
    setSelectedNote(null);
  }

  async function handleDeleteNote(id) {
    await deleteNote(id);
    await loadData();
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Dashboard</h1>

        <button className="btn btn-success" onClick={handleOpenCreateModal}>
          + Nová poznámka
        </button>
      </div>

      <NoteFilters
        categories={categories}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <div className="row">
        {filteredNotes.map((note) => (
          <div className="col-md-6 mb-3" key={note.id}>
            <NoteCard
              note={note}
              categories={categories}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteNote}
            />
          </div>
        ))}
      </div>

      {isModalOpen && (
        <NoteModal
          categories={categories}
          selectedNote={selectedNote}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedNote(null);
          }}
          onSave={handleSaveNote}
        />
      )}
    </div>
  );
}

export default Dashboard;