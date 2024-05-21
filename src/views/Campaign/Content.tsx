import dynamic from 'next/dynamic';
import React, { useCallback, useEffect, useState } from "react";
import { ItemBox, ItemTitle } from "./styleds";

// import '@uiw/react-markdown-editor/markdown-editor.css';
// import '@uiw/react-markdown-preview/markdown.css';

import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

// const MarkdownEditor = dynamic(
//   () => import("@uiw/react-markdown-editor").then((mod) => mod.default),
//   { ssr: false }
// );


const Content = ({
  onChange
}: {
  onChange?: (content: string) => void
}) => {
  const [value, setValue] = useState(`1. Create your artwork in one of the four categories of your choice, and mint on either Zora, Base or OP Mainnet networks.All submissions
  must be new mints on the mentioned networks and must have been minted no further back than Nov 8th 2023.
3. Pick one of the platforms below to deploy your creation on OP Mainnet by the January 8th submission deadline.
4. Enter your submission to the contest through this website.`);
  
  useEffect(() => {
    setValue(value)
    onChange && onChange(value)
  }, [value])

  return (
    <ItemBox style={{height: 'auto', width: 1128, marginTop: 25}}>
      <div className='text-[16px] font-fsemibold text-[rgba(0,0,0,1)] '>Content</div>
      <div className=" mt-5">
        {/* <MarkdownEditor 
          height='200px'
          value={`1. Create your artwork in one of the four categories of your choice, and mint on either Zora, Base or OP Mainnet networks.All submissions
   must be new mints on the mentioned networks and must have been minted no further back than Nov 8th 2023.
3. Pick one of the platforms below to deploy your creation on OP Mainnet by the January 8th submission deadline.
4. Enter your submission to the contest through this website.`} 
          onChange={setValue}
        /> */}
        <MdEditor 
          modelValue={value} 
          style={{height: 210}}
          onChange={setValue} 
          preview={false}
          footers={[]}
          toolbars={[
            'bold',
            'underline',
            'italic',
            '-',
            'strikeThrough',
            'sub',
            'sup',
            'quote',
            'unorderedList',
            'orderedList',
            'task',
            '-',
            'codeRow',
            'code',
            'link',
            'image',
            'table',
          ]}
        />
      </div>
    </ItemBox>
  )
}

export default Content