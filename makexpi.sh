#!/bin/sh

NAME=unmangleOutlookSafelinks
VERSION=3.0.0
rm -Rf */*~

ZIPFILE=${NAME}-${VERSION}.xpi

rm -f ${ZIPFILE}

(cd src && zip -r - .) > ${ZIPFILE}
