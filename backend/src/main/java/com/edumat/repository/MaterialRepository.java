package com.edumat.repository;

import com.edumat.model.ApprovalStatus;
import com.edumat.model.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
    List<Material> findByApprovalStatus(ApprovalStatus approvalStatus);
    
    List<Material> findByUploadedById(Long userId);
    
    List<Material> findBySubjectId(Long subjectId);
    
    List<Material> findByDepartment(String department);
    
    List<Material> findBySemester(Integer semester);
    
    @Query("SELECT m FROM Material m WHERE m.approvalStatus = :status AND " +
           "(LOWER(m.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Material> findByStatusAndKeyword(@Param("status") ApprovalStatus status, 
                                         @Param("keyword") String keyword);
    
    @Query("SELECT m FROM Material m WHERE m.approvalStatus = :status AND " +
           "m.subject.id = :subjectId")
    List<Material> findByStatusAndSubject(@Param("status") ApprovalStatus status, 
                                         @Param("subjectId") Long subjectId);
    
    @Query("SELECT m FROM Material m WHERE m.approvalStatus = :status AND " +
           "m.department = :department")
    List<Material> findByStatusAndDepartment(@Param("status") ApprovalStatus status, 
                                            @Param("department") String department);
    
    @Query("SELECT m FROM Material m WHERE m.approvalStatus = :status AND " +
           "m.semester = :semester")
    List<Material> findByStatusAndSemester(@Param("status") ApprovalStatus status, 
                                          @Param("semester") Integer semester);
    
    @Query("SELECT COUNT(m) FROM Material m")
    Long countTotalMaterials();
    
    @Query("SELECT COUNT(m) FROM Material m WHERE m.approvalStatus = :status")
    Long countByApprovalStatus(@Param("status") ApprovalStatus status);
}
