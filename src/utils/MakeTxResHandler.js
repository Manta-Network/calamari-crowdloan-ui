import getFailedExtrinsicError from './GetFailedExtrinsicError';

export function makeTxResHandler (
  api,
  onSuccess = block => null,  // eslint-disable-line no-unused-vars
  onFailure = (block, error) => null,  // eslint-disable-line no-unused-vars
  onUpdate = message => null  // eslint-disable-line no-unused-vars
) {
  return ({ status, events }) => {
    let error;
    if (status.isInBlock || status.isFinalized) {
      error = getFailedExtrinsicError(events, api);
    }
    if (status.isInBlock && error) {
      onFailure(status.asInBlock.toString(), error);
    } else if (status.isFinalized && error) {
      onFailure(status.asFinalized.toString(), error);
    } else if (status.isFinalized) {
      console.log(status);
      onSuccess(status.asFinalized.toString());
    } else {
      onUpdate(status.type);
    }
  };
}
