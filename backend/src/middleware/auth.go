package middleware

import (
	"os"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func Auth(ctx *gin.Context) {
	token := ctx.GetHeader("Authorization")

	if token == "" {
		ctx.AbortWithStatusJSON(401, gin.H{"error": "Unauthorized"})
	}

	if token, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("SECRET")), nil
	}); err != nil || !token.Valid {
		ctx.AbortWithStatusJSON(401, gin.H{"error": "Unauthorized"})
		return
	}

	ctx.Next()
}
