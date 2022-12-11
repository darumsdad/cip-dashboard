import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { EventService } from 'src/app/services/event.service';
import { VideoAddComponent } from '../video-add/video-add.component';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss']
})
export class VideoListComponent implements OnInit {


  constructor( public dialog: MatDialog,
    public eventService: EventService) { }

  @Input()
  eventId: any

  displayedColumns: string[] = ['type','name','video','actions'];
  dataSource = new MatTableDataSource<any>();
  loading: boolean = false;

  ngOnInit(): void {
    
    this.load();
  }

  on_delete_video(tag: any) {
    this.loading = true;
    this.eventService.delete_video(this.eventId, {
      videoTag: tag
    }).subscribe({
      next: (event) => {
        console.log(event);
        this.load();
        this.loading = false;
      },
      error: (error) => {
        alert(error.mesage);
        this.loading = false;
      }
    });
  }

  private load() {
    this.loading = true;

    this.eventService.get(this.eventId).subscribe({
      next: (event) => {
        console.log(event);
        this.dataSource.data = event.data.videos;
        this.loading = false;
      },
      error: (error) => {
        alert(error.mesage);
        this.loading = false;
      }
    });
  }

  upload($event: any): void {
    const dialogRef = this.dialog.open(VideoAddComponent, {
      width: '650px',
      data: {
        eventId: this.eventId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result)
        return;
      console.log(result);
      this.load();
    });
  }

}
