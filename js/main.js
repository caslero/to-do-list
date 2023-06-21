const $todoForm = document.getElementById('js-todo-form'),
      $todoBody = document.querySelector('.js-todo-body'),
      $count = document.querySelector('.js-count'),
      $clear = document.querySelector('.js-clear'),
      $borrador = document.querySelector('.js-borrador')
      //borrador = 'desmarcado';

let pagina = 1;
let limite = 3;
//array que en este caso en todos
      
let anterior = document.getElementById('anterior');
let siguiente = document.getElementById('siguiente');
let contenedorBotones = document.getElementById('contenedorBotones');
      
anterior.addEventListener('click', anteriorP);
siguiente.addEventListener('click', siguienteP);
let principal = document.getElementById('principal');




//Datos globales para el array todos
let todos = [];

//para cargar el evento
window.addEventListener('load', cargarVentana);
$todoForm.addEventListener('submit', handleFormSubmit);
$todoBody.addEventListener('click', handleFormAction);
$clear.addEventListener('click', handleClearTodos);





function handleFormSubmit(e) {   
         e.preventDefault();
    
    let $input = document.querySelector('input');
    let todo = $input.value;
    let myTodo = { id: Date.now(), task: todo, status: 'pending', clase: 'desmarcar'}

    todos.push(myTodo);

    let recorrerTodos = [];
    recorrerTodos = todos;
 
    let id = '';
    let task = '';
    let nuevoTodos = [];
    
    recorrerTodos.forEach((data) => {
         id = data.id;
         task = data.task;

         if (recorrerTodos.length !== 0) {            
             nuevoTodos.push({
                 id: id,
                 task: task,
                 status: 'pending',
                 clase: 'desmarcar'
                 });
         }
    })
    
    recorrerTodos = [];
    todos = [];

    recorrerTodos = nuevoTodos;
    todos = recorrerTodos;
     
    if (todos.length === 1)
        renderTodoList();
        renderTodo(myTodo);
        marcado();
        updateListCount();       
        localStorage.setItem('todos' , JSON.stringify(todos));     
        $input.value = '';
}



function cargarVentana() {
    const localStorageTodos = JSON.parse(localStorage.getItem('todos'));
    todos = localStorageTodos || [];
    if (todos.length === 0) {
        renderEmptyState();
    } else {
        renderTodoList();

        primerosDatos();
       
        updateListCount();

    localStorage.setItem('todos' , JSON.stringify(todos)); 
    }
}



function renderEmptyState() {

    if (todos.length === 0) {
        $todoBody.innerHTML = `<div class="empty">
                                <img src="img/tareas.png" alt="empty state">
                                <p class="title">Sin Tareas Pendientes ...</p>
                           </div>`
    $count.innerHTML = `${todos.length} Tareas`;
    $clear.innerHTML = '';
    $borrador.innerHTML = '';
    }    
}



function renderTodoList() {  
        $todoBody.innerHTML = `<ul class="todo__list js-todo-list" id="listados"></ul>`;      
}



function renderTodo(todo) {
    
    let todoList = `<li data-id="${todo.id}" data-status="${todo.status}" data-clase="${todo.clase}" class="space-x-4">
        <label for="${todo.id}" class="space-x-4 marcar">
            <input type="checkbox"  onclick="eliminarMarcados()" clase="" id="${todo.id}" value="${todo.id}" ${todo.status === 'completed' ? 'checked' : null}/>                       
            <input id="lista" class="asa" type="text" value="${todo.task}" readonly  ${todo.clase === 'marcar' ? 'checked' : null}>                            
        </label>
        <div class="actions">
            <button class="js-edit">
                <i class="ri-pencil-fill"></i>
            </button>
            <button class="js-delete">
                <i class="ri-delete-bin-fill" title="Borrar Solo uno"></i>
            </button>
        </div>
    </li>`;
   
    $todoBody.querySelector('.js-todo-list').innerHTML += todoList;    
}



