import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { EventService } from 'src/app/services/event.service';


@Component({
  selector: 'app-jot-form',
  templateUrl: './jot-form.component.html',
  styleUrls: ['./jot-form.component.scss']
})
export class JotFormComponent implements OnInit {

  constructor(public s: EventService, private _snackBar: MatSnackBar) { }

  displayedColumns: string[] = ['name', 'id', 'applied','actions'];
  dataSource = new MatTableDataSource<any>();

  @Input()
  eventId: any

  ngOnInit(): void {

    this.reload();

  }

  private reload() {
    this.s.get(this.eventId).subscribe({
      next: (e) => {
        console.log(e.data.submissions);
        this.dataSource.data = e.data.submissions;
      },
      error: (e) => { }
    });
  }

  applySubmission(submissionId: any, formId: any)
  {
      this.s.submission(this.eventId,
        {
          submissionId: submissionId,
          formId: formId
        }
        ).subscribe(
        {
          next: (e) => {
            this.reload();
            this._snackBar.openFromComponent(SubmissionStatusComponent, {
              duration: 3000,
              data: {
                status : 'OK'
              }
              
            });
          },
          error: (e) => {
            console.log(e);
            this.reload();
            this._snackBar.openFromComponent(SubmissionStatusComponent, {
              duration: 3000,
              data: {
                
                status : e.error
              }
              
            });
          }
        }
      )
  }

}

@Component({
  selector: 'submission-status',
  templateUrl: './submission-status.html',
  styles: [],
})
export class SubmissionStatusComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public status: any) {}
}
