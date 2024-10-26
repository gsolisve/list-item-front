#!/bin/sh

# Reemplazar la URL del backend en tiempo de ejecución
if [ -n "$BACKEND_URL" ]; then
    echo "Configurando BACKEND_URL a: $BACKEND_URL"
    find /usr/share/nginx/html -type f -name "main*.js" -exec sed -i "s|http://localhost:8080|$BACKEND_URL|g" {} +
fi

# Ejecutar el comando recibido (nginx en este caso)
exec "$@"
