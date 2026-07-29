package com.voteai.controller;

import com.voteai.entity.Election;
import com.voteai.service.ElectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/elections")
public class ElectionController {

    @Autowired
    private ElectionService electionService;

    // Create Election
    @PostMapping
    public ResponseEntity<Election> createElection(@RequestBody Election election) {

        Election savedElection = electionService.createElection(election);

        return ResponseEntity.ok(savedElection);
    }

    // Get All Elections
    @GetMapping
    public ResponseEntity<List<Election>> getAllElections() {

        return ResponseEntity.ok(electionService.getAllElections());
    }

    // Get Election By ID
    @GetMapping("/{id}")
    public ResponseEntity<Election> getElectionById(@PathVariable Long id) {

        return electionService.getElectionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update Election
    @PutMapping("/{id}")
    public ResponseEntity<Election> updateElection(
            @PathVariable Long id,
            @RequestBody Election election) {

        Election updatedElection = electionService.updateElection(id, election);

        if (updatedElection == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedElection);
    }

    // Delete Election
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteElection(@PathVariable Long id) {

        boolean deleted = electionService.deleteElection(id);

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok("Election deleted successfully.");
    }
}