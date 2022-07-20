//@ts-check
import { Alert, Typography } from "@mui/material";
import { connect } from "react-redux";

import NumberFormat from 'react-number-format';
import Metrics from "../../components/Metrics/Metrics";
import Filters from "../../components/Filters/Filters";
import { useEffect, useState } from "react";
import axios from 'axios';
import store from '../../redux/store'
import config from '../../config/default.json';
import moment from "moment";
import AppBar from "../../components/AppBar/AppBar";
//@ts-ignore
import Style from './Dashboard.module.css'
import Drawer from "../../components/Drawer/Drawer";
import React from "react";
import { get } from "../../lib/fetch";
import Tree from "../../components/Tree/Tree";
import twoDecimals from "../../util/twoDecimals";
import PieChart from "../../components/PieChart/PieChart";

const mapState = (state)=>{
  return { 
    firstName: state.login.investor.first_name,
    filter: state.filter,
  }
}

function getDateTitle(date){
  let today = moment(new Date());
  let yesterday = moment(new Date()).subtract(1,'day');
  let lastweek = moment(new Date()).subtract(7,'day');
  let targetDate = moment(date);
  if(targetDate.isSame(today, 'day'))
    return 'Today';
  if(targetDate.isSame(yesterday, 'day'))
    return 'Yesterday';
  if(targetDate.isBetween(lastweek, today, 'day',"[]"))
    return 'Last ' + targetDate.format('dddd');
  return targetDate.format('MMMM DD, YYYY');
}

function Dashboard( {firstName, filter} ){

  const [networkError, setNetworkError] = useState('');

  const [paths, setPaths] = useState([]);
  const [tree, setTree] = useState({});
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const totalCompanies = filter.companies.length;

  useEffect(()=>{
    console.log(filter.companies);
    let pathRequests = filter.companies.map(company=>get('/market/'+company.market_tag_id+'/path')); //filter.companies.map(market=>get('/market/'+market._id+'/root'));
    Promise.all(pathRequests)
      .then(pathResults=>{
        let paths = [];
        for(let result of pathResults){
          let path = result.data;
          paths.push(path);
        }//@ts-ignore
        setPaths(paths);
      })
      .catch(err=>setNetworkError(err.message));
  }, [filter.companies]);

  return (
    <>
      <AppBar title={'Overview'}/>
      {/* <Drawer open={drawerOpen} setOpen={setDrawerOpen} /> */}
      <div className={Style.content + ' content'}>
        { networkError && <Alert severity="error">{networkError}</Alert> }
        <Typography variant="h2">Welcome {firstName}!</Typography>
        <Typography variant="h3">{getDateTitle(filter.date)}&apos;s Metrics!</Typography>
        <Metrics 
          metrics={[
            {name: 'Total Capital Gains', value: 0, prefix:'$', suffix:'', thousandSeparator:true, decimals:2},
            {name: 'Total Dividends', value: 0, prefix:'$', suffix:'', thousandSeparator:true, decimals:2},
          ]} 
        />
        <Typography sx={{marginTop: 10}} variant="h3">Your Portfolio</Typography>
        <Metrics 
          metrics={[
            {name: 'Total Markets', value:filter.markets.length, prefix:'', suffix:'', thousandSeparator:true, decimals:2},
            {name: 'Total Companies', value: filter.companies.length, prefix:'', suffix:'', thousandSeparator:true, decimals:2},
          ]}
        />
        <PieChart selectedId={selectedNodeId} onSelectId={(nodeId)=>setSelectedNodeId(nodeId)} tree={tree} />
        <Tree 
          paths={paths} 
          tree={tree}
          onTreeBuild={(tree)=>setTree(tree)}
          selectedId={selectedNodeId}
          onSelectId={(nodeId)=>setSelectedNodeId(nodeId)}
          renderLabel = {(node)=> {
            let isRoot = node.parent_id===null;
            if(isRoot)
              return (node.name + `: ${node.count} (${Math.round(node.count/totalCompanies*100)}%)`);
            return (node.name + ` ${node.count}`);
          }}
        />
        <Filters />
      </div>
    </>
  );
}

export default connect(mapState)(Dashboard);