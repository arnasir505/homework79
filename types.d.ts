export interface Resource {
  name: string;
  description: string | null;
}

export interface ResourceComplex {
  categoryId: number;
  placeId: number;
  name: string;
  description: string | null;
  registrationDate: string;
}

export interface ApiResource extends Resource {
  id: number;
}

export interface ApiResourceComplex extends ResourceComplex {
  id: number;
}
