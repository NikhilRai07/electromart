package com.electromart.product;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank private String name;
    @NotBlank private String category;
    @NotNull @DecimalMin("0.0") @Column(precision = 12, scale = 2) private BigDecimal price;
    private Double rating;
    @Column(length = 1200) private String description;
    private String imageUrl;
    @Min(0) private Integer stock;

    public Product() {}
    public Product(String name, String category, BigDecimal price, double rating, String description, String imageUrl) {
        this.name=name; this.category=category; this.price=price; this.rating=rating; this.description=description; this.imageUrl=imageUrl;
    }
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public String getName(){return name;} public void setName(String name){this.name=name;}
    public String getCategory(){return category;} public void setCategory(String category){this.category=category;}
    public BigDecimal getPrice(){return price;} public void setPrice(BigDecimal price){this.price=price;}
    public Double getRating(){return rating;} public void setRating(Double rating){this.rating=rating;}
    public String getDescription(){return description;} public void setDescription(String description){this.description=description;}
    public String getImageUrl(){return imageUrl;} public void setImageUrl(String imageUrl){this.imageUrl=imageUrl;}
    public Integer getStock(){return stock;} public void setStock(Integer stock){this.stock=stock;}
}
