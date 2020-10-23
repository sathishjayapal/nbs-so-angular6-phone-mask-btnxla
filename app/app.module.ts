import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { InputPhoneComponent } from './input-phone/input-phone.component';

@NgModule({
  imports:      [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    AppComponent,
    InputPhoneComponent
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { 

}
