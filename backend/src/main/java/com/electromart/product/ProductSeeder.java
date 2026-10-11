package com.electromart.product;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
public class ProductSeeder implements CommandLineRunner {
    private final ProductRepository repository;
    public ProductSeeder(ProductRepository repository){this.repository=repository;}
    @Override public void run(String... args) {
        addIfMissing("iPhone 16 Pro Max","Mobiles","139999",4.9,"Titanium design and pro camera system","https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=700&q=80");
        addIfMissing("Samsung Galaxy S25 Ultra","Mobiles","129999",4.8,"Premium Android phone with S Pen","https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=700&q=80");
        addIfMissing("MacBook Air M4 15-inch","Laptops","124999",4.9,"Lightweight laptop for work and study","https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=700&q=80");
        addIfMissing("Sony WH-1000XM5","Audio","29990",4.8,"Wireless headphones with noise cancellation","https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=700&q=80");
        addIfMissing("PlayStation 5 Slim","Gaming","54990",4.9,"Next generation console gaming","https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=700&q=80");
        addIfMissing("Google Pixel 9","Mobiles","74999",4.6,"Clean Android experience and computational photography","https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=700&q=80");
        addIfMissing("Dell XPS 13","Laptops","109999",4.6,"Compact premium laptop for productivity","https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=80");
        addIfMissing("Samsung 55-inch 4K Smart TV","TV","59999",4.5,"Large 4K display for movies and sports","https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=700&q=80");
        addIfMissing("JBL Flip Portable Speaker","Audio","9999",4.4,"Portable wireless speaker for everyday listening","https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=80");
        addIfMissing("Apple Watch Series 10","Wearables","45999",4.7,"Smartwatch for activity and daily notifications","https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=700&q=80");
    }
    private void addIfMissing(String name, String category, String price, double rating, String description, String imageUrl) {
        boolean exists = repository.findAll().stream().anyMatch(p -> p.getName().equalsIgnoreCase(name));
        if (!exists) repository.save(new Product(name, category, new BigDecimal(price), rating, description, imageUrl));
    }
}
