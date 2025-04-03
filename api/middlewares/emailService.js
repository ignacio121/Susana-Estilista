import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResetPasswordEmail = async (email, resetLink) => {
  try {
    const response = await resend.emails.send({
      from: "Peluquería Susana <no-reply@peluqueria-susana.cl>", // Usa un dominio verificado en Resend
      to: email,
      subject: "🔒 Restablecimiento de contraseña",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 20px; text-align: center;">
          <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #ff6b6b;">🔒 Restablecer tu contraseña</h2>
            
            <p style="color: #333;">Hola,</p>
            <p style="color: #555;">
              Recibimos una solicitud para restablecer tu contraseña.  
              Para continuar, haz clic en el siguiente botón:
            </p>

            <a href="${resetLink}"
               style="display: inline-block; padding: 12px 20px; margin: 15px 0; background-color: #ff6b6b; 
                      color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
              🔄 Restablecer contraseña
            </a>

            <p style="color: #777; font-size: 14px;">
              Si no solicitaste cambiar tu contraseña, simplemente ignora este mensaje.  
              Tu cuenta sigue siendo segura.
            </p>

            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="color: #aaa; font-size: 12px;">
              Este es un mensaje automático, por favor no respondas a este correo.
            </p>
          </div>
        </div>
      `,
    });

    return response;
  } catch (error) {
    console.error("Error enviando email:", error);
    throw new Error("No se pudo enviar el correo");
  }
};
