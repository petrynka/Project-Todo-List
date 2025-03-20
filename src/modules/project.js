class Project {
    constructor(name, id = Date.now().toString()) {
      this.id = id;
      this.name = name;
      this.todos = [];
    }
  
    setName(name) {
      this.name = name;
    }
  
    addTodo(todo) {
      this.todos.push(todo);
    }
  
    removeTodo(todoId) {
      this.todos = this.todos.filter(todo => todo.id !== todoId);
    }
  
    getTodo(todoId) {
      return this.todos.find(todo => todo.id === todoId);
    }
  }
  
  export default Project;