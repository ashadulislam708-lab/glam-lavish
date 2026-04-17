import { ShippingZoneEnum } from '../enums/shipping-zone.enum.js';

export interface BangladeshDistrict {
    name: string;
    upazilas: string[];
}

/**
 * District-to-shipping-zone mapping.
 * Districts not listed here default to OUTSIDE_DHAKA.
 */
export const DISTRICT_ZONE_MAP: Record<string, ShippingZoneEnum> = {
    Dhaka: ShippingZoneEnum.INSIDE_DHAKA,
    Gazipur: ShippingZoneEnum.DHAKA_SUB_AREA,
    Narayanganj: ShippingZoneEnum.DHAKA_SUB_AREA,
    Manikganj: ShippingZoneEnum.DHAKA_SUB_AREA,
    Munshiganj: ShippingZoneEnum.DHAKA_SUB_AREA,
    Narsingdi: ShippingZoneEnum.DHAKA_SUB_AREA,
};

/** Get the shipping zone for a given district name. */
export function getZoneForDistrict(district: string): ShippingZoneEnum {
    return DISTRICT_ZONE_MAP[district] ?? ShippingZoneEnum.OUTSIDE_DHAKA;
}
