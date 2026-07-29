package com.voteai.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "candidates")
public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    private String partyName;

    private String symbol;

    private String manifesto;

    public Candidate() {
    }

    public Candidate(Long id,
                     String fullName,
                     String partyName,
                     String symbol,
                     String manifesto) {
        this.id = id;
        this.fullName = fullName;
        this.partyName = partyName;
        this.symbol = symbol;
        this.manifesto = manifesto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPartyName() {
        return partyName;
    }

    public void setPartyName(String partyName) {
        this.partyName = partyName;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getManifesto() {
        return manifesto;
    }

    public void setManifesto(String manifesto) {
        this.manifesto = manifesto;
    }
}