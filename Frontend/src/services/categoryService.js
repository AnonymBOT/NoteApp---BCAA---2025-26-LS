const API_URL = "http://localhost:3001/categories";

export async function getCategories() {
  const response = await fetch(API_URL);
  return response.json();
}

export async function createCategory(category) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });

  return response.json();
}

export async function updateCategory(id, category) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });

  return response.json();
}

export async function deleteCategory(id) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
}