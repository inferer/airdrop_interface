
export const TableCell = ({
  children,
  className
}: { children: React.ReactChild, className?: string }) => {
  return (
    <div className={`flex items-center font-fnormal text-[16px] leading-[21px] text-[#000] whitespace-nowrap ${className}`}>
      { children }
    </div>
  )
}

export const TableHeadCell = ({
  children,
  className
}: { children: React.ReactElement, className?: string }) => {
  return (
    <div className={` flex items-center font-fbold text-sm leading-[21px] text-[rgba(0,0,0,0.4)] ${className}`}>
      { children }
    </div>
  )
}

export const TableRow = ({
  children,
  onClick
}: { children: React.ReactElement, className?: string, onClick?: () => void }) => {
  return (
    <div className="px-5 flex justify-between items-center h-[95px] table__row cursor-pointer"
      onClick={e => {
        e.stopPropagation()
        onClick && onClick()
      }}
    >
      { children }
    </div>
  )
}

export const TableBody = ({
  children,
}: { children: React.ReactElement, className?: string }) => {
  return (
    <div className="table__body">
      { children }
    </div>
  )
}

export const TableHead = ({
  children,
}: { children: React.ReactElement, className?: string }) => {
  return (
    <div className="flex justify-between h-[37px] items-center bg-[rgba(85,123,241,0.03)] px-5">
      { children }
    </div>
  )
}

export const Table = ({ children }: { children: React.ReactElement, className?: string }) => {
  return (
    <div className="mt-3">
      { children }
    </div>
  )
}