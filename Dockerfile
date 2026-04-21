FROM mcr.microsoft.com/devcontainers/javascript-node:22-bullseye

RUN groupadd coder && \
    useradd --system --create-home --shell /bin/bash -g coder coder

RUN apt-get update && \
    apt-get install -y sudo && \
    echo "coder ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/coder && \
    chmod 0440 /etc/sudoers.d/coder

RUN chown -R coder:coder /home/coder && \
    chmod 755 /home/coder

USER coder
WORKDIR /workspaces
