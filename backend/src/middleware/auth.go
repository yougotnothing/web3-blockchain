package middleware

import (
	"errors"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func Auth(ctx *gin.Context) {
	authHeader := ctx.GetHeader("Authorization")
	if authHeader == "" {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "No token provided"})
		return
	}

	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header format must be Bearer {token}"})
		return
	}

	tokenString := parts[1]
	secretKey := os.Getenv("SECRET")

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}

		fmt.Println(token.Claims.(jwt.MapClaims)["id"].(string))

		return []byte(secretKey), nil
	})

	if err != nil || !token.Valid {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "middleware err: " + err.Error()})
	}

	ctx.Next()
}
