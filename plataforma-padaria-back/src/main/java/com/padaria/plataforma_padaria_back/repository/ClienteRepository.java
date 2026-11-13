package com.padaria.plataforma_padaria_back.repository;

import java.time.OffsetDateTime;
import org.springframework.data.jpa.repository.JpaRepository;
import com.padaria.plataforma_padaria_back.model.Cliente;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

   @Query(
      value = "SELECT cadastrar_cliente(:nome, :usuario, :email, :senhaHash, :ativo, :criadoEm, :atualizadoEm)",
      nativeQuery = true
   )
   Cliente cadastrar (
      @Param("nome") String nome,
      @Param("usuario") String usuario,
      @Param("email") String email,
      @Param("senhaHash") String senhaHash,
      @Param("ativo") Boolean ativo,
      @Param("criadoEm") OffsetDateTime criadoEm,
      @Param("atualizadoEm") OffsetDateTime atualizadoEm
   );

}

