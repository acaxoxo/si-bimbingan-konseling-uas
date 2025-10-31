import OrangTua from "../models/OrangTuaModel.js";
import Siswa from "../models/SiswaModel.js";
import { getPaginationParams, paginateResponse } from "../utils/pagination.js";
import { Op } from "sequelize";

export const getAllOrangTua = async (req, res) => {
    try {
        const { page, limit, offset } = getPaginationParams(req);
        const { search } = req.query;

        // Build where clause for search
        const whereClause = {};
        if (search) {
            whereClause[Op.or] = [
                { nama_ayah: { [Op.like]: `%${search}%` } },
                { nama_ibu: { [Op.like]: `%${search}%` } },
                { nik_ayah: { [Op.like]: `%${search}%` } },
                { nik_ibu: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows } = await OrangTua.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            order: [['id_orang_tua', 'DESC']]
        });

        res.json(paginateResponse(rows, page, limit, count));
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const getOrangTuaById = async (req, res) => {
    try {
        const orangTua = await OrangTua.findByPk(req.params.id);
        if (!orangTua) return res.status(404).json({message: "Orang Tua tidak ditemukan"});
        res.json(orangTua);
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const createOrangTua = async (req, res) => {
    try {
        const { 
            nama_ayah, 
            nik_ayah, 
            email_ayah, 
            no_telepon_ayah,
            nama_ibu,
            nik_ibu,
            email_ibu,
            no_telepon_ibu 
        } = req.body;

        // Validasi minimal salah satu orang tua harus diisi
        if (!nama_ayah && !nama_ibu) {
            return res.status(400).json({ 
                message: "Minimal data ayah atau ibu harus diisi" 
            });
        }

        // Validasi NIK Ayah
        if (nik_ayah) {
            if (!/^\d{16}$/.test(nik_ayah)) {
                return res.status(400).json({ 
                    message: "NIK ayah harus 16 digit angka" 
                });
            }

            const existingNIK = await OrangTua.findOne({ where: { nik_ayah } });
            if (existingNIK) {
                return res.status(400).json({ 
                    message: "NIK ayah sudah terdaftar" 
                });
            }
        }

        // Validasi NIK Ibu
        if (nik_ibu) {
            if (!/^\d{16}$/.test(nik_ibu)) {
                return res.status(400).json({ 
                    message: "NIK ibu harus 16 digit angka" 
                });
            }

            const existingNIK = await OrangTua.findOne({ where: { nik_ibu } });
            if (existingNIK) {
                return res.status(400).json({ 
                    message: "NIK ibu sudah terdaftar" 
                });
            }
        }

        // Validasi Email Ayah
        if (email_ayah) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email_ayah)) {
                return res.status(400).json({ 
                    message: "Format email ayah tidak valid" 
                });
            }

            const existingEmail = await OrangTua.findOne({ where: { email_ayah } });
            if (existingEmail) {
                return res.status(400).json({ 
                    message: "Email ayah sudah terdaftar" 
                });
            }
        }

        // Validasi Email Ibu
        if (email_ibu) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email_ibu)) {
                return res.status(400).json({ 
                    message: "Format email ibu tidak valid" 
                });
            }

            const existingEmail = await OrangTua.findOne({ where: { email_ibu } });
            if (existingEmail) {
                return res.status(400).json({ 
                    message: "Email ibu sudah terdaftar" 
                });
            }
        }

        // Validasi No Telepon Ayah
        if (no_telepon_ayah) {
            const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
            if (!phoneRegex.test(no_telepon_ayah)) {
                return res.status(400).json({ 
                    message: "Format nomor telepon ayah tidak valid (contoh: 081234567890)" 
                });
            }
        }

        // Validasi No Telepon Ibu
        if (no_telepon_ibu) {
            const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
            if (!phoneRegex.test(no_telepon_ibu)) {
                return res.status(400).json({ 
                    message: "Format nomor telepon ibu tidak valid (contoh: 081234567890)" 
                });
            }
        }

        const orangTua = await OrangTua.create(req.body);
        res.status(201).json(orangTua);
    }
    catch (error) {
        res.status(400).json({message: error.message});
    }
}

