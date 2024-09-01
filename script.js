// DOCUMENT REFERENCES

const empty = document.getElementById("empty"); // element that displays when user has no books in library
const emptyNewBookButton = document.getElementById("emptyNewBookButton"); // new book button that displays with empty

const sidebarButtons = {
    sidebarLibraryButton: document.getElementById("sidebarLibraryButton"),
    sidebarReadButton: document.getElementById("sidebarReadButton"),
    sidebarUnreadButton: document.getElementById("sidebarUnreadButton"),
    sidebarFavoritesButton: document.getElementById("sidebarFavoritesButton")
};

const searchBar = document.getElementById('searchBar');

// BOOKS

const bookTemplate = document.getElementById('bookTemplate');
const bookHolder = document.getElementById('bookHolder');

const newBookButton = document.getElementById('newBookButton');
const newBookDialog = document.getElementById('newBookDialog');
const newBookDialogCancelButton = document.getElementById('newBookDialogCancelButton');
const newBookDialogForm = document.getElementById('newBookDialogForm');
const newBookDialogFormSubmitButton = document.getElementById('newBookDialogFormSubmitButton');

// COLLECTIONS

const collectionTemplate = document.getElementById('collectionTemplate');
const collectionHolder = document.getElementById('collectionHolder');

const newCollectionButton = document.getElementById('newCollectionButton');
const newCollectionDialog = document.getElementById('newCollectionDialog');
const newCollectionDialogCancelButton = document.getElementById('newCollectionDialogCancelButton');
const newCollectionDialogForm = document.getElementById('newCollectionDialogForm');
const newCollectionDialogFormSubmitButton = document.getElementById('newCollectionDialogFormSubmitButton');

// VARIABLES

let searchBarText = "";
let currentTabIndex = 0;
const myLibrary = [];
const myCollections = [];

function Book(title, author, pages) {

    this.title = title;
    this.author = author;
    this.pages = pages;

    this.read = false;
    this.favorite = false;

    this.toggleRead = function() {

        this.read = !this.read;

        //update sidebar to properly display # of favorite books
        sidebarButtons.sidebarReadButton.getElementsByTagName("div")[0].childNodes[2].nodeValue = `Read (${getAllReadAndUnreadBooks()[0].length})`;
        sidebarButtons.sidebarUnreadButton.getElementsByTagName("div")[0].childNodes[2].nodeValue = `Unread (${getAllReadAndUnreadBooks()[1].length})`;

    };

    this.toggleFavorite = function() {
        
        this.favorite = !this.favorite;

        //update sidebar to properly display # of favorite books
        sidebarButtons.sidebarFavoritesButton.getElementsByTagName("div")[0].childNodes[2].nodeValue = `Favorites (${getAllFavoriteBooks().length})`;

    }

}

function Collection(name) {

    this.name = name;

}

// FUNCTIONS

function getAllValuesInForm(form) {
    //get all elements tagged <input> in form
    const inputs = form.querySelectorAll('input');
    let values = [];

    //get the values of each input
    inputs.forEach(input => {
        values.push(input.value)
    });

    return values;
}
function getAllReadAndUnreadBooks() {
    //loops through every book and returns a list of the read books and a list of the unread books
    let readBooks = [];
    let unreadBooks = [];

    myLibrary.forEach(book => {
        if(book.read == true) {
            readBooks.push(book);
        } else {
            unreadBooks.push(book);
        }
    });  

    return [readBooks, unreadBooks];
}
function getAllFavoriteBooks() {
    //loops through every book and returns a list of every favorited book
    let favoriteBooks = [];

    myLibrary.forEach(book => {
        if(book.favorite == true) {
            favoriteBooks.push(book);
        } 
    });

    return favoriteBooks;
}
function getBookFromElement(element) {
    //returns book object given an element
    let book = null;

    myLibrary.forEach(_book => {
        if(_book.element == element) {
            book = _book;
        }
    });

    return book;
}

