import {
    findServiceByName, findServices, insertService, updateService, deleteServiceByName, uploadServiceImage } from "../../models/dates/serviceModel.js";

export const GetServices = async (req, res) => {
    try {
        const services = await findServices();
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const GetServiceByName = async (req, res) => {
    const { nombre } = req.params;
    try {
        const service = await findServiceByName(nombre);
        if (!service) {
            return res.status(404).json({message: 'Servicio no encontrado'});
        }
        res.json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const AddService = async (req, res) => {
    const { nombre, descripcion, precio, duracion } = req.body;

    try {
        const existingService = await findServiceByName(nombre);

        if (existingService) {
            return res.status(400).json({ message: 'Ya existe un servicio con el mismo nombre' });
        }

        const newService = await insertService({ nombre, descripcion, precio, duracion });
        res.status(201).json({ message: 'Servicio agregado exitosamente', data: newService });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const editService = async (req, res) => {
    const { nombre } = req.params; // Obtén el nombre del servicio de los parámetros
    const serviceInfo = req.body; // Datos a actualizar

    try {
        if (!serviceInfo || Object.keys(serviceInfo).length === 0) {
            return res.status(400).json({ message: 'No se enviaron datos para actualizar' });
        }

        await updateService(nombre, serviceInfo);

        res.json({ message: 'Servicio actualizado exitosamente', data: serviceInfo });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteService = async (req, res) => {
    const { nombre } = req.params;

    try {
        const existingService = await findServiceByName(nombre);

        if (!existingService) {
            return res.status(404).json({ message: 'Servicio no encontrado' });
        }

        await deleteServiceByName(nombre);
        res.json({ message: 'Servicio eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controlador para subir imágenes de servicios
export const addServiceImage = async (req, res) => {
    const { id_servicio } = req.params;

    try {
        const serviceData = await uploadServiceImage(req.file, id_servicio);
        res.status(201).json({ message: "Imagen subida exitosamente", data: serviceData });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
