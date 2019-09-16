#!/bin/sh

NAME=unmangleOutlookSafelinks
VERSION=1.52
rm -Rf */*~

ZIPFILE=${NAME}-${VERSION}.xpi

rm -f ${ZIPFILE}

(cd src && zip -r - .) > ${ZIPFILE}
