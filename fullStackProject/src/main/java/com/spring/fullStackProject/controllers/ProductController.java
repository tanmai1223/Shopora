package com.spring.fullStackProject.controllers;

import com.spring.fullStackProject.model.Product;
import com.spring.fullStackProject.services.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping("/products")
    public ResponseEntity<?> getAllProducts() {
        try {
            List<Product> products = service.getAllProducts();
            return new ResponseEntity<>(products, HttpStatus.OK);
        }catch (Exception e) {
            return new ResponseEntity<>("Failed to fetch products",HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/products/{prodId}")
    public ResponseEntity<?> getProductById(@PathVariable int prodId) {
        try {
            Product product=service.getProduct(prodId);
            if(product!=null){
                return new ResponseEntity<>(product, HttpStatus.OK);
            }else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }catch (Exception e) {
            return new ResponseEntity<>("Failed to fetch product",HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PostMapping(
            value = "/product",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Product> createProduct(
            @RequestPart("product") String productJson,
            @RequestPart("image") MultipartFile image) {

        try {
            ObjectMapper objectMapper = new ObjectMapper();

            Product product = objectMapper.readValue(productJson, Product.class);

            Product savedProduct = service.createProduct(product, image);

            return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping(
            value = "/products/{prodId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> updateProduct(
            @PathVariable int prodId,
            @RequestPart("product") String productJson,
            @RequestPart(value = "image", required = false) MultipartFile image) {

        try {

            ObjectMapper objectMapper = new ObjectMapper();

            Product product =
                    objectMapper.readValue(productJson, Product.class);

            Product product1 =
                    service.updateProduct(prodId, product, image);

            return new ResponseEntity<>(product1, HttpStatus.OK);

        } catch (Exception e) {

            return new ResponseEntity<>(
                    "Failed to update",
                    HttpStatus.BAD_REQUEST
            );
        }
    }

    @DeleteMapping("/product/{prodId}")
    public ResponseEntity<?> deleteProduct(@PathVariable int prodId) {
        try {
            Product product=service.getProduct(prodId);
            if(product!=null){
                service.deleteProduct(prodId);
                return new ResponseEntity<>("Product Deleted", HttpStatus.OK);
            }else{
                return new ResponseEntity<>("Product not found",HttpStatus.NOT_FOUND);
            }

        }catch (Exception e){
            return new ResponseEntity<>("Failed to delete",HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/products/categories")
    public ResponseEntity<?> getAllCategories(){
        try {
           List<String> category= service.getAllCategories();
           return new ResponseEntity<>(category, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>("Internal server issue",HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/products/categories/{category}")
    public ResponseEntity<?> getCategory(@PathVariable String category){
        try {
            List<Product> products=service.getProductsByCategory(category);
            return new ResponseEntity<>(products, HttpStatus.OK);

        }catch (Exception e){
            return new ResponseEntity<>("Internal server issue",HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping("/products/search")
    public ResponseEntity<?> searchProduct(@RequestParam String keyWord){
        try {

            List<Product> products=service.searchProduct(keyWord);
            return new ResponseEntity<>(products, HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>("Internal server issue",HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



}
