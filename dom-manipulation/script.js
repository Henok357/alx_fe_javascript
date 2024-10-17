// Array to hold quotes with text and category
let quotes = [
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Get busy living or get busy dying.", category: "Motivation" },
    { text: "The purpose of our lives is to be happy.", category: "Happiness" },
];

// Function to display a random quote on the page
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = quotes[randomIndex].text;
}

// Function to add a new quote from the input fields
function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value.trim();
    const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

    // Only add the quote if both fields are filled
    if (quoteText && quoteCategory) {
        // Add new quote object to the array
        quotes.push({ text: quoteText, category: quoteCategory });

        // Clear the input fields
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';

        // Update the DOM to reflect the new addition (optional)
        showRandomQuote();
    }
}

// Function to create the form for adding new quotes
function createAddQuoteForm() {
    const formContainer = document.createElement('div');
    formContainer.innerHTML = `
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button onclick="addQuote()">Add Quote</button>
    `;
    document.body.appendChild(formContainer);
}

// Event listener for the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Call the function to create the add quote form when the page loads
document.addEventListener('DOMContentLoaded', () => {
    createAddQuoteForm();
});
