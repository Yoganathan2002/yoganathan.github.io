package com.yoga.portfolio.controller;

import com.yoga.portfolio.model.TemplateRequest;
import com.yoga.portfolio.storage.FileStorageService;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/template-requests")
@CrossOrigin(origins = "*")
public class TemplateRequestController {

    private final FileStorageService storage;

    public TemplateRequestController(FileStorageService storage) {
        this.storage = storage;
    }

    @GetMapping
    public List<TemplateRequest> getAll() {
        return storage.getTemplateRequests();
    }

    @PostMapping
    public TemplateRequest create(@RequestBody TemplateRequest req) {
        List<TemplateRequest> list = storage.getTemplateRequests();
        req.setId(UUID.randomUUID().toString());
        req.setStatus("pending");
        req.setCreatedAt(Instant.now());
        list.add(req);
        storage.saveTemplateRequests(list);
        return req;
    }

    @PutMapping("/{id}/status")
    public TemplateRequest updateStatus(@PathVariable String id,
                                        @RequestParam String status) {
        List<TemplateRequest> list = storage.getTemplateRequests();
        for (TemplateRequest r : list) {
            if (r.getId().equals(id)) {
                r.setStatus(status);
                storage.saveTemplateRequests(list);
                return r;
            }
        }
        throw new RuntimeException("Request not found");
    }
}
