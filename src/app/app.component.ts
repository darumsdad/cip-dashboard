import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SearchComponent } from './video/search/search.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cip-dashboard';

  openSidebar: any

  constructor(public dialog: MatDialog)
  {
    
  }

  onSearch()
  {
    const dialogRef = this.dialog.open(SearchComponent, {
      width: '100%',
      height: '80%'
    });

    dialogRef.afterClosed().subscribe(result => {

      console.log(result)
      if (!result)
        return;

     
    });
  }
}
