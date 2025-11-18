import com.opty.socket.tradicional.comunicado.*;

/**
 * Thread que fica escutando mensagens do servidor.
 */
public class TratadoraDeMensagens extends Thread {
    private Parceiro servidor;

    // --- CONSTRUTOR ---
    public TratadoraDeMensagens(Parceiro servidor) throws Exception {
        if (servidor == null)
            throw new Exception("Servidor ausente");

        this.servidor = servidor;
    }

    // --- MÉTODO PRINCIPAL DA THREAD ---
    public void run() {
        for(;;) {
            try {
                Comunicado comunicado = this.servidor.espie();

                // Comunicado de desligamento
                if (comunicado instanceof ComunicadoDeDesligamento) {
                    System.out.println("\n⚠️  O servidor vai ser desligado agora;");
                    System.out.println("   Volte mais tarde!\n");
                    System.exit(0);
                }

                // Mensagem de texto
                else if (comunicado instanceof MensagemTexto) {
                    MensagemTexto mensagem = (MensagemTexto)this.servidor.envie();
                    System.out.println("\n" + mensagem.getRemetente() + "> " + mensagem.getConteudo());
                    System.out.flush();
                }

                // Outros comunicados
                else {
                    this.servidor.envie();
                }

            // Conexão perdida
            } catch (Exception erro) {
                System.err.println("\n❌ Conexão com servidor perdida!");
                System.exit(1);
            }
        }
    }
}
