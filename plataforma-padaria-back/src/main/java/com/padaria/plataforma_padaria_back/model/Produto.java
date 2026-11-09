package com.padaria.plataforma_padaria_back.model;

import com.padaria.plataforma_padaria_back.model.enums.statusProduto;
import java.time.OffsetDateTime;
import java.math.BigDecimal;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "produto")
public class Produto {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 120)
    @Column(length = 120)
    private String nome;

    private String descricao;

    @NotNull
    @DecimalMin(value = "0.00", message = "O valor deve ser positivo.")
    @Digits(integer = 8, fraction = 2)
    private BigDecimal preco;


    @DecimalMin(value = "0.0", message = "O valor deve ser positivo.")
    @Digits(integer = 8, fraction = 2)
    private BigDecimal precoPromocional;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status_produto")
    private statusProduto statuProduto = statusProduto.DISPONIVEL;

    @NotNull
    private Boolean ativo = true;
    
    @NotNull
    @Column(name = "criado_em")
    private OffsetDateTime criadoEm;

    @NotNull
    @Column(name = "atualizado_em")
    private OffsetDateTime atualizadoEm;

    @AssertTrue(message = "Caso exista um preco promocional, ele deve ser menor que o padrao")
    public Boolean isPrecoPromocionalValid() {
        return precoPromocional == null || preco.compareTo(precoPromocional) > 0;
    }

}
