
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { LabelText } from "./styleds";
import LazyImage from "../../components/LazyImage";
import { uploadFileToIry } from "../../state/campaign/api";
import { ICampaign, ICampaignApplyVote } from "../../state/campaign/actions";
import { getIryId, getIryPath, openId } from "../../utils/iry";
import { LoadingUpload } from "../../components/Loader";

const UploadCom0 = ({
  onChange,
  loading,
  userApply
}: {
  onChange?: (file: File, fileType?: string) => void,
  loading?: boolean,
  userApply?: ICampaignApplyVote
},
ref: React.Ref<unknown> | undefined
) => {
  const filePickerRef = useRef<null | HTMLInputElement>(null)
  const [uploadFile, setUploadFile] = useState<null | File>(null)
  const [imgPreview, setImgPreview] = useState('')
  const [fileType, setFileType] = useState('')
  const [fileName, setFileName] = useState('')

  const addImageToPost = (e: any) => {
    const file = e.target.files[0]
    var allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    var fileType = file.type;   
    setFileName(file.name)
    setFileType(fileType) 
    setUploadFile(file)
    if (allowedTypes.includes(fileType)) {
      var reader = new FileReader();
      reader.onload = function(e: any) {
        setImgPreview(e.target.result)
      };
      reader.readAsDataURL(file);
    } else {
      setImgPreview(fileType)
    }
    onChange && onChange(file, fileType.indexOf('image') > -1 ? 'image' : 'zip')

  }

  useImperativeHandle(ref, () => ({
    removeFile: (e: any) => {
      setUploadFile(null)
      if (filePickerRef.current) {
        filePickerRef.current.value = ''
      }
    },
    
  }))

  return (
    <div className="w-[147px] h-[230px]"
      
    >
      {
        !uploadFile && !imgPreview && !userApply && 
          <div className="flex items-center flex-col h-[197px] justify-center cursor-pointer "
            onClick={() => {
              filePickerRef.current?.click()
            }}
          >
            <LazyImage src="/images/campaign/upload.svg" />
        
            <div className="text-[rgba(139,165,255,1)] mt-[14px] text-center">Upload</div>
          </div>
      }
      {
        ((imgPreview && fileType.indexOf('image') > -1) || userApply) &&
        <div className="w-full h-full relative rounded group ">
          <div className="w-full h-[197px] flex justify-center items-center">
            <img src={imgPreview || (userApply && getIryPath(userApply?.arwId))} alt="" className=" max-w-[100%] max-h-[100%] rounded" />
          </div>
          {
            !loading && 
              <div className=" absolute w-full h-full left-0 top-0 bg-[rgba(255,255,255,0.5)] items-center justify-center cursor-pointer hidden group-hover:flex"
                onClick={() => {
                  filePickerRef.current?.click()
                }}
              >
                <div className="bg-[rgba(255,255,255,0.5)] w-[76px] h-[29px] flex justify-center items-center text-[rgba(123,156,242,0.80)]"

                >Change</div>
              </div>
            }
          
          <div className="text-[rgba(0,0,0,0.8)] mt-[14px] text-center">Preview</div>
        </div>
      }
      {
        (fileType.indexOf('zip') > -1) &&
        <div className="w-full h-full relative rounded group ">
          <div className="w-full h-[197px] flex justify-center items-center flex-col">
            <img src="/images/campaign/file.svg" alt="" className=" max-w-[100%] max-h-[100%]" />
            <div className=" text-center text-[#8BA5FF] text-[14px] font-fnormal mt-5">
              {fileName}
            </div>
            
          </div>
          {
            !loading && 
              <div className=" absolute w-full h-full left-0 top-0 bg-[rgba(255,255,255,0.5)] items-center justify-center cursor-pointer hidden group-hover:flex"
                onClick={() => {
                  filePickerRef.current?.click()
                }}
              >
                <div className="bg-[rgba(255,255,255,0.5)] w-[76px] h-[29px] flex justify-center items-center text-[rgba(123,156,242,0.80)]"

                >Change</div>
              </div>
            }
          
        </div>
      }
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,application/zip,application/x-zip-compressed"
        ref={filePickerRef}
        hidden
        onChange={addImageToPost}
      />
    </div>
  )
}

