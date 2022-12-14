import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { VenueService } from 'src/app/services/venue.service';


@Component({
  selector: 'app-venue-list',
  templateUrl: './venue-list.component.html',
  styleUrls: ['./venue-list.component.scss']
})
export class VenueListComponent implements OnInit {
loading: any;

  constructor(private router: Router,
    private venueService: VenueService

  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.venueService.load(this.doneLoading.bind(this))
  }

  edit(row: any) {
    console.log(row)
    this.router.navigate(['venues', row])
  }

  delete(row: any) {
    this.loading = true
    this.venueService.delete(row,this.doneLoading.bind(this))
  }

  private dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['name', 'location','contact','actions'];

  venuesAsMatTableDataSource$: Observable<MatTableDataSource<any>> =
    this.venueService.venues.pipe(
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

  update() {
    this.loading = true
    this.venueService.load(this.doneLoading.bind(this));
  }
  
  doneLoading()
  {
    this.loading = false
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = ((data, filter) => {
      let d = data.name.toLowerCase()
      var res = (d) ? d.includes(filter) : false;
      return res
    })
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
