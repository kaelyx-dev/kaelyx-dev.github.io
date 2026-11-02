import type { Prettify } from '@kaelyx/ts-kit'

export type FontStyle = 'title' | 'body'
export type HeaderFontSize = 'h1' | 'h2' | 'h3'
export type ParagraphFontSize = 'p1' | 'p2' | 'p3'
export type BoldParagraphFontSize = 'p1-bold' | 'p2-bold' | 'p3-bold'
export type FontSize = Prettify<HeaderFontSize | ParagraphFontSize | BoldParagraphFontSize>

export type ThemeRole = 'primary' | 'secondary' | 'tertiary' | 'accent' | 'info' | 'success' | 'warning' | 'danger'
export type ThemeRolePart = 'contrast' | 'text' | 'hover' | 'subtle' | 'border'
export type ThemeRoleColour = Prettify<ThemeRole | `${ThemeRole}-${ThemeRolePart}`>
export type ThemeBaseColour = 'background' | 'foreground'
export type ThemeSurfaceColour = 'surface' | 'surface-raised' | 'surface-sunken'
export type ThemeTextColour = 'text' | 'text-muted' | 'text-subtle'
export type ThemeBorderColour = 'border' | 'border-subtle' | 'border-strong'
export type ThemeNeutralColour = Prettify<ThemeSurfaceColour | ThemeTextColour | ThemeBorderColour>
export type ThemeColour = Prettify<ThemeBaseColour | ThemeNeutralColour | ThemeRoleColour>

export type SpaceScale = ['3xs', '2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl']
export type SpaceToken = SpaceScale[number]
type SpacePairsOf<T extends readonly string[]> = T extends readonly [infer Head extends string, ...infer Rest extends string[]]
    ? `${Head}-${Rest[number]}` | SpacePairsOf<Rest>
    : never
export type SpacePair = SpacePairsOf<SpaceScale>
export type Space = Prettify<SpaceToken | SpacePair>

export {}