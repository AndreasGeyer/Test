import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SortableModule } from 'ngx-bootstrap/sortable';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { Ng2TableModule } from 'ng2-table/ng2-table';
import { NgTableComponent, NgTableFilteringDirective, NgTablePagingDirective, NgTableSortingDirective } from 'ng2-table/ng2-table';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { VerbNormalisationService }  from './services/verbnormalisation.service';
import { FusekiService } from './services/fuseki.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    SortableModule.forRoot(),
    ButtonsModule.forRoot(),
    TypeaheadModule.forRoot(),
    TooltipModule.forRoot(),
    Ng2TableModule
  ],
  providers: [VerbNormalisationService, FusekiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
