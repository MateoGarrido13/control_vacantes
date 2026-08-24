package com.build.vacante.controller;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import com.build.vacante.domain.dto.ErrorDto;
import com.build.vacante.exception.VacanteNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorDto> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String errorMsg = ex.getBindingResult().getFieldErrors().stream()
            .findFirst()
            .map(DefaultMessageSourceResolvable::getDefaultMessage)
            .orElse("Fallo la Validación");

        ErrorDto errorDto = new ErrorDto(errorMsg);
        return new ResponseEntity<>(errorDto, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(VacanteNotFoundException.class)
    public ResponseEntity<ErrorDto> handleVacanteNotFoundException(VacanteNotFoundException ex) {
        String errorMessage = String.format("Vacante with id %s not found", ex.getId());
        ErrorDto errorDto = new ErrorDto(errorMessage);
        return new ResponseEntity<>(errorDto, HttpStatus.NOT_FOUND);
    }
}
