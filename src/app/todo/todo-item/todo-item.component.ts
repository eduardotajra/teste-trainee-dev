import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Todo } from '../../shared/models/todo.model';
import { TodoService } from '../../shared/services/todo.service';
import { Filter } from 'bad-words';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() deletedTodo: EventEmitter<number> = new EventEmitter<number>();

  constructor(private todoService: TodoService) {}

  deleteTodo(): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.todoService.deleteTodo(this.todo.id);
    }
  }

  editTodo(): void {
    const newTitle = this.todoService.sharedTaskTitle;

    const filter = new Filter();

    const palavroes = [
      'cu', 'cú', 'porra', 'caralho', 'krl', 'krlh', 'cacete', 'merda',
      'bosta', 'foder', 'fuder', 'foda', 'foda-se', 'fds',
      'arrombado', 'arrombada', 'babaca', 'otario', 'otário', 'idiota', 'imbecil',
      'retardado', 'retardada', 'vagabundo', 'vagabunda', 'puta', 'puto',
      'piranha', 'vadia', 'viado', 'filho da puta', 'fdp',
      'buceta', 'bct', 'pau', 'pinto', 'rola', 'xoxota', 'grelo',
      'siririca', 'boquete', 'punheta', 'brocha', 'xereca', 'xrc'
    ];

    filter.addWords(...palavroes);
    
    if (filter.isProfane(newTitle)) {
      alert("Não é permitido cadastrar tarefas com palavras obscenas.");
      return;
    }

    if (!newTitle || !newTitle.trim() || newTitle == null) {
      alert("Por favor, digite o novo título no campo 'Título da Tarefa' antes de clicar em Editar.");
      return;
    }
    this.todo.title = newTitle;
    this.todoService.updateTodo(this.todo);
  }

  onTaskChecked(): void {
    this.todoService.updateTodo(this.todo);
  }
}
