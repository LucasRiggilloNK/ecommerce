import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ProductInterface2 } from '../../../interfaces/product/product-interface2';
import { Brand } from '../../../models/products/brands/brand';
import { Category } from '../../../models/products/categories/category';
import { ProductService } from '../../../services/product/product.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductcCharacteristicsService } from '../../../services/product/product-characteristics.service';
import { GeneralCharacteristics } from '../../../interfaces/product/characteristics/general-characteristics';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css'
})
export class CreateProductComponent implements OnInit{

  


  createProductFormGroup: FormGroup;
  categoryList: string[] = Object.values(Category).sort();
  brandList: string[] = Object.values(Brand).sort();
  selectedCategory: string = '';

  productAdded: boolean = false;
  productNotAdded: boolean = false;

  private product: ProductInterface2;
  
  
  characteristicsFormValid: boolean = false;
  _generalCharacteristicsFormValid: boolean = false;

  generalCharacteristicsOnly: boolean = true;

  resetFormGeneralAndCharacteristics: boolean = false;
  

  //// EDIT PRODUCT////
  id: string = "";
  productoToEdit: ProductInterface2;
  


  constructor(private productService: ProductService, private productCharacteristicsService: ProductcCharacteristicsService, private cdr: ChangeDetectorRef, 
              private route: ActivatedRoute){

    this.product = this.initProductInterface();/// carga un producto vacío
    

    this.createProductFormGroup = new FormGroup({
      brand: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      urlImage: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
      price: new FormControl('', [Validators.required, Validators.min(0.01)]),
      stock: new FormControl('', [Validators.required, Validators.min(1)]),
      model: new FormControl("", [Validators.required]),


    });


    ///// EDIT PRODUCT  /////
    this.productoToEdit = this.initProductInterface();/// carga un producto vacío para reemplazar y editar
  }


  ngOnInit(): void {


    
    let allBrandsIndex = this.brandList.indexOf(Brand.ALL);
    this.brandList.splice(allBrandsIndex, 1);// Elimina todos en la lista para crear

    let allCategoriesIndex = this.categoryList.indexOf(Category.ALL);
    this.categoryList.splice(allCategoriesIndex, 1);// Elimina todos en la lista para crear

    ////// PRODUCT EDIT ///////

    let id = this.route.snapshot.paramMap.get("id");
    if(id != null){
      this.id = id;
      this.getProductoToEdit(this.id).subscribe({
        next: response =>{
          this.productoToEdit = response;
          this.setFormGroupToEdit(this.productoToEdit);
          



        },
        error: error =>{
          console.log("Error al buscar producto a editar")
        }
      });
    }

    /////  CREATE PRODUCT  //////

    this.createProductFormGroup.get("category")?.valueChanges.subscribe(() =>{
      
      this.productCharacteristicsService.setCharacteristics(this.productCharacteristicsService.initCharacteristics());
      this.setGeneralCharacteristicsOnly();
      this.resetFormGeneralAndCharacteristics = false;
    });





   

    
    



    


   
    

  }

  onSubmit(){

    


    this.product = this.createProductFromData(this.createProductFormGroup, 
                                                this.productCharacteristicsService.getFinalCharacteristics());
    //console.log(this.product);
   


    this.productService.getAllProducts().subscribe({//para verificar si ya existe el producto
      next: response =>{
        let out = false;
        let productsInterfaceList = response;

        if (productsInterfaceList != undefined) {
          let p = productsInterfaceList.find(
            (prod) =>
              this.product.brand === prod.brand && this.product.model === prod.model
          );
          
          if (p == undefined) {//si p es undefined => no existe el prodcucto

            this.createdAlert(this.product)
                  .then((result) => {
                    if (result.isConfirmed) {//apreta el botón confirmar en la ventana emergente
                      this.productService.addProduct(this.product).subscribe({
                        next: response =>{
                          console.log("Producto agregado exitosamente");
                          
                          Swal.fire({
                            title: "",
                            text: "Producto agregado exitosamente",
                            icon: "success"
                          });
          
                          
                        },
                        error: error =>{
                          console.log("Error al agregar el producto...");
                          //console.log(error);
                          Swal.fire({
                            title: "",
                            text: "Error al agregar el producto",
                            icon: "error"
                          });
                        }
                      });
                      
            
                    }
                  })
                  .catch(error => {
                    console.log("Error al crear producto");
                    this.notAddedProductAlert("Error al crear producto");
                  });




          }else{
            console.log("Producto ya existente...");
            
            this.notAddedProductAlert("Producto ya existente...");

          }
        }else{
          console.log("Sin productos");
          this.notAddedProductAlert("Sin productos");
        }

      },
      error: error =>{
        console.log("Error al verificar existencia del producto...");
        console.log(error);
        this.notAddedProductAlert("Error al verificar existencia del producto...");
      }
    });




  }

