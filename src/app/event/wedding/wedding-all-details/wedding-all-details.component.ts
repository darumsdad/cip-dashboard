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

  special_options: any = [
    "Bride's gown and shoes",
    "Groom's Details (Shoes, Tie, etc.)",
    "Candid shots of the bride getting ready",
    "Wedding Invitation",
    "Candid shots of the groom getting ready",
    "Bride and groom letters to each other",
    "Father-Daughter Reveal",
    "Bridemaids",
    "Groomsmen"
  ]
  
  reception_options: any = [
    'Bride and Groom First Dance',
    'Parents Dance with bride and/or Groom',
    'Speeches/Toasts',
    'Mezinkah Dance'
  ]

  form: FormGroup;

  ngOnInit(): void {
    this.eventDetailService.register(
      (() => { this.loading = true }).bind(this),
      (() => { this.loading = false }).bind(this))
      this.form = this.eventDetailService.form.get('data')
  }

  loading: boolean = false;
  
  

}
