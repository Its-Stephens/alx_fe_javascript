/* =========================
   INITIAL DATA & STORAGE
========================= */

// Load quotes from localStorage OR use default quotes
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "The best way to predict the future is to invent it.", category: "Motivation" },
  { text: "Simplicity is the soul of efficiency.", category: "Programming" },
  { text: "Stay hungry, stay foolish.", category: "Motivation" }
];

/* =========================
   DOM ELEMENTS
========================= */

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categorySelect = document.getElementById("categorySelect");

/* =========================
   LOCAL STORAGE FUNCTIONS
========================= */

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

/* =========================
   CATEGORY HANDLING
========================= */

function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];

  categorySelect.innerHTML = "";

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

/* =========================
   RANDOM QUOTE DISPLAY
========================= */

function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  const filteredQuotes = quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quoteText = filteredQuotes[randomIndex].text;

  quoteDisplay.textContent = `"${quoteText}"`;

  // Save last viewed quote to session storage
  sessionStorage.setItem("lastQuote", quoteText);
}

/* =========================
   ADD NEW QUOTE
========================= */

function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const quoteText = textInput.value.trim();
  const quoteCategory = categoryInput.value.trim();

  if (quoteText === "" || quoteCategory === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({
    text: quoteText,
    category: quoteCategory
  });

  saveQuotes();
  populateCategories();

  textInput.value = "";
  categoryInput.value = "";

  alert("Quote added successfully!");
}

/* =========================
   JSON EXPORT
========================= */

function exportToJson() {
  const jsonData = JSON.stringify(quotes, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();

  URL.revokeObjectURL(url);
}

/* =========================
   JSON IMPORT
========================= */

function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);

      if (!Array.isArray(importedQuotes)) {
        alert("Invalid JSON format.");
        return;
      }

      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();

      alert("Quotes imported successfully!");
    } catch (error) {
      alert("Error reading JSON file.");
    }
  };

  fileReader.readAsText(event.target.files[0]);
}

/* =========================
   EVENT LISTENERS
========================= */

newQuoteBtn.addEventListener("click", showRandomQuote);

/* =========================
   INITIAL LOAD
========================= */

populateCategories();

// Restore last viewed quote (session storage)
const lastQuote = sessionStorage.getItem("lastQuote");
if (lastQuote) {
  quoteDisplay.textContent = `"${lastQuote}"`;
}
