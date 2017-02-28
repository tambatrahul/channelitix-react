import {ViewChild, ElementRef} from "@angular/core";
import {AuthService} from "../../services/AuthService";
import {User} from "../../models/user/user";
declare let jQuery: any;


export abstract class BaseComponent {

  /**
   * loading identifier
   */
  @ViewChild('loading_box')
  loading_table: ElementRef;

  /**
   * logged in user
   */
  public user: User;

  /**
   * loading variable
   */
  protected _loading: boolean;

  /**
   * Base Component Constructor
   * @param _service
   */
  constructor(public _service: AuthService) {
    this.user = this._service.user;
  }

  /**
   * on load of component call this function
   */
  ngOnInit() {
    this._service.checkCredentials();
  }

  /**
   * loading setter
   */
  set loading(loading) {
    this._loading = loading;
    if (loading)
      jQuery(this.loading_table.nativeElement).mask('loading');
    else
      jQuery(this.loading_table.nativeElement).unmask();
  }

  /**
   * loading getter
   * @returns {boolean}
   */
  get loading() {
    return this._loading;
  }
}
