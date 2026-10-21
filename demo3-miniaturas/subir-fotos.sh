#!/usr/bin/env bash
# Sube todas las imágenes de una carpeta al bucket de originales, en paralelo.
# Uso: ./subir-fotos.sh <nombre-del-stack> [carpeta]
# Ej.:  ./subir-fotos.sh miniaturas-demo ./fotos
set -euo pipefail

STACK="${1:?Indica el nombre del stack, ej. miniaturas-demo}"
CARPETA="${2:-./fotos}"
CUENTA="$(aws sts get-caller-identity --query Account --output text)"
ORIGINALES="${STACK}-originales-${CUENTA}"

echo "Subiendo ${CARPETA} a s3://${ORIGINALES}/ ..."
aws s3 cp "${CARPETA}" "s3://${ORIGINALES}/" --recursive \
  --exclude "*" --include "*.jpg" --include "*.jpeg" --include "*.png"

echo "Listo. Miniaturas en s3://${STACK}-miniaturas-${CUENTA}/"
