import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppComponent} from "./app.component";

// base
import {BaseComponent} from "./shared/base/base.component";
import {NavComponent} from "./shared/base/nav.component";
import {HeaderComponent} from "./shared/base/header.component";
import {LoginComponent} from "./login/components/login.component";

// attendance module
import {AttendanceModule} from "./components/attendance/attendance.module";

// user module
import {UserModule} from "./user/user.module";

// login module
import {LoginModule} from "./login/login.module";

// customer module
import {CustomerModule} from "./components/customer/customer.module";
import {routing} from "./app.routes";

@NgModule({
  declarations: [
    AppComponent,
    BaseComponent,
    NavComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpModule,
    AttendanceModule,
    UserModule,
    LoginModule,
    CustomerModule,
    routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
