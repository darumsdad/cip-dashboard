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
import { SearchComponent } from 'src/app/video/search/search.component';


@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss']
})
export class VideoListComponent implements OnInit {
  
  form: any;
  url: FormControl
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

  search()
  {
    
     
      const dialogRef = this.dialog.open(SearchComponent, {
        width: '100%',
        height: '80%'
      });
  
      dialogRef.afterClosed().subscribe(result => {
        this.url.patchValue(result.details.link)
      });
     
  
  }
  
  ngOnInit(): void {

    this.form = this.eds.form.get('data');
   
    this.url = new FormControl('')
    this.type = new FormControl('')

    this.videosDataSource = new MatTableDataSource<any>()

    this.form.get('videos').valueChanges.subscribe(
    {
        
        next: (videos) => {
          this.videos = videos
          if (videos) {
            
            let initialList = videos.videos.map( x => {
              return {
                uri: x.uri,
                type: x.type,
                loading: true
              }
            })
            
            this._videos.next(initialList) // initial load

            let uris = videos.videos.map( video => video.uri).join(",")

            let search = {
              uri: uris
            }
     
            this.vs.searchVideo(search).subscribe(
            {
                next: (videos) => {
                  if (!videos ||  !videos.data)
                    return 
                  videos.data.forEach( video => {
                    let uri = video.uri
                    initialList.forEach( initialVideo => {
                      if (initialVideo.uri === uri)
                      {
                        initialVideo.loading = false;
                        initialVideo.details = video
                      }
                    })
                  })
 
                  this._videos.next(initialList) // full data load
                },
                
                error: (error) => {
                  console.log(error)
                }
            })
            
            
          }
        }
      }
    )

  }

  
  onAddToVenue(video: any)
  {
    this.loading = true;

    let save_payload = {
      data: {
        uri: video.uri
      },
      type: 'patchVenue'
    }

    this.vns.saveVideo(this.eds.venue.id, save_payload).subscribe({
      next: (result) => {
        this.loading = false;
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

      let peices = this.url.value.split("/")
      if (peices.length < 2)
      {
        alert("Invalid URL ")
        return;
      }

      let uri = "/videos/" + peices[peices.length - 2]
      this.videos.videos.push({
        uri: uri,
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
          this.url.reset()
        },
        error: (error) => {
          alert(error.message)
        }
      })

  }

  onDelete(video: any) {
    
    this.loading = true;
    this.videos.videos = this.videos.videos.filter(x => x.uri !== video.uri)

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

  

}
