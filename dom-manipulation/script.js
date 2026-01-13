/************************************************************
 * CONFIGURATION
 ************************************************************/
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";
const SYNC_INTERVAL = 15000; // 15 seconds

/************************************************************
 * DATA STORAGE
 ************************************************************/
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "Life is really simple, but we insist on making it complicated.", category: "Life" }
];

// Backup for conflict resolution
let localBackup = [];

/************************************************************
 * DOM ELEMENTS
 ************************************************************/
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const notification = document.getElementById("notification");

/************************************************************
 * UTILITIES
 ************************************************************/
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function notifyUser(message) {
  notification.textContent = message;
  setTimeout(() => (notification.textContent = ""), 4000);
}

/************************************************************
 * DISPLAY RANDOM QUOTE
 ************************************************************/
function showRandomQuote(filteredQuotes = quotes) {
  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }

  const index = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[index];

  quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;

  // Save last viewed quote (session storage)
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

/************************************************************
 * CATEGORY HANDLING
 ************************************************************/
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];

  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) categoryFilter.value = savedFilter;
}

function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("selectedCategory", selected);

  const filtered =
    selected === "all"
      ? quotes
      : quotes.filter(q => q.category === selected);

  showRandomQuote(filtered);
}

/************************************************************
 * ADD NEW QUOTE
 ************************************************************/
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote text and category.");
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

/************************************************************
 * EXPORT QUOTES (JSON)
 ************************************************************/
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

/************************************************************
 * IMPORT QUOTES (JSON)
 ************************************************************/
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

/************************************************************
 * SERVER SYNC – FETCH (GET)
 ************************************************************/
async function fetchFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();

    const serverQuotes = data.slice(0, 5).map(item => ({
      text: item.title,
      category: "Server"
    }));

    syncWithServer(serverQuotes);
  } catch (error) {
    console.error("Server fetch failed", error);
  }
}

/************************************************************
 * SYNC & CONFLICT RESOLUTION
 * Server always wins
 ************************************************************/
function syncWithServer(serverQuotes) {
  const localData = JSON.stringify(quotes);
  const serverData = JSON.stringify(serverQuotes);

  if (localData !== serverData) {
    localBackup = [...quotes]; // Save local copy
    quotes = serverQuotes;     // Server takes precedence
    saveQuotes();
    populateCategories();
    filterQuotes();

    notifyUser("Conflict detected. Server data applied.");
  }
}

/************************************************************
 * MANUAL CONFLICT RESOLUTION
 ************************************************************/
function manualResolve() {
  if (localBackup.length === 0) {
    notifyUser("No local backup available.");
    return;
  }

  quotes = [...localBackup];
  saveQuotes();
  populateCategories();
  filterQuotes();

  notifyUser("Local version restored manually.");
}

/************************************************************
 * PUSH DATA TO SERVER (POST)
 ************************************************************/
async function pushQuotesToServer() {
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quotes)
    });

    await response.json();
    notifyUser("Quotes pushed to server (simulated).");
  } catch (error) {
    console.error("POST failed", error);
  }
}

/************************************************************
 * PERIODIC SERVER POLLING
 ************************************************************/
setInterval(fetchFromServer, SYNC_INTERVAL);

/************************************************************
 * EVENT LISTENERS
 ************************************************************/
document.getElementById("newQuote").addEventListener("click", filterQuotes);

/************************************************************
 * INITIAL LOAD
 ************************************************************/
populateCategories();
filterQuotes();
fetchFromServer();
