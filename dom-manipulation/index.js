let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Success" },
    { text: "Be the change that you wish to see in the world.", category: "Inspirational" },
    { text: "Everything has beauty, but not everyone sees it.", category: "Wisdom" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" }
];

/**
 * Check for the existence of the quotes array and its structure
 */
function validateQuotes() {
    if (!Array.isArray(quotes)) {
        console.error("Quotes array is missing!");
        return false;
    }
    return quotes.every(q => q.text && q.category);
}

/**
 * Requirement: showRandomQuote
 * Displays a random quote based on the selected category.
 */
function showRandomQuote() {
    const filter = document.getElementById('categoryFilter');
    const display = document.getElementById('quoteDisplay');
    const selectedCategory = filter.value;

    const filtered = selectedCategory === 'all' 
        ? quotes 
        : quotes.filter(q => q.category === selectedCategory);

    if (filtered.length === 0) {
        display.innerHTML = '<p>No quotes found for this category.</p>';
        return;
    }

    const quote = filtered[Math.floor(Math.random() * filtered.length)];

    // DOM Manipulation to display quote
    display.innerHTML = '';
    const textElem = document.createElement('p');
    textElem.className = 'quote-text';
    textElem.textContent = `"${quote.text}"`;
    
    const catElem = document.createElement('span');
    catElem.className = 'quote-category';
    catElem.textContent = quote.category;
    
    display.append(textElem, catElem);
}

/**
 * Requirement: createAddQuoteForm
 * Dynamically creates and injects the add quote form into the UI.
 */
function createAddQuoteForm() {
    const container = document.getElementById('formContainer');
    
    const wrapper = document.createElement('div');
    wrapper.className = 'form-group';

    const inputQuote = document.createElement('input');
    inputQuote.id = 'newQuoteText';
    inputQuote.type = 'text';
    inputQuote.placeholder = 'Enter a new quote';

    const inputCategory = document.createElement('input');
    inputCategory.id = 'newQuoteCategory';
    inputCategory.type = 'text';
    inputCategory.placeholder = 'Enter quote category';

    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add Quote';
    // Requirement: Use addQuote function on click
    addBtn.onclick = addQuote;

    wrapper.append(inputQuote, inputCategory, addBtn);
    container.appendChild(wrapper);
}

/**
 * Requirement: addQuote
 * Handles adding a new quote to the array and updating the DOM.
 */
function addQuote() {
    const textInput = document.getElementById('newQuoteText');
    const categoryInput = document.getElementById('newQuoteCategory');
    
    const text = textInput.value.trim();
    const category = categoryInput.value.trim();

    if (!text || !category) {
        alert("Please fill in both fields.");
        return;
    }

    // Update quotes array
    quotes.push({ text, category });

    // Clear inputs
    textInput.value = '';
    categoryInput.value = '';

    // Update the dropdown categories
    populateCategories();
    
    alert("New quote added successfully!");
}

/**
 * Updates the category filter dropdown
 */
function populateCategories() {
    const filter = document.getElementById('categoryFilter');
    const currentSelection = filter.value;
    const categories = ['all', ...new Set(quotes.map(q => q.category))];
    
    filter.innerHTML = categories.map(cat => 
        `<option value="${cat}">${cat.charAt(0).toUpperCase() + cat.slice(1)}</option>`
    ).join('');
    
    filter.value = categories.includes(currentSelection) ? currentSelection : 'all';
}

// Initial Initialization
document.addEventListener('DOMContentLoaded', () => {
    if (validateQuotes()) {
        populateCategories();
        createAddQuoteForm();
        showRandomQuote();

        // Attach event listeners
        document.getElementById('newQuote').addEventListener('click', showRandomQuote);
        document.getElementById('categoryFilter').addEventListener('change', showRandomQuote);
    }
});