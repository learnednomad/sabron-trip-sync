import * as React from 'react';

import { Buttons, Colors, Inputs, Typography } from '@/features/shared';
import { FocusAwareStatusBar, SafeAreaView, ScrollView } from '@/components/ui';

export default function Style() {
  return (
    <>
      <FocusAwareStatusBar />
      <ScrollView className="px-4">
        <SafeAreaView className="flex-1">
          <Typography />
          <Colors />
          <Buttons />
          <Inputs />
        </SafeAreaView>
      </ScrollView>
    </>
  );
}
