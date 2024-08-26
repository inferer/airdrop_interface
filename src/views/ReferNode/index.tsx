
import { useCallback, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { useAirdropReferManager } from '../../hooks/useReferManager';
import { useRouter } from 'next/router';
import { Loading, Loading2, LoadingProject, LoadingUser, LoadingXUser } from '../../components/Loader';
import { useActiveWeb3React } from '../../hooks';

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

  const handleInitReferNodeList = useCallback(async () => {
    const dataList = await handleGetReferNodeList()
    console.log(dataList)
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
        alert('Error')
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

        if (dataList.length <= 0) {
          if (addNode.current) {
            addNode.current.style.left = (document.body.clientWidth / 2)+ 'px'
            addNode.current.style.top = (document.body.clientHeight / 2) + 'px'
          }
        } else {
          if (addNode.current) {
            addNode.current.style.left = '-10000px'
          }
        }
      }, 100)

    }
  }, [nodeList, setSelectNode])

  return (
    <>
      <Head>
        <script src="https://cdn.jsdelivr.net/npm/@logicflow/core/dist/index.min.js" async></script>
        <link href="https://cdn.jsdelivr.net/npm/@logicflow/core/lib/style/index.min.css" rel="stylesheet" />
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