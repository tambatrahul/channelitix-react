import { Model } from './../../../models/model';
import {Input, Output, EventEmitter} from "@angular/core";

export abstract class BaseSelectComponent {

  /**
   * selected value
   */
  @Input()
  value: number = 0;

  /**
   * title for select field
   */
  title: string;

  /**
   * First value text
   */
  first_value: string = "All";

  /**
   * event on value changed
   *
   * @type {EventEmitter}
   */
  @Output()
  onValueChanged = new EventEmitter();

  /**
   * event on model changed
   *
   * @type {EventEmitter}
   */
  @Output()
  onModelChanged = new EventEmitter<Model>();
  /**
   * model list
   *
   * @type {Array}
   */
  public models: Model[] = [];


  /**
   * loading for server call
   * @type {boolean}
   */
  protected loading: boolean = false;

  /**
   * on load of component load territories
   */
  ngOnInit() {
    this.fetch();
  }

  /**
   * load on start
   */
  abstract fetch();

  /**
   * Value changed
   */
  onValueChange(value) {
    this.value = value;
    this.onValueChanged.emit(value);
    this.onModelChanged.emit(this.models.filter(model => model.id == value)[0]);
  }
}
