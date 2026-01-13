/* =========================
   LOAD QUOTES FROM STORAGE
========================= */

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


const categoryFilter = document.getElementById("categoryFilter");

/* =========================
   LOCAL STORAGE HELPERS
========================= */

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function saveSelectedCategory(category) {
  localStorage.setItem("selectedCategory", category);
}

/* =========================
   POPULATE CATEGORIES
========================= */

function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];

  // Reset dropdown
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

/* =========================
   FILTER QUOTES
========================= */

function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  saveSelectedCategory(selectedCategory);

  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes found for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  quoteDisplay.textContent = `"${filteredQuotes[randomIndex].text}"`;
}


/* =========================
   DISPLAY QUOTES
========================= */

function displayQuotes(quotesToDisplay) {
  quoteDisplay.innerHTML = "";

  if (quotesToDisplay.length === 0) {
    quoteDisplay.textContent = "No quotes found for this category.";
    return;
  }

  quotesToDisplay.forEach(q => {
    const p = document.createElement("p");
    p.textContent = `"${q.text}"`;
    quoteDisplay.appendChild(p);
  });
}

/* =========================
   ADD NEW QUOTE
========================= */

function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const quoteText = textInput.value.trim();
  const quoteCategory = categoryInput.value.trim();

  if (!quoteText || !quoteCategory) {
    alert("Please enter both quote text and category.");
    return;
  }

  quotes.push({ text: quoteText, category: quoteCategory });

  saveQuotes();
  populateCategories();
  filterQuotes();

  textInput.value = "";
  categoryInput.value = "";
}

/* =========================
   EVENT LISTENERS
========================= */

newQuoteBtn.addEventListener("click", filterQuotes);

/* =========================
   INITIAL LOAD
========================= */

populateCategories();

const savedCategory = localStorage.getItem("selectedCategory") || "all";
categoryFilter.value = savedCategory;

filterQuotes();
