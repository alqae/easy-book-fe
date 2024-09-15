export class Attachment {
  id: number;

  filename: string;

  group: string;

  originalName: string;

  path: string;

  size: number;

  constructor(
    id: number,
    filename: string,
    group: string,
    originalName: string,
    path: string,
    size: number,
  ) {
    this.id = id;
    this.filename = filename;
    this.group = group;
    this.originalName = originalName;
    this.path = path;
    this.size = size;
  }
}
