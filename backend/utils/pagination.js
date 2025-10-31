/**
 * Pagination Helper
 * Utility untuk standarisasi pagination response
 */

export const getPaginationParams = (req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  
  return { page, limit, offset };
};

export const getPaginationMeta = (page, limit, totalItems) => {
  const totalPages = Math.ceil(totalItems / limit);
  
  return {
    currentPage: page,
    totalPages,
    totalItems,
    itemsPerPage: limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};

export const paginateResponse = (data, page, limit, totalItems) => {
  return {
    data,
    pagination: getPaginationMeta(page, limit, totalItems)
  };
};
