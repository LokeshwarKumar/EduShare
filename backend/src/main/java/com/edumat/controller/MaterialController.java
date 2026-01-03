package com.edumat.controller;

import com.edumat.dto.MaterialResponse;
import com.edumat.dto.MaterialUploadRequest;
import com.edumat.dto.MessageResponse;
import com.edumat.model.ApprovalStatus;
import com.edumat.model.Material;
import com.edumat.model.Subject;
import com.edumat.model.User;
import com.edumat.repository.MaterialRepository;
import com.edumat.repository.SubjectRepository;
import com.edumat.repository.UserRepository;
import com.edumat.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/materials")
public class MaterialController {

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${app.file.upload-dir}")
    private String uploadDir;

    @Value("${app.file.base-url}")
    private String baseUrl;

    @GetMapping("/public")
    public ResponseEntity<List<MaterialResponse>> getApprovedMaterials(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) Integer semester) {

        List<Material> materials;
        
        if (keyword != null && !keyword.trim().isEmpty()) {
            materials = materialRepository.findByStatusAndKeyword(ApprovalStatus.APPROVED, keyword.trim());
        } else if (subjectId != null) {
            materials = materialRepository.findByStatusAndSubject(ApprovalStatus.APPROVED, subjectId);
        } else if (department != null && !department.trim().isEmpty()) {
            materials = materialRepository.findByStatusAndDepartment(ApprovalStatus.APPROVED, department.trim());
        } else if (semester != null) {
            materials = materialRepository.findByStatusAndSemester(ApprovalStatus.APPROVED, semester);
        } else {
            materials = materialRepository.findByApprovalStatus(ApprovalStatus.APPROVED);
        }

        List<MaterialResponse> responses = materials.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MaterialResponse>> getMyMaterials(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<Material> materials = materialRepository.findByUploadedById(userDetails.getId());

        List<MaterialResponse> responses = materials.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @PostMapping("/upload")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> uploadMaterial(
            @RequestPart("material") MaterialUploadRequest request,
            @RequestPart("file") MultipartFile file,
            Authentication authentication) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Please select a file to upload"));
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String newFilename = timestamp + "_" + user.getId() + fileExtension;

            // Save file
            Path filePath = uploadPath.resolve(newFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Create material entity
            Material material = new Material();
            material.setTitle(request.getTitle());
            material.setDescription(request.getDescription());
            material.setSubject(subject);
            material.setDepartment(request.getDepartment());
            material.setSemester(request.getSemester());
            material.setFilePath(filePath.toString());
            material.setFileName(originalFilename);
            material.setFileType(fileExtension.substring(1)); // Remove the dot
            material.setFileSize(file.getSize());
            material.setUploadedBy(user);

            // Auto-approve if admin, otherwise pending
            boolean isAdmin = userDetails.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
            if (isAdmin) {
                material.setApprovalStatus(ApprovalStatus.APPROVED);
            } else {
                material.setApprovalStatus(ApprovalStatus.PENDING);
            }

            materialRepository.save(material);

            return ResponseEntity.ok(new MessageResponse("Material uploaded successfully!"));

        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(new MessageResponse("Failed to upload file: " + e.getMessage()));
        }
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<?> downloadMaterial(@PathVariable Long id) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found"));

        if (material.getApprovalStatus() != ApprovalStatus.APPROVED) {
            return ResponseEntity.status(403).body(new MessageResponse("Material not approved for download"));
        }

        try {
            Path filePath = Paths.get(material.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            // Increment download count
            material.incrementDownloadCount();
            materialRepository.save(material);

            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                            "attachment; filename=\"" + material.getFileName() + "\"")
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new MessageResponse("Error downloading file: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MaterialResponse> getMaterialById(@PathVariable Long id) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found"));

        return ResponseEntity.ok(convertToResponse(material));
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
        
        if (material.getApprovalStatus() == ApprovalStatus.APPROVED) {
            response.setDownloadUrl(baseUrl + "/api/materials/download/" + material.getId());
        }
        
        return response;
    }
}
