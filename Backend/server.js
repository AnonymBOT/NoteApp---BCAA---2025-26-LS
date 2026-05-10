const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const NOTES_FILE = "./data/notes.json";
const CATEGORIES_FILE = "./data/categories.json";

const PRIORITIES = ["Nízká", "Střední", "Vysoká"];
const STATUSES = ["Aktivní", "Hotovo"];

async function readData(file) {
  try {
    const data = await fs.readFile(file, "utf8");
    return JSON.parse(data);
  } catch (error) {
    throw {
      code: "readError",
      message: "Chyba při čtení poznámek z úložiště",
    };
  }
}

async function writeData(file, data) {
  await fs.writeFile(file, JSON.stringify(data, null, 2));
}

function errorResponse(res, status, code, message, params = {}) {
  return res.status(status).json({
    type: "Error",
    code,
    message,
    params,
  });
}

function validateNoteDto(dtoIn) {
  if (!dtoIn || typeof dtoIn !== "object") {
    return {
      code: "dtoInIsNotValid",
      message: "dtoIn není validní",
    };
  }

  if (!dtoIn.title || dtoIn.title.length < 2 || dtoIn.title.length > 60) {
    return {
      code: "invalidTitle",
      message: "Název poznámky v rozmezí 2–60 znaků",
    };
  }

  if (dtoIn.description && dtoIn.description.length > 1000) {
    return {
      code: "invalidDescription",
      message: "Popis je příliš dlouhý (1000)",
    };
  }

  if (!dtoIn.date || isNaN(Date.parse(dtoIn.date))) {
    return {
      code: "invalidDate",
      message: "Datum vytvoření je neplatné",
    };
  }

  if (!PRIORITIES.includes(dtoIn.priority)) {
    return {
      code: "invalidPriority",
      message: "Neplatná priorita. Povolené: Nízká, Střední, Vysoká",
    };
  }

  if (!STATUSES.includes(dtoIn.status)) {
    return {
      code: "invalidStatus",
      message: "Neplatný stav. Povolené: Aktivní, Hotovo",
    };
  }

  if (!dtoIn.categoryId) {
    return {
      code: "categoryDoesNotExist",
      message: "Kategorie s daným ID neexistuje",
    };
  }

  return null;
}

function validateCategoryDto(dtoIn) {
  if (!dtoIn || typeof dtoIn !== "object") {
    return {
      code: "dtoInIsNotValid",
      message: "dtoIn není validní",
    };
  }

  if (!dtoIn.name || dtoIn.name.length < 2 || dtoIn.name.length > 40) {
    return {
      code: "invalidCategoryName",
      message: "Název kategorie musí mít 2–40 znaků",
    };
  }

  if (!dtoIn.color) {
    return {
      code: "invalidCategoryColor",
      message: "Barva kategorie je povinná",
    };
  }

  return null;
}

// ROOT
app.get("/", (req, res) => {
  res.send("Backend běží");
});

// NOTE LIST
app.get("/notes", async (req, res) => {
  try {
    const notes = await readData(NOTES_FILE);
    notes.sort((a, b) => new Date(a.date) - new Date(b.date));
    res.json(notes);
  } catch (error) {
    return errorResponse(res, 500, error.code, error.message);
  }
});

// NOTE CREATE
app.post("/notes", async (req, res) => {
  try {
    const dtoIn = req.body;

    const validationError = validateNoteDto(dtoIn);
    if (validationError) {
      return errorResponse(
        res,
        400,
        validationError.code,
        validationError.message
      );
    }

    const categories = await readData(CATEGORIES_FILE);
    const categoryExists = categories.some(
      (category) => category.id === dtoIn.categoryId
    );

    if (!categoryExists) {
      return errorResponse(
        res,
        400,
        "categoryDoesNotExist",
        "Kategorie s daným ID neexistuje"
      );
    }

    const notes = await readData(NOTES_FILE);

    const dtoOut = {
      id: uuidv4(),
      title: dtoIn.title,
      description: dtoIn.description,
      date: dtoIn.date,
      priority: dtoIn.priority,
      status: dtoIn.status,
      categoryId: dtoIn.categoryId,
    };

    notes.push(dtoOut);
    await writeData(NOTES_FILE, notes);

    res.status(201).json(dtoOut);
  } catch (error) {
    return errorResponse(res, 500, "readError", "Chyba při čtení poznámek z úložiště");
  }
});

