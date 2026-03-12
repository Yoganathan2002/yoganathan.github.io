package com.yoga.portfolio.model;

import java.time.Instant;

public class TemplateRequest {
    private String id;
    private String userId;
    private String userEmail;
    private String status; // "pending", "approved", "denied"
    private Instant createdAt;

    // getters & setters
}
