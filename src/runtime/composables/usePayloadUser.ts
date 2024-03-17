import type { Ref } from 'vue'
import type { PayloadUser } from '../types'
import { useState } from '#imports'

export const usePayloadUser = <T = PayloadUser>(): Ref<T> =>
  useState<T>('payloadCms_user')
