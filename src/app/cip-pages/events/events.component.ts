
import { DatePipe } from '@angular/common';
import {Component, OnDestroy, OnInit} from '@angular/core';
import { NbCalendarSize, NbCalendarYearModelService, NbGlobalPhysicalPosition, NbThemeService, NbToastrConfig, NbToastrService } from '@nebular/theme';
import * as e from 'express';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, takeWhile, tap } from 'rxjs/operators' ;
import { SolarData } from '../../@core/data/solar';
import { EventService } from '../services/event.service';
import { ContactsTableRenderComponent } from './contacts.table.render.component';

 

@Component({
  selector: 'app-events-dashboard',
  styleUrls: ['./events.component.scss'],
  templateUrl: './events.component.html',
})
export class EventsDashboardComponent implements OnInit, OnDestroy {

  month: any = new Date();
  size: NbCalendarSize =  NbCalendarSize.LARGE
   onCustom($event: any) {
 
  }


  func : Function = this.format
  private error$ = new  Subject<any>() ;
  datePipe : DatePipe = new DatePipe('en-US');

  settings = {
    
    mode: 'external',
    
    edit: {
      editButtonContent: 'Edit'
    },
    actions: {
      add: false,
      edit: true,
      delete: false,
    },
  
    columns: {
      description: {
        title: 'Description',
      },
      date: {
        title: 'Date',
        width: '10%',
        valuePrepareFunction : (date) => { return this.datePipe.transform(date, 'MM/dd/yyyy') },
      },
      contacts: {
        title: 'Contacts',
        type: 'custom',
        renderComponent: ContactsTableRenderComponent,
      }
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private es: EventService, private toastrService: NbToastrService,
    private yearService: NbCalendarYearModelService<any> ) {
  }

  format(row: any, column: any)
  {
      console.log(row)
      console.log(column)
  }
  onEdit($event)
  {
    console.log($event)
  }

  onYearChange($event)
  {
    console.log($event)
    this.month = $event
  }

  onDateChange($event)
  {
    console.log($event)
    this.month = $event
  }
  
  ngOnInit(): void {
    
    this.yearService.getViewYears
    this.es.events.subscribe(
      (events) => {
        
        let data = events.map( (x) => {

          let row = {
          'description' : x.data.description,
          'date': x.data.date,
          'contacts': 
            [
              {
                first: x.data.bride_first_name,
                last: x.data.bride_last_name,
                phone: x.data.bride_phone,
                email: x.data.bride_email,
              },
              {
                first: x.data.groom_first_name,
                last: x.data.groom_last_name,
                phone: x.data.groom_phone,
                email: x.data.groom_email,
              }
            ]

          }
          return row
        })

        console.log(data)
        this.source.load(data)
      }
        
    );

    this.error$.asObservable().subscribe( (error) => {
       
        const config : Partial<NbToastrConfig> = {
          status: 'danger',
          destroyByClick: true,
          duration: 2000,
          hasIcon: true,
          position: NbGlobalPhysicalPosition.TOP_RIGHT,
          preventDuplicates: true,
        };
        const titleContent = 'Error';

        this.toastrService.show(
          error,
          'Error',
          config);
      
      }
    )

   


    this.es.load().subscribe(
    {
      error: (error) => this.error$.next('Something went wrong getting events: ' + error?.statusText)
    })
      
  
  }
  
  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
  
  ngOnDestroy(): void {
    
  }

  
}
