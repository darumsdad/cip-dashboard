import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDayTemplateData } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker-view-model';
import { EventService } from 'src/app/services/event.service';
import { VenueService } from 'src/app/services/venue.service';
import { VimeoService } from 'src/app/services/vimeo.service';

@Component({
  selector: 'app-video-add',
  templateUrl: './video-add.component.html',
  styleUrls: ['./video-add.component.scss']
})
export class VideoAddComponent implements OnInit {

  form: FormGroup;

  @Input()
  eventId: any;

  types: any = ['Teaser','Highlight', 'Full Edit']
  error: any;
  working: any;

  constructor(
    public vimeoService: VimeoService,
    private route: ActivatedRoute,
    public fb: FormBuilder,
    private router: Router,
    public eventService: EventService,
    public venueService: VenueService,
    public dialog: MatDialogRef<VideoAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {

    this.eventId = this.route.snapshot.params['id'];
    this.form = this.fb.group({
      videoTag: [''],
      type: ['',Validators.required],
      video: ['',Validators.required]
    })

  }

  add($event: MouseEvent) {

    if (this.data.eventId)
    {
      this.eventService.addVideo(this.data.eventId, this.form.value).subscribe({
        next: (result) => {
          this.dialog.close(result);
        },
        error: (error) => {
          alert(error.message)
        }
      })
    }
    else
    {
      this.venueService.addVideo(this.data.venueId, 
        {
          type: 'venue',
          video: this.form.value
        }).subscribe({
        next: (result) => {
          this.dialog.close(result);
        },
        error: (error) => {
          alert(error.message)
        }
      })
    }
    
  }

  load($event: any) {
    this.error = undefined
    this.working = true;
    this.vimeoService.get(this.form.get('videoTag').value).subscribe(
      {
        next: (video) => {
          console.log(video);

          if (video.error)
          {
            this.error = video.error;
          }
          else
          {
            this.form.get('video').patchValue(video);
          }
          this.working = false;
          
        },
        error: (error) => {
          alert(error.message);
          this.working = false;
        }
      }
    )
  }

}
