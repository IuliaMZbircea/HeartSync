export interface DoctorI {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isActive?: boolean;
  roles: string[]
}

export class Doctor implements DoctorI {
  id!: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isActive?: boolean;
  roles: string[]

  constructor() {
    this.email = '';
    this.password = '';
    this.firstName = '';
    this.lastName = '';
    this.isActive = true;
    this.roles = [];
  }
}
