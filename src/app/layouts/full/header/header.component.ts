import { ChangeDetectionStrategy, Component, inject, OnInit, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { BehaviorSubject, Observable } from 'rxjs';
import { Item } from 'src/app/items/interfaces/item.interface';
import { ItemService } from 'src/app/items/services/item.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHeaderComponent implements OnInit{



  public listItemsNotifications : Item[] = [];

  public itemObservable? : Observable<Item>;

  readonly menuTrigger = viewChild.required(MatMenuTrigger);

  readonly dialog = inject(MatDialog);

  private notificationsCount = new BehaviorSubject<number>(0);

  public notificationsCount$ = this.notificationsCount.asObservable();

  constructor( private itemService : ItemService){
  }
  ngOnInit(): void {

    this.itemService.getItemSubject().subscribe( data => {

      if(data != null){
        this.listItemsNotifications.push(data);
        this.notificationsCount.next(this.listItemsNotifications.length);
      }
    }
    );
  }

  openDialog(item : Item , index : number) {

    this.listItemsNotifications.splice(index , 1);
    this.notificationsCount.next(this.listItemsNotifications.length);
    const dialogRef = this.dialog.open(DialogFromMenuExampleDialog, { data : item ,restoreFocus: false , hasBackdrop : true , width : '300px'} ,);

    dialogRef.afterClosed().subscribe(() => this.menuTrigger().focus());
  }

}


@Component({
  selector: 'dialog-from-menu-dialog',
  templateUrl: 'dialog-notifications.html',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogFromMenuExampleDialog {

  public item! : Item;
  readonly dialogRef = inject(MatDialogRef<DialogFromMenuExampleDialog>);
  readonly data = inject<Item>(MAT_DIALOG_DATA);

  constructor() {
    this.item = this.data;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
