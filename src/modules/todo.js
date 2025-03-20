class Todo{
    constructor(title, description, dueDate, priority, notes = '', projectId, id = Date.now().toString()){
        this.id = id;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
        this.completed = false;
        this.projectId = projectId;
    }

    toggleComplete(){
        this.completed = !this.completed;
    }

    setTitle(title){
        this.title = title;
    }

    setDescription(description){
        this.description = description;
    }

    setDueDate(dueDate){
        this.dueDate = dueDate;
    }

    setPriority(priority){
        this.priority = priority;
    }

    setNotes(notes){
        this.notes = notes;
    }
}

export default Todo;