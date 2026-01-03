package com.edumat.dto;

import com.edumat.model.ApprovalStatus;

import java.time.LocalDateTime;

public class MaterialResponse {
    private Long id;
    private String title;
    private String description;
    private String subjectName;
    private Long subjectId;
    private String department;
    private Integer semester;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private ApprovalStatus approvalStatus;
    private String rejectionReason;
    private String uploadedByUsername;
    private String uploadedByFirstName;
    private String uploadedByLastName;
    private LocalDateTime uploadDate;
    private LocalDateTime approvalDate;
    private Long downloadCount;
    private String downloadUrl;

    public MaterialResponse() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public Long getSubjectId() { return subjectId; }
    public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

    public ApprovalStatus getApprovalStatus() { return approvalStatus; }
    public void setApprovalStatus(ApprovalStatus approvalStatus) { this.approvalStatus = approvalStatus; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public String getUploadedByUsername() { return uploadedByUsername; }
    public void setUploadedByUsername(String uploadedByUsername) { this.uploadedByUsername = uploadedByUsername; }

    public String getUploadedByFirstName() { return uploadedByFirstName; }
    public void setUploadedByFirstName(String uploadedByFirstName) { this.uploadedByFirstName = uploadedByFirstName; }

    public String getUploadedByLastName() { return uploadedByLastName; }
    public void setUploadedByLastName(String uploadedByLastName) { this.uploadedByLastName = uploadedByLastName; }

    public LocalDateTime getUploadDate() { return uploadDate; }
    public void setUploadDate(LocalDateTime uploadDate) { this.uploadDate = uploadDate; }

    public LocalDateTime getApprovalDate() { return approvalDate; }
    public void setApprovalDate(LocalDateTime approvalDate) { this.approvalDate = approvalDate; }

    public Long getDownloadCount() { return downloadCount; }
    public void setDownloadCount(Long downloadCount) { this.downloadCount = downloadCount; }

    public String getDownloadUrl() { return downloadUrl; }
    public void setDownloadUrl(String downloadUrl) { this.downloadUrl = downloadUrl; }
}
