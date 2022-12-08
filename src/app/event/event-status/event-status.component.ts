import { Component,  OnInit, Optional } from '@angular/core';
import { ControlContainer, FormControl, FormControlDirective, FormGroup, FormGroupDirective } from '@angular/forms';

export var STATUS_MAP: any[] = [
  { id: '0', name: '(Default) Hold' },
  { id: '1', name: 'Lead' },
  { id: '2', name: 'Proposal Sent'}, // (2 days after Lead )' },
  { id: '4', name: 'Proposal Accepted' },
  { id: '5', name: 'Pre-Contract Questionnaire Sent' }, // (2 days after Proposal Accepted)' },
  { id: '6', name: 'Pre-Contract Questionnaire Completed' },
  { id: '7', name: 'Contract Sent' }, // (2 days after Pre-Contract Questionnaire Completed)' },
  { id: '8', name: 'Contract Received'}, // - Deposit Pending, Contract and Deposit Received' },
  { id: '9', name: 'Pre-Wedding Meeting Scheduled'}, // (2-3 weeks prior to Wedding Date)' },
  { id: '10', name: 'Pre-Wedding Questionnaire Sent'} , // (3 days prior to meeting)' },
  { id: '11', name: 'Pre-Wedding Meeting Complete'}, // Wedding Paid in Full (no later than Wedding Date)' },
  { id: '12', name: 'Highlight Song Selection Pending' },
  { id: '13', name: 'Highlight Song Selected' },
  { id: '14', name: 'Highlight Video Production Pending'}, // (3-4 weeks after Song Selected)' },
  { id: '15', name: 'Highlight Video Production Completed/Pending Approval' },
  { id: '16', name: 'Highlight Video Approved' },
  { id: '30', name: 'Complete / Archive' }
]

@Component({
  selector: 'app-event-status',
  templateUrl: './event-status.component.html',
  styleUrls: ['./event-status.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class EventStatusComponent implements OnInit {

  constructor(
    private rootFormGroup: FormGroupDirective
    ) { }

  form: FormGroup
  statuses: any  = STATUS_MAP;

  eventTypes: any[] = ['Wedding', 'Mitzvah', 'Other']

  

  ngOnInit(): void {
    console.log("set form")
    this.form = this.rootFormGroup.control.get('data') as FormGroup;
    console.log(this.form.value)
  }

  onChangeStatus(event: any) {
    console.log(event);
    this.form.get('status_update_date').patchValue(new Date().toISOString())
  }

}
