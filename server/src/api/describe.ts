type MethodModule = typeof import('./MethodModule')

export function describe (methods: Record<string, MethodModule>) {
  const description = []

  for (const name in methods) {
    description.push({
      name
    })
  }

  return description
}