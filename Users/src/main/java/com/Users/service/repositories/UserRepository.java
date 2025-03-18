package com.Users.service.repositories;

import com.Users.service.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    User findByEmail(String email);
//    User findByPhone(String phone);
//    User findByUuid(UUID uuid);
//    User findByProviderType(String providerType);
//    User findByCreatedAt(String createdAt);
//    User findByLastSignIn(String lastSignIn);
}
