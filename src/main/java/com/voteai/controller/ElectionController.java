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

    @PostMapping
    public Election createElection(@RequestBody Election election) {
        return electionService.createElection(election);
    }

    @GetMapping
    public List<Election> getAllElections() {
        return electionService.getAllElections();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Election> getElectionById(@PathVariable Long id) {

        return electionService.getElectionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Election> updateElection(
            @PathVariable Long id,
            @RequestBody Election election) {

        Election updatedElection =
                electionService.updateElection(id, election);

        if (updatedElection == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedElection);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteElection(@PathVariable Long id) {

        electionService.deleteElection(id);

        return ResponseEntity.noContent().build();
    }
}
