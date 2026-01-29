import crypto from "crypto";

export function generateZegoToken04(
  appId: number,
  userId: string,
  serverSecret: string,
  effectiveTimeInSeconds: number,
  roomId?: string
) {
  const ctime = Math.floor(Date.now() / 1000);
  const nonce = Math.floor(Math.random() * 100000);

  const payload = {
    app_id: appId,
    user_id: userId,
    nonce,
    ctime,
    expire: ctime + effectiveTimeInSeconds,
    room_id: roomId ?? "",
  };

  const payloadStr = JSON.stringify(payload);

  const hash = crypto.createHmac("sha256", serverSecret).update(payloadStr).digest("hex");

  const tokenObj = {
    ...payload,
    signature: hash,
  };

  return Buffer.from(JSON.stringify(tokenObj)).toString("base64");
}
