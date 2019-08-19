#!/bin/sh

NAME=unmangleOutlookSafelinks
VERSION=1.50
rm -Rf */*~

ZIPFILE=${NAME}-${VERSION}.xpi

rm -f ${ZIPFILE}

(cd src && zip -r - .) > ${ZIPFILE}
