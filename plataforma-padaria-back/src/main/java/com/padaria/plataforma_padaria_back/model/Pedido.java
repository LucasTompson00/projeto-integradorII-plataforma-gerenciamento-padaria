package com.padaria.plataforma_padaria_back.model;

import com.padaria.plataforma_padaria_back.model.enums.statusPedido;
import com.padaria.plataforma_padaria_back.model.enums.turnoEncomenda;
import java.time.OffsetDateTime;
import java.time.LocalDate;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "pedido")
public class Pedido {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull 
    @ManyToOne 
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @NotNull
    @Column(name = "criado_em")
    private OffsetDateTime criadoEm;

    @NotNull
    @Column(name = "retirada_em")
    private OffsetDateTime retiradaEm;

    @NotNull 
    @Column(name = "prazo_limite_retirada")
    private OffsetDateTime prazoLimiteRetirada;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "turno_retira")
    private turnoEncomenda turnoEncomenda;
    
    @NotNull 
    @Column(name = "data_retirada")
    private LocalDate dataRetirada;
    
    @NotNull
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private statusPedido status = statusPedido.PENDENTE;

    private String observacao;

    @Column(name = "recebido_em")
    private OffsetDateTime recebidoEm;

    @Column(name = "concluido_em")
    private OffsetDateTime concluidoEm;

    @Column(name = "retirado_em")
    private OffsetDateTime retiradoEm;
    
    @Column(name = "cancelado_em")
    private OffsetDateTime canceladoEm;

    @AssertTrue(message = "A data de retirada tem que ser depois da data de criacao do pedido.")
    public Boolean isRetiraValid() {
        return retiradaEm == null || criadoEm == null || 
        retiradaEm.isAfter(criadoEm);
    }

    @AssertTrue(message = "O horario de retirada deve ser anterior ao horario limite para retirar.")
    public Boolean isRetiradaValid() {
        return prazoLimiteRetirada == null || retiradaEm == null ||
        !prazoLimiteRetirada.isBefore(retiradaEm);
    }

}
