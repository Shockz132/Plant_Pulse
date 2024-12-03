"use client"

import { CartesianGrid } from "recharts";
import { Bar, BarChart, LabelList, XAxis } from "recharts"
import { LineChart, Line } from'recharts';
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface GenericSensorData {
  timestamp? : string,
  moisture_value?: number,
  temperature_value?: number,
  light_value?: number,
  plant_height?: number,
  bin_percentage_filled? : number,
  tank_percentage_filled? : number,
  fill?: string
}

const barChartConfig = {
  temperature_value: {
    label: "Temperature",
    color: "hsl(var(--chart-1))",
  },
  moisture_value: {
    label: "Moisture",
    color: "hsl(var(--chart-1))",
  },
  plant_height: {
    label: "Plant Height",
    color: "hsl(var(--chart-1))",
  }
} satisfies ChartConfig

function  formatTime(timestamp : string) {
  const date = new Date(timestamp);
  return date.toLocaleString('en-SG', { timeZone: 'Asia/Singapore' }).replace(/,/, '');
};

export const BarGraph = ({data, datakey} : {data : GenericSensorData[], datakey : string}) => {
  let locally_defined_data : GenericSensorData[];

  if (data.length > 20) {
    locally_defined_data = data.slice(-20);
  }
  else 
  {
    locally_defined_data = data;
  }

  return (
    <ChartContainer config={barChartConfig}>
      <BarChart
        accessibilityLayer
        data={locally_defined_data}
        margin={{
          top: 20,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="timestamp"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(tick) => new Date(tick).toLocaleTimeString()}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent labelFormatter={(label) => formatTime(label)}/>}
        />
        <Bar dataKey={datakey} fill={`var(--color-${datakey})`} radius={8}>
          <LabelList
            position="top"
            offset={12}
            className="fill-foreground"
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}

const progressCircleChartConfig = {
  percentage_full: {
    label: "full"
  },
  percentage_high: {
    color: "hsl(var(--chart-1))",
  },
  percentage_medium: {
    color: "hsl(var(--chart-2))"
  },
  percentage_low: {
    color: "hsl(var(--chart-3))"
  }
} satisfies ChartConfig

export const ProgressCircle = ({data, datakey} : {data : GenericSensorData[], datakey : string}) => {
  let data_value : number = 0;
  let locally_defined_data : GenericSensorData[] = [data[data.length - 1]];

  if (data[data.length - 1] != undefined) {
    if (data[data.length - 1].bin_percentage_filled != undefined) {
      data_value = data[data.length - 1].bin_percentage_filled ?? 0;
    }
    else if (data[data.length - 1].tank_percentage_filled != undefined) {
      data_value = data[data.length - 1].tank_percentage_filled ?? 0;
    }
    
    if (data_value >= 75 && data_value <= 100 ) {
      locally_defined_data[0].fill = progressCircleChartConfig.percentage_high.color;
    }
    else if (data_value >= 50 && data_value < 75) {
      locally_defined_data[0].fill = progressCircleChartConfig.percentage_medium.color;
    }
    else {
      locally_defined_data[0].fill = progressCircleChartConfig.percentage_low.color;
    }
  }

  const endAngle : number = 90 - (data_value / 100) * 360;

  return (
    <ChartContainer
      config={progressCircleChartConfig}
      className="mx-auto aspect-square max-h-[250px]"
    >
      <RadialBarChart
        data={locally_defined_data}
        startAngle={90}
        endAngle={endAngle}
        innerRadius={80}
        outerRadius={110}
        
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-background"
          polarRadius={[86, 74]}
        />
        <RadialBar dataKey={datakey} background cornerRadius={10} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-4xl font-bold"
                    >
                      {data_value + "%"}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      {progressCircleChartConfig.percentage_full.label}
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  )
}

const lineChartConfig = {
  temperature_value: {
    label: "Temperature",
    color: "hsl(var(--chart-1))",
  },
  moisture_value: {
    label: "Moisture",
    color: "hsl(var(--chart-1))",
  },
  weight_value: {
    label: "Weight",
    color: "hsl(var(--chart-1))",
  },
  light_value: {
    label: "Light",
    color: "hsl(var(--chart-2))",
  },
  weight: {
    label: "Weight",
    color: "hsl(var(--chart-3))",
  }
} satisfies ChartConfig

export const LineGraph = ({data, datakey} : {data : GenericSensorData[], datakey : string}) => {

  let locally_defined_data : GenericSensorData[] = data;

  if (data.length > 20) {
    locally_defined_data = data.slice(-20);
  }

  return (
    <ChartContainer config={lineChartConfig}>
      <LineChart
        accessibilityLayer
        data={locally_defined_data}
        margin={{
          top: 20,
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="timestamp"
          tickLine={true}
          axisLine={true}
          tickMargin={8}
          tickFormatter={(tick) => new Date(tick).toLocaleTimeString()}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" labelFormatter={(label) => formatTime(label)} />}
        />
        <Line
          dataKey={datakey}
          type="natural"
          stroke={`var(--color-${datakey})`}
          strokeWidth={3}
          dot={{
            fill: `var(--color-${datakey})`,
          }}
          activeDot={{
            r: 6,
          }}
        >
          <LabelList
            position="top"
            offset={16}
            className="fill-foreground"
            fontSize={12}
          />
        </Line>
      </LineChart>
    </ChartContainer>
  )
}
