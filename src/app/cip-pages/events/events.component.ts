
import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbCalendarMonthModelService, NbCalendarYearModelService, NbGlobalPhysicalPosition, NbToastrConfig, NbToastrService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { EventService } from '../services/event.service';
import { ContactsTableRenderComponent } from './contacts.table.render.component';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { HttpClient } from '@angular/common/http';
import { STATUS_MAP } from './status';
import { VenueTableRenderComponent } from './venue.table.render.component';
import { SearchComponent } from '../../pages/ui-features/search-fields/search-fields.component';
import * as e from 'express';


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

  year: number
  month: string

  years: any[];
  months: string[];
  display: string

  strToNumberMap = { 'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6, 'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12 }
  numberToStrMap = { 0: 'Jan', 1: 'Feb', 2: 'Mar', 3: 'Apr', 4: 'May', 5: 'Jun', 6: 'Jul', 7: 'Aug', 8: 'Sep', 9: 'Oct', 10: 'Nov', 11: 'Dec' }

  onCustom($event: any) {

  }

  private error$ = new Subject<any>();
  datePipe: DatePipe = new DatePipe('en-US');

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
          config: {
            selectText: 'Select...',
            list: STATUS_MAP.map(e => {
              return { 'value': e.id, 'title': e.name }
            }),
          }

        },
        valuePrepareFunction: (id) => { return STATUS_MAP.find(e => e.id === id).name },
      },
      venue: {
        title: 'Venue',
        width: '20%',
        type: 'custom',
        filterFunction: this.venueFilter,
        renderComponent: VenueTableRenderComponent,
      },

      date: {
        title: 'Date',
        width: '10%',
        filterFunction: this.dateFilter.bind(this),
        valuePrepareFunction: (date) => { return this.datePipe.transform(date, 'MM/dd/yy') },

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
    private yearService: NbCalendarYearModelService<any>,
    private monthService: NbCalendarMonthModelService<any>,

  ) {
  }

  dateFilter(cell?: any, search?: string) {

    let epoch = Date.parse(cell)
    let date = new Date(epoch)
    let cellMonth = date.getMonth()
    let cellYear = date.getFullYear()

    let m1 = search.match(/^[A-Z][a-z][a-z].[0-9][0-9][0-9][0-9]$/g)
    if (m1) {
      let month = search.substring(0, 3).toLocaleLowerCase()
      if (['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].includes(month)) {
        this.month = search.split(" ")[0]
        this.year = Number(search.split(" ")[1])
        let iMonth = this.getMonthFromString(this.month)
        if (iMonth != undefined)
        {
          this.viewDate.setMonth(iMonth)
          this.viewDate.setFullYear(this.year)
          this.refresh.next("")
        }

        return (cellYear === this.year && cellMonth === iMonth)


      } else {

        this.month = undefined
        this.year = Number(search.split(" ")[1])
        this.viewDate.setFullYear(this.year)
        this.refresh.next("")
        return false;

      }

    }
    else if (search.match(/^[0-9][0-9][0-9][0-9]$/g)) {
      this.month = undefined
      this.year = Number(search)
      this.viewDate.setFullYear(this.year)
      this.refresh.next("")
      return (cellYear === this.year)
    }
    else {
      this.month = undefined
      this.year = undefined
      return false;
    }


  }

  venueFilter(cell?: any, search?: any) {
    console.log(cell)
    return cell.name != undefined && cell.name.toLowerCase().includes(search.toLowerCase())
  }

  format(row: any, column: any) {
    console.log(row)
    console.log(column)
  }
  onEdit($event) {
    console.log($event)
  }

  onYearChange($event) {
    this.year = $event.getFullYear()
    this.applyDateFilter();
  }

  onMonthChange($event) {
    this.month = $event
    if (this.year == undefined)
      this.year = new Date().getFullYear()
    this.applyDateFilter();
  }

  getMonthFromString(month: string): number {
    return this.strToNumberMap[month] - 1
  }

  getStringFromMonth(month: number): string {
    return this.numberToStrMap[month]
  }

  onDateChange($event) {
    this.year = $event.getFullYear();
    this.month = $event.getMonth();
    this.applyDateFilter();
  }

  clearMonth() {
    this.month = undefined
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


    let years = this.yearService.getViewYears(new Date())
    this.years = [years[1][3], years[2][0], years[2][1], years[2][2]]
    console.log(this.monthService.createDaysGrid(new Date()))
    this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    this.year = new Date().getFullYear()
    this.month = this.getStringFromMonth(new Date().getMonth())

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
        let data = events.map((x) => {

          let row = {
            'description': x.data.description,
            'date': x.data.date,
            'status': x.data.status,
            'venue': {
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

    this.error$.asObservable().subscribe((error) => {
      const config: Partial<NbToastrConfig> = {
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

  applyDateFilter() {
    let filter = this.month != undefined ? this.month + " " + this.year :  this.year
    console.log(filter)
    this.source.
      addFilter(
        {
          field: 'date',
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
