import { format, parseISO } from "date-fns";
import Todo from "./todo";
import Project from "./project";
import Storage from "./storage";

class UI{
    static loadHomePage(){
        UI.loadProjects();
        UI.initProjectButtons();

        const projects = Storage.getProjects();
        if(projects.length > 0){
            UI.loadTodos(projects[0].id);
            document.getElementById("current-project-title").textContent = projects[0].name;
        }

        UI.initTodoButtons();
    }

    static loadProjects(){
        const projectList = document.getElementById('projects-list');
        projectList.innerHTML = '';

        const projects = Storage.getProjects();
        projects.forEach(project => {
            const projectItem = document.createElement('div');
            projectItem.classList.add('project-item');
            projectItem.dataset.id = project.id;
            projectItem.textContent = project.name;

            if(projects.indexOf(project === 0)){
                projectItem.classList.add('active');
            }

            projectList.appendChild(projectItem);
        });

        document.querySelectorAll('.project-item').forEach(item => {
            item.addEventListener('click', UI.handleProjectClick);
        });
    }

    static loadTodos(projectId){
        const todoList = document.querySelector("#todos-list");
        todoList.innerHTML = "";

        const projects = Storage.getProjects();
        const project = projects.find(p => p.id === projectId);

        if(project){
            project.todos.forEach(todo => {
                const todoItem = document.createElement("div");
                todoItem.classList.add(`todo-item`, `priority-${todo.priority}`);
                todoItem.dataset.id = todo.id;

                const todoInfo = document.createElement('div');
                todoInfo.classList.add("todo-info");

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.classList.add = "todo-checkbox";
                checkbox.checked = todo.completed;
                checkbox.addEventListener('change', () => {
                    Storage.toggleToDoComplete(projectId, todo.id);
                    UI.updateTodoAppearance(todoItem,todo);
                });

                const title = document.createElement('span');
                title.classList.add('todo-title');
                title.textContent = todo.title;

                const date = document.createElement('span');
                date.classList.add('todo-date');
                date.textContent = format(parseISO(todo.dueDate), 'dd MMM yyyy');

                todoInfo.appendChild(checkbox);
                todoInfo.appendChild(title);
                todoInfo.appendChild(date);

                const todoActions = document.createElement('div');
                todoActions.classList.add('todo-actions');

                const editBtn = document.createElement('button');
                editBtn.textContent = 'Edit';
                editBtn.addEventListener('click', () => UI.openEditTodoModal(todo, projectId));

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.addEventListener("click", () => UI.deleteTodo(projectId, todo.id));

                todoActions.appendChild(editBtn);
                todoActions.appendChild(deleteBtn);

                todoItem.appendChild(todoInfo);
                todoItem.appendChild(todoActions);

                const detailsSection = document.createElement('div');
                detailsSection.classList.add('todo-details');

                const description = document.createElement('div');
                description.classList.add('todo-description');
                description.innerHTML = `<strong>Description:</strong> ${todo.description || 'No description'}`;

                const notes = document.createElement('div');
                notes.classList.add('todo-notes');
                notes.innerHTML = `<strong>Notes:</strong> ${todo.notes || 'No notes'}`;

                detailsSection.appendChild(description);
                detailsSection.appendChild(notes);
                todoItem.appendChild(detailsSection);

                todoInfo.addEventListener('click', (e)=>{
                    if(e.target !== checkbox){
                        detailsSection.style.display = detailsSection.style.display === 'block'?'none':'block';
                    }
                });

                UI.updateTodoAppearance(todoItem, todo);

                todoList.appendChild(todoItem);
            });
        }
    }

    static updateTodoAppearance(todoItem, todo){
        const title = todoItem.querySelector('todo-title');
        if(todo.completed){
            title.classList.add('completed');
        }else{
            title.classList.remove('completed');
        }
    }

    static handleProjectClick(e){
        const projectId = e.target.dataset.id;

        document.querySelectorAll('.project-item ').forEach(item => {
            item.classList.remove('active');
        });
        e.target.classList.add('active');

        UI.loadTodos(projectId);

        const projectTitle = e.target.textContent;

        document.getElementById('current-project-title').textContent = projectTitle;
    }

