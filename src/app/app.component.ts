import { Component } from '@angular/core';
import { FusekiService } from './services/fuseki.service';
import { VerbNormalisationService } from './services/verbnormalisation.service';
import { ChangeDetectorRef } from '@angular/core';
import { NgZone } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { Word } from './word';
import { OnInit } from '@angular/core';
import { FusekiResult } from './entity';
import { Complete } from './fuseki';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  words: Word[];
  public result: any = {
    header: [{ title: 'Test', name: 'test' }],
    data: []
  };
  public rows: Array<any> = [];
  public columns: Array<any> = [
    { title: 'Name', name: 'name' },
    { title: 'Office', name: 'office' }
  ];
  public page: number = 1;
  public itemsPerPage: number = 10;
  public maxSize: number = 5;
  public numPages: number = 1;
  public length: number = 0;

  public config: any = {
    paging: true,
    sorting: { columns: this.columns },
    filtering: { filterString: '' },
    className: ['table-striped', 'table-bordered']
  };

  tableData: Complete[];
  //let filteredData = this.changeFilter(this.data, this.conf);
  //let sortedData = this.changeSort(filteredData, this.config);
  // this.rows = page && config.paging ? this.changePage(page, sortedData) : sortedData;
  //this.length = sortedData.length;

  /*  public itemStringsLeft: any[] = [
      'Windstorm',
      'Bombasto',
      'Magneta',
      'Tornado'
    ];
  
    public itemStringsRight: any[] = [
  
    ];*/
  selection: Selectors;
  autor: Autor;
  tweet: Tweet;
  sparqlQuery: string;
  constructor(private fusekiService: FusekiService, private cd: ChangeDetectorRef, private zone: NgZone, private verbNormalisationService: VerbNormalisationService) {
    this.selection = {
      limit: '100',
      autorName: true,
      autorId: false,
      autorDescription: false,
      autorFollowerCount: false,
      autorEntity: false,
      tweetText: true,
      tweetId: false,
      subject: true,
      subjectEntity: false,
      verb: true,
      object: true,
      objectEntity: false,
      keyWord: false
    };

    // Befüllt den Autor
    this.autor = {
      entityNameChosen: ['Unknown'],
      entityNameNotChosen: [],
      name: ''
    };
    this.loadAutorEntitys();

    this.tweet = {
      keyWord: '',
      subject: {
        nounChosen: ['Proper Noun', 'Common Noun'],
        nounNotChosen: [],
        entityNameChosen: ['Unknown'],
        entityNameNotChosen: [],
        word: '',
      },
      verb: '',
      verbNormalized: '',
      object: {
        nounChosen: ['Proper Noun', 'Common Noun'],
        nounNotChosen: [],
        entityNameChosen: ['Unknown'],
        entityNameNotChosen: [],
        word: '',
      }
    };
    this.loadSubjectEntities();
    this.loadObjectEntities();
    this.sparqlQuery = '';
    this.updateSparqlQuery();
  }

  moveValueArray(arrayFrom: string[], arrayTo: string[], value:string){
    let index: number = arrayFrom.indexOf(value);
    if (index !== -1) {
        arrayFrom.splice(index, 1);
    } 
    arrayTo.push(value);
    arrayTo.sort();
    arrayFrom.sort();
    this.updateSparqlQuery();
  }
  autorChoseNot(event: any){
    this.moveValueArray(this.autor.entityNameChosen, this.autor.entityNameNotChosen, event.target.value);
  }
  autorChose(event: any){
    this.moveValueArray(this.autor.entityNameNotChosen, this.autor.entityNameChosen, event.target.value);
  }
  subjectNounChoseNot(event:any){
    this.moveValueArray(this.tweet.subject.nounChosen, this.tweet.subject.nounNotChosen, event.target.value);
  }
  subjectNounChose(event:any){
    this.moveValueArray(this.tweet.subject.nounNotChosen, this.tweet.subject.nounChosen, event.target.value);
  }
  subjectEntityNameChoseNot(event:any){
    this.moveValueArray(this.tweet.subject.entityNameChosen, this.tweet.subject.entityNameNotChosen, event.target.value);
  }
  subjectEntityNameChose(event:any){
    this.moveValueArray(this.tweet.subject.entityNameNotChosen, this.tweet.subject.entityNameChosen, event.target.value);
  }
  objectNounChoseNot(event:any){
    this.moveValueArray(this.tweet.object.nounChosen, this.tweet.object.nounNotChosen, event.target.value);
  }
  objectNounChose(event:any){
    this.moveValueArray(this.tweet.object.nounNotChosen, this.tweet.object.nounChosen, event.target.value);
  }
  objectEntityNameChoseNot(event:any){
    this.moveValueArray(this.tweet.object.entityNameChosen, this.tweet.object.entityNameNotChosen, event.target.value);
  }
  objectEntityNameChose(event:any){
    this.moveValueArray(this.tweet.object.entityNameNotChosen, this.tweet.object.entityNameChosen, event.target.value);
  }
  ngOnInit(): void{
    // TODO alle Vorbereitungen aus dem Konsturktor
  }

  loadAutorEntitys() {
    let results;
    this.fusekiService.getEntitys(
      `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
       PREFIX twtr: <http://example.org/> 
       SELECT DISTINCT ?entityName
       WHERE { ?accout a               twtr:TwitterAccount;
                       twtr:entityName ?entityName.
       }`
    ).then(result => {
      for (let binding of result.results.bindings) {
        console.log(binding.entityName.value);
        this.autor.entityNameChosen.push(binding.entityName.value);
      }
      
    });
  }
  loadSubjectEntities() {
    let results;
    this.fusekiService.getEntitys(
      `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
       PREFIX twtr: <http://example.org/> 
       SELECT DISTINCT ?entityName
       WHERE { ?accout a               twtr:Subject;
                       twtr:entityName ?entityName.
       }`
    ).then(result => {
      for (let binding of result.results.bindings) {
        console.log(binding.entityName.value);
        this.tweet.subject.entityNameChosen.push(binding.entityName.value);
      }
      
    });
  }
  loadObjectEntities() {
    let results;
    this.fusekiService.getEntitys(
      `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
       PREFIX twtr: <http://example.org/> 
       SELECT DISTINCT ?entityName
       WHERE { ?accout a               twtr:Object;
                       twtr:entityName ?entityName.
       }`
    ).then(result => {
      for (let binding of result.results.bindings) {
        console.log(binding.entityName.value);
        this.tweet.object.entityNameChosen.push(binding.entityName.value);
      }
      
    });
  }
  /*loadObjectEntities() {
    let results;
    this.fusekiService.sendSparqlQuery(
      `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
       PREFIX twtr: <http://example.org/> 
       SELECT DISTINCT ?entityName
       WHERE { ?accout a               twtr:Object;
                       twtr:entityName ?entityName.
       }`
    ).subscribe(result => {
      for (let binding of result.results.bindings) {
        this.tweet.object.entityNameChosen.push(binding.entityName.value);
      }
    });
  }*/

  // QUELLE: https://stackoverflow.com/questions/37435529/angular2-proper-way-to-restrict-text-input-values-e-g-only-numbers
  checkLimit(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
    
  }

  checkChanges(){
    this.updateSparqlQuery();
  }
  updateSparqlQuery() {
    this.sparqlQuery = `
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX twtr: <http://example.org/>

SELECT DISTINCT `;
    if (this.selection.autorId) {
      this.sparqlQuery += '?autorID ';
    } if (this.selection.autorName) {
      this.sparqlQuery += '?autorName ';
    } if (this.selection.autorDescription) {
      this.sparqlQuery += '?autorDescription ';
    } if (this.selection.autorFollowerCount) {
      this.sparqlQuery += '?autorFollowerCount ';
    } if (this.selection.tweetId) {
      this.sparqlQuery += '?tweetID ';
    } if (this.selection.tweetText) {
      this.sparqlQuery += '?tweetText ';
    } if (this.selection.subject) {
      this.sparqlQuery += '?subject ';
    } if (this.selection.subjectEntity) {
      this.sparqlQuery += '?subjectEntity ';
    } if (this.selection.verb) {
      this.sparqlQuery += '?verb ';
    } if (this.selection.object) {
      this.sparqlQuery += '?object ';
    } if (this.selection.objectEntity) {
      this.sparqlQuery += '?objectEntity ';
    } if (this.selection.keyWord) {
      this.sparqlQuery += '?keyWord '
    }
    this.sparqlQuery += `
WHERE { 
  ?account    twtr:tweeted          ?tweet;
              twtr:userName         ?autorName;
              twtr:userID           ?autorID;
              twtr:userDescription  ?autorDescription;
              twtr:followerCount    ?autorFollowerCount.
OPTIONAL{
  ?account    twtr:entityName       ?autorEntity.
}.
  ?tweet      twtr:tweetText        ?tweetText;
              twtr:tweetID          ?tweetID;
              twtr:contains         ?sop.
OPTIONAL{
  ?tweet      twtr:hasKeyword       ?keyWords.
  ?keyWords   rdfs:member           ?keyWord.
}.
  ?keyWords   rdfs:member           ?keyWord.
  ?triple     rdfs:subClassOf       ?pos ;
              a                     twtr:Triplet.
  ?verbN      rdfs:subClassOf       ?triple;
              a                     twtr:Verb;
              twtr:word             ?verb.
  ?subjectN   rdfs:subClassOf       ?triple;
              a                     twtr:Subject;
              twtr:word             ?subject.
OPTIONAL{
  ?subjectN   twtr:entityName       ?subjectEntity.    
}.
  ?objectN    rdfs:subClassOf       ?triple;
              a                     twtr:Object;
              twtr:word             ?object.
OPTIONAL{
  ?objectN    twtr:entityName       ?objectEntity.    
}.`;
    // Filtermöglichkeiten
    // Autor Filter
    if (this.autor.entityNameChosen.length > 1) {
      if (this.autor.entityNameChosen.indexOf('Unknown') > -1) {
        this.sparqlQuery += `
  FILTER( !BOUND(?autorEntity) || ?autorEntity IN (`;
        for (let chosen of this.autor.entityNameChosen) {
          if (chosen != 'Unknown') {
            this.sparqlQuery += "'" + chosen + "', ";
          }
        }
        this.sparqlQuery = this.sparqlQuery.substring(0, this.sparqlQuery.length - 2) + ") )";
      } else {
        this.sparqlQuery += `
  FILTER( ?autorEntity IN (`;
        for (let chosen of this.autor.entityNameChosen) {
          this.sparqlQuery += "'" + chosen + "', ";
        }
        this.sparqlQuery = this.sparqlQuery.substring(0, this.sparqlQuery.length - 2) + ") )";
      }
    } else {
      if (this.autor.entityNameChosen[0] == 'Unknown') {
        this.sparqlQuery += `
  FILTER( !BOUND(?autorEntity) )`;
      } else {
        this.sparqlQuery += `
  FILTER( ?autorEntity IN ('` + this.autor.entityNameChosen[0] + `') )`;
      }
    }
    if (this.autor.name != '') {
      this.sparqlQuery += `
  FILTER regex(?autorName, '` + this.autor.name + `', 'i')`;
    }
    // Subject Filter
    if (this.tweet.subject.nounChosen.length == 1) {
      if (this.tweet.subject.nounChosen[0] == 'Proper Noun') {
        this.sparqlQuery += `
  FILTER ( EXISTS{ ?subjectN a twtr:ProperNoun})`;
      } else {
        this.sparqlQuery += `
  FILTER ( EXISTS{ ?subjectN a twtr:CommonNoun})`;
      }
    } // Bei Länge 2 muss nichts eingeschränkt werden.
    if (this.tweet.subject.nounChosen.indexOf('Proper Noun') > -1) {
      if (this.tweet.subject.entityNameChosen.length > 1) {
        if (this.tweet.subject.entityNameChosen.indexOf('Unknown') > -1) {
          this.sparqlQuery += `
  FILTER( !BOUND(?subjectEntity) || ?subjectEntity IN (`;
          for (let chosen of this.tweet.subject.entityNameChosen) {
            if (chosen != 'Unknown') {
              this.sparqlQuery += "'" + chosen + "', ";
            }
          }
          this.sparqlQuery = this.sparqlQuery.substring(0, this.sparqlQuery.length - 2) + ") )";
        } else {
          this.sparqlQuery += `
  FILTER( ?subjectEntity IN (`;
          for (let chosen of this.tweet.subject.entityNameChosen) {
            this.sparqlQuery += "'" + chosen + "', ";
          }
          this.sparqlQuery = this.sparqlQuery.substring(0, this.sparqlQuery.length - 2) + ") )";
        }
      } else {
        if (this.tweet.subject.entityNameChosen[0] == 'Unknown') {
          this.sparqlQuery += `
  FILTER( !BOUND(?subjectEntity) )`;
        } else {
          this.sparqlQuery += `
  FILTER( ?subjectEntity IN ('` + this.tweet.subject.entityNameChosen[0] + `') )`;
        }
      }
    }
    if (this.tweet.subject.word != '') {
      this.sparqlQuery += `
  FILTER regex(?subject, '` + this.tweet.subject.word + `', 'i')`;
    }
    // Verb Filter

    if (this.tweet.verbNormalized != '') {
      this.sparqlQuery += `
  FILTER regex(?verb, '` + this.tweet.verbNormalized + `', 'i')`;
    }
    // Object Filter
    if (this.tweet.object.nounChosen.length == 1) {
      if (this.tweet.object.nounChosen[0] == 'Proper Noun') {
        this.sparqlQuery += `
  FILTER ( EXISTS{ ?objectN a twtr:ProperNoun})`;
      } else {
        this.sparqlQuery += `
  FILTER ( EXISTS{ ?objectN a twtr:CommonNoun})`;
      }
    } // Bei Länge 2 muss nichts eingeschränkt werden.
    if (this.tweet.object.nounChosen.indexOf('Proper Noun') > -1) {
      if (this.tweet.object.entityNameChosen.length > 1) {
        if (this.tweet.object.entityNameChosen.indexOf('Unknown') > -1) {
          this.sparqlQuery += `
  FILTER( !BOUND(?objectEntity) || ?objectEntity IN (`;
          for (let chosen of this.tweet.object.entityNameChosen) {
            if (chosen != 'Unknown') {
              this.sparqlQuery += "'" + chosen + "', ";
            }
          }
          this.sparqlQuery = this.sparqlQuery.substring(0, this.sparqlQuery.length - 2) + ") )";
        } else {
          this.sparqlQuery += `
  FILTER( ?objectEntity IN (`;
          for (let chosen of this.tweet.object.entityNameChosen) {
            this.sparqlQuery += "'" + chosen + "', ";
          }
          this.sparqlQuery = this.sparqlQuery.substring(0, this.sparqlQuery.length - 2) + ") )";
        }
      } else {
        if (this.tweet.object.entityNameChosen[0] == 'Unknown') {
          this.sparqlQuery += `
  FILTER( !BOUND(?objectEntity) )`;
        } else {
          this.sparqlQuery += `
  FILTER( ?objectEntity IN ('` + this.tweet.object.entityNameChosen[0] + `') )`;
        }
      }
    }
    if (this.tweet.object.word != '') {
      this.sparqlQuery += `
  FILTER regex(?object, '` + this.tweet.object.word + `', 'i')`;
    }
    // Key Word Filter
    if (this.tweet.keyWord != '') {
      this.sparqlQuery += `
  FILTER regex(?keyWord, '` + this.tweet.keyWord + `', 'i')`;
    }
    this.sparqlQuery += `
}
LIMIT ` + this.selection.limit;
  }

  refreshNormalized(): void {
    this.tweet.verbNormalized = this.tweet.verb;
    this.verbNormalisationService.getWords().then(word =>{
            for(let w of word){
                if(w.conjugation == this.tweet.verb || w.base == this.tweet.verb){
                    console.log(w.base);
                    this.tweet.verbNormalized = w.base;
                    this.updateSparqlQuery();
                    return;
                }
            }
        }
        );
  }

  sendSparql() {
    let results;
    this.fusekiService.sendSparqlQuery(this.sparqlQuery
    ).then(
      data => {this.tableData = data;
        console.log(this.tableData);
    });
  }
}
interface Autor {
  entityNameChosen: string[];
  entityNameNotChosen: string[];
  name: string;
}

interface Tweet {
  keyWord: string;
  subject: Noun;
  verb: string;
  verbNormalized: string;
  object: Noun;
}

interface Noun {
  nounChosen: string[];
  nounNotChosen: string[];
  entityNameChosen: string[];
  entityNameNotChosen: string[];
  word: string;
}
interface Selectors {
  autorId: boolean;
  autorName: boolean;
  autorDescription: boolean;
  autorFollowerCount: boolean;
  autorEntity: boolean;
  tweetText: boolean;
  tweetId: boolean;
  subject: boolean;
  subjectEntity: boolean;
  verb: boolean;
  object: boolean;
  objectEntity: boolean;
  keyWord: boolean;
  limit: string;
}