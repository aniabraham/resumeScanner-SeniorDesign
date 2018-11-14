import { Component, OnInit, Input, Output, AfterViewChecked, EventEmitter, 
	AfterViewInit } from '@angular/core';
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
	// actually an image file
	@Input() path: string;
	private resumeImage = null;
	private forms = ['name', 'phone', 'email'];


  	constructor(private searchService: SearchService) {}
	
	ngAfterViewChecked() {
		/*this.searchService.getImage(this.path).then(image => {
			if (image)
				this.resumeImage = bypassSanitizationTrustResourceUrl(
					"data:image/jpeg;base64,/" + image
				);

			console.log(image);
		});*/
		this.populateForms();
	}

	ngAfterViewInit() {
		//this.populateForms();
	}

	private onCancel(): void {
		$(':input').val('');
	}

	private onConfirm(): void {
		let params = {};

		for (let i = 0; i < this.forms.length; i++) {
			params[this.forms[i]] = $('#' + this.forms[i]).val();
		}

		params['id'] = this.resume._id;

		console.log(params);
		//this.searchService.update(params);
	}

	private populateForms(): void {
		for (let key in this.resume) {
			if (key === 'education' || key === 'experience') {
				for (let i in this.resume[key]) {
					for (let subkey in this.resume[key][i]) {

						$('#' + subkey + '' + i)
							.val(this.resume[key][i][subkey]);
					}
				}
			}

			else if (key === 'keywords') {
				for (let keyword in this.resume[key]) {
					$('#keywords' + keyword).val(this.resume[key][keyword]);
				}
			}

			else {
				$('#' + key).val(this.resume[key]);
			}
		}
	}

  	ngOnInit() {
	}
}
