import { Component, OnInit } from '@angular/core';
import { Todo } from '../shared/models/todo.model';
import { TodoService } from '../shared/services/todo.service';
import { jsPDF } from "jspdf";
import Swal from 'sweetalert2';

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
    if (this.todos.length > 0) {
      Swal.fire({
        title: 'Limpar Tudo?',
        text: "Você tem certeza que quer remover TODAS as tarefas? Esta ação não pode ser desfeita.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, limpar tudo!',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d33'
      }).then((result) => {
        if (result.isConfirmed) {
          this.todoService.clearAll();
          this.loadTodos();
          Swal.fire('Tudo limpo!', 'Sua lista de tarefas está vazia.', 'success');
        }
      });
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
