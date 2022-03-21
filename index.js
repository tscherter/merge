export const INVALID_PATCH_TYPE = 'invalid patch type';

export default function merge(doc, patch, opts) {
  opts = {
    freeze: true,
    cleanup: true,
    ...opts
  }
  if (patch == null) return null
  const patchType = typeof patch
  if (['number', 'string', 'boolean'].includes(patchType)) return patch
  if (patchType == 'function') return merge(doc, patch(doc))
  if (patchType == 'object') {
    let target;
    if (Array.isArray(patch)) {
      target = []
      for (const key in doc) {
        if (+key == key) target[key] = doc[key]
      }
    } else {
      target = {...doc}
    }
    for (const key in patch) { // populate target with changes
      const value = merge(target[key], patch[key], opts);
      if (value == null) { delete target[key] } else target[key] = value
    }
    if (opts.cleanup && !Object.keys(target).length) return null
    if (opts.freeze) Object.freeze(target)
    return target
  }
 
  throw INVALID_PATCH_TYPE
}
