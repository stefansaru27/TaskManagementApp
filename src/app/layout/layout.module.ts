import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Import RouterModule

import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { MainComponent } from './main/main.component';

@NgModule({
  declarations: [HeaderComponent, SidenavComponent, MainComponent],
  imports: [
    CommonModule,
    RouterModule, // Add RouterModule here
  ],
  exports: [HeaderComponent, SidenavComponent, MainComponent],
})
export class LayoutModule {}
