import { AuthService } from './../services/AuthService';
import { Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";


@Directive({
  selector: '[roleCheck]'
})
export class RoleCheckDirective {

  /**
   * Customer Status Directive
   *
   * @param el
   */
  constructor(private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService) {

  }

/**
 * Input for directive
 */
  @Input()
  set roleCheck(role_id: number) {
    if (this.authService.user.role_id >= role_id ) {
      // If condition is true add template to DOM
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      // Else remove template from DOM
      this.viewContainer.clear();
    }
  }
}
