import { Component, OnInit, Input, Output, AfterViewChecked, EventEmitter, 
	AfterViewInit, ChangeDetectorRef, OnDestroy} from '@angular/core';
import { ResumeData } from '../resume-data';
import { SearchService } from '../search.service';
import 'jquery';

declare let $: any;

@Component({
  selector: 'app-resume-viewer',
  templateUrl: './resume-viewer.component.html',
  styleUrls: ['./resume-viewer.component.css'],
  providers: [SearchService]
})
export class ResumeViewerComponent implements OnInit {

	@Input() resume: ResumeData;
	@Output() update: EventEmitter<void> = new EventEmitter<void>();
	@Output() send: EventEmitter<void> = new EventEmitter<void>();
	@Output() delete: EventEmitter<object> = new EventEmitter<object>();
	// actually an image file
	@Input() path: string;
	private resumeImage = null;
	private resumeCopy: ResumeData;
	private forms = ['name', 'phone', 'email'];
	private popForms: boolean = true;
	private removeEdu = [];
	private removeExp = [];

	constructor(private searchService: SearchService,
				private ref: ChangeDetectorRef) {}admin

	ngAfterViewInit() {
		if (this.popForms) {
			this.populateForms();
			this.popForms = false;
		}
	}

	ngOnDestroy() {
		this.popForms = true;
	}

	private onCancel(): void {
		//$(':input').val('');
		this.update.emit(null);
	}

	private onDeleteResume(): void {
		let idObject = {};
		idObject["_id"] = this.resume["_id"];

		this.delete.emit(idObject);
		this.update.emit(null);
	}
	
	private addNew(type: string): void {
		let actions = {
			'keywords': function() {
				let temp = ""; 
				return temp;
			},
			'education': function() {
				let temp = {};
				temp['degree'] = '';
				temp['gpa'] = 0;
				temp['university'] = '';
				temp['_id'] = 'add';
				temp['year'] = 0;

				return temp;
			},
			'experience': function() {
				let temp = {};
				temp['company'] = '';
				temp['position'] = '';
				temp['totalExperience'] = 0;
				temp['_id'] = 'add';

				return temp;
			}
		}

		this.resumeCopy[type].push(actions[type]());
		this.ref.detectChanges();
	}

	private onDelete(type: string, index: number) {
		let deleteId = this.resumeCopy[type][index]['_id'];
		if (type === 'education')
			this.removeEdu.push(deleteId);
		if (type === 'experience')
			this.removeExp.push(deleteId);
		this.resumeCopy[type].splice(index, 1);
		this.ref.detectChanges();
	}

	private onConfirm(): void {
		let params = {};

		for (let i = 0; i < this.forms.length; i++) {
			params[this.forms[i]] = $('#' + this.forms[i]).val();
		}

		params['education'] = [];
		params['experience'] = [];
		params['keywords'] = [];

		for (let key in this.resumeCopy['keywords']) {
			params['keywords'].push($('#keywords' + key).val());
		}

		for (let key in this.resumeCopy['education']) {
			let temp = {};
			temp['gpa'] = $('#gpa' + key).val()
			temp['year'] = $('#year' + key).val()
			temp['degree'] = $('#degree' + key).val()
			temp['university'] = $('#university' + key).val()
			temp['_id'] = this.resumeCopy['education'][key]._id;

			params['education'].push(temp);
		}

		for (let key in this.resumeCopy['experience']) {
			let temp = {};
			temp['company'] = $('#company' + key).val()
			temp['position'] = $('#position' + key).val()
			temp['totalExperience'] = $('#totalExperience' + key).val()
			temp['_id'] = this.resumeCopy['experience'][key]._id;

			params['experience'].push(temp);
		}

		params['_id'] = this.resumeCopy._id;
		if (this.removeEdu.length > 0)
			params['removeEdu'] = this.removeEdu;
		if (this.removeExp.length > 0)
			params['removeExp'] = this.removeExp;
		
		this.searchService.update(params);

		console.log(params);
		// give the server time to process the update
		// then renew the search values.
		let timeout = function(emitter: EventEmitter<void>) {
			emitter.emit(null);
		}
		setTimeout(timeout(this.send), 200);
		this.update.emit(null);
	}

	private populateForms(): void {
		for (let key in this.resumeCopy) {
			if (key === 'education' || key === 'experience') {
				for (let i in this.resumeCopy[key]) {
					for (let subkey in this.resumeCopy[key][i]) {

						$('#' + subkey + '' + i)
							.val(this.resumeCopy[key][i][subkey]);
					}
				}
			}

			else if (key === 'keywords') {
				for (let keyword in this.resumeCopy[key]) {
					$('#keywords' + keyword).val(this.resumeCopy[key][keyword]);
				}
			}

			else {
				$('#' + key).val(this.resumeCopy[key]);
			}
		}
	}

  	ngOnInit() {
		this.resumeImage = this.path;
		this.resumeCopy = JSON.parse(JSON.stringify(this.resume));
	}
}
