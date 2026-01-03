package com.edumat.config;

import com.edumat.model.ERole;
import com.edumat.model.Role;
import com.edumat.model.Subject;
import com.edumat.repository.RoleRepository;
import com.edumat.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Override
    public void run(String... args) throws Exception {
        initializeRoles();
        initializeSubjects();
    }

    private void initializeRoles() {
        if (roleRepository.count() == 0) {
            List<Role> roles = Arrays.asList(
                new Role(ERole.ROLE_USER),
                new Role(ERole.ROLE_ADMIN)
            );
            roleRepository.saveAll(roles);
            System.out.println("Initialized default roles");
        }
    }

    private void initializeSubjects() {
        if (subjectRepository.count() == 0) {
            List<Subject> subjects = Arrays.asList(
                new Subject("Mathematics", "Mathematics and related topics", "Mathematics"),
                new Subject("Physics", "Physics and related topics", "Physics"),
                new Subject("Chemistry", "Chemistry and related topics", "Chemistry"),
                new Subject("Computer Science", "Computer Science and programming", "Computer Science"),
                new Subject("Electrical Engineering", "Electrical Engineering topics", "Engineering"),
                new Subject("Mechanical Engineering", "Mechanical Engineering topics", "Engineering"),
                new Subject("Civil Engineering", "Civil Engineering topics", "Engineering"),
                new Subject("Biology", "Biology and life sciences", "Biology"),
                new Subject("English", "English language and literature", "English"),
                new Subject("History", "History and historical studies", "History")
            );
            subjectRepository.saveAll(subjects);
            System.out.println("Initialized default subjects");
        }
    }
}
