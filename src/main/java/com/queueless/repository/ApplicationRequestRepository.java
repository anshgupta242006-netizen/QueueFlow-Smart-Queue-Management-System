package com.queueless.repository;

import com.queueless.model.ApplicationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApplicationRequestRepository extends JpaRepository<ApplicationRequest, Long> {
    ApplicationRequest findByTokenNumber(String tokenNumber);
}
