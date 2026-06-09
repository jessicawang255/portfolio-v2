import Image from 'next/image'

export function PlantIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/images/leaf.svg"
      alt=""
      width={48}
      height={48}
      className={className}
    />
  )
}
