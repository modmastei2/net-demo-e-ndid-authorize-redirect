import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent], 
    imports: [
        CommonModule,
        FormsModule,
        BrowserModule,
        AppRoutingModule
    ], 
    providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class AppModule { }
