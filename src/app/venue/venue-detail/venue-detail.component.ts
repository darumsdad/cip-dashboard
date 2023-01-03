
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, map, Observable } from 'rxjs';
import { VideoAddComponent } from 'src/app/documents/video-add/video-add.component';
import { EventService } from 'src/app/services/event.service';

import { VenueService } from 'src/app/services/venue.service';
import { VimeoService } from 'src/app/services/vimeo.service';
import { SearchComponent } from 'src/app/video/search/search.component';

@Component({
  selector: 'app-venue-detail',
  templateUrl: './venue-detail.component.html',
  styleUrls: ['./venue-detail.component.scss']
})
export class VenueDetailComponent implements OnInit {

  form: any;
  venueId: any;
  videoTag: any;
  url: FormControl = new FormControl('')

  proposalColumns: string[] = ['name', 'link', 'actions'];
  venueColumns: string[] = ['name', 'link', 'actions'];
  clientColumns: string[] = ['description', 'name', 'video', 'actions'];
  videosForVenueDataSource = new MatTableDataSource<any>();
  videosForProposalDataSource = new MatTableDataSource<any>();

  loading: boolean = false;
  videosForVenue: any;
  videosForProposal: any;

  constructor(
    public venueService: VenueService,
    public eventService: EventService,
    public vimeoService: VimeoService,
    private route: ActivatedRoute,
    private vs: VimeoService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public fb: FormBuilder,
  ) { }

  private _videosForVenue = new BehaviorSubject([])

  get videosForVenueList() {
    return this._videosForVenue.asObservable()
  }

  public videosForVenueAsMatTableDataSource$: Observable<MatTableDataSource<any>> =
    this.videosForVenueList.pipe(
      map((videos) => {
        const dataSource = this.videosForVenueDataSource;
        dataSource.data = videos
        return dataSource;
      })
    );


  private _videosForProposal = new BehaviorSubject([])

  get videosForProposalList() {
    return this._videosForProposal.asObservable()
  }

  public videosForProposalAsMatTableDataSource$: Observable<MatTableDataSource<any>> =
    this.videosForProposalList.pipe(
      map((videos) => {
        const dataSource = this.videosForProposalDataSource;
        dataSource.data = videos
        return dataSource;
      })
    );

  ngOnInit(): void {

    this.venueId = this.route.snapshot.params['id'];

    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      address: new FormControl(),
      city: new FormControl(),
      state: new FormControl(),
      zip: new FormControl(),
      phone: new FormControl(),
      venueData: this.fb.group({
        videosForVenue: [''],
        videosForProposal: ['']
      })
    });

    this.venueService.get(this.venueId).subscribe({
      next: (venue) => {
        console.log(venue)
        this.form.patchValue(venue);
      },

      error: (error) => {
        alert(error.message)
      }
    });


    this.form.get('venueData').get('videosForVenue').valueChanges.subscribe({

        next: (videos) => {
          this.videosForVenue = videos
          if (videos) {

            let initialList = videos.map(x => {
              return {
                uri: x.uri,
                type: x.type,
                loading: true
              }
            })

            this._videosForVenue.next(initialList) // initial load

            let uris = videos.map(video => video.uri).join(",")

            let search = {
              uri: uris
            }

            this.vs.searchVideo(search).subscribe(
              {
                next: (videos) => {
                  if (!videos || !videos.data)
                    return
                  videos.data.forEach(video => {
                    let uri = video.uri
                    initialList.forEach(initialVideo => {
                      if (initialVideo.uri === uri) {
                        initialVideo.loading = false;
                        initialVideo.details = video
                      }
                    })
                  })

                  this._videosForVenue.next(initialList) // full data load
                },

                error: (error) => {
                  console.log(error)
                }
              })


          }
        }
      }
    )

    this.form.get('venueData').get('videosForProposal').valueChanges.subscribe({

      next: (videos) => {
        this.videosForProposal = videos
        if (videos) {

          let initialList = videos.map(x => {
            return {
              uri: x.uri,
              type: x.type,
              loading: true
            }
          })

          this._videosForProposal.next(initialList) // initial load

          let uris = videos.map(video => video.uri).join(",")

          let search = {
            uri: uris
          }

          this.vs.searchVideo(search).subscribe(
            {
              next: (videos) => {
                if (!videos || !videos.data)
                  return
                videos.data.forEach(video => {
                  let uri = video.uri
                  initialList.forEach(initialVideo => {
                    if (initialVideo.uri === uri) {
                      initialVideo.loading = false;
                      initialVideo.details = video
                    }
                  })
                })

                this._videosForProposal.next(initialList) // full data load
              },

              error: (error) => {
                console.log(error)
              }
            })


        }
      }
    }
  )


    //this.load();

  }

  addVideoToVenue() {
    this.loading = true;
    if (!this.videosForVenue) {
      this.videosForVenue = []
    }

    let peices = this.url.value.split("/")
    if (peices.length < 2) {
      alert("Invalid URL ")
      return;
    }

    let uri = "/videos/" + peices[peices.length - 2]
    this.videosForVenue.push({
      uri: uri
    })

    let save_payload = {
      data: this.videosForVenue,
      type: 'venue'
    }

    this.venueService.saveVideo(this.venueId, save_payload).subscribe({
      next: (videos) => {
        this.loading = false;
        this.form.get("venueData").get("videosForVenue").patchValue(videos);
        this.url.reset()
       
      },
      error: (error) => {
        alert(error.message)
      }
    })

  }

  search() {
    const dialogRef = this.dialog.open(SearchComponent, {
      width: '100%',
      height: '80%'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.url.patchValue(result.details.link)
    });
   
  }

  



  delete_video_from_venue(uri: any) {

    let save_set = this.videosForVenue.filter(x => x.uri !== uri)

    let save_payload = {
      data: save_set,
      type: 'venue'
    }

    this.venueService.saveVideo(this.venueId, save_payload).subscribe({
      next: (videos) => {
        this.loading = false;
        this.form.get("venueData").get("videosForVenue").patchValue(videos);
        this.url.reset()
       
      },
      error: (error) => {
        alert(error.message)
      }
    })
  

  }

  delete_video_from_proposal(uri: any) {
    
    let save_set = this.videosForProposal.filter(x => x.uri !== uri)

    let save_payload = {
      data: save_set,
      type: 'proposal'
    }

    this.venueService.saveVideo(this.venueId, save_payload).subscribe({
      next: (videos) => {
        this.loading = false;
        this.form.get("venueData").get("videosForProposal").patchValue(videos);
        this.url.reset()
       
      },
      error: (error) => {
        alert(error.message)
      }
    })
  


  }

  addToProposal(uri: any) {

    this.loading = true;
    if (!this.videosForProposal) {
      this.videosForProposal = []
    }

    this.videosForProposal.push({
      uri: uri
    })

    let save_payload = {
      data: this.videosForProposal,
      type: 'proposal'
    }

    this.venueService.saveVideo(this.venueId, save_payload).subscribe({
      next: (videos) => {
        this.loading = false;

        this.snackBar.open('video added to venue: successfully!', 'Close', {
          duration: 3000
        });

        this.form.get("venueData").get("videosForProposal").patchValue(videos);
        
        
       
      },
      error: (error) => {
        alert(error.message)
      }
    })
  }
}


