
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import { useAirdropReferManager } from '../../hooks/useReferManager';
import { useRouter } from 'next/router';
import { Loading, Loading2, LoadingProject, LoadingUser, LoadingXUser } from '../../components/Loader';
import { useActiveWeb3React } from '../../hooks';

import { Group } from '@visx/group';
import { Cluster, hierarchy } from '@visx/hierarchy';
import { HierarchyPointNode, HierarchyPointLink } from '@visx/hierarchy/lib/types';
import { LinkVertical } from '@visx/shape';
import { LinearGradient } from '@visx/gradient';
import { Zoom } from '@visx/zoom';
// @ts-ignore
import { interpolateRainbow } from 'd3-scale-chromatic';
import { localPoint } from '@visx/event';
import { RectClipPath } from '@visx/clip-path';
import genPhyllotaxis, {
  GenPhyllotaxisFunction,
  PhyllotaxisPoint,
} from '@visx/mock-data/lib/generators/genPhyllotaxis';
import { scaleLinear } from '@visx/scale';
import React from 'react';

const citrus = '#ddf163';
const white = '#ffffff';
export const green = '#79d259';
const aqua = '#37ac8c';
const merlinsbeard = '#f7f7f3';
export const background = '#306c90';

interface NodeShape {
  name: string;
  index: string;
  children?: NodeShape[];
}

function RootNode({ node, onAddNode }: { node: HierarchyPointNode<NodeShape>, onAddNode?: (data: HierarchyPointNode<NodeShape>) => void }) {
  const width = 70;
  const height = 40;
  const centerX = -width / 2;
  const centerY = -height / 2;
  const [mouseOver, setMouseOver] = useState(false)

  return (
    <Group top={node.y} left={node.x}
      onMouseOverCapture={(e) => {
        e.stopPropagation()
        setMouseOver(true)
      }}
    >
      <rect width={width} height={height} y={centerY} x={centerX} fill="url('#top')" />
      <text
        dy=".33em"
        fontSize={24}
        fontFamily="Arial"
        textAnchor="middle"
        style={{ pointerEvents: 'none' }}
        fill={background}
      >
        {/* @ts-ignore */}
        {node.data.name ? node.data.name + '-' + parseFloat(node.data.income) : 'Add root'}
      </text>
      {
        mouseOver && 
        <Group
          onMouseOutCapture={(e) => {
            e.stopPropagation()
            setMouseOver(false)
          }}
        >
          <rect width={50} height={30} x={-14} y={-14}
            fill={'rgba(0,0,0,0)'}
            onClickCapture={(e) => {
              e.stopPropagation()
              onAddNode && onAddNode(node)
            }}
            
          >
          </rect>
          <text
              x={50} y={-0}
              dy=".33em"
              fontSize={32}
              fontFamily="Arial"
              textAnchor="middle"
              style={{ pointerEvents: 'none', position: 'absolute', left: '100%' }}
              fill={'#ffffff'}
              color='#ffffff'
            >
              +
            </text>
        </Group>
      }
    </Group>
  );
}
function Node({ node, onClick, onContextMenu, onAddNode }: { 
  node: HierarchyPointNode<NodeShape>,
  onClick?: (data: HierarchyPointNode<NodeShape>) => void,
  onContextMenu?: (data: HierarchyPointNode<NodeShape>) => void,
  onAddNode?: (data: HierarchyPointNode<NodeShape>) => void
}) {
  const isRoot = node.depth === 0;
  const isParent = !!node.children;
  const [mouseOver, setMouseOver] = useState(false)

  if (isRoot) return <RootNode node={node} onAddNode={onAddNode} />;
  return (
    <Group top={node.y} left={node.x}
      style={{position: 'relative'}}
      onClickCapture={() => {
        onClick && onClick(node)
      }}
      onContextMenuCapture={(e) => {
        e.stopPropagation()
        e.preventDefault()
        onContextMenu && onContextMenu(node)
      }}
      onMouseOverCapture={(e) => {
        e.stopPropagation()
        setMouseOver(true)
      }}

    >
      
      {node.depth !== 0 && (
        <circle
          r={isParent ? 40 : 32}
          fill={background}
          stroke={isParent ? white : citrus}
        />
      )}
      <text
        dy=".33em"
        fontSize={18}
        fontFamily="Arial"
        textAnchor="middle"
        style={{ pointerEvents: 'none' }}
        fill={isParent ? white : citrus}
      >
        {/* @ts-ignore */}
        {node.data.name + '-' + parseFloat(node.data.income) }
      </text>
      {
        mouseOver && 
        <Group
          onMouseOutCapture={(e) => {
            e.stopPropagation()
            setMouseOver(false)
          }}
        >
          <rect width={100} height={70} x={-24} y={-34}
            fill={'rgba(0,0,0,0)'}
            onClickCapture={(e) => {
              e.stopPropagation()
              onAddNode && onAddNode(node)
            }}
            
          >
          </rect>
          <text
              x={isParent ? 54 : 44} y={-0}
              dy=".33em"
              fontSize={32}
              fontFamily="Arial"
              textAnchor="middle"
              style={{ pointerEvents: 'none', position: 'absolute', left: '100%' }}
              fill={'#ffffff'}
              color='#ffffff'
              onClickCapture={() => {
                console.log(node.data)
              }}
              onClick={() => {
                console.log(node.data)
              }}
            >
              +
            </text>
        </Group>
      }
      
      
      
    </Group>
  );
}

