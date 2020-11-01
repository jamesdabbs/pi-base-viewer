import type { Theorem as BTheorem } from '@pi-base/core'

import Id from './Id'
import Theorem from './Theorem'
import type { Data, Property } from '../types'

export default class Theorems {
  private theorems: Map<number, Theorem>

  static fromData(
    data: Pick<Data, 'properties' | 'theorems'> | undefined,
  ): Theorems {
    if (data) {
      return new Theorems(data.theorems, data.properties)
    } else {
      return new Theorems([], [])
    }
  }

  constructor(theorems: BTheorem[], properties: Property[]) {
    const ix = new Map(properties.map((p) => [p.uid, p]))

    this.theorems = new Map()
    theorems.forEach((t) => {
      const hydrated = Theorem.hydrate(t, (p) => ix.get(p))
      if (hydrated) {
        this.theorems.set(Id.toInt(t.uid), hydrated)
      }
    })
  }

  find(uid: string | number) {
    const key = typeof uid === 'string' ? Id.toInt(uid) : uid
    return this.theorems.get(key) || null
  }

  get all() {
    return Array.from(this.theorems.values())
  }
}