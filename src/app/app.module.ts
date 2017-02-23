import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppComponent} from "./app.component";

// base
import {BaseComponent} from "./shared/base/base.component";
import {NavComponent} from "./shared/base/nav.component";
import {HeaderComponent} from "./shared/base/header.component";
import {LoginComponent} from "./login/login.component";

// attendance module
import {AttendanceModule} from "./components/attendance/attendance.module";

// user module
import {UserModule} from "./components/user/user.module";

// customer module
import {CustomerModule} from "./components/customer/customer.module";

import {routing} from "./app.routes";

@NgModule({
  declarations: [
    AppComponent,
    BaseComponent,
    NavComponent,
    HeaderComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AttendanceModule,
    UserModule,
    CustomerModule,
    routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
