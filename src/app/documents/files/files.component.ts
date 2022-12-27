import { HttpClient, HttpEvent, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, map, Observable, Subscription, tap } from 'rxjs';
import { EventDetailService } from 'src/app/services/event-detail.service';
import { EventService } from 'src/app/services/event.service';
import { FileService } from 'src/app/services/file.service';


@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {
loading: any;
 


  columns: any = ['type', 'description', 'path','actions']
  types: any = ['CERT', 'Executed Contract', 'Other']

  
  selectedFiles: FileList;
  currentFileUpload: File;
  file_form: any
  form: any

  private _files = new BehaviorSubject([])

  get fileList() {
    return this._files.asObservable()
  }

  files = new MatTableDataSource<any>();

  public eventsAsMatTableDataSource$: Observable<MatTableDataSource<any>> =
  
  this.fileList.pipe(
    map((events) => {
      console.log("here")
      console.log(events)
      const dataSource = this.files;
      dataSource.data = events
      return dataSource;
    })
  );



  constructor(private fb: FormBuilder,
    private fileService: FileService,
    private snackBar: MatSnackBar,
    private eds: EventDetailService,
    private es: EventService,
    ) { }


  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  clickRow(fileName: any) {
    
    this.loading = true;
    
    this.fileService.delete(fileName).subscribe( 
    {
      next: (result) => {

        let form_files = this.form.value.files;

        let files_list = form_files.files;

        console.log(files_list)
        files_list = files_list.filter( x => x.fileName !== fileName)
        console.log(files_list)
        
        form_files.files = files_list;

        let save_payload = {
          type: 'files',
          data:  form_files
        }

        this.es.save(this.eds.eventId,save_payload).subscribe(
          {
            next: (files) => {
              this.form.get('files').patchValue(files)
             
              this.loading = false;
            },

            error: (error) => {
              alert(error.message)
              this.loading = false;
            }
          }
        )
        
        
      },

      error: (error) => {
        alert(error.message)
        this.loading = false;
      }
    })

  }

  // Uploads the file to backend server.
  upload() {
    this.loading = true;
    this.currentFileUpload = this.selectedFiles.item(0);
    const formData: FormData = new FormData();
    formData.append('file', this.currentFileUpload);
    
    this.fileService.post(this.eds.eventId,formData).subscribe( 
        {
           next: (event) => {

            let file_detail = event;

            let file_details = {
              fileName: file_detail.fileName,
              fileUrl: file_detail.fileUrl,
              type: this.file_form.value.type,
              description: this.file_form.value.description,
            }

            let files = this.form.value.files;
            if (!files)
            {
              files = {
                files: [file_details]
              }
            }
            else{
              files.files.push(file_details)
            }

            let save_payload = {
              type: 'files',
              data:  files
            }

            this.es.save(this.eds.eventId,save_payload).subscribe(
              {
                next: (files) => {
                  this.form.get('files').patchValue(files)
                  this.file_form.reset()
                  this.loading = false;
                },

                error: (error) => {
                  alert(error.message)
                  this.loading = false;
                }
              }
            )

            this.snackBar.open('File uploaded successfully!', 'Close', {
              duration: 3000
            });

           
        },
        error: (error) => {
          alert(error.message)
          this.loading = false;
        }
      });
  }

  


  ngOnInit(): void {

    this.form = this.eds.form.get('data')
    

    this.files = new MatTableDataSource<any>()

    this.form.get('files').valueChanges.subscribe(
      {
        next: (files) => {
          if (files)
          {
            console.log(files)
            this._files.next(files.files)
            console.log(this.fileList)
          }
        }
      }
    )

    this.files
    this.file_form = this.fb.group({
      type: [],
      description: [],
      file: [] 
    })

    

    this.file_form.get('type').valueChanges.subscribe(
      {
        next: (value) => {
          if (value !== 'Other')
            if (this.form.get('description').untouched) {
              this.form.get('description').patchValue(value + ":")
            }

        }
      }
    )
  }







}
