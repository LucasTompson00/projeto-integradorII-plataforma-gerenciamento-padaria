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
        return (email != null && !email.isBlank());
    }

    public Long getId() { return id; }
    public void setId(Long novoId) { id = novoId; }

    public String getNome() { return nome; }
    public void setName(String novoNome) { nome = novoNome; }

    public String getSenhaHash() { return senhaHash; }
    public void setSenhaHash(String novaSenhaHash) { senhaHash = novaSenhaHash; }

    public String getEmail() { return email; }
    public void setEmail(String novoEmail) { email = novoEmail; }

    public boolean getAtivo() { return ativo; }
    public void setAtivo(boolean novoAtivo) { ativo = novoAtivo; }

    public OffsetDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(OffsetDateTime novoCriadoEm) { criadoEm = novoCriadoEm; }

    public OffsetDateTime getAtualizadoEm() { return atualizadoEm; }
    public void setAtualizadoEm(OffsetDateTime novoAtualizadoEm) { atualizadoEm = novoAtualizadoEm; }

}
