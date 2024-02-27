const todos = [];
const RENDER_EVENT = 'render-todo';

function generateId() {
    return +new Date();
}

function generateTodoObject(id, title, author, year, isCompleted) {
    return {
      id,
      title,
      author,
      year,
      isCompleted
    }
}

function addTodo() {
    const judul = document.getElementById('bookTitle').value;
    const author = document.getElementById('bookAuthor').value;
    const year = document.getElementById('bookYear').value;

    document.getElementById('bookTitle').value = '';
    document.getElementById('bookAuthor').value = '';
    document.getElementById('bookYear').value = '';
    document.getElementById('inputBookIsComplete').checked = false;
 
    const generatedID = generateId();
    const todoObject = generateTodoObject(generatedID, judul, author, year, false);
    todos.push(todoObject);
    
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeTodo(todoObject) {
    const bookTitle = document.createElement('h2');
    bookTitle.innerText = todoObject.title;

    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = 'Penulis: ' + todoObject.author;

    const bookYear = document.createElement('p');
    bookYear.innerText = 'Tahun: ' + todoObject.year;
   
    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(bookTitle, bookAuthor, bookYear);
   
    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `todo-${todoObject.id}`);

    const actionContainer = document.createElement('div');
    actionContainer.classList.add('action');
    
    if (todoObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.innerText = 'Belum selesai di Baca';
        undoButton.classList.add('green');

        undoButton.addEventListener('click', function () {
          undoTaskFromCompleted(todoObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.innerText = 'Hapus buku';
        trashButton.classList.add('red');

        trashButton.addEventListener('click', function () {
          removeTaskFromCompleted(todoObject.id);
        });

        actionContainer.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.innerText = 'Selesai dibaca';
        checkButton.classList.add('green');

        checkButton.addEventListener('click', function () {
          addTaskToCompleted(todoObject.id);
        });

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Hapus buku';
        deleteButton.classList.add('red');

        deleteButton.addEventListener('click', function () {
          removeTaskFromCompleted(todoObject.id);
        });

        actionContainer.append(checkButton, deleteButton);
    }
    
    container.append(actionContainer);
     
    return container;
}

document.addEventListener(RENDER_EVENT, function () {
    // console.log(todos);
    const uncompletedBook = document.getElementById('incompleteBook');
    uncompletedBook.innerHTML = '';
    
    const completedBook = document.getElementById('completeBook');
    completedBook.innerHTML = '';
    
    for (const todoItem of todos) {
        const todoElement = makeTodo(todoItem);
        if (!todoItem.isCompleted)
        uncompletedBook.append(todoElement);
        else
        completedBook.append(todoElement);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addTodo();
    });

    // if (isStorageExist()) {
    //     loadDataFromStorage();
    // }
});