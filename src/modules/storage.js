import Project from './project';
import Todo from './todo';

// Handles all localStorage operations
class Storage {
  static saveProjects(projects) {
    localStorage.setItem('projects', JSON.stringify(projects));
  }

  static getProjects() {
    const projectsData = localStorage.getItem('projects');
    if (!projectsData) {
      // Create default project if no projects exist
      const defaultProject = new Project('Default Project');
      Storage.saveProjects([defaultProject]);
      return [defaultProject];
    }

    // Parse stored projects and convert back to Project objects
    const parsedProjects = JSON.parse(projectsData);
    return parsedProjects.map(project => {
      const newProject = new Project(project.name, project.id);
      // Convert todos and add them to project
      const todos = project.todos.map(todo => {
        return new Todo(
          todo.title,
          todo.description,
          todo.dueDate,
          todo.priority,
          todo.notes,
          todo.projectId,
          todo.id
        );
      });
      newProject.todos = todos;
      return newProject;
    });
  }

  static addProject(project) {
    const projects = Storage.getProjects();
    projects.push(project);
    Storage.saveProjects(projects);
  }

  static deleteProject(projectId) {
    const projects = Storage.getProjects();
    const filteredProjects = projects.filter(project => project.id !== projectId);
    Storage.saveProjects(filteredProjects);
  }

  static addTodo(projectId, todo) {
    const projects = Storage.getProjects();
    const project = projects.find(p => p.id === projectId);
    if (project) {
      project.todos.push(todo);
      Storage.saveProjects(projects);
    }
  }

  static deleteTodo(projectId, todoId) {
    const projects = Storage.getProjects();
    const project = projects.find(p => p.id === projectId);
    if (project) {
      project.todos = project.todos.filter(todo => todo.id !== todoId);
      Storage.saveProjects(projects);
    }
  }

  static updateTodo(projectId, updatedTodo) {
    const projects = Storage.getProjects();
    const project = projects.find(p => p.id === projectId);
    if (project) {
      const todoIndex = project.todos.findIndex(todo => todo.id === updatedTodo.id);
      if (todoIndex !== -1) {
        project.todos[todoIndex] = updatedTodo;
        Storage.saveProjects(projects);
      }
    }
  }
  
  static toggleTodoComplete(projectId, todoId) {
    const projects = Storage.getProjects();
    const project = projects.find(p => p.id === projectId);
    if (project) {
      const todo = project.todos.find(t => t.id === todoId);
      if (todo) {
        todo.completed = !todo.completed;
        Storage.saveProjects(projects);
      }
    }
  }
  }
  
  export default Storage;