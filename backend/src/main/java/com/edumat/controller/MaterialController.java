package com.edumat.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
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
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
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

    @Autowired
    private Cloudinary cloudinary;

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    // ================= PUBLIC MATERIALS =================

    @GetMapping("/public")
    public ResponseEntity<List<MaterialResponse>> getApprovedMaterials() {

        List<MaterialResponse> responses = materialRepository
                .findByApprovalStatus(ApprovalStatus.APPROVED)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    // ================= MY MATERIALS =================

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MaterialResponse>> getMyMaterials(Authentication authentication) {

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        List<MaterialResponse> responses = materialRepository
                .findByUploadedById(userDetails.getId())
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    // ================= UPLOAD MATERIAL =================

    @PostMapping("/upload")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> uploadMaterial(
            @RequestPart("material") MaterialUploadRequest request,
            @RequestPart("file") MultipartFile file,
            Authentication authentication) {

        try {

            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Please select a file"));
            }

            if (file.getSize() > MAX_FILE_SIZE) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("File size exceeds 10MB"));
            }

            UserDetailsImpl userDetails =
                    (UserDetailsImpl) authentication.getPrincipal();

            User user = userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Subject subject = subjectRepository.findById(request.getSubjectId())
                    .orElseThrow(() -> new RuntimeException("Subject not found"));

            // Upload to Cloudinary with auto resource type detection
            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "edumat_materials",
                            "resource_type", "auto",
                            "use_filename", true,
                            "unique_filename", false
                    )
            );

            String fileUrl = uploadResult.get("secure_url").toString();

            Material material = new Material();
            material.setTitle(request.getTitle());
            material.setDescription(request.getDescription());
            material.setSubject(subject);
            material.setDepartment(request.getDepartment());
            material.setSemester(request.getSemester());
            material.setFileUrl(fileUrl);
            material.setFileName(file.getOriginalFilename());
            material.setFileType(file.getContentType());
            material.setFileSize(file.getSize());
            material.setUploadedBy(user);

            boolean isAdmin = userDetails.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

            material.setApprovalStatus(
                    isAdmin ? ApprovalStatus.APPROVED : ApprovalStatus.PENDING
            );

            materialRepository.save(material);

            return ResponseEntity.ok(
                    new MessageResponse("Material uploaded successfully")
            );

        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(new MessageResponse("Upload failed: " + e.getMessage()));
        }
    }

    // ================= DOWNLOAD MATERIAL =================

    @GetMapping("/download/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> downloadMaterial(@PathVariable Long id) {
        try {
            Material material = materialRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Material not found"));

            // Check if material is approved
            if (material.getApprovalStatus() != ApprovalStatus.APPROVED) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Material is not approved for download"));
            }

            // Increment download count
            material.incrementDownloadCount();
            materialRepository.save(material);

            // Return Cloudinary URL for direct download
            return ResponseEntity.ok(Map.of(
                    "downloadUrl", material.getFileUrl(),
                    "fileName", material.getFileName(),
                    "fileType", material.getFileType()
            ));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new MessageResponse("Download failed: " + e.getMessage()));
        }
    }

    // ================= GET BY ID =================

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MaterialResponse> getMaterialById(@PathVariable Long id) {

        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found"));

        return ResponseEntity.ok(convertToResponse(material));
    }

    // ================= CONVERT ENTITY TO DTO =================

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
        response.setUploadDate(material.getUploadDate());
        response.setDownloadCount(material.getDownloadCount());

        if (material.getApprovalStatus() == ApprovalStatus.APPROVED) {
            response.setDownloadUrl(material.getFileUrl());
        }

        return response;
    }
}