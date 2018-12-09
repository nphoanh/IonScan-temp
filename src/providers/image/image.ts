import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ImageProvider {

	constructor(public http: HttpClient) {
		console.log('Hello ImageProvider Provider');
	}

	apiUrl = 'https://jsonplaceholder.typicode.com';

	addImage(data) {
		return new Promise((resolve, reject) => {
			this.http.post(this.apiUrl+'/photos', JSON.stringify(data), {
				headers: new HttpHeaders().set('Authorization', 'my-auth-token'),				
				params: new HttpParams().set('id', '3'),
			})
			.subscribe(res => {
				resolve(res);
			}, (err) => {
				reject(err);
			});
		});
	}

}
