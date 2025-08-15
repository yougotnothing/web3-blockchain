package user

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"web3-blockchain/backend/src/auth"
	minioClient "web3-blockchain/backend/src/minio"
	"web3-blockchain/backend/src/models"
	"web3-blockchain/backend/src/utils"

	"github.com/gin-gonic/gin"
	"github.com/gofrs/uuid"
	"github.com/golang-jwt/jwt/v5"
	"github.com/minio/minio-go/v7"
	"gorm.io/gorm"
)

func GetUser(db *gorm.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		userId := ctx.Param("id")

		var user models.User
		if err := db.First(&user).Where(&models.User{ID: uuid.FromStringOrNil(userId)}).Error; err != nil {
			ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{"id": user.ID})
	}
}

func CreateUser(db *gorm.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var user models.User

		if err := ctx.ShouldBindJSON(&user); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := db.Create(&user).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		ctx.JSON(http.StatusCreated, gin.H{"id": user.ID})
	}
}

func UpdateUser(db *gorm.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var user models.User
		id := uuid.FromStringOrNil(ctx.Param("id"))

		if err := ctx.ShouldBindJSON(&user); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := db.Model(&user).Where(models.User{ID: id}).Updates(user).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{"id": user.ID})
	}
}

func DeleteUser(db *gorm.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		userId := uuid.FromStringOrNil(ctx.Param("id"))

		if err := db.Delete(&models.User{}, models.User{ID: userId}).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{"message": "User deleted"})
	}
}

func GetSelf(db *gorm.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var user models.User

		_, err := jwt.Parse(strings.Split(ctx.GetHeader("Authorization"), " ")[1], func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Claims.(jwt.MapClaims); ok {
				if err := db.First(&user).Where(&models.User{ID: uuid.FromStringOrNil(token.Claims.(jwt.MapClaims)["id"].(string))}).Error; err != nil {
					ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
				}

				return []byte(os.Getenv("SECRET")), nil
			}

			return []byte(os.Getenv("SECRET")), nil
		})

		if err != nil {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}

		ctx.JSON(http.StatusOK, PublicUser{
			ID:           user.ID,
			Email:        user.Email,
			Transactions: user.Transactions,
			Name:         user.Name,
			AvatarURL:    user.AvatarURL,
			CreatedAt:    user.CreatedAt,
		})
	}
}

func UpdateAvatar(db *gorm.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		avatar, header, err := ctx.Request.FormFile("avatar")
		userID := auth.ExtractUserID(ctx)
		var user models.User

		if db.First(&user).Where(&models.User{ID: uuid.FromStringOrNil(userID)}).Error != nil {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
			return
		}

		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "avatar is required"})
		}

		if _, err := minioClient.S3Client().PutObject(context.Background(), utils.MinioBucketName, userID, avatar, header.Size, minio.PutObjectOptions{}); err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{"message": "Avatar updated"})
	}
}

func GetUserAvatar(db *gorm.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		userID := ctx.Param("id")
		var user models.User

		if db.First(&user).Where(&models.User{ID: uuid.FromStringOrNil(userID)}).Error != nil {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
			return
		}

		avatar, err := minioClient.S3Client().GetObject(context.Background(), utils.MinioBucketName, userID, minio.GetObjectOptions{})
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		defer avatar.Close()

		data, err := io.ReadAll(avatar)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		ctx.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", userID))
		ctx.Data(http.StatusOK, "application/octet-stream", data)
	}
}
