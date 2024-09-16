export class Service {
  id: number;

  name: string;

  description: string;

  duration: string;

  price: number;

  userId: number;

  categoryId: number;

  constructor(
    id: number,
    name: string,
    description: string,
    duration: string,
    price: number,
    userId: number,
    categoryId: number,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.duration = duration;
    this.price = price;
    this.userId = userId;
    this.categoryId = categoryId;
  }
}
