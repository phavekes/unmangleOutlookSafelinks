#!/bin/sh

NAME=unmangleOutlookSafelinks
VERSION=2.0.2
rm -Rf */*~

ZIPFILE=${NAME}-${VERSION}.xpi

rm -f ${ZIPFILE}

(cd src && zip -r - .) > ${ZIPFILE}
