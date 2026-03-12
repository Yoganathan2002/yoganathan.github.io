package com.yoga.portfolio.controller;

import com.yoga.portfolio.model.UserConnection;
import com.yoga.portfolio.storage.FileStorageService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/connections")
@CrossOrigin(origins = "*")
public class ConnectionController {

    private final FileStorageService storage;

    public ConnectionController(FileStorageService storage) {
        this.storage = storage;
    }

    // Viewer calls this when pressing "Connect" from portfolio
    @PostMapping("/request")
    public UserConnection request(@RequestBody UserConnection req) {
        List<UserConnection> list = storage.getConnections();
        req.setId(req.getId() != null ? req.getId() : UUID.randomUUID().toString());
        req.setApprovedRole(null);
        req.setBlocked(false);
        list.add(req);
        storage.saveConnections(list);
        return req;
    }

    // Admin approves with a role: "public", "friend", "unknown"
    @PutMapping("/{id}/approve")
    public UserConnection approve(@PathVariable String id,
                                  @RequestParam String role) {
        List<UserConnection> list = storage.getConnections();
        for (UserConnection c : list) {
            if (c.getId().equals(id)) {
                c.setApprovedRole(role);
                c.setBlocked(false);
                storage.saveConnections(list);
                return c;
            }
        }
        throw new RuntimeException("Connection not found");
    }

    // Admin removes / blocks a member
    @PutMapping("/{id}/block")
    public UserConnection block(@PathVariable String id) {
        List<UserConnection> list = storage.getConnections();
        for (UserConnection c : list) {
            if (c.getId().equals(id)) {
                c.setBlocked(true);
                c.setApprovedRole(null);
                storage.saveConnections(list);
                return c;
            }
        }
        throw new RuntimeException("Connection not found");
    }

    @GetMapping
    public List<UserConnection> all() {
        return storage.getConnections();
    }
}
