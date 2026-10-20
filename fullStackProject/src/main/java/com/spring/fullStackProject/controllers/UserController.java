package com.spring.fullStackProject.controllers;

import com.spring.fullStackProject.dto.LoginResponse;
import com.spring.fullStackProject.dto.UpdateProfileRequest;
import com.spring.fullStackProject.dto.UserResponse;
import com.spring.fullStackProject.model.UserPrincipal;
import com.spring.fullStackProject.model.Users;
import com.spring.fullStackProject.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> createUser(@RequestBody Users users) {
        try {
            UserResponse response = userService.createUser(users);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (RuntimeException e) {
            if ("User already exists with this email!".equals(e.getMessage())) {
                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body(e.getMessage());
            }

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Internal server issue");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Users users){
        try {
            LoginResponse response =userService.verify(users);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>("Internal server issue", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/allUsers")
    public ResponseEntity<?> getAllUsers(){
        try {
            List<UserResponse> users=userService.getAllUsers();
            return new ResponseEntity<>(users, HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>("Internal server issue", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserById(@AuthenticationPrincipal UserPrincipal principal){
        try {
                Integer id=principal.getID();
                UserResponse user=userService.getUserById(id);
                return new ResponseEntity<>(user, HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>("Internal server issue", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody UpdateProfileRequest request, @AuthenticationPrincipal UserPrincipal principal){
        try {
            UserResponse updatedUser = userService.updateProfile(
                    principal.getID(),
                    request.getFirstName(),
                    request.getLastName(),
                    request.getNewPassword()
            );
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Internal server issue", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteUser(@AuthenticationPrincipal UserPrincipal principal){
        try {
                Integer id=principal.getID();
                userService.deleteUser(id);
                return new ResponseEntity<>(HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>("Internal server issue", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
