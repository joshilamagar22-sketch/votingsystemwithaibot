package com.voteai.controller;

import com.voteai.service.VoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/votes")
public class VoteController {

    @Autowired
    private VoteService voteService;

    @PostMapping("/cast")
    public String castVote(
            @RequestParam Long userId,
            @RequestParam Long candidateId,
            @RequestParam Long electionId) {

        return voteService.castVote(userId, candidateId, electionId);
    }
}