package com.voteai.service;

import com.voteai.entity.Election;
import com.voteai.repository.ElectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ElectionService {

    @Autowired
    private ElectionRepository electionRepository;

    // Create Election
    public Election createElection(Election election) {

        validateDates(election);
        updateElectionStatus(election);

        return electionRepository.save(election);
    }

    // Get All Elections
    public List<Election> getAllElections() {
        return electionRepository.findAll();
    }

    // Get Election By ID
    public Optional<Election> getElectionById(Long id) {
        return electionRepository.findById(id);
    }

    // Update Election
    public Election updateElection(Long id, Election updatedElection) {

        Optional<Election> optionalElection = electionRepository.findById(id);

        if (optionalElection.isEmpty()) {
            return null;
        }

        validateDates(updatedElection);
        updateElectionStatus(updatedElection);

        Election election = optionalElection.get();

        election.setTitle(updatedElection.getTitle());
        election.setDescription(updatedElection.getDescription());
        election.setStartDate(updatedElection.getStartDate());
        election.setEndDate(updatedElection.getEndDate());
        election.setStatus(updatedElection.getStatus());

        return electionRepository.save(election);
    }

    // Delete Election
    public boolean deleteElection(Long id) {

        if (!electionRepository.existsById(id)) {
            return false;
        }

        electionRepository.deleteById(id);
        return true;
    }

    // Validate Start and End Dates
    private void validateDates(Election election) {

        if (election.getEndDate().isBefore(election.getStartDate())) {
            throw new IllegalArgumentException(
                    "End date cannot be before start date."
            );
        }
    }

    // Automatically Set Election Status
    private void updateElectionStatus(Election election) {

        LocalDateTime now = LocalDateTime.now();

        if (now.isBefore(election.getStartDate())) {
            election.setStatus(Election.ElectionStatus.UPCOMING);
        } else if (now.isAfter(election.getEndDate())) {
            election.setStatus(Election.ElectionStatus.COMPLETED);
        } else {
            election.setStatus(Election.ElectionStatus.ACTIVE);
        }
    }
}