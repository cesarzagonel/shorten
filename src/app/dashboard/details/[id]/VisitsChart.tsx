"use client";

import React from "react";
import { AxisOptions, Chart } from "react-charts";

type DailyVisits = {
  date: string;
  visits: number;
};

export type Series = {
  label: string;
  data: DailyVisits[];
};

export default function VisitsChart({ data }: { data: Series[] }) {
  const primaryAxis = React.useMemo(
    (): AxisOptions<DailyVisits> => ({
      getValue: (datum) => datum.date,
    }),
    []
  );

  const secondaryAxes = React.useMemo(
    (): AxisOptions<DailyVisits>[] => [
      {
        getValue: (datum) => datum.visits,
        min: 0,
      },
    ],
    []
  );

  return (
    <Chart
      options={{
        data,
        primaryAxis,
        secondaryAxes,
      }}
    />
  );
}
