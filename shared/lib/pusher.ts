import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const pusherServer = new PusherServer({
  appId: process.env.NEXT_PUBLIC_App_Id!,
  key: process.env.NEXT_PUBLIC_Key!,
  secret: process.env.NEXT_PUBLIC_Secret!,
  cluster: process.env.NEXT_PUBLIC_Cluster!,
  useTLS: true,
});

export const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_Key!, {
  cluster: process.env.NEXT_PUBLIC_Cluster!,
});
