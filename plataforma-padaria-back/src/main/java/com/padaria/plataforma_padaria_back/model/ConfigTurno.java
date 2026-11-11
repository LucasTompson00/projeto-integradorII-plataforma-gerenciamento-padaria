package com.padaria.plataforma_padaria_back.model;

import com.padaria.plataforma_padaria_back.model.enums.turnoEncomenda;
import java.time.LocalTime;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "config_turno")
public class ConfigTurno {
    
    @Id 
    @Enumerated(EnumType.STRING)
    private turnoEncomenda turno;
    
    @NotNull
    @Column(name = "hora_inicio", nullable = false)
    private LocalTime horaInicio;

    @NotNull
    @Column(name = "hora_fim", nullable = false)
    private LocalTime horaFim;

    @NotNull 
    @Column(name = "limite_encomendas", nullable = false)
    @Min(value = 1, message = "O valor informado deve ser positivo.")
    private Integer limiteEncomendas;

    @AssertTrue(message = "O horario de inicio deve ser anterior ao horario de fim.")
    public Boolean isValidHorarios() {
        if(horaInicio == null || horaFim == null) return false;
        return horaInicio.isBefore(horaFim);
    }

}
