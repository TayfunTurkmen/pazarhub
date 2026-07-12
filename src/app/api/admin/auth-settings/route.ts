import { z } from 'zod';
import { jsonOk } from '@/lib/api-response';
import { withApiHandler, parseValidatedBody } from '@/lib/api-handler';
import { requireAdmin } from '@/lib/api-auth';
import { getAuthSettings, saveAuthSettings } from '@/lib/auth-settings';

const authSettingsSchema = z.object({
  smsVerificationEnabled: z.boolean().optional(),
  googleAuthEnabled: z.boolean().optional(),
  facebookAuthEnabled: z.boolean().optional(),
});

export const GET = withApiHandler(async () => {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const settings = await getAuthSettings();
  return jsonOk(settings);
}, 'GET /api/admin/auth-settings');

export const PUT = withApiHandler(async (request) => {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const parsed = await parseValidatedBody(request, authSettingsSchema);
  if ('error' in parsed) return parsed.error;

  const settings = await saveAuthSettings(parsed.data);
  return jsonOk(settings);
}, 'PUT /api/admin/auth-settings');
