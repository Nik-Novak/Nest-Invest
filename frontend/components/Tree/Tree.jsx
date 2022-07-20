//@ts-check
import React, { useEffect } from 'react';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import BlockIcon from '@mui/icons-material/Block';
import TreeItem from '@mui/lab/TreeItem';
import { useMemo } from 'react';
import { Button } from '@mui/material';

export const getRootIds = (tree) => {
  let rootIds = [];
  for( let node of Object.values(tree))
    if(node.parent_id===null)
    rootIds.push(node._id);
  return rootIds;
}

const buildTree = (paths) => {
  console.log(paths);
  let tree = {  };
  paths.forEach(path=>{
    for(let i=path.length-1; i>=0; i--){ //start at root and move backwards
      let market = path[i];
      console.log('processing', market);
      if(!tree[market._id])
        tree[market._id] = {...market};
      if(!tree[market._id].count)
        tree[market._id].count = 0;
      tree[market._id].count++;
      if(market.parent_id!==null){
        if(!tree[market.parent_id].children)
          tree[market.parent_id].children = [];
        if(!tree[market.parent_id].children.includes(market._id))
          tree[market.parent_id].children.push(market._id);
      }
    }
  });
  console.log(tree);
  return tree;
}


function Tree({ paths, tree, onTreeBuild=(tree)=>{}, selectedId, onSelectId=(nodeId)=>{}, renderLabel=(node)=>node.name  }){

  const renderTree = (nodeIds, tree)=>{
    return nodeIds.map(nodeId=>{
      let node = tree[nodeId];
      return (
        <TreeItem key={nodeId} nodeId={nodeId} label={renderLabel(node)} >
          { Array.isArray(node.children) && renderTree(node.children, tree) }
        </TreeItem>
      )
    })
  };

  useEffect(()=>{
    let tree = buildTree(paths);
    onTreeBuild(tree);
  }, [paths]);

  const rootIds = useMemo(()=>getRootIds(tree), [tree]);

  return (
    <>
      <TreeView
        aria-label="file system navigator"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        sx={{  flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
        onNodeSelect={(evt, id)=>onSelectId(id)}
        selected={selectedId}
      >
        { renderTree( rootIds, tree ) }
      <div style={{width:'100%', display:'flex', justifyContent:'center'}}>
        {selectedId && <Button sx={{marginTop:'15px', color:'red'}} onClick={()=>onSelectId(null)} variant='outlined'><BlockIcon sx={{fontSize: '15px', marginRight:'5px'}} />Clear</Button>} 
      </div>
      </TreeView>
    </>
  );
}

export default Tree;