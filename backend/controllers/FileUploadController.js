import FileUpload from "../models/FileUploadModel.js";
import { getPaginationParams, paginateResponse } from "../utils/pagination.js";
import { Op } from "sequelize";
import fs from "fs";
import path from "path";
import ActivityLogger from "../middleware/activityLogger.js";

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File tidak ditemukan" });
    }

    const { module, module_id, description } = req.body;
    
    if (!module) {
      // Delete uploaded file if validation fails
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Module wajib diisi" });
    }

    const fileData = {
      file_name: req.file.originalname,
      file_path: req.file.path.replace(/\\/g, '/'),
      file_type: req.file.mimetype,
      file_size: req.file.size,
      module,
      module_id: module_id || null,
      uploaded_by: req.user?.id || null,
      uploaded_by_role: req.user?.role || null,
      description: description || null,
    };

    const file = await FileUpload.create(fileData);

    // Log activity
    await ActivityLogger.create(req, 'file_upload', req.file.originalname);

    res.status(201).json({
      message: "File berhasil diupload",
      file,
    });
  } catch (error) {
    // Delete file if database insert fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: error.message });
  }
};

export const uploadMultipleFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "File tidak ditemukan" });
    }

    const { module, module_id, description } = req.body;
    
    if (!module) {
      // Delete all uploaded files if validation fails
      req.files.forEach(file => fs.unlinkSync(file.path));
      return res.status(400).json({ message: "Module wajib diisi" });
    }

    const uploadedFiles = [];

    for (const file of req.files) {
      const fileData = {
        file_name: file.originalname,
        file_path: file.path.replace(/\\/g, '/'),
        file_type: file.mimetype,
        file_size: file.size,
        module,
        module_id: module_id || null,
        uploaded_by: req.user?.id || null,
        uploaded_by_role: req.user?.role || null,
        description: description || null,
      };

      const uploadedFile = await FileUpload.create(fileData);
      uploadedFiles.push(uploadedFile);
    }

    // Log activity
    await ActivityLogger.create(req, 'file_upload', `${req.files.length} files`);

    res.status(201).json({
      message: `${uploadedFiles.length} file berhasil diupload`,
      files: uploadedFiles,
    });
  } catch (error) {
    // Delete files if database insert fails
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getAllFiles = async (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const { module, module_id, file_type } = req.query;

    const whereClause = {};
    
    if (module) {
      whereClause.module = module;
    }
    
    if (module_id) {
      whereClause.module_id = module_id;
    }
    
    if (file_type) {
      whereClause.file_type = { [Op.like]: `%${file_type}%` };
    }

    const { count, rows } = await FileUpload.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });

    res.json(paginateResponse(rows, page, limit, count));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFileById = async (req, res) => {
  try {
    const file = await FileUpload.findByPk(req.params.id);
    
    if (!file) {
      return res.status(404).json({ message: "File tidak ditemukan" });
    }
    
    res.json(file);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const downloadFile = async (req, res) => {
  try {
    const file = await FileUpload.findByPk(req.params.id);
    
    if (!file) {
      return res.status(404).json({ message: "File tidak ditemukan" });
    }

    const filePath = path.resolve(file.file_path);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File fisik tidak ditemukan" });
    }

    // Log activity
    await ActivityLogger.read(req, 'file_upload', `Download: ${file.file_name}`);

    res.download(filePath, file.file_name);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const file = await FileUpload.findByPk(req.params.id);
    
    if (!file) {
      return res.status(404).json({ message: "File tidak ditemukan" });
    }

    // Delete physical file
    const filePath = path.resolve(file.file_path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Log activity
    await ActivityLogger.delete(req, 'file_upload', file.file_name);

    // Delete database record
    await file.destroy();

    res.json({ message: "File berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
