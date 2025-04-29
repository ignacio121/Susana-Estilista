import { supabase } from '../../config/supabaseClient.js';

// Registrar venta
export const registrarVenta = async (
    id_usuario,
    buy_order,
    total,
    estado = 'EN PROCESO',
    nombre_cliente,
    email_cliente,
    pago
  ) => {
    // Verificar si ya existe una venta con el mismo buy_order
    const { data: existingSale, error: checkError } = await supabase
      .from('ventas')
      .select('id_venta')
      .eq('buy_order', buy_order)
      .single();
  
    if (checkError && checkError.code !== 'PGRST116') { // Ignorar el error si no hay coincidencia
      throw checkError;
    }
  
    if (existingSale) {
      // Si la venta ya existe, no crear una nueva
      throw new Error(`La venta con el buy_order "${buy_order}" ya existe.`);
    }
  
    // Insertar nueva venta si no existe
    const { data, error } = await supabase
      .from('ventas')
      .insert([{
        id_usuario,
        fecha_venta: new Date(),
        buy_order,
        total,
        estado,
        nombre_cliente,
        email_cliente,
        pago,
      }])
      .select('id_venta')
      .single();
  
    if (error) throw error;
  
    return data.id_venta;
  };

// Registrar detalle de venta
export const registrarDetalleVenta = async (id_venta, detalles) => {
    const { data, error } = await supabase.from('detalle_ventas').insert(
        detalles.map((detalle) => ({
            id_venta,
            id_producto: detalle.id_producto,
            cantidad: detalle.cantidad,
            precio_unitario: detalle.precio_unitario,
        }))
    );
    if (error) throw error;
    return data;
};

// Obtener todas las ventas
export const obtenerVentas = async () => {
    const { data, error } = await supabase
        .from('ventas')
        .select(`
            id_venta,
            id_usuario,
            fecha_venta,
            total,
            estado,
            detalle_ventas (
                id_producto,
                cantidad,
                precio_unitario
            )
        `);
    if (error) throw error;
    return data;
};

// Obtener ventas por usuario
export const obtenerVentasPorUsuario = async (id_usuario) => {
    const { data, error } = await supabase
        .from('ventas')
        .select(`
            id_venta,
            fecha_venta,
            total,
            estado,
            detalle_ventas (
                id_producto,
                cantidad,
                precio_unitario
            )
        `)
        .eq('id_usuario', id_usuario);
    if (error) throw error;
    return data;
};
