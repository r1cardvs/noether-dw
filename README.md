# Noether DW

Data Warehouse e API para consolidação e análise de precedentes, jurisprudência e doutrinas jurídicas.

Projeto da disciplina **Aprendizagem por Projetos Integrados (API)** — 2026-2, 5º semestre do curso de Banco de Dados (noturno) da Fatec São José dos Campos, em parceria com a **Xertica**.

## Desafio

**Inteligência em Decisões Jurídicas: consolidação e análise de precedentes e doutrinas para o direito contemporâneo.**

O sistema jurídico gera um volume grande de decisões, jurisprudências e doutrinas, em geral dispersas em plataformas e formatos diferentes. Profissionais e pesquisadores têm dificuldade para localizar, conectar e analisar esses dados de forma estruturada, o que atrasa teses fundamentadas e a identificação de tendências.

Este projeto implementa uma arquitetura de **Data Warehouse** capaz de integrar fontes jurídicas, transformar dados pouco estruturados em inteligência analítica e expor consultas OLAP. Os pipelines de ETL extraem, tratam e carregam os dados em um modelo dimensional (fatos de decisões/processos e dimensões como temas, tribunais, autores e períodos).

O ciclo de desenvolvimento segue práticas de DevOps: versionamento, testes automatizados, análise estática e deploy contínuo em container Node.js na AWS.

## Objetivos

- Projetar e implementar um Data Warehouse jurídico.
- Construir pipelines ETL a partir de fontes públicas (DataJud/CNJ, tribunais, diários oficiais e dados abertos).
- Modelar o ambiente em estrela e/ou floco de neve, com granularidade, fatos, medidas, dimensões e hierarquias documentadas.
- Disponibilizar consultas e relatórios OLAP.
- Automatizar testes (unidade, integração e API) e o deploy na AWS.

## Arquitetura (visão inicial)

```text
Fontes jurídicas (DataJud, TJs, diários oficiais)
        │
        ▼
   Pipelines ETL
        │
        ▼
 Data Warehouse (modelo dimensional)
        │
        ▼
 API Node.js (container)
        │
        ▼
   Consultas OLAP / dashboards
```

A API Node.js é empacotada em Docker, publicada no **Amazon ECR** e executada no **Amazon ECS (Fargate)**.

## Stack

| Camada | Tecnologia |
| --- | --- |
| API / serviços | Node.js 20 |
| Container | Docker |
| CI/CD | GitHub Actions |
| Cloud | AWS (ECR + ECS Fargate) |
| Dados | Data Warehouse dimensional (a definir na sprint de modelagem) |
| Qualidade | Testes automatizados (`node --test`) |

O desafio sugere Python/Django como referência da matriz. Neste repositório a API e o deploy em container usam **Node.js**, conforme decisão do time.

## Requisitos não funcionais

- Documentação do projeto e do modelo dimensional (conceitual, lógico, físico e dicionário de dados) **antes** da implementação de cada sprint.
- Documentação da API.
- DevOps no ciclo de vida (CI, imagem Docker e deploy na AWS).
- Análise estática de código.
- Testes de unidade e/ou integração automatizados.
- Testes funcionais de API (e UI, quando houver interface).

## Como executar localmente

Pré-requisitos: Node.js 20+ e npm.

```bash
npm install
npm test
npm start
```

A API sobe em `http://localhost:3000`.

| Método | Rota | Resposta |
| --- | --- | --- |
| `GET` | `/` ou `/info` | JSON com `sistema`, `versao`, `autor` e `dataCriacao` |
| `GET` | `/health` | `{ "status": "ok" }` |

### Container

```bash
docker build -t noether-dw .
docker run --rm -p 3000:3000 noether-dw
```

## CI/CD (GitHub Actions)

O workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) executa:

1. **CI** em pull requests e em `sprint-1`: instala dependências e roda `npm test`.
2. **Deploy** apenas em push para `sprint-1`: cria o repositório ECR se ele ainda não existir, constrói a imagem Node.js, envia ao ECR e atualiza o serviço ECS.

### Secrets do repositório

| Secret | Uso |
| --- | --- |
| `AWS_ACCESS_KEY_ID` | Credencial IAM com permissão em ECR (`CreateRepository`, `DescribeRepositories`, push de imagem) e ECS |
| `AWS_SECRET_ACCESS_KEY` | Credencial IAM |

### Variables do repositório (opcionais)

| Variable | Padrão |
| --- | --- |
| `AWS_REGION` | `us-east-1` |
| `ECR_REPOSITORY` | `noether-dw` |
| `ECS_CLUSTER` | `noether-dw-cluster` |
| `ECS_SERVICE` | `noether-dw-service` |
| `ECS_CONTAINER_NAME` | `noether-dw` |

Antes do primeiro deploy, ajuste `.aws/task-definition.json` com o `ACCOUNT_ID` da AWS, a role de execução do ECS e o log group `/ecs/noether-dw`.

## Fontes de dados

- APIs públicas de tribunais (DataJud — CNJ, Tribunais de Justiça).
- Repositórios de jurisprudência e portais de dados abertos.
- Diários oficiais (integração prevista).
- Extração de temas e conceitos jurídicos via NLP (a definir).

## Equipe

| Nome | Papel | GitHub |
| --- | --- | --- |
| | | |

Projeto **API 5º BD Noturno** — Fatec SJC / Xertica (2026-2).

Pontos focais do parceiro: Juan Hassam e Gerson Rolim (Xertica). Professores: Eduardo Sakaue (M2) e Juliana Pasquini (P2).
