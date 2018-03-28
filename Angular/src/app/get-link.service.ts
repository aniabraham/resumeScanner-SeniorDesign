import { Injectable } from '@angular/core';

// Would eventually make http request or something
declare let require: any
@Injectable()
export class GetLinkService {

	constructor() {}

	getLinks(): Promise<JSON> { 

		// this needs to be in the same folder as the root of the angular project
		var file = require('../../files.json');

		return Promise.resolve(file);
	}
}
