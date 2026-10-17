package com.electromart.review;

import com.electromart.product.ProductRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "${app.frontend-origin:http://localhost:5173}")
public class ProductReviewController {
    private final ProductReviewRepository reviews;
    private final ProductRepository products;
    public ProductReviewController(ProductReviewRepository reviews, ProductRepository products) {
        this.reviews = reviews; this.products = products;
    }

    public record ReviewRequest(@NotNull @Min(1) Long productId,
        @NotBlank @Size(max=80) String reviewerName,
        @Min(1) @Max(5) int rating,
        @Size(max=120) String title,
        @NotBlank @Size(min=5,max=2000) String comment) {}

    @GetMapping("/products/{productId}/reviews")
    public Map<String,Object> byProduct(@PathVariable Long productId) {
        ensureProduct(productId);
        List<ProductReview> list = reviews.findByProductIdOrderByCreatedAtDesc(productId);
        return summary(list);
    }

    @GetMapping("/reviews")
    public Map<String,Object> all() {
        return summary(reviews.findAllByOrderByCreatedAtDesc());
    }

    @PostMapping("/reviews")
    @ResponseStatus(HttpStatus.CREATED)
    public ProductReview create(@Valid @RequestBody ReviewRequest input) {
        ensureProduct(input.productId());
        ProductReview review = new ProductReview();
        review.setProductId(input.productId());
        review.setReviewerName(input.reviewerName());
        review.setRating(input.rating());
        review.setTitle(input.title());
        review.setComment(input.comment());
        return reviews.save(review);
    }

    private void ensureProduct(Long id) {
        if (!products.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found");
    }
    private Map<String,Object> summary(List<ProductReview> list) {
        double average = list.isEmpty() ? 0 : list.stream().mapToInt(ProductReview::getRating).average().orElse(0);
        Map<Integer,Long> distribution = new java.util.LinkedHashMap<>();
        for (int star=5; star>=1; star--) {
            final int current=star;
            distribution.put(star, list.stream().filter(r -> r.getRating()==current).count());
        }
        return Map.of("reviews", list, "count", list.size(), "average", Math.round(average*10.0)/10.0, "distribution", distribution);
    }
}