// private load() {

//   this.loading = true;

//   this.venueService.get(this.venueId).subscribe({

//     next: (venue) => {

//       console.log(venue)
//       this.form.patchValue(venue);

//       if (venue.venueData) {

//         this.videosForVenue = venue.venueData.videosForVenue
//         let videos = this.videosForVenue
//         if (videos) {

//           let initialList = videos.map(x => {
//             return {
//               uri: x.uri,
//               type: x.type,
//               loading: true
//             }
//           })

//           this._videosForVenue.next(initialList) // initial load

//           let uris = videos.map(video => video.uri).join(",")

//           let search = {
//             uri: uris
//           }

//           this.vs.searchVideo(search).subscribe(
//             {
//               next: (videos) => {
//                 if (!videos || !videos.data)
//                   return
//                 videos.data.forEach(video => {
//                   let uri = video.uri
//                   initialList.forEach(initialVideo => {
//                     if (initialVideo.uri === uri) {
//                       initialVideo.loading = false;
//                       initialVideo.details = video
//                     }
//                   })
//                 })

//                 this._videosForVenue.next(initialList) // full data load
//               },

//               error: (error) => {
//                 console.log(error)
//               }
//             })


//         }
//       }

//       let videos = venue.venueData.videosForProposal
//       if (videos) {

//         let initialList = videos.map(x => {
//           return {
//             uri: x.uri,
//             type: x.type,
//             loading: true
//           }
//         })

//         this._videosForProposal.next(initialList) // initial load

//         let uris = videos.map(video => video.uri).join(",")

//         let search = {
//           uri: uris
//         }

//         this.vs.searchVideo(search).subscribe(
//           {
//             next: (videos) => {
//               if (!videos || !videos.data)
//                 return
//               videos.data.forEach(video => {
//                 let uri = video.uri
//                 initialList.forEach(initialVideo => {
//                   if (initialVideo.uri === uri) {
//                     initialVideo.loading = false;
//                     initialVideo.details = video
//                   }
//                 })
//               })

//               this._videosForProposal.next(initialList) // full data load
//             },

//             error: (error) => {
//               console.log(error)
//             }
//           })

//       }

//       this.loading = false;
//     },
//     error: (error) => {
//       alert(error.message)
//       this.loading = false;
//     }
//   });
// }