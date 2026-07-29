package com.voteai.service;

import com.voteai.entity.Election;
import com.voteai.repository.ElectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ElectionService {

    @Autowired
    private ElectionRepository electionRepository;

    public Election createElection(Election election) {
        return electionRepository.save(election);
    }

    public List<Election> getAllElections() {
        return electionRepository.findAll();
    }

    public Optional<Election> getElectionById(Long id) {
        return electionRepository.findById(id);
    }

    public Election updateElection(Long id, Election updatedElection) {

        Optional<Election> existingElection =
                electionRepository.findById(id);

        if (existingElection.isEmpty()) {
            return null;
        }

        Election election = existingElection.get();

        election.setTitle(updatedElection.getTitle());
        election.setDescription(updatedElection.getDescription());
        election.setStartDate(updatedElection.getStartDate());
        election.setEndDate(updatedElection.getEndDate());
        election.setStatus(updatedElection.getStatus());

        return electionRepository.save(election);
    }

    public void deleteElection(Long id) {
        electionRepository.deleteById(id);
    }
}