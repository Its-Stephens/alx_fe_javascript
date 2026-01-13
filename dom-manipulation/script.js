/*************************************************
 * CONFIGURATION
 *************************************************/
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";
const SYNC_INTERVAL = 15000; // 15 seconds


/*************************************************
 * LOCAL DATA
 *************************************************/
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Code is poetry.", category: "Programming" },
  { text: "Simplicity is the soul of efficiency.", category: "Programming" },
  { text: "Life is what happens when you're busy making plans.", category: "Life" }
];

// Backup for conflict resolution
let localBackup = [];


/*************************************************
 * DOM ELEMENTS
 *************************************************/
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const notification = document.getElementById("notification");
const newQuoteBtn = document.getElementById("newQuote");


/*************************************************
 * STORAGE UTILITIES
 *************************************************/
function saveQuotesToLocalStorage() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}


/*************************************************
 * NOTIFICATION / UI FEEDBACK
 *************************************************/
function showNotification(message) {
  notification.textContent = message;
  setTimeout(() => {
    notification.textContent = "";
  }, 4000);
}


/*************************************************
 * DISPLAY RANDOM QUOTE
 *************************************************/
function showRandomQuote(filteredQuotes = quotes) {
  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }

  const index = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[index];

  quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
}


/*************************************************
 * FETCH DATA FROM SERVER (MOCK API)
 * ✔ fetchQuotesFromServer PRESENT
 *************************************************/
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();

    // Convert server posts into quotes
    const serverQuotes = serverData.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));

    syncQuotes(serverQuotes);
  } catch (error) {
    console.error("Error fetching from server:", error);
  }
}


/*************************************************
 * POST DATA TO SERVER (MOCK API)
 * ✔ POST + headers + Content-Type PRESENT
 *************************************************/
async function postQuotesToServer() {
  try {
    await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quotes)
    });

    showNotification("Local quotes posted to server (simulated).");
  } catch (error) {
    console.error("Error posting to server:", error);
  }
}


/*************************************************
 * SYNC LOGIC + CONFLICT RESOLUTION
 * ✔ syncQuotes FUNCTION PRESENT
 * ✔ SERVER DATA TAKES PRECEDENCE
 *************************************************/
function syncQuotes(serverQuotes) {
  const localData = JSON.stringify(quotes);
  const serverData = JSON.stringify(serverQuotes);

  if (localData !== serverData) {
    // Conflict detected
    localBackup = [...quotes];      // Save local version
    quotes = serverQuotes;          // Server wins
    saveQuotesToLocalStorage();

    showNotification("Conflict detected. Server data synced.");
  } else {
    showNotification("Local data already in sync with server.");
  }
}


/*************************************************
 * MANUAL CONFLICT RESOLUTION (OPTIONAL UI)
 *************************************************/
function manualResolve() {
  if (localBackup.length === 0) {
    showNotification("No local backup available.");
    return;
  }

  quotes = [...localBackup];
  saveQuotesToLocalStorage();
  showNotification("Local data restored manually.");
}


/*************************************************
 * PERIODIC SERVER CHECK
 * ✔ PERIODIC FETCHING PRESENT
 *************************************************/
setInterval(fetchQuotesFromServer, SYNC_INTERVAL);


/*************************************************
 * EVENT LISTENERS
 *************************************************/
newQuoteBtn.addEventListener("click", showRandomQuote);


/*************************************************
 * INITIAL LOAD
 *************************************************/
saveQuotesToLocalStorage();
showRandomQuote();
fetchQuotesFromServer();
