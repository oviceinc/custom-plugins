function classNames(classArray = []) {
  return classArray
    .map(v =>
      typeof v === 'object'
        ? Object.keys(v).map(key => (v[key] ? key : null))
        : v
    )
    .flat()
    .filter(Boolean)
    .join(' ');
}
