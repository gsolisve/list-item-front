import { Overlay } from '@angular/cdk/overlay';
import { NgFor, NgIf } from '@angular/common';
import { Component, inject, TemplateRef, ViewChild, ViewContainerRef, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DialogCategory } from 'src/app/items/interfaces/dialogCategory.interface copy';
import { DialogItem } from 'src/app/items/interfaces/dialogItem.interface';
import { Category, Item } from 'src/app/items/interfaces/item.interface';
import { Page } from 'src/app/items/interfaces/page.interface';
import { CategoryService } from 'src/app/items/services/category.service';
import { ItemService } from 'src/app/items/services/item.service';
import { ChipColor } from '../../../material-component/chips/chips.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxColorsModule } from 'ngx-colors';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [ MatIconModule, MatButtonModule , MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, NgIf],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Item>;
  @ViewChild('progressSpinnerRef')
  private progressSpinnerRef!: TemplateRef<any>;
  readonly dialog = inject(MatDialog);
  public items!: Page<Category>;
  public category? : Category;
  public dataSource!: MatTableDataSource<Category>;
  public displayedColumns: string[] = ['name', 'color', 'Acciones',];
  public isLoad = false;
  private _snackBar = inject(MatSnackBar);
  constructor(private categoryService: CategoryService, private overlay: Overlay, private vcRef: ViewContainerRef) {

  }
  ngOnInit(): void {
    this.getAllItems();
  }

  openDialog(){
    const dialogRef = this.dialog.open(DialogCategoryDialog, {
      data: { title: 'Agregar Categoría', item: {}, buttonName: 'Agregar' },
    });

    this.closeDialogItem(dialogRef);
  }

  openEditDialog(item: Category): void {
    const dialogRef = this.dialog.open(DialogCategoryDialog, {
      data: { title: 'Modificar Categoría', category: item, buttonName: 'Modificar' },
    });

    this.closeDialogItem(dialogRef);
  }

  closeDialogItem(dialogRef: MatDialogRef<DialogCategoryDialog>) {
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.openSnackBar(result);
      }
      this.getAllItems();
    });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "", {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  getAllItems() {
    this.categoryService.getCategories().subscribe(data => {
      this.items = data;
      console.log(data);
      this.updateTableData();

    });
  }

  updateTableData() {
    this.dataSource = new MatTableDataSource(this.items.content);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (this.table && this.table.dataSource) {
      this.table.renderRows();
      this.isLoad = false;
      //this.removeOverlay();
    }
  }

  editItem( idCategory : number){
    this.categoryService.getCategory(idCategory).subscribe(data => {
      this.category = data;
      this.openEditDialog(this.category);
    });
  }

  deleteItem( idCategory : number){
    this.categoryService.deleteCategory(idCategory).subscribe({
      next : data => {
      if (data) {
        this.getAllItems();
        this.openSnackBar("¡Item Eliminado!");
      }
    },
    error: (error) => {
      console.log(error);
      if(error && error.status == 500 ){
        this.openSnackBar('Esta categoría cuenta con items activos');
      }
    }
    });
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-save-category.html',
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
    NgxColorsModule,
    NgFor,
    NgIf
  ],
})
export class DialogCategoryDialog implements OnInit {
  readonly dialogRef = inject(MatDialogRef<DialogCategoryDialog>);
  readonly data = inject<DialogCategory>(MAT_DIALOG_DATA);
  public category: Category;
  public title: String;
  public nameButton: String;
  public categoryForm: FormGroup;

  onNoClick(): void {
    this.dialogRef.close();
  }

  constructor(private categoryService: CategoryService, private itemService: ItemService, private fb: FormBuilder) {
    this.category = this.data.category || { id: 0, name: '', status: 'true', color: '' } ;
    this.title = this.data.title || 'Nueva Categoría';
    this.nameButton = this.data.buttonName || '';

    this.categoryForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(100)
      ]],
      color: ['', [
        Validators.required
      ]],

    });
  }

  ngOnInit(): void {
    this.setValues();
  }

  get nameField() {
    return this.categoryForm.get('name');
  }

  get colorField() {
    return this.categoryForm.get('color');
  }



  setValues() {
    if (this.data.category) {
      this.categoryForm.patchValue({
        name: this.data.category.name,
        color: this.data.category.color
      });
    }
  }


  acceptButton() {
    console.log("Category" , this.category);
    if (this.category.id != 0 && this.category.id != null) {
      this.updateItem();
    } else {
      this.saveItem();
    }
  }

  updateItem(): void {
    this.buildItemObject();
    this.categoryService.updateCategory(this.category.id, this.category).subscribe(
      data => {
        this.dialogRef.close('¡Categoría Actualizada!');
      }
    );
  }

  saveItem(): void {

    //this.buildCategoryAndStatus();
    if (this.categoryForm.valid) {

      this.buildItemObject();
      this.categoryService.saveCategory(this.category).subscribe(
        data => {
          this.dialogRef.close('¡Categoría Creada!');
        }
      );
    }

  }

  buildItemObject() {
    const formData = this.categoryForm.value;
    this.category.name = formData.name;
    this.category.color = formData.color;
    this.category.status = true;

  }

}

