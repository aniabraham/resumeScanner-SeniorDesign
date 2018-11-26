import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ResumeData } from '../resume-data';
import { SearchService } from '../search.service';

import 'jquery';
import 'json2csv';
declare let require: any;
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
		if (this.data === null || this.data === undefined)
			return;
		const jsonParser = require('json2csv').Parser;
		const parser = new jsonParser();

		// this will store the jsons without unnecessary data like path
		let tempData = [];
		let maxEdu = 0;
		let maxExp = 0;

		// check to find the max number of exp and edu in the 
		// selected resumes
		for (let i in this.data) {
			let explen = this.data[i]['experience'].length;
			let edulen = this.data[i]['education'].length;
			if (explen > maxExp)
				maxExp = explen;
			if (edulen > maxEdu)
				maxEdu = edulen;
		}

		this.data.forEach(obj => {
			let tempObj = {};
			tempObj['name'] = obj['name'];
			tempObj['phone'] = obj['phone'];
			tempObj['email'] = obj['email'];
			tempObj['date'] = obj['date'];
			let objExp = obj['experience'];
			let objEdu = obj['education'];

			for (let i = 0; i < maxExp; i++) {
				let attributeString = 'experience' + i;
				tempObj[attributeString] = {};
				if (i < objExp.length) {
					let concatString = objExp[i]['company'] + '; '
						+ objExp[i]['position'];
					tempObj[attributeString] = concatString;
				}
			}

			for (let i = 0; i < maxEdu; i++) {
				let attributeString = 'education' + i;
				tempObj[attributeString] = {};
				if (i < objEdu.length) {
					let concatString = objEdu[i]['university'] + '; '
						+ objEdu[i]['degree'] + '; ' + objEdu[i]['gpa'];
					tempObj[attributeString] = concatString;
				}
			}

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
		this.onRefresh();
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
		if (window.getSelection().toString().length === 0) {
			this.displayedData = data;
			this.select.emit(data);
		}			
	}
}
