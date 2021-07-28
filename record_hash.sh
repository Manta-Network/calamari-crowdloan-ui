
#!/bin/bash
json -I -f ./src/config/common.json -e "this.GIT_HASH='$(git rev-parse HEAD)'"