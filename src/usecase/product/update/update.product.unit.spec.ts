import { v4 as uuid } from "uuid";
import Product from "../../../domain/product/entity/product";
import {
  InputUpdateProductDto,
  OutputUpdateProductDto,
} from "./update.product.dto";
import UpdateProductUseCase from "./update.product.usecase";

const product = new Product(uuid(), "ball", 10);

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit test update product use case", () => {
  it("should update a product", async () => {
    const productRepository = MockRepository();
    const useCase = new UpdateProductUseCase(productRepository);
    const input: InputUpdateProductDto = {
      id: product.id,
      name: "ball updated",
      price: 20,
    };
    const output: OutputUpdateProductDto = {
      id: product.id,
      name: input.name,
      price: input.price,
    };
    const result = await useCase.execute(input);
    expect(result).toEqual(output);
  });

  it("should thrown an error when name is missing", async () => {
    const productRepository = MockRepository();
    const useCase = new UpdateProductUseCase(productRepository);
    const input: InputUpdateProductDto = {
      id: product.id,
      name: "",
      price: 20,
    };
    await expect(useCase.execute(input)).rejects.toThrowError(
      new Error("Product: Name is required")
    );
  });

  it("should thrown an error when price is less than zero", async () => {
    const productRepository = MockRepository();
    const useCase = new UpdateProductUseCase(productRepository);
    const input: InputUpdateProductDto = {
      id: product.id,
      name: "ball",
      price: -1,
    };
    await expect(useCase.execute(input)).rejects.toThrowError(
      new Error("Product: Price must be greater than zero")
    );
  });
});
