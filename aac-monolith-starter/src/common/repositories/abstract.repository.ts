import {
  FilterQuery,
  Model,
  Types,
  UpdateQuery,
  QueryOptions,
  ProjectionType,
} from 'mongoose';

export abstract class AbstractRepository<TDocument> {
  constructor(protected readonly model: Model<TDocument>) {}

  // ─── Create ────────────────────────────────────────────────────────────────
  async create(data: Partial<TDocument>): Promise<TDocument> {
    const doc = new this.model({
      ...data,
      _id: new Types.ObjectId(),
    });
    const saved = await doc.save();
    return saved.toObject() as TDocument;
  }

  // ─── Find One ──────────────────────────────────────────────────────────────
  async findOne(
    filterQuery: FilterQuery<TDocument>,
    projection?: ProjectionType<TDocument>,
    options?: QueryOptions<TDocument>,
  ): Promise<TDocument | null> {
    return this.model.findOne(filterQuery, projection, options).lean<TDocument>(true);
  }

  // ─── Find By Id ────────────────────────────────────────────────────────────
  async findById(
    id: string | Types.ObjectId,
    projection?: ProjectionType<TDocument>,
  ): Promise<TDocument | null> {
    return this.model.findById(id, projection).lean<TDocument>(true);
  }

  // ─── Find ──────────────────────────────────────────────────────────────────
  async find(
    filterQuery: FilterQuery<TDocument>,
    projection?: ProjectionType<TDocument>,
    options?: QueryOptions<TDocument>,
  ): Promise<TDocument[]> {
    return this.model.find(filterQuery, projection, options).lean<TDocument[]>(true);
  }

  // ─── Find With Pagination ──────────────────────────────────────────────────
  async findWithPagination(
    filterQuery: FilterQuery<TDocument>,
    page = 1,
    limit = 10,
    sort: Record<string, 1 | -1> = { createdAt: -1 },
    projection?: ProjectionType<TDocument>,
  ): Promise<{ data: TDocument[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.model
        .find(filterQuery, projection)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean<TDocument[]>(true),
      this.model.countDocuments(filterQuery),
    ]);
    return { data, total, page, limit };
  }

  // ─── Update One ────────────────────────────────────────────────────────────
  async updateOne(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
    options?: QueryOptions<TDocument>,
  ): Promise<TDocument | null> {
    return this.model
      .findOneAndUpdate(filterQuery, update, { new: true, ...options })
      .lean<TDocument>(true);
  }

  // ─── Update By Id ──────────────────────────────────────────────────────────
  async updateById(
    id: string | Types.ObjectId,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument | null> {
    return this.model
      .findByIdAndUpdate(id, update, { new: true })
      .lean<TDocument>(true);
  }

  // ─── Delete One (hard delete) ──────────────────────────────────────────────
  async deleteOne(filterQuery: FilterQuery<TDocument>): Promise<boolean> {
    const result = await this.model.deleteOne(filterQuery);
    return result.deletedCount > 0;
  }

  // ─── Soft Delete ───────────────────────────────────────────────────────────
  async softDelete(
    filterQuery: FilterQuery<TDocument>,
    deletedBy?: string,
  ): Promise<TDocument | null> {
    return this.model
      .findOneAndUpdate(
        filterQuery,
        { isDeleted: true, deletedBy, deletedAt: new Date() } as UpdateQuery<TDocument>,
        { new: true },
      )
      .lean<TDocument>(true);
  }

  // ─── Count ─────────────────────────────────────────────────────────────────
  async count(filterQuery: FilterQuery<TDocument>): Promise<number> {
    return this.model.countDocuments(filterQuery);
  }

  // ─── Exists ────────────────────────────────────────────────────────────────
  async exists(filterQuery: FilterQuery<TDocument>): Promise<boolean> {
    return !!(await this.model.exists(filterQuery));
  }
}
