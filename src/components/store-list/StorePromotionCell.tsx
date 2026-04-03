import React from 'react';

import AppPill from '../ui/AppPill';
import { getPromotionAppearance } from '../ui/statusAppearance.js';

interface StorePromotionCellProps {
  promotionDecisionLabel: string;
}

export default function StorePromotionCell({
  promotionDecisionLabel,
}: StorePromotionCellProps) {
  const appearance = getPromotionAppearance(promotionDecisionLabel);

  return <AppPill tone={appearance.tone}>{appearance.label}</AppPill>;
}
