package com.padaria.plataforma_padaria_back.dto;

import com.padaria.plataforma_padaria_back.model.Cliente;

public class ClienteResponse {
    
    private Long id;
    private String nome;
    private String email;
    private Boolean ativo;

    public ClienteResponse(Cliente cliente) {
        this.id = cliente.getId();
        this.nome = cliente.getNome();
        this.email = cliente.getEmail();
        this.ativo = cliente.getAtivo();
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getEmail() { return email; }
    public boolean getAtivo() { return ativo; }

}
