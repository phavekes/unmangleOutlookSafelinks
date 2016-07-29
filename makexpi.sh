#!/bin/sh

NAME=unmangleOutlookSafelinks
VERSION=1.0

ZIPFILE=${NAME}-${VERSION}.xpi

rm -f ${ZIPFILE}

zip -r $ZIPFILE . \
    -x "*.git*" \
    -x $ZIPFILE \
    -x makexpi.sh
