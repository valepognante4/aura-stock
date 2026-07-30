import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastContainerComponent } from './components/ui/toast-container/toast-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, ToastContainerComponent],
  templateUrl: './app.html',
  styleUrls: []
})
class AppComponent {}

export { AppComponent };