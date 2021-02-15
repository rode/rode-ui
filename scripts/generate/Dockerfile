FROM node:14.15.5-stretch

WORKDIR /rode-ui/proto

RUN npm install grpc-tools@1.10.0 && \
    git clone https://github.com/rode/rode.git

COPY entrypoint.sh .

ENTRYPOINT ["/rode-ui/proto/entrypoint.sh"]
