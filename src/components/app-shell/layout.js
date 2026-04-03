export function getAppShellClassNames() {
  return {
    root: 'h-screen overflow-hidden font-sans text-[var(--color-text-primary)]',
    shell: 'flex h-full w-full flex-col lg:flex-row',
    main: 'min-w-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6',
    surface: 'space-y-4',
  };
}
