import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as e from 'express';
import { Address } from 'ngx-google-places-autocomplete/objects/address';

import { map, Observable } from 'rxjs';
import { EventService } from 'src/app/services/event.service';
import { STATUS_MAP } from '../wedding/wedding-status/wedding-status.component';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class EventListComponent implements OnInit, AfterViewInit {


loading: any = false;
statuses: any = STATUS_MAP;
  form: FormGroup;

  constructor(private router: Router,
    private eventService: EventService,
    public formBuilder: FormBuilder
  ) { }

  loadingFinished()
  {
    this.loading = false;
  }

  reset($event: any) {
    this.form.reset();
    this.dataSource.filter = undefined
  }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      status: [''],
      filter: ['']
    })
    this.loading = true;
    this.eventService.load(this.loadingFinished.bind(this))

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'description': return item.data.description;
        case 'date': return item.data.date;
        case 'status': return item.data.status;
        default: return item[property];
      }
    };

    this.dataSource.filterPredicate = ((data, filter) => {

      let parts = filter.split('$')
      
      let description_filter = parts[0]
      let desctiption_pass = false;
      if (description_filter)
        desctiption_pass = data.data.description.toLowerCase().includes(description_filter)

      let a = !description_filter || desctiption_pass

      let status_filter = parts[1]
      let status_pass = false;
    
      if (status_filter)
        status_pass = data.data.status === status_filter
       
      let b = !status_filter || status_pass

      return a && b
    })
  }

  edit(row: any) {
    console.log(row)
    this.router.navigate(['wedding', row])
  }

  delete(row: any)
  {
    console.log(row)
    if(confirm("Are you sure to delete "+ row.data.description)) {
      this.loading = true;
      this.eventService.delete(row.id, (() => {this.loading = false}).bind(this))
    }
  }

  onNewEvent() {
    this.eventService.create({
      id: undefined,
      data: {
        event_type: 'Wedding',
        status: '0',
        status_update_date: new Date().toISOString()
        
      }
    }).subscribe({
      next: (event) => {
        this.router.navigate(['wedding', event.id])  
      },
      error: (error) => {
        alert("Could not create a new event " + error.message)
      }
    })
  }

  private dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['id', 'alert','description', 'date', 'status', 'actions'];

  columnsToDisplayWithExpand = [ ...this.displayedColumns, 'expand'];
  expandedElement: any | null;

  eventsAsMatTableDataSource$: Observable<MatTableDataSource<any>> =
    this.eventService.events.pipe(
      map((events) => {
        const dataSource = this.dataSource;
        dataSource.data = events
        return dataSource;
      })
    );

  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator;
    this.sort.sort(({ id: 'date', start: 'asc'}) as MatSortable);
    this.dataSource.sort = this.sort;
  }

  dereference(id: any) {

    if (!id)
    return ''
    
    return STATUS_MAP.find(x => x.id === id).name
  }

  formatDateTime(dateIn: any) {

    if (!dateIn)
      return "None"
    
    var date = new Date(Date.parse(dateIn));
     // Generate yyyy-mm-dd date string
    return date.toLocaleString('en-US', { timeZone: 'UTC' })

  }
  

  formatDate(dateIn: any) {

    if (!dateIn)
      return "No Date Yet"
    
    var date = new Date(Date.parse(dateIn));
    var year = date.toLocaleString("default", { year: "numeric" });
    var month = date.toLocaleString("default", { month: "2-digit" });
    var day = date.toLocaleString("default", { day: "2-digit" });

    // Generate yyyy-mm-dd date string
    return month + "/" + day + "/" + year;

  }

  update() {
    this.loading = true;
    this.eventService.load(this.loadingFinished.bind(this));
  }

  triggerFilter(event: any) {
    this.applyFilter()
  }

  applyFilter() {
    
    let filterValue = this.form.get('filter').value
    let statusValue = this.form.get('status').value

    this.dataSource.filter = filterValue.trim().toLowerCase() + '$' + statusValue;
  }



}
