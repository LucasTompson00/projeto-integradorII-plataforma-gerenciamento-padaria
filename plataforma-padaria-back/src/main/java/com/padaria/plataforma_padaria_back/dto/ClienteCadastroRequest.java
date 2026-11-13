package com.padaria.plataforma_padaria_back.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.*;

public class ClienteCadastroRequest {
    
    @NotBlank
    @Size(max = 120)
    private String nome;

    @Email
    @NotBlank 
    @Size(max = 254)
    private String email;

    @NotBlank 
    @Size(min = 6, max = 72)
    private String senha;

    @JsonIgnore
    @AssertTrue(message = "Os dados devem ser validos.")
    public boolean isCadastroValid() {
        return (email != null && !email.isBlank());
    }

    public String getNome() { return nome; }
    public void setNome(String novoNome) { nome = novoNome; }

    public String getEmail() { return email; }
    public void setEmail(String novoEmail) { email = novoEmail; }

    public String getSenha() { return senha; }
    public void setSenha(String novaSenha) { senha = novaSenha; }

}
