package com.edumat.controller;

import com.edumat.dto.ApprovalRequest;
import com.edumat.dto.MaterialResponse;
import com.edumat.dto.MessageResponse;
import com.edumat.model.ApprovalStatus;
import com.edumat.model.Material;
import com.edumat.model.User;
import com.edumat.repository.MaterialRepository;
import com.edumat.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
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

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
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
}
