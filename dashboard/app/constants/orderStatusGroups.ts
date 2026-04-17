import { OrderStatusEnum } from "~/enums";

export const ORDER_STATUS_GROUPS = {
  active: {
    label: "Active",
    statuses: [
      OrderStatusEnum.PENDING_PAYMENT,
      OrderStatusEnum.PROCESSING,
      OrderStatusEnum.ON_HOLD,
    ],
  },
  completed: {
    label: "Completed",
    statuses: [OrderStatusEnum.COMPLETED],
  },
  cancel: {
    label: "Cancel",
    statuses: [OrderStatusEnum.CANCELLED],
  },
  failed: {
    label: "Failed",
    statuses: [
      OrderStatusEnum.REFUNDED,
      OrderStatusEnum.FAILED,
      OrderStatusEnum.DRAFT,
    ],
  },
  trash: {
    label: "Trash",
    statuses: [],
  },
} as const;

export type OrderStatusGroup = keyof typeof ORDER_STATUS_GROUPS;
