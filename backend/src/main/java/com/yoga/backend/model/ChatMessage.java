package com.yoga.portfolio.model;

import java.time.Instant;

public class ChatMessage {
    private String id;
    private String conversationId; // e.g. "public", "friend-001"
    private String fromUserId;
    private String fromDisplayName;
    private String role; // "viewer", "friend", "unknown", "admin"
    private String content;
    private Instant timestamp;

    // getters & setters
}
