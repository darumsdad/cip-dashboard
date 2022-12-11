import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
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

  constructor(public venueService: VenueService, 
    public dialog: MatDialog,
    public rootFormGroup: FormGroupDirective) { }

  venues: any[] = [];
  filteredVenues: Observable<any[]>;
 

  ngOnInit(): void {
    console.log('starting  detected')
    this.form = this.rootFormGroup.control;
    console.log(this.rootFormGroup.control)
    this.venueService.getAll().subscribe(x => { 
      console.log(x)
      this.venues = x;
      this.filteredVenues = this.form.get('venueId').valueChanges.pipe(
        startWith(''),
        map(venue => venue ? this._filterVenue(venue || '') : this.venues.slice()),
      );
      console.log("applying hack")

      // hack to get it to repaint after we have the list of venues
      this.form.get('venueId').patchValue(this.form.get('venueId').value)
      
    })
  }

  onVenueSelected($event: any) {
   console.log("foof");
   console.log($event);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(VenueAddComponent, {
      width: '650px'
    });

    dialogRef.afterClosed().subscribe(result => {

      if (!result)
        return;

      console.log(result);
      this.venues.push(result)
      this.form.get('venueId').patchValue(result.id)
     
    });
  }

  displayVenue(venueId: any): string {
    let _venueId = Number.parseInt(venueId)

    if (!this.venues) {
      console.log('no venues')
      return ''
    }
    
    console.log('number')
    console.log(this.venues)
    return this.venues.filter(v => v.id === _venueId).length === 1 ? this.venues.find(v => v.id === _venueId).name : '';
  }

  
  private _filterVenue(value: any): any[] {
    if ((typeof value === 'string' || value instanceof String) && value != "") {
      const filterValue = value.toLowerCase()
      
      return this.venues.filter(venue => venue.name.toLowerCase().includes(filterValue) || venue.id.toString() === value);
    }
    
    else if (typeof value === 'number') {
      console.log("finding")
      return this.venues.filter(venue => venue.id === value);
    }
    else
   {
    console.log(this.venues.slice())

      return this.venues.slice();
      
    }

  }


}
