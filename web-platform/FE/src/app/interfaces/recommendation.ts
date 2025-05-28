export interface Recommendation {
  activityType: string;
  dailyDuration: number;
  startDate: Date;
  endDate?: Date;
  additionalNotes?: string;
}
