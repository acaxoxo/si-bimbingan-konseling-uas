import ActivityLog from "../models/ActivityLogModel.js";
import { getPaginationParams, paginateResponse } from "../utils/pagination.js";
import { Op } from "sequelize";

export const getAllActivityLogs = async (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const { user_role, action, module, start_date, end_date } = req.query;

    // Build where clause for filters
    const whereClause = {};
    
    if (user_role) {
      whereClause.user_role = user_role;
    }
    
    if (action) {
      whereClause.action = action;
    }
    
    if (module) {
      whereClause.module = module;
    }
    
    if (start_date && end_date) {
      whereClause.created_at = {
        [Op.between]: [new Date(start_date), new Date(end_date)]
      };
    } else if (start_date) {
      whereClause.created_at = {
        [Op.gte]: new Date(start_date)
      };
    } else if (end_date) {
      whereClause.created_at = {
        [Op.lte]: new Date(end_date)
      };
    }

    const { count, rows } = await ActivityLog.findAndCountAll({
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

export const getActivityLogById = async (req, res) => {
  try {
    const log = await ActivityLog.findByPk(req.params.id);
    
    if (!log) {
      return res.status(404).json({ message: "Log tidak ditemukan" });
    }
    
    res.json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getActivityStats = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    const whereClause = {};
    if (start_date && end_date) {
      whereClause.created_at = {
        [Op.between]: [new Date(start_date), new Date(end_date)]
      };
    }

    // Count by action
    const actionStats = await ActivityLog.findAll({
      where: whereClause,
      attributes: [
        'action',
        [db.fn('COUNT', db.col('id_log')), 'count']
      ],
      group: ['action']
    });

    // Count by module
    const moduleStats = await ActivityLog.findAll({
      where: whereClause,
      attributes: [
        'module',
        [db.fn('COUNT', db.col('id_log')), 'count']
      ],
      group: ['module']
    });

    // Count by user_role
    const roleStats = await ActivityLog.findAll({
      where: whereClause,
      attributes: [
        'user_role',
        [db.fn('COUNT', db.col('id_log')), 'count']
      ],
      group: ['user_role']
    });

    res.json({
      actionStats,
      moduleStats,
      roleStats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOldLogs = async (req, res) => {
  try {
    const { days } = req.query; // Delete logs older than X days
    const daysAgo = days || 90; // Default 90 days
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo);

    const deleted = await ActivityLog.destroy({
      where: {
        created_at: {
          [Op.lt]: cutoffDate
        }
      }
    });

    res.json({ 
      message: `${deleted} log lebih dari ${daysAgo} hari berhasil dihapus`,
      deletedCount: deleted
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
