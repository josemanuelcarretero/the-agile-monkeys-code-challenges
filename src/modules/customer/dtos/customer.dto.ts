export class CustomerDto {
  public id: string;
  readonly name: string;
  readonly surname: string;
  readonly external_id: string;
  readonly image: string;
  readonly created_at?: Date;
  readonly updated_at?: Date;

  constructor(
    id: string,
    name: string,
    surname: string,
    external_id: string,
    image: string,
    created_at: Date,
    updated_at: Date,
  ) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.external_id = external_id;
    this.image = image;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  static create(params: {
    id: string;
    name: string;
    surname: string;
    external_id: string;
    image: string;
    created_at: Date;
    updated_at: Date;
  }): CustomerDto {
    return new CustomerDto(
      params.id,
      params.name,
      params.surname,
      params.external_id,
      params.image,
      params.created_at,
      params.updated_at,
    );
  }
}
