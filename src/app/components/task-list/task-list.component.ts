import { Component, OnInit } from '@angular/core';
import { Task, TaskStatus } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { Observable, combineLatest, startWith } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks$!: Observable<Task[]>;
  taskForm: FormGroup;
  searchControl = new FormControl('');
  isFormVisible = false;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  toggleForm(): void {
    this.isFormVisible = !this.isFormVisible;
  }

  loadTasks(): void {
    const allTasks$ = this.taskService.getTasks();
    const searchTerm$ = this.searchControl.valueChanges.pipe(
      startWith('')
    );

    this.tasks$ = combineLatest([allTasks$, searchTerm$]).pipe(
      map(([tasks, searchTerm]) => {
        const term = searchTerm?.toLowerCase() ?? '';
        if (!term) {
          return tasks;
        }
        return tasks.filter(task =>
          task.title.toLowerCase().includes(term) ||
          task.description?.toLowerCase().includes(term)
        );
      })
    );
  }

  deleteTask(id: number, event: Event): void {
    event.stopPropagation();
    this.taskService.deleteTask(id).subscribe(() => {
      // The observable stream will automatically update the list
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.taskService.addTask(this.taskForm.value).subscribe(() => {
        this.taskForm.reset();
        this.isFormVisible = false;
        // The observable stream will automatically update the list
      });
    }
  }

  navigateToDetail(id: number, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/tasks', id]);
  }

  onStatusChange(change: MatSlideToggleChange, task: Task) {
    const newStatus: TaskStatus = change.checked ? 'completed' : 'pending';
    this.taskService.updateTaskStatus(task.id, newStatus).subscribe();
  }
}
