// tasks-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskFormComponent } from './components/task-form/task-form.component';

const routes: Routes = [
  {
    path: '',
    component: TaskListComponent, // Displays the task list
  },
  {
    path: 'add',
    component: TaskFormComponent, // Displays the add task form
  },
  {
    path: ':id',
    component: TaskFormComponent, // Displays the task form for editing
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TasksRoutingModule {}
