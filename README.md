Título: UniFIAP Pay - Desafio Kubernetes

Descrição: Breve explicação do projeto.

Estrutura do Repositório: Explique o que há em /src, /docker e /k8s.

Como Executar:

Pré-requisitos (Docker, Kind, kubectl).

kind create cluster ...

docker build ... (ou link para a imagem no Docker Hub).

kubectl apply -f k8s/

curl http://localhost:30080 (para provar que a API está no ar).

Evidências (Seção mais importante):

Print 1: docker push para o Docker Hub.

Print 2: Saída do kubectl get all -n unifiappay (mostrando tudo "Running").

Print 3: Saída do kubectl get pvc,daemonset,cronjob -n unifiappay (mostrando os outros recursos).

Print 4: Saída do kubectl logs ... da API (mostrando funcionamento).

Print 5: Saída do kubectl describe pod ... (mostrando os limites de recursos e segurança).