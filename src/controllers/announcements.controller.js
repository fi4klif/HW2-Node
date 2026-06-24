import { prisma } from "../../prisma/client.js";
import createHttpError from "http-errors";

const PER_PAGE = 10;

export const getAnnouncements = async (req, res, next) => {
  const { search = "", sort = "newest", page = 1 } = req.query;
  const pageNum = Number(page);

  const where = {};
  if (search && search.trim()) {
    where.title = {
      contains: search,
    };
  }

  const orderBy =
    sort === "oldest" ? { createdAt: "asc" } : { createdAt: "desc" };
  const skip = (pageNum - 1) * PER_PAGE;

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

export const getAnnouncementById = async (req, res, next) => {
  const id = Number(req.params.id);

  const announcement = await prisma.announcement.findUniqueOrThrow({
    where: { id },
  });

  res.json(announcement);
};

export const createAnnouncement = async (req, res, next) => {
  try {
    const { title, description, price, category, contactInfo } = req.body;

    const announcement = await prisma.announcement.create({
      data: {
        title,
        description,
        price: Number(price),
        category,
        contactInfo,
        userId: req.user.id,
      },
    });

    res.status(201).json(announcement);
  } catch (error) {
    next(error);
  }
};

export const updateAnnouncement = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const announcement = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!announcement) {
      throw createHttpError(404, "Оголошення не знайдено");
    }

    if (announcement.userId !== req.user.id) {
      throw createHttpError(403, "Access denied");
    }

    const updateData = {};
    if (req.body.title !== undefined) updateData.title = req.body.title;
    if (req.body.description !== undefined)
      updateData.description = req.body.description;
    if (req.body.price !== undefined) updateData.price = Number(req.body.price);
    if (req.body.category !== undefined)
      updateData.category = req.body.category;
    if (req.body.contactInfo !== undefined)
      updateData.contactInfo = req.body.contactInfo;

    const updatedAnnouncement = await prisma.announcement.update({
      where: { id },
      data: updateData,
    });

    res.json(updatedAnnouncement);
  } catch (error) {
    next(error);
  }
};

export const deleteAnnouncement = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const announcement = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!announcement) {
      throw createHttpError(404, "Оголошення не знайдено");
    }

    if (announcement.userId !== req.user.id) {
      throw createHttpError(403, "Access denied");
    }

    await prisma.announcement.delete({
      where: { id },
    });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
