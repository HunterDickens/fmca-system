export type User = {
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
};

export type JwtPayload = User & {
  exp: number;
  iat: number;
};


export type NotificationType = "user" | "document" | "system" | "alert" | "all"
export interface Notification {
  id: string
  title: string
  description: string
  time: Date
  read: boolean
  type: NotificationType
  link: string
}
export interface FilingHistory {
  id: string
  usdotNumber: string
  carrierEmail: string
  carrierMileage: number
  carrierEin: string
  filingPath: string
  status: number
  created_at: string
}