function updateListCount() {    
    if (todos.length != 0) {
        $count.innerHTML = `${todos.length} Tareas`;
        $clear.innerHTML = `<button class="borrar-lista">Borrar Lista</button>`;
        contenedorBotones.classList.remove('hidden');
    } else {
        $count.innerHTML = `${todos.length} Tareas`;
        contenedorBotones.classList.add('hidden');
    }
    eliminarMarcados();
    localStorage.setItem('todos', JSON.stringify(todos));

    let cantidadPaginas = todos.length / limite;
    let x = Math.ceil(cantidadPaginas);
 
    if (pagina == 1 && x >= 2) {
        anterior.classList.add('hidden');
        siguiente.classList.remove('hidden');
    } else if (pagina > 1 && pagina >= x) {
        anterior.classList.remove('hidden');
        siguiente.classList.add('hidden');
    } else if (pagina !== x) {
        anterior.classList.remove('hidden');
        siguiente.classList.remove('hidden');
    }
};




function handleFormAction(e) {
    updateStatus(e);

    deleteTodo(e);

    toggleInputState(e);

}



function updateStatus(e) {
    const $status = e.target.closest('input[type="checkbox"]');
    const $clase = e.target.closest('input[type="checkbox"]');
    
    if (!$status) return;    

    const $li = $status.closest('li'),
          id = $li.dataset.id,
          status = $status.checked ? 'completed' : 'pending',
          clase = $clase.checked ? 'marcar' : 'desmarcar',

          currentIndex = todos.findIndex((todo) => todo.id == id);
            
          $li.dataset.status = status;
          $li.dataset.clase = clase;          

          todos[currentIndex].status = status;
          todos[currentIndex].clase = clase;        
          
          eliminarMarcados();
}



function deleteTodo(e) {
  
    const $delete = e.target.closest('.js-delete');
    
    if (!$delete) return;

    const id = $delete.closest('li').dataset.id;
    
    todos = todos.filter((todo) => todo.id != id);
    
    $delete.closest('li').remove();

    localStorage.setItem('todos', JSON.stringify(todos));

    primerosDatos();
    
    if (todos.length === 0)
    
    renderEmptyState();
   
    updateListCount();
    
}



function toggleInputState(e) {
    const $edit = e.target.closest('.js-edit');
    const $cambiar = e.target.closest('.js-edit');
    
    if (!$edit) return;

    const id = $edit.closest('li').dataset.id,
               $input = $edit.closest('li').querySelector('input[type="text"]');

    if ($input.hasAttribute('readonly')) {
        $input.removeAttribute('readonly');
    } else {
        $input.setAttribute('readonly', '');
    }
    $input.addEventListener('keyup', updateTodo.bind(e, id));    
}



function updateTodo(id, e) {
    let value  = e.target.value,
        index = todos.findIndex((todo) => todo.id == id);
    todos[index].task = value;
    localStorage.setItem('todos', JSON.stringify(todos));
}



function handleClearTodos() {
    let respuesta = prompt('Eliminar lista, Presione Y para Borrar, N para salir: ')

    if (respuesta === 'Y' || respuesta === 'y') {
        todos = [];
        localStorage.setItem('todos', JSON.stringify(todos));
    
        $todoBody.innerHTML = '';
        updateListCount();
        renderEmptyState();
        
        anterior.classList.add('hidden');
        siguiente.classList.add('hidden');
        
    }
   
}



/** Funcion para eliminar solo los elementos que estan marcados */
function marcado(){    

    let todosN = todos.filter(todo => todo.clase == 'desmarcar');
 
    todos = todosN;

    localStorage.setItem('todos', JSON.stringify(todos));

    if (todos.length === 0) {
        renderEmptyState();
        updateListCount();
    } else {
       
        cargarVentana();
        eliminarMarcados(); 
    }

}



/** Funcion para mostrar el boton de eliminar marcados mientras haya al menos un elemento marcado */
function eliminarMarcados() {

    let i = 0;
    let todosN = todos.filter(todo => todo.clase === 'marcar');

    if (todosN == 0) {
        i = false;
        $borrador.innerHTML = '';
    } else {
        i = true;
        $borrador.innerHTML = `<button class="borrar-marcados quitar">Borrar Marcados</button>`;
    }      
}


function desmarcado(){

    let cantidadPaginas = todos.length / limite;
    let x = Math.ceil(cantidadPaginas);
    //console.log('Pagina: ' + pagina + ' / ' + x + ' en primeros datos');
    document.getElementById('numeroDePaginas').innerHTML = 'Pagina: ' + pagina + ' / ' + x + ' en primeros datos';
    if (pagina <= 1) {
        anterior.classList.add('hidden');
        siguiente.classList.add('hidden');
    }
     pagina = pagina - 1;
     if (pagina <= x) {
        anterior.classList.add('hidden');
        
        const total_no_of_items = todos.length;
        const items_per_page = 3;
            //let no_of_pages = total_no_of_items / items_per_page;
            //let page_number = 1;         
        const items_to_skip = (pagina - 1) * items_per_page;
        let items = todos.slice(items_to_skip, items_per_page + items_to_skip);
        renderTodoList();
        items.map((todo) => {                        
            renderTodo(todo);
        });
        
     }

     
   
   
 
}

