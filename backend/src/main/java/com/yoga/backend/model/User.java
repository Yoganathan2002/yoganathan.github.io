// User.java
package com.yoga.backend.model;

public class User {
    private String id;          // e.g. random UUID or session id
    private String displayName; // optional
    private Role role;          // PUBLIC_VIEWER / FRIEND / UNKNOWN / ADMIN
    private boolean active;

    // getters/setters
}
