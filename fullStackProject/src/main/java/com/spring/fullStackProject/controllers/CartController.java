package com.spring.fullStackProject.controllers;

import com.spring.fullStackProject.dto.CartRequest;
import com.spring.fullStackProject.model.CartItem;
import com.spring.fullStackProject.model.UserPrincipal;
import com.spring.fullStackProject.services.CartService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class CartController {

    private final CartService service;

    public CartController(CartService service) {
        this.service = service;
    }

    @GetMapping("/cart")
    public ResponseEntity<?> getCart(@AuthenticationPrincipal UserPrincipal user){
        try {
            Integer userId=user.getID();
            List<CartItem> carts=service.getAllCarts(userId);
            return new ResponseEntity<>(carts,HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>("Internal server error",HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/cart/{itemId}")
    public ResponseEntity<?> getCartById(@PathVariable Integer itemId){
        try{
            CartItem cartItem=service.getCartById(itemId);
            if(cartItem!=null){
                return new ResponseEntity<>(cartItem,HttpStatus.OK);
            }else{
                return new ResponseEntity<>("Item not found",HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Internal server error",HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/cart")
    public ResponseEntity<?> saveCart(@RequestBody CartRequest cartRequest){
        try {
            CartItem cartItem =service.createCart(cartRequest);
            return new ResponseEntity<>(cartItem,HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>("Internal server error",HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/cart/add/{itemId}")
    public ResponseEntity<?> addQuantity(@PathVariable Integer itemId){
        try{
            CartItem cart1=service.addQuantity(itemId);
            return new ResponseEntity<>(cart1,HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity<>("Internal server error",HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/cart/sub/{itemId}")
    public ResponseEntity<?> subQuantity(@PathVariable Integer itemId) {
        try {

            CartItem cartItem = service.getCartById(itemId);

            if (cartItem == null) {
                return new ResponseEntity<>(
                        "Item not found",
                        HttpStatus.NOT_FOUND
                );
            }

            if (cartItem.getQuantity() == 1) {

                service.deleteCart(itemId);

                return new ResponseEntity<>(
                        "Item deleted",
                        HttpStatus.OK
                );

            } else {

                CartItem updatedItem = service.subQuantity(itemId);

                return new ResponseEntity<>(
                        updatedItem,
                        HttpStatus.OK
                );
            }

        } catch (Exception e) {
           return new ResponseEntity<>(
                    "Internal server error",
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @DeleteMapping("/cart/{itemId}")
    public ResponseEntity<?> deleteCart(@PathVariable Integer itemId){
        try {
            CartItem cartItem=service.getCartById(itemId);
            if(cartItem!=null){
                service.deleteCart(itemId);
                return new ResponseEntity<>("Item deleted",HttpStatus.OK);
            }else {
                return new ResponseEntity<>("Item not found",HttpStatus.NOT_FOUND);
            }

        }catch (Exception e){
            return new ResponseEntity<>("Internal server error",HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
