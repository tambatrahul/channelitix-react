import {ModuleWithProviders} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {UserComponent} from "./index.component";


// Route Configuration
export const userRoutes: Routes = [
    {path: '', component: UserComponent}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(userRoutes);
