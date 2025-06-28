
export type TideStatus = 'rising' | 'falling' | 'stable';

export interface TideData {
  type: string;
  height: number;
  time: string;
  status?: TideStatus;
}

export interface LocationOption {
  name: string;
  label: string;
}

export interface LocationGroup {
  [country: string]: LocationOption[];
}

export interface CurrentTideData {
  currentTide: TideData | null;
  nextTides: TideData[];
  location: string;
  moonPhase: string;
  sunTimes: {
    sunrise: string;
    sunset: string;
  };
}
