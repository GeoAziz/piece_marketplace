// shim that re-exports the project's UI primitives under a single import
// When you run the official shadcn UI generator, you can replace these with
// the generated components or update this file to point to the new locations.
export { default as Button } from './components/ui/Button'
export { default as Card } from './components/ui/Card'
export { default as Badge } from './components/ui/Badge'
export { default as Avatar } from './components/ui/Avatar'

// icons are provided by lucide-react already in package.json
export { default as Icon } from 'lucide-react'
