import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { map, Observable } from 'rxjs';
import { EventService } from 'src/app/services/event.service';
import { STATUS_MAP } from '../event-status/event-status.component';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit, AfterViewInit {

  constructor(private router: Router,
    private s: EventService

  ) { }

  ngOnInit(): void {
    this.s.updateThings()

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'description': return item.data.description;
        case 'date': return item.data.date;
        case 'status': return item.data.status;
        default: return item[property];
      }
    };
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
    this.s.updateThings();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = ((data, filter) => {
      let d = data.data.description.toLowerCase()
      var res = (d) ? d.includes(filter) : false;
      return res
    })
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
