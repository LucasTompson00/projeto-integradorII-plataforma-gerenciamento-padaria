package com.padaria.plataforma_padaria_back.model;

import com.padaria.plataforma_padaria_back.model.enums.destinatarioNotificacao;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import jakarta.validation.constraints.*;

@Entity 
@Table(name = "notificacao")
public class Notificacao {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;

    @NotNull 
    @Enumerated(EnumType.STRING)
    @Column(name = "destinatario", nullable = false)
    private destinatarioNotificacao destinatario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @NotBlank 
    @Column(name = "mensagem", nullable = false)
    private String mensagem;

    @NotNull
    @Column(name = "criada_em", nullable = false)
    private OffsetDateTime criadaEm;

    @Column(name = "enviada_em")
    private OffsetDateTime enviadaEm;

    @Column(name = "lida_em")
    private OffsetDateTime lidaEm;

    @AssertTrue(message = "O cliente deve ser informado somente quando o destinatario for CLIENTE.")
    public boolean isValidNotificacao() {
        return (destinatario == destinatarioNotificacao.CLIENTE && cliente != null) ||
        (destinatario == destinatarioNotificacao.CAIXA && cliente == null);
    }

    public Long getId() { return id; }
    public void setId(long novoId) { id = novoId; }

    public Pedido getPedido() { return pedido; }
    public void setPedido(Pedido novoPedido) { pedido = novoPedido; }

    public destinatarioNotificacao getDestinatario() { return destinatario; }
    public void setDestinatario(destinatarioNotificacao novoDestinatario) { destinatario = novoDestinatario; }

    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente novoCliente) { cliente = novoCliente; }

    public String getMensagem() { return mensagem; }
    public void setMensagem(String novaMensagem) { mensagem = novaMensagem; }

    public OffsetDateTime getCriadaEm() { return criadaEm; }
    public void setCriadaEm(OffsetDateTime novaCriadaEm) { criadaEm = novaCriadaEm; } 

    public OffsetDateTime getEnviadaEm() { return enviadaEm; }
    public void setEnviadaEm(OffsetDateTime novoEnviadaEm) { enviadaEm = novoEnviadaEm; }

    public OffsetDateTime getLidaEm() { return lidaEm; } 
    public void setLidaEm(OffsetDateTime novoLidaEm) { lidaEm = novoLidaEm; }

}
