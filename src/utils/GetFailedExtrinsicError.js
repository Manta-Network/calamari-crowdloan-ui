export default function getFailedExtrinsicError (events, api) {
  console.log(events);
  let errorMessage = null;
  events.filter(({ event }) =>
    api.events.system.ExtrinsicFailed.is(event) || api.events.utility.BatchInterrupted)
    .forEach(({ event: { data: [error,] } }) => {
      if (error.isModule) {
        // for module errors, we have the section indexed, lookup
        const decoded = api.registry.findMetaError(error.asModule);
        const { documentation, method, section } = decoded;
        errorMessage = `${section}.${method}: ${documentation.join(' ')}`;
      } else {
      // Other, CannotLookup, BadOrigin, no extra info
        errorMessage = error.toString();
      }
    });
  return errorMessage;
}