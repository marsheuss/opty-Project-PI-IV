package com.opty.socket.tradicional;

import com.opty.socket.service.MessageRouter;
import com.opty.socket.service.SessionManager;
import com.opty.socket.service.SupervisorQueueService;
import lombok.extern.slf4j.Slf4j;

import java.net.*;
import java.util.*;

/**
 * Thread que fica aceitando novas conexões Socket e cria SupervisoraDeConexao para cada uma.
 */
@Slf4j
public class AceitadoraDeConexao extends Thread {
    private ServerSocket pedido;
    private ArrayList<Parceiro> usuarios;

    // Integração com o projeto
    private final SessionManager sessionManager;
    private final MessageRouter messageRouter;
    private final SupervisorQueueService supervisorQueueService;

    // --- CONSTRUTOR ---
    public AceitadoraDeConexao(String porta, ArrayList<Parceiro> usuarios, SessionManager sessionManager, MessageRouter messageRouter, SupervisorQueueService supervisorQueueService) throws Exception {
        if (porta == null)
            throw new Exception("Porta ausente");

        try {
            this.pedido = new ServerSocket(Integer.parseInt(porta));
        } catch (Exception  erro) {
            throw new Exception("Porta invalida");
        }

        if (usuarios == null)
            throw new Exception("Usuarios ausentes");

        this.usuarios = usuarios;
        this.sessionManager = sessionManager;
        this.messageRouter = messageRouter;
        this.supervisorQueueService = supervisorQueueService;

        log.info("AceitadoraDeConexao criada na porta {}", porta);
    }

    public void run() {
        log.info("AceitadoraDeConexao iniciada. Aguardando conexões...");

        // Loop infinito aceitando conexões
        for(;;) {
            Socket conexao = null;

            // Aceita nova conexão
            try {
                conexao = this.pedido.accept();
                log.info("Nova conexão Socket aceita de: {}", conexao.getInetAddress().getHostAddress());

            // Erro ao aceitar conexão
            } catch (Exception erro) {
                log.error("Erro ao aceitar conexão: {}", erro.getMessage());
                continue;
            }

            // Cria e inicia SupervisoraDeConexao para nova conexão
            SupervisoraDeConexao supervisoraDeConexao = null;
            try {
                supervisoraDeConexao = new SupervisoraDeConexao(conexao, usuarios, sessionManager, messageRouter, supervisorQueueService);
            } catch (Exception erro) {
                log.error("Erro ao criar SupervisoraDeConexao: {}", erro.getMessage());
            }

            // Inicia a thread da SupervisoraDeConexao
            if (supervisoraDeConexao != null) {
                supervisoraDeConexao.start();
                log.info("SupervisoraDeConexao iniciada para novo cliente");
            }
        }
    }
}
