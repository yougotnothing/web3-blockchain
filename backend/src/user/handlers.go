package user

import (
	"errors"
	"net/http"
	"strings"
	"web3-blockchain/backend/src/models"

	"github.com/gin-gonic/gin"
	"github.com/gofrs/uuid"
	"github.com/golang-jwt/jwt/v5"
	"gorm.io/gorm"
)

func GetUser(db *gorm.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		userId := ctx.Param("id")

		var user models.User
		if err := db.First(&user, userId).Error; err != nil {
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
		authHeader := ctx.GetHeader("Authorization")
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header format must be Bearer {token}"})
			return
		}

		access_token := strings.TrimSpace(parts[1])
		var user models.User

		jwt.Parse(access_token, func(token *jwt.Token) (interface{}, error) {
			if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
				userID := claims["sub"].(string)
				if err := db.First(&user).Where(&models.User{ID: uuid.FromStringOrNil(userID)}).Error; err != nil {
					return nil, err
				}
				return user, nil
			}
			return nil, errors.New("invalid token")
		})
	}
}
