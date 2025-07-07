import { Injectable } from '@angular/core';
import { Task, TaskStatus } from '../models/task.model';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private tasks: Task[] = [];

  private nextId = 1;

  constructor() { }

  getTasks(): Observable<Task[]> {
    return of(this.tasks);
  }

  getTask(id: number): Observable<Task> {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      return of(task);
    }
    return throwError(() => new Error('Task not found'));
  }

  addTask(taskData: { title: string; description?: string }): Observable<Task> {
    const newTask: Task = {
      id: this.nextId++,
      title: taskData.title,
      description: taskData.description,
      status: 'pending'
    };
    this.tasks.push(newTask);
    return of(newTask);
  }

  deleteTask(id: number): Observable<void> {
    const taskIndex = this.tasks.findIndex(t => t.id === id);
    if (taskIndex > -1) {
      this.tasks.splice(taskIndex, 1);
      return of(undefined);
    }
    return throwError(() => new Error('Task not found'));
  }

  updateTaskStatus(id: number, status: TaskStatus): Observable<Task> {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.status = status;
      return of(task);
    }
    return throwError(() => new Error('Task not found'));
  }
}
