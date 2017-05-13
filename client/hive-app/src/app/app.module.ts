import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ChatComponent } from './components/chat/chat.component';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule, HttpModule ],
  declarations: [ AppComponent, UserComponent, ChatComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
