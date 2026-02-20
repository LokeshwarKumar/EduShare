package com.edumat.controller;

import com.edumat.dto.ApprovalRequest;
import com.edumat.dto.MaterialResponse;
import com.edumat.dto.MessageResponse;
import com.edumat.dto.UserResponse;
import com.edumat.model.ApprovalStatus;
import com.edumat.model.Material;
import com.edumat.model.User;
import com.edumat.repository.MaterialRepository;
import com.edumat.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = Map.of(
            "totalUsers", userRepository.countTotalUsers(),
            "totalMaterials", materialRepository.countTotalMaterials(),
            "pendingApprovals", materialRepository.countByApprovalStatus(ApprovalStatus.PENDING),
            "approvedMaterials", materialRepository.countByApprovalStatus(ApprovalStatus.APPROVED),
            "rejectedMaterials", materialRepository.countByApprovalStatus(ApprovalStatus.REJECTED)
        );
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/materials/pending")
    public ResponseEntity<List<MaterialResponse>> getPendingMaterials() {
        List<Material> materials = materialRepository.findByApprovalStatus(ApprovalStatus.PENDING);
        List<MaterialResponse> responses = materials.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/materials/all")
    public ResponseEntity<List<MaterialResponse>> getAllMaterials() {
        List<Material> materials = materialRepository.findAll();
        List<MaterialResponse> responses = materials.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/materials/{id}/approve")
    public ResponseEntity<?> approveMaterial(@PathVariable Long id) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found"));
        
        material.setApprovalStatus(ApprovalStatus.APPROVED);
        material.setRejectionReason(null);
        materialRepository.save(material);
        
        return ResponseEntity.ok(new MessageResponse("Material approved successfully"));
    }

    @PostMapping("/materials/{id}/reject")
    public ResponseEntity<?> rejectMaterial(@PathVariable Long id, @RequestBody ApprovalRequest request) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found"));
        
        material.setApprovalStatus(ApprovalStatus.REJECTED);
        material.setRejectionReason(request.getReason());
        materialRepository.save(material);
        
        return ResponseEntity.ok(new MessageResponse("Material rejected successfully"));
    }

    @DeleteMapping("/materials/{id}")
    public ResponseEntity<?> deleteMaterial(@PathVariable Long id) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found"));
        
        materialRepository.delete(material);
        return ResponseEntity.ok(new MessageResponse("Material deleted successfully"));
    }

    @GetMapping("/materials/{id}/view")
    public ResponseEntity<Resource> viewMaterial(@PathVariable Long id) throws IOException {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found"));
        
        Path filePath = Paths.get(material.getFilePath());
        Resource resource = new UrlResource(filePath.toUri());
        
        if (!resource.exists() || !resource.isReadable()) {
            throw new RuntimeException("File not found or not readable");
        }
        
        String contentType = "application/octet-stream";
        if (material.getFileType() != null) {
            switch (material.getFileType().toLowerCase()) {
                case "pdf":
                    contentType = "application/pdf";
                    break;
                case "doc":
                case "docx":
                    contentType = "application/msword";
                    break;
                case "ppt":
                case "pptx":
                    contentType = "application/vnd.ms-powerpoint";
                    break;
                case "txt":
                    contentType = "text/plain";
                    break;
            }
        }
        
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + material.getFileName() + "\"")
                .body(resource);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserResponse> responses = users.stream()
                .map(this::convertToUserResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/users/count")
    public ResponseEntity<Long> getTotalUsers() {
        return ResponseEntity.ok(userRepository.countTotalUsers());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        userRepository.delete(user);
        return ResponseEntity.ok(new MessageResponse("User deleted successfully"));
    }

    private MaterialResponse convertToResponse(Material material) {
        MaterialResponse response = new MaterialResponse();
        response.setId(material.getId());
        response.setTitle(material.getTitle());
        response.setDescription(material.getDescription());
        response.setSubjectId(material.getSubject().getId());
        response.setSubjectName(material.getSubject().getName());
        response.setDepartment(material.getDepartment());
        response.setSemester(material.getSemester());
        response.setFileName(material.getFileName());
        response.setFileType(material.getFileType());
        response.setFileSize(material.getFileSize());
        response.setApprovalStatus(material.getApprovalStatus());
        response.setRejectionReason(material.getRejectionReason());
        response.setUploadedByUsername(material.getUploadedBy().getUsername());
        response.setUploadedByFirstName(material.getUploadedBy().getFirstName());
        response.setUploadedByLastName(material.getUploadedBy().getLastName());
        response.setUploadDate(material.getUploadDate());
        response.setApprovalDate(material.getApprovalDate());
        response.setDownloadCount(material.getDownloadCount());
        return response;
    }

    private UserResponse convertToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setDepartment(user.getDepartment());
        response.setSemester(user.getSemester());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());
        Set<String> roleNames = user.getRoles().stream()
                .map(role -> role.getName().toString())
                .collect(Collectors.toSet());
        response.setRoles(roleNames);
        
        return response;
    }
}
