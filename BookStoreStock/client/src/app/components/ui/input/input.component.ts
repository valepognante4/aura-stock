import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <div class="flex flex-col w-full">
      <label *ngIf="label" class="text-[12px] font-medium text-txt-sub mb-[6px]">{{ label }}</label>
      <div class="relative flex items-center">
        <input 
          [type]="type === 'password' && showPassword ? 'text' : type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [(ngModel)]="value"
          (ngModelChange)="onChange($event)"
          (blur)="onTouched()"
          [ngClass]="[
            'w-full bg-page text-txt-primary border border-border rounded-lg px-[14px] py-[11px]',
            'focus:outline-none focus:border-accent transition-colors duration-150',
            type === 'password' ? 'pr-[42px]' : ''
          ]"
        />
        <button 
          *ngIf="type === 'password'" 
          type="button"
          class="absolute right-[14px] text-txt-sub hover:text-txt-primary transition-colors"
          (click)="togglePassword()">
          <span *ngIf="!showPassword">👁️</span>
          <span *ngIf="showPassword">👁️‍🗨️</span>
        </button>
      </div>
    </div>
  `
})
export class InputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  
  value: string = '';
  disabled: boolean = false;
  showPassword: boolean = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(val: string): void {
    this.value = val;
  }
  
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
