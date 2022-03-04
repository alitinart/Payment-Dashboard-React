import { NOTIFICATION_TYPE, Store } from "react-notifications-component";

export default function NotificationProvider(
  title: string,
  message: string,
  type: NOTIFICATION_TYPE
) {
  Store.addNotification({
    title: title,
    message: message,
    type: type,
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 5000,
      onScreen: true,
    },
  });
}
