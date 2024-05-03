import toast from "react-hot-toast";

export const SuccessNotification = (message: string) => {
  toast.success(message);
};

export const ErrorNotification = (errMessage: string) => {
  toast.error(errMessage);
};

export const PromiseNotification = (
  promiseReq: Promise<any>,
  completingMessage: string,
  funcOnSuccess?: () => void
) => {
  toast.promise(promiseReq, {
    loading: "loading...",
    error: (err: any) => {
      let message = err?.response?.data || "Something went wrong";
      return message;
    },
    success: () => {
      if (funcOnSuccess) {
        funcOnSuccess();
      }
      return completingMessage;
    },
  });
};
