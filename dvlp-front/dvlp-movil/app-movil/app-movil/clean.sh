#!/bin/bash

echo "Limpiando bin y obj..."

# Elimina las carpetas bin y obj de forma recursiva (-r) y forzada (-f)
rm -rf bin
rm -rf obj

echo "Listo!"