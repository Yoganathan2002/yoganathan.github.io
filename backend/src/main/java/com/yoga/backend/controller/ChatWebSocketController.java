package com.yoga.portfolio.controller;

import com.yoga.portfolio.model.ChatMessage;
import com.yoga.portfolio.model.UserConnection;
import com.yoga.portfolio.storage.FileStorageService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Controller
public class ChatWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final FileStorageService storage;

    public ChatWebSocketController(SimpMessagingTemplate messagingTemplate,
                                   FileStorageService storage) {
        this.messagingTemplate = messagingTemplate;
        this.storage = storage;
    }

    @MessageMapping("/chat.send") // client sends to /app/chat.send
    public void handleMessage(@Payload ChatMessage message) {
        // Basic rule: only approved users can send
        if (!canUserSend(message.getFromUserId(), message.getRole())) {
            return; // ignore
        }

        message.setId(UUID.randomUUID().toString());
        message.setTimestamp(Instant.now());

        // broadcast to topic based on conversation
        String destination = "/topic/chat/" + message.getConversationId();
        messagingTemplate.convertAndSend(destination, message);
    }

    private boolean canUserSend(String userId, String role) {
        if ("admin".equals(role)) return true;

        List<UserConnection> connections = storage.getConnections();
        return connections.stream()
                .filter(c -> c.getId().equals(userId))
                .anyMatch(c -> !c.isBlocked() && c.getApprovedRole() != null);
    }
}
