export function getContentContainerClassName(view) {
  const maxWidthClassName = view === 'list' ? 'max-w-[1880px]' : 'max-w-[1600px]';

  return `mx-auto w-full ${maxWidthClassName}`;
}
