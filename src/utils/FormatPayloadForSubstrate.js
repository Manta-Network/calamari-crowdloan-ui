import utils from '../substrate-lib/utils';

function isNumType (type) {
  return utils.paramConversion.num.some(el => type.indexOf(el) >= 0);
}

export default function formatPayloadForSubstrate (payload, opts = { emptyAsNull: true }) {
  const paramFields = new Array(payload.length).fill(true);

  // if `opts.emptyAsNull` is true, empty param value will be added to res as `null`.
  //   Otherwise, it will not be added
  const paramVal = payload.map(inputParam => {
    // To cater the js quirk that `null` is a type of `object`.
    if (typeof inputParam === 'object' && inputParam !== null && typeof inputParam.value === 'string') {
      return inputParam.value.trim();
    } else if (typeof inputParam === 'string') {
      return inputParam.trim();
    }
    return inputParam;
  });
  const params = paramFields.map((field, ind) => ({ ...field, value: paramVal[ind] || null }));

  return params.reduce((memo, { type = 'string', value }) => {
    if (value == null || value === '') return (opts.emptyAsNull ? [...memo, null] : memo);

    let converted = value;

    // Deal with a vector
    if (type.indexOf('Vec<') >= 0) {
      converted = converted.split(',').map(e => e.trim());
      converted = converted.map(single => isNumType(type)
        ? (single.indexOf('.') >= 0 ? Number.parseFloat(single) : Number.parseInt(single))
        : single
      );
      return [...memo, converted];
    }

    // Deal with a single value
    if (isNumType(type)) {
      converted = converted.indexOf('.') >= 0 ? Number.parseFloat(converted) : Number.parseInt(converted);
    }
    return [...memo, converted];
  }, []);
}
