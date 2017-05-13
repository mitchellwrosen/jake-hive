import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from './chat.service';

@Component({
  selector: 'chat-component',
  templateUrl: 'chat.component.html',
  providers: [ChatService]
})
export class ChatComponent implements OnInit, OnDestroy {
  messages = [];
  connection;
  message;

  @Output('serverData') outgoingData = new EventEmitter<any>();

  constructor(private chatService: ChatService) {
  }

  sendMessage() {
    this.chatService.sendMessage(this.message);
    this.message = '';
  }

  sendServerMessage(message) {
    this.chatService.sendMessage(message);
  }

  ngOnInit() {
    this.connection = this.chatService.getMessages().subscribe(message => {
      this.messages[0] = message;
      this.outgoingData.emit(message);
    })
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }
}
