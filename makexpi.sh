#!/bin/sh

NAME=unmangleOutlookSafelinks
VERSION=1.2

ZIPFILE=${NAME}-${VERSION}.xpi

rm -f ${ZIPFILE}

(cd src && zip -r - .) > ${ZIPFILE}
