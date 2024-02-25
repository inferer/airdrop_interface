import React, { useState } from "react";
import Editor from 'react-simple-code-editor';
// @ts-ignore
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css'; //Example style, you can use another


const AbiEditor = () => {
  const [code, setCode] = useState(`[
    {
      "inputs": [],
      "name": "comment",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "infererTrackManager",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_airdropId",
          "type": "uint256"
        }
      ],
      "name": "setAirdropId",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_infererTrackManager",
          "type": "address"
        }
      ],
      "name": "setInfererTrackManager",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]`);
  
  try {
    console.log(eval(code))
  } catch(err) {

  }

  return (
    <Editor 
      value={code}
      onValueChange={code => setCode(code)}
      highlight={code => highlight(code, languages.js)}
      padding={0}
      className="container__editor"
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: 12,
      }}
    />
  )
}

export default AbiEditor