export const updateOrangTua = async (req, res) => {
    try {
        const orangTua = await OrangTua.findByPk(req.params.id);
        if (!orangTua) return res.status(404).json({message: "Orang Tua tidak ditemukan"});

        const { 
            nik_ayah, 
            email_ayah, 
            no_telepon_ayah,
            nik_ibu,
            email_ibu,
            no_telepon_ibu 
        } = req.body;

        // Validasi NIK Ayah jika diubah
        if (nik_ayah && nik_ayah !== orangTua.nik_ayah) {
            if (!/^\d{16}$/.test(nik_ayah)) {
                return res.status(400).json({ 
                    message: "NIK ayah harus 16 digit angka" 
                });
            }

            const existingNIK = await OrangTua.findOne({ where: { nik_ayah } });
            if (existingNIK) {
                return res.status(400).json({ 
                    message: "NIK ayah sudah terdaftar" 
                });
            }
        }

        // Validasi NIK Ibu jika diubah
        if (nik_ibu && nik_ibu !== orangTua.nik_ibu) {
            if (!/^\d{16}$/.test(nik_ibu)) {
                return res.status(400).json({ 
                    message: "NIK ibu harus 16 digit angka" 
                });
            }

            const existingNIK = await OrangTua.findOne({ where: { nik_ibu } });
            if (existingNIK) {
                return res.status(400).json({ 
                    message: "NIK ibu sudah terdaftar" 
                });
            }
        }

        // Validasi Email Ayah jika diubah
        if (email_ayah && email_ayah !== orangTua.email_ayah) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email_ayah)) {
                return res.status(400).json({ 
                    message: "Format email ayah tidak valid" 
                });
            }

            const existingEmail = await OrangTua.findOne({ where: { email_ayah } });
            if (existingEmail) {
                return res.status(400).json({ 
                    message: "Email ayah sudah terdaftar" 
                });
            }
        }

        // Validasi Email Ibu jika diubah
        if (email_ibu && email_ibu !== orangTua.email_ibu) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email_ibu)) {
                return res.status(400).json({ 
                    message: "Format email ibu tidak valid" 
                });
            }

            const existingEmail = await OrangTua.findOne({ where: { email_ibu } });
            if (existingEmail) {
                return res.status(400).json({ 
                    message: "Email ibu sudah terdaftar" 
                });
            }
        }

        // Validasi No Telepon Ayah jika diubah
        if (no_telepon_ayah && no_telepon_ayah !== orangTua.no_telepon_ayah) {
            const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
            if (!phoneRegex.test(no_telepon_ayah)) {
                return res.status(400).json({ 
                    message: "Format nomor telepon ayah tidak valid (contoh: 081234567890)" 
                });
            }
        }

        // Validasi No Telepon Ibu jika diubah
        if (no_telepon_ibu && no_telepon_ibu !== orangTua.no_telepon_ibu) {
            const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
            if (!phoneRegex.test(no_telepon_ibu)) {
                return res.status(400).json({ 
                    message: "Format nomor telepon ibu tidak valid (contoh: 081234567890)" 
                });
            }
        }

        await orangTua.update(req.body);
        res.json({message: "Data Orang Tua berhasil diperbarui"});
    }
    catch (error) {
        res.status(400).json({message: error.message});
    }
}

export const deleteOrangTua = async (req, res) => {
    try {
        const orangTua = await OrangTua.findByPk(req.params.id);
        if (!orangTua) return res.status(404).json({message: "Orang Tua tidak ditemukan"});
        await orangTua.destroy();
        res.json({message: "Data Orang Tua berhasil dihapus"});
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }
}
