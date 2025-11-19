#!/bin/bash

echo "🔨 Compilando proyecto..."
npm run build

echo ""
echo "🧪 Ejecutando casos de prueba..."
cat test-cases.txt | node dist/main.js > output.txt

echo ""
echo "📊 Resultados:"
cat output.txt

echo ""
echo "✅ Pruebas completadas"