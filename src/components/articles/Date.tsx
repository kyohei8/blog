import * as React from 'react';

import { Text } from '@nextui-org/react';

interface DateProps {
  date: string;
}

/**
 * Date
 */
const Date = ({ date }: DateProps): JSX.Element => (
  <Text small color="$gray500" css={{ margin: 0 }}>
    {date}
  </Text>
);
export default Date;
