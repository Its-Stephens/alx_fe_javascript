// Initial array of quote objects
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Success" },
    { text: "Be the change that you wish to see in the world.", category: "Inspirational" },
    { text: "Everything has beauty, but not everyone sees it.", category: "Wisdom" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" }
];

// DOM Elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const categoryFilter = document.getElementById('categoryFilter');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const addQuoteBtn = document.getElementById('addQuoteBtn');

/**
 * Updates the category filter dropdown based on unique categories in the quotes array
 */
function updateCategoryFilter() {
    const categories = ['all', ...new Set(quotes.map(q => q.category))];
    const currentVal = categoryFilter.value;
    
    categoryFilter.innerHTML = '';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        categoryFilter.appendChild(option);
    });
    
    categoryFilter.value = categories.includes(currentVal) ? currentVal : 'all';
}

/**
 * Displays a random quote based on the current category filter
 */
function showRandomQuote() {
    const selectedCategory = categoryFilter.value;
    const filteredQuotes = selectedCategory === 'all' 
        ? quotes 
        : quotes.filter(q => q.category === selectedCategory);

    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = '<p>No quotes available in this category.</p>';
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];

    // Clear display and inject new elements
    quoteDisplay.innerHTML = '';
    
    const textElem = document.createElement('p');
    textElem.className = 'quote-text';
    textElem.textContent = `"${quote.text}"`;
    
    const categoryElem = document.createElement('span');
    categoryElem.className = 'quote-category';
    categoryElem.textContent = quote.category;
    
    quoteDisplay.appendChild(textElem);
    quoteDisplay.appendChild(categoryElem);
}

/**
 * Adds a new quote to the collection and updates the UI
 */
function addQuote() {
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();

    if (!text || !category) {
        alert('Please enter both a quote and a category.');
        return;
    }

    // Add to array
    quotes.push({ text, category });

    // Clear inputs
    newQuoteText.value = '';
    newQuoteCategory.value = '';

    // Update UI components
    updateCategoryFilter();
    alert('Quote added successfully!');
}

// Event Listeners
newQuoteBtn.addEventListener('click', showRandomQuote);
addQuoteBtn.addEventListener('click', addQuote);
categoryFilter.addEventListener('change', showRandomQuote);

// Initial setup
updateCategoryFilter();
showRandomQuote();