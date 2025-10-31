import SavedFilter from "../models/SavedFilterModel.js";
import { Op } from "sequelize";

/**
 * Create new saved filter
 */
export const createSavedFilter = async (req, res) => {
  try {
    const { filter_name, filter_type, filter_data, is_default } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Validation
    if (!filter_name || !filter_type || !filter_data) {
      return res.status(400).json({
        message: "filter_name, filter_type, dan filter_data wajib diisi",
      });
    }

    // If this filter is set as default, unset other defaults for this user + filter_type
    if (is_default) {
      await SavedFilter.update(
        { is_default: false },
        {
          where: {
            user_id: userId,
            filter_type: filter_type,
          },
        }
      );
    }

    const savedFilter = await SavedFilter.create({
      user_id: userId,
      user_role: userRole,
      filter_name,
      filter_type,
      filter_data,
      is_default: is_default || false,
    });

    res.status(201).json({
      message: "Saved filter berhasil dibuat",
      data: savedFilter,
    });
  } catch (error) {
    console.error("Error creating saved filter:", error);
    res.status(500).json({
      message: "Gagal membuat saved filter",
      error: error.message,
    });
  }
};

/**
 * Get all saved filters for current user
 */
export const getUserSavedFilters = async (req, res) => {
  try {
    const userId = req.user.id;
    const { filter_type } = req.query;

    const whereClause = { user_id: userId };
    
    if (filter_type) {
      whereClause.filter_type = filter_type;
    }

    const filters = await SavedFilter.findAll({
      where: whereClause,
      order: [
        ["is_default", "DESC"],
        ["created_at", "DESC"],
      ],
    });

    res.json({
      count: filters.length,
      data: filters,
    });
  } catch (error) {
    console.error("Error getting saved filters:", error);
    res.status(500).json({
      message: "Gagal mengambil saved filters",
      error: error.message,
    });
  }
};

/**
 * Get single saved filter by ID
 */
export const getSavedFilterById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const filter = await SavedFilter.findOne({
      where: {
        id_filter: id,
        user_id: userId,
      },
    });

    if (!filter) {
      return res.status(404).json({ message: "Saved filter tidak ditemukan" });
    }

    res.json({ data: filter });
  } catch (error) {
    console.error("Error getting saved filter:", error);
    res.status(500).json({
      message: "Gagal mengambil saved filter",
      error: error.message,
    });
  }
};

/**
 * Update saved filter
 */
export const updateSavedFilter = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { filter_name, filter_data, is_default } = req.body;

    const filter = await SavedFilter.findOne({
      where: {
        id_filter: id,
        user_id: userId,
      },
    });

    if (!filter) {
      return res.status(404).json({ message: "Saved filter tidak ditemukan" });
    }

    // If setting as default, unset other defaults
    if (is_default) {
      await SavedFilter.update(
        { is_default: false },
        {
          where: {
            user_id: userId,
            filter_type: filter.filter_type,
            id_filter: { [Op.ne]: id },
          },
        }
      );
    }

    await filter.update({
      filter_name: filter_name || filter.filter_name,
      filter_data: filter_data || filter.filter_data,
      is_default: is_default !== undefined ? is_default : filter.is_default,
    });

    res.json({
      message: "Saved filter berhasil diperbarui",
      data: filter,
    });
  } catch (error) {
    console.error("Error updating saved filter:", error);
    res.status(500).json({
      message: "Gagal memperbarui saved filter",
      error: error.message,
    });
  }
};

/**
 * Delete saved filter
 */
export const deleteSavedFilter = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const filter = await SavedFilter.findOne({
      where: {
        id_filter: id,
        user_id: userId,
      },
    });

    if (!filter) {
      return res.status(404).json({ message: "Saved filter tidak ditemukan" });
    }

    await filter.destroy();

    res.json({ message: "Saved filter berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting saved filter:", error);
    res.status(500).json({
      message: "Gagal menghapus saved filter",
      error: error.message,
    });
  }
};

/**
 * Set filter as default
 */
export const setAsDefault = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const filter = await SavedFilter.findOne({
      where: {
        id_filter: id,
        user_id: userId,
      },
    });

    if (!filter) {
      return res.status(404).json({ message: "Saved filter tidak ditemukan" });
    }

    // Unset other defaults
    await SavedFilter.update(
      { is_default: false },
      {
        where: {
          user_id: userId,
          filter_type: filter.filter_type,
        },
      }
    );

    // Set this as default
    await filter.update({ is_default: true });

    res.json({
      message: "Filter berhasil diset sebagai default",
      data: filter,
    });
  } catch (error) {
    console.error("Error setting default filter:", error);
    res.status(500).json({
      message: "Gagal mengatur filter default",
      error: error.message,
    });
  }
};

export default {
  createSavedFilter,
  getUserSavedFilters,
  getSavedFilterById,
  updateSavedFilter,
  deleteSavedFilter,
  setAsDefault,
};
