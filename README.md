Projeto UniFIAP Pay - Infraestrutura Kubernetes (Kind)
Este repositório contém a solução para o desafio de implantar a infraestrutura da API de pagamentos da fintech UniFIAP Pay. O projeto abrange a containerização da aplicação, publicação de imagens, e a orquestração de workloads no Kubernetes (utilizando Kind) com foco em segurança, persistência e monitoramento.

🚀 Tecnologias Utilizadas
Docker & Docker Hub: Para construção e publicação das imagens da aplicação.

Kubernetes (Kind): Para orquestração dos containers em um cluster local.

Node.js (Express): API de exemplo utilizada para simular a aplicação.

WSL2 (Ubuntu): Ambiente de desenvolvimento e execução.

📂 Estrutura do Repositório
/fiapbank-k8s
├── /src            # Código-fonte da API de exemplo (Node.js)
├── /docker         # Dockerfile (multi-stage) e docker-compose.yml (para testes locais)
├── /k8s            # Manifestos YAML do Kubernetes (Deployments, Services, Secrets, etc.)
└── README.md       # Esta documentação
🛠️ Como Executar o Projeto
Siga os passos abaixo para construir e implantar a aplicação no cluster Kind.

Pré-requisitos
Docker Desktop (com WSL2)

Kind (Kubernetes in Docker)

kubectl

Passo 1: Construir e Publicar a Imagem Docker (Tarefa 1)
Clone este repositório.

Navegue até a raiz do projeto (fiapbank-k8s).

Construa a imagem Docker (o . no final é importante):

Bash

docker build -t robelio/fiapbank-api:v1 -f docker/dockerfile .
Faça login no Docker Hub:

Bash

docker login
Envie a imagem para o Docker Hub:

Bash

docker push robelio/fiapbank-api:v1
Passo 2: Criar o Cluster Kind
Crie o cluster Kind que servirá como nossa "PSTI Cloud" local:

Bash

kind create cluster --name fiapbank-cluster
Importante: Carregue a imagem buildada localmente para dentro do cluster Kind (isso evita problemas de ImagePullBackOff se o push para o Hub falhar ou para testes mais rápidos):

Bash

kind load docker-image robelio/fiapbank-api:v1 --name fiapbank-cluster
Passo 3: Aplicar os Manifestos Kubernetes (Tarefas 3 & 4)
Verifique o Secret: Antes de aplicar, certifique-se que o arquivo k8s/02-db-secrets.yaml contém a senha do banco em Base64. (Ex: echo -n 'senhaSuperSegura123' | base64)

Aplique todos os manifestos YAML na ordem correta (ou todos de uma vez):

Bash

kubectl apply -f k8s/
Passo 4: Testar a Aplicação
Verifique se todos os pods estão com o status Running ou Completed:

Bash

kubectl get pods -n unifiappay
Crie um túnel de comunicação (port-forward) do seu localhost para o Service da API dentro do cluster. Abra um novo terminal e deixe este comando rodando:

Bash

kubectl port-forward service/api-service 30080:80 -n unifiappay
No terminal original, acesse a API:

Bash

curl http://localhost:30080
📸 Evidências de Execução (Tarefas 1-5)
Abaixo estão as evidências de log e prints que comprovam o funcionamento de cada etapa do projeto.

Tarefa 1: Imagem Publicada no Docker Hub
Print da imagem robelio/fiapbank-api:v1 disponível no repositório do Docker Hub.

[INSERIR PRINT DO DOCKER HUB COM A IMAGEM E TAG 'v1' AQUI]

Tarefa 2: Simulação de Rede Segura com Docker Compose
Teste local (via docker-compose.yml) simulando a comunicação segura entre a API e o banco (pix-db) na rede customizada fiapbank-net.

[INSERIR PRINT DO 'docker-compose up' E DO 'curl http://localhost:3000' MOSTRANDO A API FUNCIONANDO LOCALMENTE COM DOCKER]

Tarefa 3 & 4: Status do Cluster Kubernetes (Pods, Jobs, DaemonSet)
Saída do comando kubectl get pods -n unifiappay, mostrando os Deployments da API (2 réplicas) e DB, o DaemonSet de monitoramento e os Jobs de auditoria concluídos.

Bash

vmlinux@PREDATOR3070:~/fiapbank-k8s$ kubectl get pods -n unifiappay
NAME                             READY   STATUS      RESTARTS   AGE
api-deployment-84664cc86b-5w6r4   1/1     Running     0          19m
api-deployment-84664cc86b-pxwjn   1/1     Running     0          66s
audit-job-29368990-vxtmv          0/1     Completed   0          10m
audit-job-29368995-nzhlc          0/1     Completed   0          5m28s
audit-job-29369000-fpt6w          0/1     Completed   0          28s
db-deployment-7c877d686f-nkj4j    1/1     Running     0          19m
monitoring-agent-h42qj            1/1     Running     0          19m
Tarefa 4: Evidências de Segurança e Limites de Recursos
Saída do comando kubectl describe pod <nome-do-pod-da-api> -n unifiappay, comprovando a aplicação do securityContext e dos resources (limits e requests).

[INSERIR PRINT DO 'kubectl describe pod ...' DESTACANDO AS SEÇÕES 'SECURITY CONTEXT', 'LIMITS' E 'REQUESTS']

Trecho de exemplo da saída:

...
Security Context:
  runAsNonRoot: true
  runAsUser:    1000
...
Containers:
  api:
...
    Limits:
      cpu:     500m
      memory:  128Mi
    Requests:
      cpu:     250m
      memory:  64Mi
...
Tarefa 5: Logs da Aplicação (Evidência Operacional)
Logs dos pods da API, mostrando que a aplicação iniciou com sucesso dentro do cluster.

Bash

vmlinux@PREDATOR3070:~/fiapbank-k8s$ kubectl logs -n unifiappay -l app=fiapbank-api
API da UniFIAP Pay rodando na porta 3000
API da UniFIAP Pay rodando na porta 3000
Tarefa 5: Acesso Externo via port-forward (Evidência Final)
Comprovação de que o Service da API está funcional e roteando tráfego, lendo as variáveis de ambiente (DB_HOST: db-service) injetadas pelo Kubernetes.

Bash

vmlinux@PREDATOR3070:~/fiapbank-k8s$ curl http://localhost:30080
<h1>API UniFIAP Pay (v1)</h1>
<p>Conectando ao banco...</p>
<ul>
  <li>DB_HOST: db-service</li>
  <li>DB_USER: fiap</li>
</ul>