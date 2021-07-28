import getFailedExtrinsicError from './GetFailedExtrinsicError';

export function makeTxResHandler (
  api,
  onSuccess = block => null,
  onFailure = (block, error) => null,
  onUpdate = message => null
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
      onSuccess(status.asFinalized.toString());
    } else {
      onUpdate(status.type);
    }
  };
}
