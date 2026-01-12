class QuoteApp {
    constructor() {
        this.quotes = [
            { text: "The only way to do great work is to love what you do.", category: "Success" },
            { text: "Be the change that you wish to see in the world.", category: "Inspirational" },
            { text: "Everything has beauty, but not everyone sees it.", category: "Wisdom" },
            { text: "Life is what happens when you're busy making other plans.", category: "Life" },
            { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" }
        ];

        // Cache DOM elements
        this.display = document.getElementById('quoteDisplay');
        this.filter = document.getElementById('categoryFilter');
        this.newQuoteBtn = document.getElementById('newQuote');
        this.formContainer = document.querySelector('.add-quote-section');

        this.init();
    }

    /**
     * Initializes the application
     */
    init() {
        this.updateFilterDropdown();
        this.createAddQuoteForm();
        this.showRandomQuote();
        this.addEventListeners();
    }

    /**
     * Set up global event listeners
     */
    addEventListeners() {
        this.newQuoteBtn.addEventListener('click', () => this.showRandomQuote());
        this.filter.addEventListener('change', () => this.showRandomQuote());
    }

    /**
     * Updates the category filter dropdown based on unique categories in the quotes array
     */
    updateFilterDropdown() {
        const categories = ['all', ...new Set(this.quotes.map(q => q.category))];
        const currentVal = this.filter.value;
        
        this.filter.innerHTML = categories.map(cat => 
            `<option value="${cat}">${cat.charAt(0).toUpperCase() + cat.slice(1)}</option>`
        ).join('');
        
        this.filter.value = categories.includes(currentVal) ? currentVal : 'all';
    }

    /**
     * Requirement: showRandomQuote
     * Picks a quote from filtered results and renders it.
     */
    showRandomQuote() {
        const selectedCategory = this.filter.value;
        const filtered = selectedCategory === 'all' 
            ? this.quotes 
            : this.quotes.filter(q => q.category === selectedCategory);

        if (filtered.length === 0) {
            this.display.innerHTML = '<p>No quotes available in this category.</p>';
            return;
        }

        const quote = filtered[Math.floor(Math.random() * filtered.length)];

        // Clean DOM manipulation
        this.display.innerHTML = '';
        
        const textElem = document.createElement('p');
        textElem.className = 'quote-text';
        textElem.textContent = `"${quote.text}"`;
        
        const catElem = document.createElement('span');
        catElem.className = 'quote-category';
        catElem.textContent = quote.category;
        
        this.display.append(textElem, catElem);
    }

    /**
     * Requirement: createAddQuoteForm
     * Dynamically constructs the quote addition form.
     */
    createAddQuoteForm() {
        // Construct form elements
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';

        const textInput = this.createInput('newQuoteText', 'Enter a new quote');
        const catInput = this.createInput('newQuoteCategory', 'Enter quote category');
        
        const addBtn = document.createElement('button');
        addBtn.textContent = 'Add Quote';
        addBtn.onclick = () => this.addQuote();

        formGroup.append(textInput, catInput, addBtn);
        this.formContainer.appendChild(formGroup);
    }

    /**
     * Helper to create styled inputs
     */
    createInput(id, placeholder) {
        const input = document.createElement('input');
        input.id = id;
        input.type = 'text';
        input.placeholder = placeholder;
        return input;
    }

    /**
     * Handles quote creation logic
     */
    addQuote() {
        const textInput = document.getElementById('newQuoteText');
        const catInput = document.getElementById('newQuoteCategory');
        
        const text = textInput.value.trim();
        const category = catInput.value.trim();

        if (!text || !category) {
            alert('Please fill out all fields.');
            return;
        }

        this.quotes.push({ text, category });

        // Reset UI state
        textInput.value = '';
        catInput.value = '';
        this.updateFilterDropdown();
        
        // Visual confirmation
        if (this.filter.value === 'all' || this.filter.value === category) {
            this.showRandomQuote();
        }
        
        alert('Quote added!');
    }
}

// Start the app when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new QuoteApp();
});
