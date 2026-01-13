/* =========================
   CONFIGURATION
========================= */

const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";
const SYNC_INTERVAL = 15000; // 15 seconds

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
const categoryFilter = document.getElementById("categoryFilter");
const newQuoteBtn = document.getElementById("newQuote");
const notification = document.getElementById("notification");

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
   CATEGORY POPULATION
========================= */

function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];

  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
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
   FILTER QUOTES
========================= */

function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  saveSelectedCategory(selectedCategory);

  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  displayQuotes(filteredQuotes);
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
    alert("Please enter both a quote and a category.");
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

  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);

      if (!Array.isArray(importedQuotes)) {
        alert("Invalid JSON format.");
        return;
      }

      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      filterQuotes();

      notifyUser("Quotes imported successfully.");
    } catch (error) {
      alert("Error reading JSON file.");
    }
  };

  fileReader.readAsText(event.target.files[0]);
}

/* =========================
   SERVER SYNCING (SIMULATION)
========================= */

async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();

    // Convert server posts to quote format
    const serverQuotes = serverData.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));

    syncWithServer(serverQuotes);
  } catch (error) {
    console.error("Failed to fetch from server", error);
  }
}

function syncWithServer(serverQuotes) {
  const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

  const isDifferent =
    JSON.stringify(localQuotes) !== JSON.stringify(serverQuotes);

  if (isDifferent) {
    quotes = serverQuotes;
    localStorage.setItem("quotes", JSON.stringify(serverQuotes));

    populateCategories();
    filterQuotes();

    notifyUser("Quotes were updated from the server.");
  }
}

/* =========================
   MANUAL CONFLICT RESOLUTION
========================= */

function manualSync() {
  fetchQuotesFromServer();
  notifyUser("Manual sync completed.");
}

/* =========================
   NOTIFICATION SYSTEM
========================= */

function notifyUser(message) {
  if (!notification) return;

  notification.textContent = message;
  notification.style.display = "block";

  setTimeout(() => {
    notification.style.display = "none";
  }, 4000);
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

// Start periodic server sync
setInterval(fetchQuotesFromServer, SYNC_INTERVAL);
