#!/bin/bash

# Script para criar nova imagem lab01-atualizado

echo "🔨 Construindo nova imagem lab01-atualizado..."
cd /home/projeto/Portifolio-de-Projeto/DarkAccess/Labs/xss-challenge

# Build da nova imagem
docker build -t lab01-atualizado ./tech-horizon

# Verificar se a imagem foi criada
if [ $? -eq 0 ]; then
    echo "✅ Imagem lab01-atualizado criada com sucesso!"
    
    # Mostrar a imagem
    echo ""
    echo "📋 Informações da imagem:"
    docker images lab01-atualizado
    
    # Verificar CSS verde
    echo ""
    echo "🎨 Verificando tema verde na imagem:"
    docker run --rm lab01-atualizado cat /usr/share/nginx/html/assets/*.css | grep -o "142 76%" | head -1
    
    if [ $? -eq 0 ]; then
        echo "✅ Tema verde confirmado!"
    else
        echo "⚠️ Tema verde não encontrado"
    fi
    
    echo ""
    echo "🧹 Limpando containers antigos do lab01..."
    docker ps -a | grep "xss-lab-user" | awk '{print $1}' | xargs -r docker rm -f
    
    echo ""
    echo "🗑️ Removendo registros órfãos do banco de dados..."
    echo "DELETE FROM labs_ativos WHERE lab_id = 'lab01';" | docker exec -i darkaccess-db psql -U pinguin -d darkaccess
    
    echo ""
    echo "✅ Pronto! Agora reinicie o backend:"
    echo "   docker restart darkaccess-backend"
    
else
    echo "❌ Erro ao criar imagem"
    exit 1
fi
