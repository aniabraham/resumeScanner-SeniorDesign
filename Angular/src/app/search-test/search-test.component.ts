import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ResumeData } from '../resume-data';
import { SearchService } from '../search.service';

import 'jquery';
declare let $: any;

@Component({
	selector: 'app-search-test',
	templateUrl: './search-test.component.html',
	styleUrls: ['./search-test.component.css'],
	providers: [SearchService]
})
export class SearchTestComponent implements OnInit {

	constructor(private searchService: SearchService) { }

	@Output() select: EventEmitter<ResumeData> = new EventEmitter<ResumeData>();

	data: ResumeData[];
	private displayedData: ResumeData;
	private type: string = 'name';

	private searchBoxes = {
		'name': '#nameSearch',
		'keywords': '#skillSearch',
		'education.gpa': '#gpaSearch'
	};
	

	ngOnInit() {
	}

	onSearch(): void {
		// take parameters from search inputs
		let searchParams = {};

		for (var i in this.searchBoxes) {
			if ($(this.searchBoxes[i]).val() !== '')
				searchParams[i] = $(this.searchBoxes[i]).val();
		}

		if (searchParams['keywords'] !== undefined)
			searchParams['keywords'] = searchParams['keywords'].split(',');

		this.searchService.search(searchParams).then(results => {
			this.data = results;
		});
	}

	displayData(data: ResumeData): void {
		this.displayedData = data;
		this.select.emit(data);
	}
}
