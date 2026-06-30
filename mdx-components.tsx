import type { MDXComponents } from "mdx/types"

function slugify(text: unknown): string {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children, ...props }) => {
      const id = slugify(children)
      return (
        <h1
          id={id}
          className="text-2xl font-medium leading-[1.2] text-primary mt-16 mb-5 first:mt-0 scroll-mt-16"
          {...props}
        >
          {children}
        </h1>
      )
    },
    h2: ({ children, ...props }) => (
      <h2 className="text-lg font-normal leading-[1.2] text-primary mt-10 mb-3" {...props}>
        {children}
      </h2>
    ),
    p: ({ children, ...props }) => (
      <p className="text-base font-normal leading-normal text-neutral-500 mb-5" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }) => (
      <ul className="list-disc pl-5 mb-5 flex flex-col gap-2" {...props}>
        {children}
      </ul>
    ),
    li: ({ children, ...props }) => (
      <li className="text-base leading-normal text-primary" {...props}>
        {children}
      </li>
    ),
    hr: (props) => <hr className="my-12 border-divider" {...props} />,
    ...components,
  }
}
