const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
      id,
      title,
      year,
      author,
      isCompleted
    }
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
}

function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(books);

      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const book of data) {
        books.push(book);
      }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function addBook() {
  const textTitle = document.getElementById('title').value;
  const textAuthor = document.getElementById('author').value;
  const textYear = parseInt(document.getElementById('year').value);
  const isCompleted = document.getElementById('inputBookIsComplete').checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, textTitle, textAuthor, textYear, isCompleted);

  if (isCompleted) {
      addBookCompleted();
  } else {
      books.push(bookObject);
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
  }
}

function addBookCompleted() {
  const textTitle = document.getElementById('title').value;
    const textAuthor = document.getElementById('author').value;
    const textYear = parseInt(document.getElementById('year').value);
 
    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, textTitle, textAuthor, textYear, true);
    books.push(bookObject);
    
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function addTaskToCompleted (bookId) {
    const bookTarget = findBook(bookId);
   
    if (bookTarget == null) return;
   
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId) {
    for (const bookItem of books) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in books) {
      if (books[index].id === bookId) {
        return index;
      }
    }
   
    return -1;
}

function removeTaskFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);
   
    if (bookTarget === -1) return;
   
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    confirm('Buku akan dihapus')
    saveData();
    alert('Buku telah dihapus')
}

function undoTaskFromCompleted(bookId) {
    const bookTarget = findBook(bookId);
   
    if (bookTarget == null) return;
   
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function makeBook(bookObject) {
  const title = document.createElement('h2');
  title.innerText = bookObject.title;

  const author = document.createElement('p');
  author.innerText = `Penulis: ${bookObject.author}`;

  const year = document.createElement('p');
  year.innerText = `Tahun: ${bookObject.year}`;

  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(title, author, year);

  const container = document.createElement('div');
  container.classList.add('item', 'shadow');
  container.append(textContainer);
  container.setAttribute('id', `book-${bookObject.id}`);

  if (bookObject.isCompleted) {
      const undoButton = document.createElement('button');
      undoButton.classList.add('undo-button');

      undoButton.addEventListener('click', function () {
          undoTaskFromCompleted(bookObject.id);
      });

      const trashButton = document.createElement('button');
      trashButton.classList.add('trash-button');

      trashButton.addEventListener('click', function () {
          removeTaskFromCompleted(bookObject.id);
      });

      container.append(undoButton, trashButton);
  } else {
      const checkButton = document.createElement('button');
      checkButton.classList.add('check-button');

      checkButton.addEventListener('click', function () {
          addTaskToCompleted(bookObject.id);
      });

      const trashButton = document.createElement('button');
      trashButton.classList.add('trash-button');

      trashButton.addEventListener('click', function () {
          removeTaskFromCompleted(bookObject.id);
      });

      container.append(checkButton, trashButton);
  }

  return container;
}

document.addEventListener(RENDER_EVENT, function () {
    // console.log(books);
    const uncompletedBOOKList = document.getElementById('books');
    uncompletedBOOKList.innerHTML = '';
    
    const completedBOOKList = document.getElementById('completed-books');
    completedBOOKList.innerHTML = '';
    
    for (const bookItem of books) {
        const todoElement = makeBook(bookItem);
        if (!bookItem.isCompleted)
        uncompletedBOOKList.append(todoElement);
        else
        completedBOOKList.append(todoElement);
    }
});

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});
