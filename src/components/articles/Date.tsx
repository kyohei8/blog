import * as React from 'react';

interface DateProps {
  date: string;
}

/**
 * Date
 */
const Date = ({ date }: DateProps): JSX.Element => (
  <small className="text-sm text-slate-600">{date}</small>
);
export default Date;