const defaultMargin = { top: 40, left: 0, right: 0, bottom: 40 };

export type DendrogramProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

const bg = '#0a0a0a';
const points = [...new Array(1000)];

const colorScale = scaleLinear<number>({ range: [0, 1], domain: [0, 1000] });
const sizeScale = scaleLinear<number>({ domain: [0, 600], range: [0.5, 8] });

const initialTransform = {
  scaleX: 0.8,
  scaleY: 0.8,
  translateX: 0,
  translateY: 10,
  skewX: 0,
  skewY: 0,
};

export type ZoomIProps = {
  width: number;
  height: number;
};

const ReferTree = () => {
  const { account } = useActiveWeb3React()
  const router = useRouter()
  const refContainer = useRef(null);
  const addNode = useRef<HTMLDivElement>(null)
  const lfRef = useRef<any>(null)

  const [nodeList, setNodeList] = useState<any[]>([])
  const [nodeList2, setNodeList2] = useState<any[]>([])
  const [selectNode, setSelectNode] = useState<any>({})
  const [adding, setAdding] = useState(false)

  const { handleGetReferNodeList, handleReferTo } = useAirdropReferManager()

  const handleInitReferNodeList = useCallback(async (fresh?: boolean) => {
    const dataList = await handleGetReferNodeList()
    console.log(dataList)
    // @ts-ignore
    if (window.nodeList && window.nodeList.length > 0 && window.nodeList.length === dataList.length && fresh) {
      handleGetReferNodeList()
      return
    }
    // @ts-ignore
    window.nodeList = dataList
    setNodeList(dataList)
    setNodeList2(dataList)
    
  }, [handleGetReferNodeList, setNodeList])

  const handleAddNode = useCallback(async () => {
    if (addNode.current) {
      setAdding(true)
      addNode.current.style.left = '-10000px'

      const airdropId = router.query.airdropId as string
      const pAddress = nodeList2.length > 0 ? nodeList2[selectNode.id - 1].addr : account
      const res = await handleReferTo(airdropId, pAddress)
      setAdding(false)
      if (res.status !== 0) {
        alert(res.message || 'Error')
        return
      } 
      if (nodeList2.length <= 0) {
        window.location.reload()
        return
      }
      let newNodeList = nodeList2.map(item => ({...item}))
      const newNode = {
        "id": nodeList2.length + 1,
        "pid": selectNode.id,
        "index": "1",
        "addr": res.addr
      }

      let pid = newNode.pid
      while(pid > 0) {
        const pNodeIndex = pid - 1
        let tempNode = { ...newNodeList[pNodeIndex] }
        console.log(tempNode)

        tempNode.index = String(Number(tempNode.index) + 1)
        newNodeList[pNodeIndex] = tempNode
        let _index = tempNode.index
        let _amount = 0;
        while(_index > 0) {
          _amount += Math.pow(0.5, _index)
          _index--;
        }
        lfRef.current.getNodeModelById(tempNode.id).updateText(tempNode.id+ '-' + tempNode.index + '-' + _amount.toFixed(4))
        pid = newNodeList[pid - 1].pid
      }

      lfRef.current.addNode({
        id: newNode.id,
        type: 'rect',
        text: newNode.id + '-' + newNode.index + '-' + '0.5000',
        level: 1,
        x: selectNode.x + 260,
        y: selectNode.y
      })
      lfRef.current.addEdge({
        type: 'bezier',
        sourceNodeId: selectNode.id,
        targetNodeId: newNode.id,
      })
      setNodeList2([...newNodeList, newNode])
    }
  }, [selectNode, nodeList2, setNodeList2, handleReferTo, setAdding, router.query, account])

  useEffect(() => {
    handleInitReferNodeList()
  }, [handleInitReferNodeList])

  const initTimer = useRef<any>(null)
  useEffect(() => {
    const dataList = nodeList
    if (refContainer.current && dataList) {
      const timer = setInterval(() => {
        // @ts-ignore
        const Core = window.Core
        if (Core) {
          clearInterval(timer)
        } else {
          return
        }
        const xData: any = {

        }
        const nodes = dataList.map((data: any) => {
          let pid = data.pid
          let level = 0

          while(pid > 0) {
            level++
            pid = dataList[pid - 1].pid
          }
          if (!xData[level]) {
            xData[level] = 0
          }
          let x = (xData[level] + 1) * 200
          let y = (level + 1) * 100
          xData[level] += 1

          let _index = data.index;
          let _amount = 0;
          while(_index > 0) {
            _amount += Math.pow(0.5, _index)
            _index--;
          }

          return {
            id: data.id,
            type: 'rect',
            text: data.id + '-' + data.index + '-' + _amount.toFixed(4),
            level,
            x,
            y
          }
        })

        let edges = []
        for (let i = 0; i < dataList.length; i++) {
          const data = dataList[i]
          
          if (data.pid > 0) {
            const parent = dataList[data.pid - 1]
            edges.push({
              type: 'bezier',
              sourceNodeId: parent.id,
              targetNodeId: data.id,
            })
          }
        }
        // 准备图数据
        const data = {
          // 节点
          nodes: nodes,
          // 边
          edges: edges,
        }

        const lf = new Core.default({
          container: refContainer.current,
          grid: true,
          height: 800,
          // hideAnchors: true
          adjustEdgeStartAndEnd: true
        });
        lf.render(data);
        // lf.translateCenter();

        lf.on('node:contextmenu', ({data, e, position}: any) => {
          console.log(data, e, position)
          if (addNode.current) {
            addNode.current.style.left = e.clientX + 'px'
            addNode.current.style.top = e.clientY + 'px'
          }
          setSelectNode(data)
        })
        lf.on('blank:click', () => {
          if (addNode.current) {
            addNode.current.style.left = '-10000px'
          }
        })
        lfRef.current = lf
        
        
      }, 100)
    }
    if (!initTimer.current) {
      initTimer.current = setTimeout(() => {
        // @ts-ignore
        if (window.nodeList.length <= 0) {
          if (addNode.current) {
            addNode.current.style.left = (document.body.clientWidth / 2)+ 'px'
            addNode.current.style.top = (document.body.clientHeight / 2) + 'px'
          }
        } else {
          if (addNode.current) {
            addNode.current.style.left = '-10000px'
          }
        }
      }, 3000)
    }
  }, [nodeList, setSelectNode])
  const accountTime = useRef<any>(null)
  useEffect(() => {
    // @ts-ignore
    window.loginAccount = account
    if (!accountTime.current) {
      accountTime.current = setTimeout(() => {
        // @ts-ignore
        if (!window.loginAccount) {
          router.push('/project/create')
        }
      }, 2000)
    }
    
  }, [account])

  const width = 1900
  const height = 800
  const margin = defaultMargin
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const [showMiniMap, setShowMiniMap] = useState<boolean>(true);

  const generator: GenPhyllotaxisFunction = genPhyllotaxis({ radius: 10, width, height });
  const phyllotaxis: PhyllotaxisPoint[] = points.map((d, i) => generator(i));

  useEffect(() => {
    console.log(nodeList)
    if (nodeList.length > 0) {
      const buildTree = (nodeList: any[]) =>  {
          let treeMap: any = {};
          let tree: any = [];
          nodeList.forEach((item: any) => {
              treeMap[item.id] = {...item, name: item.id, children: []};
              if (item.pid === '0') {
                  tree.push(treeMap[item.id]);
              } else if (treeMap[item.pid]) {
                  treeMap[item.pid].children.push(treeMap[item.id]);
              }
          });
          return tree;
      }

      console.log(buildTree(nodeList))

    }
  }, [nodeList])

  const dataList = useMemo(() => {
    if (nodeList.length > 0) {
      const buildTree = (nodeList: any[]) =>  {
          let treeMap: any = {};
          let tree: any = [];
          nodeList.forEach((item: any) => {
            let _index = item.index;
            let _amount = 0;
            while(_index > 0) {
              _amount += Math.pow(0.5, _index)
              _index--;
            }
            treeMap[item.id] = {...item, name: item.id, income: _amount.toFixed(4), children: []};
            if (item.pid === '0') {
                tree.push(treeMap[item.id]);
            } else if (treeMap[item.pid]) {
                treeMap[item.pid].children.push(treeMap[item.id]);
            }
          });
          return tree;
      }
      const newNodeList = buildTree(nodeList)
      return hierarchy<NodeShape>(newNodeList[0])
    }
    // @ts-ignore
    return hierarchy<NodeShape>([])
    
  }, [nodeList]);

  const handleAddNode2 = useCallback(async (node: HierarchyPointNode<NodeShape>) => {

    setAdding(true)
    const airdropId = router.query.airdropId as string
    // @ts-ignore
    const pAddress = node.data.addr || account
    const res = await handleReferTo(airdropId, pAddress)
    setAdding(false)
    if (res.status !== 0) {
      alert(res.message || 'Error')
      return
    } 
    handleInitReferNodeList(true)

  }, [handleReferTo, setAdding, router.query, account, handleInitReferNodeList])

  return (
    <>
      <Zoom<SVGSVGElement>
        width={width}
        height={height}
        scaleXMin={1 / 2}
        scaleXMax={4}
        scaleYMin={1 / 2}
        scaleYMax={4}
        initialTransformMatrix={initialTransform}
      >
        {(zoom) => (
          <div className="relative"
          >
            <svg
              width={width}
              height={height}
              style={{ cursor: zoom.isDragging ? 'grabbing' : 'grab', touchAction: 'none' }}
              ref={zoom.containerRef}
            >
              <RectClipPath id="zoom-clip" width={width} height={height} />
              <rect width={width} height={height} rx={14} fill={background} />
              <g transform={zoom.toString()}>
                <LinearGradient id="top" from={green} to={aqua} />
                <Cluster<NodeShape> root={dataList} size={[xMax, yMax]}>
                  {(cluster) => (
                    <Group top={margin.top} left={margin.left}>
                      {cluster.links().map((link, i) => (
                        <LinkVertical<HierarchyPointLink<NodeShape>, HierarchyPointNode<NodeShape>>
                          key={`cluster-link-${i}`}
                          data={link}
                          stroke={merlinsbeard}
                          strokeWidth="1"
                          strokeOpacity={0.2}
                          fill="none"
                        />
                      ))}
                      {cluster.descendants().map((node, i) => (
                        <Node key={`cluster-node-${i}`} node={node} onAddNode={handleAddNode2} />
                      ))}
                    </Group>
                  )}
                </Cluster>
              </g>
              
            </svg>
            
          </div>
        )}
      </Zoom>
      {
        adding && 
        <div className=' fixed left-0 top-0 right-0 bottom-0 flex justify-center items-center bg-[rgba(0,0,0,0.4)] z-[99999]'>
          <div className=' text-center'>
            <LoadingXUser />
            <div className=' text-white mt-5'>执行中</div>
          </div>
          
        </div>
      }
    </>
  )

  return width < 10 ? null : (
    <div className='h-[100vh] overflow-auto'>
      <svg width={width} height={height}>
        <LinearGradient id="top" from={green} to={aqua} />
        <rect width={width} height={height} rx={14} fill={background} />
        <Cluster<NodeShape> root={dataList} size={[xMax, yMax]}>
          {(cluster) => (
            <Group top={margin.top} left={margin.left}>
              {cluster.links().map((link, i) => (
                <LinkVertical<HierarchyPointLink<NodeShape>, HierarchyPointNode<NodeShape>>
                  key={`cluster-link-${i}`}
                  data={link}
                  stroke={merlinsbeard}
                  strokeWidth="1"
                  strokeOpacity={0.2}
                  fill="none"
                />
              ))}
              {cluster.descendants().map((node, i) => (
                <Node key={`cluster-node-${i}`} node={node} />
              ))}
            </Group>
          )}
        </Cluster>
      </svg>
    </div>
  );

  return (
    <>
      <Head>
        <script src="/js/logicflow.min.js" async></script>
        <link href="/js/logicflow.min.css" rel="stylesheet" />
      </Head>
      <div className=" w-screen h-screen" ref={refContainer}></div>

      <div ref={addNode} id='add-node' className=' fixed z-50 left-[10000px] bottom-0 bg-gray-200 p-5 rounded-md h-[160px]'
      >
        <div className=' border border-solid border-gray-400 p-2 py-1 cursor-pointer'
          onClick={e => {
            e.stopPropagation()
            handleAddNode()
          }}
        >Add Node</div>
      </div>
      {
        adding && 
        <div className=' fixed left-0 top-0 right-0 bottom-0 flex justify-center items-center bg-[rgba(0,0,0,0.4)] z-[99999]'>
          <div className=' text-center'>
            <LoadingXUser />
            <div className=' text-white mt-5'>执行中</div>
          </div>
          
        </div>
      }
      
    </>
  )
}

export default ReferTree