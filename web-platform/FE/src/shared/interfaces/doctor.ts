export interface DoctorI {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  is_active?: boolean;
  roles: string[]
}

export class Doctor implements DoctorI {
  id!: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  is_active?: boolean;
  roles: string[]

  constructor() {
    this.email = '';
    this.password = '';
    this.firstName = '';
    this.lastName = '';
    this.is_active = true;
    this.roles = [];
  }
}
