import { ResourceLoader } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as e from 'express';
import { VideoAddComponent } from 'src/app/documents/video-add/video-add.component';
import { EventService } from 'src/app/services/event.service';

import { VenueService } from 'src/app/services/venue.service';
import { VimeoService } from 'src/app/services/vimeo.service';

@Component({
  selector: 'app-venue-detail',
  templateUrl: './venue-detail.component.html',
  styleUrls: ['./venue-detail.component.scss']
})
export class VenueDetailComponent implements OnInit {

  form: any;
  venueId: any;
  videoTag: any;

  proposalColumns: string[] = ['name','link','actions'];
  venueColumns: string[] = ['name','link','actions'];
  clientColumns: string[] = ['description','name','video','actions'];
  videosForVenueDataSource = new MatTableDataSource<any>();
  clientVideosForVenueDataSource = new MatTableDataSource<any>();
  videosForProposalDataSource = new MatTableDataSource<any>();

  loading: boolean = false;

  constructor(
    public venueService: VenueService,
    public eventService: EventService,
    public vimeoService: VimeoService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    ) { }

  ngOnInit(): void {

    this.venueId = this.route.snapshot.params['id'];
    
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      address: new FormControl(),
      city: new FormControl(),
      state: new FormControl(),
      zip: new FormControl(),
      phone: new FormControl()
    });

    this.videoTag = new FormControl()

    this.load();
  
  }

  private load() {
    
    this.loading = true;
    
    this.venueService.get(this.venueId).subscribe({
      next: (venue) => {
        console.log(venue)
        this.form.patchValue(venue);

        if (venue.venueData)
        {
          
          this.videosForVenueDataSource.data = venue.venueData.videosForVenue
          this.videosForProposalDataSource.data = venue.venueData.videosForProposal
        }

        this.eventService.allForVenue(this.venueId).subscribe(
            {
              next: (events) =>
              {
                if (events)
                {
                    events.forEach( event => {
                      event.data.videos.forEach ( video => {
                          video.event = event;  
                      })
                    })
                    
                    
                    let data = events.flatMap(x => x.data.videos)
                    console.log(data)

                    this.clientVideosForVenueDataSource.data = data

                }
              },
              error: (error) => {
                alert(error.mesage)
                this.loading = false;
              }
            }
        )
        this.loading = false;
      },
      error: (error) => {
        alert(error.message)
        this.loading = false;
      }
    });
  }

  upload($event: any): void {
    const dialogRef = this.dialog.open(VideoAddComponent, {
      width: '650px',
      data: {
        venueId: this.venueId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result)
        return;
      console.log(result);
      this.load();
    });
  }

  delete_video_from_venue(tag: any) {
    this.venueService.delete_video_from_venue(this.venueId, {
      type: 'venue',
      videoTag: tag
    }).subscribe(
      {
        next: (result) => {
          this.load();
        },
        error: (error) => {
          alert(error.message)
        }
      }

    )
  
  }

  delete_video_from_proposal(tag: any) {
    this.venueService.delete_video_from_venue(this.venueId, {
      type: 'proposal',
      videoTag: tag
    }).subscribe(
      {
        next: (result) => {
          this.load();
        },
        error: (error) => {
          alert(error.message)
        }
      }

    )
  
  }

  addToProposal(data: any) {
    console.log(data)
    
    this.venueService.addVideo(this.venueId, {
      type: 'proposal',
      video: data
    }).subscribe(
      {
        next: (result) => {
          this.load();
        },
        error: (error) => {
          alert(error.message)
        }
      }

    )
  }
}
