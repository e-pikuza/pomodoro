import { changeActiveBtn, stop } from "./control.js";
import { state } from "./state.js";

const titleElem = document.querySelector('.title');
const pomodoroCountElem = document.querySelector('.count_num');
const todoListElem = document.querySelector('.todo__list');

const li = document.createElement('li');
li.classList.add('todo__item');

const todoAddBtn = document.createElement('button');
todoAddBtn.classList.add('todo__add');
todoAddBtn.textContent = "Добавить новую задачу";
li.append(todoAddBtn);

const getTodo = () => {
    const todoList = JSON.parse(localStorage.getItem('pomodoro') || '[]');
    return todoList;
}

const addTodo = (title) => {
    const todo = {
        title,
        pomodoro: 0,
        id: Math.random().toString(16).substring(2,8),
    }

    const todoList = getTodo();
    todoList.push(todo);

    localStorage.setItem('pomodoro', JSON.stringify(todoList));
    return todo;
};

export const updateTodo = (todo) => {
    const todoList = getTodo();
    if (!todoList.length) {
        return;
    }
    const todoItem = todoList.find((item) => item.id === todo.id);
    todoItem.title = todo.title;
    todoItem.pomodoro = todo.pomodoro;
    localStorage.setItem('pomodoro', JSON.stringify(todoList));
};

const deleteTodo = (id) => {
    const todoList = getTodo();
    const newTodoList = todoList.filter((item) => item.id !== id);
    const todo = todoList.find(el => el.id === id);
    if (todo.id === state.activeTodo.id) {
        state.activeTodo = newTodoList[newTodoList.length - 1];
    }
    
    localStorage.setItem('pomodoro', JSON.stringify(newTodoList));
}

const createTodoListItem = (todo) => {
    const todoItem = document.createElement('li');
    todoItem.classList.add('todo__item');
    todoItem.dataset.id = todo.id;

    todoItem.innerHTML = `
        <div class="todo__item-wrapper">
            <button class="todo__btn" data-id='${todo.id}'>${todo.title}</button>
            <button class="todo__edit" data-id='${todo.id}' aria-label="Редактировать"></button>
            <button class="todo__del" data-id='${todo.id}' aria-label="Удалить"></button>
        </div>
    `;

    todoListElem.prepend(todoItem);
}

const renderTodoList = (list) => {
    todoListElem.textContent = '';
    list.forEach(createTodoListItem);
    todoListElem.append(li);
};

export const showTodo = () => {
    if (state.activeTodo) {
        titleElem.textContent = state.activeTodo.title;
        pomodoroCountElem.textContent = state.activeTodo.pomodoro;
    }   else {
        titleElem.textContent = '';
        pomodoroCountElem.textContent = 0;
    } 
};

export const initTodo = () => {
    const todoList = getTodo();

    if (!todoList.length) {
        state.activeTodo = {
            id: 'default',
            pomodoro: 0,
            title: 'Помодоро',
        };
    } else {
        state.activeTodo = todoList[todoList.length - 1];
    }
    
    showTodo();

    renderTodoList(todoList);

    todoListElem.addEventListener('click', (event) => {
        const target = event.target;

        if (target.classList.contains('todo__btn')) {
            state.activeTodo = getTodo().find(el => el.id === target.dataset.id);
            showTodo();
            changeActiveBtn('work');
            stop();
        }

        if (target.closest('.todo__edit')) {
            const todo = getTodo().find(el => el.id === target.dataset.id);
            const todoBtn = document.querySelector(`button.todo__btn[data-id="${target.dataset.id}"]`);

            todo.title = prompt('Название задачи', todo.title);
            todoBtn.textContent = todo.title;
            if (todo.id === state.activeTodo.id) {
                state.activeTodo.title = todo.title;
            }
            updateTodo(todo);
            showTodo();  
        }

        if (target.closest('.todo__del')) {
            
            const todoItem = document.querySelector(`li.todo__item[data-id="${target.dataset.id}"]`);
            deleteTodo(target.dataset.id);
            
            showTodo();
            todoItem.remove();
        }

        if (target.closest('.todo__add')) {
            const title = prompt('Введите имя задачи')?.trim();
            if (title) {
                const todo = addTodo(title);
                createTodoListItem(todo);
                state.activeTodo = todo;
                showTodo();
                stop();
            } else {
                alert('Ввведите корректные данные')
            }
        }
    });
}