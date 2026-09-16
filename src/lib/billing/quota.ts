import 'server-only';

import { addDays } from './plans';
import { getEntitlements } from './store';

export async function assertCanCreateListing(userId: string) {
  const entitlements = await getEntitlements(userId);
  if (!entitlements.canPost) {
    const err = new Error(
      entitlements.plan.code === 'FREE'
        ? 'Ücretsiz hesapta aynı anda 1 ilan yayınlayabilirsiniz. Süresi bitince yenisini ekleyin veya kurumsal plana geçin.'
        : 'İlan kotanız doldu. Planınızı yükseltin.',
    );
    (err as Error & { status: number }).status = 402;
    throw err;
  }
  return entitlements;
}

export function listingExpiryFromPlan(listingDays: number): Date {
  return addDays(new Date(), listingDays);
}
