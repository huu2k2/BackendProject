export enum KeyNotification {
  CancelledDish = "cancelledDish",
  ConfirmedDish = "confirmedDish",
  SuccessDish ="successDish"
}
export enum NotificationType  {
  CustomerCancelled = "Hủy món vì lý do: ",
  CustomerConfirm = "Đầu bếp đã xác nhận nấu món:",
  CustomerSuccess = "Món ăn đã hoàn thành:"
}

export const arrayActionSend = [
  { key: KeyNotification.CancelledDish, value: NotificationType.CustomerCancelled },
  { key: KeyNotification.ConfirmedDish, value: NotificationType.CustomerConfirm },
  { key: KeyNotification.SuccessDish, value: NotificationType.CustomerSuccess },
];

const actionSend = new Map<string, string>();

arrayActionSend.forEach((item) => {
  actionSend.set(item.key, item.value);
});

export {actionSend}