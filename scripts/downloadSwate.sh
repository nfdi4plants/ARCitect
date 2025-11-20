#!/bin/bash

OWNER="nfdi4plants"
REPO="Swate"
TAG_NAME="1.0.6"
ASSET_NAME="SwateClient.zip"
DOWNLOAD_URL="https://github.com/${OWNER}/${REPO}/releases/download/${TAG_NAME}/${ASSET_NAME}"
DEST_DIR="./resources/swate"

mkdir -p "${DEST_DIR}"
curl -L -o "${DEST_DIR}/${ASSET_NAME}" ${DOWNLOAD_URL}
unzip -o "${DEST_DIR}/${ASSET_NAME}" -d "${DEST_DIR}"

echo "Downloaded ${ASSET_NAME} successfully!"
