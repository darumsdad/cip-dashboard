import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { VimeoService } from 'src/app/services/vimeo.service';

@Component({
  selector: 'app-video-details',
  templateUrl: './video-details.component.html',
  styleUrls: ['./video-details.component.scss']
})
export class VideoDetailsComponent implements OnInit {


  form: any;
  eventId: any;
  videoTag: any;

  displayedColumns: string[] = ['name','link'];
  dataSource = new MatTableDataSource<any>();
  loading: boolean = false;

  

  
  constructor(
    public vimeoService: VimeoService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {

    this.eventId = this.route.snapshot.params['id'];

    this.videoTag = new FormControl()

    console.log(this.eventId)
  }

  load($event: MouseEvent) {
    this.vimeoService.get(this.videoTag.value).subscribe(
      {
        next: (video) => {
          console.log(video);
          
        },
        error: (error) => {
          alert(error.message);
        }
      }
    )
  }

}