function addBook(title, author, pages) {

    //create new book object
    let newBook = new Book(title, author, pages);

    //add book to library
    addBookElement(newBook);
    myLibrary.push(newBook);

    //update sidebar to properly display # of books and unread books
    sidebarButtons.sidebarLibraryButton.getElementsByTagName("div")[0].childNodes[2].nodeValue = `Library (${myLibrary.length})`;
    sidebarButtons.sidebarUnreadButton.getElementsByTagName("div")[0].childNodes[2].nodeValue = `Unread (${getAllReadAndUnreadBooks()[1].length})`;

    //update empty library display
    if(myLibrary.length == 1) {
        empty.classList.toggle("hidden", true);
    }

}
function addBookElement(book) {

    //get book element nodes
    const bookElement = bookTemplate.cloneNode(true);
    bookElement.id = 'book';
    const bookInfo = bookElement.getElementsByTagName("div")[0];
    
    //update nodes
    bookInfo.getElementsByTagName("div")[0].getElementsByTagName("h3")[0].textContent = book.title;
    bookInfo.getElementsByTagName("div")[0].getElementsByTagName("h4")[0].textContent = book.author;
    bookInfo.getElementsByTagName("h2")[0].textContent = (book.pages == "" ? "" : `${book.pages} pages`);

    //add to html holder
    bookHolder.insertBefore(bookElement, bookHolder.firstChild);

    bookElement.classList.remove('hidden');
    setTimeout(() => {bookElement.style.opacity = "1"}, 100);

    //store respective element in book object
    book.element = bookElement;

}

function removeBook(element) {

    //get book object from element
    let book = getBookFromElement(element);

    if(book) {

        //remove book from library
        removeBookElement(element);
        myLibrary.splice(myLibrary.indexOf(book), 1);

        //update sidebar to properly display # of books, read books, unread books, and favorited books
        sidebarButtons.sidebarLibraryButton.getElementsByTagName("div")[0].childNodes[2].nodeValue = `Library (${myLibrary.length})`;
        sidebarButtons.sidebarReadButton.getElementsByTagName("div")[0].childNodes[2].nodeValue = `Read (${getAllReadAndUnreadBooks()[0].length})`;
        sidebarButtons.sidebarUnreadButton.getElementsByTagName("div")[0].childNodes[2].nodeValue = `Unread (${getAllReadAndUnreadBooks()[1].length})`;
        sidebarButtons.sidebarFavoritesButton.getElementsByTagName("div")[0].childNodes[2].nodeValue = `Favorites (${getAllFavoriteBooks().length})`;

        //update empty library display
        if(myLibrary.length == 0) {
            empty.classList.toggle("hidden", false);
        }

    }

}
function removeBookElement(element) {

    element.style.opacity = "0";
    setTimeout(() => {element.remove()}, 500);

}

function toggleBookRead(element) {

    let book = getBookFromElement(element);

    book.toggleRead();

    element.getElementsByTagName("div")[2].getElementsByTagName("span")[0].classList.toggle("icon-button-toggled", book.read);
    element.getElementsByTagName("div")[2].getElementsByTagName("span")[1].textContent = (book.read ? "Mark as Unread" : "Mark as Read");

    updateFilter();
}
function toggleBookFavorite(element) {
    
    let book = getBookFromElement(element);

    book.toggleFavorite();

    element.getElementsByTagName("div")[2].getElementsByTagName("span")[2].classList.toggle("icon-button-toggled", book.favorite);
    element.getElementsByTagName("div")[2].getElementsByTagName("span")[3].textContent = (book.favorite ? "Remove from Favorites" : "Add to Favorites");

    updateFilter();
}


function addCollection(name) {

    //create new collection object
    let newCollection = new Collection(name);

    //add collection to collections
    addCollectionElement(newCollection);
    myCollections.push(newCollection);

}
function addCollectionElement(collection) {

    //get name node
    const collectionElement = collectionTemplate.cloneNode(true);
    collectionElement.id = 'collection';
    
    //update node
    collectionElement.getElementsByTagName("div")[0].textContent = collection.name;

    //add to html holder
    collectionHolder.insertBefore(collectionElement, collectionHolder.firstChild);

    collectionElement.classList.remove('hidden');

    //store respective element in collection object
    collection.element = collectionElement;

}

function changeTab(index) {

    if(currentTabIndex != index) {
        Object.values(sidebarButtons)[currentTabIndex].classList.toggle("sidebar-item-selected", false);
        Object.values(sidebarButtons)[index].classList.toggle("sidebar-item-selected", true);

        currentTabIndex = index;
        updateFilter();        
    }

}

