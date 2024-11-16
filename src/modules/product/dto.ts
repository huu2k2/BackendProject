export interface CreateProductDto {
  name: string;
  description: string;
  image: string;
  price: number;
  categoryId?: string;
  isActive?: boolean;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  image?: string;
  price?: number;
  categoryId?: string;
  isActive?: boolean;
}

export interface ProductQuery {
  categoryId?: string;
  isActive?: string;
  search?: string;
}