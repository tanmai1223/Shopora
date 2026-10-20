package com.spring.fullStackProject.repository;

import com.spring.fullStackProject.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepo extends JpaRepository<Cart,Integer> {
    Cart findByUsers_Id(Integer userId);
}
