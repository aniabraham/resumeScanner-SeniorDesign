import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ResumeData } from '../resume-data';
import { SearchService } from '../search.service';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

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

	data: Observable<ResumeData[]>;
	private searchTerms = new Subject<string>();
	private displayedData: ResumeData;
	private type: string = 'name';
	

	ngOnInit() {
		this.data = this.searchTerms.debounceTime(200)
			.distinctUntilChanged()
			.switchMap(term => term
			? this.searchService.search(term, this.type)
			: Observable.of<ResumeData[]>([]))
			.catch(error => {
				console.log(error);
				return Observable.of<ResumeData[]>([]);
			});
	}

	search(term: string): void {
		this.searchTerms.next(term);
	}

	displayData(data: ResumeData): void {
		this.displayedData = data;
		this.select.emit(data);
	}

	searchBy(type: string): void {
		this.type = type;
		this.search('');
	}
}
