package com.yoga.portfolio.controller;

import com.yoga.portfolio.model.AdminSession;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/auth/admin")
@CrossOrigin(origins = "*")
public class AdminAuthController {

    private static final String ADMIN_KEY = "admin123"; // move to config later
    private AdminSession currentSession;

    @PostMapping("/login")
    public AdminSession login(@RequestParam String key) {
        if (!ADMIN_KEY.equals(key)) {
            throw new RuntimeException("Invalid key");
        }
        AdminSession session = new AdminSession();
        session.setToken(UUID.randomUUID().toString());
        session.setCreatedAt(System.currentTimeMillis());
        this.currentSession = session;
        return session;
    }

    @GetMapping("/validate")
    public boolean validate(@RequestParam String token) {
        return currentSession != null && currentSession.getToken().equals(token);
    }
}
