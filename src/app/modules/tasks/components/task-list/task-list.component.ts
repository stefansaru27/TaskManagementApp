import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../../../core/services/firestore.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  tasks: any[] = [];

  constructor(private firestoreService: FirestoreService) {}

  ngOnInit(): void {
    this.firestoreService.getTasks().subscribe((tasks) => {
      console.log('Fetched tasks:', tasks); // Log the tasks
      this.tasks = tasks;
    });
  }

  deleteTask(taskId: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.firestoreService
        .deleteTask(taskId)
        .then(() => {
          console.log('Task deleted successfully');
        })
        .catch((error) => {
          console.error('Error deleting task:', error);
        });
    }
  }
}
