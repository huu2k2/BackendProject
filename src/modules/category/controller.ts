import { Request, Response, NextFunction } from 'express';
import { CategoryService } from './services';

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  async createCategory(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      console.log("body", req.body)
      const category = await this.categoryService.createCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  }

  async getCategories(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const categories = await this.categoryService.getCategories();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  }

  async getCategoryById(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const category = await this.categoryService.getCategoryById(req.params.categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.json(category);
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const category = await this.categoryService.updateCategory(
        req.params.categoryId,
        req.body
      );
      res.json(category);
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      await this.categoryService.deleteCategory(req.params.categoryId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}