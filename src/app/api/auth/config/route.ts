import { jsonOk } from '@/lib/api-response';
import { withApiHandler } from '@/lib/api-handler';
import { getAuthSettings } from '@/lib/auth-settings';

export const GET = withApiHandler(async () => {
  const settings = await getAuthSettings();
  const hasGoogle = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
  const hasFacebook = Boolean(process.env.AUTH_FACEBOOK_ID && process.env.AUTH_FACEBOOK_SECRET);

  return jsonOk({
    smsVerificationEnabled: settings.smsVerificationEnabled,
    googleAuthEnabled: settings.googleAuthEnabled && hasGoogle,
    facebookAuthEnabled: settings.facebookAuthEnabled && hasFacebook,
    phoneAuthEnabled: true,
  });
}, 'GET /api/auth/config');
