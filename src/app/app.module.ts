import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HomePage } from './pages/home/home.page';

import '../theme/styles.scss';

@NgModule({
  declarations: [
    AppComponent,
    HomePage
  ],
  imports: [
    BrowserModule
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
