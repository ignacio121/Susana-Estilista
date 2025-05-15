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

// Obtener ventas por id
export const obtenerVentaPorId = async (id_venta) => {
    const { data, error } = await supabase
        .from('ventas')
        .select(`
            id_venta,
            id_usuario,
            fecha_venta,
            total,
            estado,
            pago,
            email_cliente,
            nombre_cliente,
            buy_order,
            detalle_ventas (
                id_producto,
                cantidad,
                precio_unitario,
                productos (
                  nombre
                )
            )
        `)
        .eq('id_venta', id_venta);
    if (error) throw error;

    // Reestructurar los datos para incluir "nombre_producto" directamente en "detalle_ventas"
    const transformedData = data.map((venta) => ({
      ...venta,
      detalle_ventas: venta.detalle_ventas.map((detalle) => ({
          id_producto: detalle.id_producto,
          nombre_producto: detalle.productos.nombre, // Agregar el nombre del producto
          precio_unitario: detalle.precio_unitario,
          cantidad: detalle.cantidad,
      })),
  }));

  return transformedData[0];
};

// Obtener ventas por orden de compra
export const obtenerVentaPorOrder = async (buy_order) => {
    const { data, error } = await supabase
        .from('ventas')
        .select(`
            id_venta,
            id_usuario,
            fecha_venta,
            total,
            estado,
            pago,
            email_cliente,
            nombre_cliente,
            buy_order,
            detalle_ventas (
                id_producto,
                cantidad,
                precio_unitario,
                productos (
                  nombre
                )
            )
        `)
        .eq('buy_order', buy_order)
    if (error) throw error;

    // Reestructurar los datos para incluir "nombre_producto" directamente en "detalle_ventas"
    const transformedData = data.map((venta) => ({
      ...venta,
      detalle_ventas: venta.detalle_ventas.map((detalle) => ({
          id_producto: detalle.id_producto,
          nombre_producto: detalle.productos.nombre, // Agregar el nombre del producto
          precio_unitario: detalle.precio_unitario,
          cantidad: detalle.cantidad,
      })),
  }));

  return transformedData[0];
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
            buy_order,
            pago,
            detalle_ventas (
                id_producto,
                cantidad,
                precio_unitario,
                productos (
                    nombre
                )
            )
        `)
        .eq('id_usuario', id_usuario)
        .order('fecha_venta', { ascending: false }); // Ordenar por fecha_venta en orden descendente
  
    if (error) throw error;

    // Reestructurar los datos para incluir "nombre_producto" directamente en "detalle_ventas"
    const transformedData = data.map((venta) => ({
        ...venta,
        detalle_ventas: venta.detalle_ventas.map((detalle) => ({
            id_producto: detalle.id_producto,
            nombre_producto: detalle.productos.nombre, // Agregar el nombre del producto
            precio_unitario: detalle.precio_unitario,
            cantidad: detalle.cantidad,
        })),
    }));

    return transformedData;
};

export const obtenerVentasPorProducto = async () => {
  const { data: productos, error } = await supabase
      .from('productos')
      .select(`
          id_producto,
          nombre,
          detalle_ventas (
              id_detalle,
              cantidad,
              precio_unitario,
              ventas (
                  id_venta,
                  fecha_venta,
                  estado,
                  buy_order,
                  pago
              )
          ),
          imagenes_productos!inner (
              imagen_url
          )
      `)

  if (error) throw error;

  // Procesar los datos para agregar totales y agrupaciones
  const ventasPorProducto = productos.map(producto => {
      const ordenes = producto.detalle_ventas.map(detalle => ({
          id_venta: detalle.ventas.id_venta,
          buy_order: detalle.ventas.buy_order,
          fecha_venta: detalle.ventas.fecha_venta,
          estado: detalle.ventas.estado,
          pago: detalle.ventas.pago,
          cantidad: detalle.cantidad
      }));

      const totalVentas = producto.detalle_ventas.length;
      const cantidadTotalVendida = producto.detalle_ventas.reduce((acc, detalle) => acc + detalle.cantidad, 0);
      const cantidadEntregada = producto.detalle_ventas.reduce((acc, detalle) =>
          detalle.ventas.estado === 'ENTREGADO' ? acc + detalle.cantidad : acc, 0);
      const cantidadPendiente = producto.detalle_ventas.reduce((acc, detalle) =>
          !['ENTREGADO', 'CANCELADO'].includes(detalle.ventas.estado) ? acc + detalle.cantidad : acc, 0);

      const ventasConcretadas = producto.detalle_ventas.filter(detalle => detalle.ventas.estado === 'ENTREGADO').length;
      const ventasPendientes = producto.detalle_ventas.filter(detalle => !['ENTREGADO', 'CANCELADO'].includes(detalle.ventas.estado)).length;

      return {
          id_producto: producto.id_producto,
          nombre_producto: producto.nombre,
          imagen_url: producto.imagenes_productos?.[0]?.imagen_url || null,
          total_ventas: totalVentas,
          ventas_concretadas: ventasConcretadas,
          ventas_pendientes: ventasPendientes,
          cantidad_total_vendida: cantidadTotalVendida,
          cantidad_entregada: cantidadEntregada,
          cantidad_pendiente: cantidadPendiente,
          ordenes_asociadas: ordenes
      };
  });

  // Ordenar: primero los productos con ventas, luego los que no tienen ventas
  ventasPorProducto.sort((a, b) => {
      if (a.total_ventas === 0 && b.total_ventas > 0) return 1;
      if (a.total_ventas > 0 && b.total_ventas === 0) return -1;
      return 0;
  });

  return ventasPorProducto;
};

export const entregarVenta = async (id_venta) => {
    const { data, error } = await supabase
        .from('ventas')
        .update({ 
            estado: 'ENTREGADO',
            pago: true
        })
        .eq('id_venta', id_venta);

    const { data: dataQR, error: errorQR } = await supabase
        .storage
        .from('qr-codes')
        .remove([`${id_venta}.png`]);

    if (errorQR) throw errorQR;

    if (error) throw error;
    return data;
}