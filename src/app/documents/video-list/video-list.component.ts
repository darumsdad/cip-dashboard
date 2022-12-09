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

  displayedColumns: string[] = ['type','name','link'];
  dataSource = new MatTableDataSource<any>();
  loading: boolean = false;

  ngOnInit(): void {
    this.loading = true;
    this.eventService.get(this.eventId).subscribe({
      next: (event) => {
        console.log(event);
        this.dataSource.data = event.data.videos
        this.loading = false;
      },
      error: (error) => {
        alert(error.mesage)
        this.loading = false;
      }
    })
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
    });
  }

}
