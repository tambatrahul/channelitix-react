import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {UserComponent} from "./index.component";
import {UserService} from "../../services/user.service";

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
