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
  color: readonly [number, number, number]
}

export const FLOWERS: FlowerConfig[] = [
  { id: 'flower-01', component: Flower01, color: [0,   60,  239] }, // #003CEF
  { id: 'flower-02', component: Flower02, color: [0,   80,  122] }, // #00507A
  { id: 'flower-03', component: Flower03, color: [102, 67,  255] }, // #6643FF
  { id: 'flower-04', component: Flower04, color: [0,   178, 170] }, // #00B2AA
  { id: 'flower-05', component: Flower05, color: [0,   179, 170] }, // #00B3AA
  { id: 'flower-06', component: Flower06, color: [150, 39,  117] }, // #962775
  { id: 'flower-07', component: Flower07, color: [224, 79,  105] }, // #E04F69
  { id: 'flower-08', component: Flower08, color: [130, 215, 44]  }, // #82D72C
  { id: 'flower-09', component: Flower09, color: [249, 117, 22]  }, // #F97516
  { id: 'flower-10', component: Flower10, color: [255, 189, 36]  }, // #FFBD24
  { id: 'flower-11', component: Flower11, color: [71,  153, 218] }, // #4799DA
  { id: 'flower-12', component: Flower12, color: [148, 85,  195] }, // #9455C3
]

export { Stem } from './Stem'
