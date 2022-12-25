import { Component, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { EmailService } from 'src/app/services/email.service';
import { EventDetailService } from 'src/app/services/event-detail.service';
import { EventService } from 'src/app/services/event.service';
import { FileGenerateService } from 'src/app/services/file-generate.service';
import { VenueService } from 'src/app/services/venue.service';

@Component({
  selector: 'app-precontract-jotform-submission',
  templateUrl: './precontract-jotform-submission.component.html',
  styleUrls: ['./precontract-jotform-submission.component.scss']
})
export class PrecontractJotformSubmissionComponent implements OnInit {

  form: FormGroup;
  precontract_jotform: any;
  submissions: any;

  constructor(private eds: EventDetailService) { }

  ngOnInit(): void {
    this.form = this.eds.form.get('data') as FormGroup;
    this.precontract_jotform = this.form.value.precontract_jotform
    this.submissions = this.precontract_jotform.submissions
  }

  getChangesSummery(changes: any) {

    let changed  = changes.map(x => x.original != x.new && x.original != "").filter(x => x === true).length
    let newFields = changes.map(x => x.original != x.new && (x.original === "" || x.original === undefined)).filter(x => x === true).length

    return newFields + ' new fields and ' + changed + ' changed fields '
  }

}
