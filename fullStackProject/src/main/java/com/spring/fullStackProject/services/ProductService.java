package com.spring.fullStackProject.services;

import com.spring.fullStackProject.model.Product;
import com.spring.fullStackProject.repository.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class ProductService {

    @Autowired
   private  ProductRepo repo;

    @Autowired
    private CloudinaryService cloudinaryService;

    public List<Product> getAllProducts(){
        return repo.findAllByOrderByProductNameAsc();
    }


    public Product createProduct(Product product, MultipartFile image) throws IOException {
        Map uploadResults= cloudinaryService.uploadImage(image);
        product.setImageUrl(uploadResults.get("secure_url").toString());
        product.setImagePublicId(uploadResults.get("public_id").toString());
        return repo.save(product);
    }

    public Product getProduct(int prodId) {
        return repo.findById(prodId).orElse(null);
    }

    public Product updateProduct(
            int prodId,
            Product product,
            MultipartFile image) throws IOException {

        Product existing = repo.findById(prodId)
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        // Update product information
        existing.setProductName(product.getProductName());
        existing.setDescription(product.getDescription());
        existing.setPrice(product.getPrice());
        existing.setBrand(product.getBrand());
        existing.setCategory(product.getCategory());
        existing.setAvailable(product.isAvailable());
        existing.setStock(product.getStock());


        // Update image only if a new image was provided
        if (image != null && !image.isEmpty()) {

            // Upload new image
            Map uploadResults =
                    cloudinaryService.uploadImage(image);

            existing.setImageUrl(
                    uploadResults.get("secure_url").toString()
            );

            existing.setImagePublicId(
                    uploadResults.get("public_id").toString()
            );
        }

        return repo.save(existing);
    }

    public void deleteProduct(int prodId) {
         repo.deleteById(prodId);
    }

    public List<String> getAllCategories() {
        return repo.getCategory();
    }

    public List<Product> getProductsByCategory(String category) {
        return repo.findByCategory(category);
    }

    public List<Product> searchProduct(String keyWord) {
        return  repo.searchProduct(keyWord);
    }
}
