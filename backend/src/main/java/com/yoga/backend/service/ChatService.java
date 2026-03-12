// ChatService.java
package com.yoga.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.yoga.backend.model.ChatMessage;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ChatService {

    private static final String FILE = "messages.json";
    private final FileStorageService storage;

    public ChatService(FileStorageService storage) {
        this.storage = storage;
    }

    public ChatMessage processIncoming(ChatMessage msg) {
        msg.setId(UUID.randomUUID().toString());
        msg.setTimestamp(Instant.now());

        List<ChatMessage> all = new ArrayList<>(
                storage.load(FILE, new TypeReference<List<ChatMessage>>() {})
        );
        all.add(msg);
        storage.save(FILE, all);

        return msg;
    }
}
