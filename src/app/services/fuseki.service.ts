import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';
import { Complete } from '../fuseki';
import { FusekiResult } from '../entity';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class FusekiService {

    constructor(private http: Http) {
        console.log('FusekiService Initialized');
    }

    /*
    Sends a SPQARL Query to Fuseki Server
    */
    sendSparqlQuery(query:string): Promise<Complete[]>{
        let headers = new Headers({'Accept': 'application/sparql-results+json,*/*;q=0.9'});
        headers.append('X-Requested-With', 'XMLHttpRequest');
        
        headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        let options = new RequestOptions({headers:headers});
    
        //return this.http.post('http://192.168.99.100:3030/tdb/query', 'query=' + query, 
       // options).toPromise().then(this.extractData);
       let results:Array<Object>;
       return this.http.post('http://192.168.99.100:3030/tdb/query', 'query=' + query, 
       options).toPromise().then(this.extractData).catch(this.handleError);
   
    }

    getEntitys(query:string):Promise<FusekiResult>{
        let headers = new Headers({'Accept': 'application/sparql-results+json,*/*;q=0.9'});
        headers.append('X-Requested-With', 'XMLHttpRequest');
        
        headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        let options = new RequestOptions({headers:headers});
    
        //return this.http.post('http://192.168.99.100:3030/tdb/query', 'query=' + query, 
       // options).toPromise().then(this.extractData);
       let results:Array<Object>;
       return this.http.post('http://192.168.99.100:3030/tdb/query', 'query=' + query, 
       options).toPromise().then(this.extractData).catch(this.handleError);

    }

    private extractData(res: Response) {
        let body = res.json();
        return body;
    }
    private handleError(error: any): Promise<any> {
        console.log("LOL");
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
