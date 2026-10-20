package com.spring.fullStackProject.services;

import com.spring.fullStackProject.dto.CartRequest;
import com.spring.fullStackProject.model.Cart;
import com.spring.fullStackProject.model.CartItem;
import com.spring.fullStackProject.model.Product;
import com.spring.fullStackProject.model.Users;
import com.spring.fullStackProject.repository.CartItemRepo;
import com.spring.fullStackProject.repository.CartRepo;
import com.spring.fullStackProject.repository.ProductRepo;
import com.spring.fullStackProject.repository.UserRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

   private final CartRepo cartRepo;
   private final CartItemRepo cartItemRepo;
   private final ProductRepo productRepo;
   private final UserRepo userRepo;

   public CartService(CartRepo cartRepo,CartItemRepo cartItemRepo,ProductRepo productRepo,UserRepo userRepo) {
       this.cartRepo = cartRepo;
       this.cartItemRepo = cartItemRepo;
       this.productRepo = productRepo;
       this.userRepo = userRepo;
   }

    public List<CartItem> getAllCarts(Integer userId) {
        return cartItemRepo.findByCart_Users_IdOrderByItemIdDesc(userId);
    }

    public CartItem getCartById(Integer itemId) {
        return cartItemRepo.findById(itemId).orElse(null);
    }

    public CartItem createCart(CartRequest cartRequest) {

       Product product = productRepo.findById(cartRequest.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

      Users user = userRepo.findById(cartRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

      Cart cart = cartRepo.findByUsers_Id(cartRequest.getUserId());

      if (cart == null) {
            cart = new Cart();
            cart.setUsers(user);
            cart = cartRepo.save(cart);
        }

      CartItem existingCartItem =
                cartItemRepo.findByCartAndProduct(cart, product);

      if (existingCartItem != null) {
            existingCartItem.setQuantity(
                    existingCartItem.getQuantity() + cartRequest.getQuantity()
            );

            return cartItemRepo.save(existingCartItem);
        }

      CartItem cartItem = new CartItem();

        cartItem.setCart(cart);
        cartItem.setProduct(product);
        cartItem.setQuantity(cartRequest.getQuantity());

        return cartItemRepo.save(cartItem);
    }

    public CartItem addQuantity(Integer itemId) {
        CartItem cartItem = cartItemRepo.findById(itemId).orElseThrow(() ->
                new RuntimeException("Product not found"));
        cartItem.setQuantity(cartItem.getQuantity() + 1);
        return cartItemRepo.save(cartItem);
    }

    public CartItem subQuantity(Integer itemId) {
        CartItem cartItem = cartItemRepo.findById(itemId).orElseThrow(()->new RuntimeException("Product not found"));
        cartItem.setQuantity(cartItem.getQuantity() - 1);
        return cartItemRepo.save(cartItem);
    }

    public void deleteCart(Integer itemId) {
        cartItemRepo.deleteById(itemId);
    }
}
