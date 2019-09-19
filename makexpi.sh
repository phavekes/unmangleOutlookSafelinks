#!/bin/sh

NAME=unmangleOutlookSafelinks
VERSION=2.01
rm -Rf */*~

ZIPFILE=${NAME}-${VERSION}.xpi

rm -f ${ZIPFILE}

(cd src && zip -r - .) > ${ZIPFILE}
