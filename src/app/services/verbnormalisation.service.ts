import { Injectable } from '@angular/core';
import { Word } from '../word';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class VerbNormalisationService {

    constructor(private http: Http) {
        console.log('VerbNormalisationService Initialized');
    }
    getWords(): Promise<Word[]> {
        return this.http.get('assets/words.1.json')
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
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

    normalise(verb: string): string {
        this.getWords().then(word => {
            for (let w of word) {
                if (w.conjugation == verb || w.base == verb) {
                    console.log(w.base);
                    return w.base;
                }
            }
        }
        );
        return verb;

    }

}
