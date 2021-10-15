#!/bin/bash
#
# SPDX-License-Identifier: Apache-2.0

function _exit(){
    printf "Exiting:%s\n" "$1"
    exit -1
}

# Exit on first error, print all commands.
set -ev
set -o pipefail

# Where am I?
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

export FABRIC_CFG_PATH="${DIR}/../config"

cd "${DIR}/../test-network/"

nomFichier=`ls ../test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore`
sed -i "s/$nomFichier/Key_sk/g" ../explorer/connection-profile/test-network.json

docker kill logspout || true
./network.sh down

# remove any stopped containers
docker rm $(docker ps -aq)
