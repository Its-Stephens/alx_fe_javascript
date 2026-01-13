// ==========================
// Server URL (Mock API)
// ==========================
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// ==========================
// Default Quotes
// ==========================
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Code is poetry.", category: "Programming" },
  { text: "Simplicity is the soul of efficiency.", category: "Programming" },
  { text: "Life is what happens when you're busy making plans.", category: "Life" }
];

// ==========================
// DOM Elements
// ==========================
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const notification = document.getElementById("notification");

// ==========================
// Utility Functions
// ==========================
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function notifyUser(message) {
  notification.textContent = message;
  setTimeout(() => notification.textContent = "", 3000);
}

// ==========================
// Show Random Quote
// ==========================
function showRandomQuote(filteredQuotes = quotes) {
  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;

  // Save last viewed quote (Session Storage)
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// ==========================
// Populate Categories
// ==========================
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];

  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore last filter
  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) categoryFilter.value = savedFilter;
}

// ==========================
// Filter Quotes
// ==========================
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);

  const filtered =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  showRandomQuote(filtered);
}

// ==========================
// Add New Quote
// ==========================
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  filterQuotes();

  notifyUser("Quote added successfully!");

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// ==========================
// Export Quotes to JSON
// ==========================
function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

// ==========================
// Import Quotes from JSON
// ==========================
function importFromJsonFile(event) {
  const reader = new FileReader();

  reader.onload = function (e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    filterQuotes();
    notifyUser("Quotes imported successfully!");
  };

  reader.readAsText(event.target.files[0]);
}

// ==========================
// Fetch Quotes from Server (GET)
// ==========================
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();

    const serverQuotes = data.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));

    quotes = serverQuotes; // Server takes precedence
    saveQuotes();
    populateCategories();
    filterQuotes();

    notifyUser("Quotes synced from server.");
  } catch (error) {
    console.error("Server fetch failed", error);
  }
}

// ==========================
// Push Quotes to Server (POST)
// ==========================
async function pushQuotesToServer() {
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quotes)
    });

    const result = await response.json();
    console.log("Server response:", result);
    notifyUser("Quotes pushed to server successfully!");
  } catch (error) {
    console.error("POST failed", error);
  }
}

// ==========================
// Event Listeners
// ==========================
document.getElementById("newQuote").addEventListener("click", () => {
  filterQuotes();
});

// ==========================
// Initial Load
// ==========================
populateCategories();
filterQuotes();
fetchQuotesFromServer();
