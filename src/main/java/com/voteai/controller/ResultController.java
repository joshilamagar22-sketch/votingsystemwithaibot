package com.voteai.controller;

import com.voteai.dto.ResultResponse;
import com.voteai.service.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
public class ResultController {

    @Autowired
    private ResultService resultService;

    @GetMapping("/{electionId}")
    public List<ResultResponse> getResults(
            @PathVariable Long electionId) {

        return resultService.getElectionResults(electionId);
    }

    @GetMapping("/winner/{electionId}")
    public ResultResponse getWinner(
            @PathVariable Long electionId) {

        return resultService.getWinner(electionId);
    }
}