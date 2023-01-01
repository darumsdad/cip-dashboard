import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EventDetailService } from 'src/app/services/event-detail.service';
import { Staff } from 'src/app/model/staff.model';

@Pipe({
  name: 'formatNames'
})
export class FormatNames implements PipeTransform {
  transform(input: Array<Staff>, sep = ', '): string {
    return input ? (input.map(x => x.first_name + ' ' + x.last_name).join(sep)) : '';
  }
}

@Component({
  selector: 'app-event-details',
  templateUrl: './wedding-main-details.component.html',
  styleUrls: ['./wedding-main-details.component.scss']
})
export class WeddingMainDetailsComponent implements OnInit {


  constructor(public eventDetailService: EventDetailService) { }

  videographers: Staff[] = [
  {
    first_name: 'Kyle',
    last_name: 'Demilner'
  },
  {
    first_name: 'Jon',
    last_name: 'Sheep'
  },
  {
    first_name: 'Jessica',
    last_name: 'Simon'
  },
  {
    first_name: 'Albert',
    last_name: 'Torillo'
  },
  {
    first_name: 'Amir',
    last_name: 'Goldstein'
  }

  ];

  assistants: Staff[] = [
    {
      first_name: 'Emma',
      last_name: 'Gutierrez'
    },
    {
      first_name: 'Derek',
      last_name: 'Fuller'
    },
    {
      first_name: 'Ethan',
      last_name: 'Felderman'
    },
    {
      first_name: 'Noah',
      last_name: 'Sinnreich'
    }

  ];


  form: FormGroup;
 
  ngOnInit(): void {
    this.eventDetailService.register(
      (() => { this.loading = true }).bind(this),
      (() => { this.loading = false }).bind(this))
    this.form = this.eventDetailService.form.get('data')

    this.form.get('videographers').valueChanges.subscribe((next) => {
      if (!next)
        return;
      let mapped = next.map(x => this.videographers.find(v => v.first_name === x.first_name));
      this.form.get('videographers').patchValue(mapped,
      { onlySelf: true, emitEvent: false, emitModelToViewChange: true })
    })

    this.form.get('assistants').valueChanges.subscribe((next) => {
      if (!next)
        return;
      let mapped = next.map(x => this.assistants.find(v => v.first_name === x.first_name));
      this.form.get('assistants').patchValue(mapped,
      { onlySelf: true, emitEvent: false, emitModelToViewChange: true })
    })
    
  }

  loading: boolean = false;

  onChangeStatus(event: any) {
    console.log(event);
    this.form.get('data').get('status_update_date').patchValue(new Date().toISOString())
  }

  // onVenueSelected(event: any) {
  //   console.log(event);
  //   this.form.get('data').get('venueId').patchValue(event);
  //   this.form.markAsTouched();
  // }

}
