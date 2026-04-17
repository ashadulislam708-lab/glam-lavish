import { ShippingPartnerEnum, ShippingZoneEnum } from "~/enums";

export const SHIPPING_FEES: Record<ShippingZoneEnum, number> = {
  [ShippingZoneEnum.INSIDE_DHAKA]: 80,
  [ShippingZoneEnum.DHAKA_SUB_AREA]: 100,
  [ShippingZoneEnum.OUTSIDE_DHAKA]: 150,
};

export const getShippingFee = (zone: ShippingZoneEnum): number => {
  return SHIPPING_FEES[zone] ?? 150;
};

export const SHIPPING_ZONE_LABELS: Record<ShippingZoneEnum, string> = {
  [ShippingZoneEnum.INSIDE_DHAKA]: "Inside Dhaka",
  [ShippingZoneEnum.DHAKA_SUB_AREA]: "Dhaka Sub Area",
  [ShippingZoneEnum.OUTSIDE_DHAKA]: "Outside Dhaka",
};

export const SHIPPING_PARTNER_LABELS: Record<ShippingPartnerEnum, string> = {
  [ShippingPartnerEnum.STEADFAST]: "Steadfast",
  [ShippingPartnerEnum.PATHAO]: "Pathao",
  [ShippingPartnerEnum.CARRYBEE]: "CarryBee",
  [ShippingPartnerEnum.REDX]: "RedX",
};

export const SHIPPING_PARTNER_OPTIONS: Array<{
  value: ShippingPartnerEnum;
  label: string;
  enabled: boolean;
  badge?: string;
}> = [
  { value: ShippingPartnerEnum.STEADFAST, label: "Steadfast", enabled: true },
  { value: ShippingPartnerEnum.CARRYBEE, label: "CarryBee", enabled: true },
  { value: ShippingPartnerEnum.REDX, label: "RedX", enabled: true },
  { value: ShippingPartnerEnum.PATHAO, label: "Pathao", enabled: false, badge: "Coming Soon" },
];
