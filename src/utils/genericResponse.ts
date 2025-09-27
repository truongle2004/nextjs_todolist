export class GenericResponse<T> {
  constructor(public status: number, public message: string, public data: T) {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}
