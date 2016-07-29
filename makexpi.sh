#!/bin/sh

NAME=unmangleOutlookSafelinks
VERSION=1.1

ZIPFILE=${NAME}-${VERSION}.xpi

rm -f ${ZIPFILE}

(cd src && zip -r - .) > ${ZIPFILE}