function primerosDatos() {
    
    let cantidadPaginas = todos.length / limite;
    let x = Math.ceil(cantidadPaginas);
    console.log('Pagina: ' + pagina + ' / ' + x + ' en primeros datos');
    document.getElementById('numeroDePaginas').innerHTML = 'Pagina: ' + pagina + ' / ' + x + ' en primeros datos';
    
    if (pagina <= 1) {
        siguiente.classList.add('hidden');
        anterior.classList.add('hidden');
        const total_no_of_items = todos.length;
        const items_per_page = 3;
        //let no_of_pages = total_no_of_items / items_per_page;
        //let page_number = 1;         
    const items_to_skip = (pagina - 1) * items_per_page;
    let items = todos.slice(items_to_skip, items_per_page + items_to_skip);
    renderTodoList();
    items.map((todo) => {                        
        renderTodo(todo);
    });
    } else if (pagina <= x) {
    const total_no_of_items = todos.length;
    const items_per_page = 3;
        //let no_of_pages = total_no_of_items / items_per_page;
        //let page_number = 1;         
    const items_to_skip = (pagina - 1) * items_per_page;
    let items = todos.slice(items_to_skip, items_per_page + items_to_skip);
    renderTodoList();
    items.map((todo) => {                        
        renderTodo(todo);
    });

    
   
   } else {
    console.log('error 500');
    pagina = pagina - 1;
    const total_no_of_items = todos.length;
    const items_per_page = 3;
        //let no_of_pages = total_no_of_items / items_per_page;
        //let page_number = 1;         
    const items_to_skip = (pagina - 1) * items_per_page;
    let items = todos.slice(items_to_skip, items_per_page + items_to_skip);
    renderTodoList();
    items.map((todo) => {                        
        renderTodo(todo);
    });
    document.getElementById('numeroDePaginas').innerHTML = 'Pagina: ' + pagina + ' / ' + x + ' en primeros datos';
    //desmarcado();
   }

   
    
}





function siguienteP() {
    pagina = pagina + 1;



    let cantidadPaginas = todos.length / limite;
    let paginasTotales = todos.length / limite;
    let x = Math.ceil(cantidadPaginas);

    console.log(paginasTotales - x);
    let pExistente = paginasTotales - x;
   
    //console.log('Pagina: ' + pagina + ' / ' + x);

    if (pagina >= x) {
       
        console.log('Entramos a la condicion 1 de Siguiente rata');
        document.getElementById('numeroDePaginas').innerHTML = 'Pagina: ' + pagina + ' / ' + x + ' en primeros datos';
        siguiente.classList.add('hidden')
        anterior.classList.remove('hidden')
        
         const items_per_page = 3;
                
        let page_number = 1;         
        const items_to_skip = (pagina - 1) * items_per_page;
        const items = todos.slice(items_to_skip, items_per_page + items_to_skip);
        console.log(items);
        renderTodoList(); 
        items.map((todo) => {
                          
             renderTodo(todo);
            
        });
        
        


    } else if (pagina < x) {
        document.getElementById('numeroDePaginas').innerHTML = 'Pagina: ' + pagina + ' / ' + x + ' en primeros datos';
        console.log('Entramos a la condicion 2 de Siguiente');
        siguiente.classList.remove('hidden')
        anterior.classList.remove('hidden')

         renderTodoList();
         const items_per_page = 3;
                
        let page_number = 1;         
        const items_to_skip = (pagina - 1) * items_per_page;
        const items = todos.slice(items_to_skip, items_per_page + items_to_skip);
        console.log(items);

        items.map((todo) => {                
             renderTodo(todo);
        });

    }
    
    
}

