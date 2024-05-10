import dynamic from 'next/dynamic';
import React, { useCallback, useState } from "react";
import { ItemBox, ItemTitle } from "./styleds";

import '@uiw/react-markdown-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const MarkdownEditor = dynamic(
  () => import("@uiw/react-markdown-editor").then((mod) => mod.default),
  { ssr: false }
);


const Content = () => {
  const [value, setValue] = useState("**Hello world!!!**");
  
  return (
    <ItemBox style={{height: 'auto', width: 1128, marginTop: 25}}>
      <div className='text-[16px] font-fsemibold text-[rgba(0,0,0,1)] '>Content</div>
      <div className="">
        <MarkdownEditor 
          height='200px'
          value="Hello Markdown!" 
        
        />
      </div>
    </ItemBox>
  )
}

export default Content