// NOTE UPDATE
app.put("/notes/:id", async (req, res) => {
  try {
    const dtoIn = req.body;
    const noteId = req.params.id;

    const validationError = validateNoteDto(dtoIn);
    if (validationError) {
      return errorResponse(
        res,
        400,
        validationError.code,
        validationError.message
      );
    }

    const categories = await readData(CATEGORIES_FILE);
    const categoryExists = categories.some(
      (category) => category.id === dtoIn.categoryId
    );

    if (!categoryExists) {
      return errorResponse(
        res,
        400,
        "categoryDoesNotExist",
        "Kategorie s daným ID neexistuje"
      );
    }

    const notes = await readData(NOTES_FILE);
    const noteIndex = notes.findIndex((note) => note.id === noteId);

    if (noteIndex === -1) {
      return errorResponse(
        res,
        404,
        "noteNotFound",
        "Poznámka s daným ID neexistuje"
      );
    }

    const dtoOut = {
      id: noteId,
      title: dtoIn.title,
      description: dtoIn.description,
      date: dtoIn.date,
      priority: dtoIn.priority,
      status: dtoIn.status,
      categoryId: dtoIn.categoryId,
    };

    notes[noteIndex] = dtoOut;
    await writeData(NOTES_FILE, notes);

    res.json(dtoOut);
  } catch (error) {
    return errorResponse(res, 500, "readError", "Chyba při čtení poznámek z úložiště");
  }
});

// NOTE DELETE
app.delete("/notes/:id", async (req, res) => {
  try {
    const noteId = req.params.id;
    const notes = await readData(NOTES_FILE);

    const noteExists = notes.some((note) => note.id === noteId);

    if (!noteExists) {
      return errorResponse(
        res,
        404,
        "noteNotFound",
        "Poznámka s daným ID neexistuje"
      );
    }

    const filteredNotes = notes.filter((note) => note.id !== noteId);
    await writeData(NOTES_FILE, filteredNotes);

    res.status(204).send();
  } catch (error) {
    return errorResponse(res, 500, "readError", "Chyba při čtení poznámek z úložiště");
  }
});

// CATEGORY LIST
app.get("/categories", async (req, res) => {
  try {
    const categories = await readData(CATEGORIES_FILE);
    res.json(categories);
  } catch (error) {
    return errorResponse(res, 500, "readError", "Chyba při čtení kategorií z úložiště");
  }
});

// CATEGORY CREATE
app.post("/categories", async (req, res) => {
  try {
    const dtoIn = req.body;

    const validationError = validateCategoryDto(dtoIn);
    if (validationError) {
      return errorResponse(
        res,
        400,
        validationError.code,
        validationError.message
      );
    }

    const categories = await readData(CATEGORIES_FILE);

    const categoryExists = categories.some(
      (category) => category.name.toLowerCase() === dtoIn.name.toLowerCase()
    );

    if (categoryExists) {
      return errorResponse(
        res,
        400,
        "categoryAlreadyExists",
        "Kategorie s tímto názvem už existuje"
      );
    }

    const dtoOut = {
      id: uuidv4(),
      name: dtoIn.name,
      color: dtoIn.color,
    };

    categories.push(dtoOut);
    await writeData(CATEGORIES_FILE, categories);

    res.status(201).json(dtoOut);
  } catch (error) {
    return errorResponse(res, 500, "readError", "Chyba při čtení kategorií z úložiště");
  }
});

// CATEGORY UPDATE
app.put("/categories/:id", async (req, res) => {
  try {
    const dtoIn = req.body;
    const categoryId = req.params.id;

    const validationError = validateCategoryDto(dtoIn);
    if (validationError) {
      return errorResponse(
        res,
        400,
        validationError.code,
        validationError.message
      );
    }

    const categories = await readData(CATEGORIES_FILE);

    const categoryIndex = categories.findIndex(
      (category) => category.id === categoryId
    );

    if (categoryIndex === -1) {
      return errorResponse(
        res,
        404,
        "categoryNotFound",
        "Kategorie s daným ID neexistuje"
      );
    }

    const duplicateName = categories.some(
      (category) =>
        category.id !== categoryId &&
        category.name.toLowerCase() === dtoIn.name.toLowerCase()
    );

    if (duplicateName) {
      return errorResponse(
        res,
        400,
        "categoryAlreadyExists",
        "Kategorie s tímto názvem už existuje"
      );
    }

    const dtoOut = {
      id: categoryId,
      name: dtoIn.name,
      color: dtoIn.color,
    };

    categories[categoryIndex] = dtoOut;
    await writeData(CATEGORIES_FILE, categories);

    res.json(dtoOut);
  } catch (error) {
    return errorResponse(res, 500, "readError", "Chyba při čtení kategorií z úložiště");
  }
});

// CATEGORY DELETE
app.delete("/categories/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;

    const categories = await readData(CATEGORIES_FILE);
    const categoryExists = categories.some(
      (category) => category.id === categoryId
    );

    if (!categoryExists) {
      return errorResponse(
        res,
        404,
        "categoryNotFound",
        "Kategorie s daným ID neexistuje"
      );
    }

    const filteredCategories = categories.filter(
      (category) => category.id !== categoryId
    );

    const notes = await readData(NOTES_FILE);
    const filteredNotes = notes.filter(
      (note) => note.categoryId !== categoryId
    );

    await writeData(CATEGORIES_FILE, filteredCategories);
    await writeData(NOTES_FILE, filteredNotes);

    res.status(204).send();
  } catch (error) {
    return errorResponse(res, 500, "readError", "Chyba při čtení kategorií z úložiště");
  }
});

app.listen(PORT, () => {
  console.log(`Server běží na http://localhost:${PORT}`);
});