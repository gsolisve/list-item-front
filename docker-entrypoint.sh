#!/bin/sh

echo "Starting entrypoint script..."
echo "BACKEND_URL is: $BACKEND_URL"

if [ -n "$BACKEND_URL" ]; then
    echo "Configurando BACKEND_URL a: $BACKEND_URL"
    find /usr/share/nginx/html -type f -name "main*.js" -exec sh -c '
        echo "Procesando archivo: $1"
        sed -i "s|http://localhost:8080|$BACKEND_URL|g" "$1"
        echo "Contenido después del reemplazo:"
        grep -r "$BACKEND_URL" "$1"
    ' sh {} \;
fi

echo "Entrypoint script completed"
exec "$@"
