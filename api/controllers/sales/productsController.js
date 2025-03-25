import { getAllProducts, addProduct, createProductDetails, updateProduct, updateProductDetails, deleteProduct, uploadImage } from "../../models/sales/productsModel.js";

// Obtener todos los productos
export const fetchProducts = async (req, res) => {
    try {
        const products = await getAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear un nuevo producto
export const createProduct = async (req, res) => {
    const { nombre, marca, precio, contenido, stock, habilitado, detalles } = req.body;

    try {
        // Crear el producto
        const producto = await addProduct({ nombre, marca, precio, contenido, stock, habilitado });

        // Crear los detalles del producto si se proporcionan
        if (detalles) {
            const { beneficios, enfoque, uso, ingredientes } = detalles;
            await createProductDetails({
                id_producto: producto.id_producto, // ID del producto recién creado
                beneficios,
                enfoque,
                uso,
                ingredientes,
            });
        }

        res.status(201).json({ message: 'Producto y detalles creados exitosamente', producto });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un producto
export const editProduct = async (req, res) => {
    const { id_producto } = req.params;
    const { nombre, marca, precio, contenido, stock, habilitado, detalles } = req.body;

    try {
        // Actualizar el producto
        const productoActualizado = await updateProduct(id_producto, {
            nombre,
            marca,
            precio,
            contenido,
            stock,
            habilitado,
        });

        // Actualizar los detalles si se proporcionan
        if (detalles) {
            const { beneficios, enfoque, uso, ingredientes } = detalles;
            await updateProductDetails(id_producto, {
                beneficios,
                enfoque,
                uso,
                ingredientes,
            });
        }

        res.status(200).json({
            message: 'Producto y detalles actualizados exitosamente',
            producto: productoActualizado,
            detalles,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un producto
export const removeProduct = async (req, res) => {
    const { id_producto } = req.params;

    try {
        await deleteProduct(id_producto);
        res.json({ message: "Producto eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Subir imágenes
export const addImage = async (req, res) => {
    const { id_producto } = req.params;

    try {
        const imageData = await uploadImage(req.file, id_producto);
        res.status(201).json({ message: "Imagen subida exitosamente", imageData });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
