const $todoForm = document.getElementById('js-todo-form'),
      $todoBody = document.querySelector('.js-todo-body'),
      $count = document.querySelector('.js-count'),
      $clear = document.querySelector('.js-clear')

//let guardar = document.getElementById('guardar');


//Datos globales para el array todos

let todos = [];

//para cargar el evento
window.addEventListener('load', cargarVentana);
$todoForm.addEventListener('submit', handleFormSubmit);
$todoBody.addEventListener('click', handleFormAction);
$clear.addEventListener('click', handleClearTodos);

function handleFormSubmit(e) {   
         e.preventDefault();
   

    const $input = document.querySelector('input'),
                   todo = $input.value,
                   myTodo = { id: Date.now(), task: todo, status: 'pending' }

    todos.push(myTodo);
    
    localStorage.setItem('todos' , JSON.stringify(todos));
    $input.value = '';
    
    //Creamos la ul del html
    if (todo.length === 1) renderTodoList();

    renderTodo(myTodo);

    //Actualizar datos
    updateListCount();
 
}


function cargarVentana() {
    const localStorageTodos = JSON.parse(localStorage.getItem('todos'));

    todos = localStorageTodos || [];

    if (todos.length === 0) {
        renderEmptyState();
    } else {
        renderTodoList();

        todos.map((todo) => {
            renderTodo(todo);
        })
    }
    updateListCount();
}


function renderEmptyState() {
    $todoBody.innerHTML = `<div class="empty">
                                <img src="img/laptop.png" alt="empty state">
                                <p class="title">it's lonely here ...</p>
                           </div>`
}


function renderTodoList() {
    $todoBody.innerHTML = `<ul class="todo__list js-todo-list"></ul>`;
}


function renderTodo(todo) {
    //Creamos el todo list usando el pase de todo el objeto
    let todoList = `<li data-id="${todo.id}" data-status="${todo.status}">
                        <label for="${todo.id}">
                            <input type="checkbox" id="${todo.id}" value="${todo.id}" ${todo.status === 'completed' ? 'checked' : null}/>
                            <input class="asa" type="text" value="${todo.task}" readonly >
                            
                        </label>
                        <div class="actions">
                            <button class="js-edit">
                                <i class="ri-pencil-fill"></i>
                            </button>
                            <button class="js-delete">
                                <i class="ri-delete-bin-fill"></i>
                            </button>
                        </div>
                    </li>`;
   
        $todoBody.querySelector('.js-todo-list').innerHTML += todoList;
        
    
}


function updateListCount() {
    $count.innerHTML = `${todos.length} items left`;
}


function handleFormAction(e) {
    updateStatus(e);

    deleteTodo(e);

    toggleInputState(e);

}


function updateStatus(e) {
    const $status = e.target.closest('input[type="checkbox"]');

    if (!$status) return;

    const $li = $status.closest('li'),
          id = $li.dataset.id,
          status = $status.checked ? 'completed' : 'pending',
          currentIndex = todos.findIndex((todo) => todo.id == id);

          $li.dataset.status = status;

          todos[currentIndex].status = status;

          localStorage.setItem('todos', JSON.stringify(todos));
}


function deleteTodo(e) {
    const $delete = e.target.closest('.js-delete');

    if (!$delete) return;

    const id = $delete.closest('li').dataset.id;

    todos = todos.filter((todo) => todo.id != id);

    $delete.closest('li').remove();

    localStorage.setItem('todos', JSON.stringify(todos));

    if (todos.length === 0) renderEmptyState();

    updateListCount();

}


function toggleInputState(e) {
    const $edit = e.target.closest('.js-edit');
    
    if (!$edit) return;

    const id = $edit.closest('li').dataset.id,
               $input = $edit.closest('li').querySelector('input[type="text"]');

    if ($input.hasAttribute('readonly')) $input.removeAttribute('readonly');
     else $input.setAttribute('readonly', '');
    

    $input.addEventListener('keyup', updateTodo.bind(e, id));
}


function updateTodo(id, e) {
    let value  = e.target.value,
        index = todos.findIndex((todo) => todo.id == id);

    todos[index].task = value;

    localStorage.setItem('todos', JSON.stringify(todos));
}


function handleClearTodos() {
    todos = [];
    localStorage.setItem('todos', JSON.stringify(todos));

    $todoBody.innerHTML = '';
    updateListCount();
    renderEmptyState();
}

// guardar.addEventListener('click', () => {
//      handleFormSubmit();
    
// });
// guardar.addEventListener('keyup', () => {
//     handleFormSubmit();
// });


