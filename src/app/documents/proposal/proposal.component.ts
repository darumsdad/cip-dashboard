import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { EventService } from 'src/app/services/event.service';
import { FileGenerateService } from 'src/app/services/file-generate.service';
import { VenueService } from 'src/app/services/venue.service';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.scss']
})
export class ProposalComponent implements OnInit {
onSend() {
throw new Error('Method not implemented.');
}



  contacts: FormControl<any>;
  contactList : any = [];
  form: FormGroup;
  contact_types: any = ['bride', 'bride_mom', 'bride_dad', 'groom', 'groom_mom', 'groom_dad', 'planner'];
  proposal: any;
  bride_first: any;
  groom_first: any;
  to: any;
  date: any;
  venue: any;
  quote: any;
  hours: any;
  count: any;
  include_photographer: any;
  highlights: any;
  teaser: any;
  full: any;
  link: any;
  preview: any;

  @Input()
  eventId: any
  trustedHtml: any;

  constructor(
    private rootFormGroup: FormGroupDirective,
    public venueService: VenueService,
    public generatorService: FileGenerateService,
    private sanitizer: DomSanitizer,
    private eventService: EventService
  ) { }

  onCreate() {

    let payload = {
      bride: this.bride_first.value,
      groom: this.groom_first.value,
      quote: this.quote.value,
      hours: this.hours.value,
      staff: this.count.value,
      date: this.date.value,
      venue: this.venue,
      highlights: this.highlights.value,
      teaser: this.teaser.value,
      full: this.full.value,
      contacts: this.contacts.value,
      eventId: this.eventId,
      type: 'proposal'
    }

    this.generatorService.post(payload).subscribe(
      {
        next: (result) => {
          console.log(result)

          this.eventService.save(this.eventId,{

            type: 'proposal',
            data: result
          }).subscribe(
            {
              next: (result) => {
                this.proposal.patchValue(result)
                this.load_proposal()
                console.log(this.proposal)
              },
              error: (error) => {
                alert(error.message)
              }
            }
          )
         
        },
        error: (error) => {
          alert(error.message)
        }
      }
    )
  
  }

  canCreate() : boolean {
   
    let ret = 
  //   
    
    this.bride_first.value === ""
    || this.groom_first.value === ""
    || this.quote.value === ""
    || this.hours.value === ""
    || this.count.value === ""
    || this.date.value === ""
    || this.venue === ""

   && (this.highlights.value || this.teaser.value || this.full.value)
 
   return ret;

  }

  load_proposal(): void {
    this.proposal = this.form.get('proposal')
    console.log(this.proposal)
    if (this.proposal.value)
    {
      console.log(this.proposal?.value?.html)
      this.preview = this.sanitizer.bypassSecurityTrustHtml(atob(this.proposal?.value?.html))
      this.link = this.proposal?.value?.link
    }
    console.log(this.preview)
    
  }
  ngOnInit(): void {


    this.contacts = new FormControl();

    this.form = this.rootFormGroup.control.get('data') as FormGroup;

    this.load_proposal();
  
    this.bride_first = this.form.get('bride_first_name')
    this.groom_first = this.form.get('groom_first_name')
    this.quote = this.form.get('quote')
    this.hours = this.form.get('hours')
    this.count = this.form.get('count')
    this.date = this.form.get('date')
    this.include_photographer = this.form.get('include_photographer')

    this.highlights = this.form.get('highlights')
    this.teaser = this.form.get('teaser')
    this.full = this.form.get('full')
    
    let venueId = this.form.get('venueId').value

    if (venueId)
    {
      this.venueService.get(venueId).subscribe({
        next: (venue) => {
          this.venue = venue
        },
        error: (error) => {
          alert(error.message)
        }

      })
    }

    this.contact_types.forEach(e => {
      let email_tag = e + '_email'
      let first_name_tag = e + '_first_name'
      let last_name_tag = e + '_last_name'

      if (this.form.get(email_tag).value && this.form.get(first_name_tag).value && this.form.get(last_name_tag).value) {
        this.contactList.push({
          type: e,
          name: this.form.get(first_name_tag).value + ' ' + this.form.get(last_name_tag).value,
          email: this.form.get(email_tag).value
        })
      }
    })

    this.contacts.valueChanges.subscribe(
      {
        next: (values) => {
            this.to = values.map(x => x.email).join(",")
        }
      }
      
    )
  }

}