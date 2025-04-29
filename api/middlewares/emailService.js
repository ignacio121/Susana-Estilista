import { Resend } from "resend";
import QRCode from "qrcode";
import { supabase } from "../config/supabaseClient.js";

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

export const saleDetailsEmail = async (email, uuid, details, nombre_cliente, total, orden_compra) => {
  try {
    const qrImageURL = await generateAndStoreQRCode(uuid);

    // Formatear los detalles en HTML
    const detailsHtml = details
      .map(
        (item) => `
        <tr style="text-align: left; border-bottom: 1px solid #ddd;">
          <td style="padding: 8px;">${item.nombre_producto}</td>
          <td style="padding: 8px; text-align: right;">$${item.precio_unitario.toLocaleString()}</td>
          <td style="padding: 8px; text-align: center;">x${item.cantidad}</td>
        </tr>
      `
      )
      .join("");

    const response = await resend.emails.send({
      from: "Peluquería Susana <no-reply@peluqueria-susana.cl>", // Usa un dominio verificado en Resend
      to: email,
      subject: "📦 ¡Tu código QR y detalles de tu compra!",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 20px; text-align: center;">
          <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #ff6b6b;">📦 Detalles de tu compra 📦</h2>
            
            <p style="color: #333;">Hola, ${nombre_cliente}</p>
            <p style="color: #555;">
              Gracias por tu compra en <strong>Peluquería Susana</strong>.  
              Tu orden de compra es: <strong>ORD-${orden_compra}</strong>.  
              Para retirar tu producto, por favor presenta el siguiente código QR en nuestra tienda:
            </p>
    
            <div style="margin: 20px 0;">
              <img src="${qrImageURL}" alt="Código QR" style="width: 200px; height: 200px; border: 1px solid #ddd; border-radius: 10px;">
            </div>

            <h3 style="color: #ff6b6b;">Detalles de tu compra</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background-color: #f8f9fa; text-align: left;">
                  <th style="padding: 8px; text-align: left;">Producto</th>
                  <th style="padding: 8px; text-align: right;">Precio</th>
                  <th style="padding: 8px; text-align: center;">Cantidad</th>
                </tr>
              </thead>
              <tbody>
                ${detailsHtml}
                <tr style="background-color: #f8f9fa; font-weight: bold;">
                  <td style="padding: 8px;">Total</td>
                  <td style="padding: 8px; text-align: right;">$${total.toLocaleString()}</td>
                  <td style="padding: 8px; text-align: center;">-</td>
                </tr>
              </tbody>
            </table>
    
            <p style="color: #777;">
              Este código QR está asociado a tu compra y nos permitirá verificar los detalles rápidamente.
            </p>
    
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="color: #aaa; font-size: 12px;">
              Si tienes alguna consulta, no dudes en contactarnos.  
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

async function generateAndStoreQRCode(uuid) {
  try {
      // Generar el QR como un archivo PNG
      const qrBuffer = await QRCode.toBuffer(uuid, {
          width: 300,
          margin: 1,
      });

      // Nombre único del archivo
      const fileName = `${uuid}.png`;

      // Subir el archivo al bucket de Supabase
      const { data, error } = await supabase.storage
          .from("qr-codes")
          .upload(fileName, qrBuffer, {
              contentType: 'image/png',
          });

      if (error) throw new Error(`Error al subir el archivo: ${error.message}`);
        
      // Generar URL pública

      const publicUrlResponse = supabase.storage
        .from("qr-codes")
        .getPublicUrl(data.path);

      return publicUrlResponse.data.publicUrl;
  } catch (error) {
      console.error('Error al generar o almacenar el QR:', error.message);
      throw error;
  }
}