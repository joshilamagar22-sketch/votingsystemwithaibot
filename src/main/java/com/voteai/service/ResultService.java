package com.voteai.service;

import com.voteai.dto.ResultResponse;
import com.voteai.repository.VoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResultService {

    @Autowired
    private VoteRepository voteRepository;

    public List<ResultResponse> getElectionResults(Long electionId) {
        return voteRepository.getElectionResults(electionId);
    }

    public ResultResponse getWinner(Long electionId) {

        List<ResultResponse> results =
                voteRepository.getElectionResults(electionId);

        if (results.isEmpty()) {
            return null;
        }

        return results.get(0);
    }
}