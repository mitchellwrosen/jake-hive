import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {

	@Output('childData') outgoingData = new EventEmitter<string>();

	onClick(event, value) {
		console.log(event);
		console.log(value);
		this.outgoingData.emit(value);
	}

	constructor() {
	}
}
