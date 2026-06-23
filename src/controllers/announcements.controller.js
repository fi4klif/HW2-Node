import { prisma } from "../../prisma/client.js";

const PER_PAGE = 10;

/**
 * Get all announcements with search, sort, and pagination
 */
export const getAnnouncements = async (req, res, next) => {
  const { search = "", sort = "newest", page = 1 } = req.query;
  const pageNum = Number(page);

  // Build where clause for filtering
  const where = {};
  if (search && search.trim()) {
    where.title = {
      contains: search,
    };
  }

  // Build orderBy clause
  const orderBy =
    sort === "oldest" ? { createdAt: "asc" } : { createdAt: "desc" };

  // Calculate pagination
  const skip = (pageNum - 1) * PER_PAGE;

  // Execute both queries in parallel
  const [total, data] = await Promise.all([
    prisma.announcement.count({ where }),
    prisma.announcement.findMany({
      where,
      orderBy,
      skip,
      take: PER_PAGE,
    }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  res.json({
    data,
    pagination: {
      total,
      page: pageNum,
      totalPages,
      perPage: PER_PAGE,
    },
  });
};

/**
 * Get a single announcement by ID
 */
export const getAnnouncementById = async (req, res, next) => {
  const id = Number(req.params.id);

  const announcement = await prisma.announcement.findUniqueOrThrow({
    where: { id },
  });

  res.json(announcement);
};

/**
 * Create a new announcement
 */
export const createAnnouncement = async (req, res, next) => {
  const { title, description, price, category, contactInfo } = req.body;

  const announcement = await prisma.announcement.create({
    data: {
      title,
      description,
      price: Number(price),
      category,
      contactInfo,
    },
  });

  res.status(201).json(announcement);
};

/**
 * Partially update an announcement
 */
export const updateAnnouncement = async (req, res, next) => {
  const id = Number(req.params.id);
  const updateData = {};

  // Only include fields that are provided in the request body
  if (req.body.title !== undefined) updateData.title = req.body.title;
  if (req.body.description !== undefined)
    updateData.description = req.body.description;
  if (req.body.price !== undefined) updateData.price = Number(req.body.price);
  if (req.body.category !== undefined) updateData.category = req.body.category;
  if (req.body.contactInfo !== undefined)
    updateData.contactInfo = req.body.contactInfo;

  const announcement = await prisma.announcement.update({
    where: { id },
    data: updateData,
  });

  res.json(announcement);
};

/**
 * Delete an announcement
 */
export const deleteAnnouncement = async (req, res, next) => {
  const id = Number(req.params.id);

  await prisma.announcement.delete({
    where: { id },
  });

  res.status(204).end();
};
