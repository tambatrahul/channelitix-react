import {ModuleWithProviders} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {AttendanceComponent} from "./views/index.component";


// Route Configuration
export const attendanceRoutes: Routes = [
  {path: '', component: AttendanceComponent}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(attendanceRoutes);
