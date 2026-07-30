package com.voteai.repository;

import com.voteai.entity.Election;
import com.voteai.entity.User;
import com.voteai.entity.Vote;
import com.voteai.dto.ResultResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface VoteRepository extends JpaRepository<Vote, Long> {

    boolean existsByUserAndElection(User user, Election election);

    @Query("""
            SELECT new com.voteai.dto.ResultResponse(
                v.candidate.id,
                v.candidate.fullName,
                COUNT(v)
            )
            FROM Vote v
            WHERE v.election.id = :electionId
            GROUP BY v.candidate.id, v.candidate.fullName
            ORDER BY COUNT(v) DESC
            """)
    List<ResultResponse> getElectionResults(Long electionId);
}