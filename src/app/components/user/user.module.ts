import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {UserComponent} from "./views/index.component";

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
    declarations: [
        UserComponent,
    ],
    providers: [
        UserService,
    ],
    exports: [
        UserComponent,
    ]
})
export class UserModule {
}
