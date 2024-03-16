import type { Ref } from 'vue'
import type { PayloadCmsUser } from '../types'
import { useState } from '#imports'

export const usePayloadCmsUser = <T = PayloadCmsUser>(): Ref<T> =>
  useState<T>('payloadCms_user')
