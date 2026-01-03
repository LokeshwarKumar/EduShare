package com.edumat.repository;

import com.edumat.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    List<Subject> findByDepartment(String department);
    
    @Query("SELECT DISTINCT s.department FROM Subject s")
    List<String> findDistinctDepartments();
}
