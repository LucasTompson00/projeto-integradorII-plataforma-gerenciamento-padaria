package com.padaria.plataforma_padaria_back.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.*;

public class ClienteLoginRequest {
    
    @Email 
    @NotBlank 
    @Size(max = 254)
    private String email;

    @NotBlank 
    @Size(min = 6, max = 72)
    private String senha;

    @JsonIgnore 
    @AssertTrue(message = "")
    public boolean isLoginValid() {
        return (email != null && !email.isBlank());
    }

    public String getEmail() { return email; }
    public void setEmail(String novoEmail) { email = novoEmail; }

    public String getSenha() { return senha; }
    public void setSenha(String novaSenha) { senha = novaSenha; }

}
