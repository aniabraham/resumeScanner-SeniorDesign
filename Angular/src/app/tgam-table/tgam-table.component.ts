import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-tgam-table',
	templateUrl: './tgam-table.component.html',
	styleUrls: ['./tgam-table.component.css']
})
export class TGamTableComponent implements OnInit {

	private currentPath: any;
	@Output() notify: EventEmitter<string> = new EventEmitter<string>();

	private pdfLinks: JSON;

	constructor() { }

	ngOnInit() { }

	onSelect(path: string): void {

		this.notify.emit(path);
	}

}
