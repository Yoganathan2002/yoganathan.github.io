// TemplateService.java
package com.yoga.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.yoga.backend.model.TemplateRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

@Service
public class TemplateService {

    private static final String FILE = "template-requests.json";
    private final FileStorageService storage;

    public TemplateService(FileStorageService storage) {
        this.storage = storage;
    }

    public List<TemplateRequest> findAll() {
        return new ArrayList<>(
                storage.load(FILE, new TypeReference<List<TemplateRequest>>() {})
        );
    }

    public TemplateRequest create(String userId) {
        List<TemplateRequest> all = findAll();
        TemplateRequest req = new TemplateRequest();
        req.setId(UUID.randomUUID().toString());
        req.setUserId(userId);
        req.setStatus("pending");
        req.setCreatedAt(Instant.now());
        all.add(req);
        storage.save(FILE, all);
        return req;
    }

    public TemplateRequest updateStatus(String id, String status) {
        List<TemplateRequest> all = findAll();
        for (TemplateRequest r : all) {
            if (r.getId().equals(id)) {
                r.setStatus(status);
                storage.save(FILE, all);
                return r;
            }
        }
        return null;
    }
}
