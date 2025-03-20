import Todo from "./todo.js";
import Project from "./project.js";

class Storage{
    static saveProjects(projects){
        localStorage.setItem(`projects`, JSON.stringify(projects));
    }

    static getProjects(){
        const projectsData = localStorage.getItem(`projects`);

        if(!projectsData){
            const personalProject = new Project("Personal");
            Storage.saveProjects([personalProject]);
            return [personalProject];
        }

        const parsedProjects = JSON.parse(projectsData);
        return parsedProjects.map(project => {
            const newProject = new Project(project.id, project.name)
            const todos = project.todos.map(todo => {
                return new Todo(
                    todo.title,
                    todo.description,
                    todo.dueDate,
                    todo.priority,
                    todo.notes,
                    todo.projectId,
                    todo.id
                )
            });
            newProject.todos = todos;
            return newProject;
        });
    }


    static addProject(project){
        const projects = Storage.getProjects();
        projects.push(project);
        Storage.saveProjects(projects);
    }

    static deleteProject(projectId){
        const projects = Storage.getProjects();
        const filteredProjects = projects.filter(project => project.id !== projectId);
        Storage.saveProjects(filteredProjects);
    }

    static addToDo(projectId, todo){
        const projects = Storage.getProjects();
        const project = projects.find(proj => proj.id === projectId);
        if(project){
            project.todos.push(todo);
            Storage.saveProjects(projects);
        }
    }

    static deleteToDo(projectId, todoId){
        const projects = Storage.getProjects();
        const project = projects.find(p => p.id === projectId);
        if(project){
            project.todos = project.todos.filter(todo => todo.id !== todoId);
            Storage.saveProjects(projects);
        }
    }

    static updateToDo(projectId, updatedToDo){
        const projects = Storage.getProjects();
        const project = projects.find(p => p.id === projectId);
        if(project){
            const toDoIndex = project.todos.findIndex(todo => todo.id === updatedToDo.id);
            if(toDoIndex !== -1){
                project.todos[toDoIndex] = updatedToDo;
                Storage.saveProjects(projects);
            }
        }
    }

    static toggleToDoComplete(projectId, todoId){
        const projects = Storage.getProjects();
        const project = projects.find(p => p.id === projectId);
        if(project){
            const todo = project.todos.find(t => t.id === todoId)
            if(todo){
                todo.complete = !todo.complete;
                Storage.saveProjects(projects);
            }
            
        }
    }
}

export default Storage;