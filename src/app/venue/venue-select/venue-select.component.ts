import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { EventDetailService } from 'src/app/services/event-detail.service';
import { VenueService } from 'src/app/services/venue.service';
import { VenueAddComponent } from '../venue-add/venue-add.component';

@Component({
  selector: 'app-venue-select',
  templateUrl: './venue-select.component.html',
  styles: [' .mat-option { height: 100px; line-height: 20px; }'
  ]
})
export class VenueSelectComponent implements OnInit {

  form: FormGroup;

  constructor(
    public eds: EventDetailService,
    public venueService: VenueService,
    public dialog: MatDialog) { }

  venues: any[] = [];
  filteredVenues: Observable<any[]>;

  ngOnInit(): void {

    this.form = this.eds.form.get('data');

    this.venueService.getAll().subscribe({
      next: (venues) => {
      
      this.venues = venues ? venues : []
      // hack to get it to repaint after we have the list of venues
      this.form.get('venueId').patchValue(this.form.get('venueId').value)

      },
      error: (error) => {
        alert(error.message)
      }
    })

    this.filteredVenues = this.form.get('venueId').valueChanges.pipe(
      startWith(''),
      map(venue => venue ? this._filterVenue(venue || '') : this.venues.slice()),
    );
  }

  venueChanged(event: any)
  {
    console.log(event)
    let venue = this.venues.find(x => x.id === event)
    this.eds.applyVenue(venue);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(VenueAddComponent, {
      width: '650px'
    });

    dialogRef.afterClosed().subscribe(result => {

      console.log(result)
      if (!result)
        return;

      this.venues.push(result)
      this.eds.applyVenue(result);
    });
  }

  displayVenue(venueId: any): string {
    let _venueId = Number.parseInt(venueId)

    if (!this.venues) {
      return ''
    }

    return this.venues.filter(v => v.id === _venueId).length === 1 ? this.venues.find(v => v.id === _venueId).name : '';
  }


  private _filterVenue(value: any): any[] {

    if (!this.venues)
      return []

    if ((typeof value === 'string' || value instanceof String) && value != "") {
      const filterValue = value.toLowerCase()
      return this.venues.filter(venue => venue.name.toLowerCase().includes(filterValue) || venue.id.toString() === value);
    }

    else if (typeof value === 'number') {
      return this.venues.filter(venue => venue.id === value);
    }
    else {
      return this.venues.slice();
    }

  }


}
