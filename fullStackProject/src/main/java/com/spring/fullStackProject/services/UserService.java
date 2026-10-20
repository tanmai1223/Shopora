package com.spring.fullStackProject.services;

import com.spring.fullStackProject.dto.LoginResponse;
import com.spring.fullStackProject.dto.UserResponse;
import com.spring.fullStackProject.model.Role;
import com.spring.fullStackProject.model.Users;
import com.spring.fullStackProject.repository.UserRepo;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepo userRepo;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authenticationManager;
    private final JWTService jWTService;

    public UserService(UserRepo userRepo, PasswordEncoder encoder, AuthenticationManager authenticationManager, JWTService jWTService) {
        this.userRepo = userRepo;
        this.encoder = encoder;
        this.authenticationManager = authenticationManager;
        this.jWTService = jWTService;
    }

    public UserResponse createUser(Users user) {

        if (userRepo.existsByUsername(user.getUsername())) {
            throw new RuntimeException("User already exists with this email!");
        }

        user.setRole(Role.USER);
        user.setPassword(encoder.encode(user.getPassword()));

        Users savedUser = userRepo.save(user);

        return new UserResponse(
                savedUser.getId(),
                savedUser.getRole().name(),
                savedUser.getUsername(),
                savedUser.getFirstName(),
                savedUser.getLastName()
        );
    }
    public LoginResponse verify(Users users) {
        Authentication authentication=authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(users.getUsername(), users.getPassword()));
        if(authentication.isAuthenticated()) {
            Users dbUser=userRepo.findByUsername(users.getUsername());
            String token= jWTService.generateToken(users.getUsername());
            return new LoginResponse(token,dbUser.getId(),dbUser.getRole().name());
        }
        throw new RuntimeException("Authentication failed");
    }

    public UserResponse updateProfile(Integer id,String firstName,String lastName,String newPassword) {
        Users existing=userRepo.findById(id).orElseThrow(()->new RuntimeException("User not found"));
        existing.setFirstName(firstName);
        existing.setLastName(lastName); if (newPassword != null && !newPassword.isBlank()) {
            existing.setPassword(encoder.encode(newPassword));
        }

        Users updatedUser = userRepo.save(existing);

        return new UserResponse(
                updatedUser.getId(),
                updatedUser.getRole().name(),
                updatedUser.getUsername(),
                updatedUser.getFirstName(),
                updatedUser.getLastName()
        );
    }

    public void deleteUser(Integer id) {
        userRepo.deleteById(id);
    }

    public List<UserResponse> getAllUsers() {
        List<Users> users= userRepo.findAllByOrderByIdAsc();
        return users.stream().map(user->new UserResponse(user.getId(),user.getRole().name(),user.getUsername(),user.getFirstName(),user.getLastName())).toList();

    }

    public UserResponse getUserById(Integer id) {
        Users user=userRepo.findById(id).orElseThrow(()->new RuntimeException("User not found"));
        return new UserResponse(user.getId(),user.getRole().name(),user.getUsername(),user.getFirstName(),user.getLastName());
    }
}