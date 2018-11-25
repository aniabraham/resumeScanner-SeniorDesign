import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ResumeData } from '../resume-data';
import { SearchService } from '../search.service';

import 'jquery';
import 'json2csv';
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
	private sortType: string = '';
	private ascending: boolean = true;
	private ascendingString: string = 'Ascending';

	private searchBoxes = {
		'name': '#nameSearch',
		'email': '#emailSearch',
		'keywords': '#skillSearch',
		'education.gpa': '#gpaSearch'
	};

	private createCompare = function(compareObj) {
		return function(a: ResumeData, b: ResumeData) {

			if (a[compareObj] < b[compareObj])
				return -1;
			if (a[compareObj] > b[compareObj])
				return 1;
			return 0;
		}
	}

	// we need to handle the cases for experience and gpa
	// where we will simply take the total
	// would otherwise probably want to implement
	private nestedCompare = function(compareList, compareObj) {

		return function(a: ResumeData, b: ResumeData) {

			let totalA = 0;
			let totalB = 0;
			let end = Math.max(a[compareList].length, b[compareList].length);
			for (let i = 0; i < end; i++) {
				// resumeData array, index of array, property in object
				if (a[compareList][i])
					totalA += a[compareList][i][compareObj];
				if (b[compareList][i])
					totalB += b[compareList][i][compareObj];
			}

			if (totalA < totalB)
				return -1;
			if (totalA > totalB)
				return 1;
			return 0;
		}
	}

	private sortMethods = {
		'Name': this.createCompare('name'),
		'Email': this.createCompare('email'),
		'GPA': this.nestedCompare('education', 'gpa'),
		'Experience': this.nestedCompare('experience', 'totalExperience'),
		'Date': this.createCompare('date')
	}
	

	ngOnInit() {
		this.sortType = 'None'
	}

	onClear(): void {
		this.data = null;
	}

	onExport(): void {
		const jsonParser = require('json2csv').Parser;
		const parser = new jsonParser();

		// this will store the jsons without unnecessary data like path
		let tempData = [];

		this.data.forEach(obj => {
			let tempObj = {};
			tempObj['name'] = obj['name'];
			tempObj['phone'] = obj['phone'];
			tempObj['email'] = obj['email'];
			tempObj['education'] = obj['education'];
			tempObj['experience'] = obj['experience']
			tempObj['date'] = obj['date'];

			tempData.push(tempObj);
		});

		let csv = parser.parse(tempData);
		this.download(csv);
	}

	download(data: any): void {
		let blob = new Blob([data], {type: 'text/csv'});
		let url = window.URL.createObjectURL(blob);

		let a = document.createElement('a');
		a.setAttribute('hidden', '');
		a.setAttribute('href', url);
		a.setAttribute('download', 'export.csv');
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}

	onRefresh(): void {
		this.data = null;
		this.onSearch();
	}

	onDelete(deleteId: object): void {
		this.searchService.delete(deleteId);
	}

	onSortChange(): void {
		if (this.ascending) {
			this.ascending = false;
			this.ascendingString = 'Descending';
		}
		else {
			this.ascending = true;
			this.ascendingString = 'Ascending';
		}
		if (this.data)
			this.data.reverse();
	}

	onSort(newSort: string): void {

		if (newSort === 'None')
			return;
		this.sortType = newSort;

		this.data.sort(this.sortMethods[newSort]);

		if (!this.ascending)
			this.data.reverse();
	}

	public onSearch(): void {
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

			this.onSort(this.sortType);
		});
	}

	displayData(data: ResumeData): void {
		this.displayedData = data;
		this.select.emit(data);
	}
}
