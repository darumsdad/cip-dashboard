
import { DatePipe } from '@angular/common';
import {Component, OnDestroy, OnInit} from '@angular/core';
import { NbCalendarMonthModelService, NbCalendarSize, NbCalendarYearModelService, NbGlobalPhysicalPosition, NbThemeService, NbToastrConfig, NbToastrService } from '@nebular/theme';
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

  year: any = new Date().getFullYear();
  month: any = new Date().getMonth();

  size: NbCalendarSize =  NbCalendarSize.LARGE
  years: any[];
  months: string[];

  map = {
    'Jan':  0,
    'Feb' : 1,
    'Mar' : 2,
    'Apr' : 3,
    'May' : 4,
    'Jun' : 5,
    'Jul' : 6,
    'Aug' : 7,
    'Sep' : 8,
    'Oct' : 9,
    'Nov' : 10,
    'Dec' : 11 }
  
  onCustom($event: any) {
 
  }

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
        width: '30%',
        type: 'text',
      },
      date: {
        title: 'Date',
        width: '10%',
        
        filterFunction (cell?: any, search?:  any)  {

          console.log("Filteringxxxx")
          let epoch = Date.parse(cell)
          let date = new Date(epoch)

          let year = search[1];
          let month = search[0];

          return (date.getFullYear() === year && date.getMonth() === month)
          
        },
        valuePrepareFunction : (date) => { return this.datePipe.transform(date, 'MM/dd/yy') },
        
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
    private yearService: NbCalendarYearModelService<any> ,
    private monthService: NbCalendarMonthModelService<any> 
    ) {
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
    this.year = $event.getFullYear()
    
    this.applyDateFilter();
  }

  onMonthChange($event)
  {
    this.month = this.map[$event]
    this.applyDateFilter();
  }


  onDateChange($event)
  {
    console.log($event)
    //this.today = $event
  }
  
  ngOnInit(): void {
    
    let years = this.yearService.getViewYears(new Date())
    this.years = [years[1][3],years[2][0],years[2][1],years[2][2]]
    console.log(this.monthService.createDaysGrid(new Date()))
    this.months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

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

        this.applyDateFilter()

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
  
  applyDateFilter()
  {
    let filter = [this.month, this.year]
    console.log(filter)
    this.source.
    addFilter(
      {
        field: 'date',
        //search: this.datePipe.transform($event, 'MM/dd/yy')
        search: filter
      }, true); 
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
