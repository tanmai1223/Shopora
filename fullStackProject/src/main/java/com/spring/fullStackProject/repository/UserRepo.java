package com.spring.fullStackProject.repository;

import com.spring.fullStackProject.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepo extends JpaRepository<Users, Integer> {
    Users findByUsername(String username);

    List<Users> findAllByOrderByIdAsc();

    boolean existsByUsername(String username);
}
