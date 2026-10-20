package com.spring.fullStackProject.repository;

import com.spring.fullStackProject.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepo extends JpaRepository<Product,Integer> {
    @Query("SELECT DISTINCT p.category FROM Product p")
    List<String> getCategory();

    List<Product> findByCategory(String category);

    List<Product> findAllByOrderByProductNameAsc();


    @Query("SELECT p from Product p WHERE " +
            "LOWER(p.productName) LIKE LOWER(CONCAT('%', :keyWord, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyWord, '%')) OR " +
            "LOWER(p.brand) LIKE LOWER(CONCAT('%', :keyWord, '%')) OR " +
            "LOWER(p.category) LIKE LOWER(CONCAT('%', :keyWord, '%'))")
    List<Product> searchProduct(String keyWord);
}
