import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileDetailsComponent } from './components/profile-details/profile-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileRoutingModule } from './profile-routing.module';

@NgModule({
  declarations: [ProfileDetailsComponent],
  imports: [CommonModule, ReactiveFormsModule, ProfileRoutingModule],
})
export class ProfileModule {}
