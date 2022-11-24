import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Venue } from 'src/app/models/venue';
import { VenueService } from 'src/app/services/venue.service';



@Component({
  selector: 'app-venue-add',
  templateUrl: './venue-add.component.html',
  styleUrls: ['./venue-add.component.scss']
})

export class VenueAddComponent implements OnInit {

  form: FormGroup;

  public options = {
    componentRestrictions: {
      country: ["US"]
    }
  }

  constructor(public zone: NgZone,
    private venueService: VenueService,
    public dialog: MatDialogRef<VenueAddComponent>,
    @Inject(MAT_DIALOG_DATA) public newVenue: Venue) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      address: new FormControl(),
      city: new FormControl(),
      state: new FormControl(),
      zip: new FormControl(),
      phone: new FormControl()
    });

  }

  onSubmit() {
    console.log('onSubmit')
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.venueService.create(this.form.value).subscribe({
      next: (data) => {
        console.log(data.id)
        this.dialog.close(data);
      },
      error: error => {
      },

    });

  }


  getEstablishmentAddress(place: object) {

    console.log(place)
    this.form.patchValue({
      name: place['name'],
      address: this.getStreetNumber(place) + ' ' + this.getStreet(place),
      city: this.getCity(place),
      state: this.getState(place),
      zip: this.getPostCode(place),
      phone: place['formatted_phone_number']
    })

    this.zone.run(() => {

      this.form.patchValue({
        name: place['name'],
        address: this.getStreetNumber(place) + ' ' + this.getStreet(place),
        city: this.getCity(place),
        state: this.getState(place),
        zip: this.getPostCode(place),
        phone: place['formatted_phone_number']
      })

    });


  }

  getAddrComponent(place, componentTemplate) {

    let result;

    for (let i = 0; i < place.address_components.length; i++) {
      const addressType = place.address_components[i].types[0];
      if (componentTemplate[addressType]) {
        result = place.address_components[i][componentTemplate[addressType]];
        return result;
      }
    }
    return;
  }

  getStreetNumber(place) {
    const COMPONENT_TEMPLATE = { street_number: 'short_name' },
      streetNumber = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return streetNumber;
  }

  getStreet(place) {
    const COMPONENT_TEMPLATE = { route: 'long_name' },
      street = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return street;
  }

  getCity(place) {
    const COMPONENT_TEMPLATE = { locality: 'long_name' },
      city = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return city;
  }

  getState(place) {
    const COMPONENT_TEMPLATE = { administrative_area_level_1: 'short_name' },
      state = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return state;
  }

  getDistrict(place) {
    const COMPONENT_TEMPLATE = { administrative_area_level_2: 'short_name' },
      state = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return state;
  }

  getCountryShort(place) {
    const COMPONENT_TEMPLATE = { country: 'short_name' },
      countryShort = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return countryShort;
  }

  getCountry(place) {
    const COMPONENT_TEMPLATE = { country: 'long_name' },
      country = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return country;
  }

  getPostCode(place) {
    const COMPONENT_TEMPLATE = { postal_code: 'long_name' },
      postCode = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return postCode;
  }

  getPhone(place) {
    const COMPONENT_TEMPLATE = { formatted_phone_number: 'formatted_phone_number' },
      phone = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return phone;
  }

}
