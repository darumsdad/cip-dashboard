import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Venue } from 'src/app/models/venue';
import { EventService } from 'src/app/services/event.service';
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

  constructor(
    public vimeoService: VimeoService,
    private route: ActivatedRoute,
    public fb: FormBuilder,
    private router: Router,
    public eventService: EventService,
    public dialog: MatDialogRef<VideoAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {

    this.eventId = this.route.snapshot.params['id'];
    this.form = this.fb.group({
      videoTag: ['778842055'],
      type: ['',Validators.required],
      video: ['',Validators.required]
    })

  }

  add($event: MouseEvent) {
    this.eventService.addVideo(this.data.eventId, this.form.value).subscribe({
      next: (result) => {
        this.dialog.close(result);
      },
      error: (error) => {
        alert(error.message)
      }
    })
  }

  load($event: MouseEvent) {
    this.vimeoService.get(this.form.get('videoTag').value).subscribe(
      {
        next: (video) => {
          console.log(video);
          this.form.get('video').patchValue(video);
        },
        error: (error) => {
          alert(error.message);
        }
      }
    )
  }

}
