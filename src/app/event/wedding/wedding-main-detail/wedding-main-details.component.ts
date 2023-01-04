import { Component, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EventDetailService } from 'src/app/services/event-detail.service';
import { Staff } from 'src/app/model/models';
import { BehaviorSubject, map, Observable, startWith, Subscribable, ValueFromArray } from 'rxjs';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

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

  search: boolean = false;
 
  private _planners : BehaviorSubject<any>
  
  filteredPlanners : Observable<any[]>;

  planner_search: FormControl = new FormControl()

  @ViewChild(MatAutocompleteTrigger) trigger: MatAutocompleteTrigger;
  
  constructor(public eventDetailService: EventDetailService) { 
  }

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
  loading_planners: boolean = false;
  loading_planners_error: boolean = false;

  onSearch()
  {
    if (this.search)
    {
      this.search = false;
    }
    else
    {
      this.search = true;
      if (!this._planners)
      {
        this.loading_planners = true;
        this.eventDetailService.planners().subscribe({
          next: (planners) => {
            this._planners = new BehaviorSubject([])
            planners.forEach(element => {
              if (element.first_name == "null") element.first_name = null
              if (element.last_name == "null") element.last_name = null
              if (element.phone == "null") element.phone =null
              if (element.email == "null") element.email = null
              if (element.company_name == "null") element.company_name = null
              if (element.social == "null") element.social =null
              if (element.website == "null") element.website = null
            });
            this._planners.next(planners);
            this.loading_planners = false;
            this.loading_planners_error = false;
            this.planner_search.setValue("")
          },
          error: (error) => {
            alert(error.mesage)
            this.loading_planners_error = true;
            this.loading_planners = false;
          }
        })
      }
    }
  }

 

  onPlannerSelected(selected: any)
  {
    this.form.get('planner_first_name').patchValue(selected.first_name)
    this.form.get('planner_last_name').patchValue(selected.last_name)
    this.form.get('planner_phone').patchValue(selected.phone)
    this.form.get('planner_email').patchValue(selected.email)
    this.form.get('planner_website').patchValue(selected.website)
    this.form.get('planner_social').patchValue(selected.social)
    this.form.get('planner_company_name').patchValue(selected.company_name)
    this.planner_search.reset()
    this.onSearch()
  }
 
  ngOnInit(): void {
    
    this.eventDetailService.register(
      (() => { this.loading = true }).bind(this),
      (() => { this.loading = false }).bind(this))
    this.form = this.eventDetailService.form.get('data')
 
    this.filteredPlanners = this.planner_search.valueChanges.pipe(
      startWith(''),
      map(predicate => this.filterPlanners(predicate || ''))
    )

    
  
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

  filterPlanners(predicate: any): any {
    if (!this._planners)
    return []

    const filterValue = predicate.toLowerCase()
    return this._planners.value.filter(planner => {
      return planner.first_name.toLowerCase().includes(filterValue) || planner.last_name.toLowerCase().includes(filterValue)
    });

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
