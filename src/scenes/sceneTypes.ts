// Shared scene contracts.
// Kept minimal here since feat/foundation has not landed yet on this branch —
// feat/meadow only needs enough of a contract to stay pluggable later.

export type SceneId =
  | 'loading'
  | 'meadow'
  | 'envelope'
  | 'letterOne'
  | 'audio'
  | 'letterTwo'
  | 'sunsetTransition'
  | 'nightMeadow'
  | 'promiseTree'
  | 'explore'

export interface SceneProps {
  active: boolean
  onComplete?: () => void
}
