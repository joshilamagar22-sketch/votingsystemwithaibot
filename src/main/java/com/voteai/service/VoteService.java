package com.voteai.service;

import com.voteai.entity.Candidate;
import com.voteai.entity.Election;
import com.voteai.entity.User;
import com.voteai.entity.Vote;
import com.voteai.repository.CandidateRepository;
import com.voteai.repository.ElectionRepository;
import com.voteai.repository.UserRepository;
import com.voteai.repository.VoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class VoteService {

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private ElectionRepository electionRepository;

    public String castVote(Long userId, Long candidateId, Long electionId) {

        Optional<User> userOptional = userRepository.findById(userId);
        Optional<Candidate> candidateOptional = candidateRepository.findById(candidateId);
        Optional<Election> electionOptional = electionRepository.findById(electionId);

        if (userOptional.isEmpty()) {
            return "User not found.";
        }

        if (candidateOptional.isEmpty()) {
            return "Candidate not found.";
        }

        if (electionOptional.isEmpty()) {
            return "Election not found.";
        }

        User user = userOptional.get();
        Candidate candidate = candidateOptional.get();
        Election election = electionOptional.get();

        // Prevent duplicate voting
        if (voteRepository.existsByUserAndElection(user, election)) {
            return "You have already voted in this election.";
        }

        // Allow voting only if election is ACTIVE
        if (election.getStatus() != Election.ElectionStatus.ACTIVE) {
            return "Voting is not allowed. Election is not active.";
        }

        Vote vote = new Vote();
        vote.setUser(user);
        vote.setCandidate(candidate);
        vote.setElection(election);
        vote.setVotedAt(LocalDateTime.now());

        voteRepository.save(vote);

        return "Vote cast successfully.";
    }
}