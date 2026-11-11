package com.padaria.plataforma_padaria_back.model;

import java.time.OffsetDateTime;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity 
@Table(name = "acesso_funcionario")
public class AcessoFuncionario {
    
    @Id 
    @Column(name = "id", nullable = false)
    private Boolean id = true;

    @NotBlank 
    @Size(max = 40)
    @Column(length = 40, name = "usuario", nullable = false)
    private String usuario;

    @NotBlank 
    @Column(name = "senha_hash", nullable = false)
    private String senhaHash;

    @NotNull 
    @Column(name = "atualizado_em", nullable = false)
    private OffsetDateTime atualizadoEm;

}
