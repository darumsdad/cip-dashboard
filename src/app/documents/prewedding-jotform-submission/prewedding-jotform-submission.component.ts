import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EventDetailService } from 'src/app/services/event-detail.service';

@Component({
  selector: 'app-prewedding-jotform-submission',
  templateUrl: './prewedding-jotform-submission.component.html',
  styleUrls: ['./prewedding-jotform-submission.component.scss']
})
export class PreweddingJotformSubmissionComponent implements OnInit {

  form: FormGroup;
  prewedding_jotform: any;
  submissions: any;

  constructor(private eds: EventDetailService) { }

  ngOnInit(): void {
    this.form = this.eds.form.get('data') as FormGroup;
    this.prewedding_jotform = this.form.value.prewedding_jotform
    this.submissions = this.prewedding_jotform.submissions
  }

  getChangesSummery(changes: any) {

    let changed  = changes.map(x => x.original != x.new && x.original != "").filter(x => x === true).length
    let newFields = changes.map(x => x.original != x.new && (x.original === "" || x.original === undefined)).filter(x => x === true).length

    return newFields + ' new fields and ' + changed + ' changed fields '
  }


}
