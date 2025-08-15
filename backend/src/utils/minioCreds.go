package utils

import "os"

var (
	MinioEndpoint   = os.Getenv("MINIO_ENDPOINT")
	MinioBucketName = os.Getenv("MINIO_BUCKET_NAME")
)
