import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { EventDetailService } from 'src/app/services/event-detail.service';
import { EventService } from 'src/app/services/event.service';
import { VenueService } from 'src/app/services/venue.service';
import { VimeoService } from 'src/app/services/vimeo.service';
import { VideoAddComponent } from '../video-add/video-add.component';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss']
})
export class VideoListComponent implements OnInit {
  
  form: any;
  videoTag: FormControl
  type: FormControl
  videos: any;


  constructor(public dialog: MatDialog,
    public es: EventService,
    public eds: EventDetailService,
    public vns: VenueService,
    private snackBar: MatSnackBar,
    public vs: VimeoService) {

  }

  displayedColumns: string[] = ['type','video','name','actions'];
  types: any = ['Teaser','Highlight', 'Full Edit']

  loading: boolean = false;

  private _videos = new BehaviorSubject([])

  get videoList() {
    return this._videos.asObservable()
  }

  videosDataSource = new MatTableDataSource<any>();
  
  public videosAsMatTableDataSource$: Observable<MatTableDataSource<any>> =
    this.videoList.pipe(
      map((videos) => {
        const dataSource = this.videosDataSource;
        dataSource.data = videos
        return dataSource;
      })
    );

  ngOnInit(): void {
    this.form = this.eds.form.get('data');
    this.videos = this.form.value.videos;
    this.videoTag = new FormControl('')
    this.type = new FormControl('')

    this.videosDataSource = new MatTableDataSource<any>()

    this.form.get('videos').valueChanges.subscribe(
    {
        next: (updatedValues) => {
          this.videos = updatedValues
          if (updatedValues) {
            let initialList = updatedValues.videos.map( x => {
              return {
                videoTag: x.videoTag,
                type: x.type,
                loading: true
              }
            })
            this._videos.next(initialList) // initial load

            let currentValues = this._videos.value

            currentValues.forEach(valueLookingForData => {
              
              this.vs.get(valueLookingForData.videoTag).subscribe(
              {
                  next: (restReply) => {
                    
                    // merge new data into initialList
                    initialList = initialList.map(initialListValue => {
                      if (initialListValue.videoTag === valueLookingForData.videoTag)
                      {
                         initialListValue.loading = false;
                         initialListValue.details = restReply;
                      }
                      return initialListValue;
                    })
                    
                    this._videos.next(initialList) // full data load
                  },
                  
                  error: (error) => {
                    console.log(error)
                  }
              })
            })
            console.log(currentValues)
          }
        }
      }
    )

  }

  onAddToVenue(video: any)
  {
    console.log(video)

    this.vns.addVideo(this.eds.venue.id, 
      {
        type: 'venue',
        video: {
          type: video.type,
          video: video.details,
          videoTag: video.videoTag
        }
      }).subscribe({
      next: (result) => {
        this.snackBar.open('video added to venue: ' + this.eds.venue.name  + ' successfully!', 'Close', {
          duration: 3000
        });
      },
      error: (error) => {
        alert(error.message)
      }
    })

  }

  onSave()
  {
    this.loading = true;
      if (!this.videos)
      {
        this.videos = {
          videos: []
        }
      }

      this.videos.videos.push({
        videoTag: this.videoTag.value,
        type: this.type.value
      })

      let save_payload = {
        data: this.videos,
        type: 'videos'
      }

      this.es.save(this.eds.eventId,save_payload).subscribe({
        next: (videos) => {
          
          this.form.get('videos').patchValue(videos);
          this.loading = false;
        },
        error: (error) => {
          alert(error.message)
        }
      })

  }

  onDelete(video: any) {
    
    this.loading = true;
    this.videos.videos = this.videos.videos.filter(x => x.videoTag !== video.videoTag)

    let save_payload = {
      data: this.videos,
      type: 'videos'
    }

    this.es.save(this.eds.eventId,save_payload).subscribe({
      next: (videos) => {
        
        this.form.get('videos').patchValue(videos);
        this.loading = false;
      },
      error: (error) => {
        alert(error.message)
      }
    })
  }

  // private load() {
  //   this.loading = true;

  //   this.eventService.get(this.eventId).subscribe({
  //     next: (event) => {
  //       console.log(event);
  //       this.dataSource.data = event.data.videos;
  //       this.loading = false;
  //     },
  //     error: (error) => {
  //       alert(error.mesage);
  //       this.loading = false;
  //     }
  //   });
  // }

  // upload($event: any): void {
  //   const dialogRef = this.dialog.open(VideoAddComponent, {
  //     width: '650px',
  //     data: {
  //       eventId: this.eventId
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (!result)
  //       return;
  //     console.log(result);
  //     this.load();
  //   });
  // }

}
