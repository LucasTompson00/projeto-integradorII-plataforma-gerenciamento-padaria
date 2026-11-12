package com.padaria.plataforma_padaria_back.model;

import java.math.BigDecimal;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(
    name = "item_pedido",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_item_pedido_produto",
            columnNames = {"pedido_id", "produto_id"}
        )
    }
)
public class ItemPedido {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;

    @ManyToOne(optional = false)
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    @NotNull 
    @Column(name = "quantidade", nullable = false)
    @Min(value = 1, message = "O valor minimo deve ser positivo.")
    private Integer quantidade;

    @NotNull 
    @Column(name = "preco_unitario", nullable = false)
    @Digits(integer = 10, fraction = 2)
    @DecimalMin(value = "0.00", message = "O valor nao deve ser negativo.")
    private BigDecimal precoUnitario;

}
