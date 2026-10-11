package com.electromart.product;

import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "${app.frontend-origin:http://localhost:5173}")
public class ProductController {
    private final ProductRepository repository;
    @Value("${app.jwt.secret}") private String secret;
    public ProductController(ProductRepository repository){this.repository=repository;}

    @GetMapping
    public List<Product> all(@RequestParam(required=false) String category) {
        return category == null || category.isBlank() ? repository.findAll() : repository.findByCategoryIgnoreCase(category);
    }
    @GetMapping("/{id}")
    public Product one(@PathVariable Long id) {
        return repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
    }
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Product create(@Valid @RequestBody Product product, HttpServletRequest request){ requireAdmin(request); product.setId(null); return repository.save(product); }
    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @Valid @RequestBody Product input, HttpServletRequest request) {
        requireAdmin(request);
        Product p = one(id);
        p.setName(input.getName()); p.setCategory(input.getCategory()); p.setPrice(input.getPrice());
        p.setRating(input.getRating()); p.setDescription(input.getDescription()); p.setImageUrl(input.getImageUrl());
        return repository.save(p);
    }
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, HttpServletRequest request){ requireAdmin(request); if(!repository.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND); repository.deleteById(id); }
    private void requireAdmin(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin login required to manage products");
        }
        try {
            var claims = Jwts.parser()
                    .verifyWith(Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)))
                    .build().parseSignedClaims(header.substring(7)).getPayload();
            if (!"ADMIN".equals(claims.get("role", String.class))) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can manage products");
            }
        } catch (ResponseStatusException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Valid admin login required to manage products");
        }
    }
}
