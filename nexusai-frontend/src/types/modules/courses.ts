export interface Course {
  _id: string;
  title: string;
  description?: string;
  price: number;
  level: string;
  status: string;
  instructor: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseDto {
  title: string;
  description?: string;
  price: number;
  level: string;
  status: string;
  instructor: string;
}

export interface UpdateCourseDto {
  title?: string;
  description?: string;
  price?: number;
  level?: string;
  status?: string;
}
