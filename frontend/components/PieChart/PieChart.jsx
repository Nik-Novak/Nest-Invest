//@ts-check
import { Typography } from '@mui/material';
import React, { useMemo } from 'react';
import {Cell, Pie, PieChart as RePieChart, ResponsiveContainer, Tooltip} from 'recharts';
import Tree, { getRootIds } from '../Tree/Tree';
//@ts-ignore
import Style from './PieChart.module.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  let textLen = name.length;
  let textOffset = x > cx ? -textLen : textLen;
  let textX = x+ textOffset;
  return (
    <g>
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
      </text>
      <text x={textX} y={y+20} fill="white" textAnchor={x > cx || textLen > 10 ? 'start' : 'end'} dominantBaseline="central">
            {name}
      </text>
    </g>
    
  );
};

function PieChart( {selectedId, onSelectId, tree, renderLabel=renderCustomizedLabel} ){
  let selected = selectedId && tree && tree[selectedId];
  
  const mapSelectedToData = ()=>{
    if(!selectedId){
      return getRootIds(tree).map(id=>tree[id]);
    }
    let selected = tree && tree[selectedId];
    if(!selected){
      onSelectId(null);
      return []
    }
    let children = selected.children;
    if(!children)
      children = [selected._id];
    return children.map(id=>tree[id]);
  }
  const data = useMemo(mapSelectedToData, [selectedId, tree]);

  return(
    <div style={{width:'100%', height:350, display: 'flex', flexDirection: 'column', alignItems:'center', marginBottom: 20}}>
      <ResponsiveContainer >
        <RePieChart >
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={150}
            fill="#8884d8"
            dataKey="count"
            animationDuration={500}
          >
            {data.map((entry, index) => (
              <Cell className={Style.cell} key={`cell-${index}`} fill={COLORS[index % COLORS.length]} onClick={()=>onSelectId(entry._id)} />
            ))}
          </Pie>
          <Tooltip />
        </RePieChart>
      </ResponsiveContainer>
      <Typography variant='h5' component='h5' >{selected ? selected.name : 'Overview'}</Typography>
    </div>
    
  )
}

export default PieChart;