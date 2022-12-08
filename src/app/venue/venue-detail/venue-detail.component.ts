import { ResourceLoader } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

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

  displayedColumns: string[] = ['name','link'];
  dataSource = new MatTableDataSource<any>();
  loading: boolean = false;


  constructor(public venueService: VenueService,
    public vimeoService: VimeoService,
    private route: ActivatedRoute,
    private router: Router,
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

    this.reload();
  
  }

  private reload() {
    this.loading = true;
    this.venueService.get(this.venueId).subscribe({
      next: (venue) => {
        console.log(venue)
        this.form.patchValue(venue);
        this.dataSource.data = venue.venueData;
        this.loading = false;
      },
      error: (error) => {
      }
    });
  }

  upload($event: MouseEvent) {
    this.vimeoService.put(this.venueId, { tag: this.videoTag.value} ).subscribe(
      {
        next: (video) => {
          console.log(video);
          this.reload();
        },
        error: (error) => {
          alert(error.message);
        }
      }
    )
  }

}
