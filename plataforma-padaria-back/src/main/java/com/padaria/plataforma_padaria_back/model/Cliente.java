package com.padaria.plataforma_padaria_back.model;

import java.time.OffsetDateTime;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "cliente")
public class Cliente {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 120)
    @Column(length = 120, nullable = false)
    private String nome;

    @Size(max = 40)
    @Column(length = 40)
    private String usuario;

    @Email
    @Size(max = 254)
    @Column(length = 254)
    private String email;

    @NotBlank
    @Column(name = "senha_hash", nullable = false)
    private String senhaHash;

    @Column(nullable = false)
    private Boolean ativo = true;

    @Column(name = "criado_em", nullable = false)
    private OffsetDateTime criadoEm;

    @Column(name = "atualizado_em", nullable = false)
    private OffsetDateTime atualizadoEm;

    @AssertTrue(message = "Falha")
    public boolean isLoginValid(){
        return (email != null && !email.isBlank()) || 
        (usuario != null && usuario.isBlank());
    }

}