function updateFilter() {
    // 0-3 are the base
    // 4-? are collections

    const [readBooks, unreadBooks] = getAllReadAndUnreadBooks();
    const favoriteBooks = getAllFavoriteBooks();

    myLibrary.forEach(book => {
        
        const bookElement = book.element;
        let isHidden = false;

        // TAB FILTER

        switch (currentTabIndex) {
            case 0:
                isHidden = false;
                break;
            case 1:
                isHidden = unreadBooks.includes(book);
                break;
            case 2:
                isHidden = readBooks.includes(book);
                break;
            case 3:
                isHidden = !favoriteBooks.includes(book);
                break;
            default:
                isHidden = false;
        }

        // If the book is hidden by the tab filter, no need to check the search filter
        if (isHidden) {
            bookElement.classList.add("hidden");
            return;
        }

        // SEARCH BAR FILTER

        const meetsSearchQuery = book.title.toUpperCase().includes(searchBarText.toUpperCase()) || 
                                 book.author.toUpperCase().includes(searchBarText.toUpperCase());

        const bookInfo = bookElement.getElementsByTagName("div")[0];

        if (meetsSearchQuery) {
            highlightMatch(book.title, searchBarText, bookInfo.getElementsByTagName("h3")[0]);
            highlightMatch(book.author, searchBarText, bookInfo.getElementsByTagName("h4")[0]);
            bookElement.classList.remove("hidden");
        } else {
            resetText(book.title, bookInfo.getElementsByTagName("h3")[0]);
            resetText(book.author, bookInfo.getElementsByTagName("h4")[0]);
            bookElement.classList.add("hidden");
        }
    });
}

function highlightMatch(text, query, element) {
    const matchIndex = text.toUpperCase().indexOf(query.toUpperCase());
    if (matchIndex !== -1) {
        const highlightedText = text.substring(0, matchIndex) +
                                '<mark>' + text.substring(matchIndex, matchIndex + query.length) + '</mark>' +
                                text.substring(matchIndex + query.length);
        element.innerHTML = highlightedText;
    } else {
        element.innerHTML = text; // Reset if no match
    }
}

function resetText(originalText, element) {
    element.innerHTML = originalText;
}


function bookSearchBar() {

    searchBarText = searchBar.value;
    updateFilter();

}

// EVENT FUNCTIONS

function newBook() {
    setTimeout(() => {
        newBookDialog.style.opacity = "1";
        newBookDialog.style.transform = "translateY(0px)";
    
    }, 0);

    newBookDialog.showModal();
}
newBookButton.addEventListener('click', newBook);
emptyNewBookButton.addEventListener('click', newBook);

newBookDialogCancelButton.addEventListener('click', () => {

    newBookDialog.style.opacity = "0";
    newBookDialog.style.transform = "translateY(10px)";

    newBookDialogForm.reset();
    newBookDialogForm.getElementsByClassName("dialog-error")[0].classList.toggle("hidden", true);
    newBookDialog.close();

});

newCollectionButton.addEventListener('click', () => {

    setTimeout(() => {
        newCollectionDialog.style.opacity = "1";
        newCollectionDialog.style.transform = "translateY(0px)";
    
    }, 0);

    newCollectionDialog.showModal();

});

newCollectionDialogCancelButton.addEventListener('click', () => {

    newCollectionDialog.style.opacity = "0";
    newCollectionDialog.style.transform = "translateY(10px)";

    newCollectionDialogForm.reset();
    newCollectionDialogForm.getElementsByClassName("dialog-error")[0].classList.toggle("hidden", true);
    newCollectionDialog.close();

});

newBookDialogFormSubmitButton.addEventListener('click', (event) => {

    //prevent default form submit button function
    event.preventDefault();

    //get provided values in book creation form (0: title, 1: author, 2: page count)
    const values = getAllValuesInForm(newBookDialogForm);

    // --- validation check --- //
    
    let valid = false;

    if(values[0].length > 0) {
        valid = true;
    } else {
        newBookDialogForm.getElementsByClassName("dialog-error")[0].classList.toggle("hidden", false);
    }

    // ------------------------- //

    if(valid) {

        //add the book to library
        addBook(values[0], values[1], values[2]);

        //clear form and close dialog
        newBookDialogForm.reset();
        newBookDialogForm.getElementsByClassName("dialog-error")[0].classList.toggle("hidden", true);
        newBookDialog.close();

    }

});

newCollectionDialogFormSubmitButton.addEventListener('click', (event) => {

    //prevent default form submit button function
    event.preventDefault();

    //get provided values in collection creation form (0: name)
    const values = getAllValuesInForm(newCollectionDialogForm);

    // --- validation check --- //
    
    let valid = false;

    if(values[0].length > 0) {
        valid = true;
    } else {
        newCollectionDialogForm.getElementsByClassName("dialog-error")[0].classList.toggle("hidden", false);
    }

    // ------------------------- //
    
    if(valid) {

        //add the collection to collections
        addCollection(values[0]);

        //clear form and close dialog
        newCollectionDialogForm.reset();
        newCollectionDialogForm.getElementsByClassName("dialog-error")[0].classList.toggle("hidden", true);
        newCollectionDialog.close();

    }

});


searchBar.addEventListener('keyup', bookSearchBar);