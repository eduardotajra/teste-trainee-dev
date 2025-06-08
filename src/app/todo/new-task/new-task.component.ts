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
    const newTodo: Todo = {
      id: this.todoService.getTodoNewId(),
      title: this.newTaskTitle,
      completed: false
    };

    this.todoService.addTodo(newTodo);
    this.newTaskTitle = '';
  }
}
