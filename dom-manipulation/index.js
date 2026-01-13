class QuoteApp {
    constructor() {
       
        this.quotes = [
            { text: "The only way to do great work is to love what you do.", category: "Success" },
            { text: "Be the change that you wish to see in the world.", category: "Inspirational" },
            { text: "Everything has beauty, but not everyone sees it.", category: "Wisdom" },
            { text: "Life is what happens when you're busy making other plans.", category: "Life" },
            { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" }
        ];

        // Ensure the quotes array exists and is valid before proceeding
        this.validateQuotesArray();

        // Cache DOM elements
        this.display = document.getElementById('quoteDisplay');
        this.filter = document.getElementById('categoryFilter');
        this.newQuoteBtn = document.getElementById('newQuote');
        this.formContainer = document.querySelector('.add-quote-section');

        this.init();
    }


    validateQuotesArray() {
        if (!Array.isArray(this.quotes)) {
            console.error("Critical error: quotes array is missing or invalid.");
            this.quotes = [];
            return;
        }

        const isValid = this.quotes.every(quote => 
            typeof quote === 'object' && 
            quote !== null && 
            'text' in quote && 
            'category' in quote
        );

        if (!isValid) {
            console.warn("Some quote objects are missing required properties (text or category).");
        }
    }

    init() {
        if (!this.display || !this.filter) return;
        this.updateFilterDropdown();
        this.createAddQuoteForm();
        this.showRandomQuote();
        this.addEventListeners();
    }

   
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
     * Picks a quote from filtered results and renders it via DOM manipulation.
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
     * Dynamically constructs the quote addition form using DOM methods.
     */
    createAddQuoteForm() {
        if (!this.formContainer) return;
        
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';

        const textInput = this.createInput('newQuoteText', 'Enter a new quote');
        const catInput = this.createInput('newQuoteCategory', 'Enter quote category');
        
        const addBtn = document.createElement('button');
        addBtn.textContent = 'Add Quote';
        // Requirement: onclick functionality for adding quotes
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
     * Handles adding a new quote to the data array and updating the UI
     */
    addQuote() {
        const textInput = document.getElementById('newQuoteText');
        const catInput = document.getElementById('newQuoteCategory');
        
        if (!textInput || !catInput) return;

        const text = textInput.value.trim();
        const category = catInput.value.trim();

        if (!text || !category) {
            alert('Please fill out both the quote and category fields.');
            return;
        }

        // Add new object to array
        this.quotes.push({ text, category });

        // Reset inputs
        textInput.value = '';
        catInput.value = '';
        
        // Update components
        this.updateFilterDropdown();
        
        // Show immediately if relevant
        if (this.filter.value === 'all' || this.filter.value === category) {
            this.showRandomQuote();
        }
        
        console.log("Quotes updated:", this.quotes);
    }
}

// Instantiate app when DOM is fully parsed
document.addEventListener('DOMContentLoaded', () => {
    window.app = new QuoteApp();
});
