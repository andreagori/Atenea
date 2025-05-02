import { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { motion } from 'framer-motion';
import { GlobalStyles } from '@mui/material';

const margin = { right: 24 };
const xLabels = ['Page A', 'Page B', 'Page C', 'Page D', 'Page E', 'Page F', 'Page G'];

export default function SimpleLineChart() {
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDataLoaded(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const uData = dataLoaded ? [4000, 3000, 2000, 2780, 1890, 2390, 3490] : Array(xLabels.length).fill(0);
  const pData = dataLoaded ? [2400, 1398, 9800, 3908, 4800, 3800, 4300] : Array(xLabels.length).fill(0);

  return (
    <>
      {/* 🎨 ESTO NO FUNCIONA */}
      <GlobalStyles
        styles={{
          '.MuiChartsAxis-line': {
            stroke: '#ffffff',
          },
          '.MuiChartsAxis-tickLabel': {
            fill: '#ffffff',
          },
          '.MuiChartsAxis-label': {
            fill: '#ffffff',
          },
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="w-full h-full"
      >
        <LineChart
          height={300}
          series={[
            { data: pData, label: 'pv', color: '#00C49F' },
            { data: uData, label: 'uv', color: '#FF8042' },
          ]}
          xAxis={[
            {
              scaleType: 'point',
              data: xLabels,
              label: 'Páginas',
            },
          ]}
          yAxis={[
            {
              label: 'Valor',
              width: 60,
            },
          ]}
          margin={margin}
          skipAnimation={false}
        />
      </motion.div>
    </>
  );
}
