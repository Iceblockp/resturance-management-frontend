export enum DateRangePreset {
  TODAY = "today",
  YESTERDAY = "yesterday",
  WEEK = "week",
  MONTH = "month",
  ALL = "all",
}

export interface DateRange {
  preset?: DateRangePreset;
  startDate?: string;
  endDate?: string;
}
