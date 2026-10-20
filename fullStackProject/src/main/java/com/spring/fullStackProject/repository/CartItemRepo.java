package com.spring.fullStackProject.repository;

import com.spring.fullStackProject.model.Cart;
import com.spring.fullStackProject.model.CartItem;
import com.spring.fullStackProject.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartItemRepo extends JpaRepository<CartItem, Integer> {

    CartItem findByCartAndProduct(Cart cart, Product product);

    List<CartItem> findByCart_Users_IdOrderByItemIdDesc(Integer userId);
}
