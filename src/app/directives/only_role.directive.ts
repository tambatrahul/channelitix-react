import {AuthService} from '../services/AuthService';
import {Directive, Input, TemplateRef, ViewContainerRef} from "@angular/core";
import {AppConstants} from "../app.constants";


@Directive({
  selector: '[onlyRoleCheck]'
})
export class OnlyRoleCheckDirective {

  /**
   * Customer Status Directive
   *
   * @param templateRef
   * @param viewContainer
   * @param authService
   */
  constructor(private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef,
              private authService: AuthService) {

  }

  /**
   * Input for directive
   */
  @Input()
  set onlyRoleCheck(role: string) {
    let role_id = AppConstants.getRoleId(role);
    if (this.authService.user && this.authService.user.role_id == role_id) {
      // If condition is true add template to DOM
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      // Else remove template from DOM
      this.viewContainer.clear();
    }
  }
}
