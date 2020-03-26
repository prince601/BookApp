//Book Constructor
function Book(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
}

//UI Constructor

function UI() {}

//LocalStorage Constructor
function Store() {}

Store.prototype.getBooks = function () {
    let books;
    if (localStorage.getItem('books') === null) {
        books = [];
    } else {
        books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
}

Store.prototype.addBook = function (book) {
    const ls = new Store();
    const books = ls.getBooks();
    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));
}

Store.displayBooks = function () {
    const ls = new Store();
    const books = ls.getBooks();

    books.forEach((book) => {
        const ui = new UI;
        ui.addBookToList(book);
    })
}

Store.prototype.removeBook = function (isbn) {
    this.isbn = isbn;
    const ls = new Store();
    const books = ls.getBooks();

    books.forEach((book, index) => {
        if (book.isbn === isbn) {
            books.splice(index, 1);
        }
    })
    localStorage.setItem('books', JSON.stringify(books));
}

//Add Book to List
UI.prototype.addBookToList = function (book) {
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

//show alert

UI.prototype.showAlert = function (msg, className) {
    //    create Div 
    const div = document.createElement('div');
    div.className = `alert ${className}`;

    //Add text
    div.appendChild(document.createTextNode(msg));
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

//delete Book

UI.prototype.deleteBook = function (target) {
    this.target = target;

    if (target.className == 'delete') {
        target.parentElement.parentElement.remove();
    }
}


//clear Fields
UI.prototype.clearFields = function () {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
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
    //Instatiatie Book in LS
    const ls = new Store();
    ls.addBook(book);
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
    const ls = new Store();

    ui.deleteBook(e.target);
    //remove from  LocalStorage
    ls.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //show alert
    ui.showAlert('Book removerd', 'success');

    e.preventDefault();
})