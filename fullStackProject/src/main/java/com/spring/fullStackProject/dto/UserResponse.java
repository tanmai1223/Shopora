package com.spring.fullStackProject.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponse {

    private Integer id;
    private String role;
    private String username;
    private String firstName;
    private String lastName;


}
