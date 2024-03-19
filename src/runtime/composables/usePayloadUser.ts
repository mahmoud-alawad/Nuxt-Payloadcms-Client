import type { PayloadUser } from '../types'
import { useState } from '#imports'

export const usePayloadUser = <T = PayloadUser>(): Ref<T> =>
  useState<T>('payload_user')
