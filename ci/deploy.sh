#!/bin/bash -e

echo "DB 1 = ${DB_CONNECTION_STRING}"
./ci/activate_creds.sh ~/gcloud-credentials.key
./tools/deploy.py \
  --target $1 \
  --skip-confirmation \
  --project all-of-us-workbench-test \
  --account circle-deploy-account@all-of-us-workbench-test.iam.gserviceaccount.com
