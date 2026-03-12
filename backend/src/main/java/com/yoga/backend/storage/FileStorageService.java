package com.yoga.portfolio.storage;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

@Service
public class FileStorageService {

    private final ObjectMapper mapper = new ObjectMapper();
    private final Path dataDir = Path.of("data");

    public FileStorageService() throws Exception {
        if (!Files.exists(dataDir)) {
            Files.createDirectories(dataDir);
        }
    }

    private <T> List<T> readList(String fileName, TypeReference<List<T>> typeRef) {
        try {
            Path file = dataDir.resolve(fileName);
            if (!Files.exists(file)) {
                return new ArrayList<>();
            }
            return mapper.readValue(file.toFile(), typeRef);
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    private <T> void writeList(String fileName, List<T> list) {
        try {
            Path file = dataDir.resolve(fileName);
            mapper.writerWithDefaultPrettyPrinter().writeValue(file.toFile(), list);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Template requests
    public List<com.yoga.portfolio.model.TemplateRequest> getTemplateRequests() {
        return readList("template-requests.json",
                new TypeReference<List<com.yoga.portfolio.model.TemplateRequest>>() {});
    }

    public void saveTemplateRequests(List<com.yoga.portfolio.model.TemplateRequest> list) {
        writeList("template-requests.json", list);
    }

    // User connections
    public List<com.yoga.portfolio.model.UserConnection> getConnections() {
        return readList("connections.json",
                new TypeReference<List<com.yoga.portfolio.model.UserConnection>>() {});
    }

    public void saveConnections(List<com.yoga.portfolio.model.UserConnection> list) {
        writeList("connections.json", list);
    }
}
