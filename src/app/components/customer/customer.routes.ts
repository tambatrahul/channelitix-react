import {ModuleWithProviders} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {CustomerComponent} from "./views/index.component";


// Route Configuration
export const customerRoutes: Routes = [
    {path: '', component: CustomerComponent}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(customerRoutes);
