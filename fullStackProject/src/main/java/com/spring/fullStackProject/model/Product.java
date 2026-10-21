package com.spring.fullStackProject.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String productName;
    private double price;
    private String brand;
    private String category;
    private boolean available;
    private int stock;
    private String imageUrl;
    private String imagePublicId;

}
