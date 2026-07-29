package com.voteai.repository;

import com.voteai.entity.Election;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ElectionRepository extends JpaRepository<Election, Long> {
}