  private initProductInterface(){//crea un producto vacío

    let product: ProductInterface2 = {
      
          id: "",
            brand: Brand.NONE,
            category: Category.NONE,
            urlImage: "",
            description: "",
            price: 0,
            stock: 0,
            characteristics: this.productCharacteristicsService.initCharacteristics(),
            model: "",
            quantity: 0
      
    }
    return product;
  }


 
  resetForm() {// resetea lo formularios a través de un input hacia el generalCharacteristicsComponent
    this.createProductFormGroup.reset();
    this.resetFormGeneralAndCharacteristics = true;
 
    
    
  }

  private createProductFromData(form: FormGroup, characteristics: GeneralCharacteristics){//toma el fomulario de create y las caracteristicas y crea el producto
    let product: ProductInterface2 = {
      id: "",
      brand: form.get("brand")?.value,
      category: form.get("category")?.value,
      urlImage: form.get("urlImage")?.value,
      description: form.get("description")?.value,
      price: Number(form.get("price")?.value),
      stock: Number(form.get("stock")?.value),
      model: form.get("model")?.value,
      quantity: 0,
      characteristics: characteristics

    }
    return product;
  }

  

  

  set_GeneralCharacteristicsFormValid(event: boolean){//toma el output de GEenralcharacteristics para ver si es válido
    
    this._generalCharacteristicsFormValid = event;
    this.cdr.detectChanges(); 
  }
  setCharacteristicsFormValid(event: boolean){//toma el output de las caracteristicas para ver si es válido

    this.characteristicsFormValid = event;
    this.cdr.detectChanges(); 
  }

  private setGeneralCharacteristicsOnly(){// setea el characteristicsFormValid en falso por si ya viene true para la activación del botón crear prodcuto
    this.generalCharacteristicsOnly = false;
    switch (this.createProductFormGroup.get("category")?.value){
      case Category.ASPIRADORAS:
        this.generalCharacteristicsOnly = true;
        this.characteristicsFormValid = false;
        break;
        case Category.COMPUTADORAS_ESCRITORIO:
          this.generalCharacteristicsOnly = true;
          this.characteristicsFormValid = false;
        break;
        case Category.PARLANTES:
          this.generalCharacteristicsOnly = true;
          this.characteristicsFormValid = false;
        break;
    }
  }



  createdAlert(product: ProductInterface2){
      const message = `
                      
                      <strong>Categoría:</strong> ${product.category}<br>
                      <strong>Marca:</strong> ${product.brand}<br>
                      <strong>Modelo:</strong> ${product.model}<br>
                      <strong>Descripción:</strong> ${product.description}<br>
                      <strong>Precio:</strong> $${product.price}<br>
                      <strong>Stock:</strong> ${product.stock}`;
              //VER Q MUESTRE BIEN EL MSAJE ANTERIOR
              
              
      
      return Swal.fire({
        title: "Producto a crear",
        html: message,
        width: 1000,
        imageUrl: product.urlImage,
        imageHeight: 200,
        imageAlt: "A tall image",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Aceptar"
      });
    }

    notAddedProductAlert(message: string){
      Swal.fire({
        title: "Error",
        html: message,
        width: 1000,
        icon: "warning",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Aceptar"
      });
      
    }



    ////////////////////////////  PRODUCT EDIT   //////////////////////////////////////////


    setFormGroupToEdit(product: ProductInterface2){//Setea el formGroup con los datos del producto a editar

      this.createProductFormGroup.get("category")?.setValue(product.category);
      this.createProductFormGroup.get("brand")?.setValue(product.brand);
      this.createProductFormGroup.get("urlImage")?.setValue(product.urlImage);
      this.createProductFormGroup.get("description")?.setValue(product.description);
      this.createProductFormGroup.get("price")?.setValue(product.price);
      this.createProductFormGroup.get("stock")?.setValue(product.stock);
      this.createProductFormGroup.get("model")?.setValue(product.model);

    }

    getProductoToEdit(id: string):Observable<ProductInterface2>{
      console.log("ID: " + id);
      return this.productService._getProductById(id);






      
    }
 
}
