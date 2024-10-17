
let quotes = [
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Get busy living or get busy dying.", category: "Motivation" },
    { text: "The purpose of our lives is to be happy.", category: "Happiness" },
];


function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerText = quotes[randomIndex].text;
}


function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value.trim();
    const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

   
    if (quoteText && quoteCategory) {
       
        quotes.push({ text: quoteText, category: quoteCategory });

      
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';

        
        displayRandomQuote();
    }
}


document.getElementById('newQuote').addEventListener('click', displayRandomQuote);
