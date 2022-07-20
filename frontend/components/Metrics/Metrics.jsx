//@ts-check
import NumberFormat from "react-number-format";
import { Card, CardActions, CardContent, Typography } from "@mui/material";
import React from 'react';

const METRICS_DEFAULT = [
  {
    name: '',
    value: 0,
    thousandSeparator: true,
    decimals: 2,
    prefix: '',
    suffix: ''
  }
];

const createCardsFromMetrics = (metrics)=>{
  let renderableCardComponents = [];
  metrics.forEach(metric=>{
    let card = 
      <Card key={metric.name} className={'card'}>
        <CardContent>
        <Typography variant="h2" component="h2">
            <NumberFormat value={metric.value} decimalScale={metric.decimals} thousandSeparator={metric.thousandSeparator} prefix={metric.prefix} suffix={metric.suffix} displayType='text' />
          </Typography>
          <Typography variant="h5" component="h2">
            {metric.name}
          </Typography>
        </CardContent>
      </Card>
    renderableCardComponents.push(card);
  })
  return renderableCardComponents;
}

function Metrics({metrics = METRICS_DEFAULT}){
  return (
    <div className="cardgroup">
      {createCardsFromMetrics(metrics)}
    </div>
  );
}

export default Metrics;