import nodemailer from 'nodemailer';
import { IReserva } from '../models/Reserva';

// Configuración del transporter de nodemailer
const createTransporter = () => {
  // Configuración desde variables de entorno
  const emailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true para 465, false para otros puertos
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || ''
    }
  };

  // Si no hay credenciales configuradas, usar un transporter de prueba (solo para desarrollo)
  if (!emailConfig.auth.user || !emailConfig.auth.pass) {
    console.warn('⚠️  SMTP no configurado. Usando modo de prueba. Los emails no se enviarán realmente.');
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'test@ethereal.email',
        pass: 'test'
      }
    });
  }

  return nodemailer.createTransport(emailConfig);
};

// Función para enviar email de confirmación de reserva
export const enviarEmailConfirmacion = async (reserva: any): Promise<void> => {
  try {
    const transporter = createTransporter();

    // Obtener información del paquete
    const nombrePaquete = reserva.paquete?.nombre || 'Paquete de viaje';
    const destino = reserva.paquete?.destino || 'Destino no especificado';
    const precio = reserva.paquete?.precio || reserva.precioTotal;
    const moneda = reserva.paquete?.moneda || 'ARS';

    // Formatear fecha
    const fechaViaje = new Date(reserva.fechaViaje).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const fechaReserva = new Date(reserva.fechaReserva).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Formatear precio
    const formatearPrecio = (precio: number, moneda: string) => {
      const simbolos: { [key: string]: string } = {
        USD: '$',
        ARS: '$',
        BRL: 'R$',
        MXN: '$',
        EUR: '€',
        COP: '$',
        CLP: '$',
        PEN: 'S/'
      };
      return `${simbolos[moneda] || '$'} ${precio.toLocaleString('es-AR')}`;
    };

    // HTML del email
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
          .info-box { background-color: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #4CAF50; }
          .info-label { font-weight: bold; color: #666; }
          .info-value { color: #333; margin-top: 5px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .status-badge { display: inline-block; padding: 5px 15px; background-color: #4CAF50; color: white; border-radius: 20px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Reserva Confirmada</h1>
            <p>Volá Barato</p>
          </div>
          <div class="content">
            <p>Estimado/a <strong>${reserva.datosContacto.nombre}</strong>,</p>
            
            <p>Nos complace informarte que tu reserva ha sido <span class="status-badge">CONFIRMADA</span>.</p>
            
            <div class="info-box">
              <div class="info-label">Número de Reserva:</div>
              <div class="info-value"><strong>${reserva.numeroReserva}</strong></div>
            </div>
            
            <div class="info-box">
              <div class="info-label">Paquete:</div>
              <div class="info-value">${nombrePaquete}</div>
            </div>
            
            <div class="info-box">
              <div class="info-label">Destino:</div>
              <div class="info-value">${destino}</div>
            </div>
            
            <div class="info-box">
              <div class="info-label">Fecha de Viaje:</div>
              <div class="info-value">${fechaViaje}</div>
            </div>
            
            <div class="info-box">
              <div class="info-label">Cantidad de Personas:</div>
              <div class="info-value">${reserva.cantidadPersonas}</div>
            </div>
            
            <div class="info-box">
              <div class="info-label">Precio Total:</div>
              <div class="info-value"><strong>${formatearPrecio(reserva.precioTotal, moneda)}</strong></div>
            </div>
            
            <div class="info-box">
              <div class="info-label">Método de Pago:</div>
              <div class="info-value">${reserva.metodoPago === 'efectivo' ? 'Efectivo' : reserva.metodoPago === 'tarjeta' ? 'Tarjeta' : 'Transferencia'}</div>
            </div>
            
            ${reserva.observaciones ? `
            <div class="info-box">
              <div class="info-label">Observaciones:</div>
              <div class="info-value">${reserva.observaciones}</div>
            </div>
            ` : ''}
            
            <p style="margin-top: 20px;">Fecha de reserva: ${fechaReserva}</p>
            
            <p style="margin-top: 20px;">Próximamente recibirás información adicional sobre el pago y los detalles de tu viaje.</p>
            
            <p>Si tienes alguna consulta, no dudes en contactarnos.</p>
            
            <p>¡Esperamos que disfrutes tu viaje!</p>
            
            <p>Saludos cordiales,<br><strong>Equipo Volá Barato</strong></p>
          </div>
          <div class="footer">
            <p>Este es un email automático, por favor no responder.</p>
            <p>Volá Barato - Tu agencia de viajes de confianza</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Texto plano alternativo
    const textContent = `
      RESERVA CONFIRMADA - Volá Barato
      
      Estimado/a ${reserva.datosContacto.nombre},
      
      Nos complace informarte que tu reserva ha sido CONFIRMADA.
      
      Número de Reserva: ${reserva.numeroReserva}
      Paquete: ${nombrePaquete}
      Destino: ${destino}
      Fecha de Viaje: ${fechaViaje}
      Cantidad de Personas: ${reserva.cantidadPersonas}
      Precio Total: ${formatearPrecio(reserva.precioTotal, moneda)}
      Método de Pago: ${reserva.metodoPago === 'efectivo' ? 'Efectivo' : reserva.metodoPago === 'tarjeta' ? 'Tarjeta' : 'Transferencia'}
      
      ${reserva.observaciones ? `Observaciones: ${reserva.observaciones}\n` : ''}
      Fecha de reserva: ${fechaReserva}
      
      Próximamente recibirás información adicional sobre el pago y los detalles de tu viaje.
      
      Si tienes alguna consulta, no dudes en contactarnos.
      
      ¡Esperamos que disfrutes tu viaje!
      
      Saludos cordiales,
      Equipo Volá Barato
    `;

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@volabarato.com',
      to: reserva.datosContacto.email,
      subject: `✅ Reserva Confirmada - ${reserva.numeroReserva} - Volá Barato`,
      text: textContent,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de confirmación enviado:', info.messageId);
    
    // Si está en modo de prueba, mostrar la URL de preview
    if (process.env.SMTP_USER === '' || !process.env.SMTP_USER) {
      console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error('❌ Error enviando email de confirmación:', error);
    // No lanzar error para que la confirmación de reserva no falle si el email falla
    throw error;
  }
};

// Función para enviar email de creación de reserva (pendiente)
export const enviarEmailReservaPendiente = async (reserva: any): Promise<void> => {
  try {
    const transporter = createTransporter();

    const nombrePaquete = reserva.paquete?.nombre || 'Paquete de viaje';
    const fechaViaje = new Date(reserva.fechaViaje).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f59e0b; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏳ Reserva Pendiente</h1>
          </div>
          <div class="content">
            <p>Estimado/a <strong>${reserva.datosContacto.nombre}</strong>,</p>
            <p>Hemos recibido tu reserva para <strong>${nombrePaquete}</strong> con fecha de viaje el ${fechaViaje}.</p>
            <p>Tu reserva está siendo procesada. Te notificaremos cuando sea confirmada.</p>
            <p>Número de Reserva: <strong>${reserva.numeroReserva}</strong></p>
            <p>Saludos cordiales,<br><strong>Equipo Volá Barato</strong></p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@volabarato.com',
      to: reserva.datosContacto.email,
      subject: `Reserva Pendiente - ${reserva.numeroReserva} - Volá Barato`,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email de reserva pendiente enviado');
  } catch (error) {
    console.error('❌ Error enviando email de reserva pendiente:', error);
  }
};

export default {
  enviarEmailConfirmacion,
  enviarEmailReservaPendiente
};

