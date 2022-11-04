// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/radar
import { TableTooltip, Chip } from "@nivo/tooltip";
import { RadarSliceTooltipProps, ResponsiveRadar } from "@nivo/radar";
import { useMemo } from "react";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

interface Props {
  data: Record<string, unknown>[]; // [{ perspectve: 'Math', You: 120, Average:48 }, ...]
}
export const AssessmentRadar = ({ data }: Props) => {
  return (
    <ResponsiveRadar
      data={data}
      keys={["Point"]}
      indexBy="perspective"
      theme={{
        textColor: "white",
        fontSize: 12,
        tooltip: { container: { background: "black" } },
      }}
      margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
      dotSize={10}
      maxValue={10}
      dotColor={{ theme: "background" }}
      dotBorderWidth={2}
      colors={["#a5d8ff"]}
      motionConfig="wobbly"
      legends={[
        {
          anchor: "top",
          translateY: -50,
          translateX: -80,
          direction: "row",
          itemWidth: 80,
          itemHeight: 20,
          symbolShape: "circle",
        },
      ]}
      sliceTooltip={RadarSliceTooltip}
    />
  );
};

const RadarSliceTooltip = ({ index, data }: RadarSliceTooltipProps) => {
  const rows = data.map((datum) => [<Chip key={datum.id} color={datum.color} />, datum.id, datum.formattedValue]);
  console.log("RadarSliceTooltip", rows);
  return <TableTooltip title={<strong>{index}</strong>} rows={rows} />;
};
