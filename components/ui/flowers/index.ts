import type { ComponentType } from 'react'
import { Flower01 } from './Flower01'
import { Flower02 } from './Flower02'
import { Flower03 } from './Flower03'
import { Flower04 } from './Flower04'
import { Flower05 } from './Flower05'
import { Flower06 } from './Flower06'
import { Flower07 } from './Flower07'
import { Flower08 } from './Flower08'
import { Flower09 } from './Flower09'
import { Flower10 } from './Flower10'
import { Flower11 } from './Flower11'
import { Flower12 } from './Flower12'

export interface FlowerConfig {
  id: string
  component: ComponentType
}

export const FLOWERS: FlowerConfig[] = [
  { id: 'flower-01', component: Flower01 },
  { id: 'flower-02', component: Flower02 },
  { id: 'flower-03', component: Flower03 },
  { id: 'flower-04', component: Flower04 },
  { id: 'flower-05', component: Flower05 },
  { id: 'flower-06', component: Flower06 },
  { id: 'flower-07', component: Flower07 },
  { id: 'flower-08', component: Flower08 },
  { id: 'flower-09', component: Flower09 },
  { id: 'flower-10', component: Flower10 },
  { id: 'flower-11', component: Flower11 },
  { id: 'flower-12', component: Flower12 },
]

export { Stem } from './Stem'
