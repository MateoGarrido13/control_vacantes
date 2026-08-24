package com.build.vacante.exception;

import java.util.UUID;

public class VacanteNotFoundException extends RuntimeException {
    private final UUID id;

    public VacanteNotFoundException(UUID id) {
        super(String.format("Vacante with id %s not found", id));
        this.id = id;
    }

    public UUID getId() {
        return id;
    }
}
