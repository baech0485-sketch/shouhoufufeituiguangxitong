export function resolveSelectedOption(options = [], value = '') {
  if (!Array.isArray(options) || options.length === 0) {
    return {
      label: '',
      value: '',
    };
  }

  return options.find((option) => option.value === value) || options[0];
}