function anteriorP() {
    pagina = pagina - 1;
    let cantidadPaginas = todos.length / limite;
    let x = Math.ceil(cantidadPaginas);
    document.getElementById('numeroDePaginas').innerHTML = 'Pagina: ' + pagina + ' / ' + x + ' en primeros datos';

    if (pagina <= 1 && pagina <= x) {
        renderTodoList();
        console.log('Entramos a la condicion 1 de anterior');
        anterior.classList.add('hidden');
        siguiente.classList.remove('hidden');

        const total_no_of_items = todos.length;
        const items_per_page = 3;
            //let no_of_pages = total_no_of_items / items_per_page;
            //let page_number = 1;         
        const items_to_skip = (pagina - 1) * items_per_page;
        const items = todos.slice(items_to_skip, items_per_page + items_to_skip);
        console.log(items)
        items.map((todo) => {                
            renderTodo(todo);
        });

        
      
    } else if (pagina > 1 && pagina < x) {
        renderTodoList();
        anterior.classList.remove('hidden');
        siguiente.classList.remove('hidden');
        console.log('Entramos a la condicion 2 de anterior');
        
        const total_no_of_items = todos.length;
        const items_per_page = 3;
            //let no_of_pages = total_no_of_items / items_per_page;
            //let page_number = 1;         
        const items_to_skip = (pagina - 1) * items_per_page;
        const items = todos.slice(items_to_skip, items_per_page + items_to_skip);
        console.log(items)
        items.map((todo) => {                
            renderTodo(todo);
        });
      
        
    } else if (pagina > 1 && pagina <= x) {
        
        anterior.classList.remove('hidden');
        siguiente.classList.add('hidden');
        console.log('Entramos a la condicion 3 de anterior');
        renderTodoList();
        const total_no_of_items = todos.length;
        const items_per_page = 3;
            //let no_of_pages = total_no_of_items / items_per_page;
            //let page_number = 1;         
        const items_to_skip = (pagina - 1) * items_per_page;
        const items = todos.slice(items_to_skip, items_per_page + items_to_skip);
        console.log(items)
        items.map((todo) => {                
            renderTodo(todo);
        });
               
        
    }  
}









function despues() {
  
    
    
    
    //console.log('Siguiente: ' + pagina);










    // console.log('Pagina vale: ' + pagina);  
    // let cantidadPaginas = todos.length / limite;
    // let x = Math.round(cantidadPaginas) + 1;
    // if (pagina <= x) {        
        
    //     siguiente.removeAttribute("disabled");
    //     const total_no_of_items = todos.length;
    //       const items_per_page = 3;
    //       //let no_of_pages = total_no_of_items / items_per_page;
    //       //let page_number = 1;
         
    //       const items_to_skip = (pagina - 1) * items_per_page;
    //       const items = todos.slice(items_to_skip, items_per_page + items_to_skip);
    //       console.log(items)
          		
	// } else {            
	// 	siguiente.setAttribute("disabled", true);
    //     //antes();
        
       
    //     console.log('desactivado');
	// }    
}


function antes() {
    pagina = pagina - 1;
    // //console.log('Pagina vale: ' + pagina); 
    // let cantidadPaginas = todos.length / limite;
    // let x = Math.round(cantidadPaginas) + 1;

    // if (pagina > 1 && pagina <= x) {
	// 	anterior.removeAttribute("disabled");//activada
    //     console.log('esta es la pagina numero: ' + pagina);
    //     const total_no_of_items = todos.length;
    //       const items_per_page = 3;
    //       //let no_of_pages = total_no_of_items / items_per_page;
    //       //let page_number = 1;
         
    //       const items_to_skip = (pagina - 1) * items_per_page;
    //       const items = todos.slice(items_to_skip, items_per_page + items_to_skip);
    //       console.log(items)
        

	// } else {

    //     anterior.setAttribute("disabled", true);
    //     despues();          
    //     console.log('boton anterior desactivado' + pagina);
        
	// }
   
}



// anterior.addEventListener("click", retrocederPagina);
// siguiente.addEventListener("click", avanzarPagina);




// $todoBody.addEventListener('click', paginacion)
// function paginacion(){
//  //const elementos = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]; 
 
//  const total_no_of_items = todos.length;
//  const items_per_page = 3;
//  let no_of_pages = total_no_of_items / items_per_page;
//  let page_number = 1;
 
//  const items_to_skip = (page_number - 1) * items_per_page;
//  const items = todos.slice(items_to_skip, items_per_page + items_to_skip);
//  console.log(items) 
// }

function quitarBotones() {
    siguiente.classList.add('hidden')
    anterior.classList.add('hidden')
}