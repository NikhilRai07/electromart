package com.electromart.auth;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "${app.frontend-origin:http://localhost:5173}")
public class AuthController {
    private final AppUserRepository users;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    @Value("${app.jwt.secret}") private String secret;
    @Value("${ADMIN_EMAIL:admin@electromart.com}") private String adminEmail;
    @Value("${ADMIN_PASSWORD:Admin@12345}") private String adminPassword;
    public AuthController(AppUserRepository users){this.users=users;}

    public record AuthRequest(@Email @NotBlank String email, @NotBlank String password) {}
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String,String> register(@RequestBody AuthRequest request) {
        if(request.password().length()<8) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Password must be at least 8 characters");
        if(users.findByEmailIgnoreCase(request.email()).isPresent()) throw new ResponseStatusException(HttpStatus.CONFLICT,"Email already registered");
        users.save(new AppUser(request.email().toLowerCase(),encoder.encode(request.password())));
        return Map.of("token",token(request.email(), "USER"),"email",request.email(),"role","USER");
    }
    @PostMapping("/admin/login")
    public Map<String,String> adminLogin(@RequestBody AuthRequest request) {
        if (!adminEmail.equalsIgnoreCase(request.email()) || !adminPassword.equals(request.password())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid admin email or password");
        }
        return Map.of("token", token(request.email(), "ADMIN"), "email", adminEmail, "role", "ADMIN");
    }
    @PostMapping("/login")
    public Map<String,String> login(@RequestBody AuthRequest request) {
        AppUser user=users.findByEmailIgnoreCase(request.email()).orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Invalid email or password"));
        if(!encoder.matches(request.password(),user.getPasswordHash())) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Invalid email or password");
        return Map.of("token",token(user.getEmail(), "USER"),"email",user.getEmail(),"role","USER");
    }
    private String token(String email, String role) {
        byte[] key=secret.getBytes(StandardCharsets.UTF_8);
        if(key.length<32) throw new IllegalStateException("JWT_SECRET must be at least 32 bytes");
        Instant now=Instant.now();
        return Jwts.builder().subject(email).claim("role", role).issuedAt(Date.from(now)).expiration(Date.from(now.plusSeconds(86400)))
                .signWith(Keys.hmacShaKeyFor(key)).compact();
    }
}
