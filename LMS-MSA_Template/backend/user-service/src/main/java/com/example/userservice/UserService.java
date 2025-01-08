package com.example.userservice;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserProfileRepository userProfileRepository;

    public UserService(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    public List<UserProfile> getAllUsers() {
        return userProfileRepository.findAll();
    }

    public UserProfile getUserById(Long id) {
        return userProfileRepository.findById(id).orElse(null);
    }

    public UserProfile createUser(UserProfile user) {
        return userProfileRepository.save(user);
    }

    public void deleteUser(Long id) {
        userProfileRepository.deleteById(id);
    }

    public UserProfile getUserByEmail(String email) {
        return userProfileRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public UserProfile updateUser(UserProfile user) {
        return userProfileRepository.save(user);
    }
}
