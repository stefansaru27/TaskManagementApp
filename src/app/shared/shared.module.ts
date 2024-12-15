import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [
    // Add reusable components, directives, and pipes here
  ],
  imports: [CommonModule, MaterialModule],
  exports: [
    MaterialModule, // Export MaterialModule for use in other modules
    // Export components, directives, and pipes as needed
  ],
})
export class SharedModule {}
