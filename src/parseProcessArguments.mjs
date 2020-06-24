
import tryJSONParse from './tryJSONParse.mjs';

function parseProcessArgumentReduceHelper(state, arg) {
  const { values, params } = state;
  if(!arg.startsWith('--')) {
    return {
      ...state,
      values: values.concat(arg)
    };
  }

  
  const parts = arg.split('=');
  const name = parts.shift()
    .replace('--', '')

  const value = tryJSONParse(parts.join('=') || 'true')

  return {
    ...state,
    params: {
      ...params,
      [name]: value
    }
  }
}

export default function parseProcessArguments(argv, defaultParams = {}) {
  return argv.reduce(parseProcessArgumentReduceHelper, {
      values: [],
      params: { ...defaultParams }
  });
};
