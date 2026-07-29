package com.voteai.service;

import com.voteai.entity.Candidate;
import com.voteai.repository.CandidateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CandidateService {

    @Autowired
    private CandidateRepository candidateRepository;

    public Candidate addCandidate(Candidate candidate) {
        return candidateRepository.save(candidate);
    }

    public List<Candidate> getAllCandidates() {
        return candidateRepository.findAll();
    }

    public Candidate getCandidateById(Long id) {
        return candidateRepository.findById(id).orElse(null);
    }

    public Candidate updateCandidate(Long id, Candidate updatedCandidate) {

        Candidate candidate = candidateRepository.findById(id).orElse(null);

        if (candidate == null) {
            return null;
        }

        candidate.setFullName(updatedCandidate.getFullName());
        candidate.setPartyName(updatedCandidate.getPartyName());
        candidate.setSymbol(updatedCandidate.getSymbol());
        candidate.setManifesto(updatedCandidate.getManifesto());

        return candidateRepository.save(candidate);
    }

    public void deleteCandidate(Long id) {
        candidateRepository.deleteById(id);
    }
}