package com.padaria.plataforma_padaria_back.controller;


import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api")
public class apiController{

    @GetMapping()
    public String hello(){
        return "Hello World";
    }
}

