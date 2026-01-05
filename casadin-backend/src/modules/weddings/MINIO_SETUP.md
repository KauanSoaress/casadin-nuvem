# Configuracao do MinIO

## 1. Subir o MinIO rapidamente (local)

```bash
docker run -p 9000:9000 -p 9001:9001 \
  -e MINIO_ROOT_USER=minioadmin \
  -e MINIO_ROOT_PASSWORD=minioadmin \
  -v $(pwd)/.minio-data:/data \
  minio/minio server /data --console-address ":9001"
```

Console: http://localhost:9001 (usuario: `minioadmin`, senha: `minioadmin`).

## 2. Criar bucket

No console ou via CLI, crie o bucket que o backend usa (padrao `casadin`).

```bash
mc alias set local http://localhost:9000 minioadmin minioadmin
mc mb local/casadin
```

## 3. Variaveis de ambiente (backend)

```env
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=casadin
MINIO_REGION=us-east-1
# URL publica opcional (use quando servir objetos estaticos)
MINIO_PUBLIC_URL=http://localhost:9000
```

## 4. URLs geradas

O backend retorna URLs no formato:

```
http://<endpoint>:<port>/<bucket>/<folder>/<file>
```

Exemplo: `http://localhost:9000/casadin/weddings/couple-photos/1699999999999-abcdef12.jpg`

## 5. Permissoes (politica publica opcional)

Se quiser tornar o bucket publico para leitura via HTTP:

```bash
mc anonymous set download local/casadin
```

Caso contrario, mantenha privado e sirva via gateway/proxy ou gere URLs assinadas externamente.

## 6. Troubleshooting

- Certifique-se de que `MINIO_PUBLIC_URL` aponte para o host/porta acessivel pelo cliente.
- Erro `bucket does not exist`: garanta que o bucket foi criado ou deixe o backend cria-lo (com permissao).
- Erro de credenciais: verifique `MINIO_ACCESS_KEY` e `MINIO_SECRET_KEY`.
