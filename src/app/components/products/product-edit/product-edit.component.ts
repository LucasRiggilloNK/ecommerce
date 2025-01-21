import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product/product.service';
import { Category } from '../../../models/products/categories/category';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Product } from '../../../models/products/product';
import { response } from 'express';
import { ProductInterface } from '../../../interfaces/product/product-interface';
import { error } from 'console';
import { Brand } from '../../../models/products/brands/brand';
import Swal from 'sweetalert2';
import { strict } from 'assert';
import { ProductcCharacteristicsService } from '../../../services/product/product-characteristics.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.css'
})
export class ProductEditComponent implements OnInit{

  editProduct: FormGroup;
  categoryList: string[] = Object.values(Category).sort();
  brandList: string[] = Object.values(Brand).sort();
  productAdded: boolean = false;
  productNotAdded: boolean = false;
  product: ProductInterface | null = null;
  id: string = "";

  



  constructor(private productService: ProductService , private route: ActivatedRoute, private productCharacteristicsService: ProductcCharacteristicsService, 
              private router: Router){
                
    this.editProduct = new FormGroup({
      brand: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      urlImage: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
      price: new FormControl('', [Validators.required, Validators.min(0.01)]),
      stock: new FormControl('', [Validators.required, Validators.min(1)]),
      model: new FormControl("", [Validators.required])
    });
    
  }

  ngOnInit(): void {
    let id;
    this.categoryList.splice(this.categoryList.indexOf(Category.NONE), 1);
    this.brandList.splice(this.brandList.indexOf(Brand.NONE), 1);

    
    id = this.route.snapshot.paramMap.get("id");
    if(id != null){
      this.id = id;
    }
    
    if(this.id != null){
      this.productService.getProductById(this.id).subscribe({
        next: response => {
          this.product = response;
          this.setFormGroup(this.product);






        },
        error: error =>{
          alert("Error al buscar producto para editar...");
        }
      });
    }


      
  }

  onSubmit(){
    let newProduct: ProductInterface = this.formGroupToProduct(this.editProduct);
    if(this.product != null){
      this.editAlert(newProduct)
      .then((result) => {
        if (result.isConfirmed) {
          
          
          this.productService.updateProduct(newProduct).subscribe({
            next: response =>{
              Swal.fire({
                title: "",
                text: "Cambios realizados con éxito",
                icon: "success"
              });
            },
            error: error =>{
              Swal.fire({
                title: "",
                text: "El cambio no se pudo realizar",
                icon: "error"
              });
            }
          });


          
        }
      })
      .catch(error => {
        alert("Error al intentar modificar producto")
      });

    
  }

    
  }
  resetForm(){
    this.editProduct.reset();
  }
  deleteProduct(id: string | undefined){
    
    this.deleteAlert(this.product)
    .then((result) => {
      if (result.isConfirmed) {
        if(this.product != null){
          this.productService.deleteProduct(this.product).subscribe({
            next: response =>{
              Swal.fire({
                title: "",
                text: "Eliminado con éxito",
                icon: "success"
              });
              this.router.navigateByUrl("/home");
            },
            error: error =>{
              Swal.fire({
                title: "",
                text: "No se pudo eliminar",
                icon: "error"
              });
            }
          });
        }
        
        


        
      }
    })
    .catch(error => {
      alert("Error al intentar eliminar producto")
    });
  }

  

  editAlert(product: ProductInterface){
    const message = `
                    <strong>ID:</strong> ${product.id}<br>
                    <strong>Categoría:</strong> ${product.category}<br>
                    <strong>Marca:</strong> ${product.brand}<br>
                    <strong>Modelo:</strong> ${product.model}<br>
                    <strong>Descripción:</strong> ${product.description}<br>
                    <strong>Precio:</strong> $${product.price}<br>
                    <strong>Stock:</strong> ${product.stock}`;
            
            
            
    /* Swal.fire({
      title: "Modificación a realizar",
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
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "",
          text: "Cambios realizados con éxito",
          icon: "success"
        });
      }
    }); */
    return Swal.fire({
      title: "Modificación a realizar",
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

  deleteAlert(product: ProductInterface | null){
    const message = `
                    <strong>ID:</strong> ${product?.id}<br>
                    <strong>Categoría:</strong> ${product?.category}<br>
                    <strong>Marca:</strong> ${product?.brand}<br>
                    <strong>Modelo:</strong> ${product?.model}<br>
                    <strong>Descripción:</strong> ${product?.description}<br>
                    <strong>Precio:</strong> $${product?.price}<br>
                    <strong>Stock:</strong> ${product?.stock}`;
            
            
            
    /* Swal.fire({
      title: "Modificación a realizar",
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
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "",
          text: "Cambios realizados con éxito",
          icon: "success"
        });
      }
    }); */
    return Swal.fire({
      title: "Eliminar producto?",
      html: message,
      width: 1000,
      imageUrl: product?.urlImage,
      imageHeight: 200,
      imageAlt: "A tall image",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar"
    });
  }


  setFormGroup(product: ProductInterface){
    this.editProduct.get("category")?.setValue(product.category);
    this.editProduct.get("brand")?.setValue(product.brand);
    this.editProduct.get("urlImage")?.setValue(product.urlImage);
    this.editProduct.get("description")?.setValue(product.description);
    this.editProduct.get("price")?.setValue(product.price);
    this.editProduct.get("stock")?.setValue(product.stock);
    this.editProduct.get("model")?.setValue(product.model);
    
  }

  private formGroupToProduct(form: FormGroup){
    let product: ProductInterface = {
      id: "",
      category: Category.NONE,
      brand: Brand.NONE,
      model:  "",
      description:  "",
      urlImage:  "",
      characteristics: "",
      stock: 0,
      price: 0,
      quantity: 0

    }

    product.id = this.id;
    product.category = form.get("category")?.value;
    product.brand = form.get("brand")?.value;
    product.model = form.get("model")?.value;
    product.description = form.get("description")?.value;
    product.urlImage = form.get("urlImage")?.value;
    product.stock = form.get("stock")?.value;
    product.price = form.get("price")?.value;
    product.characteristics = this.productCharacteristicsService.getCharacteristicsString();
    

    return product;
  }

  
 
}