export const UploadCom = forwardRef(UploadCom0)

const WorkContent = ({
  campaign,
  applyId,
  onUpload,
  userApply
}: {
  campaign: ICampaign,
  applyId: number,
  onUpload?: (arwId: string, fileType?: string) => void,
  userApply?: ICampaignApplyVote
}) => {
  const [arwId, setArwId] = useState('')
  const [fileType, setFileType] = useState('')
  const [uploading, setUploading] = useState(false)

  const uploadRef = useRef<any>(null)
  const handleFileChange = useCallback(async (file, type) => {
    setUploading(true)
    const formData = new FormData();
    formData.append('file', file);
    formData.append('campaignId', campaign.campaignId)
    formData.append('applyId', String(applyId))
    const res = await uploadFileToIry(formData)
    setUploading(false)
    setUploading
    if (uploadRef.current) {
      uploadRef.current.removeFile()
    }
    if (res.id) {
      setArwId(res.id)
      setFileType(type)
      onUpload && onUpload(res.id, type)
    }
  }, [])

  useEffect(() => {
    if (userApply) {
      setArwId(getIryId(userApply.arwId))
      let _type = 'image'
      if (userApply.arwId?.indexOf('zip-') === 0) {
        _type = 'zip'
      }
      onUpload && onUpload(getIryId(userApply.arwId), _type)
    }
  }, [userApply, getIryId])

  return (
    <div className="rounded-xl border border-[rgba(85, 123, 241, 0.1)] mt-5 p-5">
      <div className="flex justify-between min-h-[319px] ">
        <div className="w-full">
          <LabelText>Work</LabelText>
          <div className="flex justify-center w-full mt-5">
            <UploadCom ref={uploadRef} onChange={handleFileChange} loading={uploading} userApply={userApply} />
          </div>
        </div>
        
        <div className="w-[528px] h-[277px] bg-[rgba(85,123,241,0.06)] rounded-xl p-5 relative shrink-0">
          {
           arwId && <LazyImage src="/images/campaign/bg2.svg" className="w-[263px] h-[111px] absolute top-[87px] left-[121px]" />
          }
          
          <div className=" relative z-10 text-[rgba(0,0,0,0.6)]">
            <div className="text-[rgba(0,0,0,0.5)] font-semibold">Summary</div>
            {
              uploading && 
              <div className="flex justify-center mt-[62px]">
                <LoadingUpload />
              </div>
            }
            {
              !arwId && !uploading &&
              <div className=" flex items-center flex-col">
                <LazyImage src="/images/campaign/empty.svg" className="mt-[21px]" />
                <div className=" font-dnormal mt-4 text-[rgba(65,65,65,0.8)]">
                  Empty
                </div>
              </div>
            }
            {
              arwId && !uploading &&
              <div>
                <div className="flex items-center text-[12px] mt-7 cursor-pointer"
                  onClick={e => {
                    e.stopPropagation()
                    openId(arwId)
                  }}
                >
                  ARWEAVE TRANSACTION
                  <LazyImage src="/images/airdrop/open.svg" className="ml-[5px]" />
                </div>
                <div className="flex items-center text-[12px] mt-2">
                  { arwId }
                </div>
                <div className="flex items-center text-[12px] mt-[25px] cursor-pointer"
                  onClick={e => {
                    e.stopPropagation()
                    openId(campaign.arwId)
                  }}
                >
                  PROTOCOL PROOF
                  <LazyImage src="/images/airdrop/open.svg" className="ml-[5px]" />
                </div>
                <div className="flex items-center text-[12px] mt-2"
                  
                >
                  {campaign.arwId}
                </div>
              </div>
            }
            
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default WorkContent