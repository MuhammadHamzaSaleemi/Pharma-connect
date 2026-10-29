import { ADSENSE_CLIENT } from "../../lib/site";

// Authorises Google to sell ads on this domain. f08c47fec0942fa0 is Google's fixed
// certification authority id; the publisher id is the client id without "ca-".
export function GET() {
  if (!ADSENSE_CLIENT) return new Response("Not found", { status: 404 });
  return new Response(`google.com, ${ADSENSE_CLIENT.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
