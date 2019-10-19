// Book Class: Represents a Book
class Book {
    constructor(title, artist, ratings) {
        this.title = title;
        this.artist = artist;
        this.ratings = ratings;
    }
}

// UI Class: Handles UI Tasks
class UI {
    static displayBooks () {
       // const StoredBooks = [{}];
       // const books = StoredBooks;
        const books = Store.getBooks();
        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.artist}</td>
            <td>${book.ratings}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>                    
        `;
        list.appendChild(row);
    }

    static deleteBook(el) {
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        // Vanish in 3 Seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#artist').value = '';
        document.querySelector('#ratings').value = '';
    }
}

// Store Class: Handles Storage
class Store{
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        }   else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(ratings) {
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if(book.ratings === ratings) {
                books.splice(index, 1);
            }
        });      
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    //Prevent Actual Submit
    e.preventDefault();

    //Get Form Values
    const title = document.querySelector('#title').value;
    const artist = document.querySelector('#artist').value;
    const ratings = document.querySelector('#ratings').value;

    //Validate
    if(title === '' || artist === '' || ratings === '') {
      UI.showAlert('please fill in all fields', 'secondary');  
    } else {
        //Instatiate Book
        const book = new Book(title, artist, ratings);

        //Add Book to UI
        UI.addBookToList(book);

        //Add Book to Store
        Store.addBook(book);

        //Show Success Message
        UI.showAlert('Book Added', 'success');

        //Clear Fields
        UI.clearFields();

        //console.log(book)
    }
});

// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
    //Remove Book from UI
    UI.deleteBook(e.target)

    //Remove Book from Store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //Show Success Message
    UI.showAlert('Book Removed', 'success');

    //console.log(e.target)
});