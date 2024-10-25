import { Component, OnInit, ViewChild, AfterViewInit, inject, model, EventEmitter, Output, ViewContainerRef, TemplateRef } from '@angular/core';
import { Page } from 'src/app/items/interfaces/page.interface';
import { ItemService } from '../../../items/services/item.service';
import { Category, Item } from 'src/app/items/interfaces/item.interface';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { CategoryService } from 'src/app/items/services/category.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogItem } from 'src/app/items/interfaces/dialogItem.interface';

const initialSelection: Item[] = [];
const allowMultiSelect = true;

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [DemoMaterialModule, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, NgIf],
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss'
})
export class ItemsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Item>;
  @ViewChild('progressSpinnerRef')
  private progressSpinnerRef!: TemplateRef<any>;
  readonly dialog = inject(MatDialog);
  public displayedColumns: string[] = ['name', 'price', 'quantity', 'Categoria', 'Estado', 'Acciones', 'select'];
  public items!: Page<Item>;
  public item?: Item;
  public selection = new SelectionModel<Item>(allowMultiSelect, initialSelection);
  public dataSource!: MatTableDataSource<Item>;
  public isLoad: boolean = false;
  private overlayRef?: OverlayRef;
  private _snackBar = inject(MatSnackBar);
  constructor(private itemService: ItemService, private overlay: Overlay, private vcRef: ViewContainerRef) {

  }


  ngOnInit(): void {
    this.getAllItems();

    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      positionStrategy: this.overlay.position()
        .global()
        .centerHorizontally()
        .centerVertically()
    });
  }

  getAllItems() {
    this.itemService.getListItem().subscribe(data => {
      this.items = data;
      this.updateTableData();

    });
  }

  addOverlay() {
    let templatePortal = new TemplatePortal(this.progressSpinnerRef, this.vcRef);
    this.overlayRef?.attach(templatePortal);
  }

  removeOverlay() {
    this.overlayRef?.detach();
  }

  editItem(idItem: number) {
    this.itemService.getItem(idItem).subscribe(data => {
      this.item = data;
      this.openEditDialog(this.item);
    });
  }

  updateStatus(): void {
    if (this.selection.selected.length > 0) {
      this.isLoad = true;
      this.addOverlay();
      this.itemService.updateStatus(this.selection.selected).subscribe(data => {
        if (data) {
          this.openSnackBar("Item(s) actualizados");
          this.getAllItems();

        }
        this.selection.clear();
      });
    }
  }


  deleteItem(idItem: number) {
    this.itemService.deleteItem(idItem).subscribe(data => {
      if (data) {
        this.getAllItems();
        this.openSnackBar("¡Item Eliminado!");
      }
    });
  }

  updateTableData() {
    this.dataSource = new MatTableDataSource(this.items.content);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (this.table && this.table.dataSource) {
      this.table.renderRows();
      this.isLoad = false;
      this.removeOverlay();
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: { title: 'Agregar Item', item: {}, buttonName: 'Agregar' },
    });

    this.closeDialogItem(dialogRef);
  }

  openEditDialog(item: Item): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: { title: 'Modificar Item', item: item, buttonName: 'Modificar' },
    });

    this.closeDialogItem(dialogRef);
  }

  closeDialogItem(dialogRef: MatDialogRef<DialogOverviewExampleDialog>) {
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.openSnackBar(result);
      }
      this.getAllItems();
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }



  openSnackBar(message: string) {
    this._snackBar.open(message, "", {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-save-item.html',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatSelectModule,
    NgFor,
    NgIf
  ],
})
export class DialogOverviewExampleDialog implements OnInit {
  readonly dialogRef = inject(MatDialogRef<DialogOverviewExampleDialog>);
  readonly data = inject<DialogItem>(MAT_DIALOG_DATA);
  public item: Item;
  public title: String;
  public nameButton: String;
  public categories!: Page<Category>;
  public idCategory: number;
  public productForm: FormGroup;

  onNoClick(): void {
    this.dialogRef.close();
  }

  constructor(private categoryService: CategoryService, private itemService: ItemService, private fb: FormBuilder) {
    this.item = this.data.item || { id: 0, name: '', quantity: 0, price: 0, status: { id: 0, name: '', status: true }, image: '', expireDate: null, category: { id: 1, name: '', status: 'true', color: '' } };
    this.title = this.data.title || 'Nuevo Item';
    this.nameButton = this.data.buttonName || '';
    this.categories = {
      content: [], last: true, totalPages: 0, totalElements: 0, size: 0, number: 0, first: true, numberOfElements: 0, empty: false
      , sort: { empty: false, sorted: true, unsorted: true },
      pageable: { pageNumber: 0, pageSize: 0, offset: 0, paged: true, unpaged: true, sort: { empty: false, sorted: true, unsorted: true } }
    };

    this.idCategory = this.data.item.category?.id || 0;

    this.productForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(100)
      ]],
      quantity: ['', [
        Validators.required,
        Validators.min(0)
      ]],
      price: ['', [
        Validators.required,
        Validators.min(0)
      ]],
      category: ['', [
        Validators.required
      ]]
    });
  }

  ngOnInit(): void {
    this.getCategories();
    this.setValues();
  }

  get nameField() {
    return this.productForm.get('name');
  }

  get quantityField() {
    return this.productForm.get('quantity');
  }

  get priceField() {
    return this.productForm.get('price');
  }

  get categoryField() {
    return this.productForm.get('category');
  }

  setValues() {
    if (this.data.item) {
      this.productForm.patchValue({
        name: this.data.item.name,
        quantity: this.data.item.quantity,
        price: this.data.item.price,
        category: this.data.item.category.id
      });
    }
  }
  getCategories() {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;

    });
  }

  acceptButton() {
    if (this.item.id != 0 && this.item.id != null) {
      this.updateItem();
    } else {
      this.saveItem();
    }
  }

  updateItem(): void {
    this.buildItemObject();
    this.itemService.updateItem(this.item.id, this.item).subscribe(
      data => {
        this.dialogRef.close('¡Item Actualizado!');
      }
    );
  }

  saveItem(): void {

    //this.buildCategoryAndStatus();
    if (this.productForm.valid) {

      this.buildItemObject();
      this.itemService.saveItem(this.item).subscribe(
        data => {
          this.dialogRef.close('¡Item Creado!');
        }
      );
    }

  }

  buildItemObject() {
    const formData = this.productForm.value;
    this.item.name = formData.name;
    this.item.quantity = formData.quantity;
    this.item.price = formData.price;
    this.buildCategoryAndStatus();
  }

  buildCategoryAndStatus() {
    this.item.category = { "id": this.productForm.value.category, color: '', name: '', status: true };
    this.item.status = { id: 1, name: '', status: true };
  }
}
