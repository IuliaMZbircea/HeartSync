export interface Alarm {
  parameter: string;
  condition: string;
  threshold: number;
  duration: number;
  afterActivity: boolean;
  message: string;
  isActive: boolean;
}
