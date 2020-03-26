class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    addBookToList(book) {
        this.book = book;

        const list = document.querySelector('#book-list');
        //Create Element
        const row = document.createElement('tr');
        // insert Columns
        row.innerHTML = `
             <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td> <a href="#" class="delete">X</a> </td> `
        list.appendChild(row);
    }

    showAlert(message, className) {
        this.message = message;
        this.className = className;
        //    create Div 
        const div = document.createElement('div');
        div.className = `alert ${className}`;

        //Add text
        div.appendChild(document.createTextNode(message));
        // get parent 
        const container = document.querySelector('.container');
        //get form
        const form = document.querySelector('#book-form');
        //insert
        container.insertBefore(div, form);
        //timeout after 3sec
        setTimeout(function () {
            document.querySelector('.alert').remove();
        }, 3000);
    }

    deleteBook(target) {
        this.target = target;

        if (target.className == 'delete') {
            target.parentElement.parentElement.remove();
        }
    }

    clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

//Local storage

class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static displayBooks() {
        const books = Store.getBooks();

        books.forEach((book) => {
            const ui = new UI;
            ui.addBookToList(book);
        })
    }

    static removeBook(isbn) {
        this.isbn = isbn;
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        })
        localStorage.setItem('books', JSON.stringify(books));
    }
}

//Create Eventlisteners

//DOM Content loaded 
document.addEventListener('DOMContentLoaded', Store.displayBooks());

//Event listener for Add book
document.querySelector('#book-form').addEventListener('submit', function (e) {
    //Get values
    const title = document.querySelector('#title').value,
        author = document.querySelector('#author').value,
        isbn = document.querySelector('#isbn').value;

    //Instatiate a Book
    const book = new Book(title, author, isbn);

    //add to LocalStorage
    Store.addBook(book);

    //Instatiate UI
    const ui = new UI();
    //Validate
    if (title === '' || author === '' || isbn === '') {
        ui.showAlert('Please Fill in the fields', 'error')
    } else {
        //Add Book to  list
        ui.addBookToList(book);
        ui.showAlert('Book added', 'success')

        //clear fields
        ui.clearFields();
    }

    console.log(ui);
    e.preventDefault();
})

// Eventlistener for DeleteBook 
document.querySelector('#book-list').addEventListener('click', function (e) {
    //Instatiate UI
    const ui = new UI();
    //delete book from UI
    ui.deleteBook(e.target);
    //remove from  LocalStorage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    //show alert
    ui.showAlert('Book removerd', 'success');
    e.preventDefault();
})