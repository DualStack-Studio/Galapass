package com.galapass.api.controller;

import com.galapass.api.DTO.user.GuideSearchRequest;
import com.galapass.api.DTO.user.UserCompaniesDTO;
import com.galapass.api.DTO.user.UserPatchRequest;
import com.galapass.api.DTO.user.UserResponse;
import com.galapass.api.entity.user.User;
import com.galapass.api.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User API", description = "User API")
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserCompaniesDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.createUser(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<User>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Optional<User>> getUserByEmail(@PathVariable String email) {
        return ResponseEntity.ok(userService.getUserByEmail(email));
    }


    @PatchMapping("/{id}")
    public ResponseEntity<?> patchUser(@PathVariable Long id, @RequestBody UserPatchRequest request) {
       try {
           UserResponse updatedUser = userService.patchUser(id, request);
           return ResponseEntity.ok(updatedUser);
       } catch (DataIntegrityViolationException e) {
           return ResponseEntity.status(HttpStatus.CONFLICT).body("Update failed, email already used");
       }
    }

    @DeleteMapping("/{id}")
    public void deleteUserById(@PathVariable Long id) {
        userService.deleteUserById(id);
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<UserResponse>> getUsersByRole(@PathVariable String role) {
        return ResponseEntity.ok(userService.getUsersByRole(role));
    }

    @PostMapping("/guides/search")
    public ResponseEntity<List<UserResponse>> searchGuides(@RequestBody GuideSearchRequest request) {
        return ResponseEntity.ok(userService.getGuideByName(request.getName()));
    }

}