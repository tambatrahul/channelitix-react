import {ModuleWithProviders} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {LoginComponent} from "./components/login.component";

// Route Configuration
export const loginRoutes: Routes = [
  {path: 'login', component: LoginComponent}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(loginRoutes);
