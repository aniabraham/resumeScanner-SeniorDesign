import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { GetLinkService } from "../get-link.service";

@Component({
	selector: 'app-tgam-table',
	templateUrl: './tgam-table.component.html',
	styleUrls: ['./tgam-table.component.css'],
	providers: [GetLinkService]
})
export class TGamTableComponent implements OnInit {

	private currentPath: any;
	@Output() notify: EventEmitter<string> = new EventEmitter<string>();

	private pdfLinks: JSON;

	constructor(private getLinkService: GetLinkService) { }

	ngOnInit() {

		this.getLinkService.getLinks().then(pdfLinks => this.pdfLinks = pdfLinks);
	}

	onSelect(path: string): void {

		this.notify.emit(path);
	}

}
