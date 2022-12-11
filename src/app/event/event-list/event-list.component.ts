import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Address } from 'ngx-google-places-autocomplete/objects/address';

import { map, Observable } from 'rxjs';
import { EventService } from 'src/app/services/event.service';
import { STATUS_MAP } from '../event-status/event-status.component';

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
    private s: EventService,
    public fb: FormBuilder
  ) { }

  loadingFinished()
  {
    this,this.loading = false;
  }

  reset($event: any) {
    this.form.reset();
    this.dataSource.filter = undefined
  }

  ngOnInit(): void {

    this.form = this.fb.group({
      status: [''],
      filter: ['']
    })
    this.loading = true;
    this.s.load(this.loadingFinished.bind(this))

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

  clickRow(row: any) {
    console.log(row)
    this.router.navigate(['detail', row])
  }

  onClick(event: any) {
    console.log("nativating")
    this.router.navigate(['detail'])
  }

  private dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['id', 'alert','description', 'date', 'status', 'actions'];

  columnsToDisplayWithExpand = [ ...this.displayedColumns, 'expand'];
  expandedElement: any | null;

  eventsAsMatTableDataSource$: Observable<MatTableDataSource<any>> =
    this.s.events.pipe(
      map((events) => {
        const dataSource = this.dataSource;
        dataSource.data = events
        return dataSource;
      })
    );

  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator;
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
    this.s.load(this.loadingFinished.bind(this));
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
