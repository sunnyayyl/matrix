import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatToolbar} from '@angular/material/toolbar';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbar, NgOptimizedImage],
  template: `
    <div class="flex flex-col h-full">
    <mat-toolbar>
      <a href="">
        <img ngSrc="favicon.ico" alt="logo" width="30" height="30" priority>
      </a>
    </mat-toolbar>
    <router-outlet/>
    </div>
  `,
})
export class App {
  protected readonly title = signal('matrix');
}
