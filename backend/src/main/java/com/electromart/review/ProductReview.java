package com.electromart.review;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.Instant;

@Entity
@Table(name = "product_reviews")
public class ProductReview {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull @Min(1) @Column(nullable = false)
    private Long productId;
    @NotBlank @Size(max = 80) @Column(nullable = false, length = 80)
    private String reviewerName;
    @Min(1) @Max(5) @Column(nullable = false)
    private int rating;
    @Size(max = 120) @Column(length = 120)
    private String title;
    @NotBlank @Size(min = 5, max = 2000) @Column(nullable = false, length = 2000)
    private String comment;
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    public ProductReview() {}
    @PrePersist void onCreate() { if (createdAt == null) createdAt = Instant.now(); }
    public Long getId(){ return id; }
    public Long getProductId(){ return productId; }
    public void setProductId(Long productId){ this.productId = productId; }
    public String getReviewerName(){ return reviewerName; }
    public void setReviewerName(String reviewerName){ this.reviewerName = reviewerName == null ? null : reviewerName.trim(); }
    public int getRating(){ return rating; }
    public void setRating(int rating){ this.rating = rating; }
    public String getTitle(){ return title; }
    public void setTitle(String title){ this.title = title == null ? null : title.trim(); }
    public String getComment(){ return comment; }
    public void setComment(String comment){ this.comment = comment == null ? null : comment.trim(); }
    public Instant getCreatedAt(){ return createdAt; }
}
