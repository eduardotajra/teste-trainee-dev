import { Component } from '@angular/core';
import { Todo } from '../../shared/models/todo.model';
import { TodoService } from 'src/app/shared/services/todo.service';

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
      alert("O título da tarefa não pode estar em branco.");
    }
  }
}
