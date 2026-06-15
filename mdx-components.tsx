import type { MDXComponents } from "mdx/types"

function slugify(text: unknown): string {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: ({ children, ...props }) => {
      const id = slugify(children)
      return (
        <h2
          id={id}
          className="text-2xl font-bold text-primary mt-16 mb-5 first:mt-0"
          {...props}
        >
          {children}
        </h2>
      )
    },
    h3: ({ children, ...props }) => (
      <h3 className="text-lg font-semibold text-primary mt-10 mb-3" {...props}>
        {children}
      </h3>
    ),
    p: ({ children, ...props }) => (
      <p className="text-base text-secondary leading-relaxed mb-5" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }) => (
      <ul className="list-disc pl-5 mb-5 flex flex-col gap-2" {...props}>
        {children}
      </ul>
    ),
    li: ({ children, ...props }) => (
      <li className="text-base text-primary leading-relaxed" {...props}>
        {children}
      </li>
    ),
    hr: (props) => <hr className="my-12 border-divider" {...props} />,
    ...components,
  }
}
