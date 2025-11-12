import { Routes } from '@angular/router';
import {MainScreen} from './main-screen';

export const routes: Routes = [
  {
    path: "",
    component: MainScreen
  },
  {
    path: "**",
    redirectTo: ""
  }
];
