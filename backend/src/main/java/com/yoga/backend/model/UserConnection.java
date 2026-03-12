package com.yoga.portfolio.model;

public class UserConnection {
    private String id;          // e.g. "viewer-123"
    private String displayName; // "Visitor", "Friend A"
    private String requestedRole; // "public", "friend", "unknown"
    private String approvedRole;  // null until admin approves
    private boolean blocked;      // true if admin removed

    // getters & setters
}
