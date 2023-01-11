
import { DatePipe } from '@angular/common';
import {Component, OnDestroy, OnInit} from '@angular/core';
import { NbCalendarMonthModelService, NbCalendarYearModelService, NbGlobalPhysicalPosition, NbToastrConfig, NbToastrService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators' ;

import { EventService } from '../services/event.service';
import { ContactsTableRenderComponent } from './contacts.table.render.component';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { HttpClient } from '@angular/common/http';
import { STATUS_MAP } from './status';
import { VenueTableRenderComponent } from './venue.table.render.component';


interface Film {
  id: number;
  title: string;
  release_date: string;
}

function getTimezoneOffsetString(date: Date): string {
  const timezoneOffset = date.getTimezoneOffset();
  const hoursOffset = String(
    Math.floor(Math.abs(timezoneOffset / 60))
  ).padStart(2, '0');
  const minutesOffset = String(Math.abs(timezoneOffset % 60)).padEnd(2, '0');
  const direction = timezoneOffset > 0 ? '-' : '+';

  return `T00:00:00${direction}${hoursOffset}:${minutesOffset}`;
}

@Component({
  selector: 'app-events-dashboard',
  styleUrls: ['./events.component.scss'],
  templateUrl: './events.component.html'
  
})
export class EventsDashboardComponent implements OnInit, OnDestroy {

  viewDate: Date = new Date();

  refresh: any = new Subject();

  events$: Observable<CalendarEvent<any>[]>;

  year: any = new Date().getFullYear();
  month: any = new Date().getMonth();
  date: any = new Date()
  
  years: any[];
  months: string[];

  map = {'Jan':  0,'Feb' : 1,'Mar' : 2,'Apr' : 3,'May' : 4,'Jun' : 5,'Jul' : 6,'Aug' : 7,'Sep' : 8,'Oct' : 9,'Nov' : 10,'Dec' : 11 }
  
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
      width: '10%',
    },

  
    columns: {
      description: {
        title: 'Description',
        width: '30%',
        type: 'text',
      },
      status: {
        title: 'Status',
        width: '10%',
        // filterFunction : (cell?: any, search?:  any) => { 
        //   console.log(cell)
        //   console.log(search)
        // },
        filter: {
          type: 'list',
          config : {
            selectText: 'Select...',
            list: STATUS_MAP.map(e => {
              return {'value': e.id, 'title': e.name}
            }),
          }
          
        },
        valuePrepareFunction : (id) => { return STATUS_MAP.find(e => e.id === id).name },
      },
      venue: {
        title: 'Venue',
        width: '20%',
        type: 'custom',
        renderComponent: VenueTableRenderComponent,
      },

      date: {
        title: 'Date',
        width: '10%',
        filterFunction : this.dateFilter,
        valuePrepareFunction : (date) => { return this.datePipe.transform(date, 'MM/dd/yy') },
        
      },
      contacts: {
        title: 'Contacts',
        type: 'custom',
        width: '20%',
        renderComponent: ContactsTableRenderComponent,
      }
    },
  };

  source: LocalDataSource = new LocalDataSource();
  view: CalendarView = CalendarView.Month;

  constructor(private es: EventService, private toastrService: NbToastrService,
    private yearService: NbCalendarYearModelService<any> ,
    private monthService: NbCalendarMonthModelService<any> ,
    
    ) {
  }

  dateFilter(cell?: any, search?:  any)  {
    let epoch = Date.parse(cell)
    let date = new Date(epoch)
    let year = search[1];
    let month = search[0];
    return (date.getFullYear() === year && (month < 0 || date.getMonth() === month))
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
    this.viewDate.setFullYear(this.year)
    this.refresh.next("")
    
    this.applyDateFilter();
  }

  onMonthChange($event)
  {
    this.month = this.map[$event]
    this.date.setMonth(this.month)
    this.viewDate.setMonth(this.month)
    this.refresh.next("")
    console.log(this.date)
    this.applyDateFilter();
  }

  onDateChange($event)
  {
    this.year = $event.getFullYear();
    this.month = $event.getMonth();
    this.applyDateFilter();
  }

  clearMonth()
  {
    this.month = -1
    this.year = new Date().getFullYear();
    this.applyDateFilter();
  }

  dayClicked({
    date,
    events,
  }: {
    date: Date;
    events: CalendarEvent<any>[];
  }): void {
    
  }

  
  ngOnInit(): void {
    
    console.log("fetching")
    
    
    let years = this.yearService.getViewYears(new Date())
    this.years = [years[1][3],years[2][0],years[2][1],years[2][2]]
    console.log(this.monthService.createDaysGrid(new Date()))
    this.months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

    this.events$ = 
    this.events$ = this.es.events
      
      .pipe(
        map((events: any) => 
        
          events.map((event: any) => {

          let r = {
            title: event.data.description,
            start: new Date(
              event.data.date
            ),
            color: {
              primary: '#FFFF00',
              secondary: '#FFFF00',
            },
            allDay: true,
            meta: {
              event,
            },
          };
          return r;
        }))
      );
  

    this.es.events.subscribe(
      (events) => {
        console.log(events)
        let data = events.map( (x) => {

          let row = {
          'description' : x.data.description,
          'date': x.data.date,
          'status': x.data.status,
          'venue' : {
            name: x.name,
            address: x.address,
            city: x.city,
            state: x.state,
            zip: x.zip
          },
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
