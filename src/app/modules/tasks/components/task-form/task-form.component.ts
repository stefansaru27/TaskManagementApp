import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../../../../core/services/firestore.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  priorities = ['Low', 'Medium', 'High'];
  statuses = ['Pending', 'In Progress', 'Completed'];
  assignees = ['Alice', 'Bob', 'Charlie'];
  isEditing = false; // To differentiate between adding and editing
  taskId: string | null = null; // Store the ID for editing
  successMessage = ''; // Success message to show after saving

  constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreService,
    private route: ActivatedRoute
  ) {
    // Initialize the form
    this.taskForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      deadline: ['', Validators.required],
      priority: ['Medium', Validators.required],
      assignee: [''],
      status: ['Pending', Validators.required],
    });
  }

  ngOnInit(): void {
    // Check if the route has an ID parameter for editing
    this.taskId = this.route.snapshot.paramMap.get('id');
    if (this.taskId) {
      this.isEditing = true; // Mark as editing mode
      this.loadTask(this.taskId); // Fetch and populate the form
    }
  }

  // Load task data for editing
  loadTask(id: string): void {
    this.firestoreService.getTaskById(id).subscribe((task) => {
      if (task) {
        this.taskForm.patchValue(task); // Populate the form with task data
      }
    });
  }

  // Handle form submission
  onSubmit(): void {
    if (this.taskForm.valid) {
      const formData = this.taskForm.value;

      if (this.isEditing && this.taskId) {
        // Update an existing task
        this.firestoreService
          .updateTask(this.taskId, formData)
          .then(() => {
            console.log('Task updated successfully');
            this.successMessage = 'Task updated successfully!';
            this.resetForm();
          })
          .catch((error) => {
            console.error('Error updating task:', error);
          });
      } else {
        // Add a new task
        this.firestoreService
          .addTask(formData)
          .then(() => {
            console.log('Task added successfully');
            this.successMessage = 'Task added successfully!';
            this.resetForm();
          })
          .catch((error) => {
            console.error('Error adding task:', error);
          });
      }
    } else {
      console.log('Form is invalid');
    }
  }

  // Reset the form
  resetForm(): void {
    this.taskForm.reset({
      priority: 'Medium',
      status: 'Pending',
    });
    this.taskId = null; // Reset the task ID
    this.isEditing = false; // Reset the editing state
  }
}
