import { deleteWorkSchedule, getWorkScheduleByUser, insertWorkSchedule } from "../../models/dates/scheduleModel.js";

export const AddWorkSchedule = async (req, res) => {
    const { id_usuario, dia_semana, hora_inicio, hora_fin, habilitado } = req.body;

    try {
        const newSchedule = await insertWorkSchedule({ id_usuario, dia_semana, hora_inicio, hora_fin, habilitado });
        res.status(201).json({ message: "Horario de trabajo agregado exitosamente", data: newSchedule });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const GetWorkSchedule = async (req, res) => {
    const { id_usuario } = req.params;

    try {
        const schedule = await getWorkScheduleByUser(id_usuario);
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const DeleteWorkSchedule = async (req, res) => {
    const { id_horario } = req.params;

    try {
        await deleteWorkSchedule(id_horario);
        res.json({ message: "Horario eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
