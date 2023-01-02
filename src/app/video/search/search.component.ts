import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { VimeoService } from 'src/app/services/vimeo.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor(private vs: VimeoService ,
    public dialog: MatDialogRef<SearchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  url: FormControl = new FormControl('')
  filter: FormControl = new FormControl('')
  loading: boolean = false;
  filters : any = ["Most Recent"]

  seachUrl()
  {
    this._search({
      url: this.url.value
    })
  }

  ngOnInit(): void {
    //this._videos.next([{loading: true},{loading: true},{loading: true}])
    //this._search({});
  }

  search()
  {
    if (this.url.value !== "")
    {
      this.seachUrl()
    }
    else
    {
      this._search({
      })
    }
  }

  private _search(predicate: any)
  {
    this.loading = true;
    this._videos.next([])
    this.vs.searchVideo(predicate).subscribe(
      {
        next: (videos) => {
          this.prepareVideo(videos)
          this.loading = false;
        }
      }
    )
  }

  public select(video: any)
  {
    this.dialog.close(video);
  }

  private prepareVideo(videos: any)
  {
    let videosToShow = videos.data.map(video => {
      return {
        details: video,
        loading: false
      }
    })
    this._videos.next(videosToShow)
  }

  public  displayedColumns = ['name','created','video','actions']

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

}
