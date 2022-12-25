import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventDetailService } from 'src/app/services/event-detail.service';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-wedding-all-details',
  templateUrl: './wedding-all-details.component.html',
  styleUrls: ['./wedding-all-details.component.scss']
})
export class WeddingAllDetailsComponent implements OnInit {
 
  constructor(public eventDetailService: EventDetailService) { }

  
  form: FormGroup;

  ngOnInit(): void {
    this.eventDetailService.register(
      (() => { this.loading = true }).bind(this),
      (() => { this.loading = false }).bind(this))
      this.form = this.eventDetailService.form.get('data')
  }

  loading: boolean = false;
  
  

}
