import LinkNext from 'next/link'

export const Link: React.FC<any> = ({ to, children }) => {
  return (
   <LinkNext href={to} >
    { children }
   </LinkNext>
  )
}