import { Component } from '@angular/core';
import { Todo } from '../../shared/models/todo.model';
import { TodoService } from 'src/app/shared/services/todo.service';
import { Filter } from 'bad-words';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css']
})
export class NewTaskComponent {
  newTaskTitle: string = '';

  constructor(private todoService: TodoService) { }

  count = 0;
  updateSharedTitle(newTaskTitle: string) {
    this.todoService.sharedTaskTitle = newTaskTitle;
  }

  addTask() {

  if (this.newTaskTitle && this.newTaskTitle.trim()) {
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

    if (filter.isProfane(this.newTaskTitle)) {
      Swal.fire({
        icon: 'warning',
        title: 'Conteúdo Inválido',
        text: 'Não é permitido cadastrar tarefas com palavras obscenas.'
      });
      return;
    }

    const trimmedInput = this.newTaskTitle.trim();

    if (trimmedInput.includes('|')) {
      const titles = trimmedInput.split('|');

      titles.forEach(titlePart => {
        const finalTitle = titlePart.trim();
        if (finalTitle) {
          const newTodo: Todo = {
            id: this.todoService.getTodoNewId(),
            title: finalTitle,
            completed: false
          };
          this.todoService.addTodo(newTodo);
        }
      });
    } else {
      const newTodo: Todo = {
        id: this.todoService.getTodoNewId(),
        title: trimmedInput,
        completed: false
      };
      this.todoService.addTodo(newTodo);
    }

    this.newTaskTitle = '';

  } else {
    Swal.fire({
      icon: 'error',
      title: 'Campo Vazio',
      text: 'O título da tarefa não pode estar em branco.'
    });
  }
}
}
