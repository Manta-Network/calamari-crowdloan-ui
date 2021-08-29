import React from 'react';
import config from 'config';

export default function VersionTag() {

  return (
    <div style={{color: 'darkgray', float: 'right'}}>Version: {config.GIT_HASH.slice(0, 4)}</div>
  );
}
