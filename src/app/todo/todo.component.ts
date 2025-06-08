import { Component, OnInit } from '@angular/core';
import { Todo } from '../shared/models/todo.model';
import { TodoService } from '../shared/services/todo.service';
import { jsPDF } from "jspdf";

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  todos: Todo[] = [];
  showCompletedTasks: boolean = true;

  constructor(private todoService: TodoService) { }

  get visibleTodos(): Todo[] {
    if (this.showCompletedTasks) {
      return this.todos;
    }
    return this.todos.filter(todo => !todo.completed);
  }

  exportToPDF(): void {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Minha Lista de Tarefas", 14, 22);
    doc.setFontSize(11);
    let y = 35;

    this.visibleTodos.forEach((task, index) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }

      const status = task.completed ? '[Concluída]' : '[Pendente]';
      const taskText = `${status} - ${task.title}`;

      doc.text(taskText, 14, y, { maxWidth: 180 });

      y += 10;
    });

    doc.save('lista-de-tarefas.pdf');
  }

  sortTasksAlphabetically(): void {
    this.todos.sort((a, b) => a.title.localeCompare(b.title));
  }

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getTodos().subscribe(todos => {
      this.todos = todos;
    });
  }

  addTodo(newTodoTitle: string) {
    const newTodo: Todo = {
      id: this.todos.length + 1,
      title: newTodoTitle,
      completed: false
    };

    this.todoService.addTodo(newTodo);
  }

  updateTodo(updatedTodo: Todo) {
    this.todoService.updateTodo(updatedTodo);
  }
  
  deleteTodo(todoId: number) {
    this.todoService.deleteTodo(todoId);
  }


  clearAll() {
    if (this.todos.length > 0 && confirm('Are you sure you want to clear all tasks?')) {
      this.todoService.clearAll();
      this.loadTodos();
    }
  }

  clearCompletedTasks() {
    this.todoService.clearCompletedTasks();
    this.loadTodos();
  }

  toggleCompletedTasks() {
    this.showCompletedTasks = !this.showCompletedTasks;
    this.loadTodos();
    this.todos = this.filteredTodos();
  }

  filteredTodos() {
    return this.showCompletedTasks ? this.todos : this.todos.filter(todo => !todo.completed);
  }

  get labelClearAll(){
    return 'Limpar tudo'
  }
}