    static initProjectButtons(){
        const newProjectBtn = document.getElementById('new-project-btn');
        newProjectBtn.addEventListener('click', UI.openNewProjectModal());

        const projectModal = document.getElementById('project-modal');
        const closeProjectModal = projectModal.querySelector('.close');
        closeProjectModal.addEventListener('click', () =>{
            projectModal.style.display = 'none';
        });

        const projectForm = document.getElementById('project-form');
        projectForm.addEventListener('submit', (e) =>{
            e.preventDefault();

            const projectTitle = document.getElementById('project-title').value;
            const newProject = new Project(projectTitle);

            Storage.addProject(newProject);
            UI.loadProjects();

            projectForm.reset();
            projectModal.style.display = 'none';
        });
    }

    static initTodoButtons(){
        const newTodoBtn = document.getElementById('new-todo-btn');
        newTodoBtn.addEventListener('click', UI.openNewTodoModal());

        const todoModal = document.getElementById('todo-modal');
        const closeTodoModal = todoModal.querySelector('.close');
        closeTodoModal.addEventListener('click', () => {
            todoModal.style.display = 'none';
        });

        const todoForm = document.getElementById('todo-form');
        todoForm.addEventListener('submit', (e) =>{
            e.preventDefault();

            const activeProject = document.querySelector('.project-item.active');
            if(!activeProject) return;

            const projectId = activeProject.dataset.id;
            const todoTitle = document.getElementById('todo-title').value;
            const todoDescription = document.getElementById('todo-description').value;
            const todoDueDate = document.getElementById('todo-date').value;
            const todoPriority = document.getElementById('todo-priority').value;
            const todoNotes = document.getElementById('todo-notes').value;

            if(todoForm.dataset.mode = 'edit' && todoForm.dataset.id){
                const todoId = todoForm.dataset.id;
                const projects = Storage.getProjects();
                const project = projects.find(p => p.id === projectId);
                const todo = project.todos.find(t => t.id === todoId);

                todo.title = todoTitle;
                todo.description = todoDescription;
                todo.dueDate = todoDueDate;
                todo.priority = todoPriority;
                todo.notes = todoNotes;

                Storage.updateToDo(projectId, todo);
            } else{
                const newToDo = new Todo(
                    todoTitle,
                    todoDescription,
                    todoDueDate,
                    todoPriority,
                    todoNotes,
                    projectId
                );

                Storage.addToDo(projectId, newToDo);
            }

            UI.loadTodos(projectId);
            todoForm.reset();
            todoModal.style.display = 'none';

            todoForm.dataset.mode = 'add';
            todoForm.dataset.id = '';
            document.getElementById('modal-title').textContent = 'Add New Todo';
        });
    }

    static openNewProjectModal(){
        const projectModal = document.getElementById('project-modal');
        projectModal.style.display = 'block';
    }

    static openNewTodoModal(){
        const todoModal = document.getElementById('todo-modal');
        todoModal.style.display = 'block';

        const todoForm = document.getElementById('todo-form');
        todoForm.reset();
        todoForm.dataset.mode = 'add';
        todoForm.dataset.id = '';
        document.getElementById('modal-title').textContent = 'Add New Todo';
    }

    static openEditModal(todo, projectId){
        const todoModal = document.getElementById('todo-modal');
        todoModal.style.display = 'block';

        document.getElementById('todo-title').value = todo.title
        document.getElementById('todo-description').value = todo.description;
        document.getElementById('todo-date').value = todo.dueDate;
        document.getElementById('todo-priority').value = todo.priority;
        document.getElementById('todo-notes').value = todo.notes;

        const todoForm = document.getElementById('todo-form');
        todoForm.dataset.mode = 'edit';
        todoForm.dataset.id = todo.id;
        document.getElementById('modal-title').textContent = 'Edit Todo';
    }

    static deleteTodo(projectId, todoId){
        if(confirm('Are you sure you want to delete this TODO?')){
            Storage.deleteToDo(projectId, todoId)
            UI.loadTodos(projectId);
        }
    }
}

const initializeApp = () => {
    UI.loadHomePage();

    window.addEventListener('click', (e) => {
        const projectModal = document.getElementById('project-modal');
        const todoModal = document.getElementById('todo-modal');

        if(e.target !== projectModal){
            projectModal.style.display = 'none';
        }  
        
        if(e.target !== todoModal){
            todoModal.style.display = 'none';
        }
    });
}

export {UI, initializeApp};