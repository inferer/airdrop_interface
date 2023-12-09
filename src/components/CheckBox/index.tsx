import React, { useEffect, useState } from "react";
import { LazyImage2 } from "../LazyImage";

const CheckBox: React.FC<{
  onChange?: (value: boolean) => void,
  checked?: boolean
}> = ({
  onChange,
  checked
}) => {

  const [checkedInner, setChecked] = useState(false)

  useEffect(() => {
    if (checked) {
      setChecked(checked)
    }
  }, [checked])

  return (
    <div className="relative cursor-pointer"
      onClick={e => {
        e.stopPropagation()
        setChecked(!checkedInner)
        onChange && onChange(!checkedInner)
      }}
    >
      <LazyImage2 src={checkedInner ? '/images/airdrop/checked.svg' : '/images/airdrop/check.svg'} />
    </div>
  )
}

export default CheckBox