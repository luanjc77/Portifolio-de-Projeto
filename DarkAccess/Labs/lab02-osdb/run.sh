#!/bin/bash

# Simple sandboxed command runner for the lab web terminal
# Usage: run.sh "<command>"

CMD="$1"
# optional cwd passed as second arg (server may pass session cwd)
CWD="$2"
BASE_DIR="/lab/files"

# determine working directory
if [ -n "$CWD" ]; then
  WORKDIR="$CWD"
else
  WORKDIR="$BASE_DIR"
fi

# sempre trabalhar dentro do diretório do lab
cd "$WORKDIR" || exit 1

# Bloquear comandos perigosos: qualquer um desses caracteres/seqs causa bloqueio
if printf '%s' "$CMD" | grep -qE '[;|&<>\(\)`]'; then
  echo "Comando inválido."
  exit 1
fi

# Comando "help" personalizado
if [ "$CMD" = "help" ] || [ -z "$CMD" ]; then
  echo "======================"
  echo "Comandos disponíveis:"
  echo "======================"
  echo "ls                - Listar arquivos do diretório atual"
  echo "pwd               - Mostrar diretório atual"
  echo "cat <arquivo>     - Visualizar conteúdo de um arquivo"
  echo "head <arquivo>    - Exibir as primeiras linhas de um arquivo"
  echo "tail <arquivo>    - Exibir as últimas linhas de um arquivo"
  echo "grep <texto>      - Procurar texto em arquivos"
  echo "sqlite3           - Acessar o banco de dados SQLite (arquivo: /lab/main.sqlite)"
  echo "help              - Mostrar esta ajuda"
  echo "exit              - Encerrar sessão"
  echo "======================"
  echo "Dica: use 'cat README.txt' para começar."
  exit 0
fi

# Whitelist simples de comandos (com argumentos)
case "$CMD" in
  ls*|pwd|cat*|head*|tail*|grep*|sqlite3* )
    ;;
  exit )
    echo "Sessão encerrada. Até a próxima!"
    exit 0
    ;;
  cd* )
    echo "Comando cd é controlado pelo sistema. Use 'ls' para navegar."
    exit 0
    ;;
  * )
    echo "Comando não permitido neste ambiente. Digite 'help' para ver as opções."
    exit 1
    ;;
esac

# Executar o comando permitido em um shell seguro e limitado
exec /bin/bash -lc "$CMD"
