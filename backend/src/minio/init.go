package minio

import (
	"context"
	"os"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

var s3Client *minio.Client

func Init() {
	var err error
	s3Client, err = minio.New("minio:9000", &minio.Options{
		Creds:  credentials.NewStaticV4(os.Getenv("MINIO_ACCESS_KEY"), os.Getenv("MINIO_SECRET_KEY"), ""),
		Secure: false,
	})

	if err != nil {
		panic(err)
	}

	if err := s3Client.MakeBucket(context.Background(), "avatars", minio.MakeBucketOptions{}); err != nil {
		if minio.ToErrorResponse(err).Error() != "Your previous request to create the named bucket succeeded and you already own it." {
			panic(err)
		}
	}
}

func S3Client() *minio.Client {
	return s3Client
}
