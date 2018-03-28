import { Component, OnInit, Input } from '@angular/core';
import { ResumeData } from '../resume-data'

@Component({
  selector: 'app-resume-viewer',
  templateUrl: './resume-viewer.component.html',
  styleUrls: ['./resume-viewer.component.css']
})
export class ResumeViewerComponent implements OnInit {

	@Input() resume: ResumeData;
	@Input() path: any;


  	constructor() { }

  	ngOnInit() {
	}
}
