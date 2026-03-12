// ConnectionRequest.java
package com.yoga.backend.model;

import java.time.Instant;

public class ConnectionRequest {
    private String id;
    private String userId;
    private String requestedRole; // "PUBLIC", "FRIEND", "UNKNOWN"
    private String status;        // "pending", "approved", "removed"
    private Instant createdAt;

    // getters/setters
}
