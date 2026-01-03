package com.edumat.controller;

import com.edumat.model.Subject;
import com.edumat.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    @Autowired
    private SubjectRepository subjectRepository;

    @GetMapping
    public ResponseEntity<List<Subject>> getAllSubjects() {
        List<Subject> subjects = subjectRepository.findAll();
        return ResponseEntity.ok(subjects);
    }

    @GetMapping("/departments")
    public ResponseEntity<List<String>> getAllDepartments() {
        List<String> departments = subjectRepository.findDistinctDepartments();
        return ResponseEntity.ok(departments);
    }

    @GetMapping("/department/{department}")
    public ResponseEntity<List<Subject>> getSubjectsByDepartment(@PathVariable String department) {
        List<Subject> subjects = subjectRepository.findByDepartment(department);
        return ResponseEntity.ok(subjects);
    }

    @PostMapping
    public ResponseEntity<Subject> createSubject(@RequestBody Subject subject) {
        Subject savedSubject = subjectRepository.save(subject);
        return ResponseEntity.ok(savedSubject);
    }
}
