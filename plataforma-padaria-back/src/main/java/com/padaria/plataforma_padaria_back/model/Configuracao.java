package com.padaria.plataforma_padaria_back.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity 
@Table(name = "configuracao")
public class Configuracao {
    
    @Id 
    @Column(name = "id", nullable = false)
    private Boolean id = true;

    @NotNull 
    @Column(name = "antecedencia_minima_min", nullable = false)
    @Min(value = 0, message = "O valor minimo deve ser positivo ou nulo.")
    private Integer antecedenciaMinimaMin = 90;

    @NotNull 
    @Column(name = "tolerancia_retirada_min", nullable = false)
    @Min(value = 1, message = "O valor minimo deve ser positivo.")
    private Integer toleranciaRetiradaMin = 60;

    @NotBlank 
    @Column(name = "fuso_horario", nullable = false)
    private String fusoHorario = "America/Sao_Paulo";

    public boolean getId() { return id; }
    public void setId(Boolean novoId) { id = novoId; }

    public Integer getAntecedenciaMinimaMin() { return antecedenciaMinimaMin; }
    public void setAntecedenciaMinimaMin(Integer novoAntecedenciaMinimaMin) { antecedenciaMinimaMin = novoAntecedenciaMinimaMin; }

    public Integer getToleranciaRetiradaMin() { return toleranciaRetiradaMin; }
    public void setToleranciaRetiradaMin(Integer novoToleranciaRetiradaMin) { toleranciaRetiradaMin = novoToleranciaRetiradaMin; }

    public String getFusoHorario() { return fusoHorario; }
    public void setFusoHorario(String novoFusoHorario) { fusoHorario = novoFusoHorario; }

}
