import { Component, forwardRef, OnInit, Input, Output, EventEmitter, Injector, HostListener, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, NG_VALUE_ACCESSOR, ControlValueAccessor, NgControl } from '@angular/forms';

export interface ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean;
}

export class CustomFieldErrorMatcher implements ErrorStateMatcher {
  constructor(private customControl: FormControl, private errors: any) { }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return this.customControl && this.customControl.touched && (this.customControl.invalid || this.errors);
  }
}

@Component({
  selector: 'app-input-phone',
  templateUrl: './input-phone.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputPhoneComponent),
      multi: true
    }
  ]
})

export class InputPhoneComponent implements OnInit, ControlValueAccessor {
  disabled: boolean;
  control: FormControl;
  @Input() MaxLength: string;
  @Input() ReadOnly: boolean;
  @Input() value: string;
  @Input() type: string;
  @Input() Label: string;
  @Input() PlaceHolder: string;
  @Output() saveValue = new EventEmitter();
  @Output() stateChange = new EventEmitter();
  @Input() errors: any = null;
  @ViewChild('input') inputViewChild: ElementRef;

  readonly errorStateMatcher: ErrorStateMatcher = {
    isErrorState: (ctrl: FormControl) => (ctrl && ctrl.invalid)
  };

  constructor(public injector: Injector) { }
  ngOnInit() { }

  saveValueAction(e: any) { this.saveValue.emit(e.target.value); }
  writeValue(value: any) {
    this.value = value ? value : '';
    if (this.inputViewChild && this.inputViewChild.nativeElement) {
      if (this.value === undefined || this.value == null) {
        this.inputViewChild.nativeElement.value = '';
      } else {
        const maskValue = this.convertToMaskValue(this.value, false);
        this.inputViewChild.nativeElement.value = maskValue;
      }
    }
  }

  onModelChange: Function = () => { };
  onChange(e) { this.value = e; }
  onTouched() { this.stateChange.emit(); }

  registerOnChange(fn: () => void): void {
    this.onModelChange = fn;
  }
  registerOnTouched(fn: any) { this.onTouched = fn; }
  setDisabledState(isDisabled) { this.disabled = isDisabled; }

  errorMatcher() {
    return new CustomFieldErrorMatcher(this.control, this.errors);
  }

  onInputChange(event) {
    setTimeout(() => {
      const maskValue = this.convertToMaskValue(event.target.value, event.inputType === 'deleteContentBackward');
      this.inputViewChild.nativeElement.value = maskValue;
      this.value = this.convertToRealValue(maskValue);
      this.onModelChange(this.value);
    }, 0);
  }

  private convertToMaskValue(value: string, backspace: boolean): string {
    let newVal = value;
    if (newVal && newVal.length > 0) {
      if (backspace && value.length <= 12) {
        newVal = value.substring(0, value.length - 1);
      }
      newVal = this.convertToRealValue(newVal);
      if (newVal.length === 0) {
        newVal = '';
      } else if (newVal.length <= 3) {
        newVal = newVal.replace(/^(\d{0,3})/, '($1)');
      } else if (newVal.length <= 6) {
        newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, '($1) ($2)');
      } else if (newVal.length <= 10) {
        newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) ($2)-$3');
      } else {
        newVal = newVal.substring(0, 10);
        newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) ($2)-$3');
      }
    }
    return newVal;
  }

  private convertToRealValue(value: string): string {
    return value.replace(/\D/g, '');
  }
}
