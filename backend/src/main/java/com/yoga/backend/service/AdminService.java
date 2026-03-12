// AdminService.java
package com.yoga.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.yoga.backend.model.ConnectionRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

@Service
public class AdminService {

    private static final String FILE = "connections.json";
    private final FileStorageService storage;

    public AdminService(FileStorageService storage) {
        this.storage = storage;
    }

    public List<ConnectionRequest> findAllConnections() {
        return new ArrayList<>(
                storage.load(FILE, new TypeReference<List<ConnectionRequest>>() {})
        );
    }

    public ConnectionRequest createConnectionRequest(String userId, String requestedRole) {
        List<ConnectionRequest> all = findAllConnections();
        ConnectionRequest r = new ConnectionRequest();
        r.setId(UUID.randomUUID().toString());
        r.setUserId(userId);
        r.setRequestedRole(requestedRole);
        r.setStatus("pending");
        r.setCreatedAt(Instant.now());
        all.add(r);
        storage.save(FILE, all);
        return r;
    }

    public ConnectionRequest updateConnectionStatus(String id, String status) {
        List<ConnectionRequest> all = findAllConnections();
        for (ConnectionRequest r : all) {
            if (r.getId().equals(id)) {
                r.setStatus(status);
                storage.save(FILE, all);
                return r;
            }
        }
        return null;
    }
}
