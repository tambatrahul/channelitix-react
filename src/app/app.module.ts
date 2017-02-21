import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';

import {BaseComponent} from './shared/components/base.component';
import {NavComponent} from './shared/components/nav.component';
import {HeaderComponent} from './shared/components/header.component';
import {LoginComponent} from './login/login.component';

import {routing} from './app.routes';

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
    routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
